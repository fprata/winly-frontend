import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.memo(function Card({
  hover = false,
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  const paddingMap = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-xl border border-zinc-200 shadow-sm",
          paddingMap[padding],
          hover &&
            "hover:border-blue-500 hover:shadow-md hover:-translate-y-px transition-all duration-200 cursor-pointer"
        ),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
