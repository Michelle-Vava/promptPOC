/**
 * DialPicker — Circular clock-face time selector overlaid on the map.
 *
 * A compact dial (130px) with tick marks around the rim. The user drags
 * or taps to rotate a needle to the desired hour. Centre shows the
 * selected time. Uses PanResponder for gesture handling.
 *
 * Same interface as TimeWheel: { hourIdx, setHourIdx }.
 */
import { useRef } from 'react'
import { View, Text, StyleSheet, PanResponder } from 'react-native'
import { HOURS, T } from '../lib/data'
import { useTheme } from '../lib/theme'

interface DialPickerProps {
  hourIdx: number
  setHourIdx: (i: number) => void
}

const SIZE = 130
const RADIUS = SIZE / 2
const TICK_OUTER = RADIUS - 4
const TICK_INNER_MAJOR = RADIUS - 16
const TICK_INNER_MINOR = RADIUS - 10
const NEEDLE_LEN = RADIUS - 24
const CENTER_R = 18

function angleForIndex(i: number): number {
  return (i / HOURS.length) * 360 - 90 // start at 12 o'clock
}

function indexFromAngle(angleDeg: number): number {
  let norm = (angleDeg + 90) % 360
  if (norm < 0) norm += 360
  const idx = Math.round((norm / 360) * HOURS.length) % HOURS.length
  return idx
}

export default function DialPicker({ hourIdx, setHourIdx }: DialPickerProps) {
  const { mode } = useTheme()
  const dark = mode === 'dark'
  const containerRef = useRef<View>(null)
  const layoutRef = useRef({ cx: 0, cy: 0 })

  const measureCenter = () => {
    containerRef.current?.measure((_x, _y, w, h, px, py) => {
      layoutRef.current = { cx: px + w / 2, cy: py + h / 2 }
    })
  }

  const angleFromTouch = (pageX: number, pageY: number) => {
    const { cx, cy } = layoutRef.current
    const dx = pageX - cx
    const dy = pageY - cy
    return (Math.atan2(dy, dx) * 180) / Math.PI
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      measureCenter()
      const { pageX, pageY } = e.nativeEvent
      setTimeout(() => {
        const angle = angleFromTouch(pageX, pageY)
        setHourIdx(indexFromAngle(angle))
      }, 0)
    },
    onPanResponderMove: (e) => {
      const { pageX, pageY } = e.nativeEvent
      const angle = angleFromTouch(pageX, pageY)
      setHourIdx(indexFromAngle(angle))
    },
  })

  const needleAngle = angleForIndex(hourIdx)

  // Build tick marks
  const ticks: React.ReactNode[] = []
  for (let i = 0; i < HOURS.length; i++) {
    const a = ((i / HOURS.length) * 360 - 90) * (Math.PI / 180)
    const major = true // all hour ticks are major
    const inner = major ? TICK_INNER_MAJOR : TICK_INNER_MINOR
    const x1 = RADIUS + Math.cos(a) * inner
    const y1 = RADIUS + Math.sin(a) * inner
    const x2 = RADIUS + Math.cos(a) * TICK_OUTER
    const y2 = RADIUS + Math.sin(a) * TICK_OUTER
    const isActive = i === hourIdx
    ticks.push(
      <View
        key={i}
        style={{
          position: 'absolute',
          left: Math.min(x1, x2),
          top: Math.min(y1, y2),
          width: Math.abs(x2 - x1) || 2,
          height: Math.abs(y2 - y1) || 2,
          backgroundColor: isActive ? T.accent : 'rgba(255,255,255,0.25)',
          borderRadius: 1,
          transform: [
            { rotate: `${(i / HOURS.length) * 360}deg` },
          ],
        }}
      />
    )
  }

  // Use SVG-like approach with positioned lines for ticks
  const tickElements = Array.from({ length: HOURS.length }, (_, i) => {
    const angleDeg = (i / HOURS.length) * 360 - 90
    const aRad = angleDeg * (Math.PI / 180)
    const ox = RADIUS + Math.cos(aRad) * TICK_INNER_MAJOR
    const oy = RADIUS + Math.sin(aRad) * TICK_INNER_MAJOR
    const ex = RADIUS + Math.cos(aRad) * TICK_OUTER
    const ey = RADIUS + Math.sin(aRad) * TICK_OUTER

    const len = Math.sqrt((ex - ox) ** 2 + (ey - oy) ** 2)
    const midX = (ox + ex) / 2
    const midY = (oy + ey) / 2

    const isActive = i === hourIdx
    return (
      <View
        key={`tick-${i}`}
        style={{
          position: 'absolute',
          left: midX - len / 2,
          top: midY - 1,
          width: len,
          height: 2,
          backgroundColor: isActive ? T.accent : dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
          borderRadius: 1,
          transform: [{ rotate: `${angleDeg}deg` }],
        }}
      />
    )
  })

  // Needle
  const needleRad = needleAngle * (Math.PI / 180)
  const nx = RADIUS + Math.cos(needleRad) * NEEDLE_LEN
  const ny = RADIUS + Math.sin(needleRad) * NEEDLE_LEN
  const nLen = Math.sqrt((nx - RADIUS) ** 2 + (ny - RADIUS) ** 2)
  const nMidX = (RADIUS + nx) / 2
  const nMidY = (RADIUS + ny) / 2

  return (
    <View style={styles.container}>
      <View
        ref={containerRef}
        style={[styles.dial, { backgroundColor: dark ? 'rgba(8,8,8,0.95)' : 'rgba(255,255,255,0.95)', borderColor: dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)' }]}
        onLayout={measureCenter}
        {...panResponder.panHandlers}
      >
        {/* Outer ring */}
        <View style={[styles.outerRing, { borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]} />

        {/* Tick marks */}
        {tickElements}

        {/* Needle */}
        <View
          style={[styles.needle, {
            left: nMidX - nLen / 2,
            top: nMidY - 1.5,
            width: nLen,
            height: 3,
            transform: [{ rotate: `${needleAngle}deg` }],
          }]}
        />

        {/* Center dot */}
        <View style={[styles.centerDot, { backgroundColor: dark ? 'rgba(13,13,13,0.98)' : 'rgba(255,255,255,0.98)' }]}>
          <Text style={[styles.centerText, { color: dark ? '#fff' : '#0D0D0D' }]}>{HOURS[hourIdx]}</Text>
        </View>
      </View>

      {/* Accent dot below */}
      <View style={styles.accentDot} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    bottom: 32,
    alignItems: 'center',
    zIndex: 10,
  },
  dial: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    overflow: 'hidden',
  },
  outerRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SIZE / 2,
    borderWidth: 3,
  },
  needle: {
    position: 'absolute',
    backgroundColor: T.accent,
    borderRadius: 2,
  },
  centerDot: {
    position: 'absolute',
    left: RADIUS - CENTER_R,
    top: RADIUS - CENTER_R,
    width: CENTER_R * 2,
    height: CENTER_R * 2,
    borderRadius: CENTER_R,
    borderWidth: 2,
    borderColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    fontSize: 11,
    fontFamily: 'Sora_700Bold',

    textAlign: 'center',
  },
  accentDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: T.accent,
    marginTop: 7,
  },
})
