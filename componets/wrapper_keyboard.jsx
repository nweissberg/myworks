import React, { Children, useEffect } from 'react';

export function KeyboardListener({children, block=false,  keys = [], onKey=(k)=>{console.log(k)}, ...props }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if(block == true || ((event.key.length == 2 && event.key.toLowerCase()[0] == "f") && !event.ctrlKey == true) ){
        event.preventDefault()
        event.stopPropagation()
      }
      if (onKey && (keys.length == 0 || keys.includes(event.key))) {
        onKey(event.key.toLowerCase());
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [props]);

  return (null);
}
