import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useRef, useState, useEffect } from "react";
import Imaginy from "../components/ml_imaginy";
import { useAuth } from "../api/auth";
import { blob_to_image, calculateResolution, copyToClipBoard, createId, downloadURI, extractHiddenDataFromImage, hideStringInImage, imageToData, normalize, print, shareImage, upload_image, useUtils, var_get, var_set } from "../utils";
import PinchZoom from "../../componets/wrapper_pinch_zoom"
import { useAthena } from "../athena/athena_context";
import EditorFooter from "./components/footer";
import { Button } from "primereact/button";
import { get_image } from "../athena/interface_api";
import { Messages } from 'primereact/messages';
import ModelCardDialog from "./components/model_card_dialog";
import ContextMenuWrapper from "../components/wrapper_on_context_menu";
import ImageDropWrapper from "../components/wrapper_on_drop_file";
import { FileUpload } from 'primereact/fileupload';
import { api_get } from "../api/connect";
import { get_folder } from "../api/firebase_storage";
import UserFiles from "../components/all_images";

function gen_new(_vision) {
	var _imaginy_vision = { ..._vision, seed: Date.now() };
	const res = _imaginy_vision.resolution;
	let {width, height} = calculateResolution({
			width:_imaginy_vision.ratio[0], height:_imaginy_vision.ratio[1]
		},{
			width:res, height:res
		})
	
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
  
	_request.promise
	.then(async (img_blob) => {
		return blob_to_image(img_blob, 'data').then((image_data) => {
			var_set('imaginy_view', image_data, { compressed: true });
			return img_blob;
		});
	})
  
	return _request;
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
	const messages_ref = useRef(null);
	const uploader_ref = useRef(null);
	const [user_files, set_user_files] = useState([])
	var request = null
	
	function update_vision(new_vision){
		print(new_vision)
		set_imaginy_vision({...imaginy_vision, ...new_vision})
	}

	useEffect(()=>{
		if(user && !router.query.doc){
			get_folder('imaginy','false')
			.then(function (userFiles) {
				console.log('User files:', userFiles);
				// Do something with the user files
				set_user_files(userFiles)
			})
			.catch(function (error) {
				console.error('Error:', error);
			});
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
		}else{
			const img = new Image();
			img.onload = () => {
				// imageToData(img.src).then((imageData) => {
					const dencodedImage = extractHiddenDataFromImage(img.src, 'png');
					// set_image_obj(dencodedImage);
					console.log(dencodedImage)
				// })
				set_imaginy_view(img)
			};
			// img.crossOrigin = "Anonymous";
			img.src = 'https://storage.googleapis.com/imagyny.appspot.com/imaginy/'+router.query.doc;
		}
	},[router,user])
	// useEffect(()=>{
	// 	if(imaginy_view) imageToData(imaginy_view.src).then((imageData) => {
	// 		console.log(imageData)
	// 		// const img = new Image();
	// 		// const encodedImage = hideStringInImage(imageData,JSON.stringify({...imaginy_vision, model:{code:imaginy_vision.model.code,user:imaginy_vision.model.user}}),'png');
	// 		// set_image_obj(encodedImage);
	// 		// console.log(encodedImage)
	// 		// img.src = encodedImage;
	// 		// set_imaginy_view(img)
	// 	  });
	// },[imaginy_view])
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
		{orientation == 'landscape' && <header className="fixed flex-wrap py-2 flex h-screen w-4rem z-2 top-0 right-0 align-content-between justify-content-center surface-card">
			{router.query?.doc && <Button
				tooltipOptions={{
					position:"left",
					className:"custom-tooltip scalein animation-duration-100 animation-iteration-1 hide-on-mobile"
				}}
				tooltip={imaginy_vision?.model?.name}
				icon='pi pi-images text-white text-2xl ' className="p-button-rounded p-button-outlined border-2 p-4 bg-black-alpha-50"
				onClick={()=>{
					// set_model_dialog(true)
					router.push({pathname:'/editor',shallow:true})
				}}
			/>}
			{!router.query?.doc && <div>
				<FileUpload ref={uploader_ref}
					chooseOptions={{label: <></>, icon: 'pi pi-folder-open text-white text-xl p-0 m-0',className:'p-button-rounded p-button-outlined shadow-none border-2 p-3 m-0 bg-black-alpha-50'}}
					mode="basic"
					name="demo[]"
					accept="image/*"
					multiple={false}
					auto customUpload
					uploadHandler={(data)=>{
						file_handle(data.files[0].objectURL)
						uploader_ref.current.clear()
						router.push({pathname:'/editor',shallow:true, query:{doc:'local'}})
						
					}}
				/>
			</div>}

			<div className="relative  h-12rem w-full  ">
				<CreditPointsBar vision={imaginy_vision} orientation={orientation} />
			</div>
			
			<Button
				tooltipOptions={{
					position:"left",
					className:"custom-tooltip scalein animation-duration-100 animation-iteration-1 hide-on-mobile"
				}}
				tooltip={imaginy_vision?.model?.name}
				icon='pi pi-info-circle text-white text-2xl ' className="p-button-rounded p-button-outlined border-2 p-4 bg-black-alpha-50" onClick={()=>{
				set_model_dialog(true)
			}}/>
			
				
			</header>}
			{orientation == 'portrait' && <header className="fixed flex w-screen h-4rem z-2 top-0 left-0 align-items-center justify-content-between px-2 surface-card">

				{imaginy_vision &&<div className="flex h-full w-max align-items-center justify-content-center">
					
					
					<Button icon='pi pi-info-circle text-white text-2xl ' className="p-button-rounded p-button-outlined border-2 p-4 bg-black-alpha-50" onClick={()=>{
						set_model_dialog(true)
					}}/>

					
				</div>
				}
				<div className="flex h-full w-12rem align-items-center justify-content-center">
					<CreditPointsBar vision={imaginy_vision} orientation={orientation} />
				</div>
				{router.query?.doc && <Button
					tooltipOptions={{
						position:"left",
						className:"custom-tooltip scalein animation-duration-100 animation-iteration-1 hide-on-mobile"
					}}
					tooltip={imaginy_vision?.model?.name}
					icon='pi pi-images text-white text-2xl ' className="p-button-rounded p-button-outlined border-2 p-4 bg-black-alpha-50"
					onClick={()=>{
						// set_model_dialog(true)
						router.push({pathname:'/editor',shallow:true})
					}}
				/>}
				{!router.query?.doc && <div>
					<FileUpload ref={uploader_ref}
						chooseOptions={{label: <></>, icon: 'pi pi-folder-open text-white text-xl p-0 m-0',className:'p-button-rounded p-button-outlined shadow-none border-2 p-3 m-0 bg-black-alpha-50'}}
						mode="basic"
						name="demo[]"
						accept="image/*"
						multiple={false}
						auto customUpload
						uploadHandler={(data)=>{
							file_handle(data.files[0].objectURL)
							uploader_ref.current.clear()
							router.push({pathname:'/editor',shallow:true, query:{doc:'local'}})
							
						}}
					/>
				</div>}
			</header>}
				
				{/* <ContextMenuWrapper style={{top:'4rem', position:'absolute', height:'calc(100% - 8rem)' }} menu={items}> */}
				<ImageDropWrapper className=" flex flex-wrap justify-content-center bg-contain w-auto min-w-screen h-auto overflow-hidden max-h-screen m-0 p-0 surface-ground "
					onFileDrop={(e)=>{
						file_handle(e)
						router.push({pathname:'/editor',shallow:true, query:{doc:'local'}})
					}}
				>
					{!router.query?.doc && <UserFiles style={{
						marginTop:orientation == 'portrait'?'4rem':"0px",
						maxHeight:orientation == 'portrait'?'calc(100% - 8rem)':'calc(100%)',
						maxWidth:orientation == 'landscape'?'calc(100% - 8rem)':'100%',
					}}
						className='overflow-scroll hide-scroll z-0 grid gap-0 grid-nogutter' files={user_files}
						openDoc={(e)=>{
							router.push({pathname:'/editor',shallow:true, query:{doc:e}})
						}}
					/>}
					{router.query?.doc && <PinchZoom style={{
						aspectRatio:imaginy_vision?.ratio?.length != 2?'1/1':imaginy_vision.ratio[0]/imaginy_vision.ratio[1],
						objectFit:'contain',
						maxHeight:orientation == 'portrait'?'calc(100% - 8rem)':'calc(100%)',
						maxWidth:orientation == 'landscape'?'calc(100% - 8rem)':'100%',
						// top:orientation == 'portrait'?'0rem':"0px",
						// left:orientation == 'landscape'?'0rem':"0px"
					}}
					className="flex relative w-min h-min bg-white center shadow-8 align-items-center overflow-hidden  justify-content-center" >
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
			<footer className="fixed flex flex-wrap w-full h-min z-1 bottom-0 left-0">
				<EditorFooter
					imaginy_vision={imaginy_vision}
					set_vision={set_imaginy_vision}
					onAction={async (action)=>{
						switch (action) {
							case 'loved':
								print('loved')
								// imageToData(imaginy_view.src).then((image_data) => {
								// 	// print(image_data)
								// 	const extractedData = extractHiddenDataFromImage(image_data.data,'png')
								// 	console.log(JSON.parse(extractedData).data);
								// });
								
								// set_image_obj(encodedImage);
								// console.log(encodedImage)
								// img.src = encodedImage;
								// copyToClipBoard(new Blob([imaginy_vision.blob],{type:'image/png'}))
								// blob_to_image(imaginy_view.src, 'blob','image/png').then(image_blob => {
								// 	// console.log(image_blob)
								// 	var img_file = new Blob([image_blob],{type:'image/png'})
								// 	copyToClipBoard(img_file)
									// messages_ref.current.show({
									// 	closable:false,
									// 	severity: 'success',
									// 	summary:<h4>Copiado🖼️</h4>,
									// 	detail:<label>Para a àrea de transferância.</label>,
									// 	life: 4000
									// });
									// shareImage(imaginy_vision.url, imaginy_view ,'Criei com imaginy.web.app', 'Gerado via A.I.: '+imaginy_vision.model)
								// })
								// return
								if(imaginy_vision.url){
									shareImage(imaginy_vision.url, imaginy_view,'Criei com imaginy.web.app', 'Gerado via A.I.: '+imaginy_vision.model.name)
								}else{
									
									var image_info = {
										index: 1,
										isPublic: true,
										id: imaginy_vision.seed,
										blob: imaginy_vision.blob,
										model: imaginy_vision.model,
										name: `${imaginy_vision.seed}_${createId(8)}.png`,
									}
									print(image_info)
									messages_ref.current.show({
										closable:false,
										icon:'pi-upload-cloud',
										severity: 'info',
										summary:<h4>Salvando na nuvem...</h4>,
										life: 2000
									});
									upload_image(image_info, 'imaginy').then(url=>{
										// console.log(image_info)
										messages_ref.current.show({
											closable:false,
											icon:'pi-send',
											severity: 'success',
											summary:<h4>Imagem salva na nuvem ⛅</h4>,
											life: 2000
										});
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
									// messages_ref.current.show({
									// 	closable:false,
									// 	icon:'pi-picture',
									// 	severity: 'error',
									// 	summary:<h4>CANCELADO</h4>,
									// 	life: 1000
									// });
									// return;
									break;
								}
								messages_ref.current.show({
									// closable:false,
									severity: 'info',
									summary:orientation == 'portrait'? <h4>Gerando... 🖼️</h4>:<h4>Nova imagem solicitada 🖼️</h4>,
									detail: ' Cancelar?',
									sticky: true
								});
								request = gen_new(imaginy_vision)
								request.promise.then(img_blob=>{
									var _imaginy_vision = {...imaginy_vision}
									
									// const encodedImage = hideStringInImage(img_blob,JSON.stringify({..._imaginy_vision, model:{code:_imaginy_vision.model.code,user:_imaginy_vision.model.user, name:_imaginy_vision.model.name}}),'png');
									// console.log(encodedImage)
									
									// set_imaginy_vision(_imaginy_vision)

									if(img_blob){
										print("Generated")
										blob_to_image(img_blob,'image').then(image_data=>{
											const img = new Image();
											imageToData(image_data.src).then((imageData) => {
												// set_imaginy_vision(_imaginy_vision)
												Array('url', 'blob', 'image').map((k) => delete _imaginy_vision?.[k]);
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
												// blob_to_image(encodedImage,'blob').then(blob_data=>{
												// 	console.log(blob_data)
												// _imaginy_vision.blob = imageData//new Blob([blob_data],{type:'image/png'})
												_imaginy_vision.blob = new Blob([img_blob],{type:'image/png'})
												set_imaginy_vision(_imaginy_vision)
												// })									

												set_imaginy_view(img)
											});
											// set_imaginy_view(image_data)
										})
										messages_ref.current.clear()
										router.push({pathname:'/editor',shallow:true, query:{doc:'local'}})
									}else{
										print("Failed")
									}
									request=null
								})
								request.promise.catch(error=>{
									request?.cancel()
									messages_ref.current.clear()
									messages_ref.current.show({
										closable:false,
										severity: 'error',
										summary:<h4>Erro 😓</h4>,
										detail:<label>{error?.message}</label>,
										life: 1000
									});
									
									request=null
								})
								break;
							default:
								break;
						}
					}}
				/>
			</footer>
			
			<div style={orientation == 'portrait'?{top:'4rem '}:{top:'0px'}} className="pointer-events-auto flex absolute h-auto w-full left-0 z-0">
				<Messages ref={messages_ref}
					className={"bg-gradient-top flex flex-wrap w-full gap-2 justify-content-center p-2 "}
					onRemove={()=>{
						request?.cancel()
						request=null
					}}
				/>
			</div>
			
		</main>
		
	</>;
}

function CreditPointsBar(props){
	const max_points = 55
	const points = 40
	const price = props.vision && props.vision?.model?.price ? props.vision?.model?.price:0
	var percent = (points-price)/max_points*100
	var price_percent = (price/max_points*100)
	if(props.orientation == 'portrait'){
		return <div className="flex flex-wrap w-full justify-content-center">
			<div style={{
				height:'6px',
				width:'100%',
				maxWidth:'10rem'
			}} className="flex flex-wrap bg-gray-700 border-round-xs overflow-hidden m-2">
				<div style={{maxWidth:percent+'%'}} className="flex w-full h-full bg-white" />
				<div style={{maxWidth:price_percent+'%'}} className="flex w-full h-full bg-green-500" />
			</div>
		</div>
	}else{
		return <div className="flex flex-wrap h-full w-full justify-content-center align-content-start">
			<div style={{
				height:'100%',
				width:'6px',
				maxHeight:'10rem'
			}} className="flex flex-wrap h-full bg-gray-700 border-round-xs overflow-hidden m-2 p-0 align-content-end">
				<div style={{maxHeight:price_percent+'%', top:'0px'}} className="w-full h-full bg-green-500 top-0" />
				<div style={{maxHeight:percent+'%', top:'0px'}} className="w-full h-full bg-white top-0" />
			</div>
		</div>
	}
	
}