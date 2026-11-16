import type { Variants } from 'motion/react'
import type { Viewport } from 'next'
import * as motion from 'motion/react-client'
import { InterfaceTile } from '@/components/common/InterfaceTile'
import { HeroArt } from '@/components/common/HeroArt'
import { StrikesLogo } from '@/components/common/StrikesLogo'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { PageContainer } from '@/components/layout/PageContainer'
import { DESTINATION_LIST } from '@/data/destinations'

// The landing page sits on black; interface screens keep the navy theme background.
export const viewport: Viewport = { themeColor: '#000000' }

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const staggerTiles: Variants = {
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
}

export default function HomePage() {
  return (
    <>
      <AmbientBackground tone="black" />

      <PageContainer>
        <div className="relative">
          <HeroArt />

          <header>
            <StrikesLogo
              className="h-24 drop-shadow-[0_12px_32px_rgb(244_63_94/0.22)] sm:h-28 lg:h-32"
              sizes="(min-width: 1024px) 167px, (min-width: 640px) 146px, 125px"
            />
          </header>

          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-6"
          >
            <h1 className="text-hero">
              Welcome to
              <br />
              <span className="text-gradient-brand inline-block pb-1">STRIKES</span>
            </h1>
          </motion.section>
        </div>

        <section aria-labelledby="interfaces-heading" className="mt-8 sm:mt-10">
          <h2 id="interfaces-heading" className="border-b border-white/6 pb-4">
            Explore Interfaces
          </h2>

          <motion.ul
            initial="hidden"
            animate="visible"
            variants={staggerTiles}
            className="mt-6 grid gap-5 md:grid-cols-2 lg:gap-6"
          >
            {DESTINATION_LIST.map((destination, index) => (
              <motion.li key={destination.id} variants={fadeUp}>
                <InterfaceTile destination={destination} number={index + 1} />
              </motion.li>
            ))}
          </motion.ul>
        </section>
      </PageContainer>
    </>
  )
}
