import React from 'react';

const CardLabel = ({ leftHeader, rightAction, isDisconnect, ...rest }) => {
  return (
    <div className="card-label-container" {...rest}>
      <div className="card-label">{leftHeader}</div>
      {rightAction ? (
        <div className={`card-label ${isDisconnect ? 'disconnect-button' : 'action-button'}`}>{rightAction}</div>
      ) : null}
    </div>
  );
};

export default CardLabel;
