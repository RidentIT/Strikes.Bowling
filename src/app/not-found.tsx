import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { PageContainer } from '@/components/layout/PageContainer'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { ROUTES } from '@/lib/routes'

export default function NotFound() {
  return (
    <>
      <AmbientBackground />
      <PageContainer>
        <p className="text-eyebrow text-brand-coral uppercase">Error 404</p>
        <h1 className="mt-3">Page not found</h1>
        <p className="mt-2 text-secondary">This lane doesn&apos;t exist.</p>
        <ButtonLink href={ROUTES.home} className="mt-6">
          Back to STRIKES
        </ButtonLink>
      </PageContainer>
    </>
  )
}
