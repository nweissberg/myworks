import { useRef, useEffect, useState } from 'react'
import { Clock } from './Clock'

const useCanvas = (draw) => {
    const [canvas, setCanvas] = useState(null)
    const canvasRef = useRef(null)
    const [shouldRender, setShouldRender] = useState(true)

    function resizeCanvas(event) {
        if(!canvas) return
        const { width, height } = canvas.getBoundingClientRect()
        // if (canvas.width !== width || canvas.height !== height) {
            // var ratio = 1
            // const { devicePixelRatio:ratio=1 } = window
            const context = canvas.getContext("2d",{
                desynchronized:true,
                willReadFrequently:true
            });
            // context.fillStyle = "#000"
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            // context.fillRect(0, 0, canvas.width, canvas.height)
            // context.scale(0.5, 0.5)
            setShouldRender(true)
            return true
        // }
        return false
    }
    useEffect(()=>{
        window.addEventListener('resize', resizeCanvas)
        resizeCanvas(canvas)
    },[canvas])

    useEffect(() => {
        const canvas = canvasRef.current
        // console.log(canvas.attributes?.animate.value)
        setCanvas(canvas)
        const context = canvas.getContext('2d')
        let requestAnimationId
        let counter = 0
        const clock = new Clock()
        const render = ctx => {
            if( canvas.attributes?.animate?.value == 'once' && counter > 0){
                setShouldRender(false)
                cancelAnimationFrame(requestAnimationId)
                return
            }
            if (shouldRender) {
                // console.log(counter)
                draw(ctx, counter)
                setShouldRender(false)
                clock.start()
            }
            if (clock.getElapsedTime() > (canvas.attributes?.animate?.value ?0.01:0.06) ) {
                setShouldRender(true)
                counter++
            }
            requestAnimationId = requestAnimationFrame(() => render(ctx))
        
        }
        if(canvas.attributes?.animate?.value != 'once'){
            render(context)
        }else{
            render(context)
            cancelAnimationFrame(requestAnimationId)
        }
        return () => {
            cancelAnimationFrame(requestAnimationId)
        }
    })

  return canvasRef
}


export default useCanvas