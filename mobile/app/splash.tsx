import { useEffect, useRef, useState } from 'react'
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { PROVIDERS, T } from '../lib/data'
import { s, ms, vs } from '../lib/scale'

const { height: SH } = Dimensions.get('window')

function useLiveClock() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const h = time.getHours() % 12 || 12
  const m = String(time.getMinutes()).padStart(2, '0')
  const ap = time.getHours() < 12 ? 'AM' : 'PM'
  return `${h}:${m} ${ap}`
}

export default function Splash() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const clock = useLiveClock()
  const liveCount = PROVIDERS.length

  const fadeIn = useRef(new Animated.Value(0)).current
  const slideUp = useRef(new Animated.Value(30)).current
  const pillFade = useRef(new Animated.Value(0)).current
  const ctaFade = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Staggered entrance
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pillFade, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(fadeIn, { toValue: 1, useNativeDriver: true, stiffness: 180, damping: 20 }),
        Animated.spring(slideUp, { toValue: 0, useNativeDriver: true, stiffness: 180, damping: 20 }),
      ]),
      Animated.timing(ctaFade, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start()
  }, [])

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Live pill — FIRST thing, prominent */}
      <Animated.View style={[styles.livePill, { opacity: pillFade }]}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>Live in Halifax, NS</Text>
        <Text style={styles.liveClock}>{clock}</Text>
      </Animated.View>

      {/* Hero heading — billboard, fills the screen */}
      <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
        <Text style={styles.heading}>
          Right now{'\n'}
          in <Text style={{ color: T.accent }}>Halifax</Text>
        </Text>
      </Animated.View>

      {/* Single line subtext */}
      <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
        <Text style={styles.subtitle}>
          {liveCount} providers open · Same-day bookings · Free
        </Text>
      </Animated.View>

      {/* Spacer pushes CTA to comfortable thumb zone */}
      <View style={{ flex: 1, minHeight: vs(60) }} />

      {/* Single CTA — full width, confident */}
      <Animated.View style={[styles.ctaWrap, { opacity: ctaFade }]}>
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 }]}
          onPress={() => router.push({ pathname: '/auth', params: { role: 'customer' } })}
        >
          <Text style={styles.primaryBtnText}>Get Started</Text>
          <Feather name="arrow-right" size={ms(18)} color={T.white} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.providerLink, pressed && { opacity: 0.6 }]}
          onPress={() => router.push({ pathname: '/auth', params: { role: 'provider' } })}
        >
          <Text style={styles.providerLinkText}>I'm a provider</Text>
          <Feather name="arrow-right" size={ms(13)} color="rgba(255,255,255,0.3)" />
        </Pressable>
      </Animated.View>

      {/* Footer */}
      <Text style={styles.footer}>© {new Date().getFullYear()} Prompt Technologies Inc.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.ink,
    paddingHorizontal: s(28),
    justifyContent: 'flex-start',
  },

  // Live pill — prominent, top of screen
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginTop: vs(40),
    marginBottom: vs(48),
    alignSelf: 'flex-start',
  },
  liveDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: T.accent,
    shadowColor: T.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  liveText: {
    fontSize: ms(13),
    fontFamily: 'Sora_600SemiBold',
    color: 'rgba(255,255,255,0.5)',
  },
  liveClock: {
    fontSize: ms(13),
    fontFamily: 'Sora_700Bold',
    color: 'rgba(255,255,255,0.3)',
  },

  // Billboard heading
  heading: {
    fontSize: ms(52),
    fontFamily: 'Sora_800ExtraBold',
    color: T.white,
    lineHeight: ms(56),
    letterSpacing: -2.5,
    marginBottom: vs(20),
  },

  // Subtext
  subtitle: {
    fontSize: ms(15),
    fontFamily: 'Sora_400Regular',
    color: 'rgba(255,255,255,0.3)',
    lineHeight: ms(22),
  },

  // CTA
  ctaWrap: {
    gap: vs(16),
    marginBottom: vs(24),
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: vs(18),
    borderRadius: s(16),
    backgroundColor: T.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    shadowColor: T.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryBtnText: {
    fontSize: ms(17),
    fontFamily: 'Sora_800ExtraBold',
    color: T.white,
    letterSpacing: -0.3,
  },
  providerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(6),
    paddingVertical: vs(12),
  },
  providerLinkText: {
    fontSize: ms(14),
    fontFamily: 'Sora_600SemiBold',
    color: 'rgba(255,255,255,0.3)',
  },

  footer: {
    fontSize: ms(11),
    fontFamily: 'Sora_400Regular',
    color: 'rgba(255,255,255,0.12)',
    textAlign: 'center',
    marginBottom: vs(8),
  },
})
