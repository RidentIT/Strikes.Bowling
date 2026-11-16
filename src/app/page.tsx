import type { Variants } from 'motion/react'
import * as motion from 'motion/react-client'
import { InterfaceTile } from '@/components/common/InterfaceTile'
import { StrikesLogo } from '@/components/common/StrikesLogo'
import { PageContainer } from '@/components/layout/PageContainer'
import { Badge } from '@/components/ui/Badge'
import { DESTINATION_LIST } from '@/data/destinations'

const PROTOTYPE_VERSION = 'v1.0'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const staggerTiles: Variants = {
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
}

export default function HomePage() {
  return (
    <div className="relative isolate min-h-dvh overflow-hidden">
      {/* Soft blue wash echoing the centre's lane lighting. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-112 w-4xl -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      <PageContainer>
        <header className="flex flex-wrap items-center justify-between gap-4">
          <StrikesLogo
            className="h-24 drop-shadow-[0_8px_24px_rgb(8_124_240_/_0.25)] sm:h-28 lg:h-36"
            sizes="(min-width: 1024px) 188px, (min-width: 640px) 146px, 125px"
          />
          <Badge tone="success">Prototype {PROTOTYPE_VERSION}</Badge>
        </header>

        <motion.section initial="hidden" animate="visible" variants={fadeUp} className="mt-12 max-w-2xl">
          <h1 className="text-display sm:text-[2.5rem]">Welcome to STRIKES</h1>
          <p className="mt-2 text-h2 font-medium text-brand-cyan">Bowling Management Platform</p>
          <p className="mt-4 text-muted">
            Explore our integrated bowling experience, scoring displays and management interfaces.
          </p>
        </motion.section>

        <hr className="my-10 border-border" />

        <section aria-labelledby="interfaces-heading">
          <h2 id="interfaces-heading">Explore Interfaces</h2>

          <motion.ul
            initial="hidden"
            animate="visible"
            variants={staggerTiles}
            className="mt-6 grid gap-5 sm:grid-cols-2"
          >
            {DESTINATION_LIST.map((destination, index) => (
              <motion.li key={destination.id} variants={fadeUp}>
                <InterfaceTile destination={destination} number={index + 1} />
              </motion.li>
            ))}
          </motion.ul>
        </section>
      </PageContainer>
    </div>
  )
}
