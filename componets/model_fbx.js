import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useLoader } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { Select } from '@react-three/postprocessing'

export function loadFBXModel( fbxPath, options = { receiveShadow: true, castShadow: true }) {
  const { receiveShadow, castShadow } = options
  return new Promise((resolve, reject) => {
    const loader = new FBXLoader()

    loader.load(
      fbxPath,
      fbx => {
        // console.log(fbx)
        const obj = fbx
        
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

const Model = ({innerRef, children, ...props}) => {
  if(!props.path) return(<></>)
  const [fbx,setFbx] = useState(null)
  // const normalMap = useLoader(TextureLoader, '/model/earthnormalmap.jpg')
  if(fbx) return(
    <Suspense fallback={<></>}>
      <Select enabled={true}>
        <primitive ref={innerRef} object={fbx} scale={0.01} {...props}/>
      </Select>
      {/* <meshStandardMaterial normalMap={normalMap}/> */}
      
    </Suspense>
  )
  loadFBXModel(props.path, {
      // receiveShadow: false,
      // castShadow: false,
  }).then((data)=>{
      console.log(data)
      setFbx(data)
  })
};

export {Model}