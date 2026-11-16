import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { ROUTES } from '@/lib/routes'

export function NotFoundPage() {
  return (
    <PageContainer>
      <p className="text-caption font-semibold text-brand-red">404</p>
      <h1 className="mt-2">Page not found</h1>
      <p className="mt-2 text-muted">This lane doesn&apos;t exist.</p>
      <Link
        to={ROUTES.home}
        className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-body-sm font-semibold transition-colors hover:bg-primary-hover"
      >
        Back to STRIKES
      </Link>
    </PageContainer>
  )
}
