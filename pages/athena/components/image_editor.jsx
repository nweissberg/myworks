import { Button } from 'primereact/button';
import { useEffect, useState, Suspense, useRef } from 'react'
import { lerp } from 'three/src/math/MathUtils';
import Canvas from '../../../componets/Canvas';
import WrapperCursor from '../../../componets/wrapper_cursor';
import { KeyboardListener } from '../../../componets/wrapper_keyboard';
import { caption_image, compare_captions, depth_image, segment_image } from '../interface_api';
import EditorActionHeader from './editor_action_header';
import dynamic from 'next/dynamic';
import { average, isDeepEqual } from '../../utils';
import { useAthena } from '../athena_context';
const WebWorker = dynamic(() => import('../../components/web_worker'), {
  ssr: false,
});
var hue = 340
var speed = 0.0
var zoom = 1
var zoom_to = 1
var grabbing = false
var offset = {x:0,y:0}
var offset_x = 0.0
var offset_y = 0.0
var last_offset = 0.0

var time = Date.now()
let lastTime = time
var deltaTime = 0.0
var cursor = {
    start:  {x:0,y:0},
    pos:    {x:0,y:0},
    end:    {x:0,y:0},
    speed:  0.0,
}
var bounding_box = {x:0,y:0,w:512,h:512,cw:512,ch:512}
var b = bounding_box
var worker_canvas = null
var depth_mask = null
export default function ImageEditor(props){
    // const {is_mobile} = useUtils()
    // worker = new Worker("/workers/canvas.worker.js");
    const [image, set_image] = useState(null)
    const [depth, set_depth] = useState(null)
    const [scanning, set_scanning] = useState(false)
    const [last_image, set_last_image] = useState(null)
    const [no_image, set_no_image] = useState(null)
    const [image_data, set_image_data] = useState(null)
    const [update, set_update] = useState(100)
    const [loading, set_loading] = useState(false)
    const [slide, set_slide] = useState('left')
    const [exit, set_exit] = useState(false)
    const [depth_maps, set_depth_maps] = useState({})
    // var canvas_editor_ref = useRef(null)
    // const [offscreen, set_offscreen] = useState(null)
    const {set_code} = useAthena()
    // const [worker_canvas, set_worker_canvas] = useState(null)

    function getImageData(img,ctx,scale=0.3,b=bounding_box){
        if(!ctx){
            const scaledWidth = Math.round(img.width * scale);
            const scaledHeight = Math.round(img.height * scale);
            const canvas = document.createElement('canvas');
            canvas.width = scaledWidth;
            canvas.height = scaledHeight;
            ctx = canvas.getContext('2d');
        }
        ctx.clearRect(0, 0, b.cw, b.ch)
        
        ctx.drawImage(img, b.x, b.y, b.w, b.h);
        var imgData = ctx.getImageData(b.x, b.y, b.w, b.h);
        var d = imgData.data;
        for (var i = 0; i < d.length; i += 4) {
            var sum = Math.ceil(Math.floor(d[i])+ Math.floor(d[i+1]) + Math.floor(d[i+2]));
            d[i+3] = sum
        }
        return(imgData)
    }

    function editor_zoom(value){
        set_update(update=>update+=10)
        speed += ((value+(speed)+(zoom+zoom))*0.0333)
        // console.log(value)
        if(value < 0){
            set_exit(false)
        }
        
    }
    function onHide(){
        if(exit) {
            // console.log("Teste")
            set_exit(false)
            props.onHide()
        }else{
            set_exit(true)
            zoom=0.8
        }
        // set_update(100)
        
    }
    
    useEffect(()=>{
        props.onExit(exit)
        set_update(update=>update=40)
    },[exit])

    useEffect(()=>{
        if(no_image) return
        const img = new Image();
        img.onload = () => {
            set_no_image(img)
        }
        img.src='./error_404.jpg'
    },[])

    useEffect(()=>{
        if(!exit){
            zoom = Math.min(8,Math.max(0.8,zoom -= speed*0.01))
        }else{
            zoom = 0.8
        }
        
        if(zoom == 1 && zoom_to == 1){
            set_update(10)
            speed=0.0
            offset = {x:0,y:0}
        }
    },[update])

    useEffect(()=>{
        if(!depth) return
        set_update(5)
    },[depth])
    
    var draw = {}
    
    draw.center = (ctx) => {
        
        zoom_to = lerp(zoom_to,zoom,0.333)
        offset_x = lerp(offset_x,offset.x,0.3)
        offset_y = lerp(offset_y,offset.y,0.3)
        let delta_speed = Math.abs(speed)
        if(delta_speed>0.1) speed = speed *= 0.8
        const cvs_w = ctx.canvas.width
        const cvs_h = ctx.canvas.height
        ctx.clearRect(0, 0, cvs_w, cvs_h)
        var ratio = cvs_w/cvs_h
        // if( cvs_w < cvs_h) ratio = cvs_h/cvs_w
        last_offset += (last_offset+1)*0.5
        if(Math.abs(last_offset)>cvs_w && last_image) {
            set_last_image(null)
            set_update(100)
            zoom = 0
            zoom_to = 0
        }

        var drw_w = image.width || last_image.width
        var drw_h = image.height|| last_image.height

        var mode = 'fit'

        if(mode == 'fill'){
            if(drw_h < cvs_h && cvs_w < cvs_h){
                drw_h = cvs_h
                drw_w = cvs_w/ratio
            }
            if(drw_w < cvs_w && cvs_w > cvs_h){
                drw_h = cvs_h*ratio
                drw_w = cvs_w
            }
        }

        if(mode == 'fit'){
            if(drw_h < cvs_h){
                drw_h = cvs_h
                drw_w = cvs_w/ratio
            }
            if(drw_w > cvs_w){
                drw_w = cvs_w
                drw_h = cvs_h*ratio
            }
        }
        
        var center = {
            x:((cvs_w)/2)-((drw_w*zoom_to)/2)+offset_x,
            y:((cvs_h)/2)-((drw_h*zoom_to)/2)+offset_y,
        }
        
        
        
        
        
        // ctx.globalCompositeOperation="source-over";
        
        
        // ctx.globalCompositeOperation="screen";
        // if(overlay) ctx.drawImage(overlay, center.x, center.y, drw_w*zoom_to, drw_h*zoom_to);
        // ctx.globalCompositeOperation="multiply";
        // ctx.fillStyle='#0005';
        // ctx.fillRect(center.x, center.y, drw_w*zoom_to, drw_h*zoom_to);
        

        if(zoom <= 0.8) {
            if(!exit) set_update(update=>update=20)
            if(speed > 10){
                onHide()
                speed=0.0
            }else{
                speed *=0.7
            }
        }
        if(delta_speed < 1 ){
            
            if(zoom < 1){
                if(!exit) zoom=Math.min(1,zoom*=1.06)
            }else{
                speed=0.0
            }
        }
        const left  = ((offset.x) + (cvs_w/2)) - ((drw_w*zoom_to)/2)
        const right = ((offset.x) - (cvs_w/2)) + ((drw_w*zoom_to)/2)
        // console.log(left, right, )
        if(zoom_to>=1 && drw_w*zoom_to > cvs_w && !exit){
            if(left > 0 ){
                offset.x = ((cvs_w/2)) + ((drw_w*zoom_to)/2) - cvs_w
                set_update(5)
            }
            if(right < 0 ){
                offset.x = ((cvs_w/2)) - ((drw_w*zoom_to)/2)
                set_update(5)
            }
        }else if(Math.round(offset.x != 0) && !exit){
            offset.x = 0
            set_update(10)
        }

        const top  = ((offset.y) + (cvs_h/2)) - ((drw_h*zoom_to)/2)
        const bottom = -(((offset.y) - (cvs_h/2)) + ((drw_h*zoom_to)/2))
        // console.log(top, bottom )
        if(zoom_to>=1 && drw_h*zoom_to > cvs_h && !exit){
            if(top > 0 ){
                offset.y = ((cvs_h/2)) + ((drw_h*zoom_to)/2) - cvs_h
                set_update(5)
            }
            if(bottom > 0 ){
                set_update(5)
                offset.y = ((cvs_h/2)) - ((drw_h*zoom_to)/2) 
            }
        }else if(Math.round(offset.y) != 0 && !exit){
            set_update(10)
            offset.y = 0
        }

        offset.x *= Math.min(1,zoom)
        offset.y *= Math.min(1,zoom)
        set_update(update=>update-=1)
        // time = Date.now()
        
        // const deltaTime = time - lastTime;
        // lastTime = time;
        // const speed = 10

        bounding_box = {
            x:center.x,
            y:center.y,
            w:drw_w*zoom_to,
            h:drw_h*zoom_to,
            cw:cvs_w,
            ch:cvs_h
        }
        if((bounding_box.w != b.w || bounding_box.h != b.h) && scanning){
            b.w = bounding_box.w
            b.h = bounding_box.h
            make_mask(ctx)
            lastTime-=100
        }else if(depth_mask) ctx.putImageData(depth_mask, center.x, center.y);
        if(last_image) ctx.drawImage(last_image, ((slide=='left'?-1:1)*last_offset) + (cvs_w-drw_w)/2 , center.y, drw_w*zoom_to, drw_h*zoom_to);
        ctx.globalCompositeOperation="screen";
        if(image && !last_image) ctx.drawImage(image, center.x, center.y, drw_w*zoom_to, drw_h*zoom_to);
        
        if(scanning){
            // const duration = 3000
            // const angle = (((deltaTime+1) * speed) / duration) * 360;
            
            // const halfDuration = duration / 2;
            // const elapsed = time % duration;
            // const direction = Math.floor(time / halfDuration) % 2 ? -1 : 1;
            // const direction = -1
            // const angle = ((elapsed / halfDuration) * 180 * direction + 180) % 360;
            // angle =  (Math.sin(Math.cos(time*0.001))*360)%360

            // offscreen.update({command:'update',boundingBox:bounding_box, hue: angle - 40 });
            
        }
        
        
        // ctx.restore();
    }

    function applyFilter(imgData) {
        const scale = 0.3;
        const scaledWidth = Math.round(imgData.width * scale);
        const scaledHeight = Math.round(imgData.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        const ctx = canvas.getContext('2d');
        ctx.putImageData(imgData, 0, 0);
        const scaledImgData = ctx.getImageData(0, 0, scaledWidth, scaledHeight);
        for (let i = 0; i < scaledImgData.data.length; i += 4) {
          const alpha = scaledImgData.data[i + 3];
          scaledImgData.data[i + 3] = alpha * 2;
        }
        const outputImgData = ctx.createImageData(imgData.width, imgData.height);
        const stepX = scaledWidth / imgData.width;
        const stepY = scaledHeight / imgData.height;
        for (let y = 0; y < imgData.height; y++) {
          for (let x = 0; x < imgData.width; x++) {
            const ix = Math.round(x * stepX);
            const iy = Math.round(y * stepY);
            const i = (iy * scaledWidth + ix) * 4;
            const j = (y * imgData.width + x) * 4;
            outputImgData.data[j] = scaledImgData.data[i];
            outputImgData.data[j + 1] = scaledImgData.data[i + 1];
            outputImgData.data[j + 2] = scaledImgData.data[i + 2];
            outputImgData.data[j + 3] = scaledImgData.data[i + 3];
          }
        }
        for (let y = 0; y < imgData.height; y++) {
          for (let x = 0; x < imgData.width; x++) {
            const i = (y * imgData.width + x) * 4;
            if (outputImgData.data[i + 3] === 0) {
              let count = 0;
              let r = 0;
              let g = 0;
              let b = 0;
              for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                  const nx = x + dx;
                  const ny = y + dy;
                  if (nx < 0 || ny < 0 || nx >= imgData.width || ny >= imgData.height) {
                    continue;
                  }
                  const j = (ny * imgData.width + nx) * 4;
                  if (outputImgData.data[j + 3] > 0) {
                    count++;
                    r += outputImgData.data[j];
                    g += outputImgData.data[j + 1];
                    b += outputImgData.data[j + 2];
                  }
                }
              }
              if (count > 0) {
                outputImgData.data[i] = r / count;
                outputImgData.data[i + 1] = g / count;
                outputImgData.data[i + 2] = b / count;
                outputImgData.data[i + 3] = 255;
              }
            }
          }
        }
        return outputImgData;
      }

      
    draw.front = (ctx) => {
        time = Date.now()
        deltaTime = time - lastTime;
        
        if(deltaTime < 100 || !scanning) return
        if(scanning)hue = (hue - 10)%340;
        lastTime = time;
        make_mask(ctx)
    }
    function make_mask(ctx){
        b = bounding_box
        ctx.clearRect(0, 0, b.cw, b.ch)
        if(depth?.depth && !last_image){
            ctx.drawImage(depth.depth, b.x, b.y, b.w, b.h);
            ctx.globalCompositeOperation="color-burn";
            ctx.fillStyle='hwb('+hue+'deg 0% 0%)';
            //  ctx.fillStyle='#f00';
            ctx.fillRect(b.x, b.y, b.w, b.h);
            
            var imgData = ctx.getImageData(b.x, b.y, b.w, b.h);
            var d = imgData.data;
            for (var i = 0; i < d.length; i += 4) {
                var sum = Math.ceil(Math.floor(d[i])+ Math.floor(d[i+1]) + Math.floor(d[i+2]));
                d[i+3] = (sum+sum)
            }
            ctx.clearRect(0, 0, b.cw, b.ch)

            ctx.putImageData(imgData, b.x, b.y);
            ctx.globalCompositeOperation="source-out";
            ctx.fillStyle=`#FFF`;
            ctx.fillRect(b.x+2, b.y+2, b.w-4, b.h-4);
            
            imgData = ctx.getImageData(b.x, b.y, b.w, b.h);
            depth_mask = imgData;
            ctx.clearRect(0, 0, b.cw, b.ch)
            ctx.restore()
            set_update(30)
        }
    }
    useEffect(()=>{
        if(!no_image || image?.src == props.image?.url) return
        if(depth_maps[props.image.id]){
            set_depth(depth_maps[props.image.id])
            set_image(depth_maps[props.image.id].img)
            set_update(5)
            // set_scanning(true)
            hue = 340
            return
        }
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            set_image(img)
            // depth_image(img).then((data)=>{
            //     // console.log(data)
            //     var depth_obj = {data:data, img:img}
            //     const depth_img = new Image();
            //     depth_img.crossOrigin = "anonymous";
            //     depth_img.onload = () =>{
            //         depth_obj.depth = depth_img
            //         set_depth(depth_obj)
            //         var _depth_maps = {...depth_maps}
            //         _depth_maps[props.image.id] = depth_obj
            //         set_depth_maps(_depth_maps)
            //         set_update(15)
            //         // set_scanning(true)
            //     }
            //     depth_img.src = data
            // })
            
            if(!last_image)set_last_image(img)
            set_exit(false)
            
        }
        img.onerror = () =>{
            set_image(no_image)
            if(!last_image)set_last_image(no_image)
        }
        if(image?.src != props.image.url) img.src = props.image.url
        if(!last_image)set_loading(true)
    },[no_image,props])
    
    function analize_image(img){
        set_scanning(true)
        caption_image(img, props.galery[1].config.imagine,(think)=>{
            console.log(think.state)
        }).then((data)=>{
            // if(offscreen) offscreen.update({command:'clear'});
            console.log(data)
            props.speak(data)
            set_scanning(false)
            set_depth(null)
            depth_mask = null
        }).catch((e)=>{
            props.speak(e.message)
        })
    }

    // function test_segmentation(img){
    //     const img = new Image();
    //     img.crossOrigin = "anonymous";
    //     img.onload = () => {
    //         segment_image(img).then((data)=>{
    //             console.log(data)
    //         })
    //     }
    //     img.src='./image/test/FrenchCafe.png'
    // }
    // test_segmentation()

    useEffect(()=>{
        set_update(100)
        if(!last_image){
            zoom_to = 0.0
            zoom = 0.0
            offset = {x:0,y:0}
        }
        set_loading(false)
        let _image_data = {...props.galery[1].config, images:props.galery[1]?.images.length, ...props.galery[1]?.images[props.index] }
        set_image_data(_image_data)
        set_code(image_data)
    },[image])

    function prevImage(e){
        if(last_image != null) return
        if(props.index > 0){
            set_slide('right')
            set_last_image(image)
            set_depth(null)
            last_offset=0
            props.onBack(e)
            set_exit(false)
        }else{
            onHide()
        }
    }

    function nextImage(e){
        if(last_image != null) return
        if(last_image== null && props.index < props.length-1){
            set_slide('left')
            set_last_image(image)
            set_depth(null)
            last_offset=0
            props.onNext(e)
            set_exit(false)
        }else{
            onHide()
        }
    }
    

    return(<>
        {/* <WebWorker
            onLoad={(el)=>{set_offscreen?.(el)}}
            worker="/workers/canvas.worker.js"
            onMessage={(data)=>{
                console.log(data)
                // const overlay_img = new Image();
                // overlay_img.onload = () =>{
                //     set_overlay(overlay_img)
                //     set_update(15)
                // }
                // overlay_img.src = data.image
            }}
        /> */}
        {/* {image == null && loading && <img src='./error_404.jpg' className='flex bg-contain bg-center bg-no-repeat border-round-md'></img>} */}
        
        { (!loading && image) && (last_image!=null || !loading) && props.image && 
        <Suspense fallback={<></>}>
        <div className='fixed top-0 w-full z-3'>
            <EditorActionHeader
                exit={exit}
                onExit={(value)=>{
                    set_update(update=>update=10)
                    onHide()
                    set_exit(value)
                }}
                onRegenerate={async ()=>{
                    if(average(getImageData(image).data) == 0) {
                        console.log('No image')
                        return
                    }
                    let captions = await compare_captions(image)
                    console.log(captions)
                }}
                onCallAthena={()=>{
                    if(average(getImageData(image).data) == 0) {
                        props.speak('No image, just black pixels...')
                        set_scanning(false)
                        set_depth(null)
                        console.warn('No image')
                        return
                    }
                    analize_image(image)

                    // if(!depth)return
                    // if(offscreen && worker_canvas){
                    //     try {
                    //         offscreen.post({
                    //             command:'depth',
                    //             canvas: worker_canvas,
                    //             imageURL:depth.data,
                    //             boundingBox:bounding_box
                    //         },worker_canvas);
                    //     } catch (error) {
                    //         console.log(error.message)
                    //     }    
                    // }
                }}
                onDownload={()=>{}}
            />
        </div>
        
        <div className='fixed flex bg-gradient-bottom bottom-0 justify-content-center mb-4h-auto w-full z-4'>
            <h3 className='text-white-alpha-50'>
                {image_data.model}
            </h3>
            {/* <Button icon=/> */}
        </div>

        
        <KeyboardListener onKey={ key =>{
            switch (key) {
                case "escape":
                    onHide()
                    break;
                case "arrowright":
                    nextImage()
                    break;
                case "arrowleft":
                    prevImage()
                    break;
                default:
                    break;
            }
        }}/>
        <WrapperCursor
            className={(zoom > 1.0 || grabbing?(grabbing?'cursor-grabbing':'cursor-grab'):(exit?'cursor-not-allowed':'cursor-zoom'))+' flex bg-contain bg-center bg-no-repeat border-round-md'}//'overflow-hidden flex fixed w-screen h-screen top-0 left-0'
            onScroll={editor_zoom}
            onClick={(pos)=>{
                cursor.start = pos
                cursor.pos = pos
                cursor.end = pos
                set_update(15)
            }}
            onTouch={(pos)=>{
                cursor.start = pos
                cursor.pos = pos
                cursor.end = pos
                set_update(15)
            }}
            onRelease={(pos)=>{
                
                cursor.pos = pos
                cursor.end = pos
                if(grabbing == false){
                    if(!exit) zoom+=zoom
                    set_exit(false)
                }
                grabbing = false
                set_update(update=>update=10)
                
                
            }}
            onMove={()=>{
                if(grabbing)set_update(10)
            }}

            onDrag={(pos)=>{
                // let _time = Date.now()
                set_exit(false)
                grabbing = true
                
                cursor.pos = pos
                offset.x += (cursor.pos.x - cursor.end.x )
                offset.y += (cursor.pos.y - cursor.end.y )
                
                cursor.end = cursor.pos
                
            }}
        >
            <Canvas
                worker_canvas={(el)=>{worker_canvas = el}}
                animate={update>0 || scanning || last_image ?"anim":"once"}
                style={{width:"100%",height:"auto", opacity:last_image?1:Math.min(1,((zoom_to-0.1)**4)+0.4)}}
                draw={draw}
            />
            
            
        </WrapperCursor>
        
        </Suspense>}
        {props.image && <div className='pointer-events-none overflow-none absolute flex w-full h-15rem p-0 justify-content-between top-50 z-2' style={{transform:'translateY(-50%)'}}>
            <Button
                icon='pi pi-chevron-left'
                className={(props.index == 0?"opacity-0":"")+' pointer-events-auto relative shadow-none hover:bg-white-alpha-10 z-4 p-button-text w-4rem'}
                disabled={ props.index == 0 }
                onClick={(e)=>{prevImage(e)}}
            />
            <Button
                className={(!(props.index+1 < props.length)?"opacity-0":"")+' pointer-events-auto relative shadow-none hover:bg-white-alpha-10 z-4 p-button-text w-4rem'}
                icon='pi pi-chevron-right'
                disabled={!(props.index+1 < props.length)}
                onClick={(e)=>{nextImage(e)}}
            />
        </div>}
        
    </>
)}