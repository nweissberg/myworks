import { Button } from 'primereact/button';
const button_style = {
    borderWidth:"0px",
    color:"white"
}
export default function SocialBar(){
    return(
        <>
            <div style={{pointerEvents:"all"}} className='socialBar'>
                <span className="p-buttonset">
                    <Button
                    style={{backgroundColor:'#4020B9', ...button_style}} 
                    icon="pi pi-file-pdf"
                    // className="p-button-sm"
                    tooltip="Resume Nyco3D"
                    tooltipOptions={{
                        // mouseTrack:true,
                        position:"bottom"
                    }}
                    onClick={(e)=>{
                        window.open('https://docs.google.com/document/d/149-dyiv5XzywFKxfXSUXyyFKfTG2TMRd3xLqiADK-wE/edit?usp=sharing').focus();
                    }}
                    />
                    <Button
                    style={{backgroundColor:'#0a66c2', ...button_style}} 
                    icon="pi pi-linkedin"
                    // className="p-button-sm"
                    tooltip="Linkedin Nyco3D"
                    tooltipOptions={{
                        // mouseTrack:true,
                        position:"bottom"
                    }}
                    onClick={(e)=>{
                        window.open('https://www.linkedin.com/in/nyco3d/').focus();
                    }}
                    />
                    <Button
                    style={{backgroundColor:'#00a884', ...button_style}} 
                    icon="pi pi-whatsapp"
                    // className="p-button-sm"
                    tooltip="+55 (19) 9.8956-6778"
                    tooltipOptions={{
                        // mouseTrack:true,
                        position:"bottom"
                    }}
                    onClick={(e)=>{
                        window.open('https://wa.me/5519989566778').focus();
                    }}
                    
                    />
                    <Button
                    style={{backgroundColor:'#e34133', ...button_style}} 
                    icon="pi pi-envelope"
                    // className="p-button-sm"
                    tooltip="nweissberg@hotmail.com"
                    tooltipOptions={{
                        // mouseTrack:true,
                        position:"bottom"
                    }}
                    onClick={(e)=>{
                        window.open('mailto:nweissberg@hotmail.com?subject=Awesome Website').focus();
                    }}
                    />

                    <Button
                    style={{backgroundColor:'#790079', ...button_style}} 
                    icon="pi pi-github"
                    // className="p-button-sm"
                    tooltip="Github nweissberg"
                    tooltipOptions={{
                        // mouseTrack:true,
                        position:"bottom"
                    }}
                    onClick={(e)=>{
                        window.open('https://github.com/nweissberg').focus();
                    }}
                    />
                </span>
            </div>
        </>
    )
}