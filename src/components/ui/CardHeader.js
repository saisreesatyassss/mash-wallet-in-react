import React from 'react';

const CardHeader = ({ children, id }) => {
  return (
    <div id={id} className="card-header">
      {children}
    </div>
  );
};

export default CardHeader;
