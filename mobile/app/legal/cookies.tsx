import { View, Text, ScrollView, Pressable, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'
import { s, ms, vs } from '../../lib/scale'

export default function CookiesScreen() {
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
        <Text style={[styles.headerTitle, { color: tk.text }]}>Cookie Policy</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.updated, { color: tk.muted }]}>Last updated: April 1, 2026</Text>

        <Text style={[styles.heading, { color: tk.text }]}>1. What Are Cookies</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          Cookies are small text files stored on your device when you use our Service. They help us remember your preferences, understand how you use Prompt, and improve your experience.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>2. Types of Cookies We Use</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          Essential cookies: Required for the Service to function (authentication, session management).{'\n\n'}
          Analytics cookies: Help us understand usage patterns and improve the Service.{'\n\n'}
          Preference cookies: Remember your settings like dark mode, language, and notification preferences.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>3. Third-Party Cookies</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          We may use third-party analytics services that set their own cookies. These services help us understand aggregate usage patterns but do not identify individual users.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>4. Managing Cookies</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          You can control cookies through your device settings. Disabling essential cookies may prevent certain features from working properly.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>5. Data Collected via Cookies</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          Cookies may collect device type, operating system, session duration, pages visited, and feature usage. This data is anonymized and used solely for Service improvement.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>6. Changes to This Policy</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          We may update this Cookie Policy periodically. Check this page for the latest version.
        </Text>

        <Text style={[styles.heading, { color: tk.text }]}>7. Contact</Text>
        <Text style={[styles.body, { color: tk.sub }]}>
          Questions about our use of cookies? Contact us at privacy@prompt.app.
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
