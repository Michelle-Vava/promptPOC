/** faq.tsx — FAQ screen with expandable items. */
import { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'
import { s, ms, vs } from '../../lib/scale'

const FAQS = [
  { q: 'How does PROMPT work?', a: 'PROMPT connects you with same-day service providers in Halifax. Browse providers on the map, pick an available time slot, and confirm your booking instantly.' },
  { q: 'Is PROMPT free for customers?', a: 'Yes — PROMPT is 100% free for customers. No booking fees, no hidden charges, forever. Providers pay just $1 per confirmed booking.' },
  { q: 'How do I cancel a booking?', a: 'Open your Activity tab, find the booking you want to cancel, and tap Cancel. Cancellations are free if made at least 1 hour before your appointment.' },
  { q: 'What if my provider cancels?', a: "If a provider cancels, you'll be notified immediately and we'll suggest similar available providers nearby so you can rebook quickly." },
  { q: 'How does the waitlist work?', a: "When a slot is full, you can join the waitlist. If a spot opens, you'll be automatically confirmed and notified." },
  { q: 'What areas does PROMPT cover?', a: "PROMPT currently covers the Halifax Regional Municipality including Downtown Halifax, Dartmouth, Bedford, and surrounding areas." },
  { q: 'How do I become a provider?', a: 'Tap "List Your Services" and create a provider account. Set your availability, add services, and start accepting bookings in minutes.' },
  { q: 'What does it cost for providers?', a: "Providers pay a flat $1 fee per confirmed booking. No subscriptions, no percentages. You keep everything else." },
]

export default function FAQScreen() {
  const { tk } = useTheme()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <View style={[styles.container, { backgroundColor: tk.bg }]}>
      <View style={[styles.header, { paddingTop: topPad + vs(12), backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={tk.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: tk.text }]}>FAQ</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: tk.muted }]}>Everything you need to know about PROMPT</Text>

        {FAQS.map((faq, i) => (
          <Pressable
            key={i}
            onPress={() => setOpenIdx(openIdx === i ? null : i)}
            style={[styles.faqCard, { backgroundColor: tk.card, borderColor: tk.line }]}
          >
            <View style={styles.faqRow}>
              <Text style={[styles.faqQ, { color: tk.text, flex: 1 }]}>{faq.q}</Text>
              <Feather name={openIdx === i ? 'chevron-up' : 'chevron-down'} size={16} color={tk.muted} />
            </View>
            {openIdx === i && (
              <Text style={[styles.faqA, { color: tk.sub }]}>{faq.a}</Text>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(20), paddingBottom: vs(12), borderBottomWidth: 1 },
  backBtn: { marginRight: s(12) },
  headerTitle: { fontSize: ms(17), fontFamily: 'Sora_800ExtraBold', letterSpacing: -0.3 },
  content: { padding: s(20), paddingBottom: vs(40) },
  subtitle: { fontSize: ms(13), marginBottom: vs(20) },
  faqCard: { borderRadius: s(14), borderWidth: 1, padding: s(16), marginBottom: vs(10) },
  faqRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQ: { fontSize: ms(14), fontFamily: 'Sora_700Bold' },
  faqA: { fontSize: ms(13), lineHeight: ms(20), marginTop: vs(10) },
})
