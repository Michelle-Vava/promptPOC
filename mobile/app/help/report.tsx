/** report.tsx — Report a problem form. */
import { useState } from 'react'
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'
import { s, ms, vs } from '../../lib/scale'

const CATEGORIES = ['Booking issue', 'Payment problem', 'Provider complaint', 'App bug', 'Other']

export default function ReportScreen() {
  const { tk } = useTheme()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top
  const [category, setCategory] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: tk.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <View style={styles.successWrap}>
          <View style={[styles.successIcon, { backgroundColor: T.green + '18' }]}>
            <Feather name="check" size={28} color={T.green} />
          </View>
          <Text style={[styles.successTitle, { color: tk.text }]}>Report Submitted</Text>
          <Text style={[styles.successSub, { color: tk.muted }]}>
            Thanks for letting us know. Our team will review your report within 24 hours.
          </Text>
          <Pressable onPress={() => router.back()} style={[styles.successBtn, { backgroundColor: tk.text }]}>
            <Text style={[styles.successBtnText, { color: tk.bg }]}>Back to Account</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: tk.bg }]}>
      <View style={[styles.header, { paddingTop: topPad + vs(12), backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={tk.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: tk.text }]}>Report a Problem</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: tk.muted }]}>We'll look into this right away</Text>

        <Text style={[styles.fieldLabel, { color: tk.sub }]}>What's the issue?</Text>
        <View style={styles.chips}>
          {CATEGORIES.map(cat => (
            <Pressable key={cat} onPress={() => setCategory(cat)} style={[
              styles.chip,
              { borderColor: category === cat ? T.accent : tk.line, backgroundColor: category === cat ? T.accent + '12' : tk.card },
            ]}>
              <Text style={[styles.chipText, { color: category === cat ? T.accent : tk.text }]}>{cat}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.fieldLabel, { color: tk.sub }]}>Describe the problem</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Tell us what happened..."
          placeholderTextColor={tk.muted}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          style={[styles.textarea, { backgroundColor: tk.inputBg, borderColor: tk.inputBorder, color: tk.text }]}
        />

        <Pressable
          onPress={() => setSubmitted(true)}
          disabled={!category || !description.trim()}
          style={[styles.submitBtn, {
            backgroundColor: (!category || !description.trim()) ? tk.muted : T.accent,
            opacity: (!category || !description.trim()) ? 0.5 : 1,
          }]}
        >
          <Text style={styles.submitBtnText}>Submit Report</Text>
        </Pressable>
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
  subtitle: { fontSize: ms(13), marginBottom: vs(24) },
  fieldLabel: { fontSize: ms(12), fontFamily: 'Sora_700Bold', marginBottom: vs(10) },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginBottom: vs(24) },
  chip: { paddingVertical: vs(8), paddingHorizontal: s(16), borderRadius: s(20), borderWidth: 1.5 },
  chipText: { fontSize: ms(13), fontFamily: 'Sora_600SemiBold' },
  textarea: { borderRadius: s(13), borderWidth: 1.5, padding: s(14), fontSize: ms(14), fontFamily: 'Sora_400Regular', minHeight: vs(120), marginBottom: vs(24) },
  submitBtn: { paddingVertical: vs(15), borderRadius: s(13), alignItems: 'center' },
  submitBtnText: { fontSize: ms(14), fontFamily: 'Sora_800ExtraBold', color: '#fff' },
  successWrap: { alignItems: 'center', padding: s(40) },
  successIcon: { width: s(56), height: s(56), borderRadius: s(16), alignItems: 'center', justifyContent: 'center', marginBottom: vs(16) },
  successTitle: { fontSize: ms(22), fontFamily: 'Sora_800ExtraBold', marginBottom: vs(8) },
  successSub: { fontSize: ms(14), textAlign: 'center', lineHeight: ms(22), marginBottom: vs(24), maxWidth: s(280) },
  successBtn: { paddingVertical: vs(14), paddingHorizontal: s(32), borderRadius: s(13) },
  successBtnText: { fontSize: ms(14), fontFamily: 'Sora_800ExtraBold' },
})
