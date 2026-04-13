/**
 * BookingsSheet — Modal-based bottom sheet for bookings/waitlist.
 * Uses React Native Modal (no reanimated/worklets dependency — Expo Go safe).
 * Animated slide-in via Animated.Value.
 */
import { Feather } from '@expo/vector-icons'
import { useEffect, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, Modal, Animated, ScrollView, Dimensions } from 'react-native'
import { Booking, WaitlistEntry, T } from '../lib/data'
import { useTheme } from '../lib/theme'
import { s, ms, vs } from '../lib/scale'

const { height: SCREEN_H } = Dimensions.get('window')

interface BookingsSheetProps {
  bookings: Booking[]
  waitlisted: WaitlistEntry[]
  isOpen: boolean
  onClose: () => void
  onCancelBooking: (id: number) => void
  onCancelWaitlist: (id: number) => void
}

export default function BookingsSheet({ bookings, waitlisted, isOpen, onClose, onCancelBooking, onCancelWaitlist }: BookingsSheetProps) {
  const { tk } = useTheme()
  const translateY = useRef(new Animated.Value(SCREEN_H)).current
  const empty = bookings.length === 0 && waitlisted.length === 0

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isOpen ? 0 : SCREEN_H,
      useNativeDriver: true,
      stiffness: 260,
      damping: 28,
    }).start()
  }, [isOpen])

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View style={[styles.sheet, { backgroundColor: tk.bg, transform: [{ translateY }] }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>My Bookings</Text>
            <View style={styles.counts}>
              <Text style={[styles.count, { color: T.green }]}>{bookings.length} confirmed</Text>
              {waitlisted.length > 0 && (
                <Text style={[styles.count, { color: T.accent }]}>{waitlisted.length} waitlisted</Text>
              )}
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {empty ? (
              <View style={styles.emptyView}>
                <Feather name="calendar" size={32} color={T.muted} style={{ marginBottom: 12 }} />
                <Text style={[styles.emptyTitle, { color: tk.text }]}>No bookings yet</Text>
                <Text style={[styles.emptySub, { color: tk.muted }]}>Tap a pin on the map to get started</Text>
              </View>
            ) : (
              <>
                {bookings.length > 0 && (
                  <>
                    <Text style={[styles.sectionLabel, { color: tk.muted }]}>Confirmed</Text>
                    {bookings.map(b => (
                      <View key={b.id} style={[styles.card, { backgroundColor: b.color + '0A', borderColor: b.color + '28' }]}>
                        <View style={[styles.cardIcon, { backgroundColor: b.color + '18', borderColor: b.color + '30' }]}>
                          <Feather name={(b.icon || 'grid') as any} size={16} color={b.color || T.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.cardName, { color: tk.text }]}>{b.provider.name}</Text>
                          <Text style={[styles.cardSub, { color: tk.muted }]}>{b.slot} · {b.provider.dur}</Text>
                        </View>
                        <View style={styles.cardActions}>
                          <View style={styles.freeBadge}><Text style={styles.freeText}>Free</Text></View>
                          <Pressable onPress={() => onCancelBooking(b.id)} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>✕</Text>
                          </Pressable>
                        </View>
                      </View>
                    ))}
                  </>
                )}
                {waitlisted.length > 0 && (
                  <>
                    <Text style={[styles.sectionLabel, { color: tk.muted, marginTop: 16 }]}>Waitlisted</Text>
                    {waitlisted.map(w => (
                      <View key={w.id} style={[styles.card, { backgroundColor: w.color + '08', borderColor: w.color + '20' }]}>
                        <View style={[styles.cardIcon, { backgroundColor: w.color + '18', borderColor: w.color + '30' }]}>
                          <Feather name={(w.icon || 'grid') as any} size={16} color={w.color || T.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.cardName, { color: tk.text }]}>{w.provider.name}</Text>
                          <Text style={[styles.cardSub, { color: tk.muted }]}>{w.hour} · waitlisted</Text>
                        </View>
                        <Pressable onPress={() => onCancelWaitlist(w.id)} style={styles.cancelBtn}>
                          <Text style={styles.cancelText}>✕</Text>
                        </Pressable>
                      </View>
                    ))}
                  </>
                )}
              </>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { maxHeight: '90%', borderTopLeftRadius: s(20), borderTopRightRadius: s(20) },
  handle: { width: s(36), height: vs(4), borderRadius: s(2), backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginTop: vs(10), marginBottom: vs(4) },
  header: { backgroundColor: T.ink, paddingVertical: vs(20), paddingHorizontal: s(24) },
  title: { fontSize: ms(22), fontFamily: 'Sora_800ExtraBold', color: T.white, letterSpacing: -0.5 },
  counts: { flexDirection: 'row', gap: s(16), marginTop: vs(4) },
  count: { fontSize: ms(12), fontFamily: 'Sora_600SemiBold' },
  scrollContent: { padding: s(16), paddingHorizontal: s(20) },
  emptyView: { alignItems: 'center', paddingVertical: vs(60) },
  emptyTitle: { fontSize: ms(15), fontFamily: 'Sora_700Bold' },
  emptySub: { fontSize: ms(13), marginTop: vs(6) },
  sectionLabel: { fontSize: ms(10), fontFamily: 'Sora_700Bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: vs(10) },
  card: { flexDirection: 'row', gap: s(12), alignItems: 'center', padding: s(14), paddingHorizontal: s(16), borderRadius: s(14), marginBottom: vs(8), borderWidth: 1 },
  cardIcon: { width: s(38), height: s(38), borderRadius: s(11), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cardName: { fontSize: ms(13), fontFamily: 'Sora_700Bold' },
  cardSub: { fontSize: ms(11), marginTop: vs(3) },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  freeBadge: { backgroundColor: 'rgba(0,184,124,0.1)', borderRadius: s(9), paddingVertical: vs(4), paddingHorizontal: s(9) },
  freeText: { fontSize: ms(11), fontFamily: 'Sora_800ExtraBold', color: T.green },
  cancelBtn: { width: s(26), height: s(26), borderRadius: s(8), backgroundColor: 'rgba(204,0,0,0.08)', alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: ms(13), color: '#CC0000' },
})
