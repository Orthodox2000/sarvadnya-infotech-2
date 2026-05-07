'use client'

import { startTransition, useEffect, useEffectEvent, useState } from 'react'

const HERO_IMAGES = ['/BG1.png','BG3-1.png','BF2.png','/offer.png', '/bg.jpg', '/ref22.jpg']
const SLIDE_INTERVAL_MS = 5000
const SLIDE_DURATION_MS = 1200
type AnimationPhase = 'idle' | 'staged' | 'animating'

function getHeroImageStyle(imagePath: string) {
  return {
    backgroundImage: `linear-gradient(rgba(94, 23, 235, 0.32), rgba(94, 23, 235, 0.32)), url('${imagePath}')`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
}

export default function HeroPolygonRight() {
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
      className="hero-polygon-right absolute inset-y-0 right-0 w-[56%] overflow-hidden shadow-xl"
      style={{
        backgroundColor: '#5e17eb',
        clipPath: 'polygon(100% 0,18% 0, 50% 100%, 100% 100%)',
        boxShadow: '-18px 0 28px -18px rgba(94, 23, 235, 0.9)',
      }}
    >
      <div
        key={`right-active-${activeIndex}`}
        className={`hero-slide-layer opacity-5 ${
          animationPhase === 'animating'
            ? 'hero-slide-current-out-top'
            : 'hero-slide-current'
        }`}
        style={getHeroImageStyle(HERO_IMAGES[activeIndex])}
      />
      {incomingIndex !== null ? (
        <div
          key={`right-incoming-${incomingIndex}`}
          className={`hero-slide-layer opacity-5 ${
            animationPhase === 'animating'
              ? 'hero-slide-next-in-bottom'
              : 'hero-slide-next-bottom'
          }`}
          style={getHeroImageStyle(HERO_IMAGES[incomingIndex])}
        />
      ) : null}
    </div>
  )
}
