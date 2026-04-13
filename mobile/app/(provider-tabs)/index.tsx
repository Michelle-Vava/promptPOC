/**
 * index.tsx — Provider dashboard screen.
 *
 * Features: live/pause toggle, stats row (bookings today, charged,
 * rating), incoming booking requests with accept/decline actions,
 * and a confirmed-today section.
 */
import { useState } from 'react'
import { View, Text, Pressable, ScrollView, Switch, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'

interface Request { id: number; time: string; customer: string }

export default function ProviderDashboard() {
  const { tk } = useTheme()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top

  const [isLive, setIsLive] = useState(true)
  const [requests, setRequests] = useState<Request[]>([
    { id: 1, time: '2:00 PM', customer: 'Customer #A44' },
    { id: 2, time: '4:30 PM', customer: 'Customer #B88' },
  ])
  const [accepted, setAccepted] = useState<{ id: number; time: string; customer: string }[]>([])

  const handleAccept = (r: Request) => {
    setAccepted(a => [...a, { id: r.id, time: r.time, customer: r.customer }])
    setRequests(rs => rs.filter(x => x.id !== r.id))
  }
  const handleReject = (id: number) => setRequests(rs => rs.filter(x => x.id !== id))

  const bookingsToday = 3 + accepted.length
  const chargedToday = 3 + accepted.length

  return (
    <View style={[styles.container, { backgroundColor: tk.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
        <View style={styles.headerRow}>
          <View style={styles.logoRow}>
            <View style={[styles.liveDot, { backgroundColor: isLive ? T.green : T.accent }]} />
            <Text style={[styles.logoText, { color: tk.text }]}>PROMPT</Text>
            <Text style={[styles.roleLabel, { color: tk.muted }]}>Provider</Text>
          </View>
        </View>
      </View>

      {/* Live toggle */}
      <View style={[styles.liveBanner, { backgroundColor: isLive ? 'rgba(0,184,124,0.08)' : 'rgba(255,92,0,0.06)', borderBottomColor: isLive ? 'rgba(0,184,124,0.18)' : 'rgba(255,92,0,0.15)' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={[styles.bannerDot, { backgroundColor: isLive ? T.green : T.accent }]} />
          <Text style={{ fontSize: 13, fontFamily: 'Sora_700Bold', color: isLive ? T.green : T.accent }}>
            {isLive ? "You're live · accepting bookings" : 'Paused · not visible'}
          </Text>
        </View>
        <Pressable onPress={() => setIsLive(v => !v)} style={[styles.livePauseBtn, {
          backgroundColor: isLive ? 'rgba(204,0,0,0.1)' : 'rgba(0,184,124,0.15)',
          borderColor: isLive ? 'rgba(204,0,0,0.2)' : 'rgba(0,184,124,0.25)',
        }]}>
          <Text style={{ fontSize: 12, fontFamily: 'Sora_700Bold', color: isLive ? '#CC2200' : T.green }}>
            {isLive ? 'Pause' : 'Go Live'}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={[styles.pageTitle, { color: tk.text }]}>Dashboard</Text>
        <Text style={[styles.pageSub, { color: tk.muted }]}>$1 per confirmed booking · Today only</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          {([['calendar', String(bookingsToday), 'Bookings Today'], ['dollar-sign', `$${chargedToday}`, 'Charged Today'], ['star', '4.8', 'Rating']] as [string, string, string][]).map(([ic, v, l]) => (
            <View key={l} style={[styles.statCard, { backgroundColor: tk.card, borderColor: tk.line }]}>
              <Feather name={ic as any} size={20} color={T.accent} />
              <Text style={[styles.statValue, { color: tk.text }]}>{v}</Text>
              <Text style={[styles.statLabel, { color: tk.muted }]}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Requests */}
        <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={[styles.cardTitle, { color: tk.text, marginBottom: 0 }]}>Incoming requests</Text>
            {requests.length > 0 && (
              <View style={{ backgroundColor: T.accent + '18', borderRadius: 8, paddingVertical: 2, paddingHorizontal: 8 }}>
                <Text style={{ fontSize: 11, fontFamily: 'Sora_700Bold', color: T.accent }}>{requests.length} pending</Text>
              </View>
            )}
          </View>

          {requests.length === 0 && accepted.length === 0 && (
            <Text style={{ textAlign: 'center', padding: 24, color: tk.muted, fontSize: 13 }}>No pending requests</Text>
          )}

          {requests.map(r => (
            <View key={r.id} style={[styles.requestRow, { borderTopColor: tk.line }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontFamily: 'Sora_600SemiBold', color: tk.text }}>{r.time}</Text>
                <Text style={{ fontSize: 12, color: tk.muted }}>· {r.customer}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Pressable onPress={() => handleAccept(r)} style={styles.acceptBtn}>
                  <Text style={styles.acceptBtnText}>Accept $1</Text>
                </Pressable>
                <Pressable onPress={() => handleReject(r.id)} style={styles.rejectBtn}>
                  <Text style={styles.rejectBtnText}>Decline</Text>
                </Pressable>
              </View>
            </View>
          ))}

          {accepted.length > 0 && (
            <>
              <Text style={[styles.fieldLabel, { color: tk.muted, marginTop: 16, marginBottom: 6 }]}>Confirmed today</Text>
              {accepted.map(a => (
                <View key={a.id} style={[styles.requestRow, { borderTopColor: tk.line }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontFamily: 'Sora_600SemiBold', color: tk.text }}>{a.time}</Text>
                    <Text style={{ fontSize: 12, color: tk.muted }}>· {a.customer}</Text>
                  </View>
                  <View style={{ backgroundColor: 'rgba(0,184,124,0.1)', borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 }}>
                    <Text style={{ fontSize: 11, fontFamily: 'Sora_700Bold', color: T.green }}>Confirmed</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 7, height: 7, borderRadius: 4 },
  logoText: { fontSize: 16, fontFamily: 'Sora_800ExtraBold', letterSpacing: -0.4 },
  roleLabel: { fontSize: 11, fontFamily: 'Sora_600SemiBold', marginLeft: 4 },
  liveBanner: { paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  bannerDot: { width: 8, height: 8, borderRadius: 4 },
  livePauseBtn: { paddingVertical: 7, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },
  pageTitle: { fontSize: 28, fontFamily: 'Sora_800ExtraBold', letterSpacing: -1, marginBottom: 4 },
  pageSub: { fontSize: 14, marginBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center', borderWidth: 1 },
  statValue: { fontSize: 20, fontFamily: 'Sora_800ExtraBold', letterSpacing: -0.5, marginTop: 4 },
  statLabel: { fontSize: 10, marginTop: 3, textAlign: 'center' },
  card: { borderRadius: 18, padding: 20, marginBottom: 16, borderWidth: 1 },
  cardTitle: { fontSize: 14, fontFamily: 'Sora_800ExtraBold', marginBottom: 16 },
  fieldLabel: { fontSize: 10, fontFamily: 'Sora_700Bold', textTransform: 'uppercase', letterSpacing: 1 },
  requestRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1 },
  acceptBtn: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 9, backgroundColor: 'rgba(0,184,124,0.1)' },
  acceptBtnText: { fontSize: 12, fontFamily: 'Sora_800ExtraBold', color: T.green },
  rejectBtn: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 9, backgroundColor: 'rgba(204,0,0,0.08)' },
  rejectBtnText: { fontSize: 12, fontFamily: 'Sora_800ExtraBold', color: '#CC0000' },
})
