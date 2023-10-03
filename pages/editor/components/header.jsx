import { useRouter } from "next/router"
import { useUtils } from "../../utils"
import { FileUpload } from "primereact/fileupload"
import { Button } from "primereact/button"
import { useRef } from "react"

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

export default function EditorHeader(props) {
	const {orientation} = useUtils()
	const uploader_ref = useRef(null);
	const router = useRouter()
	return (<>
		{orientation == 'landscape' && <header className="fixed flex-wrap py-2 flex h-screen w-4rem z-2 top-0 right-0 align-content-between justify-content-center surface-card">
		{router.query?.doc && <Button
			tooltipOptions={{
				position:"left",
				className:"custom-tooltip scalein animation-duration-100 animation-iteration-1 hide-on-mobile"
			}}
			tooltip={"Minha Galeria 🧑‍🎨"}
			icon='pi pi-images text-white text-2xl ' className="p-button-rounded p-button-outlined border-2 p-4 bg-black-alpha-50"
			onClick={()=>{
				// set_model_dialog(true)
				props.load_user_files()
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
					props.file_handle(data.files[0].objectURL)
					uploader_ref.current.clear()
					router.push({pathname:'/editor',shallow:true, query:{doc:'local'}})
					
				}}
			/>
		</div>}

		<div className="relative  h-12rem w-full  ">
			<CreditPointsBar vision={props.imaginy_vision} orientation={orientation} />
		</div>
		
		<Button
			tooltipOptions={{
				position:"left",
				className:"custom-tooltip scalein animation-duration-100 animation-iteration-1 hide-on-mobile"
			}}
			tooltip='re-Imaginy 💡'//{props.imaginy_vision?.model?.name}
			icon='pi pi-sync text-white text-2xl ' className="p-button-rounded p-button-outlined border-2 p-4 bg-black-alpha-50"
			onClick={()=>{
				// set_model_dialog(true)
				props.action_handle('generate')
			}}
		/>
		
			
		</header>}
		{orientation == 'portrait' && <header className="fixed flex w-screen h-4rem z-2 top-0 left-0 align-items-center justify-content-between px-2 surface-card">

			{props.imaginy_vision &&<div className="flex h-full w-max align-items-center justify-content-center">
				
				
				<Button icon='pi pi-sync text-white text-2xl ' className="p-button-rounded p-button-outlined border-2 p-4 bg-black-alpha-50" onClick={()=>{
					props.action_handle('generate')
				}}/>

				
			</div>}
			<div className="flex h-full w-12rem align-items-center justify-content-center">
				<CreditPointsBar vision={props.imaginy_vision} orientation={orientation} />
			</div>
			{router.query?.doc && <Button
				tooltipOptions={{
					position:"left",
					className:"custom-tooltip scalein animation-duration-100 animation-iteration-1 hide-on-mobile"
				}}
				tooltip={"Minha Galeria 🧑‍🎨"}
				icon='pi pi-images text-white text-2xl ' className="p-button-rounded p-button-outlined border-2 p-4 bg-black-alpha-50"
				onClick={()=>{
					// set_model_dialog(true)
					props.load_user_files()
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
						props.file_handle(data.files[0].objectURL)
						uploader_ref.current.clear()
						router.push({pathname:'/editor',shallow:true, query:{doc:'local'}})
						
					}}
				/>
			</div>}
		</header>}
	</>)
}