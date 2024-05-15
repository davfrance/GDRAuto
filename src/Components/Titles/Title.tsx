import React from 'react';

function Title({
  children,
  contrast = false,
}: {
  children: React.ReactNode;
  contrast?: boolean;
}) {
  return (
    <div
      className={`text-2xl font-bold ${
        contrast ? 'text-secondary' : 'text-myWhite'
      }`}
    >
      {children}
    </div>
  );
}

export default Title;
