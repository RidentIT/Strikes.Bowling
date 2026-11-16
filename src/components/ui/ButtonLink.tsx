import Link from 'next/link'
import type { ComponentProps } from 'react'

/** Next.js link styled as the primary button. */
export function ButtonLink({ className = '', ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-body-sm font-semibold text-foreground transition-colors hover:bg-primary-hover ${className}`}
      {...props}
    />
  )
}
