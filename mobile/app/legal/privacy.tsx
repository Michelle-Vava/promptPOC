import { View, Text, ScrollView, Pressable, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'
import { s, ms, vs } from '../../lib/scale'

export default function PrivacyScreen() {
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
        <Text style={[styles.headerTitle, { color: tk.text }]}>Privacy Policy</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.updated, { color: tk.muted }]}>Last updated: April 1, 2026</Text>

        <Text style={[styles.heading, { color: tk.text }]}>1. Information We Collect</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          We collect information you provide directly: name, email address, phone number, and location data when using the Service. We also collect usage data including booking history, search queries, and device information.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>2. How We Use Your Information</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          Your information is used to facilitate bookings, improve the Service, send booking confirmations and reminders, and personalize your experience. We do not sell your personal data to third parties.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>3. Location Data</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          We collect location data to show nearby service providers. You can disable location access in your device settings, but some features may be limited.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>4. Data Sharing</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          We share your name and booking details with service providers to fulfil your bookings. We may share anonymized, aggregated data for analytics purposes.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>5. Data Security</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          We implement industry-standard security measures to protect your data, including encryption in transit and at rest. However, no method of transmission is 100% secure.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>6. Data Retention</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          We retain your data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>7. Your Rights</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time through your account settings.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>8. Contact</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          For privacy-related questions, contact us at privacy@prompt.app.
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
