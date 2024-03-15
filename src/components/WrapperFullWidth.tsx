import { cn } from "@/libs/utils";
import React, { ReactNode } from "react";

const WrapperFullWidth = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex-grow max-w-7xl w-full mx-auto", className)}>
      {children}
    </div>
  );
};

export default WrapperFullWidth;
