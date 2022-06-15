
import React from "react";

function Floor(props) {
  return (
    <mesh {...props} recieveShadow>
      <boxBufferGeometry args={[20,1,30]} />
      <meshPhysicalMaterial attach="material" color='white' />
    </mesh>
  );
}

export default Floor;