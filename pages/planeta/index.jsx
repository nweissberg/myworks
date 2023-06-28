import * as THREE from 'three'
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import css from "../../styles/Teste.module.css";
// import Floor from "../../componets/objects3D/Floor";
import LightBulb from "../../componets/objects3D/LightBulb"
// import Box from "../../componets/objects3D/Box"
// import Draggable from "../../componets/objects3D/Draggable"
// import OrbitControls from "../../componets/objects3D/OrbitControls"
import { useScroll, ScrollControls, OrbitControls, TrackballControls } from '@react-three/drei'
import {Suspense, useRef, useState, useEffect} from "react";
import { Model } from "../../componets/model_fbx";
// import { Clock } from "three";
import { KernelSize } from 'postprocessing'
import { EffectComposer, Bloom, Outline, Selection, Select } from '@react-three/postprocessing'
// import { Marker } from '../../componets/objects3D/Marker';
import Pin from '../../componets/objects3D/Pin';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import TouchMask from './TouchMask';
import { useUtils } from '../utils';

const latLngToVector3 = (latLng, radius=1.05) => {
    const phi = Math.PI * (0.5 - (latLng.lat / 180));
    const theta = Math.PI * (latLng.lng / 180);
    const spherical = new THREE.Spherical(radius || latLng.radius || 1, phi, theta);
    return new THREE.Vector3().setFromSpherical(spherical);
};

const vector3ToLatLng = (v3) => {
    const spherical = new THREE.Spherical().setFromVector3(v3);
    return {
        lat: 180 * (0.5 - (spherical.phi / Math.PI)),
        lng: 180 * (spherical.theta / Math.PI),
    };
};

// convert to x,y,z with radius = 1
// const v3 = latLngToVector3({ lat: 40.7127753, lng: -74.0059728 });

// convert back to lat/lng
// const latLng = vector3ToLatLng(v3);

// console.log(v3, latLng)


const Planet_Mesh = () => {
    const scroll = useScroll()
    const refMesh = useRef();
    const { invalidate, camera, gl } = useThree()
    
    // useEffect(() => {
    //     if(refMesh.current && refMesh.current.isObject3D) {
    //         refMesh.current.addEventListener('change', invalidate)
    //         return () => refMesh.current.removeEventListener('change', invalidate)
    //     }
    // }, [])
    
    useFrame(() => {
        // if(scroll) console.log(scroll)
        if(refMesh.current && refMesh.current.isObject3D && scroll) {
            // rotates the object
            // console.log(refMesh.current)
            refMesh.current = scroll.offset;
        }
    });
    return (<Model innerRef={refMesh} path="/model/earth_lowpoly.fbx" position={[0, 0, 0]} rotation-y={-Math.PI / 5.7}/>);
  }

export default function Planeta(props) {
    const {is_mobile} = useUtils()
    const [wait_loader, set_wait_loader] = useState(true)
    useEffect(()=>{
        setTimeout(()=>{set_wait_loader(false)},5000)
    },[])
    // const ref = useRef()
    // const scroll = useScroll()
    // const clock = new Clock();
    const [tick,setTick] = useState(0)
    // useFrame(() => {
    //     console.log(scroll.offset)
    //     return(ref.current.position.z = scroll.offset * 120)
    // })
    // useEffect(() => {
    //     var _tick = tick
    //     _tick += clock.getDelta()
    //     setTick(_tick)
    // },[tick])
    return (
    <div className="grabbable" style={{
        position:"absolute",
        top:'calc( -100px + (100vw * 0.1))',
        height:"100%",
        width:"100%",
        ... props.style}}>
        {/* <TouchMask /> */}
        <Suspense fallback={<span>loading...</span>}>
            <Canvas
                frameloop={wait_loader?"always":"demand"}
                shadows={true}
                className={'flex '}
                camera={{
                    position: [-1.5, -0.7, 1.5],
                }}
                onCreated={({ gl }) => {
                    // gl.toneMapping = THREE.Uncharted2ToneMapping
                    // gl.setClearColor(new THREE.Color('#020207'))
                }}
            >   
                <ambientLight color={"green"} intensity={0.7} />
                
                {is_mobile? <Suspense> <Planet_Mesh /></Suspense> : <Suspense>
                    <Selection>
                        <EffectComposer multisampling={6} autoClear={false}>
                    
                            <Outline
                                visibleEdgeColor="#3f6"
                                blur={1} edgeStrength={0.1} width={200} />
                            {/* <Bloom
                                kernelSize={1}
                                luminanceThreshold={0.2}
                                luminanceSmoothing={0.1}
                                intensity={3}
                            />
                            <Bloom
                                kernelSize={KernelSize.HUGE}
                                luminanceThreshold={0}
                                luminanceSmoothing={0.3}
                                intensity={0.3}
                            /> */}
                        </EffectComposer>
                        
                        {/* <Model path="/model/Earth.fbx" position={[0, 0, 0]} rotation-y={-Math.PI / 5.7}/> */}
                        <Planet_Mesh />
                        {/* rotation-y={Math.PI / 10} */}
                        
                    </Selection>
                </Suspense>}
                <LightBulb position={[-20, 0, 20]} />
                
                <Pin type='Conquista' name="Pompano Beach, FL, USA" position={latLngToVector3({ lat: 26.2378597, lng: -80.1247667 })} scale={0.015}/>
                
                <Pin type='Conquista' name="São Paulo, State of São Paulo, Brazil" position={latLngToVector3({ lat: -23.5557714, lng: -46.6395571 })} scale={0.015}/>
                
                <Pin type='Conquista' name="Vancouver, BC, Canada" position={latLngToVector3({ lat: 49.2827291, lng: -123.1207375 })} scale={0.015}/>

                <Pin type='Conquista' name="Tel Aviv-Yafo, Israel" position={latLngToVector3({ lat: 32.0852999, lng: 34.78176759999999 })} scale={0.015}/>

                <Pin type='Conquista' name="Bickenbach, Germany" position={latLngToVector3({ lat: 49.7560649, lng: 8.6110515 })} scale={0.015}/>

                <Pin type='Conquista' name="Mexico City, CDMX, Mexico" position={latLngToVector3({ lat: 19.4326077, lng: -99.133208 })} scale={0.015}/>

                <Pin type='Conquista' name="Rio de Janeiro, State of Rio de Janeiro, Brazil" position={latLngToVector3({ lat: -22.9068467, lng: -43.1728965 })} scale={0.015}/>

                <Pin type='Conquista' name="Florianópolis, State of Santa Catarina, Brazil" position={latLngToVector3({ lat: -27.5948036, lng: -48.5569286 })} scale={0.015}/>
                
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    makeDefault
                />
                {/* <TrackballControls 
                    noPan={true}
                    noZoom={true}
                    // rotateSpeed={2}
                /> */}
            </Canvas>
        </Suspense>
      </div>
    );
  }