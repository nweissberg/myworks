import React, { useRef, useEffect } from 'react';

export default function ResizeWrapper({ children, onChildWidthChange }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentRect.width !== entry.contentRect.width) {
          onChildWidthChange();
          resizeObserver.disconnect();
          return;
        }
      }
    });

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const renderChildrenRecursively = (children) => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      const childProps = {};
      if (child.props && child.props.children) {
        childProps.children = renderChildrenRecursively(child.props.children);
      }

      return React.cloneElement(child, childProps);
    });
  };

  return (
    <div ref={wrapperRef}>
      {renderChildrenRecursively(children)}
    </div>
  );
}
