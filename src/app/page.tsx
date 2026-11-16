import { Link } from 'react-router-dom'
import { BrandMark } from '@/components/common/BrandMark'
import { PageContainer } from '@/components/layout/PageContainer'
import { DESTINATION_LIST } from '@/data/destinations'

// Temporary navigation portal — the full landing page design comes later.
export function HomePage() {
  return (
    <PageContainer>
      <BrandMark />
      <h1 className="mt-10 text-display">Welcome to STRIKES.</h1>
      <p className="mt-2 text-h2 font-medium text-brand-cyan">Bowling Management Platform</p>

      <nav aria-label="Interfaces" className="mt-10">
        <ul className="grid gap-3 sm:grid-cols-2">
          {DESTINATION_LIST.map(({ id, title, description, path, icon: Icon, accentClassName }) => (
            <li key={id}>
              <Link
                to={path}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-surface-hover"
              >
                <Icon className={`size-6 shrink-0 ${accentClassName}`} />
                <span>
                  <span className="block text-h3">{title}</span>
                  <span className="block text-body-sm text-muted">{description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PageContainer>
  )
}
