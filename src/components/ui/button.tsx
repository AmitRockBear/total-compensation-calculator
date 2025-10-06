"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-900/90 dark:bg-white dark:text-slate-950 dark:hover:bg-white/90",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
        outline:
          "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800",
        ghost:
          "text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-600 dark:bg-red-600 dark:hover:bg-red-500 dark:focus-visible:ring-red-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-6",
        icon: "h-9 w-9",        
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);

Button.displayName = "Button";

export { buttonVariants };
