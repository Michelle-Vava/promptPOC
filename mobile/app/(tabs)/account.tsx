/**
 * account.tsx — Customer account & settings screen.
 *
 * Sections: avatar with editable name, role switch to provider,
 * push notifications toggle, dark/light mode toggle, legal links
 * (terms, privacy, cookies), and logout.
 */
import { useState } from 'react'
import { View, Text, Pressable, ScrollView, Switch, TextInput, Alert, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'
import { usePickerStyle, type PickerStyle } from '../../lib/picker-style'
import { s, ms, vs } from '../../lib/scale'

export default function AccountScreen() {
  const { tk, mode, toggle } = useTheme()
  const { pickerStyle, setPickerStyle } = usePickerStyle()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top

  const [pushNotifs, setPushNotifs] = useState(true)
  const [emailReminders, setEmailReminders] = useState(false)

  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('Jane Doe')
  const [draftName, setDraftName] = useState('Jane Doe')

  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase()
  const email = 'jane@email.com'
  const memberSince = 'April 2025'

  const handleSaveName = () => {
    const trimmed = draftName.trim()
    if (trimmed.length < 2) {
      Alert.alert('Invalid name', 'Name must be at least 2 characters.')
      return
    }
    setName(trimmed)
    setEditingName(false)
  }

  return (
    <View style={[styles.container, { backgroundColor: tk.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + vs(16), backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
        <Text style={[styles.title, { color: tk.text }]}>Account</Text>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: tk.bg }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar card */}
        <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              {editingName ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(8) }}>
                  <TextInput
                    value={draftName}
                    onChangeText={setDraftName}
                    autoFocus
                    style={[styles.nameInput, { color: tk.text, borderColor: tk.line, backgroundColor: tk.inputBg }]}
                    onSubmitEditing={handleSaveName}
                    returnKeyType="done"
                  />
                  <Pressable onPress={handleSaveName} hitSlop={8}>
                    <Feather name="check" size={ms(18)} color={T.green} />
                  </Pressable>
                  <Pressable onPress={() => { setDraftName(name); setEditingName(false) }} hitSlop={8}>
                    <Feather name="x" size={ms(18)} color={tk.muted} />
                  </Pressable>
                </View>
              ) : (
                <Text style={[styles.userName, { color: tk.text }]}>{name}</Text>
              )}
              <Text style={[styles.userEmail, { color: tk.muted }]}>{email}</Text>
              <Text style={[styles.memberSince, { color: tk.muted }]}>Member since {memberSince}</Text>
            </View>
            {!editingName && (
              <Pressable onPress={() => { setDraftName(name); setEditingName(true) }} hitSlop={8}>
                <Feather name="edit-2" size={ms(16)} color={tk.muted} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Role switch */}
        <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <Text style={[styles.sectionLabel, { color: tk.muted }]}>Role</Text>
          <Pressable
            onPress={() => router.navigate('/(provider-tabs)')}
            style={[styles.linkRow, { borderBottomColor: tk.line }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(10) }}>
              <Feather name="repeat" size={ms(16)} color={T.accent} />
              <Text style={[styles.linkText, { color: tk.text }]}>Switch to Provider</Text>
            </View>
            <Feather name="chevron-right" size={ms(16)} color={tk.muted} />
          </Pressable>
        </View>

        {/* Settings */}
        <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <Text style={[styles.sectionLabel, { color: tk.muted }]}>Settings</Text>
          <SettingRow label="Push Notifications" tk={tk}>
            <Switch
              value={pushNotifs}
              onValueChange={setPushNotifs}
              trackColor={{ false: tk.line, true: T.accent }}
              thumbColor="#fff"
            />
          </SettingRow>
          <SettingRow label="Email Reminders" tk={tk}>
            <Switch
              value={emailReminders}
              onValueChange={setEmailReminders}
              trackColor={{ false: tk.line, true: T.accent }}
              thumbColor="#fff"
            />
          </SettingRow>
          <SettingRow label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'} tk={tk}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(8) }}>
              <Feather name={mode === 'dark' ? 'moon' : 'sun'} size={14} color={tk.muted} />
              <Switch
                value={mode === 'dark'}
                onValueChange={toggle}
                trackColor={{ false: tk.line, true: T.accent }}
                thumbColor="#fff"
              />
            </View>
          </SettingRow>
        </View>

        {/* Booking Preferences */}
        <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <Text style={[styles.sectionLabel, { color: tk.muted }]}>Booking Preferences</Text>
          <SettingRow label="Time Picker Style" tk={tk}>
            <SegmentedControl
              options={['wheel', 'dial'] as PickerStyle[]}
              labels={['Wheel', 'Dial']}
              value={pickerStyle}
              onChange={setPickerStyle}
              tk={tk}
            />
          </SettingRow>
        </View>

        {/* Legal */}
        <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <Text style={[styles.sectionLabel, { color: tk.muted }]}>Legal</Text>
          {([
            { label: 'Terms of Service', route: '/legal/terms' },
            { label: 'Privacy Policy', route: '/legal/privacy' },
            { label: 'Cookie Policy', route: '/legal/cookies' },
          ] as const).map(item => (
            <Pressable key={item.label} style={[styles.linkRow, { borderBottomColor: tk.line }]} onPress={() => router.push(item.route as any)}>
              <Text style={[styles.linkText, { color: tk.text }]}>{item.label}</Text>
              <Feather name="chevron-right" size={ms(16)} color={tk.muted} />
            </Pressable>
          ))}
        </View>

        {/* Help & Support */}
        <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <Text style={[styles.sectionLabel, { color: tk.muted }]}>Help & Support</Text>
          {([
            { label: 'FAQ', icon: 'help-circle' as const, route: '/help/faq' },
            { label: 'Contact Support', icon: 'message-circle' as const, route: '/help/contact' },
            { label: 'Report a Problem', icon: 'alert-triangle' as const, route: '/help/report' },
          ]).map(item => (
            <Pressable key={item.label} onPress={() => router.push(item.route as any)} style={[styles.linkRow, { borderBottomColor: tk.line }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: s(10) }}>
                <Feather name={item.icon} size={ms(16)} color={T.accent} />
                <Text style={[styles.linkText, { color: tk.text }]}>{item.label}</Text>
              </View>
              <Feather name="chevron-right" size={ms(16)} color={tk.muted} />
            </Pressable>
          ))}
        </View>

        {/* Sign out */}
        <Pressable
          style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.replace('/splash')}
        >
          <Feather name="log-out" size={ms(16)} color="#FF4444" />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>

        <Text style={[styles.footer, { color: tk.muted }]}>
          Prompt v1.0.0 · © {new Date().getFullYear()} Prompt Technologies Inc.
        </Text>
      </ScrollView>
    </View>
  )
}

