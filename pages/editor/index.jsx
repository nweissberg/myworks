import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useRef, useState, useEffect } from "react";
import Imaginy from "../components/ml_imaginy";
import { useAuth } from "../api/auth";
import { blob_to_image, calculateResolution, copyToClipBoard, createId, downloadURI, extractHiddenDataFromImage, hideStringInImage, imageToData, normalize, print, shareImage, toPower, upload_image, useUtils, var_get, var_set } from "../utils";
import PinchZoom from "../../componets/wrapper_pinch_zoom"
import { useAthena } from "../athena/athena_context";
import EditorFooter from "./components/footer";
import { Button } from "primereact/button";
import { get_image } from "../athena/interface_api";
import { Messages } from 'primereact/messages';
import ModelCardDialog from "./components/model_card_dialog";
import ContextMenuWrapper from "../components/wrapper_on_context_menu";
import ImageDropWrapper from "../components/wrapper_on_drop_file";
import { api_call, api_get } from "../api/connect";
import { delete_file, get_folder } from "../api/firebase_storage";
import UserFiles from "../components/all_images";
import Swal from 'sweetalert2';
import EditorHeader from "./components/header";

function gen_new(_vision, onRequest=(vision)=>{print(vision)}) {
	var _imaginy_vision = {
		model:{user:'prompthero',code:'openjourney-v4'},
		ratio:[1,1],
		..._vision,
		seed: Date.now()
	};
	const res = _imaginy_vision.resolution<=100?toPower(_imaginy_vision.resolution): _imaginy_vision.resolution;
	let {width, height} = calculateResolution({
		width:_imaginy_vision.ratio[0], height:_imaginy_vision.ratio[1]
	},{
		width:res, height:res
	})
	onRequest(_imaginy_vision)
	Array('url', 'blob', 'image').map((k) => delete _imaginy_vision?.[k]);
	var_set('imaginy_vision', JSON.stringify(_imaginy_vision));
  
	var _request = get_image({
	  steps: _imaginy_vision.steps,
	  seed: _imaginy_vision.seed,
	  model: _imaginy_vision.model.user + '/' + _imaginy_vision.model.code,
	  inputs: normalize(_imaginy_vision.description + ', ' + _imaginy_vision.imagine),
	  negative_prompt: normalize(_imaginy_vision.forget),
	  parameters: {
		width: width,
		height: height
	  },
	  wait_for_model: true,
	  use_cache: false,
	})
	_request.promise.catch((e) => {
		console.warn(e.message);
	  });
  
	_request.promise.then(async (img_blob) => {
		return blob_to_image(img_blob, 'data').then((image_data) => {
			var_set('imaginy_view', image_data, { compressed: true });
			return img_blob;
		});
	})
  
	return _request;
}

function stringToBinaryImage(inputString, image_data, canvasId) {
	const scale = 1;
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
  
	const height = Math.floor(Math.sqrt(inputString.length * 8));
	const width = Math.ceil(Math.sqrt(inputString.length / 8)) * 8;
	canvas.width = width * scale;
	canvas.height = height * scale;

	var d = image_data.data;
	for (var i = 0; i < d.length; i += 4) {
		image_data.data[i+3] = 0
	}
	ctx.putImageData(image_data, 0, 0);

	for (let i = 0; i < inputString.length; i++) {
	  const binaryValue = inputString.charCodeAt(i).toString(2).padStart(8, '0');
	  const y = i % height;
	  const x = ((i - y) / height) * 8;
  
	  for (let bit in binaryValue) {
		let p = (y * width + x + Number(bit)) * 4 // pixel index in data array
		ctx.fillStyle =
		  binaryValue[bit] === '1'
			? `rgba(${d[p]}, ${d[p + 1]}, ${d[p + 2]}, 1)`
			: `rgba(${d[p]}, ${d[p + 1]}, ${d[p + 2]}, 0.998)`;
		ctx.fillRect((Number(bit) + x) * scale, y * scale, scale, scale);
	  }
	}
	
	var imgData = ctx.getImageData(0,0, canvas.width, canvas.height);
	var d2 = imgData.data;
	for (var i = 0; i < d2.length; i += 4) {
		// var sum = Math.ceil(Math.floor(d[i])+ Math.floor(d[i+1]) + Math.floor(d[i+2]));
		d2[i] = image_data.data[i]
		d2[i+1] = image_data.data[i+1]
		d2[i+2] = image_data.data[i+2]
		if(d2[i+3] == 0) d2[i+3] = 255
	}
	ctx.putImageData(imgData, 0, 0);
	return canvas.toDataURL();

}
  
