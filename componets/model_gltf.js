import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Suspense, useState } from 'react'

export function loadGLTFModel(
  glbPath,
  options = { receiveShadow: true, castShadow: true }
) {
  const { receiveShadow, castShadow } = options
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()

    loader.load(
      glbPath,
      gltf => {
        console.log(gltf)
        const obj = gltf.scene
        
        obj.receiveShadow = receiveShadow
        obj.castShadow = castShadow
        // scene.add(obj)

        obj.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = castShadow
            child.receiveShadow = receiveShadow
          }
        })
        resolve(obj)
      },
      undefined,
      function (error) {
        reject(error)
      }
    )
  })
}
const Model = (props={}) => {
  if(!props.path) return(<></>)
  const [gltf,setGltf] = useState(null)
  if(gltf) return(
    <Suspense>
      <primitive object={gltf} scale={1} {...props}/>
    </Suspense>
  )
  loadGLTFModel(props.path, {
      receiveShadow: false,
      castShadow: false,
  }).then((data)=>{
      // console.log(data)
      setGltf(data)
  })
}
export {Model}