function SettingRow({ label, children, tk }: { label: string; children: React.ReactNode; tk: any }) {
  return (
    <View style={[settingStyles.row, { borderBottomColor: tk.line }]}>
      <Text style={[settingStyles.label, { color: tk.text }]}>{label}</Text>
      {children}
    </View>
  )
}

const settingStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(14),
    borderBottomWidth: 1,
  },
  label: {
    fontSize: ms(14),
    fontFamily: 'Sora_400Regular',
  },
})

function SegmentedControl<V extends string>({ options, labels, value, onChange, tk }: {
  options: V[]; labels: string[]; value: V; onChange: (v: V) => void; tk: any
}) {
  return (
    <View style={segStyles.container}>
      {options.map((opt, i) => {
        const active = opt === value
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[
              segStyles.option,
              { backgroundColor: active ? T.accent + '18' : 'transparent', borderColor: active ? T.accent + '50' : tk.line },
            ]}
          >
            <Text style={[segStyles.optionText, { color: active ? T.accent : tk.muted, fontFamily: active ? 'Sora_700Bold' : 'Sora_400Regular' }]}>
              {labels[i]}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const segStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: s(6),
  },
  option: {
    paddingVertical: vs(6),
    paddingHorizontal: s(14),
    borderRadius: s(12),
    borderWidth: 1,
  },
  optionText: {
    fontSize: ms(12),
  },
})

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

  scrollContent: {
    padding: s(16),
    paddingBottom: vs(40),
    gap: vs(16),
  },

  card: {
    borderRadius: s(16),
    padding: s(18),
    borderWidth: 1,
  },

  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(16),
  },
  avatar: {
    width: s(56),
    height: s(56),
    borderRadius: s(16),
    backgroundColor: T.accent + '22',
    borderWidth: 2,
    borderColor: T.accent + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: ms(20),
    fontFamily: 'Sora_800ExtraBold',
    color: T.accent,
  },
  userName: {
    fontSize: ms(18),
    fontFamily: 'Sora_800ExtraBold',
    letterSpacing: -0.3,
  },
  nameInput: {
    flex: 1,
    fontSize: ms(16),
    fontFamily: 'Sora_700Bold',
    paddingVertical: vs(6),
    paddingHorizontal: s(10),
    borderRadius: s(8),
    borderWidth: 1,
  },
  userEmail: {
    fontSize: ms(12),
    fontFamily: 'Sora_400Regular',
    marginTop: vs(2),
  },
  memberSince: {
    fontSize: ms(10),
    fontFamily: 'Sora_400Regular',
    marginTop: vs(2),
  },

  sectionLabel: {
    fontSize: ms(10),
    fontFamily: 'Sora_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: vs(4),
  },

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(14),
    borderBottomWidth: 1,
  },
  linkText: {
    fontSize: ms(14),
    fontFamily: 'Sora_400Regular',
  },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    paddingVertical: vs(16),
    borderRadius: s(14),
    backgroundColor: 'rgba(255,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.15)',
  },
  signOutText: {
    fontSize: ms(14),
    fontFamily: 'Sora_700Bold',
    color: '#FF4444',
  },

  footer: {
    fontSize: ms(11),
    fontFamily: 'Sora_400Regular',
    textAlign: 'center',
    marginTop: vs(12),
  },
})
