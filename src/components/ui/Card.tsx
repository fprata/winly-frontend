import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = React.memo(function Card({
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8",
          hover &&
            "hover:shadow-md hover:border-slate-300 hover:-translate-y-px transition-all duration-300"
        ),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
