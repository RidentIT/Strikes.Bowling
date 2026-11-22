import Link from 'next/link'
import type { ComponentProps } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md'

const BASE =
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] hover:bg-primary-hover',
  secondary: 'border border-border bg-surface-raised text-foreground hover:border-white/15 hover:bg-[#222842]',
  ghost: 'text-secondary hover:bg-white/5 hover:text-foreground',
  danger: 'border border-rose-500/35 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-caption',
  md: 'h-10 px-4 text-body-sm',
}

interface StyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function buttonClasses({ variant = 'secondary', size = 'md' }: StyleProps = {}, className = '') {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`
}

type ButtonProps = ComponentProps<'button'> & StyleProps

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size }, className)} {...props} />
}

type LinkButtonProps = ComponentProps<typeof Link> & StyleProps

/** A link styled as a button. */
export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return <Link className={buttonClasses({ variant, size }, className)} {...props} />
}
