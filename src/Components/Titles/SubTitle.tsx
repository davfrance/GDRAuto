import React from 'react';

function SubTitle({ children }: { children: React.ReactNode }) {
  return <div className=" text-xl font-semibold text-primary">{children}</div>;
}

export default SubTitle;
