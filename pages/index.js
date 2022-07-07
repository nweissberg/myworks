
import styles from '../styles/Home.module.css'
import { Clock } from '../componets/Clock';
import { useRouter } from 'next/router'
import MyTimeline from './components/mytimeline';
import UserProfile from './components/user_profile';
import MatrixBackGround from './components/matrix_bg';
import Planeta from './planeta';
import { api_get } from './api/connect';
import { useEffect } from 'react';


var BASE64_MARKER = ';base64,';

function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

function playOutput(data){
  let audioContext = new AudioContext();
  let outputSource;
  var arrayBuffer =  new Uint16Array(data).buffer
  try {
      if(arrayBuffer.byteLength > 0){
          // 2)
          audioContext.decodeAudioData(arrayBuffer,
          function(buffer){
              // 3)
              audioContext.resume();
              outputSource = audioContext.createBufferSource();
              outputSource.connect(audioContext.destination);
              outputSource.buffer = buffer;
              outputSource.start(0);
          },
          function(){
              console.log(arguments);
          });
      }
  } catch(e) {
      console.log(e);
  }
 }

export default function Home() {
  
  
  const clock = new Clock
  var tick = 0
  
  const router = useRouter()

  useEffect(()=>{
    api_get({
      route:'synthesize',
      body:{
        ssml:`
        <speak>
          <emphasis level="strong">Ser</emphasis>
          <break time="300ms"/>
          ou não ser,
          <break time="600ms"/>
          <emphasis level="moderate">eis</emphasis>
          a questão.
        </speak>`
      }
    })
    .then((response)=>{
      var audioData = new Uint8Array(response.audioContent.data);
      const blob = new Blob([audioData.buffer],{type:'audio/mp3'});
      new Audio( URL.createObjectURL(blob) ).play()
    })
  },[])
  
  return (
    <div className={styles.main}>
      <div style={{zIndex:1}}>
        <MatrixBackGround/>
      </div>
      
      
      
      <div style={{
        position:"absolute",
        width:"100vw",
        height:"100vh",
        overflowX:"hidden"
        // backgroundColor:"red"
      }} className='flex justify-content-center flex-wrap'>
        <div className="
            flex-1
            flex-order-2
            md:flex-order-0
            flex
            justify-content-start"
          >
            <MyTimeline />
        </div>
        <div
          className="
            flex-grow-1
            flex-order-0
            md:flex-1
            lg:flex-order-1
            flex
            pt-3"
          style={{
            zIndex:3,
            pointerEvents:"none",
            width:"100%"
          }}>
            <UserProfile />
          
        </div>
        
      </div>
      <div style={{
        position:"absolute",
        // top:"10px",
        // marginRight:"100px",
        overflow:"hidden",
        width:"100vw",
        height:"100vh",
        zIndex:2
        }}>
          <div style={{
            position:"absolute",
            left:"calc(-20vw + 200px)",
            width:"100vw",
            height:"100vh",
          }}>
            <Planeta/>
          </div>
        
      </div>
      
      
      
      
      
    </div>
    
  )
}
