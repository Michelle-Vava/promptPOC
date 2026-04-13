import { useRef } from 'react'
import { View, Text, Pressable, StyleSheet, PanResponder } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { HOURS, T } from '../lib/data'

interface TimeWheelProps {
  hourIdx: number
  setHourIdx: (i: number) => void
}

export default function TimeWheel({ hourIdx, setHourIdx }: TimeWheelProps) {
  const startIdx = useRef(hourIdx)
  const startY = useRef(0)

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, gs) => {
      startIdx.current = hourIdx
      startY.current = gs.y0
    },
    onPanResponderMove: (_, gs) => {
      const d = -Math.round(gs.dy / 30)
      const next = Math.max(0, Math.min(HOURS.length - 1, startIdx.current + d))
      setHourIdx(next)
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.wheel} {...panResponder.panHandlers}>
        <Feather name="chevron-up" size={14} color="rgba(255,255,255,0.4)" />

        {([-2, -1, 0, 1, 2] as const).map(off => {
          const i = hourIdx + off
          const ok = i >= 0 && i < HOURS.length
          const cur = off === 0
          const d = Math.abs(off)
          return (
            <Pressable
              key={off}
              onPress={() => ok && setHourIdx(i)}
              style={[styles.slot, cur && styles.slotActive, { paddingVertical: cur ? 10 : 5 }]}
            >
              <Text style={[styles.slotText, {
                fontSize: cur ? 14 : d === 1 ? 11 : 9,
                fontFamily: cur ? 'Sora_800ExtraBold' : 'Sora_400Regular',
                color: cur ? '#fff' : `rgba(255,255,255,${d === 1 ? 0.28 : 0.1})`,
              }]}>
                {ok ? HOURS[i] : ''}
              </Text>
            </Pressable>
          )
        })}

        <Feather name="chevron-down" size={14} color="rgba(255,255,255,0.4)" />
      </View>

      <View style={styles.dot} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -80 }],
    alignItems: 'center',
    zIndex: 10,
  },
  wheel: {
    backgroundColor: 'rgba(8,8,8,0.95)',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    width: 72,
    alignItems: 'center',
  },
  arrow: { fontSize: 8, color: 'rgba(255,255,255,0.22)', marginVertical: 4 },
  slot: { width: '100%', alignItems: 'center', paddingHorizontal: 4, borderRadius: 9 },
  slotActive: { backgroundColor: 'rgba(255,255,255,0.09)' },
  slotText: { textAlign: 'center', lineHeight: 16 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: T.accent, marginTop: 7 },
})
