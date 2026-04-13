/**
 * _layout.tsx — Customer bottom tab navigator.
 *
 * Four visible tabs: Home (map), Services (list), Activity (bookings),
 * Account (settings). Uses Feather icons with an orange active dot
 * indicator and badge count on Activity tab.
 */
import { Tabs } from 'expo-router'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'
import { useBookings } from '../../lib/bookings-context'

function TabIcon({ name, focused, badge, muted }: { name: React.ComponentProps<typeof Feather>['name']; focused: boolean; badge?: number; muted: string }) {
  return (
    <View style={styles.iconWrap}>
      <Feather name={name} size={22} color={focused ? T.accent : muted} />
      {focused && <View style={styles.activeDot} />}
      {!!badge && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      )}
    </View>
  )
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets()
  const { tk } = useTheme()
  const { bookings, waitlisted } = useBookings()
  const activityCount = bookings.length + waitlisted.length

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
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} muted={tk.muted} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ focused }) => <TabIcon name="compass" focused={focused} muted={tk.muted} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ focused }) => <TabIcon name="clock" focused={focused} badge={activityCount} muted={tk.muted} />,
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
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: 'Sora_800ExtraBold',
    color: T.white,
  },
})
