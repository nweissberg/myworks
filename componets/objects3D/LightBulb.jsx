import React from "react";

function LightBulb(props) {
  return (
    <mesh {...props} >
      <pointLight castShadow={false} intensity={0.2}/>
      {/* <sphereBufferGeometry args={[0.2s, 30, 10]} /> */}
      {/* <meshPhongMaterial emissive={"yellow"}  /> */}
    </mesh>
  );
}

export default LightBulb;