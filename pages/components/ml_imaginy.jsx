// import styles from "../styles/Home.module.css";
import { Button } from "primereact/button";
import MatrixBackGround from './matrix_bg';
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import generate_image, { get_image } from "../athena/interface_api";
import { downloadURI, shareImage, upload_image, blob_to_image, createId, var_set, copyToClipBoard, print, var_get } from "../utils";
import { SpeedDial } from 'primereact/speeddial';
import { useAuth } from "../api/auth";
import { Tooltip } from 'primereact/tooltip';
import { useAthena } from "../athena/athena_context";
import { ProgressBar } from 'primereact/progressbar';
import FlipCard from "./flip_card";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from 'primereact/dropdown';
import { tokens } from "../athena/interface_api";
import AutoCompleteChips from "./auto-complete-chips";
import exifr from 'exifr'
import { Message } from 'primereact/message';
import { Messages } from 'primereact/messages';
import { api_get } from "../api/connect";
import SpeechToText from "../../componets/speech_to_text";
import Link from 'next/link'
import PinchZoom from "../../componets/wrapper_pinch_zoom";
import { useRouter } from "next/router";

//Photo of a beautiful dog, golden retriever on top of a mountain, with snow, during the sunset, golden hour, gazing into the distance 
//Photo of a beautiful dog, russian shepherd on top of a mountain, with snow, during the sunset, golden hour, gazing into the distance 
var jesus={
		"cfg": 7.7,
		"steps": 66,
		"model": "Protogen_x3.4_Official_Release",
		"parameters": {
				"width": 512,
				"height": 512
		},
		"description": "make a painting in davinci style of the museum of art of são paulo masp, red letter, open ceiling, highly detailed, painted by velazquez, beksinski, giger",
		"negative_prompt": "easynegative",
		"forget": "symmetrical, blury, deformed, cropped, low quality, bad anatomy, multilated, long neck, mutation, malformed limbs, username, poorly drawn face, mutated, easynegative, blurry, monochrome, missing fingers, error, missing legs, jpeg artifacts, watermark, text, too many fingers, poorly drawn hands, duplicate, extra legs, signature",
		"imagine": "modelshoot style, analog style, mdjrny-v4 style, nousr robot, mdjrny-v4, masterpiece, best quality, 8k, pastel, minimalistic style, highly detailed, depth of field, sharp focus, hdr, absurdres, high detail, ultra-detailed, highres, high quality, intricate details, outdoors, ultra high res, 4k, extremely detailed, realistic, photorealistic, raw photo, cinematic lighting",
		"seed": 1686753591390
}

const config_new={
	"cfg": 7.7,
	"steps": 55,
	"model": {"code":"stable-diffusion-2-1-base","user": "stabilityai"},
	"parameters": {
		"width": 1024,
		"height": 768
	},
	"description": "",
	"negative_prompt": "easynegative",
	"forget": "jpeg artifacts, watermark, text, signature",
	"imagine": "mdjrny-v4 style, mdjrny-v4, masterpiece, best quality",
	"seed": 1686753591390
}

