import { PageContainer } from '@/components/layout/PageContainer'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { ROUTES } from '@/lib/routes'

export default function NotFound() {
  return (
    <PageContainer>
      <p className="text-caption font-semibold text-brand-red">404</p>
      <h1 className="mt-2">Page not found</h1>
      <p className="mt-2 text-muted">This lane doesn&apos;t exist.</p>
      <ButtonLink href={ROUTES.home} className="mt-6">
        Back to STRIKES
      </ButtonLink>
    </PageContainer>
  )
}
