import React, { useRef, useEffect } from 'react'
import useCanvas from './useCanvas'

const Canvas = props => {  
  const { draw, worker_canvas, ...rest } = props
  const canvasRef = useCanvas(draw)
  const off_canvas_ref = useRef(null)
  let off_canvas = null

  useEffect(() => {
    if (worker_canvas && off_canvas_ref.current) {
      off_canvas = document.createElement('canvas')//off_canvas_ref.current//document.getElementById("worker_canvas");
      off_canvas.width = canvasRef.current.width
      off_canvas.height = canvasRef.current.height
      off_canvas.className='pointer-events-none flex absolute top-0 left-0 w-full h-full z-2'
      off_canvas_ref.current.appendChild(off_canvas)
      if (off_canvas) {
        const offscreen = off_canvas.transferControlToOffscreen()
        worker_canvas(offscreen)
      }
    }

    return () => {
      if (off_canvas && off_canvas_ref.current) {
        off_canvas_ref.current.removeChild(off_canvas)
      }
    }
  }, [off_canvas_ref, worker_canvas])

  return (
    <div ref={off_canvas_ref} className={rest.className}>
      <canvas ref={canvasRef} {...rest} />
    </div>
  )
}

export default Canvas
