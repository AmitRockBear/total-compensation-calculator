"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "~/lib/utils";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  asChild?: boolean;
};

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "label";

    return (
      <Comp
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-200",
          className,
        )}
        {...props}
      />
    );
  },
);

Label.displayName = "Label";
