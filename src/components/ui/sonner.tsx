"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, InformationCircleIcon, Alert02Icon, MultiplicationSignCircleIcon, Loading03Icon } from "@hugeicons/core-free-icons"
import { CheckCircle, Info, TriangleAlert, CircleAlert } from "lucide-react"
import { Loader2 } from "lucide-react"
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CheckCircle strokeWidth={2} className="size-6 text-green-500" />
        ),
        info: (
          <Info strokeWidth={2} className="size-6 text-blue-500" />
        ),
        warning: (
          <TriangleAlert strokeWidth={2} className="size-6 text-yellow-500" />
        ),
        error: (
          <CircleAlert strokeWidth={2} className="size-6 text-red-500" />
        ),
        loading: (
          <Loader2 strokeWidth={2} className="size-6 text-primary animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
