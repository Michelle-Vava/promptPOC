/**
 * Toast — Animated notification toasts.
 * Springs in from bottom, auto-dismisses after 3s, tap to dismiss.
 * Positioned above the tab bar using bottom inset from safe-area.
 */
import { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { T } from '../lib/data'

export interface ToastData {
  id: number
  message: string
  type?: 'success' | 'info' | 'error'
}

interface ToastProps {
  toasts: ToastData[]
  onDismiss: (id: number) => void
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(16)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true, stiffness: 360, damping: 30 }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, stiffness: 360, damping: 30 }),
    ]).start()

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(onDismiss)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const type = toast.type ?? 'success'
  const accent = T.accent

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <View style={[styles.dot, { backgroundColor: accent, shadowColor: accent }]} />
      <Text style={styles.message}>{toast.message}</Text>
      <Pressable onPress={onDismiss} hitSlop={8}>
        <Text style={styles.close}>×</Text>
      </Pressable>
    </Animated.View>
  )
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  const insets = useSafeAreaInsets()
  if (toasts.length === 0) return null

  return (
    <View style={[styles.container, { bottom: insets.bottom + 72 }]}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(13,13,13,0.93)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  message: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Sora_600SemiBold',
    color: T.white,
  },
  close: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 20,
  },
})
