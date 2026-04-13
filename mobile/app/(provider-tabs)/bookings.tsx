import { View, Text, ScrollView, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'

const BILLING_ROWS = [
  { date: 'Apr 12, 2026', id: 'BK-1045', amount: '$1.00', customer: 'Sarah M.', time: '10:00 AM', status: 'Confirmed' },
  { date: 'Apr 12, 2026', id: 'BK-1044', amount: '$1.00', customer: 'Chris T.', time: '11:30 AM', status: 'Confirmed' },
  { date: 'Apr 12, 2026', id: 'BK-1043', amount: '$1.00', customer: 'Aisha R.', time: '2:00 PM', status: 'Confirmed' },
  { date: 'Apr 11, 2026', id: 'BK-1042', amount: '$1.00', customer: 'Liam K.', time: '9:00 AM', status: 'Completed' },
  { date: 'Apr 11, 2026', id: 'BK-1041', amount: '$1.00', customer: 'Priya S.', time: '1:00 PM', status: 'Completed' },
  { date: 'Apr 11, 2026', id: 'BK-1040', amount: '$1.00', customer: 'Jordan B.', time: '4:00 PM', status: 'Completed' },
  { date: 'Apr 10, 2026', id: 'BK-1039', amount: '$1.00', customer: 'Taylor W.', time: '10:30 AM', status: 'Completed' },
  { date: 'Apr 10, 2026', id: 'BK-1038', amount: '$1.00', customer: 'Sam D.', time: '3:00 PM', status: 'Completed' },
]

export default function ProviderBookings() {
  const { tk } = useTheme()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top

  const todayBookings = BILLING_ROWS.filter(r => r.date === 'Apr 12, 2026')
  const pastBookings = BILLING_ROWS.filter(r => r.date !== 'Apr 12, 2026')

  return (
    <View style={[styles.container, { backgroundColor: tk.bg }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
        <Text style={[styles.title, { color: tk.text }]}>Bookings</Text>
        <Text style={[styles.subtitle, { color: tk.muted }]}>
          {BILLING_ROWS.length} bookings · ${BILLING_ROWS.length}.00 earned
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Today */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: tk.muted }]}>TODAY</Text>
          {todayBookings.map(b => (
            <View key={b.id} style={[styles.card, { backgroundColor: tk.card, borderLeftColor: T.green }]}>
              <View style={[styles.cardIcon, { backgroundColor: 'rgba(0,184,124,0.1)' }]}>
                <Feather name="check-circle" size={18} color={T.green} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardName, { color: tk.text }]}>{b.customer}</Text>
                <Text style={[styles.cardDetail, { color: tk.muted }]}>{b.time} · {b.id}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(0,184,124,0.1)' }]}>
                <Text style={[styles.statusText, { color: T.green }]}>{b.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* History */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: tk.muted }]}>HISTORY</Text>
          {pastBookings.map(b => (
            <View key={b.id} style={[styles.card, { backgroundColor: tk.card, borderLeftColor: tk.line }]}>
              <View style={[styles.cardIcon, { backgroundColor: tk.surface }]}>
                <Feather name="clock" size={18} color={tk.muted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardName, { color: tk.text }]}>{b.customer}</Text>
                <Text style={[styles.cardDetail, { color: tk.muted }]}>{b.date} · {b.time} · {b.id}</Text>
              </View>
              <Text style={[styles.amount, { color: tk.text }]}>{b.amount}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={[styles.totalCard, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <Text style={{ fontSize: 13, color: tk.muted }}>This month · {BILLING_ROWS.length} bookings</Text>
          <Text style={{ fontSize: 20, fontFamily: 'Sora_800ExtraBold', color: tk.text }}>${BILLING_ROWS.length}.00</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  title: { fontSize: 26, fontFamily: 'Sora_800ExtraBold', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontFamily: 'Sora_400Regular', marginTop: 4 },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 10, fontFamily: 'Sora_700Bold', letterSpacing: 1.5, marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderLeftWidth: 3, marginBottom: 8, gap: 12 },
  cardIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardName: { fontSize: 14, fontFamily: 'Sora_700Bold' },
  cardDetail: { fontSize: 12, fontFamily: 'Sora_400Regular', marginTop: 2 },
  statusBadge: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  statusText: { fontSize: 11, fontFamily: 'Sora_700Bold' },
  amount: { fontSize: 14, fontFamily: 'Sora_700Bold' },
  totalCard: { borderRadius: 18, padding: 20, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
})
