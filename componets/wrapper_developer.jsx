import React from 'react';

const DevelopmentWrapper = ({ children }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <>{children}</>;
};

export default DevelopmentWrapper;
