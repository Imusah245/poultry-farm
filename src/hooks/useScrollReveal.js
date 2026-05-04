import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to ref and adds/removes 'visible' class.
 * Elements need .reveal class in CSS; this hook adds .visible when in view.
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = el.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold }
    )

    targets.forEach(t => observer.observe(t))
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
