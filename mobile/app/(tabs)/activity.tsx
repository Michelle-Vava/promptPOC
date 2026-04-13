import { View, Text, ScrollView, Pressable, Alert, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'
import { useBookings } from '../../lib/bookings-context'
import { s, ms, vs } from '../../lib/scale'

export default function ActivityScreen() {
  const { tk } = useTheme()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top
  const { bookings, waitlisted, removeBooking, removeWaitlist } = useBookings()

  const confirmCancel = (id: number, providerName: string) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking with ${providerName}? The provider may have reserved this slot for you.`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        { text: 'Cancel Booking', style: 'destructive', onPress: () => removeBooking(id) },
      ]
    )
  }

  const confirmRemoveWaitlist = (id: number, providerName: string) => {
    Alert.alert(
      'Leave Waitlist',
      `Remove yourself from the waitlist at ${providerName}?`,
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => removeWaitlist(id) },
      ]
    )
  }

  const isEmpty = bookings.length === 0 && waitlisted.length === 0

  return (
    <View style={[styles.container, { backgroundColor: tk.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + vs(16), backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
        <Text style={[styles.title, { color: tk.text }]}>Activity</Text>
        {!isEmpty && (
          <Text style={[styles.subtitle, { color: tk.muted }]}>
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''} · {waitlisted.length} waitlisted
          </Text>
        )}
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: tk.bg }]}
        contentContainerStyle={[styles.scrollContent, isEmpty && styles.emptyContent]}
        showsVerticalScrollIndicator={false}
      >
        {isEmpty ? (
          <View style={styles.emptyState}>
            <Feather name="calendar" size={40} color={tk.muted} style={{ marginBottom: vs(16) }} />
            <Text style={[styles.emptyTitle, { color: tk.text }]}>No activity yet</Text>
            <Text style={[styles.emptyDesc, { color: tk.muted }]}>
              Book a service from the map to see{'\n'}your upcoming appointments here
            </Text>
          </View>
        ) : (
          <>
            {/* Confirmed */}
            {bookings.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: tk.muted }]}>CONFIRMED</Text>
                {bookings.map(b => (
                  <View key={b.id} style={[styles.card, { backgroundColor: tk.card, borderLeftColor: b.color || T.accent }]}>
                    <View style={[styles.cardLeft, { backgroundColor: tk.surface }]}>
                      <Feather name={(b.icon || 'grid') as any} size={ms(18)} color={T.green} />
                    </View>
                    <View style={styles.cardBody}>
                      <Text style={[styles.cardProvider, { color: tk.text }]}>{b.provider.name}</Text>
                      <Text style={[styles.cardDetail, { color: tk.muted }]}>{b.slot} · ${b.provider.price}</Text>
                      <Text style={[styles.cardAddr, { color: tk.muted }]}>{b.provider.addr}</Text>
                    </View>
                    <Pressable onPress={() => confirmCancel(b.id, b.provider.name)} style={[styles.cancelBtn, { backgroundColor: tk.surface }]} hitSlop={8}>
                      <Feather name="x" size={ms(16)} color={tk.muted} />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            {/* Waitlisted */}
            {waitlisted.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: tk.muted }]}>WAITLISTED</Text>
                {waitlisted.map(w => (
                  <View key={w.id} style={[styles.card, styles.cardWaitlist, { backgroundColor: tk.card, borderLeftColor: w.color || T.accent }]}>
                    <View style={[styles.cardLeft, { backgroundColor: tk.surface }]}>
                      <Feather name={(w.icon || 'grid') as any} size={ms(18)} color={T.accent} />
                    </View>
                    <View style={styles.cardBody}>
                      <Text style={[styles.cardProvider, { color: tk.text }]}>{w.provider.name}</Text>
                      <Text style={[styles.cardDetail, { color: tk.muted }]}>Waiting for {w.hour}</Text>
                      <Text style={[styles.cardAddr, { color: tk.muted }]}>{w.provider.addr}</Text>
                    </View>
                    <Pressable onPress={() => confirmRemoveWaitlist(w.id, w.provider.name)} style={[styles.cancelBtn, { backgroundColor: tk.surface }]} hitSlop={8}>
                      <Feather name="x" size={ms(16)} color={tk.muted} />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
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

  scroll: { flex: 1 },
  scrollContent: {
    padding: s(16),
    paddingBottom: vs(24),
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: vs(60),
  },
  emptyTitle: {
    fontSize: ms(18),
    fontFamily: 'Sora_700Bold',
    marginBottom: vs(8),
  },
  emptyDesc: {
    fontSize: ms(13),
    fontFamily: 'Sora_400Regular',
    textAlign: 'center',
    lineHeight: ms(20),
  },

  section: {
    marginBottom: vs(24),
  },
  sectionLabel: {
    fontSize: ms(10),
    fontFamily: 'Sora_700Bold',
    letterSpacing: 1.5,
    marginBottom: vs(12),
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(14),
    borderRadius: s(14),
    borderLeftWidth: 3,
    marginBottom: vs(8),
    gap: s(12),
  },
  cardWaitlist: {
    opacity: 0.75,
  },
  cardLeft: {
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: vs(2) },
  cardProvider: {
    fontSize: ms(14),
    fontFamily: 'Sora_700Bold',
  },
  cardDetail: {
    fontSize: ms(12),
    fontFamily: 'Sora_600SemiBold',
  },
  cardAddr: {
    fontSize: ms(11),
    fontFamily: 'Sora_400Regular',
  },
  cancelBtn: {
    width: s(32),
    height: s(32),
    borderRadius: s(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
})
