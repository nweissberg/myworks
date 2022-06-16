import { useRef, useState, useEffect } from 'react'
import { Timeline } from 'primereact/timeline';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Galleria } from 'primereact/galleria';
import HistoryService from '../services/HistoryService';

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

// const History = []

const galleriaResponsive = [
  {
      breakpoint: '1500px',
      numVisible: 5
  },
  {
      breakpoint: '1024px',
      numVisible: 3
  },
  {
      breakpoint: '768px',
      numVisible: 2
  },
  {
      breakpoint: '560px',
      numVisible: 1
  }
];

const itemTemplate = (item) => {
  return (
    <div>
      <img
        src={item?.itemImageSrc}
        onError={(e) => e.target.src=''}
        alt={item?.alt}
        style={{ width: '100%', display: 'block' }}
      />
    </div>    
    );
}

const thumbnailTemplate = (item) => {
  return <img src={item.thumbnailImageSrc} onError={(e) => e.target.src=''} alt={item.alt} style={{ display: 'block' }} />;
}

export default function MyTimeline(){
    const menu = useRef(null);
    const [overlay, setOverlay] = useState(false)
    const [descendente, set_descendente] = useState(true)
    const [timeline_header, set_timeline_header] = useState('Timeline')
    const [video_id, set_video_id] = useState('Vqe4LSGmwOg')
    const [images, setImages] = useState([
      {"itemImageSrc": "images/galleria/galleria1.jpg","alt": "Description for Image 1","title": "Title 1"}
  ]);
    const [activeIndex, setActiveIndex] = useState(0)
    const historyService = new HistoryService();
    const [History, setHistory] = useState([])
    const [active_history, set_active_history] = useState([])
    const galleria = useRef(null);
    
    
    useEffect(() => {
      historyService.getTimeline().then(data => {
        setHistory(data)
        set_active_history([...data].reverse())
      });
    }, []);
    
    const debounce = (fn) => {

        // This holds the requestAnimationFrame reference, so we can cancel it if we wish
        let frame;
      
        // The debounce function returns a new function that can receive a variable number of arguments
        return (...params) => {
          
          // If the frame variable has been defined, clear it now, and queue for next frame
          if (frame) { 
            cancelAnimationFrame(frame);
          }
      
          // Queue our function call for the next frame
          frame = requestAnimationFrame(() => {
            
            // Call our function and pass any params we received
            fn(...params);
          });
      
        } 
      };
    // useEffect((e)=>{
    //     // console.log('Teste')
    //     const el = document.querySelector(".stickyMask")
    //     const observer = new IntersectionObserver( 
    //       ([e]) => e.target.classList.toggle("is-pinned", e.intersectionRatio < 1),
    //       { threshold: [1] }
    //     );
    //     observer.observe(el);
    //     const storeScroll = () => {
    //       if(window.scrollY>400){
    //         document.documentElement.dataset.scroll = 1;
    //       }else{
    //         document.documentElement.dataset.scroll = 0;
    //       }
          
    //     }
        
    //     // Listen for new scroll events, here we debounce our `storeScroll` function
    //     document.addEventListener('scroll', debounce(storeScroll), { passive: true });
        
    //     // Update scroll position for first time
    //     storeScroll();
    
    //     const scrollContainer = document.querySelector(".timeline_container");
    //     const timeline = document.querySelector(".timeline");
    
    //     scrollContainer.addEventListener("wheel", (evt) => {
    //       const sw = scrollContainer.scrollLeft+window.innerWidth
    //       const tw = timeline.offsetWidth
    //       // console.log(tw, sw)
    //       if(scrollContainer.scrollLeft > 0 && tw > sw) {
    //         evt.stopImmediatePropagation()
    //         evt.stopPropagation()
    //         evt.preventDefault()
    //       };
    //       const w_ratio = window.innerHeight/window.innerWidth
          
    //       scrollContainer.scrollLeft = (scrollContainer.scrollLeft + evt.deltaY*w_ratio);
    //     });
    
    //   })

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
    return (
    <div style={{
      // height:"600px",
    //   maxWidth:"100px",
      marginTop:"30px",
      zIndex:4,
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
    }}>{item.date}</h2>
      <Card
        style={{
          // position:"absolute",
        //   width:"333px",
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

  function apply_filter(event){
    console.log(event)
    var _active_history = [...History]
    _active_history = _active_history.filter((item)=>item.type == event.item.label)
    if(descendente) _active_history = _active_history.reverse()
    set_active_history(_active_history)
    set_timeline_header(IconSet[event.item.label].header)
  }
  
  const timeline_menu = [
    {
      label: 'Eventos',
      items: [
        {
          label: 'Todos',
          icon: 'pi pi-calendar',
          command: () => {
            var _active_history = [...History]
            if(descendente) _active_history = _active_history.reverse()
            set_active_history(_active_history)
            set_timeline_header('Timeline')
          }
        },
        {
          label: 'Projeto',
          icon: 'pi pi-briefcase',
          command: apply_filter
        },
        {
          label: 'Conquista',
          icon: 'pi pi-star',
          command: apply_filter
        },
        {
          label: 'Formação',
          icon: 'pi pi-book',
          command: apply_filter
        },
        {
          label: 'Emprego',
          icon: 'pi pi-building',
          command: apply_filter
        }
      ]
    }
  ];

  return(
    <>
      <div>
      <div style={{
          position:"sticky",
          zIndex:6,
          top:"0px",
          left:"15px",
          width:"100%",
          // backgroundColor:"#f004"
        }}>
          <h2 style={{
            position:"absolute",
            marginLeft:"70px",
            marginTop:"23px",
            zIndex:10,
            // color:"var(--matrix-primary)",
            fontFamily:"mars",
            fontWeight:"100",
            fontSize:"20px",
            textAlign:"center",
          }}>{timeline_header}</h2>
          <Toolbar
            style={{
              backdropFilter: "blur(7px)",
              backgroundColor:"#0000",
              borderColor:"#0000"
              // maxWidth:"335px"
            }}
            left={
              <Button
                className='
                  p-button-sm
                  p-button-rounded
                  p-button-outlined'
                style={{
                  // marginLeft:"30%",
                }}
                tooltip="Filtrar"
                icon="pi pi-filter"
                onClick={(event) => {
                  menu.current.toggle(event)
                }}
                aria-controls="popup_menu"
                aria-haspopup
              />
            }
            right={
              <Button 
                icon={descendente? 'pi pi-sort-numeric-down-alt': 'pi pi-sort-numeric-up-alt'}
                // label={descendente?'Descendente':'Ascendente'}
                className='
                  p-button-sm
                  p-button-rounded
                  p-button-outlined
                  mr-4'
                tooltip={`Ordem: ${descendente?'Descendente':'Ascendente'}`}
                tooltipOptions={{
                  position:"bottom"
                }}
                onClick={(e)=>{
                  var _active_history = [...active_history]
                  _active_history = _active_history.reverse()
                  
                  set_active_history(_active_history)
                  set_descendente(!descendente)
                }}
              />
            }
          />
        </div>
        <Menu model={timeline_menu} popup ref={menu} id="popup_menu" />
        <div style={{
            height:"140vh",
            marginTop:"-65px",
            paddingTop:"65px",
            marginBottom:"10px",
            maxWidth:"444px",
            overflowX:"hidden",
        }}>
          
            <Timeline
                style={{
                zIndex:3,
                width:"180%",
                }}
                value={active_history}
                // layout="horizontal"
                align="right"
                // className="customized-timeline"
                // opposite={customizedDate} 
                marker={customizedMarker}
                content={customizedContent}
            />
        </div>
      </div>
      <Dialog
          header="Video"
          visible={overlay}
          maximizable
          onHide={() => {setOverlay(false)}}
        >
          <div>
          <iframe style={{
            width:"50vw",
            height:"60vh",
            // aspectRatio:1,
            backgroundColor:"black"
          }} src={"https://www.youtube.com/embed/"+video_id} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        </Dialog>

        <Galleria
          ref={galleria}
          value={images}
          responsiveOptions={galleriaResponsive}
          activeIndex={activeIndex}
          onItemChange={(e) => setActiveIndex(e.index)}
          // numVisible={9}
          style={{
            // position:"absolute",
            // zIndex:10,
            maxWidth: '80vw',
            // maxHeight:'90vh'
          }}
          circular
          fullScreen
          showThumbnails={false}
          showIndicators
          showItemNavigators
          item={itemTemplate}
          // thumbnail={thumbnailTemplate}
        />
    </>
  )
}
