/**
 * index.tsx — Main map screen (Home tab for customers).
 *
 * Core booking experience: interactive map with green pins for
 * available providers, time wheel for hour selection, category
 * filters, search, and ProviderPanel bottom sheet for booking.
 *
 * Features:
 *  - Offline detection banner
 *  - Social-proof toasts (fake "X just booked Y")
 *  - Double-booking prevention
 *  - Notifications sheet with tap-to-navigate
 *  - Control bar: horizontally scrollable search + category chips
 */
import { useState, useCallback, useEffect } from 'react'
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet, Platform, StatusBar as RNStatusBar, AppState } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import MapView, { Region } from 'react-native-maps'
import * as Network from 'expo-network'
import { Feather } from '@expo/vector-icons'
import { PROVIDERS, HOURS, GROUPS, Provider, Notification, MOCK_NOTIFICATIONS, T } from '../../lib/data'
import { useTheme } from '../../lib/theme'
import { useBookings } from '../../lib/bookings-context'
import { s, ms, vs } from '../../lib/scale'
import TimeWheel from '../../components/TimeWheel'
import DialPicker from '../../components/DialPicker'
import ProviderPanel from '../../components/ProviderPanel'
import BookingsSheet from '../../components/BookingsSheet'
import NotificationsSheet from '../../components/NotificationsSheet'
import Skeleton from '../../components/Skeleton'
import Toast, { ToastData } from '../../components/Toast'
import MapPin from '../../components/MapPin'
import UserLocationPin from '../../components/UserLocationPin'
import { USER_LOCATION, roadDistanceKm, formatDistance, formatETA } from '../../lib/geo'
import { usePickerStyle } from '../../lib/picker-style'

const HALIFAX: Region = { latitude: 44.68, longitude: -63.65, latitudeDelta: 0.12, longitudeDelta: 0.12 }

