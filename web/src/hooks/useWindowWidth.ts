/**
 * useWindowWidth — Returns the current viewport width, updated on resize.
 *
 * Used to switch layouts between desktop (sidebar panel) and mobile
 * (bottom sheet) when a provider pin is tapped on the map.
 *
 * Usage:
 *   const width = useWindowWidth()
 *   const isMobile = width < 768
 */
import { useState, useEffect } from 'react'

export function useWindowWidth(): number {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}
