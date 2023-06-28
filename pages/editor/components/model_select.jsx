import React, { useRef, useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import PrimeReact, { locale, addLocale } from 'primereact/api';
import { isDeepEqual, moneyMask, useUtils } from "../../utils";
PrimeReact.ripple = false;

export default function ModelSelect(props) {
	const {isMobile, orientation} = useUtils()
	function onSelect(value,key){
		props.onSelect?.(value,key)
	}
	// useEffect(()=>{
	// 	if(props.selected )
	// },[props])
	return <>
		<div className="flex flex-wrap justify-content-center w-full h-screen overflow-scroll hide-scroll" style={orientation=='portrait'?{maxHeight:"30vh"}:{maxHeight:"calc(100vh - 3rem)"}}>
			{props.models.map((model,index)=>
				<div key={"AI_Model_"+index} className={((props.selected?isDeepEqual(props.selected,model):false)?'sticky top-0 bottom-0 bg-gray-700 z-1 ':'')+" w-full p-2 flex justify-content-start w-full"}>
					{props.selected && isDeepEqual(props.selected,model) &&  <div className="flex whitespace-nowrap align-items-center">
						<label>{moneyMask(model.price,false)} p</label>	
					</div>}
					<Button
						className={((props.selected?isDeepEqual(props.selected,model)==false:true)?'text-white font-bold':' text-lg')+" bg-transparent w-full p-button-text shadow-none p-button-lg"}
						key={'ai_'+index}
						label={model.name}
						onClick={(e)=>{
							// props.onDialog(model)
							onSelect(model,'model')
						}}
					/>
					
					{props.selected && isDeepEqual(props.selected,model) && <div className="flex whitespace-nowrap align-items-center">
						<Button
							icon='pi pi-info-circle'
							className={" p-button-outlined border-none shadow-none p-button-rounded bg-black-alpha-30 hover:bg-bluegray-800 text-white"}
							onClick={(event)=>{
								event.preventDefault()
								event.stopPropagation()
								props.onDialog(model)
							}}
						/>
					</div>}
				
				</div>
			)}
		</div>
	</>
	return <>
		<div className="text-white">
		
			<Dropdown
				placeholder=" I.A. Model"
				optionLabel="name"
				options={props.models}
				onChange={(e)=>{ onSelect(e.value) }}
				value={props.selected_model}
				key='name'
				panelClassName="max-w-screen p-0 m-0"
				itemTemplate={(data)=>{
					return <div className="w-30rem max-w-screen m-0 p-2">
					<div className=" flex flex-grow-1 w-full justify-content-between gap-2 align-items-center">
						<h3 className={(data.selected?'text-green-100 ':'text-gray-300 ')+" p-2 white-space-nowrap overflow-hidden text-overflow-ellipsis"}>
							{data.name}
						</h3>

						<div className="flex flex-grow-0 flex-shrink-0 gap-2 align-items-center">
							<label>{moneyMask(data.price,false)} p</label>
							<Button
								icon={data.expanded?'pi pi-times':'pi pi-info-circle'}
								className={(data.expanded?'text-gray-400 border-2':'')+" p-button-outlined border-none shadow-none z-1 p-button-rounded bg-black-alpha-30 hover:bg-bluegray-800 hover:text-white"}
								onClick={(event)=>{
									event.preventDefault()
									event.stopPropagation()
									props.toggle_model(data.index)
								}}
							/>
						</div>
					</div>
					{data.expanded && <div
						style={{
							width: '100%',
							height: '100%',
							whiteSpace:"wrap"
						}}
						className="cursor-auto relative z-1 ai-model-card mt-2 surface-ground p-2 rounded-md fadein animation-duration-300 animation-iteration-1"
						onClick={(event)=>{
							event.preventDefault()
							event.stopPropagation()
						}}
					>
						<label>Responsável</label>
						<p>{data.from}</p>
						{data.info &&<>
							<label>Informação</label>
							<p>{data.info}</p>
						</>}
						<label>Licença</label>
						<p>{data.license}</p>
						<Button
							className="p-button-secondary p-button-sm absolute bottom-0 right-0 m-2 p-button-text p-button-rounded "
							{...isMo?{
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
								window.open.bind(window,'https://huggingface.co/'+data.user+"/"+data.code)
							}
						/>
					</div>}
					
				</div>
				}}
			/>
		</div>
	</>
}