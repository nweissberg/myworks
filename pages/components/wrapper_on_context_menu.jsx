import React, { useRef } from 'react';
import { ContextMenu } from 'primereact/contextmenu';

const ContextMenuWrapper = (props) => {
  const cm = useRef(null);
  return (<>
    	<ContextMenu model={props.menu} ref={cm} />
        <div {...props} onContextMenu={(e) => cm.current.show(e)}>
			{props.children}
      	</div>
    </>);
};

export default ContextMenuWrapper;
