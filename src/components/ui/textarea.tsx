import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-2xl border dark:border-neutral-800 bg-neutral-50 px-5 py-4 text-base font-bold ring-offset-white placeholder:text-neutral-400 placeholder:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
