import React, { useState, useEffect, useRef } from 'react';
import { DataScroller } from 'primereact/datascroller';
import BubbleImage from './chat_bubbles';
import { deepEqual } from '../../utils';

export default function  ChatScroller(props){
    const [timeline_data, set_timeline_data] = useState([]);
    const data_scroller = useRef(null);
    const scroller_footer = useRef(null);
    
    useEffect(() => {
        if(props.data.length != timeline_data.length) set_timeline_data(props.data)
    }, [props.data]);

    useEffect(() => {
        if(props.data.length < 3) return()=>{}
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Loading...');
                data_scroller.current.load()
            }
            });
        });
        observer.observe(scroller_footer.current);
        return () => {
            try {
                observer?.unobserve(scroller_footer.current);
            } catch (error) {
                console.log(error.message)
            }
        };
    }, []);

    const itemTemplate = (t,i) => {
        if(t.from == 'painter'){
            return(<BubbleImage bubble={t} index={i} onSelect={props.set_image_galery}/>)
        }
        return(<div key={"bubble_"+t.from+"_"+i}
            id={"bubble_"+t.from+"_"+t.index+"_"+i}
            className={'flex justify-content-'+(t.from == "user"?"end":"start")}>
            <h4 key={i}
            className={"chat-bubble p-3 max-w-max "+(t.from == "user"?"bg-green-800 mr-2":"surface-200")}
            style={{
                width:"max(45%, 300px)",
                borderRadius:"20px 20px "+(t.from == "bot"?"20px 0px":"0px 20px")
            }}
            onClick={(e)=>{
                console.log(t)
                // clear_inputs()
                props.playAudio(t)
                
            }}>
                {t.image && <div className='pointer-events-none flex w-20rem h-20rem mb-2 border-round-md overflow-hidden'>
                    <img src={t.image} alt={"bubble_"+t.from+"_"+t.index+"_img"} />
                </div>}
                {t.text}
                <br />
                <label className='flex mt-2 text-xs text-white-alpha-50 justify-content-end'>{new Date(t.time).toLocaleTimeString("pt-BR")}</label>
            </h4>
        </div>)
    }
    return (<div>
        {/* {props.thinking > 2 && <div key="bubble_think"
            id="bubble_think"
            className='pointer-events-none flex justify-content-start'>
            <h4 key='thinking'
                className="chat-bubble p-3 max-w-max surface-200"
                style={{
                    width:"max(45%, 300px)",
                    borderRadius:"20px 20px 20px 0px"
                }}
            >
                { Array.from({length: (props.thinking%3)+1}, ()=>'•').join(' ') }
            </h4>
        </div>} */}
        <DataScroller
            ref={data_scroller}
            // className='flex relative p-0 h-full w-full'
            value={timeline_data}
            itemTemplate={itemTemplate}
            rows={3}
            // buffer={0.8}
            loader
            load
            // lazy
            // onLazyLoad={(event)=>{}}
            style={{flexBasis: 'calc(70vh - 15px)',heigth:'100px',  maxHeight:"10vh", overflow:'hidden'}}
            header={<div className='flex h-8rem w-full' ></div>}
            footer={<div ref={scroller_footer}
                className='flex w-full h-8rem justify-content-center' >
            </div>}
        />
    </div>
        
        
    );
}
                 