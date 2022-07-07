import React from "react";
import { Card } from 'primereact/card';
import { Button } from "primereact/button";

export default class TimelineCard extends React.Component {
	constructor(props) {
		super(props);
		// console.log(props)
		// this.state = {
		// 	edit_event:null	
        // }
    }
	render(){
		return(
			
			<div style={{
				// height:"600px",
				// width:"auto",
				pointerEvents:"all",
				marginTop:"30px",
				zIndex:1,
			}}>
				<h2 style={{
					
					backgroundColor:"#000",
					borderRadius:"5px",
					padding:"3px",
					color:"gray",
					fontFamily:"neuro",
					fontSize:"14px",
					position:"absolute",
					zIndex:5,
					top:"5px"
				}}>
				{typeof(this.props.item.date) != "string"?
					new Date(this.props.item.date[0]).toLocaleDateString() + " - " + new Date(this.props.item.date[1]).toLocaleDateString()
					:
					new Date(this.props.item.date).toLocaleDateString()
				}
				</h2>
			<Card
				style={{
					// position:"absolute",
					//   width:"333px",
					backgroundColor:"#4444",
					backdropFilter: "blur(5px)",
					zIndex:4,
				}}
				title={
					<div
						style={{
							fontFamily:'mars'
						}}
					><Button
					className="p-button-text p-button-rounded mr-2"
					icon="pi pi-pencil"
					tooltip="Editar Evento"
					tooltipOptions={{
						mouseTrack:true,
						position:"left"
					}}
					onClick={(e)=>{
						this.props.timeline_event_edit(this.props.item)
						// this.setState(edit_event(e.target))
						// window.open('https://'+this.props.item.url).focus();
					}}
					/>
						{this.props.item.title}
					</div>}
				subTitle={<div style={{fontFamily:'neuro',color:"var(--matrix-secondary)"}}>{this.props.item.subtitle}</div>}
				>
				{this.props.item.image &&
					<div style={{
						width:"100%",
						height:"100%",
						// backgroundColor:"red",
						alignItems:"left",
						textAlign:"center",
						justifyContent:"center"
					}}>
						<img style={{
							cursor:"pointer",
							position:"relative",
						}} width={200} alt={this.props.item.title} src={'/image/timeline/'+this.props.item.image}
						onClick={(e)=>{
							const image_name = e.target.currentSrc.split("/").pop()
							// console.log(image_name)
							setActiveIndex(0)
							var image_array = []

							if(image_name.split('.')[0].indexOf('-') != -1){
								const image_parts = image_name.split('.')[0].split('-')
								const image_max = image_parts.pop()
								// console.log(,image_parts[0])
								for(var i = parseInt(image_max); i > 0; i--){
									var path = image_parts[0]+'-'+i +'.'+ image_name.split('.').pop()
									// console.log(path)
									image_array.unshift({"itemImageSrc": "image/timeline/"+path,"thumbnailImageSrc": "image/timeline/"+path,"alt": "Description for Image 1","title": "Title 1"})
								}
							}else{
								image_array = [{"itemImageSrc": "image/timeline/"+image_name,"thumbnailImageSrc": "image/timeline/"+image_name,"alt": "Description for Image 1","title": "Title 1"}]
							}
							// console.log(image_array)
							setImages(image_array)
							galleria.current.show()
						}}
						/>
					</div>
				}
				
				{ this.props.item.text && <p style={{fontFamily:'futura', fontSize:"22px"}}>{this.props.item.text}</p>}
					
						<div>
							{
								this.props.item.video &&
								<Button 
									label="Video"
									className="p-button-text"
									icon="pi pi-youtube"
									onClick={(e)=>{
										setOverlay(true)
										set_video_id(this.props.item.video)
									}}
								/>
							}
							{(this.props.item.url && this.props.item.url != '') &&
								<Button
									label="Abrir"
									className="p-button-text"
									icon="pi pi-link"
									tooltip={this.props.item.url}
									tooltipOptions={{
										mouseTrack:true,
										position:"top"
									}}
									onClick={(e)=>{
										window.open('https://'+this.props.item.url).focus();
									}}
								/>
							}
						</div>
					
				</Card>
			</div>
			
		)
	}
}