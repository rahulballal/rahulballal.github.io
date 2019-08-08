import React from 'react';

export default ({
  heading,
  children
}) => {
  return (
    <div className="w-full">
      <p className="text-lg font-semibold underline">{heading}</p>
      <div>
        {children}
      </div>
    </div>
  )
}