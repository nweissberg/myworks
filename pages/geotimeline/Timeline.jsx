import { Button } from "primereact/button";
import React from "react"
import { api_get } from "../api/connect";
import { add_data } from "../api/firebase";
import { InputText } from 'primereact/inputtext';
import { Timeline } from "primereact/timeline";
import { Card } from 'primereact/card';
import localforage from 'localforage'

export default class TimeLine extends React.Component {
	constructor(props) {
		super(props);
		console.log(props)
		this.state = {
			pins:[],
			search:"",
			searching:false
		}
	}
	componentDidMount(event){
		// console.log(event)
		// this.getCurrentLocation()
		// const date_now = new Date()
		// console.log(date_now.toJSON())
	
		
	}

	geoPin(item){
		const current_date = new Date()
		// console.log( current_date.toLocaleDateString() )

		var pin_array = [...this.props.pins]
		var pins_ids = this.props.pins.map(i=>i.id)
		
		if(!pins_ids.includes(item.id)){
			var new_pin = {
				date: current_date.toJSON(),
				text: "Descrição do evento",
				type: "Conquista",
			}
			new_pin.title = this.state.search
			// console.log("TESTE",new_pin)
			new_pin.id = item.id
			new_pin.subtitle = item.address
			new_pin.address = item.address
			new_pin.location = item.location
			
			pins_ids.push(item.id)
			pin_array.push(new_pin)
		}
	
		this.setState({
			searching:false,
			pins:pin_array 
		})
		this.props.setPins(pin_array)
		console.log(pin_array)

		localforage.setItem('user_timeline', pin_array)
		// .then(function () {
		// 	return localforage.getItem('key');
		// }).then(function (value) {
		// 	// we got our value
		// }).catch(function (err) {
		// 	// we got an error
		// });

		// return({...{
		// 	title: "Novo Ponto",
		// 	subtitle:"Endereço",
		// 	date: `03 - Junho - 2021`,
		// 	text: "Descrição do evento",
		// 	type: "Conquista",
		// 	location:{lat:270, lng:0}
		// 	// image:"nenena-1.jpg"
		// }})
	}
	getCurrentLocation(){
		const parent = this
		var options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};
		
		function success(pos) {
				var crd = pos.coords;
				
				// console.log('Sua posição atual é:');
				// console.log('Latitude : ' + crd.latitude);
				// console.log('Longitude: ' + crd.longitude);
				// console.log('Mais ou menos ' + crd.accuracy + ' metros.');
				
				api_get({route:'address', data:{lat:crd.latitude,lng:crd.longitude}}).then((data)=>{
						// console.log(data)
						if(data[0]){
								const user_location = data[0]
								const first_pin = [{
										address:user_location.address,
										id:user_location.id,
										location:{lat:crd.latitude,lng:crd.longitude}
								}]
								parent.setState({
										search:user_location.address,
										pins:first_pin
								})
								parent.props.setPins(first_pin)
						} 
						
				})
				
				// window.open('https://maps.google.com/maps?layer=c&cbll=' + crd.latitude+","+crd.longitude);
		};
		
