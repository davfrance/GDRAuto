import React from 'react';

function Title({ children }: { children: React.ReactNode }) {
  return <div className=" text-2xl font-bold text-myWhite">{children}</div>;
}

export default Title;
