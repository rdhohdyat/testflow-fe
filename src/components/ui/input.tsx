import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-2xl border dark:border-neutral-800 bg-neutral-50 px-5 py-3 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-black file:text-neutral-950 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 font-bold dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
