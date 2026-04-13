/**
 * services.tsx — Browse all providers in a list view.
 *
 * Rich card previews with status (open/closed), next available slot,
 * and slot count. Tap a card → slot picker bottom sheet → pick a
 * time → confirm booking. Includes double-booking prevention and
 * success/error toasts.
 */
import { useState, useCallback, useEffect, useRef } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, StatusBar as RNStatusBar, Modal, Animated, Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { Feather } from '@expo/vector-icons'
import { PROVIDERS, GROUPS, HOURS, Provider, T } from '../../lib/data'
import { useTheme } from '../../lib/theme'
import { useBookings } from '../../lib/bookings-context'
import { s, ms, vs } from '../../lib/scale'
import CategoryBar from '../../components/CategoryBar'
import Skeleton from '../../components/Skeleton'
import Toast, { ToastData } from '../../components/Toast'

const { height: SCREEN_H } = Dimensions.get('window')

/** Mock "current hour" for open/closed logic — pretend it's 11 AM */
const MOCK_NOW_HOUR = 11

function parseHour(slot: string): number {
  const [n, m] = slot.split(' ')
  let h = parseInt(n)
  if (m === 'PM' && h !== 12) h += 12
  if (m === 'AM' && h === 12) h = 0
  return h
}

function getProviderStatus(p: Provider): { label: string; color: string; nextSlot: string | null } {
  const futureSlots = p.slots.filter(sl => parseHour(sl) >= MOCK_NOW_HOUR)
  if (futureSlots.length > 0) {
    return { label: 'Open', color: T.green, nextSlot: futureSlots[0] }
  }
  if (p.slots.length > 0) {
    return { label: 'Closed', color: '#CC2200', nextSlot: null }
  }
  return { label: 'No slots', color: '#888', nextSlot: null }
}

/* ── Slot Picker Bottom Sheet ── */
interface SlotPickerProps {
  provider: Provider | null
  onBook: (provider: Provider, slot: string) => void
  onClose: () => void
}

