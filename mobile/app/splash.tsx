/**
 * splash.tsx — Onboarding / landing screen.
 *
 * Shows a cinematic hero with live clock, provider count,
 * and staggered entrance animations. Two CTAs:
 *  - "See who's open" → auth as customer
 *  - "I'm a provider" → auth as provider
 *
 * Animations: Animated.sequence with pill fade, hero spring, CTA fade.
 */
import { useEffect, useRef, useState } from 'react'
import { View, Text, Pressable, Animated, Dimensions, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { PROVIDERS, GROUPS, T } from '../lib/data'
import { useTheme } from '../lib/theme'
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
  const { tk, mode } = useTheme()
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
    <View style={[styles.container, { backgroundColor: tk.bg, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Live pill — FIRST thing, prominent */}
      <Animated.View style={[styles.livePill, { opacity: pillFade }]}>
        <View style={styles.liveDot} />
        <Text style={[styles.liveText, { color: tk.muted }]}>Live in Halifax, NS</Text>
        <Text style={[styles.liveClock, { color: tk.muted }]}>{clock}</Text>
      </Animated.View>

      {/* Hero heading — billboard, fills the screen */}
      <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
        <Text style={[styles.heading, { color: tk.text }]}>
          Right now{'\n'}
          in <Text style={{ color: T.accent }}>Halifax</Text>
        </Text>
      </Animated.View>

      {/* Single line subtext */}
      <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
        <Text style={[styles.subtitle, { color: tk.muted }]}>
          Same-day bookings. Customers pay $0.{'\n'}Providers pay $1. That's it.
        </Text>
      </Animated.View>

      {/* Traction stats */}
      <Animated.View style={[styles.tractionRow, { opacity: fadeIn }]}>
        <View style={[styles.tractionPill, { backgroundColor: `${T.green}15`, borderColor: `${T.green}30` }]}>
          <Text style={[styles.tractionNum, { color: T.green }]}>847</Text>
          <Text style={[styles.tractionLabel, { color: tk.muted }]}>bookings this week</Text>
        </View>
        <View style={[styles.tractionPill, { backgroundColor: `${T.accent}15`, borderColor: `${T.accent}30` }]}>
          <Text style={[styles.tractionNum, { color: T.accent }]}>{liveCount}</Text>
          <Text style={[styles.tractionLabel, { color: tk.muted }]}>providers live</Text>
        </View>
      </Animated.View>

      {/* Category icons */}
      <Animated.View style={[styles.catGrid, { opacity: fadeIn }]}>
        {GROUPS.slice(0, 6).map(g => (
          <View key={g.id} style={[styles.catChip, { backgroundColor: `${g.color}12`, borderColor: `${g.color}25` }]}>
            <Text style={{ fontSize: ms(14) }}>{g.icon}</Text>
            <Text style={[styles.catLabel, { color: g.color }]}>{g.label}</Text>
          </View>
        ))}
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
          <Text style={[styles.providerLinkText, { color: tk.muted }]}>I'm a provider</Text>
          <Feather name="arrow-right" size={ms(13)} color={tk.muted} />
        </Pressable>
      </Animated.View>

      {/* Footer */}
      <Text style={[styles.footer, { color: tk.muted }]}>© {new Date().getFullYear()} Prompt Technologies Inc.</Text>
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

  // Traction stats
  tractionRow: {
    flexDirection: 'row',
    gap: s(10),
    marginTop: vs(20),
  },
  tractionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingVertical: vs(6),
    paddingHorizontal: s(12),
    borderRadius: s(10),
    borderWidth: 1,
  },
  tractionNum: {
    fontSize: ms(15),
    fontFamily: 'Sora_800ExtraBold',
  },
  tractionLabel: {
    fontSize: ms(11),
    fontFamily: 'Sora_400Regular',
  },

  // Category grid
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginTop: vs(20),
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingVertical: vs(5),
    paddingHorizontal: s(11),
    borderRadius: s(10),
    borderWidth: 1,
  },
  catLabel: {
    fontSize: ms(11),
    fontFamily: 'Sora_700Bold',
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
