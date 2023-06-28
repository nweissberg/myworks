import { Button } from 'primereact/button';
import React from 'react';
import MatrixBackGround from '../../components/matrix_bg';
import { replaceAll, time_ago } from '../../utils';
import { caption_image } from '../interface_api';

export default class BubbleImage extends React.Component{
    constructor(props){
        super(props)
        this.default={
            show_info:false
        }
        this.state={...this.default}
        this.timeout = null
    }

    componentDidMount(){
        // console.log(this.props.bubble)
    }

    render(){
        const config = this.props.bubble.config
        return(<div>
            {/* Info Header */}
            <div onClick={()=>{this.setState({show_info:false})}} className={'fadein cursor-cancel animation-duration-400 animation-iteration-1 animation-ease-in-out flex flex-wrap h-full w-full ' +(this.state.show_info?' bg-blur-3 absolute z-2 ':'pointer-events-none')} />
            <div key={"bubble_"+this.props.bubble.from+"_"+this.props.bubble.id}
            style={{borderRadius:"20px"}}
            onPointerLeave={(e)=>{
                this.timeout = setTimeout(()=>{
                    this.setState({show_info:false})
                    clearTimeout(this.timeout)
                },5000)
            }}
            onPointerEnter={(e)=>{
                if(this.timeout) clearTimeout(this.timeout)
            }}
            id={"bubble_"+this.props.bubble.from+"_"+this.props.bubble.id}
            className="flex flex-wrap overflow-hidden bg-black-alpha-50 m-0 mb-2 h-min">
                <div  className='pt-4 w-full h-full pl-3 pr-3'>
                        <div className='flex '>
                            <Button onClick={()=>{
                                this.setState({show_info:!this.state.show_info})
                                clearTimeout(this.timeout)
                            }}
                            icon="pi pi-info-circle" className='m-2 shadow-none chat-bubble p-2 p-button-lg p-button-rounded p-button-text'/>
                            <h4 className='white-space-nowrap h-min w-full p-0 m-3'>{'A.I. Diffusion Models :'}</h4>
                            <div className="grid w-12 white-space-prewrap align-content-center justify-content-end">
                                {this.props.bubble.text.split(': ')[1].split(' ').map((m_code,i)=>{
                                    return(<div key={'m_code_'+i} className='flex flex-wrap justify-content-between w-full pr-2'>{m_code.split('/').map((l_txt,i)=>{return(<label key={'l_txt_'+i} className='text-sm white-space-nowrap'>{l_txt.toLowerCase()}</label>)})}</div>)
                                })}
                            </div>
                        </div>
                    <label className='flex text-xs text-green-300 justify-content-end pt-2'>
                        {time_ago(this.props.bubble.time)}
                    </label>
                </div>
                
                {this.state.show_info && <div className=' flex relative w-full align-content-center'>
                    <div className='fadein animation-duration-400 animation-iteration-1 animation-ease-in-out flex flex-wrap h-auto absolute bg-black-alpha-50 z-2 '>
                        <h4 className='p-3 m-0 text-center text-blue-200 md:text-left lg:text-left'>{this.props.bubble.config.imagine}</h4>
                        <h4 className='p-3 m-0 text-center text-yellow-600 md:text-left lg:text-left'>{this.props.bubble.config?.forget || this.props.bubble.config?.negative}</h4>
                        <h5 className='p-3 m-0 text-right text-white-alpha-70 md:text-left lg:text-left white-space-prewrap'>{`Bubble ID :\t${config.id}\nSampler :\t\t${config.sampler}\nSeed :\t\t${config.seed}\nCFG scale :\t${config.cfg_scale}\nSteps :\t\t${config.steps}`}</h5>
                    </div>
                </div>}
                {/* {this.state.show_info && this.render_info()} */}
                <div className=' flex flex-grow-1 p-2 p-fluid grid gap-1 formgrid justify-content-center m-2' key={this.props.index}>
                    {this.props.bubble.images && this.props.bubble.images.map((image,i_img)=>{
                        if(image.url == "./loading.jpg") return(<div key={image.id} className='overflow-hidden max-h-30rem p-0 border-round-md flex flex-wrap flex-grow-1 w-14rem h-auto justify-content-center align-content-between  sm:col-6 md:col-4 lg:col-4'>
                        <div className='chat-bubble  bg-no-repeat bg-green-900 border-round h-30rem w-full'>
                        <MatrixBackGround/>
                        </div>
                    </div>)
                        return (<div key={image.id} className='overflow-hidden max-h-30rem p-0 border-round-md flex flex-wrap flex-grow-1 w-14rem h-auto justify-content-center align-content-between  sm:col-6 md:col-4 lg:col-4'>
                            <img className='chat-bubble  bg-no-repeat bg-green-900 border-round h-full w-auto '
                                src={image.url}
                                // onLoad={console.log}
                                onError={(e) => e.target.src = './error_404.jpg'}
                                alt={image.name}
                                onClick={(e)=>{
                                    this.props.onSelect([i_img,this.props.bubble])
                                    // caption_image(this.props.bubble.images[i_img].url)
                                }}
                            />
                        </div>)
                    })}
                </div>
            
        </div>
        
    </div>)
    }
}