import React, { createRef } from "react";

export default class FlipCard extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            card_face: true,
            timeout:null,
            listener:null
        }
        this.glow_ref = createRef()
        this.card_ref = createRef()
        this.handdle_flip = this.handdle_flip.bind(this);
		this.flip = this.flip.bind(this);
    }

	componentDidMount(){
		this.props?.mount(this)
	}

    handdle_flip() {
        const parent = this
        if(this.props.auto != false){
            document.addEventListener("click",function clicked(event){
                if (parent.card_ref?.current && !parent.card_ref?.current.contains(event.target)) {
                    parent.setState({card_face: false},parent.flip)
                    document.removeEventListener("click", clicked, true);
                }
            }, true)
        }
        // console.log(this.glow_ref.current)
        
        if(!this.props.vertical){
            if(!this.state.card_face){
                
                this.glow_ref.current.style.transform= 'rotateY(180deg)'
                this.card_ref.current.childNodes[0].style.transform= 'rotateY(180deg) scale(1.0)'
                this.card_ref.current.childNodes[1].style.transform= 'rotateY(360deg)'
            }else{
                this.glow_ref.current.style.transform= 'rotateY(0deg)'
                this.card_ref.current.childNodes[0].style.transform= 'rotateY(0deg) scale(1.0)'
                this.card_ref.current.childNodes[1].style.transform= 'rotateY(180deg)'
            }

        }else{
            if(this.state.card_face){
                this.glow_ref.current.style.transform= 'rotateX(180deg)'
                this.card_ref.current.childNodes[0].style.transform= 'rotateX(180deg) scale(1.0)'
                this.card_ref.current.childNodes[1].style.transform= 'rotateX(360deg)'
            }else{
                this.glow_ref.current.style.transform= 'rotateX(0deg)'
                this.card_ref.current.childNodes[0].style.transform= 'rotateX(0deg) scale(1.0)' 
                this.card_ref.current.childNodes[1].style.transform= 'rotateX(180deg)'
            }
        }
    }
	flip(){
		this.setState({card_face: !this.state.card_face},this.handdle_flip)
	}
    render(){
        return(
            <>
                <div id="card_glow"
                    style={{maxWidth:"30rem"}}
                    ref={this.glow_ref}
                    className="bg-black-alpha-50 blur-2"
                />
                <div
                    ref={this.card_ref}
                    className="card_wrapper pointer-event-auto"
                    style={{
                        width:"100%",
                        height:"100%",
                        maxWidth:"30rem",
                        // ...this.props.style,
                    }}
                    // onClick={(event)=>{
                    //     this.flip()
                    // }}

                    // onPointerLeave={(event)=>{
                    //     if(window.innerWidth > 960){
                    //         this.setState({timeout:setTimeout(()=>{
                    //             this.setState({card_face: false, timeout:null},this.handdle_flip)
                    //         },2000)})
                    //     }
                    // }}
                    
                    // onPointerEnter={(event)=>{
                    //     if(this.state.timeout != null){
                    //         clearTimeout(this.state.timeout)
                    //     }
                    // }}
                >
                    
                    <div
                        // className={this.state.card_face?'visible':'hidden'}
                        id="card_front"
                        style={{
                            overflow:"hidden",
                            zIndex:1,
                            // display:this.state.card_face?"block":"none"
                        }}
                    >
                        
                        {this.props.front?this.props.front:"Frente"}
                    </div>
                    <div
                        // className="shadow-8"
                        id={!this.props.vertical?"card_back_y":"card_back_x"}
                        style={{
                            overflow:"hidden"
                        }}
                    >
                        {this.props.back?this.props.back:"Verso"}
                    </div>
                </div>
            </>
        )
    }
}