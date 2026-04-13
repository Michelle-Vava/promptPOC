/**
 * Skeleton — Animated shimmer placeholder for loading states.
 *
 * Renders a rounded rectangle that pulses between two opacity
 * levels using a looping Animated.timing sequence. Used by
 * Services, Activity, and Map screens during initial data fetch.
 */
import { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { useTheme } from '../lib/theme'

interface SkeletonProps {
  /** Width in pixels (already scaled via s()). */
  width: number
  /** Height in pixels (already scaled via vs()). */
  height: number
  /** Border radius — defaults to height / 2. */
  borderRadius?: number
  /** Optional style override. */
  style?: object
}

export default function Skeleton({ width, height, borderRadius, style }: SkeletonProps) {
  const { tk } = useTheme()
  const pulse = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [pulse])

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: borderRadius ?? height / 2,
          backgroundColor: tk.line,
          opacity: pulse,
        },
        style,
      ]}
    />
  )
}
