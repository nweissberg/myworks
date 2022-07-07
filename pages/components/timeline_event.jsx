import React from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Calendar } from 'primereact/calendar';
import { InputText } from "primereact/inputtext";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { InputTextarea } from 'primereact/inputtextarea';
import GoogleMap from "./maps";
import { getIcons } from "./timeline_marker";
import { Menu } from "primereact/menu";
import { Toast } from 'primereact/toast';

export default class TimelineEditor extends React.Component{
    constructor(props){
        super(props)
        this.showToast = this.showToast.bind(this);
        this.state = {
            hide:false,
            item:props?.item,
            show_map:false
        }
        this.confirm = (event) => {
            confirmPopup({
                acceptLabel:"Sim",
                rejectLabel:"Não",
                target: event.currentTarget,
                message: 'Excluir evento da timeline?',
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-danger',
                accept:((e)=>{
                    this.props.deleteEvent(this.props.item.id)
                    this.showToast({
                        severity:'warn',
                        summary: 'Exclusão',
                        detail:'Registro excluído com sucesso',
                        life: 3000
                    })
                    this.hideEditor()
                }),
                reject:((e)=>{console.log(e)})
            });
        };
        this.IconSet = getIcons()
        this.options = Object.keys(this.IconSet).map((i)=>{
			const item = this.IconSet[i]
			return({
				label:i,
				icon:item.icon,
				command:(e)=>{
                    var _item = {...this.state.item}
                    _item.type = e.item.label
                    this.setState({ item: _item })
					
				}
			})
		})
    }
    showToast(config) {
        this.toast.show(config);
    }
    hideEditor(){
        this.props.onHide?.()
        this.setState({item:null})
    }
    render(){
        
        return(<div>
            <Toast ref={(el) => this.toast = el} />
            {this.props.item &&
            <Dialog
                header={
                    <div className="flex">
                        <div className="mr-3">
                            <Menu model={this.options} popup ref={el => this.menu = el} id="popup_menu" />
                            
                            <Button
                                style={{
                                    color:this.IconSet[this.state.item?.type]?.color,
                                    borderColor:this.IconSet[this.state.item?.type]?.color,
                                }}
                                tooltip="Mudar tipo"
                                tooltipOptions={{
                                    // mouseTrack:true,
                                    position:"right"
                                }}
                                icon={this.IconSet[this.state.item?.type]?.icon}
                                className="p-button-rounded p-button-outlined"
                                onClick={(event) => this.menu.toggle(event)}
                                aria-controls="popup_menu"
                                aria-haspopup
                            />
                        </div>
                        <div className="flex mt-1">
                            {"Editar "+this.state.item?.type}        
                        </div>
                        
                    </div>
                }
                visible={(this.props.item?true:false)}
                onHide={()=>{
                    this.hideEditor()
                }}
                onShow={()=>{
                    console.log("SHOW")
                    
                    var _item = {...this.props.item}
                    if(typeof(this.props.item.date) == "string") _item.date = [new Date(this.props.item?.date),new Date(this.props.item?.date)]
                    this.setState({item:_item})
                }}
                footer={
                    <div>
                        <ConfirmPopup />
                        <Button
                            className="p-button-danger"
                            label="Excluir"
                            icon="pi pi-trash"
                            onClick={this.confirm}
                        />
                        <Button
                            label="Salvar"
                            icon="pi pi-save"
                            onClick={()=>{
                                this.props.updateEvent(this.state.item)
                                // this.hideEditor()
                                this.showToast({
                                    severity:'success',
                                    summary: 'Sucesso',
                                    detail:'Registro salvo com sucesso',
                                    life: 3000
                                })
                            }}
                        />
                    </div>
                }
                >
                <div style={{
                        maxWidth:"800px",
                        width:"80vw"
                    }}>
                    
                    <div className="card">
                        <div className="p-fluid grid formgrid">

                            <div className="field col-12">
                                <Button
                                    label={this.state.show_map?"Fechar o Mapa":"Abri no Mapa"}
                                    icon="pi pi-map"
                                    className="p-button p-button-outlined mb-2"
                                    onClick={()=>{this.setState({show_map:!this.state.show_map})}}
                                />
                                {this.state.show_map && 
                                <GoogleMap
                                    location={this.state.item?.location}
                                    title={this.state.item?.title}
                                    updateLocation={(newLocation)=>{
                                        var _item = {...this.state.item}
                                        _item.subtitle = newLocation.address
                                        _item.location = newLocation.location
                                        this.setState({ item: _item })
                                    }}
                                />}
                            </div>
                            <div className="field col-12 md:col-4">
                                <label>Período</label>
                                <Calendar
                                    id="range"
                                    value={this.state.item?.date}
                                    onChange={(e) => {
                                        var _item = {...this.state.item}
                                        _item.date = e.value
                                        this.setState({ item: _item, dates: e.value })}
                                    }
                                    selectionMode="range"
                                    readOnlyInput
                                    />
                            </div>

                            <div className="field col-12 md:col-4">
                                <label>Título</label>
                                <InputText
                                    value={this.state.item?.title}
                                    onChange={(e) => {
                                        var _item = {...this.state.item}
                                        _item.title = e.target.value
                                        this.setState({ item: _item })
                                    }}
                                />
                            </div>

                            <div className="field col-12 md:col-4">
                                <label>Subtítulo</label>
                                <InputText
                                    value={this.state.item?.subtitle}
                                    onChange={(e) => {
                                        var _item = {...this.state.item}
                                        _item.subtitle = e.target.value
                                        this.setState({ item: _item })
                                    }}
                                />
                            </div>

                            <div className="field col-12">
                                <label>Descrição</label>
                                <InputTextarea
                                    autoResize
                                    value={this.state.item?.text}
                                    onChange={(e) => {
                                        var _item = {...this.state.item}
                                        _item.text = e.target.value
                                        this.setState({ item: _item })
                                    }}
                                />
                            </div>

                            <div className="field col-12 md:col-6">
                                <label>URL Link</label>
                                <InputText
                                    value={this.state.item?.url}
                                    onChange={(e) => {
                                        var _item = {...this.state.item}
                                        _item.url = e.target.value
                                        this.setState({ item: _item })
                                    }}
                                />
                            </div>

                            <div className="field col-12 md:col-6">
                                <label>Youtube Video</label>
                                <InputText
                                    value={this.state.item?.video}
                                    onChange={(e) => {
                                        var _item = {...this.state.item}
                                        _item.video = e.target.value
                                        this.setState({ item: _item })
                                    }}
                                />
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
            </Dialog>}
        </div>)
    }
}