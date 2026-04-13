import { useState, useCallback, useEffect } from 'react'
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, StatusBar as RNStatusBar, Platform, AppState, useWindowDimensions } from 'react-native'
import { s, ms, vs, isSmall } from '../../lib/scale'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import MapView, { Region } from 'react-native-maps'
import * as Network from 'expo-network'
import { Feather } from '@expo/vector-icons'
import { PROVIDERS, HOURS, GROUPS, Provider, Notification, MOCK_NOTIFICATIONS, T } from '../../lib/data'
import { useTheme } from '../../lib/theme'
import { useBookings } from '../../lib/bookings-context'
import TimeWheel from '../../components/TimeWheel'
import ProviderPanel from '../../components/ProviderPanel'
import NotificationsSheet from '../../components/NotificationsSheet'
import Toast, { ToastData } from '../../components/Toast'
import MapPin from '../../components/MapPin'

const HALIFAX: Region = { latitude: 44.68, longitude: -63.65, latitudeDelta: 0.12, longitudeDelta: 0.12 }

export default function MapScreen() {
  const { tk, mode } = useTheme()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  // Shared state
  const { bookings, addBooking } = useBookings()

  // Core state
  const [category, setCategory] = useState<string | null>(null)
  const [hourIdx, setHourIdx] = useState(2)
  const [activeId, setActiveId] = useState<number | null>(null)

  // UI state
  const [search, setSearch] = useState('')
  const [notifsOpen, setNotifsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [toasts, setToasts] = useState<ToastData[]>([])

  const pushToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
    setToasts(ts => [...ts, { id: Date.now(), message, type }])
  }, [])
  const dismissToast = useCallback((id: number) => {
    setToasts(ts => ts.filter(t => t.id !== id))
  }, [])

  const hour = HOURS[hourIdx]

  const categoryFiltered = PROVIDERS.filter(p => category ? p.cat === category : true)
  const searchFiltered = search.trim()
    ? categoryFiltered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.addr.toLowerCase().includes(search.toLowerCase())
      )
    : categoryFiltered

  const bookable = searchFiltered.filter(p => p.slots.includes(hour))
  const availableIds = new Set(bookable.map(p => p.id))
  const unreadNotifs = notifications.filter(n => !n.read).length
  const activeProv = PROVIDERS.find(p => p.id === activeId) ?? null

  const handleBook = (prov: Provider, slot: string) => {
    const cg = GROUPS.find(g => g.id === prov.cat)
    addBooking({ id: Date.now(), provider: prov, slot, color: cg?.color ?? '', icon: cg?.icon ?? '' })
    pushToast(`Booked! ${prov.name} · ${slot}`)
    setTimeout(() => setActiveId(null), 1200)
  }

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })))

  // Fake real-time — "someone just booked" social proof
  useEffect(() => {
    const FAKE_NAMES = ['Sarah M.', 'Chris T.', 'Aisha R.', 'Liam K.', 'Priya S.', 'Jordan B.']
    const FAKE_PROVS = PROVIDERS.slice(0, 8)
    const interval = setInterval(() => {
      const name = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)]
      const prov = FAKE_PROVS[Math.floor(Math.random() * FAKE_PROVS.length)]
      pushToast(`${name} just booked ${prov.name}`, 'info')
    }, 12000 + Math.random() * 8000)
    return () => clearInterval(interval)
  }, [])

  // Offline detection
  const [isOnline, setIsOnline] = useState(true)
  useEffect(() => {
    const check = async () => {
      const state = await Network.getNetworkStateAsync()
      setIsOnline(state.isConnected ?? true)
    }
    check()
    const sub = AppState.addEventListener('change', s => { if (s === 'active') check() })
    return () => sub.remove()
  }, [])

  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top

  return (
    <View style={[styles.container, { backgroundColor: tk.bg }]}>
      {/* ── Offline banner ─── */}
      {!isOnline && (
        <View style={[styles.offlineBanner, { top: topPad }]}>
          <Feather name="wifi-off" size={12} color="#fff" />
          <Text style={styles.offlineText}>No internet connection</Text>
        </View>
      )}

      {/* ── Nav ─── */}
      <View style={[styles.nav, { paddingTop: topPad, backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
        <View style={styles.navInner}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <View style={styles.liveDot} />
            <Text style={[styles.logoText, { color: tk.text }]}>PROMPT</Text>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            {/* Notifications */}
            <Pressable onPress={() => setNotifsOpen(true)} style={[styles.navBtn, { backgroundColor: tk.surface, borderColor: tk.line }]}>
              <Feather name="bell" size={16} color={tk.muted} />
              {unreadNotifs > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadNotifs}</Text>
                </View>
              )}
            </Pressable>

            {/* Role label */}
            <View style={[styles.rolePill, { backgroundColor: tk.surface, borderColor: tk.line }]}>
              <Feather name="user" size={ms(12)} color={tk.muted} />
              <Text style={[styles.roleText, { color: tk.muted }]}>Customer</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Control bar (search + categories) ─── */}
      <View style={[styles.controlBar, { backgroundColor: tk.surface, borderBottomColor: tk.line }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.controlContent}
        >
          {/* Search */}
          <View style={[styles.searchPill, { backgroundColor: tk.inputBg, borderColor: tk.inputBorder }]}>
            <Feather name="search" size={ms(13)} color={tk.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search…"
              placeholderTextColor={tk.muted}
              style={[styles.searchPillInput, { color: tk.text }]}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <Feather name="x" size={ms(12)} color={tk.muted} />
              </Pressable>
            )}
          </View>

          {/* Category chips */}
          <Pressable
            onPress={() => { setCategory(null); setActiveId(null) }}
            style={[styles.catChip, !category && styles.catChipActive, { borderColor: !category ? T.accent + '40' : tk.line, backgroundColor: !category ? T.accent + '12' : 'transparent' }]}
          >
            <Text style={[styles.catChipText, { color: !category ? tk.text : tk.muted }]}>All</Text>
          </Pressable>
          {GROUPS.map(g => {
            const active = category === g.id
            return (
              <Pressable
                key={g.id}
                onPress={() => { setCategory(active ? null : g.id); setActiveId(null) }}
                style={[styles.catChip, active && styles.catChipActive, { borderColor: active ? T.accent + '40' : tk.line, backgroundColor: active ? T.accent + '12' : 'transparent' }]}
              >
                <Feather name={g.icon as any} size={11} color={active ? tk.text : tk.muted} />
                <Text style={[styles.catChipText, { color: active ? tk.text : tk.muted }]}>{g.label}</Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      {/* ── Map ─── */}
      <View style={{ flex: 1 }}>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={HALIFAX}
          userInterfaceStyle={mode === 'dark' ? 'dark' : 'light'}
        >
          {bookable.map((p, i) => {
            return (
              <MapPin
                key={p.id}
                provider={p}
                isActive={activeId === p.id}
                index={i}
                onPress={() => setActiveId(activeId === p.id ? null : p.id)}
              />
            )
          })}
        </MapView>

        {/* Time wheel */}
        <TimeWheel hourIdx={hourIdx} setHourIdx={setHourIdx} />

        {/* Open count overlay */}
        {availableIds.size > 0 && !activeId && (
          <View style={styles.openOverlay}>
            <Text style={{ fontSize: 11, fontFamily: 'Sora_700Bold', color: T.green }}>
              {availableIds.size} open now
            </Text>
          </View>
        )}

        {/* No results */}
        {search.length > 0 && searchFiltered.length === 0 && (
          <View style={styles.emptyOverlay}>
            <View style={styles.emptyCard}>
              <Feather name="search" size={ms(24)} color="rgba(255,255,255,0.4)" />
              <Text style={styles.emptyTitle}>
                No results for "{search}"
              </Text>
            </View>
          </View>
        )}

        {/* No availability */}
        {!search && bookable.length === 0 && searchFiltered.length > 0 && !activeId && (
          <View style={styles.emptyOverlay} pointerEvents="none">
            <View style={styles.emptyCard}>
              <Feather name="clock" size={ms(24)} color="rgba(255,255,255,0.4)" />
              <Text style={styles.emptyTitle}>
                Nobody open at {hour}
              </Text>
              <Text style={styles.emptySub}>
                Spin the time wheel to find{' \n'}open slots
              </Text>
            </View>
          </View>
        )}

        {/* Hint banner */}
        {availableIds.size > 0 && !activeId && (
          <View style={styles.hintBanner}>
            <Text style={{ fontSize: 12, fontFamily: 'Sora_600SemiBold', color: 'rgba(255,255,255,0.7)' }}>
              Tap a green pin to book instantly
            </Text>
          </View>
        )}
      </View>

      {/* ── Provider panel ─── */}
      {activeProv && (
        <ProviderPanel
          provider={activeProv}
          hour={hour}
          onBook={handleBook}
          onClose={() => setActiveId(null)}
        />
      )}

      {/* ── Notifications sheet ─── */}
      <NotificationsSheet
        notifications={notifications}
        onMarkAllRead={markAllRead}
        onTapNotification={n => {
          setNotifications(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))
          setNotifsOpen(false)
          if (n.type === 'booking_confirmed' || n.type === 'provider_accepted') {
            setTimeout(() => router.navigate('/(tabs)/activity'), 300)
          }
        }}
        isOpen={notifsOpen}
        onClose={() => setNotifsOpen(false)}
      />

      {/* ── Toasts ─── */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Nav
  nav: {
    borderBottomWidth: 1,
    zIndex: 50,
  },
  navInner: {
    height: vs(52),
    paddingHorizontal: s(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  liveDot: { width: s(7), height: s(7), borderRadius: s(4), backgroundColor: T.green },
  logoText: { fontSize: ms(16), fontFamily: 'Sora_800ExtraBold', letterSpacing: -0.4 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  navBtn: { width: s(36), height: s(36), borderRadius: s(10), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  rolePill: { flexDirection: 'row', alignItems: 'center', gap: s(5), paddingVertical: vs(7), paddingHorizontal: s(10), borderRadius: s(10), borderWidth: 1 },
  roleText: { fontSize: ms(11), fontFamily: 'Sora_600SemiBold' },
  badge: { position: 'absolute', top: -s(4), right: -s(4), width: s(16), height: s(16), borderRadius: s(8), backgroundColor: T.accent, alignItems: 'center', justifyContent: 'center' },
  offlineBanner: { position: 'absolute', left: 0, right: 0, backgroundColor: '#CC2200', paddingVertical: vs(5), paddingHorizontal: s(16), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(6), zIndex: 9999 },
  offlineText: { fontSize: ms(12), fontFamily: 'Sora_600SemiBold', color: '#fff' },
  badgeText: { fontSize: ms(9), fontFamily: 'Sora_800ExtraBold', color: T.white },

  // Control bar
  controlBar: {
    borderBottomWidth: 1,
    zIndex: 40,
  },
  controlContent: {
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    gap: s(6),
    alignItems: 'center',
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingVertical: vs(6),
    paddingHorizontal: s(10),
    borderRadius: s(20),
    borderWidth: 1,
    minWidth: s(100),
  },
  searchPillInput: {
    fontSize: ms(12),
    fontFamily: 'Sora_400Regular',
    paddingVertical: 0,
    minWidth: s(60),
    maxWidth: s(140),
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingVertical: vs(6),
    paddingHorizontal: s(10),
    borderRadius: s(20),
    borderWidth: 1,
  },
  catChipActive: {},
  catChipText: {
    fontSize: ms(11),
    fontFamily: 'Sora_600SemiBold',
  },

  // Map overlays
  openOverlay: {
    position: 'absolute',
    top: vs(14),
    left: s(14),
    backgroundColor: 'rgba(13,13,13,0.82)',
    borderRadius: s(16),
    paddingVertical: vs(6),
    paddingHorizontal: s(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: s(96),
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  emptyCard: {
    backgroundColor: 'rgba(13,13,13,0.92)',
    borderRadius: s(16),
    paddingVertical: vs(24),
    paddingHorizontal: s(28),
    alignItems: 'center',
    gap: vs(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyTitle: {
    fontSize: ms(14),
    fontFamily: 'Sora_700Bold',
    color: T.white,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: ms(12),
    fontFamily: 'Sora_400Regular',
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    lineHeight: ms(18),
  },
  hintBanner: {
    position: 'absolute',
    bottom: vs(20),
    alignSelf: 'center',
    backgroundColor: 'rgba(13,13,13,0.82)',
    borderRadius: s(20),
    paddingVertical: vs(8),
    paddingHorizontal: s(18),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
})
