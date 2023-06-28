import React, { useRef, useEffect } from 'react'
import useCanvas from './useCanvas'

const Canvas = props => {  
  const { draw, worker_canvas, ...rest } = props
  const canvas_front = draw?.front? useCanvas(draw?.front) : null
  const canvas_center = draw?.center? useCanvas(draw?.center) : null
  const canvas_background = draw?.background? useCanvas(draw?.background) : null
  // const off_canvas_ref = useRef(null)
  // let off_canvas = null

  // useEffect(() => {
  //   if (worker_canvas && off_canvas_ref.current) {
  //     if(off_canvas == null){
  //       off_canvas = document.createElement('canvas')//off_canvas_ref.current//document.getElementById("worker_canvas");
  //       // off_canvas.willReadFrequently = true
  //       off_canvas.width = canvasRef.current.width
  //       off_canvas.height = canvasRef.current.height
  //       off_canvas.className='pointer-events-none flex absolute top-0 left-0 w-full h-full z-2'
  //       off_canvas_ref.current.appendChild(off_canvas)
  //     }else{
  //       const offscreen = off_canvas.transferControlToOffscreen()
  //       worker_canvas(offscreen)
  //     }
  //   }

  //   return () => {
  //     if (off_canvas && off_canvas_ref.current) {
  //       // off_canvas_ref.current.removeChild(off_canvas)
  //     }
  //   }
  // }, [])

  return (
    <div className={rest.className}>
      {draw.background && <canvas ref={canvas_background} {...rest} />}
      {draw.center && <canvas ref={canvas_center} {...rest} />}
      {draw.front && <canvas ref={canvas_front} {...rest} className='absolute top-0 left-0 w-full h-full' />}
    </div>
  )
}

export default Canvas
