import type { LucideIcon } from 'lucide-react'

interface AccentIconProps {
  icon: LucideIcon
}

/** Icon on a soft accent gradient. Reads `--accent` / `--accent-to` from a parent (see `accentStyle`). */
export function AccentIcon({ icon: Icon }: AccentIconProps) {
  return (
    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-(--accent)/25 to-(--accent-to)/5 text-(--accent) ring-1 ring-(--accent)/25 ring-inset transition duration-300 group-hover:ring-(--accent)/50">
      <Icon aria-hidden strokeWidth={1.75} className="size-7 transition-transform duration-300 group-hover:scale-105" />
    </span>
  )
}
