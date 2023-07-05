import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { print, useUtils } from "../../utils"
import ReadmeViewer from "./readme_viewer"
import { TabView, TabPanel } from 'primereact/tabview';
import { useEffect, useState } from "react";
import PinchZoom from "../../../componets/wrapper_pinch_zoom";

export default function ModelCardDialog(props){
	const {isMobile,is_dev} = useUtils()
	const [add_tags, set_add_tags] = useState({imagine:[],forget:[]})
	
	useEffect(()=>{
		if(is_dev) console.log('line',print(add_tags,'log'))
		
		props.updateVision?.(add_tags)
	},[add_tags])
	
	useEffect(()=>{
		if(!props.vision)return
		if(props.vision.imagine?.length){
			set_add_tags({...add_tags,imagine:props.vision.imagine?.split(',')})
		}
		if(props.vision.forget?.length){
			set_add_tags({...add_tags,forget:props.vision.forget?.split(',')})
		}
	
	},[])
	
	return <Dialog
		
		footer={<div className="flex w-full justify-content-evenly ">
			{props.onSelect && <><Button label="Voltar"
				className="p-button-secondary p-button-rounded mt-3 text-white hover:bg-bluegray-900 bg-black-alpha-50 border-2 font-bold"
				icon="pi pi-chevron-left font-bold"
				onClick={(e)=>{props.onHide?.(null)}}
			/>
			 <Button label="Usar Modelo"
				className="p-button-rounded mt-3 text-white hover:bg-green-900 bg-black-alpha-50 border-2 font-bold"
				icon="pi pi-check font-bold"
				iconPos="right"
				onClick={(e)=>{
					props.onSelect?.(props.vision?.model.index)
					props.onHide?.(null)
				}}
			/></>}
			{!props.onSelect &&
				<Button label="Finalizar"
				className="p-button-rounded mt-3 text-white hover:bg-green-900 bg-black-alpha-50 border-2 font-bold"
				icon="pi pi-check font-bold"
				iconPos="right"
				onClick={(e)=>{
					props.onSelect?.(props.vision?.model.index)
					props.onHide?.(null)
				}}
			/>}
		</div>}
		header={<div className={(isMobile?"flex-wrap":" ")+" flex justify-content-center align-items-center px-2"}>
		
		<Button
			className="p-button-secondary p-button-sm p-button-text p-0"
			{...isMobile?{
				icon:"pi pi-external-link",
				label:"Hugging Face 🤗"
			}:{
				iconPos:"right",
				icon:"pi pi-external-link",
				tooltip:"Ver no Hugging Face 🤗",
				tooltipOptions:{
					position:"left",
					className:"custom-tooltip scalein animation-duration-100 animation-iteration-1"
				}
			}}
			onClick={
				window.open.bind(window,'https://huggingface.co/'+props.vision?.model.user+"/"+props.vision?.model.code)
			}
		/>
		<h3 className="my-1 w-max"> {props.vision?.model.name} </h3>
	</div>
	}
		maximizable
		// maximized
		closable={true}
		modal
		closeOnEscape
		dismissableMask
		visible={props.vision?true:false}
		style={{ width: 'min(960px , calc(100vw - 20px))' }}
		onHide={() => props.onHide?.(null)}
		
		headerClassName="p-2"
	>
		
		{props.vision?.model&& <TabView>
			
            <TabPanel header="Informação">
			<div
			style={{
				width: '100%',
				height: '100%',
				whiteSpace:"wrap"
			}}
			className="overflow-hidden cursor-auto relative z-1 ai-model-card mt-2 rounded-md fadein animation-duration-300 animation-iteration-1"
			onClick={(event)=>{
				event.preventDefault()
				event.stopPropagation()
			}}
		>
			{props.vision.model.samples && props.vision.model.samples && <div className="overflow-scroll horizontal-scrollbar overflow-y-hidden">
				<div className=" flex gap-2 h-22rem min-w-max w-full justify-content-center">
					{props.vision.model.samples && props.vision.model.samples.map((url,i)=>{
						return<PinchZoom key={'zoom_img_sample_'+i} mobile>
						<div key={'img_sample_'+i}  className=" flex w-max h-20rem p-1 overflow-hidden">
							<img
								loading="lazy"
								src={url}
								className="bg-auto bg-no-repeat bg-center bg-bluegray-900 border-round h-auto w-full"
								key={'img_sample_'+i}
							/>

						
						</div>
							</PinchZoom>
					})}
				</div>
			</div>}
			<div className="grid flex gap-2 justify-content-center w-full">
				<div className="w-12 md:w-6 col-12 sm:col-4">
					{props.vision.model.info &&<>
						<label>Informação</label>
						<p>{props.vision.model.info}</p>
					</>}
					<label>Responsável</label>
					<p>{props.vision.model.from}</p>
					<label>Licença</label>
					<p>{props.vision.model.license}</p>	
					
				</div>
				{(props.vision?.model.imagine || props.vision?.model.forget) &&
					
					<div className="w-12 md:w-6 col-12 sm:col-4 h-max grid gap-2 justify-content-center md:justify-content-end align-items-start">
						<label className="col-12">Recomendações</label>
						{props.vision?.model.imagine && props.vision.model.imagine.map((tag,i)=>{
							return <div key={'tag_'+i} className="">
								<Button label={tag}
									disabled={add_tags.imagine.includes(tag)}
									className="p-button-sm p-button-sucess font-bold py-1 px-2"
									onClick={()=>{
										var _add_tags = {...add_tags}
										_add_tags.imagine.push(tag)
										set_add_tags(_add_tags)
									}}
								/>
							</div>
						})}
						{props.vision?.model.forget && props.vision.model.forget.map((tag, i)=>{
							return <div key={'tag_'+i} className="">
								<Button label={tag}
									disabled={add_tags.forget.includes(tag)}
									className="p-button-sm p-button-danger font-bold py-1 px-2"
									onClick={()=>{
										var _add_tags = {...add_tags}
										_add_tags.forget.push(tag)
										
										set_add_tags(_add_tags)
									}}
								/>
							</div>
						})}
					</div>
				}
				
			</div>

			
		</div>
			</TabPanel>
			<TabPanel header="Readme.md">
				<ReadmeViewer url={`https://huggingface.co/${props.vision.model.user}/${props.vision.model.code}/raw/main/README.md`} />
			</TabPanel>
		</TabView>}
	</Dialog>
}