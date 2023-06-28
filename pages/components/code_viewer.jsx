import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import beautify_js from 'js-beautify';
import { KeyboardListener } from '../../componets/wrapper_keyboard';
import hljs from 'highlight.js/lib/core';

// import the languages you need
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';

// import the styles you need // androidstudio | agate | rainbow | atom-one-dark |
import 'highlight.js/styles/rainbow.css';

// register the languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);

const CodeViewer = ({ code, header, language='json', reload, hidden=true }) => {
  const codeRef = useRef(null);
  const [showCode, setShowCode] = useState(!hidden);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightBlock(codeRef.current);
    }
  }, [code,showCode]);

  const beautifiedCode = beautify_js(JSON.stringify(code), {
    indent_size: 4,
    space_in_empty_paren: true,
  });
  
  return (
    <div className='pointer-events-none flex fixed top-0 left-0 z-3 justify-content-center align-items-center w-screen h-screen'>
      {showCode && <div className='fadein animation-duration-500 animation-iteration-1 scrollbar-none pointer-events-none fixed top-0 left-0 h-screen w-full z-1 overflow-scroll bg-black-alpha-80 bg-blur-3'>
          <div className='pt-8 pointer-events-none absolute bg-white-alpha-1 left-0 top-0 m-0 p-0 w-auto h-auto flex z-1'>
              <pre className='fadein animation-duration-400 animation-iteration-1 relative pointer-events-auto hljs z-2'>
                  <code ref={codeRef} className={'language-json'}>
                    {beautifiedCode}
                  </code>
              </pre>
          </div>
      </div>}
      {header && showCode && <div className='fadeinup animation-duration-300 animation-iteration-1 absolute bg-blur-1 bg-gradient-top flex w-full top-0 h-5rem z-3'>
        <h3 className='fixed top-0 left-0 m-0 p-0 z-1 p-5'>{header}</h3>
        <KeyboardListener onKey={(key) => {
          console.log(key)
         
          switch (key) {
            case 'escape':
              setShowCode(false)
              break;

            case 'f1':
              setShowCode(true)
              break;
            
            case 'f5' || 'r':
              reload?.(true)
              break;

            default:
              break;
          }
        }}/>
      </div>}
      
        <Button
            icon='pi pi-code'
            className='pointer-events-auto absolute bottom-0 right-0 m-3 z-1 p-button-rouded p-button-outlined p-button-rounded p-button-lg p-5 border-3 bg-black-alpha-50 bg-blur-2 text-matrix'
            onClick={() => {
              setShowCode(!showCode)
            }}
        />
        
    </div>
  );
};

export default CodeViewer;
