import { Button } from "primereact/button";
import React from "react"
import { api_get } from "../api/connect";
import { add_data } from "../api/firebase";
import { InputText } from 'primereact/inputtext';

export default class TimeLine extends React.Component {
	constructor(props) {
		super(props);
        console.log(props)
        this.state = {
            pins:[]
        }
    }
    render() {
        return(
            <>
            <div style={{
                pointerEvents:"none",
                zIndex:4,
                position:"absolute",
                left:"0px",
                backgroundColor:'var(--glass)',
                width:'33vw',
                minWidth:'200px',
                // height:'100vh',
                backdropFilter: "blur(20px)",
                padding:"10px"
            }}>
                <div style={{pointerEvents:"all"}}>
                    <div style={{width:"100%"}}>
                        <div className="p-inputgroup">
                            <Button
                                label="Buscar"
                                onClick={(e)=>{
                                    if(!this.state || this.state?.search == '') return
                                    console.log(this.state.search)
                                    api_get({route:'location', data:[this.state.search]}).then((data)=>{
                                        console.log(data)
                                        this.setState({pins:data})
                                        // setPins()
                                        this.props.setPins(data)
                                    })
                                }}
                            />
                            <InputText placeholder="Local" onChange={(e)=>{
                                this.setState({
                                    search:e.target.value
                                })
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}