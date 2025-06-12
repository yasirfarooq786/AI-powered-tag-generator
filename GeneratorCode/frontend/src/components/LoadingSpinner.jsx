import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizes = {
    small: '20px',
    medium: '30px',
    large: '50px'
  };

  return (
    <div className="loading-spinner" style={{ width: sizes[size], height: sizes[size] }}>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;