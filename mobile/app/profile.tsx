import { useState } from 'react'
import { View, Text, Pressable, ScrollView, Switch, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'

function Toggle({ on, onToggle, color = T.accent, label }: {
  on: boolean; onToggle: () => void; color?: string; label?: string
}) {
  return (
    <Switch
      value={on}
      onValueChange={onToggle}
      trackColor={{ false: 'rgba(0,0,0,0.15)', true: color }}
      thumbColor="#fff"
      accessibilityLabel={label}
    />
  )
}

export default function ProfileScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { tk, mode, toggle } = useTheme()
  const [pushNotifs, setPushNotifs] = useState(true)
  const [emailReminders, setEmailReminders] = useState(false)

  const initials = 'JD'
  const name = 'Jane Doe'
  const email = 'jane@email.com'
  const memberSince = 'April 2025'

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View style={[styles.row, { borderBottomColor: tk.line }]}>
      <Text style={[styles.rowLabel, { color: tk.text }]}>{label}</Text>
      {children}
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: tk.bg }]}>
      {/* Nav */}
      <View style={[styles.nav, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.navTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar card */}
        <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={[styles.userName, { color: tk.text }]}>{name}</Text>
              <Text style={[styles.userEmail, { color: tk.muted }]}>{email}</Text>
              <Text style={[styles.memberSince, { color: tk.muted }]}>Member since {memberSince}</Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <Text style={[styles.sectionLabel, { color: tk.muted }]}>Preferences</Text>
          <Row label="Push Notifications">
            <Toggle on={pushNotifs} onToggle={() => setPushNotifs(v => !v)} label="Push Notifications" />
          </Row>
          <Row label="Email Reminders">
            <Toggle on={emailReminders} onToggle={() => setEmailReminders(v => !v)} label="Email Reminders" />
          </Row>
          <Row label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}>
            <View style={styles.themeToggle}>
              <Feather name={mode === 'dark' ? 'moon' : 'sun'} size={14} color={T.muted} />
              <Toggle
                on={mode === 'dark'}
                onToggle={toggle}
                color={T.accent}
                label={mode === 'dark' ? 'Disable dark mode' : 'Enable dark mode'}
              />
            </View>
          </Row>
        </View>

        {/* Legal */}
        <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <Text style={[styles.sectionLabel, { color: tk.muted }]}>Legal</Text>
          {(['Terms of Service', 'Privacy Policy', 'Cookie Policy'] as const).map(label => (
            <View key={label} style={[styles.legalRow, { borderBottomColor: tk.line }]}>
              <Text style={[styles.rowLabel, { color: tk.text }]}>{label}</Text>
              <Text style={{ color: tk.muted }}>›</Text>
            </View>
          ))}
        </View>

        {/* Sign out */}
        <Pressable
          style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.replace('/splash')}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>

        <Text style={[styles.footer, { color: tk.muted }]}>
          Prompt v1.0.0 · © {new Date().getFullYear()} Prompt Technologies Inc.
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nav: {
    backgroundColor: T.ink,
    paddingHorizontal: 24,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    paddingVertical: 8,
  },
  backText: {
    fontSize: 13,
    fontFamily: 'Sora_400Regular',
    color: 'rgba(255,255,255,0.5)',
  },
  navTitle: {
    fontSize: 16,
    fontFamily: 'Sora_800ExtraBold',
    color: T.white,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: T.accent + '22',
    borderWidth: 2,
    borderColor: T.accent + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontFamily: 'Sora_800ExtraBold',
    color: T.accent,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Sora_800ExtraBold',
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 13,
    marginTop: 3,
  },
  memberSince: {
    fontSize: 11,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Sora_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 4,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowLabel: {
    fontSize: 14,
    fontFamily: 'Sora_400Regular',
    fontWeight: '500',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  signOutBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 13,
    backgroundColor: 'rgba(204,0,0,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(204,0,0,0.15)',
    alignItems: 'center',
    marginBottom: 20,
  },
  signOutText: {
    fontSize: 14,
    fontFamily: 'Sora_700Bold',
    color: '#CC2200',
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
  },
})
