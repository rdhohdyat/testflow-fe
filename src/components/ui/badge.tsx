import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-800 dark:focus:ring-neutral-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-900 text-neutral-50 hover:bg-neutral-100 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200",
        secondary:
          "border-transparent bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30 font-bold",
        destructive:
          "border-transparent bg-red-500 text-neutral-50 hover:bg-red-600 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-800",
        outline: "text-neutral-900 dark:text-neutral-50 border-neutral-200",
      },
      size: {
        default: "px-2.5 py-0.5 rounded-xl",
        lg: "px-3 py-1 rounded-[1.5rem] text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
