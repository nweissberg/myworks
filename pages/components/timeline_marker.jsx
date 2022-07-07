import React from "react";
import { Button } from "primereact/button";

export function getIcons(){
	return({
		Conquista:{
			header:'Conquistas',
			icon: 'pi pi-star-fill',
			color: '#ffd000'
		},
		Formação:{
			header:'Formações',
			icon: 'pi pi-book',
			color: '#58fff9'
		},
		Emprego:{
			header:'Empregos',
			icon: 'pi pi-building',
			color: '#dc7cff'
		},
		Projeto:{
			header:'Projetos',
			icon: 'pi pi-briefcase',
			color: '#5887ff'
		},
		Novo:{
			header:'Novos',
			icon: 'pi pi-map-marker',
			color: '#FFF'
		}
	})
}

export default class TimelineMarker extends React.Component {
	constructor(props) {
		super(props);
		this.IconSet = getIcons()
    }
	render(){
		return(
			<div>
				<div>
					<Button
						style={{
							zIndex:4,
							color:this.IconSet[this.props.item.type]?.color,
							backgroundColor:"#0003",
							borderColor:this.IconSet[this.props.item.type]?.color,
							backdropFilter: "blur(7px)",
							pointerEvents:"all",
							// marginBottom:"100%"
							// top:"0px"
						}}
						tooltip={this.props.item.type}
						tooltipOptions={{
							// mouseTrack:true,
							position:"right"
						}}
						className="p-button-rounded"
						icon={this.IconSet[this.props.item.type]?.icon}
						onClick={(e)=>{
							console.log(e)
						}}
					/>
				</div>
			</div>
		)
	}
}