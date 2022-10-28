import React from 'react';
import spinner from '../images/loader.gif';

export default () => {
  return (
    <div>
      <img
        src={spinner}
        style={{
          width: '100px',
          display: 'block',
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '99'
        }}
        alt="Loading ..."
      />
    </div>
  );
};
