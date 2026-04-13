/** terms.tsx — Terms of Service screen (9 sections). */
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useTheme } from '../../lib/theme'
import { s, ms, vs } from '../../lib/scale'

export default function TermsScreen() {
  const { tk } = useTheme()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top

  return (
    <View style={[styles.container, { backgroundColor: tk.bg }]}>
      <View style={[styles.header, { paddingTop: topPad + vs(12), backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={tk.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: tk.text }]}>Terms of Service</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.updated, { color: tk.muted }]}>Last updated: April 1, 2026</Text>

        <Text style={[styles.heading, { color: tk.text }]}>1. Acceptance of Terms</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          By accessing or using the Prompt mobile application ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>2. Description of Service</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          Prompt is a same-day booking marketplace connecting customers with local service providers in the Halifax Regional Municipality. We facilitate bookings but do not directly provide any services listed on the platform.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>3. User Accounts</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          You must provide accurate, current information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>4. Bookings & Cancellations</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          Bookings made through Prompt are binding agreements between customers and service providers. Cancellations must be made at least 2 hours before the scheduled time. Late cancellations may result in a fee at the provider's discretion.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>5. Provider Obligations</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          Service providers are charged $1.00 per confirmed booking. Providers must honour accepted bookings and maintain accurate availability. Repeated no-shows may result in account suspension.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>6. Prohibited Conduct</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          You may not use the Service for any unlawful purpose, harass other users, post misleading information, or attempt to circumvent the booking system.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>7. Limitation of Liability</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          Prompt is provided "as is" without warranties. We are not liable for any damages arising from your use of the Service, including but not limited to lost profits, data loss, or service interruptions.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>8. Changes to Terms</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the revised Terms.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>9. Contact</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          Questions about these Terms? Contact us at legal@prompt.app.
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(16), paddingBottom: vs(12), borderBottomWidth: 1, gap: s(12) },
  backBtn: { padding: s(4) },
  headerTitle: { fontSize: ms(18), fontFamily: 'Sora_800ExtraBold', letterSpacing: -0.3 },
  content: { padding: s(20), paddingBottom: vs(60) },
  updated: { fontSize: ms(12), fontFamily: 'Sora_400Regular', marginBottom: vs(20) },
  heading: { fontSize: ms(15), fontFamily: 'Sora_700Bold', marginTop: vs(20), marginBottom: vs(8) },
  body: { fontSize: ms(13), fontFamily: 'Sora_400Regular', lineHeight: ms(20) },
})