		function error(err) {
				console.warn('ERROR(' + err.code + '): ' + err.message);
		};
		navigator.geolocation.getCurrentPosition(success, error, options)
	}
	
	render() {
			
	const IconSet = {
		Conquista:{
			header:'Conquistas',
			icon: 'pi pi-star-fill',
			color: 'var(--icon-pallet-f)'
		},
		Formação:{
			header:'Formações',
			icon: 'pi pi-book',
			color: 'var(--icon-pallet-b)'
		},
		Emprego:{
			header:'Empregos',
			icon: 'pi pi-building',
			color: 'var(--icon-pallet-d)'
		},
		Projeto:{
			header:'Projetos',
			icon: 'pi pi-briefcase',
			color: 'var(--icon-pallet-a)'
		}
	}
	const customizedMarker = (item) => {
			
		return (
			<div>
				<Button
					style={{
						zIndex:4,
						color:IconSet[item.type]?.color,
						backgroundColor:"#0003",
						borderColor:IconSet[item.type]?.color,
						backdropFilter: "blur(7px)",
						pointerEvents:"all",
						// marginBottom:"100%"
						// top:"0px"
					}}
					tooltip={item.type}
					tooltipOptions={{
						// mouseTrack:true,
						position:"right"
					}}
					className="p-button-rounded"
					icon={IconSet[item.type]?.icon}
					/>
			</div>
			);
		};
	
		const customizedContent = (item) => {
			// console.log(item)
			
			return (
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
					{new Date(item.date).toLocaleDateString()}
				</h2>
				<Card
					style={{
						// position:"absolute",
						//   width:"333px",
						backgroundColor:"#4444",
						backdropFilter: "blur(5px)",
						zIndex:4,
					}}
					title={<div style={{fontFamily:'mars'}}>{item.title}</div>}
					subTitle={<div style={{fontFamily:'neuro',color:"var(--matrix-secondary)"}}>{item.subtitle}</div>}
					>
					{item.image &&
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
							}} width={200} alt={item.title} src={'/image/timeline/'+item.image}
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
					
					{item.text && <p style={{fontFamily:'futura', fontSize:"22px"}}>{item.text}</p>}
						{ item.url && item.url != '' &&
							<div>
								{
									item.video &&
									<Button 
										label="Video"
										className="p-button-text"
										icon="pi pi-youtube"
										onClick={(e)=>{
											setOverlay(true)
											set_video_id(item.video)
										}}
									/>
								}
								<Button
								label="Abrir"
								className="p-button-text"
								icon="pi pi-link"
								tooltip={item.url}
								tooltipOptions={{
									mouseTrack:true,
									position:"top"
								}}
								onClick={(e)=>{
									window.open('https://'+item.url).focus();
							}}
							/>
							</div>
						}
					</Card>
				</div>
			);
		};

	return(
		<>
			<div style={{
				pointerEvents:"none",
				zIndex:4,
				position:"absolute",
				left:"0px",
				// backgroundColor:'var(--glass)',
				// width:'33vw',
				// minWidth:'200px',
				// height:'100vh',
				// backdropFilter: "blur(20px)",
				// padding:"10px"
				width:"50vw",
				height:"100vh",
				overflow:"hidden"
			}}>
				<div style={{
					position:"sticky",
					top:"10px",
					// left:"10px",
					width:"50vw",
					pointerEvents:"all",
					overflowY:"scroll",
					overflowX:"hidden",
					height:"100vh",
					zIndex:0
				}}>
					<Timeline 
						// layout="horizontal"
						style={{
							width:"180%",
							marginBottom:"70px",
							marginTop:"10px"
						}}
						align="right"
						value={this.props.pins}
						marker={customizedMarker}
						content={customizedContent}
					/>
				</div>
				<div style={{pointerEvents:"all"}}>
					<div style={{
						position:"absolute",
						top:"calc(100vh - 55px)",
					}}>
						<div style={{zIndex:10, marginLeft:'20px'}} className="p-inputgroup">
							<Button
								icon="pi pi-map-marker"
								className="p-button-outlined"
								onClick={(event)=>{
									this.getCurrentLocation()
								}}
								tooltip="Meu Local"
							/>
							<InputText
								value={this.state.search}
								placeholder="Local"
								onChange={(e)=>{
								this.setState({
									search:e.target.value
								})
							}}/>
							<Button
								disabled={this.state.searching}
								icon={this.state.searching == true?"pi pi-spin pi-spinner":"pi pi-search"}
								label="Buscar"
								onClick={(e)=>{
									console.log(e)
									if(!this.state || this.state?.search == '') return
									this.setState({searching:true})
									console.log(this.state.searching)
									api_get({route:'location', data:[this.state.search]}).then((data)=>{
										const item = data[0]
										this.geoPin(item)
										
									})
								}}
							/>
						</div>
					</div>
				</div>
				
			</div>
		</>
	)}
}