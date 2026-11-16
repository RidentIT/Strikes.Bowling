import Image from 'next/image'
import bowlingArt from '@/assets/images/bowling2.png'

/**
 * Decorative bowling illustration for the landing page's top-right corner.
 * Position it inside a `relative` parent; it sits behind the page content.
 * The artwork carries its own glow and its left third is empty, so it can
 * overlap the hero's free space without touching the heading.
 */
export function HeroArt() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-3 right-0 -z-10 w-[210px] sm:-top-7 sm:w-[440px] lg:-top-10 lg:w-[620px]"
    >
      <Image
        src={bowlingArt}
        alt=""
        sizes="(min-width: 1024px) 620px, (min-width: 640px) 440px, 210px"
        loading="eager"
        className="h-auto w-full select-none"
      />
    </div>
  )
}
