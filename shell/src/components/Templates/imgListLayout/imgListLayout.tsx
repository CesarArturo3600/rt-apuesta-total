import React from "react";

interface imgListLayoutProps {
  children: React.ReactNode;
}

const imgListLayout = ({ children }: imgListLayoutProps) => {
  return <div className="imgListLayout">{children}</div>;
};

export default imgListLayout;
