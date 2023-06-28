import React, { useRef, useEffect, useState } from 'react';

const WrapperCursor = ({ children, onScroll, onClick, onTouch, onRelease, onDrag, onMove, ...props }) => {
  const scrollableArea = useRef(null);
  const [speed, set_speed] = useState(0)
  // const [state, set_state] = useState(0)
  var intervalId
  var state = 0
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    state = 1
    if(onClick) onClick({x:e.clientX, y:e.clientY});
  };

  const handleTouch = (e) => {
    // console.log(e)
    // e.preventDefault()
    e.stopPropagation()
    state = 1
    let _pos = {x:e.touches[0].clientX, y:e.touches[0].clientY}
    if(onClick) onClick(_pos);
  };

  const handleRelease = (e) => {
    e.preventDefault()
    e.stopPropagation()
    state = 0
    if(onRelease) onRelease({x:e.clientX, y:e.clientY});
  };

  const handleMove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if(state == 1) state = 2
    if(onMove) onMove({x:e.clientX, y:e.clientY});
    if(onDrag && state > 1) onDrag({x:e.clientX, y:e.clientY});
  };
  
  const handleScroll = (e) => {
    // e.preventDefault()
    e.stopPropagation()
    set_speed(e.deltaY)
    onScroll(e.deltaY);
    // if(onMove) onMove({x:e.clientX, y:e.clientY});
    // console.log(speed)

    clearInterval(intervalId);

    intervalId = setInterval(() => {
      set_speed((prevSpeed) => {
        if (prevSpeed === 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevSpeed > 0 ? prevSpeed - 1 : prevSpeed + 1;
      });
    }, 5);

  };

  useEffect(() => {
    const node = scrollableArea.current;
    if(onScroll) node.addEventListener('wheel', handleScroll,{passive:true});
    if(onClick || onDrag) node.addEventListener('mousedown', handleClick);
    // if(onTouch ) node.addEventListener('touchmove', handleTouch,{passive:true});
    if(onRelease || onDrag) node.addEventListener('mouseup', handleRelease);
    if(onMove || onDrag) node.addEventListener('mousemove', handleMove);
    return () => {
      if(onScroll) node.removeEventListener('wheel', handleScroll,{passive:true});
      if(onClick || onDrag) node.removeEventListener('mousedown', handleClick);
      if(onRelease || onDrag) node.addEventListener('mouseup', handleRelease);
      if(onMove || onDrag) node.removeEventListener('mousemove', handleMove);
      // if(onTouch ) node.addEventListener('touchmove', handleTouch,{passive:true});
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div {...props}>
      <div ref={scrollableArea}
        // style={{maxWidth:'84%', maxHeight:'80%'}}
        className={'w-full top-0 left-0 h-full absolute '+ (Math.abs(speed)>0?"z-3":"z-2")}>
      </div>
        {children}
    </div>
  );
};

export default WrapperCursor;
