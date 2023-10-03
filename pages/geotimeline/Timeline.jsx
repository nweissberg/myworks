import { Button } from "primereact/button";
import React from "react"
import { api_get } from "../api/connect";
import { add_data } from "../api/firebase";
import { InputText } from 'primereact/inputtext';
import { Timeline } from "primereact/timeline";
import { Dialog } from "primereact/dialog";
import localforage from 'localforage';
import { Menu } from 'primereact/menu';
import TimelineCard from "../components/timeline_card";
import TimelineMarker from "../components/timeline_marker";
import TimelineEditor from "../components/timeline_event";

export default class TimeLine extends React.Component {
	constructor(props) {
		super(props);
		// console.log(props)
		this.state = {
			pins:[],
			search:"",
			searching:false,
			event_edit:null
		}
	}
	// componentDidMount(event){
	// 	// console.log(event)
	// }

	geoPin(item){
		const current_date = new Date()
		// console.log( current_date.toLocaleDateString() )

		var pin_array = [...this.props.pins]
		var pins_ids = this.props.pins.map(i=>i.id)
		
		if(!pins_ids.includes(item?.id)){
			var new_pin = {
				date: current_date.toJSON(),
				text: "",
				type: "Novo",
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
	
		this.setPins(pin_array)
		
	}
	setPins(pin_array){
		this.setState({
			searching:false,
			pins:pin_array 
		})
		this.props.setPins(pin_array)
		console.log(pin_array)

		localforage.setItem('user_timeline', pin_array)
	}
	getCurrentLocation(){
		const parent = this
		var options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};
		this.setState({search:"Meu Local"})
		function success(pos) {
			var crd = pos.coords;
			api_get({route:'address', body:{lat:crd.latitude,lng:crd.longitude}}).then((data)=>{
				if(data && data[0]){
					parent.geoPin(data[0])
				}else{
					parent.geoPin({
						address:"Meu local",
						location:{lat:crd.latitude,lng:crd.longitude}
					})
				}
			})
		};
		
		function error(err) {
			console.warn('ERROR(' + err.code + '): ' + err.message);
		};
		navigator.geolocation.getCurrentPosition(success, error, options)
	}
	timeline_event_edit(item){
		console.log(item)
		this.setState({event_edit:item})
	}
	render() {
		return(
			<>
				<TimelineEditor
					item={this.state.event_edit}
					onHide={(() => {
						this.setState({event_edit:null})
					})}
					deleteEvent={(id)=>{
						this.setPins(this.props.pins.filter((i)=>i.id!=id))
						// console.log()
					}}
					updateEvent={(item)=>{
						// console.log(item)
						this.setPins(this.props.pins.map((i)=>{
							if(i.id == item.id) i = item
							return(i)
						}))
					}}
				/>
				
				<div style={{
					pointerEvents:"none",
					zIndex:4,
					position:"absolute",
					left:"0px",
					width:"50vw",
					height:"100vh",
					overflow:"hidden"
				}}>
					<div style={{
						position:"sticky",
						top:"10px",
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
							marker={ (item)=> <TimelineMarker item={item}/> }
							content={ (item)=> <TimelineCard item={item} timeline_event_edit={(item)=>this.timeline_event_edit(item)}/> }
						/>
					</div>
					<div style={{pointerEvents:"all"}}>
						<div style={{
							position:"absolute",
							top:"calc(100vh - 55px)",
							width:"calc(100% - 90px)"
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
										api_get({route:'location', body:[this.state.search]}).then((data)=>{
											if(data){
												const item = data[0]
												this.geoPin(item)
											}else{
												this.setState({
													searching:false
												})
											}
										})
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}
}