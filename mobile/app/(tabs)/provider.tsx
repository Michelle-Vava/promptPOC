import { useState } from 'react'
import { View, Text, Pressable, ScrollView, Switch, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'

interface Request { id: number; time: string; customer: string }
interface AcceptedBooking { id: number; time: string; customer: string }

const BILLING_ROWS = [
  { date: 'Apr 8, 2025', id: 'BK-1041', amount: '$1.00', status: 'Charged' },
  { date: 'Apr 8, 2025', id: 'BK-1040', amount: '$1.00', status: 'Charged' },
  { date: 'Apr 7, 2025', id: 'BK-1039', amount: '$1.00', status: 'Charged' },
  { date: 'Apr 7, 2025', id: 'BK-1038', amount: '$1.00', status: 'Charged' },
  { date: 'Apr 6, 2025', id: 'BK-1037', amount: '$1.00', status: 'Charged' },
  { date: 'Apr 5, 2025', id: 'BK-1036', amount: '$1.00', status: 'Charged' },
]

const SLOT_HOURS = ['8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM']
const DURATIONS = [15, 20, 30, 45, 60, 90]

function to24(h: string) {
  const [n, m] = h.split(' ')
  let num = parseInt(n)
  if (m === 'PM' && num !== 12) num += 12
  if (m === 'AM' && num === 12) num = 0
  return num
}

function generateSlots(start: string, end: string, dur: number): string[] {
  const s = to24(start), e = to24(end)
  const slots: string[] = []
  for (let h = s; h < e; h++) {
    for (let m = 0; m < 60; m += dur) {
      if (h * 60 + m + dur > e * 60) break
      const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
      const ampm = h < 12 ? 'AM' : 'PM'
      slots.push(m === 0 ? `${hour} ${ampm}` : `${hour}:${String(m).padStart(2, '0')} ${ampm}`)
    }
  }
  return slots
}

export default function ProviderDashboard() {
  const { tk } = useTheme()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top

  const [tab, setTab] = useState<'dashboard' | 'account'>('dashboard')
  const [isLive, setIsLive] = useState(true)

  // Slots
  const [editingSlots, setEditingSlots] = useState(false)
  const [startHour, setStartHour] = useState('9 AM')
  const [endHour, setEndHour] = useState('6 PM')
  const [slotDur, setSlotDur] = useState(30)
  const [savedStart, setSavedStart] = useState('9 AM')
  const [savedEnd, setSavedEnd] = useState('6 PM')
  const [savedDur, setSavedDur] = useState(30)

  // Requests
  const [requests, setRequests] = useState<Request[]>([
    { id: 1, time: '2:00 PM', customer: 'Customer #A44' },
    { id: 2, time: '4:30 PM', customer: 'Customer #B88' },
  ])
  const [accepted, setAccepted] = useState<AcceptedBooking[]>([])

  const handleAccept = (r: Request) => {
    setAccepted(a => [...a, { id: r.id, time: r.time, customer: r.customer }])
    setRequests(rs => rs.filter(x => x.id !== r.id))
  }
  const handleReject = (id: number) => setRequests(rs => rs.filter(x => x.id !== id))

  const handleSaveSlots = () => {
    setSavedStart(startHour)
    setSavedEnd(endHour)
    setSavedDur(slotDur)
    setEditingSlots(false)
  }

  const previewSlots = generateSlots(startHour, endHour, slotDur)
  const bookingsToday = 3 + accepted.length
  const chargedToday = 3 + accepted.length

  // Slot picker helper
  const SlotPicker = ({ label, value, options, onChange }: { label: string; value: string | number; options: { label: string; value: string | number }[]; onChange: (v: string) => void }) => {
    const idx = options.findIndex(o => String(o.value) === String(value))
    return (
      <View style={{ flex: 1 }}>
        <Text style={[styles.fieldLabel, { color: tk.muted }]}>{label}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
          {options.map(o => (
            <Pressable
              key={String(o.value)}
              onPress={() => onChange(String(o.value))}
              style={[styles.pickerChip, { backgroundColor: String(o.value) === String(value) ? T.accent : tk.surface, borderColor: String(o.value) === String(value) ? T.accent : tk.line }]}
            >
              <Text style={[styles.pickerChipText, { color: String(o.value) === String(value) ? T.white : tk.text }]}>{o.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: tk.bg }]}>
      {/* Nav */}
      <View style={[styles.nav, { paddingTop: topPad, backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
        <View style={styles.navInner}>
          <View style={styles.logoRow}>
            <View style={styles.liveDot} />
            <Text style={[styles.logoText, { color: tk.text }]}>PROMPT</Text>
          </View>
          <View style={[styles.tabRow, { backgroundColor: tk.inputBg }]}>
            <Pressable onPress={() => setTab('dashboard')} style={[styles.tabBtn, tab === 'dashboard' && { backgroundColor: tk.card }]}>
              <Text style={[styles.tabBtnText, { color: tk.muted }, tab === 'dashboard' && { color: tk.text }]}>Dashboard</Text>
            </Pressable>
            <Pressable onPress={() => setTab('account')} style={[styles.tabBtn, tab === 'account' && { backgroundColor: tk.card }]}>
              <Text style={[styles.tabBtnText, { color: tk.muted }, tab === 'account' && { color: tk.text }]}>Account</Text>
            </Pressable>
          </View>
          <Pressable onPress={() => router.navigate('/(tabs)/')} style={[styles.navBtn, { flexDirection: 'row', gap: 6, width: 'auto', paddingHorizontal: 12, backgroundColor: tk.surface, borderColor: tk.line }]}>
            <Feather name="arrow-left" size={14} color={tk.muted} />
            <Text style={{ fontSize: 12, fontFamily: 'Sora_600SemiBold', color: tk.muted }}>Customer</Text>
          </Pressable>
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

      {/* Floating "Update slots" CTA — visible on dashboard when not editing */}
      {tab === 'dashboard' && !editingSlots && (
        <View style={[styles.floatingCta, { bottom: insets.bottom + 16 }]}>
          <Pressable
            onPress={() => setEditingSlots(true)}
            style={({ pressed }) => [styles.floatingBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.floatingBtnText}>Update my slots</Text>
          </Pressable>
        </View>
      )}

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* ── Dashboard tab ─── */}
        {tab === 'dashboard' && (
          <>
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

            {/* Availability */}
            <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
              <Text style={[styles.cardTitle, { color: tk.text }]}>Today's availability</Text>

              {!editingSlots ? (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    {([['Start', savedStart], ['End', savedEnd], ['Slot', `${savedDur} min`]] as [string, string][]).map(([l, v]) => (
                      <View key={l}>
                        <Text style={[styles.fieldLabel, { color: tk.muted }]}>{l}</Text>
                        <Text style={[styles.fieldValue, { color: tk.text }]}>{v}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.chipsWrap}>
                    {generateSlots(savedStart, savedEnd, savedDur).map(s => (
                      <View key={s} style={styles.slotChip}>
                        <Text style={styles.slotChipText}>{s}</Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <>
                  <SlotPicker label="Start" value={startHour} options={SLOT_HOURS.slice(0, -1).map(h => ({ label: h, value: h }))} onChange={v => setStartHour(v)} />
                  <View style={{ height: 12 }} />
                  <SlotPicker label="End" value={endHour} options={SLOT_HOURS.slice(1).map(h => ({ label: h, value: h }))} onChange={v => setEndHour(v)} />
                  <View style={{ height: 12 }} />
                  <SlotPicker label="Duration" value={slotDur} options={DURATIONS.map(d => ({ label: `${d} min`, value: d }))} onChange={v => setSlotDur(Number(v))} />

                  <Text style={[styles.fieldLabel, { color: tk.muted, marginTop: 16 }]}>Preview · {previewSlots.length} slots</Text>
                  <View style={[styles.chipsWrap, { marginTop: 6 }]}>
                    {previewSlots.length > 0
                      ? previewSlots.map(s => (
                          <View key={s} style={[styles.slotChip, { backgroundColor: T.accent + '15', borderColor: T.accent + '28' }]}>
                            <Text style={[styles.slotChipText, { color: T.accent }]}>{s}</Text>
                          </View>
                        ))
                      : <Text style={{ fontSize: 12, color: tk.muted }}>End must be after start</Text>
                    }
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                    <Pressable onPress={handleSaveSlots} disabled={previewSlots.length === 0} style={[styles.saveBtn, { backgroundColor: previewSlots.length > 0 ? T.green : tk.line }]}>
                      <Text style={{ color: previewSlots.length > 0 ? T.white : tk.muted, fontSize: 13, fontFamily: 'Sora_700Bold' }}>Save</Text>
                    </Pressable>
                    <Pressable onPress={() => { setStartHour(savedStart); setEndHour(savedEnd); setSlotDur(savedDur); setEditingSlots(false) }} style={[styles.cancelEditBtn, { backgroundColor: tk.surface, borderColor: tk.line }]}>
                      <Text style={{ color: tk.text, fontSize: 13, fontFamily: 'Sora_600SemiBold' }}>Cancel</Text>
                    </Pressable>
                  </View>
                </>
              )}
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
          </>
        )}

        {/* ── Account tab ─── */}
        {tab === 'account' && (
          <>
            <Text style={[styles.pageTitle, { color: tk.text }]}>Account</Text>

            {/* Business info */}
            <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
              <Text style={[styles.sectionLabel, { color: tk.muted }]}>Business</Text>
              {([
                ['Business name', "Tom's Barbershop"],
                ['Category', 'Hair'],
                ['Address', '88 Spring Garden Rd'],
                ['Rating', '4.8 (201 reviews)'],
              ] as [string, string][]).map(([l, v]) => (
                <View key={l} style={[styles.infoRow, { borderBottomColor: tk.line }]}>
                  <Text style={{ fontSize: 13, color: tk.muted }}>{l}</Text>
                  <Text style={{ fontSize: 13, fontFamily: 'Sora_600SemiBold', color: tk.text }}>{v}</Text>
                </View>
              ))}
            </View>

            {/* Payment */}
            <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
              <Text style={[styles.sectionLabel, { color: tk.muted }]}>Payment method</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={styles.visaBadge}>
                    <Text style={{ fontSize: 10, fontFamily: 'Sora_800ExtraBold', color: '#fff', letterSpacing: 0.5 }}>VISA</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 14, fontFamily: 'Sora_700Bold', color: tk.text }}>•••• 4242</Text>
                    <Text style={{ fontSize: 11, color: tk.muted, marginTop: 2 }}>Expires 09/27</Text>
                  </View>
                </View>
                <Pressable style={[styles.updateCardBtn, { backgroundColor: tk.surface, borderColor: tk.line }]}>
                  <Text style={{ fontSize: 12, fontFamily: 'Sora_600SemiBold', color: tk.text }}>Update</Text>
                </Pressable>
              </View>
            </View>

            {/* Billing */}
            <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
              <Text style={[styles.sectionLabel, { color: tk.muted }]}>Billing history</Text>
              {BILLING_ROWS.map(row => (
                <View key={row.id} style={[styles.billingRow, { borderTopColor: tk.line }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, color: tk.sub ?? tk.muted }}>{row.date}</Text>
                    <Text style={{ fontSize: 11, color: tk.muted, fontFamily: 'Sora_400Regular', marginTop: 2 }}>{row.id}</Text>
                  </View>
                  <Text style={{ fontSize: 13, fontFamily: 'Sora_700Bold', color: tk.text, marginRight: 12 }}>{row.amount}</Text>
                  <View style={{ backgroundColor: 'rgba(0,184,124,0.1)', borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 }}>
                    <Text style={{ fontSize: 11, fontFamily: 'Sora_700Bold', color: T.green }}>{row.status}</Text>
                  </View>
                </View>
              ))}
              <View style={[styles.billingTotal, { borderTopColor: tk.line }]}>
                <Text style={{ fontSize: 13, color: tk.muted }}>This month · {BILLING_ROWS.length} bookings</Text>
                <Text style={{ fontSize: 16, fontFamily: 'Sora_800ExtraBold', color: tk.text }}>$6.00</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Nav
  nav: { borderBottomWidth: 1 },
  navInner: { height: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: T.green },
  logoText: { fontSize: 16, fontFamily: 'Sora_800ExtraBold', letterSpacing: -0.4 },
  tabRow: { flexDirection: 'row', gap: 2, borderRadius: 24, padding: 3 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  tabBtnText: { fontSize: 13, fontFamily: 'Sora_700Bold' },
  navBtn: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

  // Live banner
  liveBanner: { paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  bannerDot: { width: 8, height: 8, borderRadius: 4 },
  livePauseBtn: { paddingVertical: 7, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },

  // Content
  pageTitle: { fontSize: 28, fontFamily: 'Sora_800ExtraBold', letterSpacing: -1, marginBottom: 4 },
  pageSub: { fontSize: 14, marginBottom: 24 },

  // Stats — tighter padding
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center', borderWidth: 1 },
  statValue: { fontSize: 20, fontFamily: 'Sora_800ExtraBold', letterSpacing: -0.5, marginTop: 4 },
  statLabel: { fontSize: 10, marginTop: 3, textAlign: 'center' },

  // Card
  card: { borderRadius: 18, padding: 20, marginBottom: 16, borderWidth: 1 },
  cardTitle: { fontSize: 14, fontFamily: 'Sora_800ExtraBold', marginBottom: 16 },

  // Fields
  fieldLabel: { fontSize: 10, fontFamily: 'Sora_700Bold', textTransform: 'uppercase', letterSpacing: 1 },
  fieldValue: { fontSize: 16, fontFamily: 'Sora_800ExtraBold', marginTop: 4 },

  // Slot chips
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 16 },
  slotChip: { backgroundColor: T.green + '18', borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8, borderWidth: 1, borderColor: T.green + '28' },
  slotChipText: { fontSize: 10, fontFamily: 'Sora_600SemiBold', color: T.green },

  // Picker chips
  pickerChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, marginRight: 6, borderWidth: 1 },
  pickerChipText: { fontSize: 12, fontFamily: 'Sora_600SemiBold' },

  // Buttons
  updateBtn: { backgroundColor: T.ink, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  updateBtnText: { color: T.white, fontSize: 13, fontFamily: 'Sora_700Bold' },
  saveBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },
  cancelEditBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center', borderWidth: 1 },

  // Requests
  requestRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1 },
  acceptBtn: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 9, backgroundColor: 'rgba(0,184,124,0.1)' },
  acceptBtnText: { fontSize: 12, fontFamily: 'Sora_800ExtraBold', color: T.green },
  rejectBtn: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 9, backgroundColor: 'rgba(204,0,0,0.08)' },
  rejectBtnText: { fontSize: 12, fontFamily: 'Sora_800ExtraBold', color: '#CC0000' },

  // Floating CTA
  floatingCta: { position: 'absolute', left: 20, right: 20, zIndex: 100 },
  floatingBtn: { backgroundColor: T.ink, borderRadius: 14, paddingVertical: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8 },
  floatingBtnText: { color: T.white, fontSize: 14, fontFamily: 'Sora_700Bold' },

  // Account
  sectionLabel: { fontSize: 11, fontFamily: 'Sora_700Bold', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4, marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  visaBadge: { width: 44, height: 30, borderRadius: 6, backgroundColor: '#1A1F71', alignItems: 'center', justifyContent: 'center' },
  updateCardBtn: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1 },
  billingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1 },
  billingTotal: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
})
