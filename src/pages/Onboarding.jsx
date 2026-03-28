import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bike, Leaf, MapPin } from 'lucide-react'
import { AppLogo } from '../components/common/AppLogo'
import { useApp } from '../context/AppContext'

const slides = [
  {
    title: 'Find bikes near you',
    body: 'See real-time listings around UP, Katipunan, and your barangay.',
    icon: MapPin,
    accent: 'bg-primary',
  },
  {
    title: 'Rent by the hour or day',
    body: 'Flexible pricing for commutes, errands, and weekend loops.',
    icon: Bike,
    accent: 'bg-teal',
  },
  {
    title: 'Track your green impact',
    body: 'Every pedal push adds up—see CO₂ saved in Filipino context.',
    icon: Leaf,
    accent: 'bg-accent',
  },
]

export function Onboarding() {
  const [i, setI] = useState(0)
  const navigate = useNavigate()
  const { completeOnboarding } = useApp()
  const slide = slides[i]

  const next = () => {
    if (i < slides.length - 1) setI((x) => x + 1)
    else {
      completeOnboarding()
      navigate('/home')
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-charcoal lg:min-h-screen">
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-10 pt-14 lg:flex-row lg:items-center lg:gap-16 lg:px-12 lg:pb-16 lg:pt-12 xl:max-w-7xl xl:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center lg:mb-0 lg:w-[38%] lg:shrink-0 lg:text-left"
        >
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-stretch overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20 lg:mx-0 lg:h-20 lg:w-20">
            <AppLogo zoom={1.18} className="min-h-0 min-w-0" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white lg:text-4xl xl:text-5xl">
            Padyak
          </h1>
          <p className="mt-2 text-sm font-medium text-white/70 lg:text-base lg:text-white/65">
            Pedal Your City Forward
          </p>
          <p className="mx-auto mt-6 hidden max-w-sm text-sm leading-relaxed text-white/55 lg:mx-0 lg:block">
            Peer-to-peer bikes for Filipino cities—affordable rides, real impact you can feel.
          </p>
        </motion.div>

        <div className="flex flex-1 flex-col justify-center lg:min-w-0 lg:max-w-xl lg:flex-none xl:max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5 lg:p-0"
            >
              <div className={`h-1.5 w-full ${slide.accent}`} />
              <div className="p-8 lg:p-10">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-surface ring-1 ring-charcoal/10 lg:h-28 lg:w-28">
                  <slide.icon className="h-12 w-12 text-charcoal lg:h-14 lg:w-14" strokeWidth={1.75} />
                </div>
                <h2 className="text-center font-heading text-xl font-bold text-charcoal lg:text-2xl">
                  {slide.title}
                </h2>
                <p className="mt-3 text-center text-sm leading-relaxed text-charcoal/75 lg:text-base">
                  {slide.body}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-2 lg:mt-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-2 rounded-full transition-all ${idx === i ? 'w-8 bg-primary' : 'w-2 bg-white/30'}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="mt-8 w-full rounded-full bg-primary py-4 font-heading text-base font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-[#1ea34a] active:scale-[0.98] lg:mt-10 lg:py-4 lg:text-lg"
          >
            {i < slides.length - 1 ? 'Next' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  )
}
