import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center mb-2.5">
        <div className="skeleton-item w-25 h-5 bg-[#ccc] rounded-sm mr-2.5"></div>
        <div className="skeleton-item w-25 h-5 bg-[#ccc] rounded-sm"></div>
      </div>
      <div className="flex items-center mb-2.5">
        <div className="skeleton-item w-25 h-5 bg-[#ccc] rounded-sm mr-2.5"></div>
        <div className="skeleton-item w-25 h-5 bg-[#ccc] rounded-sm"></div>
      </div>
      <div className="flex items-center mb-2.5">
        <div className="skeleton-item w-25 h-5 bg-[#ccc] rounded-sm mr-2.5"></div>
        <div className="skeleton-item w-25 h-5 bg-[#ccc] rounded-sm"></div>
      </div>
    </div>
  );
};

export default Loader