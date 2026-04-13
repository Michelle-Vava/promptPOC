import { useState } from 'react'
import { View, Text, Pressable, ScrollView, Switch, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'

function SettingRow({ label, tk, children }: { label: string; tk: any; children: React.ReactNode }) {
  return (
    <View style={[sty.settingRow, { borderBottomColor: tk.line }]}>
      <Text style={[sty.settingLabel, { color: tk.text }]}>{label}</Text>
      {children}
    </View>
  )
}

export default function ProviderAccount() {
  const { tk, mode, toggle } = useTheme()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top

  const [pushNotifs, setPushNotifs] = useState(true)

  const name = 'The Main Barber'
  const category = 'Barber'
  const address = '5505 Spring Garden Rd, Halifax'
  const rating = 4.8
  const initials = name.split(' ').filter(w => w[0]?.toUpperCase() === w[0]).map(w => w[0]).join('').slice(0, 2)

  const paymentMethod = 'Visa •••• 4242'

  const billingRows = [
    { month: 'May 2025', amount: '$1,240.00', paid: true },
    { month: 'Apr 2025', amount: '$980.00', paid: true },
    { month: 'Mar 2025', amount: '$1,105.00', paid: true },
  ]

  const legalItems = [
    { label: 'Terms of Service', icon: 'file-text' as const, route: '/legal/terms' },
    { label: 'Privacy Policy', icon: 'shield' as const, route: '/legal/privacy' },
    { label: 'Cookie Policy', icon: 'info' as const, route: '/legal/cookies' },
  ]

  return (
    <View style={[sty.container, { backgroundColor: tk.bg }]}>
      <View style={[sty.header, { paddingTop: topPad + 16, backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
        <Text style={[sty.title, { color: tk.text }]}>Account</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Avatar card */}
        <View style={[sty.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={sty.avatar}>
              <Text style={sty.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[sty.name, { color: tk.text }]}>{name}</Text>
              <Text style={[sty.meta, { color: tk.muted }]}>{category}</Text>
              <Text style={[sty.meta, { color: tk.muted }]}>{address}</Text>
            </View>
            <View style={sty.ratingBadge}>
              <Feather name="star" size={12} color={T.accent} />
              <Text style={sty.ratingText}>{rating}</Text>
            </View>
          </View>
        </View>

        {/* Payment */}
        <View style={[sty.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <Text style={[sty.sectionLabel, { color: tk.muted }]}>Payment</Text>
          <View style={[sty.linkRow, { borderBottomColor: tk.line }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Feather name="credit-card" size={16} color={T.green} />
              <Text style={[sty.linkText, { color: tk.text }]}>{paymentMethod}</Text>
            </View>
            <Feather name="chevron-right" size={16} color={tk.muted} />
          </View>
        </View>

        {/* Billing */}
        <View style={[sty.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <Text style={[sty.sectionLabel, { color: tk.muted }]}>Billing</Text>
          {billingRows.map(b => (
            <View key={b.month} style={[sty.billingRow, { borderBottomColor: tk.line }]}>
              <Text style={[sty.linkText, { color: tk.text }]}>{b.month}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 13, fontFamily: 'Sora_700Bold', color: T.green }}>{b.amount}</Text>
                {b.paid && <Feather name="check-circle" size={14} color={T.green} />}
              </View>
            </View>
          ))}
        </View>

        {/* Role switch */}
        <View style={[sty.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <Text style={[sty.sectionLabel, { color: tk.muted }]}>Role</Text>
          <Pressable
            onPress={() => router.navigate('/(tabs)')}
            style={[sty.linkRow, { borderBottomColor: tk.line }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Feather name="repeat" size={16} color={T.accent} />
              <Text style={[sty.linkText, { color: tk.text }]}>Switch to Customer</Text>
            </View>
            <Feather name="chevron-right" size={16} color={tk.muted} />
          </Pressable>
        </View>

        {/* Settings */}
        <View style={[sty.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <Text style={[sty.sectionLabel, { color: tk.muted }]}>Settings</Text>
          <SettingRow label="Push Notifications" tk={tk}>
            <Switch
              value={pushNotifs}
              onValueChange={setPushNotifs}
              trackColor={{ false: tk.line, true: T.accent }}
              thumbColor={T.white}
            />
          </SettingRow>
          <SettingRow label="Appearance" tk={tk}>
            <Pressable onPress={toggle} style={[sty.togglePill, { backgroundColor: tk.surface, borderColor: tk.line }]}>
              <Feather name={mode === 'dark' ? 'moon' : 'sun'} size={14} color={tk.text} />
              <Text style={{ fontSize: 12, fontFamily: 'Sora_600SemiBold', color: tk.text }}>{mode === 'dark' ? 'Dark' : 'Light'}</Text>
            </Pressable>
          </SettingRow>
        </View>

        {/* Legal */}
        <View style={[sty.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
          <Text style={[sty.sectionLabel, { color: tk.muted }]}>Legal</Text>
          {legalItems.map(item => (
            <Pressable
              key={item.route}
              onPress={() => router.push(item.route as any)}
              style={[sty.linkRow, { borderBottomColor: tk.line }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Feather name={item.icon} size={16} color={tk.muted} />
                <Text style={[sty.linkText, { color: tk.text }]}>{item.label}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={tk.muted} />
            </Pressable>
          ))}
        </View>

        {/* Log out */}
        <Pressable
          onPress={() => router.replace('/splash')}
          style={[sty.card, { backgroundColor: tk.card, borderColor: tk.line, alignItems: 'center', paddingVertical: 14 }]}
        >
          <Text style={{ fontSize: 14, fontFamily: 'Sora_700Bold', color: '#D93025' }}>Log out</Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}

const sty = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  title: { fontSize: 26, fontFamily: 'Sora_800ExtraBold', letterSpacing: -0.5 },
  card: { borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1 },
  sectionLabel: { fontSize: 10, fontFamily: 'Sora_700Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: T.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontFamily: 'Sora_800ExtraBold', color: T.white },
  name: { fontSize: 16, fontFamily: 'Sora_800ExtraBold' },
  meta: { fontSize: 12, fontFamily: 'Sora_400Regular', marginTop: 2 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: T.accent + '14', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  ratingText: { fontSize: 13, fontFamily: 'Sora_700Bold', color: T.accent },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth },
  linkText: { fontSize: 13, fontFamily: 'Sora_600SemiBold' },
  billingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  settingLabel: { fontSize: 13, fontFamily: 'Sora_600SemiBold' },
  togglePill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1 },
})
