import React from 'react';
import Imaginy from './ml_imaginy';
import { print, var_get, var_set } from '../utils';

export default class ImaginyEditor extends React.Component{
    constructor(props){
        super(props)
        this.default={
			imaginy_view:null,
			imaginy_vision:null,
			loading:true
		}
        this.state={...this.default}
		this.get_local_data = this.get_local_data.bind(this)
    }
	get_local_data(){
		var_get("imaginy_vision").then((value)=>{
			if(value){ this.setState({imaginy_vision:JSON.parse(value)}) }
			var_get("imaginy_view",{compressed:true}).then((value)=>{
				if(value){
					const img = new Image();
					img.src = value;
					this.setState({imaginy_view:img})
				}
				this.setState({loading:false})
			})
		})
	}
	
	componentDidMount(){
		this.get_local_data()
	}
	
	componentWillUnmount(){
		this.get_local_data()
	}

    componentDidUpdate(){
		// console.log(this.state.imaginy_view,this.state.imaginy_vision)
    }

    render(){
		if(this.state.loading) return(<></>)
        return(
			<Imaginy
				ref={this.props.ref}
				auto={false}
				alt="hero-1"
				menu={true}
				placeholder='/image/backgrounds/hero-1.jpg'
				width={400}
				height={400}
				imaginy_view={this.state.imaginy_view}
				imaginy_vision={this.state.imaginy_vision}
				fullscreen={this.props.fullscreen}
				// className="absolute top-0 left-0 w-screen h-screen z-1"
				onClose={() => { console.log("VAI QUE VAI") }}
				model='darkstorm2150/Protogen_x3.4_Official_Release'
				description="make a painting in davinci style of the museum of art of são paulo masp, red letter, open ceiling, highly detailed, painted by velazquez, beksinski, giger"
				imagine="nousr robot, mdjrny-v4, masterpiece, best quality, 8k, pastel, minimalistic style, highly detailed, depth of field, sharp focus, hdr, absurdres, high detail, ultra-detailed, highres, high quality, intricate details, outdoors, ultra high res, 4k, extremely detailed, realistic, photorealistic, raw photo, cinematic lighting"
				forget="symmetrical, blury, deformed, cropped, low quality, bad anatomy, multilated, long neck, mutation, malformed limbs, username, poorly drawn face, mutated, easynegative, blurry, monochrome, missing fingers, error, missing legs, jpeg artifacts, watermark, text, too many fingers, poorly drawn hands, duplicate, extra legs, signature"
				onFullscreen={(value)=>{this.props.onFullscreen(value)}}
				onCreate={(imaginy_view, imaginy_vision)=>{
					// console.log(imaginy_view)
					var_set("imaginy_view",imaginy_view,{compressed:true})
					var_set("imaginy_vision",JSON.stringify(imaginy_vision))
					this.setState({imaginy_view:imaginy_view})
				}}
			/>
		)
    }
}