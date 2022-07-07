import React, { useState, useRef,useLayoutEffect } from "react";
import { Box, Html } from "@react-three/drei";
import { Marker } from "./Marker";
import { getIcons } from "../../pages/components/timeline_marker"
function Pin(props) {
  const [occluded, occlude] = useState()
  const mesh = useRef(null)
  const pin = useRef(null)
  const IconSet = getIcons()

  useLayoutEffect(() => {
    mesh.current.lookAt(0, 0, 0)
    pin.current.position.z = 2
  }, [])
  // const label_position = props.position.clone().multiplyScalar(5)
  return (
    
    <mesh ref={mesh} {...props} recieveShadow castShadow>
      <mesh ref={pin}>
        <boxGeometry raycast={null} args={[0.1,0.1,4]} />
        <meshBasicMaterial  />
      </mesh>
      <pointLight color={IconSet[props.type]?.color}/>
      {/* <boxBufferGeometry args={[20,0.1,0.1]}/> */}
      <boxGeometry args={[1, 1, 1]}/>
      <meshBasicMaterial color={IconSet[props.type]?.color} />
      <Html {...props}
        transform
        occlude
        onOcclude={occlude}
        >
              
      </Html>
      <Html>
        <div className="map_marker"
        style={{
          transition: 'transform 0.2s',
          transform:`scale(${occluded ? 0 : 1})`
        }}
        >  
            <div style={{
              // transition: 'transform 0.2s',
              pointerEvents: "none",
              // backgroundColor:"#fff3",
              height:"200px",
              width:"400px",
              top:"calc(-100px + calc(var(--marker-size) * 0.5))",
              // left:"calc(-200px + calc(var(--marker-size) * 0.5))",
              position:"absolute",
              marginLeft: "auto",
              marginRight: "auto", 
              
              // transform: `scale(${occluded ? 0 : 1})`
            }}>
              <div style={{
                position:"absolute",
                zIndex:10,
              }} className="pin_card">
                <div style={{zIndex:100}}>{props.name}</div>
              </div>
            </div>
          </div>
        </Html>
    </mesh>
    
    
  );
}

export default Pin;