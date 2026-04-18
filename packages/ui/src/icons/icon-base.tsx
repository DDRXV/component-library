import React from "react";
import { cn } from "@/utils/cn";

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
  "aria-label"?: string;
}

export function createIcon(
  displayName: string,
  paths: React.ReactNode,
  viewBox = "0 0 24 24"
) {
  const Icon = React.forwardRef<SVGSVGElement, IconProps>(
    ({ size = 24, className, "aria-label": ariaLabel, ...props }, ref) => (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label={ariaLabel ?? displayName}
        className={cn("shrink-0", className)}
        {...props}
      >
        {paths}
      </svg>
    )
  );
  Icon.displayName = displayName;
  return Icon;
}
