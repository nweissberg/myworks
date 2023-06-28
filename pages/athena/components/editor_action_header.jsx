import { Button } from 'primereact/button';
import React,{useEffect, useState} from 'react';

export default function EditorActionHeader({...props}){
    // const {is_mobile} = useUtils()
    const [image, set_image] = useState(null)
    const [exit, set_exit] = useState(false)
    const actions_class = 'shadow-none text-white p-button-rounded p-button-text p-button-lg hover:bg-white-alpha-20 '
    const actions_style = {padding:"30px"}
    const tooltip_options ={position: 'bottom', mouseTrack:true, mouseTrackTop:22}
    
    return(<div className='flex p-2'>
        <div className='p-fluid overflow-hidden grid formgrid flex  gap-2 sticky top-0 left-0 w-full justify-content-center '>
            {/* <Button tooltip='Analize'
                onClick={(e)=>{props.onCallAthena('photo/analyze')}}
                tooltipOptions={tooltip_options}
                style={actions_style}
                className={actions_class+(!props.analyzing ?'bg-black-alpha-20':' bg-red-500')}
                icon='pi pi-eye'
            /> */}
            <Button tooltip='Regenerate'
                onClick={(e)=>{props.onRegenerate()}}
                tooltipOptions={tooltip_options}
                style={actions_style}
                className={actions_class+ 'bg-black-alpha-20'}
                icon='pi pi-sync'
            />
            <Button tooltip='Download'
                onClick={(e)=>{props.onDownload()}}
                tooltipOptions={tooltip_options}
                style={actions_style}
                className={actions_class+ 'bg-black-alpha-20'}
                icon='pi pi-download'
            />
            <Button tooltip='Share'
                tooltipOptions={tooltip_options}
                style={actions_style}
                className={actions_class + 'bg-black-alpha-20'}
                icon='pi pi-send'
            />
            <Button tooltip='Delete'
                tooltipOptions={tooltip_options}
                style={actions_style} className={actions_class + 'bg-black-alpha-20'}
                icon='pi pi-trash'
            />
            <Button tooltip='Exit'
                onClick={(e)=>{props.onExit(!props.exit)}}
                tooltipOptions={tooltip_options}
                style={actions_style}
                className={actions_class+(!props.exit?'bg-black-alpha-20':' bg-red-500')}
                icon='pi pi-times'
            />
        </div>
            {/* <Button onClick={(e)=>{set_image_galery([0,null])}} tooltipOptions={tooltip_options} tooltip='Exit' style={actions_style} className={actions_class} icon='pi pi-times'/> */}
    </div>)

}