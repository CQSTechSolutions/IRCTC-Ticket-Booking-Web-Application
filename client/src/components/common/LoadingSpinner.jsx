import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-2 border-blue-600 border-r-2 border-blue-600 border-b-2 border-blue-600 border-l-2 border-transparent ${sizeClasses[size]}`}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner; 