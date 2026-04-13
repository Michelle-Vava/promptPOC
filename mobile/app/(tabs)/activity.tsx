/**
 * activity.tsx — Customer booking activity screen.
 *
 * Two view modes toggled via a pill in the header:
 *  - List view: confirmed bookings + waitlisted entries with dates
 *  - Calendar view: month grid with dots on days that have bookings,
 *    tap a day to see that day's appointments
 *
 * Cancellation requires confirmation via Alert.alert with a
 * warning about provider impact.
 */
import { useState, useMemo, useEffect } from 'react'
import { View, Text, ScrollView, Pressable, Alert, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { T, MOCK_PAST_BOOKINGS, PastBooking } from '../../lib/data'
import { useTheme } from '../../lib/theme'
import { useBookings } from '../../lib/bookings-context'
import { s, ms, vs } from '../../lib/scale'
import Skeleton from '../../components/Skeleton'

/* ── calendar helpers ── */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function firstDow(y: number, m: number) { return new Date(y, m, 1).getDay() }

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function ActivityScreen() {
  const { tk } = useTheme()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top
  const { bookings, waitlisted, removeBooking, removeWaitlist, addBooking } = useBookings()

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [loading, setLoading] = useState(true)
  const today = useMemo(() => new Date(), [])
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  /* Simulate initial data fetch */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  /* mock dates for calendar dots – spread bookings across nearby days */
  const bookingDates = useMemo(() => {
    const dates: { date: Date; booking: typeof bookings[0] }[] = []
    bookings.forEach((b, i) => {
      const d = new Date(today)
      d.setDate(d.getDate() + i)
      dates.push({ date: d, booking: b })
    })
    waitlisted.forEach((w, i) => {
      const d = new Date(today)
      d.setDate(d.getDate() + bookings.length + i + 1)
      dates.push({ date: d, booking: w as any })
    })
    return dates
  }, [bookings, waitlisted, today])

  const selectedDayBookings = useMemo(() => {
    if (selectedDay === null) return []
    const target = new Date(calYear, calMonth, selectedDay)
    return bookingDates.filter(bd => isSameDay(bd.date, target))
  }, [selectedDay, calYear, calMonth, bookingDates])

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

  const handleRebook = (past: PastBooking) => {
    if (bookings.some(b => b.provider.id === past.provider.id && b.slot === past.slot)) {
      Alert.alert('Already Booked', `You already have a booking with ${past.provider.name} at ${past.slot}`)
      return
    }
    addBooking({
      id: Date.now(),
      provider: past.provider,
      slot: past.slot,
      color: past.categoryColor,
      icon: past.categoryIcon,
    })
    Alert.alert('Rebooked!', `${past.provider.name} at ${past.slot} has been booked again.`)
  }

  /* ── calendar grid ── */
  const totalDays = daysInMonth(calYear, calMonth)
  const startDow = firstDow(calYear, calMonth)
  const calCells: (number | null)[] = Array(startDow).fill(null).concat(Array.from({ length: totalDays }, (_, i) => i + 1))
  while (calCells.length % 7 !== 0) calCells.push(null)

  const hasDot = (day: number) => bookingDates.some(bd => isSameDay(bd.date, new Date(calYear, calMonth, day)))

  const prevMonth = () => {
    setSelectedDay(null)
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1)
  }
  const nextMonth = () => {
    setSelectedDay(null)
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1)
  }

  /* ── format date helper ── */
  const formatDate = (d: Date) => {
    if (isSameDay(d, today)) return 'Today'
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
    if (isSameDay(d, tomorrow)) return 'Tomorrow'
    return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
  }

  /* ── card renderer (shared) ── */
  const renderCard = (b: typeof bookings[0], isWaitlist = false) => {
    const bd = bookingDates.find(bd => bd.booking.id === b.id)
    const dateLabel = bd ? formatDate(bd.date) : ''
    return (
      <View key={b.id} style={[styles.card, isWaitlist && styles.cardWaitlist, { backgroundColor: tk.card, borderLeftColor: b.color || T.accent }]}>
        <View style={[styles.cardLeft, { backgroundColor: tk.surface }]}>
          <Feather name={(b.icon || 'grid') as any} size={ms(18)} color={isWaitlist ? T.accent : T.green} />
        </View>
        <View style={styles.cardBody}>
          <Text style={[styles.cardProvider, { color: tk.text }]}>{b.provider.name}</Text>
          {dateLabel !== '' && <Text style={[styles.cardDate, { color: T.accent }]}>{dateLabel}</Text>}
          <Text style={[styles.cardDetail, { color: tk.muted }]}>{isWaitlist ? `Waiting for ${(b as any).hour}` : `${b.slot} · $${b.provider.price}`}</Text>
          <Text style={[styles.cardAddr, { color: tk.muted }]}>{b.provider.addr}</Text>
        </View>
        <Pressable
          onPress={() => isWaitlist ? confirmRemoveWaitlist(b.id, b.provider.name) : confirmCancel(b.id, b.provider.name)}
          style={[styles.cancelBtn, { backgroundColor: tk.surface }]} hitSlop={8}
        >
          <Feather name="x" size={ms(16)} color={tk.muted} />
        </Pressable>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: tk.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + vs(16), backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[styles.title, { color: tk.text }]}>Activity</Text>
          <View style={[styles.toggleBar, { backgroundColor: tk.surface, borderColor: tk.line }]}>
            <Pressable onPress={() => setViewMode('list')} style={[styles.toggleBtn, viewMode === 'list' && { backgroundColor: tk.card }]}>
              <Feather name="list" size={ms(14)} color={viewMode === 'list' ? tk.text : tk.muted} />
            </Pressable>
            <Pressable onPress={() => setViewMode('calendar')} style={[styles.toggleBtn, viewMode === 'calendar' && { backgroundColor: tk.card }]}>
              <Feather name="calendar" size={ms(14)} color={viewMode === 'calendar' ? tk.text : tk.muted} />
            </Pressable>
          </View>
        </View>
        {!isEmpty && viewMode === 'list' && (
          <Text style={[styles.subtitle, { color: tk.muted }]}>
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''} · {waitlisted.length} waitlisted
          </Text>
        )}
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: tk.bg }]}
        contentContainerStyle={[styles.scrollContent, isEmpty && viewMode === 'list' && !loading && styles.emptyContent]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          /* ── SKELETON LOADING ── */
          <View style={{ gap: vs(10) }}>
            <Skeleton width={s(80)} height={ms(10)} borderRadius={s(4)} />
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={[styles.card, { backgroundColor: tk.card, borderLeftColor: tk.line }]}>
                <Skeleton width={s(40)} height={s(40)} borderRadius={s(12)} />
                <View style={[styles.cardBody, { gap: vs(8) }]}>
                  <Skeleton width={s(130)} height={ms(14)} borderRadius={s(4)} />
                  <Skeleton width={s(90)} height={ms(11)} borderRadius={s(4)} />
                  <Skeleton width={s(160)} height={ms(11)} borderRadius={s(4)} />
                </View>
              </View>
            ))}
          </View>
        ) : viewMode === 'list' ? (
          /* ── LIST VIEW ── */
          <>
            {isEmpty ? (
              <View style={[styles.emptyState, { paddingVertical: vs(30) }]}>
                <Feather name="calendar" size={40} color={tk.muted} style={{ marginBottom: vs(16) }} />
                <Text style={[styles.emptyTitle, { color: tk.text }]}>No upcoming bookings</Text>
                <Text style={[styles.emptyDesc, { color: tk.muted }]}>
                  Book a service from the map to see{'\n'}your upcoming appointments here
                </Text>
              </View>
            ) : (
            <>
              {bookings.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, { color: tk.muted }]}>CONFIRMED</Text>
                  {bookings.map(b => renderCard(b))}
                </View>
              )}
              {waitlisted.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, { color: tk.muted }]}>WAITLISTED</Text>
                  {waitlisted.map(w => renderCard(w as any, true))}
                </View>
              )}

              {/* Past bookings — always visible */}
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: tk.muted }]}>HISTORY</Text>
                {MOCK_PAST_BOOKINGS.map(pb => (
                  <View key={pb.id} style={[styles.card, {
                    backgroundColor: tk.card,
                    borderLeftColor: pb.status === 'cancelled' ? tk.muted : pb.categoryColor,
                    opacity: pb.status === 'cancelled' ? 0.6 : 1,
                  }]}>
                    <View style={[styles.cardLeft, { backgroundColor: tk.surface }]}>
                      <Feather name={pb.categoryIcon as any} size={ms(18)} color={pb.categoryColor} />
                    </View>
                    <View style={styles.cardBody}>
                      <Text style={[styles.cardProvider, { color: tk.text }]}>{pb.provider.name}</Text>
                      <Text style={[styles.cardDate, { color: pb.categoryColor }]}>{pb.date}</Text>
                      <Text style={[styles.cardDetail, { color: tk.muted }]}>
                        {pb.slot} · {pb.category}{pb.status === 'cancelled' ? ' · Cancelled' : ''}
                      </Text>
                      <Text style={[styles.cardAddr, { color: tk.muted }]}>{pb.provider.addr}</Text>
                    </View>
                    {pb.status === 'completed' && (
                      <Pressable
                        onPress={() => handleRebook(pb)}
                        style={[styles.rebookBtn, { backgroundColor: T.accent + '12', borderColor: T.accent + '30' }]}
                      >
                        <Feather name="rotate-cw" size={ms(12)} color={T.accent} />
                        <Text style={[styles.rebookText, { color: T.accent }]}>Rebook</Text>
                      </Pressable>
                    )}
                  </View>
                ))}
              </View>
            </>
            )}
          </>
        ) : (
          /* ── CALENDAR VIEW ── */
          <>
            {/* Month nav */}
            <View style={styles.calNav}>
              <Pressable onPress={prevMonth} hitSlop={12}>
                <Feather name="chevron-left" size={ms(20)} color={tk.text} />
              </Pressable>
              <Text style={[styles.calMonthLabel, { color: tk.text }]}>{MONTHS[calMonth]} {calYear}</Text>
              <Pressable onPress={nextMonth} hitSlop={12}>
                <Feather name="chevron-right" size={ms(20)} color={tk.text} />
              </Pressable>
            </View>

            {/* Day headers */}
            <View style={styles.calRow}>
              {DAYS.map(d => (
                <View key={d} style={styles.calCell}>
                  <Text style={[styles.calDayHeader, { color: tk.muted }]}>{d}</Text>
                </View>
              ))}
            </View>

            {/* Day grid */}
            {Array.from({ length: calCells.length / 7 }, (_, week) => (
              <View key={week} style={styles.calRow}>
                {calCells.slice(week * 7, week * 7 + 7).map((day, i) => {
                  const isToday = day !== null && isSameDay(new Date(calYear, calMonth, day), today)
                  const isSelected = day !== null && day === selectedDay
                  const dot = day !== null && hasDot(day)
                  return (
                    <Pressable
                      key={`${week}-${i}`}
                      style={styles.calCell}
                      onPress={() => day !== null && setSelectedDay(day === selectedDay ? null : day)}
                    >
                      <View style={[
                        styles.calDayCircle,
                        isSelected && { backgroundColor: T.accent },
                        isToday && !isSelected && { borderWidth: 1.5, borderColor: T.accent },
                      ]}>
                        <Text style={[
                          styles.calDayText,
                          { color: day === null ? 'transparent' : isSelected ? T.white : tk.text },
                          isToday && !isSelected && { color: T.accent },
                        ]}>
                          {day ?? ''}
                        </Text>
                      </View>
                      {dot && <View style={[styles.calDot, isSelected && { backgroundColor: T.white }]} />}
                    </Pressable>
                  )
                })}
              </View>
            ))}

            {/* Selected day bookings */}
            {selectedDay !== null && (
              <View style={{ marginTop: vs(16) }}>
                <Text style={[styles.sectionLabel, { color: tk.muted }]}>
                  {MONTHS[calMonth]} {selectedDay}
                </Text>
                {selectedDayBookings.length > 0 ? (
                  selectedDayBookings.map(bd => {
                    const isW = waitlisted.some(w => w.id === bd.booking.id)
                    return renderCard(bd.booking, isW)
                  })
                ) : (
                  <Text style={[styles.calEmpty, { color: tk.muted }]}>No bookings this day</Text>
                )}
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
  cardDate: {
    fontSize: ms(11),
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

  /* toggle bar */
  toggleBar: {
    flexDirection: 'row',
    borderRadius: s(10),
    borderWidth: 1,
    padding: 2,
    gap: 2,
  },
  toggleBtn: {
    paddingVertical: vs(5),
    paddingHorizontal: s(10),
    borderRadius: s(8),
  },

  /* calendar */
  calNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  calMonthLabel: {
    fontSize: ms(15),
    fontFamily: 'Sora_700Bold',
  },
  calRow: {
    flexDirection: 'row',
  },
  calCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(4),
  },
  calDayHeader: {
    fontSize: ms(10),
    fontFamily: 'Sora_700Bold',
    marginBottom: vs(6),
  },
  calDayCircle: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayText: {
    fontSize: ms(13),
    fontFamily: 'Sora_600SemiBold',
  },
  calDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: T.accent,
    marginTop: 2,
  },
  calEmpty: {
    fontSize: ms(13),
    fontFamily: 'Sora_400Regular',
    textAlign: 'center',
    paddingVertical: vs(20),
  },
  rebookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingVertical: vs(6),
    paddingHorizontal: s(10),
    borderRadius: s(8),
    borderWidth: 1,
  },
  rebookText: {
    fontSize: ms(11),
    fontFamily: 'Sora_700Bold',
  },
})
