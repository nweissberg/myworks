import React from "react";
// import { useLoader } from "@react-three/fiber";
// import { TextureLoader } from "three";

function Box(props) {
  // const texture = useLoader(TextureLoader, "/image/texture/weathered_brown_planks/diff.jpg");
  return (
    <mesh {...props} recieveShadow castShadow>
      <boxBufferGeometry />
      {/* <meshPhysicalMaterial map={texture} color={"white"} /> */}
    </mesh>
  );
}

export default Box;