export default function MapScreen() {
  const { tk, mode } = useTheme()
  const { pickerStyle } = usePickerStyle()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  // Shared state
  const { bookings, waitlisted, addBooking, removeBooking, removeWaitlist } = useBookings()

  // Core state
  const [category, setCategory] = useState<string | null>('hair')
  const [hourIdx, setHourIdx] = useState(2)
  const [activeId, setActiveId] = useState<number | null>(null)

  // UI state
  const [search, setSearch] = useState('')
  const [notifsOpen, setNotifsOpen] = useState(false)
  const [bookingsOpen, setBookingsOpen] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [toasts, setToasts] = useState<ToastData[]>([])  
  const [hintDismissed, setHintDismissed] = useState(false)

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
  const bookedAtHour = new Set(bookings.filter(b => b.slot === hour).map(b => b.provider.id))
  const unreadNotifs = notifications.filter(n => !n.read).length
  const activeProv = PROVIDERS.find(p => p.id === activeId) ?? null

  const handleBook = (prov: Provider, slot: string) => {
    /* Prevent double-booking same provider + same slot */
    if (bookings.some(b => b.provider.id === prov.id && b.slot === slot)) {
      pushToast('You already booked this slot', 'error')
      return
    }
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
            {/* Bookings */}
            <Pressable onPress={() => setBookingsOpen(true)} style={[styles.navBtn, { backgroundColor: tk.surface, borderColor: tk.line }]}>
              <Feather name="shopping-bag" size={16} color={tk.muted} />
              {bookings.length > 0 && (
                <View style={[styles.badge, { backgroundColor: T.green }]}>
                  <Text style={styles.badgeText}>{bookings.length}</Text>
                </View>
              )}
            </Pressable>

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
          onMapReady={() => setMapReady(true)}
        >
          {bookable.map((p, i) => {
            return (
              <MapPin
                key={p.id}
                provider={p}
                isActive={activeId === p.id}
                isBooked={bookedAtHour.has(p.id)}
                index={i}
                onPress={() => { setActiveId(activeId === p.id ? null : p.id); setHintDismissed(true) }}
              />
            )
          })}
          {/* User location dot */}
          <UserLocationPin latitude={USER_LOCATION.latitude} longitude={USER_LOCATION.longitude} />
        </MapView>

        {/* Map loading skeleton */}
        {!mapReady && (
          <View style={[StyleSheet.absoluteFill, styles.mapSkeleton, { backgroundColor: tk.bg }]}>
            <Skeleton width={s(200)} height={ms(16)} borderRadius={s(8)} />
            <View style={{ flexDirection: 'row', gap: s(10), marginTop: vs(16) }}>
              <Skeleton width={s(80)} height={s(80)} borderRadius={s(12)} />
              <View style={{ gap: vs(8), flex: 1 }}>
                <Skeleton width={s(160)} height={ms(12)} borderRadius={s(4)} />
                <Skeleton width={s(120)} height={ms(12)} borderRadius={s(4)} />
                <Skeleton width={s(90)} height={ms(12)} borderRadius={s(4)} />
              </View>
            </View>
            <Skeleton width={s(160)} height={ms(14)} borderRadius={s(8)} style={{ marginTop: vs(24) }} />
          </View>
        )}

        {/* Time picker (wheel or dial based on user preference) */}
        {pickerStyle === 'dial'
          ? <DialPicker hourIdx={hourIdx} setHourIdx={setHourIdx} />
          : <TimeWheel hourIdx={hourIdx} setHourIdx={setHourIdx} />}

        {/* Open count overlay */}
        {availableIds.size > 0 && !activeId && (
          <View style={[styles.openOverlay, {
            backgroundColor: mode === 'dark' ? 'rgba(13,13,13,0.82)' : 'rgba(255,255,255,0.92)',
            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          }]}>
            <Text style={{ fontSize: 11, fontFamily: 'Sora_700Bold', color: T.green }}>
              {availableIds.size} open now
            </Text>
          </View>
        )}

        {/* Distance + ETA overlay — shows when a pin is tapped */}
        {activeId && activeProv && (() => {
          const dist = roadDistanceKm(USER_LOCATION.latitude, USER_LOCATION.longitude, activeProv.lat, activeProv.lng)
          return (
            <View style={[styles.distanceOverlay, {
              backgroundColor: mode === 'dark' ? 'rgba(13,13,13,0.85)' : 'rgba(255,255,255,0.94)',
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            }]}>
              <Feather name="navigation" size={ms(12)} color={T.accent} />
              <Text style={[styles.distanceText, { color: tk.text }]}>{formatDistance(dist)}</Text>
              <View style={[styles.distanceDivider, { backgroundColor: tk.line }]} />
              <Feather name="clock" size={ms(11)} color={tk.muted} />
              <Text style={[styles.etaText, { color: tk.muted }]}>{formatETA(dist)}</Text>
            </View>
          )
        })()}

        {/* No results */}
        {search.length > 0 && searchFiltered.length === 0 && (
          <View style={styles.emptyOverlay}>
            <View style={[styles.emptyCard, {
              backgroundColor: mode === 'dark' ? 'rgba(13,13,13,0.92)' : 'rgba(255,255,255,0.95)',
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            }]}>
              <Feather name="search" size={ms(24)} color={mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'} />
              <Text style={[styles.emptyTitle, { color: tk.text }]}>
                No results for "{search}"
              </Text>
            </View>
          </View>
        )}

        {/* No availability */}
        {!search && bookable.length === 0 && searchFiltered.length > 0 && !activeId && (
          <View style={styles.emptyOverlay} pointerEvents="none">
            <View style={[styles.emptyCard, {
              backgroundColor: mode === 'dark' ? 'rgba(13,13,13,0.92)' : 'rgba(255,255,255,0.95)',
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            }]}>
              <Feather name="clock" size={ms(24)} color={mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'} />
              <Text style={[styles.emptyTitle, { color: tk.text }]}>
                Nobody open at {hour}
              </Text>
              <Text style={[styles.emptySub, { color: tk.muted }]}>
                Spin the time wheel to find{' \n'}open slots
              </Text>
            </View>
          </View>
        )}

        {/* Hint banner — show once */}
        {availableIds.size > 0 && !activeId && !hintDismissed && (
          <View style={[styles.hintBanner, {
            backgroundColor: mode === 'dark' ? 'rgba(13,13,13,0.82)' : 'rgba(255,255,255,0.92)',
            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          }]}>
            <Text style={{ fontSize: 12, fontFamily: 'Sora_600SemiBold', color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
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
          alreadyBooked={bookedAtHour.has(activeProv.id)}
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

      {/* ── Bookings sheet ─── */}
      <BookingsSheet
        bookings={bookings}
        waitlisted={waitlisted}
        isOpen={bookingsOpen}
        onClose={() => setBookingsOpen(false)}
        onCancelBooking={removeBooking}
        onCancelWaitlist={removeWaitlist}
      />

      {/* ── Toasts ─── */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapSkeleton: { alignItems: 'center', justifyContent: 'center', zIndex: 10 },

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
  distanceOverlay: {
    position: 'absolute',
    top: vs(14),
    left: s(14),
    borderRadius: s(16),
    paddingVertical: vs(6),
    paddingHorizontal: s(12),
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    zIndex: 1001,
  },
  distanceText: {
    fontSize: ms(12),
    fontFamily: 'Sora_700Bold',
  },
  distanceDivider: {
    width: 1,
    height: ms(12),
    marginHorizontal: s(2),
  },
  etaText: {
    fontSize: ms(11),
    fontFamily: 'Sora_600SemiBold',
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
