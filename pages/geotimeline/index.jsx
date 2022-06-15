import * as THREE from 'three'
import { Canvas, useFrame } from "@react-three/fiber";
import css from "../../styles/Teste.module.css";
import Floor from "../../componets/objects3D/Floor";
import LightBulb from "../../componets/objects3D/LightBulb"
import Box from "../../componets/objects3D/Box"
import Draggable from "../../componets/objects3D/Draggable"
// import OrbitControls from "../../componets/objects3D/OrbitControls"
import { Environment, ContactShadows, OrbitControls, TrackballControls } from '@react-three/drei'
import {Suspense, useEffect, useState} from "react";
import { Model } from "../../componets/model_fbx";
import { Clock } from "three";
import { KernelSize } from 'postprocessing'
import { EffectComposer, Bloom, Outline, Selection, Select } from '@react-three/postprocessing'
import { Marker } from '../../componets/objects3D/Marker';
import Pin from '../../componets/objects3D/Pin';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import TouchMask from '../planeta/TouchMask';
import TimeLine from './Timeline';

const latLngToVector3 = (latLng, radius=0.99) => {
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

export default function Teste() {
    const clock = new Clock();
    const [tick,setTick] = useState(0)
    useEffect(() => {
        var _tick = tick
        _tick += clock.getDelta()
        setTick(_tick)
    },[tick])
    return (
      <div className={css.scene}>
        {/* <TouchMask /> */}
        <TimeLine />
        <Canvas
            shadows={true}
            className={css.canvas}
            camera={{
                position: [-1.5, -0.7, 1.5],
            }}
            onCreated={({ gl }) => {
                gl.toneMapping = THREE.Uncharted2ToneMapping
                gl.setClearColor(new THREE.Color('#020207'))
            }}
        >   
            <ambientLight color={"green"} intensity={0.1} />
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
            <LightBulb position={[-20, 0, 20]} />
            
            <Pin name="Pompano Beach, FL, USA" position={latLngToVector3({ lat: 26.2378597, lng: -80.1247667 })} scale={0.015}/>
            
            <Pin name="São Paulo, State of São Paulo, Brazil" position={latLngToVector3({ lat: -23.5557714, lng: -46.6395571 })} scale={0.015}/>
            
            <Pin name="Vancouver, BC, Canada" position={latLngToVector3({ lat: 49.2827291, lng: -123.1207375 })} scale={0.015}/>

            <Pin name="Tel Aviv-Yafo, Israel" position={latLngToVector3({ lat: 32.0852999, lng: 34.78176759999999 })} scale={0.015}/>

            <Pin name="Bickenbach, Germany" position={latLngToVector3({ lat: 49.7560649, lng: 8.6110515 })} scale={0.015}/>

            <Pin name="Mexico City, CDMX, Mexico" position={latLngToVector3({ lat: 19.4326077, lng: -99.133208 })} scale={0.015}/>

            <Pin name="Rio de Janeiro, State of Rio de Janeiro, Brazil" position={latLngToVector3({ lat: -22.9068467, lng: -43.1728965 })} scale={0.015}/>

            <Pin name="Florianópolis, State of Santa Catarina, Brazil" position={latLngToVector3({ lat: -27.5948036, lng: -48.5569286 })} scale={0.015}/>
            
            {/* <OrbitControls
                enabled={false}
                // enableZoom={false}
                enablePan={false}
                // maxZoom={0}
                // minZoom={0}
                // minPolarAngle={0}
                // maxPolarAngle={Math.PI / 2.25}
                makeDefault
            /> */}
            <TrackballControls 
                noPan={true}
                noZoom={true}
                // rotateSpeed={2}
            />
        </Canvas>
      </div>
    );
  }