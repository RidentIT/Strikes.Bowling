import * as motion from 'motion/react-client'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { PageContainer } from '@/components/layout/PageContainer'
import { accentStyle } from '@/lib/accent'
import type { Destination } from '@/types/navigation'
import { AccentIcon } from './AccentIcon'
import { BackToHome } from './BackToHome'

interface PlaceholderScreenProps {
  destination: Destination
}

/** Temporary screen for interfaces that are not built yet. */
export function PlaceholderScreen({ destination }: PlaceholderScreenProps) {
  const { title, description, category, icon, accent } = destination

  return (
    <>
      <AmbientBackground />
      <PageContainer>
        <BackToHome />

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={accentStyle(accent)}
          className="relative mt-8 overflow-hidden rounded-2xl border border-border bg-linear-to-b from-surface-raised to-surface p-8"
        >
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-(--accent) to-(--accent-to)"
          />
          <AccentIcon icon={icon} />
          <p className="mt-6 text-eyebrow text-(--accent) uppercase">{category}</p>
          <h1 className="mt-2">{title}</h1>
          <p className="mt-1.5 text-secondary">{description}</p>
          <p className="mt-8 text-caption text-muted">Interface coming soon.</p>
        </motion.section>
      </PageContainer>
    </>
  )
}