export default function Imaginy(props) {
	// const clock = new Clock
	// var tick = 0
	const router = useRouter()
	const [flip_imgy, set_flip_imgy] = useState(null)
	const [current_user, set_current_user] = useState()
	const [edit_menu, set_edit_menu] = useState(true)
	const [imaginy_vision, set_imaginy_vision] = useState(null)
	const [generate, set_generate] = useState(false)
	const [view,set_view] = useState(props.imaginy_view?.src)
	const {brain_data} = useAthena()
	const {user} = useAuth()
	const [model, set_model] = useState()
	const [placeholder, set_placeholder] = useState(props.placeholder)
	const [request, set_request] = useState()
	const messages_ref = useRef(null);
	const [open_menu, set_open_menu] = useState(false)
	const speed_dial_ref = useRef(null);

	var image_props = {...props};
	Array('menu','auto').map( k => delete image_props?.[k] );

	function update_gen_data(value, key){
		var _imaginy_vision = {...imaginy_vision}
		_imaginy_vision[key] = value
		set_imaginy_vision(_imaginy_vision)
	}
	function build_image_data(){
		
		var _model = brain_data.image.generate[props.model && user?props.model:'stable-diffusion-2-1-base']
		_model.model = props.model
		// _model.code = _model.user +"/"+ props.model
		console.log(_model)
		print(_model)
		set_model(_model)

		if((!props.imaginy_vision && props.menu) || !imaginy_vision){
			var _imaginy_vision = {
				...config_new,
				description: props.description,
				forget:props.forget,
				...imaginy_vision
			}
			if(_model.imagine) _imaginy_vision.imagine = _model.imagine.join(', ') + ", " + props.imagine
			if(_model.forget) _imaginy_vision.negative_prompt = _model.forget.join(', ') + ", " + props.forget
			_imaginy_vision.model = _model
			
			if(props.imaginy_view != null){
				blob_to_image(props.imaginy_view.src, 'blob').then(image_data=>{
					_imaginy_vision.blob = image_data
					
					if(props.imaginy_vision != null){
						set_imaginy_vision({..._imaginy_vision,...props.imaginy_vision})
					}else{
						set_imaginy_vision(_imaginy_vision)
					}
				})
				set_view(props.imaginy_view.src)
			}
			set_imaginy_vision(_imaginy_vision)
		}else if(props.auto == true && !view){
			gen_new()
		}
	}

	async function gen_new(_imaginy_vision){
		if(!imaginy_vision?.model || generate) return
		var _imaginy_vision = {...props.imaginy_vision,...imaginy_vision, seed: Date.now()}
		console.log("gen_new",_imaginy_vision)
		set_generate(true)
		
		// _imaginy_vision = {...jesus}
		Array( 'url', 'blob', 'image' ).map( k => delete _imaginy_vision?.[k] );
		
		if(props.menu) var_set( "imaginy_vision", JSON.stringify(_imaginy_vision) )
		var _request = get_image({
			// ..._imaginy_vision,
			steps: _imaginy_vision.steps,
			seed: _imaginy_vision.seed,
			model:_imaginy_vision.model.user + "/" + _imaginy_vision.model.model,
			inputs: _imaginy_vision.description + ", " + _imaginy_vision.imagine,
			negative_prompt: _imaginy_vision.forget,
			parameters:_imaginy_vision.parameters,
			wait_for_model: true,
			use_cache: false
		})
		
		_request.promise.then(img_blob=>{
			_imaginy_vision.blob = img_blob
			blob_to_image(img_blob,'data').then(image_data=>{
				// console.log(image_data)
				props.onCreate?.(image_data, imaginy_vision)
				var_set("imaginy_view",image_data,{compressed:true})
			})
			set_imaginy_vision(_imaginy_vision)
			blob_to_image(img_blob,'image').then(new_image=>{
				// console.log(new_image)
				
				set_view(new_image.src)
				set_generate(false)
			})
		})

		_request.promise.catch((e)=>{
			console.warn(e.message)
			set_generate(false)
		})
		set_request(_request)
	}
	
	useEffect(()=>{
		if(user) set_current_user(user)
		// build_image_data()
	},[model, user])

	useEffect(()=>{
		if(brain_data) build_image_data()
	},[brain_data])
	
	useEffect(()=>{
		// gen_new({...imaginy_vision,seed: Date.now()})
		// build_image_data()
	})
	

	const _imgy_class = (generate?"blur-2":"")+" border-round-xl overflow-hidden w-auto h-full transition-all transition-duration-300"
	if(props.fullscreen) return(<div className="overflow-scroll pointer-events-auto cursor-pointer w-full h-full flex" onClick={(e)=>{props.onFullscreen?.(false)}}>
		<img
			src = {view?view:placeholder}
			className='flex expand bg-cover bg-center'
			onContextMenu={(e) => {
				e.preventDefault()
				e.stopPropagation()
			}}
			onDragStart={(e) => {
				e.preventDefault()
				e.stopPropagation()
			}}
		/>
	</div>)
	
	if(props.menu == undefined) return(<div className='flex w-full h-full pointer-events-auto'>
		<div className="relative flex w-full h-full pointer-events-none select-none">
			<img
				src = {view?view:placeholder}
				className={_imgy_class}
				{...image_props}
			/>
			<img
				src = {placeholder}
				{...image_props}
				className={_imgy_class+" absolute transition-duration-2000 "+(view?"opacity-0":"opacity-100")}
			/>
			{ generate && <ProgressBar mode="indeterminate" className="absolute flex w-full top-0 p-0 m-0" style={{ height: '6px', marginTop:"-6px"}}></ProgressBar>}
		</div>
	</div>
	)
	
	const speedDialMenuButtons = "p-button-rounded p-button-outlined p-4 border-none shadow-none bg-blur-2 bg-white-alpha-30 hover:bg-black-alpha-50 select-none"
	const speedDialButton = 'p-button-text p-button-rounded p-3 mt-5 border-none shadow-none bg-blur-2 text-white bg-black-alpha-20 hover:bg-black-alpha-50'
	const speedDialMenuTooltip = {
		// autoHide: false,
		position:"bottom",
		className:"custom-tooltip scalein animation-duration-100 animation-iteration-1 hide-on-mobile"
	}
	return (<div className="relative flex max-w-30rem w-full h-30rem pointer-events-none select-none ">
		
		<FlipCard
			auto={false}
			className='absolute'
			style={{height:"100%", width:"100%"}}
			mount={(obj)=>set_flip_imgy(obj)}
			front={<div>
				{/* <Tooltip position="bottom"
					// showDelay={500}
					className="custom-tooltip scalein animation-duration-100 animation-iteration-1 hide-on-mobile"
					target=".speeddial-left .p-speeddial-action"
				/> */}
				<div className="flex center relative h-max w-max z-6">
					{generate && <div className="pointer-events-auto flex pt-3 absolute z-3 fadein animation-duration-2000 animation-iteration-1 w-full h-full justify-content-center">
						<Button
							tooltip="CANCELAR 🚫"
							tooltipOptions={speedDialMenuTooltip}
							icon="pi pi-times text-xl"
							className={speedDialButton}
							onClick={()=>{
								request.cancel()
								set_generate(false)
								messages_ref.current.show({
									closable:false,
									icon:'pi-picture',
									severity: 'error',
									summary:<h4>CANCELADO</h4>,
									life: 1000
								});
							}}
						/>
					</div>}
					<div>
						<img
							src = {view?view:placeholder}
							className={_imgy_class }
							{...image_props}
						/>
						<img
							src = {placeholder}
							className={_imgy_class+" absolute z-1 center w-max transition-duration-3000 "+(view && !generate?"opacity-0":"opacity-100")}
						/>

					</div>
					{!view && <div className="pointer-events-auto flex pt-3 absolute z-3 fadein animation-duration-2000 animation-iteration-1 w-full h-full justify-content-center">
						<Button
							tooltip="Gerar 🖼️"
							tooltipOptions={speedDialMenuTooltip}
							icon="pi pi-sync text-xl"
							className={speedDialButton}
							onClick={()=>{
								set_view(placeholder)
								gen_new()
							}}
						/>
					</div>}

					<div className={(open_menu?' bg-black-alpha-50 bg-blur-1 pointer-events-auto':'pointer-events-none') + " transition-duration-200 absolute speeddial-imagyny flex w-full justify-content-center h-full pt-5 z-1"}>
						<SpeedDial
							ref={speed_dial_ref}
							direction="down"
							type="semi-circle"
							transitionDelay={30}
							showIcon="pi pi-bars"
							hideIcon="pi pi-times"
							visible={edit_menu}
							disabled={generate || !view}
							onShow={()=>{set_open_menu(true)}}
							onHide={()=>{set_open_menu(false)}}
							radius={90}
							// buttonTemplate={<Button icon='pi pi-bars text-xl text-white '
							// 	className={(open_menu?'bg-blur-1':'') + " bg-black-alpha-30 p-4 m-0 z-2 pointer-events-auto p-button-rounded border-3 shadow-none"}
							// 	onClick={(e)=>{
							// 		if(open_menu){
							// 			speed_dial_ref.current.hide()
							// 		}else{
							// 			speed_dial_ref.current.show()
							// 		}
							// 		set_open_menu(!open_menu)
							// 	}}
							// />}
							buttonClassName=" mt-2 flex text-white p-4 p-button-outlined p-button-rounded border-3 border-green-100"
							className='speeddial-left w-auto h-auto'
							model={[
								{
									template: <Button
										icon='pi pi-sync text-xl text-white'
										tooltip="Gerar 🖼️"
										tooltipOptions={{...speedDialMenuTooltip,position:"right"}}
										className={speedDialMenuButtons}
										onClick={() => {
											gen_new()
											if(view) set_placeholder(view)
											speed_dial_ref.current.hide()
										}}
									/>
								},{
									template: <Button
										icon='pi pi-pencil text-xl text-white'
										tooltip="Editar 🎨"
										tooltipOptions={{...speedDialMenuTooltip,position:"right"}}
										className={speedDialMenuButtons}
										onClick={() => {
											if(current_user){
												if(flip_imgy) flip_imgy.flip()
											}else{
												messages_ref.current.show({severity: 'info', summary:<h4>Ops...😓</h4>, detail: ' É preciso um e-mail para editar a imagem', sticky: true});
											}
											speed_dial_ref.current.hide()
										}}
									/>
								},{
									template: <Button
										icon='pi pi-heart text-xl text-white'
										tooltip="Xonei ❤️‍🔥"
										tooltipOptions={speedDialMenuTooltip}
										className={speedDialMenuButtons}
										onClick={() => {
											if(current_user){
												var image_info = {
													index: 1,
													isPublic: true,
													id: imaginy_vision.seed,
													blob: imaginy_vision.blob,
													model: imaginy_vision.model,
													name: `${imaginy_vision.seed}_${createId(8)}.jpg`,
												}
												print(image_info)
												upload_image(image_info, 'imaginy').then(url=>{
													api_get({
														route:"publiclink",
														file_path:'imaginy',
														file_name:image_info.name
													}).then(public_url=>{
														messages_ref.current.show({
															severity: 'success',
															summary:<h4>Gratidão ❤️‍🔥</h4>,
															detail: <div> pela curtida</div>,
															closable:false,
															life: 2000
														});
														print(public_url)
														set_imaginy_vision({...imaginy_vision, url:public_url})
														// shareImage(public_url,'Criei com imaginy.web.app', 'Gerado via A.I.: '+imaginy_vision.model)
														speed_dial_ref.current.hide()
													})
												})
											}else{
												messages_ref.current.show({
													severity: 'info',
													summary:<h4>Ops...💔</h4>,
													detail: <div>Cadastre um e-mail para curtir</div>,
													sticky: true
												});
											}
										}}
									/>
								},{
									template: <Button
										icon='pi pi-images text-xl text-white'
										tooltip="Copiar 🔗"
										tooltipOptions={speedDialMenuTooltip}
										className={speedDialMenuButtons}
										onClick={() => {
											if(current_user){
												
												copyToClipBoard(new Blob([imaginy_vision.blob],{type:'image/png'}))
											
												messages_ref.current.show({
													closable:false,
													severity: 'success',
													summary:<h4>Copiado🖼️</h4>,
													detail:<label>Para a àrea de transferância.</label>,
													life: 4000
												});
											
											}else{
												messages_ref.current.show({
													severity: 'info',
													summary:<h4>Ops...👻</h4>,
													detail: <div>Cadastre um e-mail para copiar</div>,
													sticky: true
												});
											}
										}}
									/>
								},{
									template: <Button
									icon='pi pi-send text-xl text-white'
									tooltip="Enviar 🚀"
									tooltipOptions={{...speedDialMenuTooltip,position:"left"}}
									className={speedDialMenuButtons}
									onClick={async() => {
										if(current_user){
											copyToClipBoard(new Blob([imaginy_vision.blob],{type:'image/png'}))
											
											if(imaginy_vision.url){
												shareImage(imaginy_vision.url,'Criei com imaginy.web.app', 'Gerado via A.I.: '+imaginy_vision.model)
											}else{
												var image_info = {
													index: 1,
													isPublic: true,
													id: imaginy_vision.seed,
													blob: imaginy_vision.blob,
													model: imaginy_vision.model,
													name: `${imaginy_vision.seed}_${createId(8)}.jpg`,
												}
												print(image_info)
												
												await upload_image(image_info, 'imaginy').then(url=>{
													api_get({
														route:"publiclink",
														file_path:'imaginy',
														file_name:image_info.name
													}).then(public_url=>{
														print(public_url)
														set_imaginy_vision({...imaginy_vision, url:public_url})
														shareImage(public_url,'Criei com imaginy.web.app', 'Gerado via A.I.: '+imaginy_vision.model)
													})
												})
											}
										}else{
											messages_ref.current.show({
												severity: 'info',
												summary:<h4>Ops...💥</h4>,
												detail: <div>Crie uma conta para compartilhar</div>,
												sticky: true,
											});
										}
									}}
								/>},{
									template: <Button
										icon='pi pi-cloud-download text-xl text-white'
										tooltip='Salvar 💾'
										tooltipOptions={{...speedDialMenuTooltip,position:"left"}}
										className={speedDialMenuButtons}
										onClick={() => {
											if(current_user){
												downloadURI(view,`${imaginy_vision.seed}_${createId(8)}.jpg`)
											}else{
												messages_ref.current.show({
													severity: 'info',
													summary:<h4>Ops...🤐</h4>,
													detail: <div>Faça login com e-mail para baixar</div>,
													sticky: true,
												});
											}
										}}
									/>
								},
							]}
						/>
					</div>
					{/* <div className="pointer-events-auto cursor-pointer overflow-hidden" onClick={(e)=>{props.onFullscreen?.(true)}}> */}
					
					<div className=" z-1 p-5 absolute flex w-full h-full justify-content-center">
						<i className={(generate?
							"blur-1 opacity-100 pi-sync pi-spin p-4 border-3 bg-white-alpha-20 text-green-200 text-8xl center origin-center":
							"opacity-0 pi-sync text-blue-500 border-cyan-300 cursor-pointer center top-0 m-5 p-2 border-3")+
							" z-2 border-circle pointer-events-none z-0 pi hover:pi-spin absolute transition-all transition-duration-300"}
						/>

						<i className={(generate?
							" z-2 pi-sync pi-spin p-4 text-white-alpha-90 text-8xl center origin-center":
							" opacity-0 pi-eye p-2 m-1 text-white-alpha-80 text-2xl origin-center")+
							" border-circle pointer-events-none pi hover:pi-spin absolute transition-all transition-duration-300"}
						/>
					</div>
					{ user && view && !generate &&
						<div className="absolute flex bottom-0 mb-4 justify-content-center w-full z-1">
						
						<Button icon='pi pi-window-maximize text-xl text-white '
							className={"p-4 m-2 z-2 pointer-events-auto p-button-text p-button-rounded border-none shadow-none"}
							tooltip="Abrir no editor 🎛️"
							tooltipOptions={{...speedDialMenuTooltip, position:"top"}}
							onClick={(e)=>{
								router.push({pathname:'/editor',shallow:false, query:{doc:"local"}})
							}}
						/>
					</div>}
				</div>
			</div>}
			
			back={<div className="p-3 pointer-events-auto bg-black-alpha-50 z-0 flex flex-wrap w-full h-full align-content-start gap-2 overflow-scroll hide-scroll pt-8">
				<div className="absolute pointer-events-none top-0 left-0 z-0 overflow-hidden">
					<img
						style={{transform:"scaleX(-1)"}}
						src = {view?view:placeholder}
						className={_imgy_class +" z-0 opacity-50 blur-3 hide-on-mobile"}
					/>
				</div>
				<div className="relative z-1 grid ">
					<h2 className="mb-2">🧠 DESCREVA</h2>
					<SpeechToText
						className="flex w-full overflow-scroll"
						value={imaginy_vision?.description}
						uid='image_description'
						onChange={(text)=>{
							// print(text)
							if(typeof(text) == 'string' && text != ''){
								update_gen_data(text,'description')
							}else if(typeof(text) == 'object'){
								update_gen_data(text.textInput,'description')
							}
						}}
					/>

					<div className="flex-grow-1 w-full mt-2">
						<h2 className="mb-2">💭 IMAGINE</h2>
						<AutoCompleteChips
							placeholder="Digite aqui ✍️"
							value={imaginy_vision?.imagine || ""}
							tokens={tokens.imagine}
							onChange={(value)=>{
								update_gen_data(value.join(', '),'imagine')
							}}
						/>
					</div>
					
					<div className="flex-grow-1 w-full mt-2">
						<h2 className="mb-2">🚫 ESQUEÇA</h2>
						<AutoCompleteChips
							placeholder="Digite aqui ✍️"
							value={imaginy_vision?.forget || ""}
							tokens={tokens.forget}
							onChange={(value)=>{
								update_gen_data(value.join(', '),'forget')
							}}
						/>
					</div>

				</div>
					<div className="absolute flex z-2 top-0 left-0 bg-blur-3 p-3 w-full justify-content-between bg-gradient-top">
						<Button
							icon="pi pi-chevron-left text-xl font-bold"
							label='VOLTAR'
							className="p-button-rounded p-button-secondary p-button-outlined font-bold bg-black-alpha-50 border-3"
							onClick={(e)=>{
								flip_imgy.flip()
							}}
						/>
						<Button
							icon="pi pi-bolt text-xl font-bold"
							iconPos="right"
							label='GERAR'
							className="p-button-rounded font-bold p-button-warning p-button-outlined bg-black-alpha-50 border-3"
							onClick={(e)=>{
								flip_imgy.flip()
								if(view) set_placeholder(view)
								gen_new()
							}}
						/>
					</div>
			</div>}
		>
		</FlipCard>
		
		<div className={" mix-blend-color-dodge opacity-90 border-round-xl overflow-hidden z-5 absolute flex w-full h-full"}>
			{generate && <MatrixBackGround className={'relative w-auto h-auto'}/>}
		</div>
		<div className="pointer-events-auto flex absolute h-auto w-full bottom-0 left-0 z-1">
			<Messages ref={messages_ref}
				className="flex flex-wrap w-full gap-2 justify-content-center"
				onRemove={()=>{props.onClose()}}
			/>
		</div>
		
	</div>);
}
