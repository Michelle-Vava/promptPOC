/**
 * ProviderPanel — Modal bottom sheet for provider details + booking.
 * Uses React Native Modal + Animated spring (no reanimated — Expo Go safe).
 * Haptics on book/waitlist. Shows price breakdown, all slots, CTA states.
 */
import { useState, useEffect, useRef } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, Modal, Animated, Dimensions } from 'react-native'
import * as Haptics from 'expo-haptics'
import { Feather } from '@expo/vector-icons'
import { GROUPS, Provider, T } from '../lib/data'
import { useTheme } from '../lib/theme'
import { s, ms, vs } from '../lib/scale'

const { height: SCREEN_H } = Dimensions.get('window')

interface ProviderPanelProps {
  provider: Provider | null
  hour: string
  onBook: (provider: Provider, hour: string) => void
  onClose: () => void
  alreadyBooked?: boolean
}

export default function ProviderPanel({ provider, hour, onBook, onClose, alreadyBooked = false }: ProviderPanelProps) {
  const { tk } = useTheme()
  const translateY = useRef(new Animated.Value(SCREEN_H)).current
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const isOpen = !!provider

  useEffect(() => {
    if (isOpen) {
      setDone(false)
      setLoading(false)
    }
    Animated.spring(translateY, {
      toValue: isOpen ? 0 : SCREEN_H,
      useNativeDriver: true,
      stiffness: 280,
      damping: 30,
    }).start()
  }, [isOpen, provider?.id])

  if (!provider) return null

  const cg = GROUPS.find(g => g.id === provider.cat)

  const handleBook = () => {
    setLoading(true)
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      setLoading(false)
      setDone(true)
      setTimeout(() => onBook(provider, hour), 900)
    }, 1200)
  }

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View style={[styles.sheet, { backgroundColor: tk.card, transform: [{ translateY }] }]}>
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Category colour bar */}
          <View style={[styles.colorBar, { backgroundColor: cg?.color }]} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Dark header */}
            <View style={[styles.header, { backgroundColor: tk.text }]}>
              <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: tk.line }]}>
                <Text style={[styles.closeBtnText, { color: tk.muted }]}>×</Text>
              </Pressable>

              <View style={styles.headerRow}>
                <View style={[styles.iconBox, { backgroundColor: cg?.color + '22', borderColor: cg?.color + '33' }]}>
                  <Feather name="scissors" size={20} color={cg?.color ?? T.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.provName, { color: tk.bg }]}>{provider.name}</Text>
                    {provider.badge && (
                      <View style={[styles.badgePill, { backgroundColor: cg?.color + '30' }]}>
                        <Text style={[styles.badgeText, { color: cg?.color }]}>{provider.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.addr, { color: tk.bg + '66' }]}>{provider.addr}</Text>
                  <View style={styles.ratingRow}>
                    <Text style={{ color: '#FFA500' }}>{'★'.repeat(Math.floor(provider.rating))}</Text>
                    <Text style={[styles.ratingNum, { color: tk.bg + 'B3' }]}>{provider.rating}</Text>
                    <Text style={[styles.reviewCount, { color: tk.bg + '4D' }]}>({provider.reviews})</Text>
                  </View>
                </View>
              </View>

              {/* Price / duration pills */}
              <View style={styles.pillRow}>
                <View style={[styles.infoPill, { backgroundColor: tk.bg + '12', borderColor: tk.bg + '10' }]}>
                  <Feather name="credit-card" size={14} color={tk.bg + '80'} />
                  <Text style={[styles.pillValue, { color: tk.bg }]}>{provider.price === 0 ? 'Free' : `$${provider.price}`}</Text>
                </View>
                <View style={[styles.infoPill, { backgroundColor: tk.bg + '12', borderColor: tk.bg + '10' }]}>
                  <Feather name="clock" size={14} color={tk.bg + '80'} />
                  <Text style={[styles.pillValue, { color: tk.bg }]}>{provider.dur}</Text>
                </View>
              </View>
            </View>

            {/* Time section */}
            <View style={[styles.section, { borderBottomColor: tk.line }]}>
              <Text style={[styles.sectionLabel, { color: tk.muted }]}>YOUR TIME — SET BY WHEEL</Text>
              <View style={[styles.timeBox, {
                backgroundColor: cg?.color + '0D',
                borderColor: cg?.color + '1A',
              }]}>
                <View>
                  <Text style={[styles.timeText, { color: tk.text }]}>{hour}</Text>
                  <Text style={[styles.timeSub, { color: tk.muted }]}>today · {provider.dur}</Text>
                </View>
                <Feather name="check" size={20} color={T.green} />
              </View>
            </View>

            {/* All slots */}
            <View style={[styles.section, { borderBottomColor: tk.line }]}>
              <Text style={[styles.sectionLabel, { color: tk.muted }]}>ALL SLOTS TODAY</Text>
              <View style={styles.slotsRow}>
                {provider.slots.map(s => (
                  <View key={s} style={[styles.slotChip, {
                    backgroundColor: s === hour ? cg?.color + '15' : tk.surface,
                    borderColor: s === hour ? cg?.color + '28' : tk.line,
                  }]}>
                    <Text style={[styles.slotText, { color: s === hour ? cg?.color : tk.muted }]}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Price breakdown */}
            {!done && (
              <View style={[styles.priceBreakdown, { borderTopColor: tk.line, backgroundColor: tk.surface }]}>
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, { color: tk.muted }]}>Your cost</Text>
                  <Text style={[styles.priceValue, { color: T.green }]}>$0.00 — Free</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, { color: tk.muted }]}>Provider fee</Text>
                  <Text style={[styles.priceLabel, { color: tk.muted, fontFamily: 'Sora_600SemiBold' }]}>$1.00</Text>
                </View>
              </View>
            )}

            {/* CTA */}
            <View style={styles.ctaSection}>
              {alreadyBooked ? (
                <View style={[styles.bookBtn, { backgroundColor: tk.surface, borderWidth: 1, borderColor: tk.line }]}>
                  <Feather name="check-circle" size={16} color={T.green} />
                  <Text style={[styles.bookBtnText, { color: tk.muted, marginLeft: 8 }]}>Already booked for {hour}</Text>
                </View>
              ) : loading ? (
                <View style={styles.doneView}>
                  <View style={[styles.doneIcon, { backgroundColor: T.accent + '18' }]}>
                    <Animated.View style={{ transform: [{ rotate: translateY.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
                      <Feather name="loader" size={22} color={T.accent} />
                    </Animated.View>
                  </View>
                  <Text style={[styles.doneTitle, { color: tk.text }]}>Confirming…</Text>
                  <Text style={[styles.doneSub, { color: tk.muted }]}>Securing your slot</Text>
                </View>
              ) : !done ? (
                <Pressable
                  style={({ pressed }) => [styles.bookBtn, { backgroundColor: tk.text }, pressed && { opacity: 0.85 }]}
                  onPress={handleBook}
                >
                  <Text style={[styles.bookBtnText, { color: tk.bg }]}>Confirm — Book {hour} free →</Text>
                </Pressable>
              ) : (
                <View style={styles.doneView}>
                  <View style={[styles.doneIcon, { backgroundColor: T.green + '18' }]}>
                    <Feather name="check" size={22} color={T.green} />
                  </View>
                  <Text style={[styles.doneTitle, { color: tk.text }]}>Booked!</Text>
                  <Text style={[styles.doneSub, { color: tk.muted }]}>{provider.name} · {hour}</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { maxHeight: '88%', borderTopLeftRadius: s(20), borderTopRightRadius: s(20) },
  handle: { width: s(36), height: vs(4), borderRadius: s(2), backgroundColor: 'rgba(128,128,128,0.35)', alignSelf: 'center', marginTop: vs(10), marginBottom: vs(4) },
  colorBar: { height: vs(4) },
  header: { backgroundColor: T.ink, padding: s(20), paddingTop: vs(16) },
  closeBtn: { alignSelf: 'flex-end', marginBottom: vs(8), width: s(28), height: s(28), borderRadius: s(14), backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { color: 'rgba(255,255,255,0.5)', fontSize: ms(18), lineHeight: ms(22) },
  headerRow: { flexDirection: 'row', gap: s(12), alignItems: 'flex-start' },
  iconBox: { width: s(50), height: s(50), borderRadius: s(15), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: s(7), flexWrap: 'wrap' },
  provName: { fontSize: ms(16), fontFamily: 'Sora_800ExtraBold', color: T.white, letterSpacing: -0.3 },
  badgePill: { paddingVertical: vs(2), paddingHorizontal: s(8), borderRadius: s(20) },
  badgeText: { fontSize: ms(9), fontFamily: 'Sora_700Bold' },
  addr: { fontSize: ms(12), color: 'rgba(255,255,255,0.38)', marginTop: vs(3) },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: s(4), marginTop: vs(4) },
  ratingNum: { fontSize: ms(12), fontFamily: 'Sora_600SemiBold', color: 'rgba(255,255,255,0.7)' },
  reviewCount: { fontSize: ms(12), color: 'rgba(255,255,255,0.3)' },
  pillRow: { flexDirection: 'row', gap: s(8), marginTop: vs(16) },
  infoPill: { flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: s(10), padding: s(10), alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  pillValue: { fontSize: ms(13), fontFamily: 'Sora_700Bold', color: T.white, marginTop: vs(3) },
  section: { padding: s(16), paddingHorizontal: s(20), borderBottomWidth: 1 },
  sectionLabel: { fontSize: ms(10), fontFamily: 'Sora_700Bold', letterSpacing: 1.2, marginBottom: vs(8) },
  timeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: s(12), padding: s(14), borderWidth: 1 },
  timeText: { fontSize: ms(20), fontFamily: 'Sora_800ExtraBold', letterSpacing: -0.5 },
  timeSub: { fontSize: ms(11), marginTop: vs(2) },
  slotsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: s(6) },
  slotChip: { paddingVertical: vs(5), paddingHorizontal: s(11), borderRadius: s(8), borderWidth: 1 },
  slotText: { fontSize: ms(12), fontFamily: 'Sora_600SemiBold' },
  priceBreakdown: { padding: s(12), paddingHorizontal: s(20), borderTopWidth: 1 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4) },
  priceLabel: { fontSize: ms(11) },
  priceValue: { fontSize: ms(11), fontFamily: 'Sora_700Bold' },
  ctaSection: { padding: s(14), paddingHorizontal: s(20), paddingBottom: vs(32) },
  bookBtn: { width: '100%', paddingVertical: vs(15), borderRadius: s(13), backgroundColor: T.ink, alignItems: 'center' },
  bookBtnText: { fontSize: ms(14), fontFamily: 'Sora_800ExtraBold', color: T.white, letterSpacing: -0.2 },
  doneView: { alignItems: 'center', paddingVertical: vs(10) },
  doneIcon: { width: s(52), height: s(52), borderRadius: s(16), alignItems: 'center', justifyContent: 'center', marginBottom: vs(10) },
  doneTitle: { fontSize: ms(15), fontFamily: 'Sora_800ExtraBold' },
  doneSub: { fontSize: ms(12), marginTop: vs(3) },
})