function SlotPicker({ provider, onBook, onClose }: SlotPickerProps) {
  const { tk } = useTheme()
  const translateY = useRef(new Animated.Value(SCREEN_H)).current
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const isOpen = !!provider

  useEffect(() => {
    if (isOpen) {
      setSelected(null)
      setConfirmed(false)
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
  const status = getProviderStatus(provider)

  const handleConfirm = () => {
    if (!selected) return
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setConfirmed(true)
    setTimeout(() => onBook(provider, selected), 900)
  }

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={onClose}>
      <View style={slotStyles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View style={[slotStyles.sheet, { backgroundColor: tk.card, transform: [{ translateY }] }]}>
          {/* Drag handle */}
          <View style={slotStyles.handle} />
          {/* Category bar */}
          <View style={[slotStyles.colorBar, { backgroundColor: cg?.color }]} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={slotStyles.header}>
              <Pressable onPress={onClose} style={slotStyles.closeBtn}>
                <Text style={slotStyles.closeBtnText}>×</Text>
              </Pressable>
              <View style={slotStyles.headerRow}>
                <View style={[slotStyles.iconBox, { backgroundColor: cg?.color + '22', borderColor: cg?.color + '33' }]}>
                  <Feather name={(cg?.icon ?? 'grid') as any} size={20} color={cg?.color ?? T.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={slotStyles.provName}>{provider.name}</Text>
                  <Text style={slotStyles.addr}>{provider.addr}</Text>
                  <View style={slotStyles.ratingRow}>
                    <Text style={{ color: '#FFA500' }}>{'★'.repeat(Math.floor(provider.rating))}</Text>
                    <Text style={slotStyles.ratingNum}>{provider.rating}</Text>
                    <Text style={slotStyles.reviewCount}>({provider.reviews})</Text>
                  </View>
                </View>
              </View>
              {/* Info pills */}
              <View style={slotStyles.pillRow}>
                <View style={slotStyles.infoPill}>
                  <Feather name="credit-card" size={14} color="rgba(255,255,255,0.5)" />
                  <Text style={slotStyles.pillValue}>{provider.price === 0 ? 'Free' : `$${provider.price}`}</Text>
                </View>
                <View style={slotStyles.infoPill}>
                  <Feather name="clock" size={14} color="rgba(255,255,255,0.5)" />
                  <Text style={slotStyles.pillValue}>{provider.dur}</Text>
                </View>
                <View style={slotStyles.infoPill}>
                  <View style={[slotStyles.statusDot, { backgroundColor: status.color }]} />
                  <Text style={[slotStyles.pillValue, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>
            </View>

            {/* Slot grid */}
            <View style={[slotStyles.section, { borderBottomColor: tk.line }]}>
              <Text style={[slotStyles.sectionLabel, { color: tk.muted }]}>PICK A TIME</Text>
              <View style={slotStyles.slotsGrid}>
                {provider.slots.map(sl => {
                  const isPast = parseHour(sl) < MOCK_NOW_HOUR
                  const isSel = sl === selected
                  return (
                    <Pressable
                      key={sl}
                      onPress={() => { if (!isPast) { setSelected(sl); Haptics.selectionAsync() } }}
                      style={[slotStyles.slotBtn, {
                        backgroundColor: isSel ? (cg?.color ?? T.accent) : isPast ? tk.surface : tk.card,
                        borderColor: isSel ? (cg?.color ?? T.accent) : tk.line,
                        opacity: isPast ? 0.4 : 1,
                      }]}
                    >
                      <Text style={[slotStyles.slotBtnText, { color: isSel ? '#fff' : tk.text }]}>{sl}</Text>
                      {isPast && <Text style={[slotStyles.slotPast, { color: tk.muted }]}>past</Text>}
                    </Pressable>
                  )
                })}
              </View>
            </View>

            {/* Price breakdown */}
            {!confirmed && selected && (
              <View style={[slotStyles.priceBreakdown, { borderTopColor: tk.line, backgroundColor: tk.surface }]}>
                <View style={slotStyles.priceRow}>
                  <Text style={[slotStyles.priceLabel, { color: tk.muted }]}>Your cost</Text>
                  <Text style={[slotStyles.priceVal, { color: T.green }]}>$0.00 — Free</Text>
                </View>
                <View style={slotStyles.priceRow}>
                  <Text style={[slotStyles.priceLabel, { color: tk.muted }]}>Provider fee</Text>
                  <Text style={[slotStyles.priceLabel, { color: tk.muted, fontFamily: 'Sora_600SemiBold' }]}>$1.00</Text>
                </View>
              </View>
            )}

            {/* CTA */}
            <View style={slotStyles.ctaSection}>
              {!confirmed ? (
                <Pressable
                  style={({ pressed }) => [slotStyles.bookBtn, { opacity: selected ? (pressed ? 0.85 : 1) : 0.4 }]}
                  onPress={handleConfirm}
                  disabled={!selected}
                >
                  <Text style={slotStyles.bookBtnText}>
                    {selected ? `Confirm — Book ${selected} free →` : 'Select a time above'}
                  </Text>
                </Pressable>
              ) : (
                <View style={slotStyles.doneView}>
                  <View style={[slotStyles.doneIcon, { backgroundColor: T.green + '18' }]}>
                    <Feather name="check" size={22} color={T.green} />
                  </View>
                  <Text style={[slotStyles.doneTitle, { color: tk.text }]}>Booked!</Text>
                  <Text style={[slotStyles.doneSub, { color: tk.muted }]}>{provider.name} · {selected}</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  )
}

const slotStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { maxHeight: '88%', borderTopLeftRadius: s(20), borderTopRightRadius: s(20) },
  handle: { width: s(36), height: vs(4), borderRadius: s(2), backgroundColor: 'rgba(128,128,128,0.35)', alignSelf: 'center', marginTop: vs(10), marginBottom: vs(4) },
  colorBar: { height: vs(4) },
  header: { backgroundColor: T.ink, padding: s(20), paddingTop: vs(16) },
  closeBtn: { alignSelf: 'flex-end', marginBottom: vs(8), width: s(28), height: s(28), borderRadius: s(14), backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { color: 'rgba(255,255,255,0.5)', fontSize: ms(18), lineHeight: ms(22) },
  headerRow: { flexDirection: 'row', gap: s(12), alignItems: 'flex-start' },
  iconBox: { width: s(50), height: s(50), borderRadius: s(15), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  provName: { fontSize: ms(16), fontFamily: 'Sora_800ExtraBold', color: T.white, letterSpacing: -0.3 },
  addr: { fontSize: ms(12), color: 'rgba(255,255,255,0.38)', marginTop: vs(3) },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: s(4), marginTop: vs(4) },
  ratingNum: { fontSize: ms(12), fontFamily: 'Sora_600SemiBold', color: 'rgba(255,255,255,0.7)' },
  reviewCount: { fontSize: ms(12), color: 'rgba(255,255,255,0.3)' },
  pillRow: { flexDirection: 'row', gap: s(8), marginTop: vs(16) },
  infoPill: { flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: s(10), padding: s(10), alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', flexDirection: 'row', justifyContent: 'center', gap: s(5) },
  pillValue: { fontSize: ms(12), fontFamily: 'Sora_700Bold', color: T.white },
  statusDot: { width: s(6), height: s(6), borderRadius: s(3) },
  section: { padding: s(16), paddingHorizontal: s(20), borderBottomWidth: 1 },
  sectionLabel: { fontSize: ms(10), fontFamily: 'Sora_700Bold', letterSpacing: 1.2, marginBottom: vs(12) },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: s(8) },
  slotBtn: { paddingVertical: vs(12), paddingHorizontal: s(16), borderRadius: s(12), borderWidth: 1.5, minWidth: s(80), alignItems: 'center' },
  slotBtnText: { fontSize: ms(14), fontFamily: 'Sora_700Bold' },
  slotPast: { fontSize: ms(9), marginTop: vs(2) },
  priceBreakdown: { padding: s(12), paddingHorizontal: s(20), borderTopWidth: 1 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4) },
  priceLabel: { fontSize: ms(11) },
  priceVal: { fontSize: ms(11), fontFamily: 'Sora_700Bold' },
  ctaSection: { padding: s(14), paddingHorizontal: s(20), paddingBottom: vs(32) },
  bookBtn: { width: '100%', paddingVertical: vs(15), borderRadius: s(13), backgroundColor: T.ink, alignItems: 'center' },
  bookBtnText: { fontSize: ms(14), fontFamily: 'Sora_800ExtraBold', color: T.white, letterSpacing: -0.2 },
  doneView: { alignItems: 'center', paddingVertical: vs(10) },
  doneIcon: { width: s(52), height: s(52), borderRadius: s(16), alignItems: 'center', justifyContent: 'center', marginBottom: vs(10) },
  doneTitle: { fontSize: ms(15), fontFamily: 'Sora_800ExtraBold' },
  doneSub: { fontSize: ms(12), marginTop: vs(3) },
})

/* ── Main Screen ── */

export default function ServicesScreen() {
  const { tk } = useTheme()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const { bookings, addBooking } = useBookings()
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])
  const pushToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
    setToasts(ts => [...ts, { id: Date.now(), message, type }])
  }, [])
  const dismissToast = useCallback((id: number) => {
    setToasts(ts => ts.filter(t => t.id !== id))
  }, [])

  const handleBook = (prov: Provider, slot: string) => {
    if (bookings.some(b => b.provider.id === prov.id && b.slot === slot)) {
      pushToast('Already booked this slot', 'error')
      return
    }
    const cg = GROUPS.find(g => g.id === prov.cat)
    addBooking({ id: Date.now(), provider: prov, slot, color: cg?.color ?? '', icon: cg?.icon ?? '' })
    pushToast(`Booked! ${prov.name} · ${slot}`)
    setTimeout(() => setSelectedProvider(null), 1200)
  }

  const filtered = activeCategory
    ? PROVIDERS.filter(p => p.cat === activeCategory)
    : PROVIDERS

  return (
    <View style={[styles.container, { backgroundColor: tk.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + vs(16), backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
        <Text style={[styles.title, { color: tk.text }]}>Services</Text>
        <Text style={[styles.subtitle, { color: tk.muted }]}>{filtered.length} providers in Halifax</Text>
      </View>

      <CategoryBar category={activeCategory} setCategory={setActiveCategory} />

      <ScrollView
        style={[styles.list, { backgroundColor: tk.bg }]}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
              <Skeleton width={s(48)} height={s(48)} borderRadius={s(14)} />
              <View style={[styles.cardBody, { gap: vs(8) }]}>
                <Skeleton width={s(140)} height={ms(14)} borderRadius={s(4)} />
                <Skeleton width={s(180)} height={ms(11)} borderRadius={s(4)} />
                <Skeleton width={s(100)} height={ms(11)} borderRadius={s(4)} />
              </View>
            </View>
          ))
        ) : (
        filtered.map(p => {
          const g = GROUPS.find(gr => gr.id === p.cat)
          const status = getProviderStatus(p)
          return (
            <Pressable key={p.id} onPress={() => setSelectedProvider(p)} style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
              <View style={[styles.cardIcon, { backgroundColor: (g?.color ?? T.accent) + '15' }]}>
                <Feather name={(g?.icon ?? 'grid') as any} size={ms(20)} color={g?.color ?? T.accent} />
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <Text style={[styles.cardName, { color: tk.text }]} numberOfLines={1}>{p.name}</Text>
                  {p.badge && (
                    <View style={[styles.badgePill, { backgroundColor: (g?.color ?? T.accent) + '22' }]}>
                      <Text style={[styles.badgeLabel, { color: g?.color ?? T.accent }]}>{p.badge}</Text>
                    </View>
                  )}
                </View>

                {/* Status row: open/closed + next slot */}
                <View style={styles.statusRow}>
                  <View style={[styles.statusIndicator, { backgroundColor: status.color + '18' }]}>
                    <View style={[styles.statusDotSmall, { backgroundColor: status.color }]} />
                    <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
                  </View>
                  {status.nextSlot && (
                    <Text style={[styles.nextSlotText, { color: tk.muted }]}>Next: {status.nextSlot}</Text>
                  )}
                </View>

                <View style={styles.cardMeta}>
                  <View style={styles.ratingRow}>
                    <Feather name="star" size={ms(11)} color="#F5A623" />
                    <Text style={styles.ratingText}>{p.rating}</Text>
                    <Text style={[styles.reviewsText, { color: tk.muted }]}>({p.reviews})</Text>
                  </View>
                  <Text style={[styles.priceText, { color: tk.sub }]}>
                    {p.price === 0 ? 'Free' : `$${p.price}`} · {p.dur}
                  </Text>
                  <View style={[styles.slotsBadge, { backgroundColor: T.green + '15' }]}>
                    <Text style={[styles.slotsText, { color: T.green }]}>{p.slots.length} slots</Text>
                  </View>
                </View>
              </View>
              <Feather name="chevron-right" size={ms(18)} color={tk.muted} />
            </Pressable>
          )
        })
        )}
      </ScrollView>

      {/* Slot picker bottom sheet */}
      <SlotPicker
        provider={selectedProvider}
        onBook={handleBook}
        onClose={() => setSelectedProvider(null)}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: s(20),
    paddingBottom: vs(16),
    borderBottomWidth: 1,
  },
  title: {
    fontSize: ms(26),
    fontFamily: 'Sora_800ExtraBold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: ms(13),
    fontFamily: 'Sora_400Regular',
    marginTop: vs(4),
  },

  list: { flex: 1 },
  listContent: {
    padding: s(16),
    paddingBottom: vs(20),
    gap: vs(10),
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(14),
    borderRadius: s(16),
    borderWidth: 1,
    gap: s(14),
  },
  cardIcon: {
    width: s(48),
    height: s(48),
    borderRadius: s(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: vs(3) },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  cardName: {
    fontSize: ms(14),
    fontFamily: 'Sora_700Bold',
    flex: 1,
  },
  badgePill: {
    paddingVertical: vs(2),
    paddingHorizontal: s(8),
    borderRadius: s(8),
  },
  badgeLabel: {
    fontSize: ms(9),
    fontFamily: 'Sora_700Bold',
  },

  /* Status row */
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginTop: vs(1),
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingVertical: vs(2),
    paddingHorizontal: s(7),
    borderRadius: s(6),
  },
  statusDotSmall: {
    width: s(5),
    height: s(5),
    borderRadius: s(3),
  },
  statusLabel: {
    fontSize: ms(10),
    fontFamily: 'Sora_700Bold',
  },
  nextSlotText: {
    fontSize: ms(10),
    fontFamily: 'Sora_400Regular',
  },

  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginTop: vs(2),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
  },
  ratingText: {
    fontSize: ms(11),
    fontFamily: 'Sora_700Bold',
    color: '#F5A623',
  },
  reviewsText: {
    fontSize: ms(10),
  },
  priceText: {
    fontSize: ms(11),
    fontFamily: 'Sora_600SemiBold',
  },
  slotsBadge: {
    paddingVertical: vs(1),
    paddingHorizontal: s(6),
    borderRadius: s(6),
  },
  slotsText: {
    fontSize: ms(10),
    fontFamily: 'Sora_700Bold',
  },
})
