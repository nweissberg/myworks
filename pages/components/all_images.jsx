
import { useEffect } from "react"

export default function UserFiles(props){
	
	if(!props?.files) return(<div>Loading...</div>)
	
	return <div {...props}>
		{props?.files.map((file,i)=>{
			return(<div key={i} className=" cursor-pointer flex justify-content-center overflow-hidden h-min md:h-20rem max-h-full col-12 sm:col-6 md:col-4 lg:col-3 xl:col-2 "
			onClick={(e)=>{
				e.preventDefault()
				e.stopPropagation()
				props.openDoc(file.name)
				
			}}>
				<img
					loading="lazy"
					className="imaginy-galery-item bg-auto bg-no-repeat bg-center w-max max-w-screen"
					src={'https://storage.googleapis.com/imagyny.appspot.com/imaginy/'+file.name}
					alt={file.name}
				/>
			</div>)
		})}
	</div>
}