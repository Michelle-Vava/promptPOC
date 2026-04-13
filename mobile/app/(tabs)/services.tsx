import { useState, useCallback } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { PROVIDERS, GROUPS, HOURS, Provider, T } from '../../lib/data'
import { useTheme } from '../../lib/theme'
import { useBookings } from '../../lib/bookings-context'
import { s, ms, vs } from '../../lib/scale'
import ProviderPanel from '../../components/ProviderPanel'
import Toast, { ToastData } from '../../components/Toast'

export default function ServicesScreen() {
  const { tk } = useTheme()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const { bookings, addBooking } = useBookings()
  const [toasts, setToasts] = useState<ToastData[]>([])

  const pushToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
    setToasts(ts => [...ts, { id: Date.now(), message, type }])
  }, [])
  const dismissToast = useCallback((id: number) => {
    setToasts(ts => ts.filter(t => t.id !== id))
  }, [])

  /* Pick first available slot as default hour for panel */
  const defaultHour = selectedProvider?.slots[0] ?? HOURS[0]

  const handleBook = (prov: Provider, slot: string) => {
    /* Prevent double-booking same provider + slot */
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

      {/* Filter toggles */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        style={[styles.chipScroll, { backgroundColor: tk.bg, borderBottomColor: tk.line }]}
      >
        <Pressable
          onPress={() => setActiveCategory(null)}
          style={({ pressed }) => [styles.chip, { borderColor: !activeCategory ? tk.muted + '55' : tk.line, backgroundColor: !activeCategory ? tk.inputBg : 'transparent' }, pressed && { opacity: 0.8 }]}
        >
          <Text style={[styles.chipText, { color: !activeCategory ? tk.text : tk.muted }]}>All</Text>
        </Pressable>
        {GROUPS.map(g => {
          const isActive = activeCategory === g.id
          return (
            <Pressable
              key={g.id}
              onPress={() => setActiveCategory(isActive ? null : g.id)}
              style={({ pressed }) => [styles.chip, { borderColor: isActive ? tk.muted + '55' : tk.line, backgroundColor: isActive ? tk.inputBg : 'transparent' }, pressed && { opacity: 0.8 }]}
            >
              <Feather name={g.icon as any} size={ms(12)} color={isActive ? tk.text : tk.muted} />
              <Text style={[styles.chipText, { color: isActive ? tk.text : tk.muted }]}>
                {g.label}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Provider list */}
      <ScrollView
        style={[styles.list, { backgroundColor: tk.bg }]}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map(p => {
          const g = GROUPS.find(gr => gr.id === p.cat)
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
                <Text style={[styles.cardAddr, { color: tk.muted }]} numberOfLines={1}>{p.addr}</Text>
                <View style={styles.cardMeta}>
                  <View style={styles.ratingRow}>
                    <Feather name="star" size={ms(11)} color="#F5A623" />
                    <Text style={styles.ratingText}>{p.rating}</Text>
                    <Text style={[styles.reviewsText, { color: tk.muted }]}>({p.reviews})</Text>
                  </View>
                  <Text style={[styles.priceText, { color: tk.sub }]}>${p.price} · {p.dur}</Text>
                  <Text style={[styles.slotsText, { color: tk.muted }]}>{p.slots.length} slots</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={ms(18)} color={tk.muted} />
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Provider booking panel */}
      {selectedProvider && (
        <ProviderPanel
          provider={selectedProvider}
          hour={defaultHour}
          onBook={handleBook}
          onClose={() => setSelectedProvider(null)}
        />
      )}

      {/* Toasts */}
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

  chipScroll: {
    borderBottomWidth: 1,
    flexGrow: 0,
  },
  chipRow: {
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    gap: s(6),
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingVertical: vs(5),
    paddingHorizontal: s(11),
    borderRadius: s(16),
    borderWidth: 1,
  },
  chipText: {
    fontSize: ms(11),
    fontFamily: 'Sora_600SemiBold',
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
  cardAddr: {
    fontSize: ms(11),
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
  slotsText: {
    fontSize: ms(10),
  },
})