const delete_user_file = (file, callback=()=>{}) =>{

	Swal.fire({
		title: 'Aviso',
		text: `Você tem certeza? Essa ação é permanente.`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: 'var(--green-700)',
		// cancelButtonColor: 'var(--orange-700)',
		confirmButtonText: 'Sim, deletar!',
		cancelButtonText: 'Melhor não...'
	}).then((result) => {
		// print(result)
		if (result.isConfirmed) {
			delete_file(file, 'imaginy').then(callback)
		}
	})
}
export default function Editor() {
	// Confirm the link is a sign-in with email link.
	const {brain_data} = useAthena()
	const auth = getAuth();
	const {user} = useAuth()
	const router = useRouter()
	const [model_dialog, set_model_dialog] = useState(false)
	const [imaginy_view, set_imaginy_view] = useState(null)
	// const [image_obj, set_image_obj] = useState(null)
	const [imaginy_vision, set_imaginy_vision] = useState(null)
	const {orientation} = useUtils()
	const footer_ref = useRef(null);
	const messages_ref = useRef(null);
	const [user_files, set_user_files] = useState([])
	var request = null
	function update_vision(new_vision){
		print(new_vision)
		set_imaginy_vision({...imaginy_vision, ...new_vision})
	}
	async function load_user_files(){
		return get_folder('imaginy','false')
		.then(function (userFiles) {
			print(('User files:', userFiles));
			// Do something with the user files
			set_user_files(userFiles.sort((a,b)=> parseInt(b.name.split('_')) - parseInt(a.name.split('_'))))
		})
		.catch(function (error) {
			console.error('Error:', error);
		});
	}
	useEffect(()=>{
		if(user && !router.query.doc){
			load_user_files()
		}
	},[])

	useEffect(()=>{
		if(router.query.doc == "local"){
			var_get("imaginy_vision").then((_vision_data)=>{
				let _vision = JSON.parse(_vision_data)
				print(_vision)
				
				if(_vision_data) set_imaginy_vision(_vision)
				var_get("imaginy_view",{compressed:true}).then((_view_data)=>{
					if(_view_data){
						// set_imaginy_view(_view_data)
						const img = new Image();
						
						// imageToData(_view_data).then((imageData) => {
						// 	// const encodedImage = hideStringInImage(imageData,JSON.stringify({..._vision, model:{code:_vision.model.code,user:_vision.model.user, name:_vision.model.name}}),'png');
						// 	// set_image_obj(encodedImage);
						// 	// console.log(encodedImage)
						// });
						img.src = _view_data;
						set_imaginy_view(img)
					}
				})
			})
		}else if( router.query.doc){
			
			const img = new Image();
			img.onload = () => {
				imageToData(img.src).then((imageData) => {
					// console.log(imageData);
					
					const extractedData = extractHiddenDataFromImage(imageData.data,'png')
					// console.log(extractedData);
					if(extractedData) {
						var _imaginy_vision = JSON.parse(extractedData).data
						set_imaginy_vision(_imaginy_vision);
						var_set('imaginy_vision', JSON.stringify(_imaginy_vision));
						
					}
				}).catch(e=>{
					console.warn(e.message)
				});
				set_imaginy_view(img)
			};
			
			api_call('image',{
				imageUrl:'https://storage.googleapis.com/imagyny.appspot.com/imaginy/'+router.query.doc
			}).then(data=>{
				// print(data)
				img.src = data
			})
		}
	},[router,user, user_files])
	
	useEffect(()=>{
		if(imaginy_vision && imaginy_view ){
			// console.log(imaginy_vision)
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			ctx.imageSmoothingEnabled = false
			var {code, user, name, price} = imaginy_vision.model, _imaginy_vision = {...imaginy_vision, model: {code, user, name, price}}
			var inputString = JSON.stringify(_imaginy_vision)

			const height = Math.floor(Math.sqrt(inputString.length*8));
			const width = (Math.ceil(Math.sqrt(inputString.length/8)))*8;
			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(imaginy_view, 0, 0, canvas.width, canvas.height);
			var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		
			stringToBinaryImage(inputString, imgData)
		} 
		
	},[imaginy_vision,imaginy_view])

	
	const items = [
		
		
		{
			label: 'Delete',
			icon: 'pi pi-fw pi-trash',
		},
		{
			separator: true,
		},
		{
			label: 'Export',
			icon: 'pi pi-fw pi-external-link',
		},
		
		// Rest of the menu items...
	  ];
	  
	const file_handle = (file_data)=>{
		// console.log(file_data)
		const img = new Image();
		
		imageToData(file_data).then((image_data) => {
			const extractedData = extractHiddenDataFromImage(image_data.data,'png')
			if(extractedData) {
				var _imaginy_vision = JSON.parse(extractedData).data
				set_imaginy_vision(_imaginy_vision);
				var_set('imaginy_vision', JSON.stringify(_imaginy_vision));
				
			}
			// blob_to_image(file_data, 'data').then((image_data) => {
			var_set('imaginy_view', image_data, { compressed: true })
			// })
		});
		img.src = file_data;
		set_imaginy_view(img)
	}
	const action_handle = (action)=>{
		switch (action) {
			case 'loved':
				print('loved')

				blob_to_image(imaginy_view.src, 'blob','image/png').then(image_blob => {
					// console.log(image_blob)
					var img_file = new Blob([image_blob],{type:'image/png'})
					
					if(imaginy_vision.url){
						shareImage(imaginy_vision.url, imaginy_view,'Criei com imaginy.web.app', 'Gerado via A.I.: '+imaginy_vision.model.name)
					}else{
						// console.log(imaginy_vision.blob)
						var image_info = {
							index: 1,
							isPublic: true,
							id: imaginy_vision.seed,
							blob: img_file,
							model: imaginy_vision.model,
							name: `${imaginy_vision.seed}_${createId(8)}.png`,
						}
						// print(image_info)
						messages_ref.current.show({
							closable:false,
							icon:'pi-upload-cloud',
							severity: 'info',
							summary:<h4>Salvando na nuvem...</h4>,
							life: 2000
						});
						upload_image(image_info, 'imaginy').then(url=>{
							// console.log(image_info)
							// messages_ref.current.show({
							// 	closable:false,
							// 	icon:'pi-send',
							// 	severity: 'success',
							// 	summary:<h4>Imagem salva na nuvem ⛅</h4>,
							// 	life: 2000
							// });
							Swal.fire({
                                icon: 'success',
                                title: 'Sucesso!',
                                text: 'Salvo na nuvem como ' + (image_info.isPublic?"público":"privado")
                            })
							api_get({
								route:"publiclink",
								file_path:'imaginy',
								file_name:image_info.name
							}).then(public_url=>{
								print(public_url)
								set_imaginy_vision({...imaginy_vision, url:public_url})
								router.push({pathname:'/editor',shallow:true, query:{doc:image_info.name}})
								// shareImage('https://imaginy.web.app/editor?doc='+image_info.name,'Criei com imaginy.web.app', 'Gerado via A.I.: '+imaginy_vision.model.name)
							})
						})
					}
				})
				break;
			case 'copy':
				blob_to_image(imaginy_view.src, 'blob','image/png').then(image_blob => {
					// console.log(image_blob)
					copyToClipBoard(new Blob([image_blob],{type:'image/png'}))
					messages_ref.current.show({
						closable:false,
						severity: 'success',
						summary:<h4>Copiado🖼️</h4>,
						detail:<label>Para a àrea de transferância.</label>,
						life: 4000
					});
				})
				break;
			case 'download':
				// blob_to_image(imaginy_view.src, 'blob','image/png').then(image_blob => {
				// 	downloadBlob(image_blob)
				// })
				downloadURI(imaginy_view.src,`${imaginy_vision.seed}_${createId(8)}.png`)
				break;
			case 'generate':
				if(request){
					request.cancel()
					messages_ref.current.show({
						closable:false,
						icon:'pi-picture',
						severity: 'error',
						summary:<h4>CANCELADO</h4>,
						life: 1000
					});
					// return;
					break;
				}
				messages_ref.current.show({
					closable:true,
					severity: 'info generate',
					summary:orientation == 'portrait'? <h4>Gerando... 🖼️</h4>:<h4>Nova imagem solicitada 🖼️</h4>,
					detail: ' Cancelar?',
					sticky: true,
					// id:'generate_image_request',
					// life: 5000
				});
				request = gen_new(imaginy_vision,(_imaginy_vision)=>{
					set_imaginy_vision(_imaginy_vision)
				})
				request.promise.then(img_blob=>{
					var _imaginy_vision = {...imaginy_vision}
					
					// const encodedImage = hideStringInImage(img_blob,JSON.stringify({..._imaginy_vision, model:{code:_imaginy_vision.model.code,user:_imaginy_vision.model.user, name:_imaginy_vision.model.name}}),'png');
					// console.log(encodedImage)
					
					// set_imaginy_vision(_imaginy_vision)

					if(img_blob){
						print("Generated")
						
						blob_to_image(img_blob,'image').then(image_blob_data=>{
							const img = new Image();
							imageToData(image_blob_data.src).then((imageData) => {
								// Array('url', 'blob', 'image').map((k) => delete _imaginy_vision?.[k]);
								const encodedImage = hideStringInImage(imageData,JSON.stringify({
									..._imaginy_vision,
									model:{
										code:_imaginy_vision.model.code,
										user:_imaginy_vision.model.user,
										name:_imaginy_vision.model.name
									}}),'png');
								// set_image_obj(encodedImage);
								// console.log(encodedImage)
								img.src = encodedImage;

								// console.log(encodedImage)
								// blob_to_image(img_blob,'blob').then(blob_data=>{
								// 	console.log(blob_data)
									// _imaginy_vision.blob = imageData//new Blob([blob_data],{type:'image/png'})
									// _imaginy_vision.blob = new Blob([blob_data],{type:'image/png'})
									// })									
									
								set_imaginy_vision(_imaginy_vision)
								set_imaginy_view(img)
							});
							// set_imaginy_view(image_data)
						})
						messages_ref.current.clear()
						router.push({pathname:'/editor',shallow:false, query:{doc:'local'}})
					}else{
						print("Failed")
					}
					request=null
				})
				request.promise.catch(error=>{
					request?.cancel()
					messages_ref.current.show({
						closable:true,
						severity: 'error',
						summary:<h4>Erro 😓</h4>,
						detail:<label>{error?.message}</label>,
						// life: 1000
						sticky: true
					});
					
					request=null
				})
				break;
			case 'delete':
				// console.log('delete', router.query.doc)
				delete_user_file(router.query.doc, ()=>{
					router.push({pathname:'/editor'})
					var _user_files = [...user_files]
					_user_files = _user_files.filter(f=>f.name != router.query.doc)
					set_user_files(_user_files)
				})
				break;
			default:
				break;
		}
	}
	return <>
		<ModelCardDialog
			vision={model_dialog?imaginy_vision:null}
			onHide={()=>{
				set_model_dialog(false)
			}}
			updateVision={(tags)=>{
				if(imaginy_vision) update_vision({
					imagine: normalize([...new Set([...imaginy_vision.imagine.split(','), ...tags.imagine])].join(', ')),
					forget: normalize([...new Set([...imaginy_vision.forget.split(','), ...tags.forget])].join(', '))
				} )
			}}
			// onSelect={(value)=>{
			// 	set_active_index(value)
			// }}
		/>
		<main className="flex flex-wrap overflow-hidden ">
			
			<EditorHeader
				imaginy_vision={imaginy_vision}
				load_user_files={load_user_files}
				action_handle={action_handle}
				file_handle={file_handle}
			/>
			
			{/* <ContextMenuWrapper style={{top:'4rem', position:'absolute', height:'calc(100% - 8rem)' }} menu={items}> */}
			<ImageDropWrapper className=" flex flex-wrap justify-content-center bg-contain w-auto min-w-screen h-auto overflow-hidden max-h-screen m-0 p-0 surface-ground "
				onFileDrop={(e)=>{
					file_handle(e)
					router.push({pathname:'/editor',shallow:true, query:{doc:'local'}})
				}}
			>
				{!router.query?.doc && <UserFiles
					files={user_files}
					style={{
						marginTop:orientation == 'portrait'?'4rem':"0px",
						maxHeight:orientation == 'portrait'?'calc(100% - 8rem)':'calc(100%)',
						maxWidth:orientation == 'landscape'?'calc(100% - 8rem)':'100%',
					}}
					className='overflow-scroll hide-scroll z-0 grid gap-0 grid-nogutter'
					
					openDoc={(e)=>{
						router.push({pathname:'/editor',shallow:true, query:{doc:e}})
					}}
				/>}
				{router.query?.doc && <PinchZoom
					onReset={()=>{
						if(footer_ref) footer_ref.current.reset()
					}}
					style={{
						aspectRatio:imaginy_vision?.ratio?.length != 2?'1/1':imaginy_vision.ratio[0]/imaginy_vision.ratio[1],
						objectFit:'contain',
						maxHeight:orientation == 'portrait'?'calc(100% - 8rem)':'calc(100%)',
						maxWidth:orientation == 'landscape'?'calc(100% - 8rem)':'100%',
						// top:orientation == 'portrait'?'0rem':"0px",
						// left:orientation == 'landscape'?'0rem':"0px"
					}}
					className="flex relative w-min h-min center shadow-8 align-items-center overflow-hidden  justify-content-center"
				>
					{/* <canvas alt='editor-image'
						className="select-none absolute overflow-hidden w-full h-full opacity-0 bitmap"
						id={'editor_canvas'}
					/> */}
					{<div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
						{/* <canvas className="center w-full h-full blur-2 sm:blur-2 " id={'test_canvas'}></canvas> */}
						<img alt='coded-image'
							id="steganography-image"
							className="center w-full h-full blur-2 sm:blur-2 "
							src={imaginy_view?.src}
						/>
					</div>}
					<img alt='editor-image'
						className="select-none relative overflow-hidden w-screen pointer-events-none h-max max-h-full w-auto"
						src={imaginy_view?.src}
						error='image/backgrounds/matrix-code-loop.gif'
					/>
					
				</PinchZoom>}
				
			</ImageDropWrapper>
			{/* </ContextMenuWrapper> */}
			<h3 style={{top:orientation == 'portrait'?'calc(100% - 6rem)':'calc(100% - 2rem)'}} className=" opacity-80 bg-gradient-bottom text-white absolute z-1 text-sm text-overflow-ellipsis whitespace-nowrap w-full h-3rem overflow-hidden">
				{imaginy_vision?.model?.name}
			</h3>

			<footer className={(orientation=='portrait'?'w-full h-min':'w-min h-full')+" fixed flex flex-wrap z-1 bottom-0 left-0"}>
				<EditorFooter
					ref={footer_ref}
					imaginy_vision={imaginy_vision}
					set_vision={set_imaginy_vision}
					onAction={action_handle}
					onReset={()=>{
						console.log('reset')
					
					}}
				/>
			</footer>
			
			<div style={orientation == 'portrait'?{top:'4rem '}:{top:'0px'}} className="pointer-events-auto flex absolute h-auto w-full left-0 z-0">
				<Messages ref={messages_ref}
					className={"bg-gradient-top flex flex-wrap w-full gap-2 justify-content-center p-2 "}
					onRemove={(event)=>{
						console.log(event)
						if(event.severity == 'info generate'){
							messages_ref.current.clear()
							request?.cancel()
							request=null
						}
					}}
				/>
			</div>
			
		</main>
		
	</>;
}

