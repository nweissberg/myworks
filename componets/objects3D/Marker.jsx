import { Html } from '@react-three/drei'
import { useState } from 'react'
// Let's make the marker into a component so that we can abstract some shared logic
export function Marker({ children, ...props }) {
    // This holds the local occluded state
    const [occluded, occlude] = useState()
    return (
      <Html
        // 3D-transform contents
        transform
        // Hide contents "behind" other meshes
        occlude
        // Tells us when contents are occluded (or not)
        onOcclude={occlude}
        // We just interpolate the visible state into css opacity and transforms
        style={{
            transition: 'all 0.2s',
            opacity: occluded ? 0 : 1,
            transform: `scale(${occluded ? 0.25 : 1})`
        }}
        {...props}>
        {children}
      </Html>
    )
  }