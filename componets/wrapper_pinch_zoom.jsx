import React, { useRef, useEffect, useState } from 'react';
import { print } from '../pages/utils';

const PinchZoom = ( props ) => {
  const containerRef = useRef(null);
  const [pointer, set_pointer] = useState(null);
  
  useEffect(() => {
    const containerElement = containerRef.current;
    const { x, y, width, height } = containerRef.current.getBoundingClientRect();
    containerElement.style.transition= "all 500ms";
    
    // const width = containerElement.offsetWidth;
    // const height = containerElement.offsetHeight;

    let elementScale = 1;
    let position = {x:0,y:0};
    let start = {...position,distance:20};
    let scale = 1;
    let touch_count = 0

    // Calculate distance between two fingers
    const distance = (event) => {
      return Math.hypot(
        event.touches[0].pageX - event.touches[1].pageX,
        event.touches[0].pageY - event.touches[1].pageY
      );
    };

    const handleWheel = (event) => {
      handleScroll(event);
    };
  
    const handleScroll = (event) => {
      event.preventDefault();
      event.stopPropagation();
      scale -= event.deltaY*0.01
      elementScale = Math.min(Math.max(1, scale), 4);

      
      if(elementScale == 1 && event.deltaY > 0){
        containerElement.style.zIndex = '';
        position = {x:0,y:0};
      }else{
        position.x = -( (event.pageX/elementScale) - (x + position.x)/elementScale)+((width)/elementScale);
        position.y = -( (event.pageY/elementScale) - (y + position.y)/elementScale)+((height)/elementScale);
        containerElement.style.zIndex = '2';
      }
      // if(position.x*elementScale < -width) position.x = -width
      const transform = `translate3d(${ position.x*elementScale }px, ${ position.y*elementScale }px, 0) scale(${elementScale})`;
      containerElement.style.transform = transform;
      containerElement.style.WebkitTransform = transform;
      scale = elementScale
      // console.log(position,x,y)
    };

    const handleMouseDown = (event) => {
      // console.log(event, position)
      containerElement.style.transition= "all 500ms";
      event.preventDefault(); // Prevent page scroll
      event.stopPropagation();

      start.x = ((event.pageX*scale )- position.x);
      start.y = ((event.pageY*scale )- position.y);
      touch_count = 1
    };

    const handleMouseMove = (event) => {
      // console.log(event)
      containerElement.style.cursor= "grab";
      if(touch_count == 0) {
        // start.x = (event.pageX - position.x);
        // start.y = (event.pageY - position.y);
        return
      }
      containerElement.style.cursor= "grabbing";
      containerElement.style.transition= "all 33ms";
      event.preventDefault(); // Prevent page scroll

      position.x = ((event.pageX*scale) - (start.x) )/(scale);
      position.y = ((event.pageY*scale) - (start.y) )/(scale);

      const transform = `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`;
      containerElement.style.transform = transform;
      containerElement.style.WebkitTransform = transform;
      containerElement.style.zIndex = '2';
      touch_count = 2
      // console.log(position,x,y)
    
    };

    const handleMouseUp = (event) => {
      // console.log(event)
      event.preventDefault(); // Prevent page scroll
      containerElement.style.transition= "all 333ms";
      touch_count = 0
      if(scale == 1){
        // position = {x:0,y:0};
        containerElement.style.transform = '';
        containerElement.style.WebkitTransform = '';
        containerElement.style.zIndex = '';
      }
    };

    const handleTouchStart = (event) => {
      if (event.touches.length === 2) {
        if(touch_count < 2) touch_count = 2
        containerElement.style.transition= "all 500ms";
        event.preventDefault(); // Prevent page scroll
        scale = elementScale
        // Calculate where the fingers have started on the X and Y axis
        start.x = ((event.touches[0].pageX + event.touches[1].pageX)/ 2 )- position.x ;
        start.y = ((event.touches[0].pageY + event.touches[1].pageY)/ 2 )- position.y ;
        start.distance = distance(event)/elementScale;
      }else if(touch_count <= 1){
        touch_count = 1
        start.x = (event.touches[0].pageX - position.x);
        start.y = (event.touches[0].pageY - position.y);
      }
    };

    const handleTouchMove = (event) => {
      // Get width and height of the container element
      containerElement.style.transition= "all 33ms";
      
      var transform = ''
      if (event.touches.length === 2) {
        if(touch_count < 2) touch_count = 2
        event.preventDefault(); // Prevent page scroll
        
        // Safari provides event.scale as two fingers move on the screen
        // For other browsers just calculate the scale manually
        if (event.scale) {
          scale = event.scale;
        } else {
          const deltaDistance = distance(event);
          scale = deltaDistance / start.distance;
        }

        elementScale = Math.min(Math.max(1, scale), 4);

        // Calculate how much the fingers have moved on the X and Y axis
        const deltaX = (((event.touches[0].pageX + event.touches[1].pageX) / 2) - start.x) * (elementScale/2); // x2 for accelerated movement
        const deltaY = (((event.touches[0].pageY + event.touches[1].pageY) / 2) - start.y) * (elementScale/2); // x2 for accelerated movement
        
        position = {x:deltaX, y:deltaY}

      }else if(touch_count <= 1){
        touch_count = 1
        elementScale = Math.min(Math.max(1, scale), 4);
        // Calculate how much the fingers have moved on the X and Y axis
        position.x = (event.touches[0].pageX - start.x);
        position.y = (event.touches[0].pageY - start.y);

        // Transform the element to make it grow and move with fingers
      }
      
      transform = `translate3d(${position.x}px, ${position.y}px, 0) scale(${elementScale})`;
      containerElement.style.transform = transform;
      containerElement.style.WebkitTransform = transform;
      containerElement.style.zIndex = '2';
    };

    const handleTouchEnd = (event) => {
      containerElement.style.transition= "all 100ms";
      // if(position.x - (width*elementScale) > - window.innerWidth*0.5 ) position.x = (width*elementScale) - window.innerWidth*0.5
      // if(position.x + (width*elementScale) < window.innerWidth*0.5 ) position.x = -(width*elementScale) +window.innerWidth*0.5
      const transform = `translate3d(${position.x}px, ${position.y}px, 0) scale(${1})`;
      containerElement.style.transform = transform;
      containerElement.style.WebkitTransform = transform;
      handleReset(event)
      touch_count = 0
    };

    const handleReset = (event) => {
      if(scale == 1){
        props.onReset?.()
        // scale = 4;
        // const deltaX = (width*scale) - (start.x*scale)
        // const deltaY = (height*scale) - (start.y*scale)
        // position = {x:deltaX, y:deltaY}
        // const transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`;
        // containerElement.style.transform = transform;
        // containerElement.style.WebkitTransform = transform;
      }
        scale = 1;
        position = {x:0,y:0};
        containerElement.style.transform =  `translate3d(${0}px, ${0}px, 0) scale(${1})`;
        containerElement.style.WebkitTransform = '';
        containerElement.style.zIndex = '';
      // }
    };

    if(!props.mobile){
      containerElement.addEventListener('wheel', handleWheel,{ passive: false });
      containerElement.addEventListener('scroll', handleScroll, { passive: false });
      containerElement.addEventListener('mousedown', handleMouseDown);
      containerElement.addEventListener('mousemove', handleMouseMove);
      containerElement.addEventListener('mouseup', handleMouseUp);
    }

    containerElement.addEventListener('touchstart', handleTouchStart,{ passive: true });
    containerElement.addEventListener('touchmove', handleTouchMove,{ passive: true });
    containerElement.addEventListener('dblclick', handleReset);
    containerElement.addEventListener('touchend', handleTouchEnd);

    
    return () => {
      // Cleanup event listeners on unmount
      if(!props.mobile){
        containerElement.removeEventListener('wheel', handleWheel);
        containerElement.removeEventListener('scroll', handleScroll);
        containerElement.removeEventListener('mousedown', handleMouseDown);
        containerElement.removeEventListener('mousemove', handleMouseMove);
        containerElement.removeEventListener('mouseup', handleMouseUp);
      }
      containerElement.removeEventListener('touchstart', handleTouchStart);
      containerElement.removeEventListener('touchmove', handleTouchMove);
      containerElement.removeEventListener('dblclick', handleReset);
      containerElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return <div {...props} ref={containerRef}>
    <>
      {pointer && <label>{JSON.stringify(pointer)}</label>}
      {props.children}
    </>
  </div>;
};

export default PinchZoom;
