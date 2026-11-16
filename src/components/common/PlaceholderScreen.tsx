import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { ROUTES } from '@/lib/routes'
import type { Destination } from '@/types/navigation'

interface PlaceholderScreenProps {
  destination: Destination
}

/** Temporary screen for interfaces that are not built yet. */
export function PlaceholderScreen({ destination }: PlaceholderScreenProps) {
  const { title, description, icon: Icon, accentClassName } = destination

  return (
    <PageContainer>
      <Link
        to={ROUTES.home}
        className="inline-flex items-center gap-2 text-body-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to STRIKES
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mt-8 rounded-xl border border-border bg-surface p-8"
      >
        <Icon className={`size-8 ${accentClassName}`} />
        <h1 className="mt-4">{title}</h1>
        <p className="mt-1 text-muted">{description}</p>
        <p className="mt-6 text-caption text-muted">Interface coming soon.</p>
      </motion.section>
    </PageContainer>
  )
}
