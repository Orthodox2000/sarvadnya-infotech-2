'use client'

import { startTransition, useEffect, useEffectEvent, useState } from 'react'

const HERO_IMAGES = ['/BG1.png', '/offer.png', '/ref22.jpg']
const SLIDE_INTERVAL_MS = 5000
const SLIDE_DURATION_MS = 1200
type AnimationPhase = 'idle' | 'staged' | 'animating'

function getHeroImageStyle(imagePath: string) {
  return {
    backgroundImage: `linear-gradient(rgba(94, 23, 235, 0.22), rgba(94, 23, 235, 0.22)), url('${imagePath}')`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
}

export default function HeroPolygonLeft() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null)
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle')

  const queueNextImage = useEffectEvent(() => {
    if (animationPhase !== 'idle' || HERO_IMAGES.length < 2) {
      return
    }

    const nextIndex = (activeIndex + 1) % HERO_IMAGES.length

    startTransition(() => {
      setIncomingIndex(nextIndex)
      setAnimationPhase('staged')
    })
  })

  const finishAnimation = useEffectEvent(() => {
    if (incomingIndex === null) {
      return
    }

    startTransition(() => {
      setActiveIndex(incomingIndex)
      setIncomingIndex(null)
      setAnimationPhase('idle')
    })
  })

  useEffect(() => {
    if (HERO_IMAGES.length < 2) {
      return
    }

    if (animationPhase === 'staged') {
      let frameOne = 0
      let frameTwo = 0

      frameOne = window.requestAnimationFrame(() => {
        frameTwo = window.requestAnimationFrame(() => {
          startTransition(() => {
            setAnimationPhase('animating')
          })
        })
      })

      return () => {
        window.cancelAnimationFrame(frameOne)
        window.cancelAnimationFrame(frameTwo)
      }
    }

    const timer = window.setTimeout(
      animationPhase === 'animating' ? finishAnimation : queueNextImage,
      animationPhase === 'animating' ? SLIDE_DURATION_MS : SLIDE_INTERVAL_MS,
    )

    return () => window.clearTimeout(timer)
  }, [activeIndex, animationPhase, finishAnimation, incomingIndex, queueNextImage])

  return (
    <div
      className="hero-polygon-left absolute inset-y-0 left-0 z-10 w-[88%] overflow-hidden shadow-xl"
      style={{
        backgroundColor: '#5e17eb',
        clipPath: 'polygon(0 0, 55% 0, 75% 100%, 0% 100%)',
        boxShadow: '18px 0 28px -18px rgba(94, 23, 235, 0.9)',
      }}
    >
      <div
        key={`left-active-${activeIndex}`}
        className={`hero-slide-layer ${
          animationPhase === 'animating'
            ? 'hero-slide-current-out-down'
            : 'hero-slide-current'
        }`}
        style={getHeroImageStyle(HERO_IMAGES[activeIndex])}
      />
      {incomingIndex !== null ? (
        <div
          key={`left-incoming-${incomingIndex}`}
          className={`hero-slide-layer ${
            animationPhase === 'animating'
              ? 'hero-slide-next-in-top'
              : 'hero-slide-next-top'
          }`}
          style={getHeroImageStyle(HERO_IMAGES[incomingIndex])}
        />
      ) : null}
    </div>
  )
}
