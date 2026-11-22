import { FrontDeskShell } from '@/features/front-desk'

export default function FrontDeskLayout({ children }: LayoutProps<'/front-desk'>) {
  return <FrontDeskShell>{children}</FrontDeskShell>
}
