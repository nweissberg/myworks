import * as THREE from 'three'
import { Canvas, useFrame } from "@react-three/fiber";
import css from "../../styles/Teste.module.css";
import Floor from "../../componets/objects3D/Floor";
import LightBulb from "../../componets/objects3D/LightBulb"
import Box from "../../componets/objects3D/Box"
import Draggable from "../../componets/objects3D/Draggable"
// import OrbitControls from "../../componets/objects3D/OrbitControls"
import { Environment, ContactShadows, OrbitControls, TrackballControls } from '@react-three/drei'
import React, { Suspense, useEffect, useState} from "react";
import { Model } from "../../componets/model_fbx";
import { Clock } from "three";
import { KernelSize } from 'postprocessing'
import { EffectComposer, Bloom, Outline, Selection, Select } from '@react-three/postprocessing'
import { Marker } from '../../componets/objects3D/Marker';
import Pin from '../../componets/objects3D/Pin';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import TouchMask from '../planeta/TouchMask';
// import TimeLine from './Timeline';
import { useAuth } from '../api/auth';
import { useRouter } from 'next/router'
import { add_data } from '../api/firebase';

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

export default class TimeLine extends React.Component {
	constructor(props) {
		super(props);
		console.log(props)
		this.state = {
    
        }
    }
    // const { currentUser } = useAuth()
    // const router = useRouter()
    // const clock = new Clock();
    // const [tick,setTick] = useState(0)
    // const [pins, set_pins] = useState([
    //     {
    //         id:"01",
    //         address:"South",
    //         location:{ lat: 270, lng: 0 }
    //     }
    // ])

    // useEffect(()=>{
    //     console.log(currentUser)
    //     // if(currentUser === null) router.push('/login')
    // }, [currentUser])

    // const savetest = (e)=>{
    //     // add_data;
    //     console.log(e,currentUser)
    // }
    render(){
        return (
        <div className={css.scene}>
            {/* <TouchMask /> */}
            {/* <TimeLine
            
                user={currentUser}
                setPins={(data)=>{
                    // if(data) set_pins([...pins,...data])
                    set_pins(data)
                }}
            /> */}
            <Canvas
                style={{zIndex:1}}
                frameloop="demand"
                shadows={true}
                className={css.canvas}
                camera={{
                    position: [-1.5, -0.7, 1.5],
                }}
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.Uncharted2ToneMapping
                    // gl.setClearColor(new THREE.Color('#020207'))
                }}
            >   
                <ambientLight color={"pink"} intensity={0.1} />
                <Suspense>
                    <Selection>
                        <EffectComposer multisampling={6} autoClear={false}>
                    
                            <Outline
                                visibleEdgeColor="#0088FF"
                                blur={10} edgeStrength={0.1} width={100} />
                            <Bloom
                                kernelSize={1}
                                luminanceThreshold={0}
                                luminanceSmoothing={0.4}
                                intensity={0.6}
                            />
                            <Bloom
                                kernelSize={KernelSize.HUGE}
                                luminanceThreshold={0}
                                luminanceSmoothing={0.3}
                                intensity={0.3}
                            />
                        </EffectComposer>
                        
                        <Model path="/model/Earth.fbx" position={[0, 0, 0]} rotation-y={-Math.PI / 5.7}/>
                        {/* rotation-y={Math.PI / 10} */}
                        
                    </Selection>
                </Suspense>
                {/* <Marker rotation={[0, 0, 0]} position={[0, 1, 0]}>
                    <div className="pi pi-map-marker marker3D" style={{fontSize: "7px"}} />
                </Marker>

                <Marker rotation={[0, Math.PI / 2, Math.PI / 2]} position={[0, 0, 1.0]}>
                    <div className="pi pi-map-marker marker3D" style={{fontSize: "7px"}} />
                </Marker> */}
                {/* <LightBulb position={[-20, 0, 20]} /> */}
                {this.props.pins.map((item)=>{
                    // console.log(item)
                    return(<Pin key={item.id} name={item.address} position={latLngToVector3(item.location)} scale={0.015}/>)
                })}
            
                <OrbitControls
                    // enabled={false}
                    // enableZoom={false}
                    enablePan={false}
                    // maxZoom={0}
                    // minZoom={0}
                    // minPolarAngle={0}
                    // maxPolarAngle={Math.PI / 2.25}
                    makeDefault
                />
                {/* <TrackballControls 
                    noPan={true}
                    noZoom={true}
                    // rotateSpeed={2}
                /> */}
            </Canvas>
        </div>
        );
    }
  }