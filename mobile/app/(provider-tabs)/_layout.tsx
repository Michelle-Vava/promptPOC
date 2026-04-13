/**
 * _layout.tsx — Provider bottom tab navigator.
 *
 * Four tabs: Dashboard (live toggle + incoming requests),
 * Bookings (today's + history), Slots (availability editor),
 * Account (business info, billing, settings).
 */
import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'

function TabIcon({ name, focused, muted }: { name: React.ComponentProps<typeof Feather>['name']; focused: boolean; muted: string }) {
  return (
    <View style={styles.iconWrap}>
      <Feather name={name} size={22} color={focused ? T.accent : muted} />
      {focused && <View style={styles.activeDot} />}
    </View>
  )
}

export default function ProviderTabsLayout() {
  const insets = useSafeAreaInsets()
  const { tk } = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tk.bg,
          borderTopWidth: 1,
          borderTopColor: tk.line,
          elevation: 0,
          height: 54 + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 8),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
        },
        tabBarActiveTintColor: T.accent,
        tabBarInactiveTintColor: tk.muted,
        tabBarLabelStyle: {
          fontFamily: 'Sora_600SemiBold',
          fontSize: 10,
          marginTop: -2,
        },
        tabBarItemStyle: {
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon name="bar-chart-2" focused={focused} muted={tk.muted} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} muted={tk.muted} />,
        }}
      />
      <Tabs.Screen
        name="slots"
        options={{
          title: 'Slots',
          tabBarIcon: ({ focused }) => <TabIcon name="clock" focused={focused} muted={tk.muted} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => <TabIcon name="user" focused={focused} muted={tk.muted} />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 28,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.accent,
    marginTop: 3,
  },
})
