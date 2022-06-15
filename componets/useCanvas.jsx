import { useRef, useEffect, useState } from 'react'
import { Clock } from './Clock'

const useCanvas = (draw) => {
    const [canvas, setCanvas] = useState(null)
    const canvasRef = useRef(null)

    function resizeCanvas(event) {
        if(!canvas) return
        const { width, height } = canvas.getBoundingClientRect()
        if (canvas.width !== width || canvas.height !== height) {
            const { devicePixelRatio:ratio=1 } = window
            const context = canvas.getContext('2d')
            context.fillStyle = "#000"
            canvas.width = width*ratio
            canvas.height = height*ratio
            context.fillRect(0, 0, canvas.width, canvas.height)
            context.scale(ratio, ratio)
            return true
        }
        return false
    }

    useEffect(()=>{
        window.addEventListener('resize', resizeCanvas)
        resizeCanvas(canvas)
    },[canvas])

    useEffect(() => {
        const canvas = canvasRef.current
        setCanvas(canvas)
        const context = canvas.getContext('2d')
        let requestAnimationId
        let counter = 0
        const render = ctx => {
            draw(ctx, counter)
            counter++
            requestAnimationId = requestAnimationFrame(() => render(ctx))
        }
        render(context)
        return () => {
            cancelAnimationFrame(requestAnimationId)
        }
    })

  return canvasRef
}

export default useCanvas