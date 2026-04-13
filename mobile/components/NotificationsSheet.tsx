/**
 * NotificationsSheet — Modal-based bottom sheet for notifications.
 * Uses React Native Modal + Animated (no reanimated — Expo Go safe).
 */
import { useEffect, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, Modal, Animated, ScrollView, Dimensions } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Notification, T } from '../lib/data'
import { useTheme } from '../lib/theme'
import { s, ms, vs } from '../lib/scale'

const { height: SCREEN_H } = Dimensions.get('window')

const NOTIF_ICONS: Record<Notification['type'], string> = {
  booking_confirmed: 'check-circle',
  waitlist_opened:   'bell',
  provider_accepted: 'thumbs-up',
}
// Unified accent — no competing colors
const NOTIF_ACCENT = T.accent

interface NotificationsSheetProps {
  notifications: Notification[]
  onMarkAllRead: () => void
  onTapNotification: (n: Notification) => void
  isOpen: boolean
  onClose: () => void
}

export default function NotificationsSheet({ notifications, onMarkAllRead, onTapNotification, isOpen, onClose }: NotificationsSheetProps) {
  const { tk } = useTheme()
  const translateY = useRef(new Animated.Value(SCREEN_H)).current
  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isOpen ? 0 : SCREEN_H,
      useNativeDriver: true,
      stiffness: 260,
      damping: 28,
    }).start()
  }, [isOpen])

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View style={[styles.sheet, { backgroundColor: tk.bg, transform: [{ translateY }] }]}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.title}>Notifications</Text>
                {unread > 0 && <Text style={[styles.unreadCount, { color: T.accent }]}>{unread} unread</Text>}
              </View>
              {unread > 0 && (
                <Pressable onPress={onMarkAllRead} style={styles.markReadBtn}>
                  <Text style={styles.markReadText}>Mark all read</Text>
                </Pressable>
              )}
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View style={styles.emptyView}>
                <Feather name="bell-off" size={32} color={T.muted} style={{ marginBottom: 12 }} />
                <Text style={[styles.emptyTitle, { color: tk.text }]}>All caught up</Text>
                <Text style={[styles.emptySub, { color: tk.muted }]}>No notifications yet</Text>
              </View>
            ) : (
              notifications.map(n => {
                const color = NOTIF_ACCENT
                return (
                  <Pressable key={n.id} onPress={() => onTapNotification(n)} style={[styles.card, {
                    backgroundColor: n.read ? tk.card : color + '0A',
                    borderColor: n.read ? tk.line : color + '28',
                  }]}>
                    <View style={[styles.cardIcon, { backgroundColor: color + '18', borderColor: color + '30' }]}>
                      <Feather name={NOTIF_ICONS[n.type] as any} size={16} color={color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.cardMsg, { color: tk.text, fontFamily: n.read ? 'Sora_400Regular' : 'Sora_700Bold' }]}>
                        {n.message}
                      </Text>
                      <Text style={[styles.cardTime, { color: tk.muted }]}>{n.time}</Text>
                    </View>
                    {!n.read && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
                    <Text style={styles.chevron}>›</Text>
                  </Pressable>
                )
              })
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { maxHeight: '90%', borderTopLeftRadius: s(20), borderTopRightRadius: s(20) },
  handle: { width: s(36), height: vs(4), borderRadius: s(2), backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginTop: vs(10), marginBottom: vs(4) },
  header: { backgroundColor: T.ink, paddingVertical: vs(20), paddingHorizontal: s(24) },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: ms(22), fontFamily: 'Sora_800ExtraBold', color: T.white, letterSpacing: -0.5 },
  unreadCount: { fontSize: ms(12), fontFamily: 'Sora_600SemiBold', marginTop: vs(4) },
  markReadBtn: { paddingVertical: vs(7), paddingHorizontal: s(14), borderRadius: s(20), backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  markReadText: { fontSize: ms(11), fontFamily: 'Sora_600SemiBold', color: 'rgba(255,255,255,0.5)' },
  scrollContent: { padding: s(16), paddingHorizontal: s(20) },
  emptyView: { alignItems: 'center', paddingVertical: vs(60) },
  emptyTitle: { fontSize: ms(15), fontFamily: 'Sora_700Bold' },
  emptySub: { fontSize: ms(13), marginTop: vs(6) },
  card: { flexDirection: 'row', gap: s(12), alignItems: 'flex-start', padding: s(14), paddingHorizontal: s(16), borderRadius: s(14), marginBottom: vs(8), borderWidth: 1 },
  cardIcon: { width: s(38), height: s(38), borderRadius: s(11), borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cardMsg: { fontSize: ms(13), lineHeight: ms(18) },
  cardTime: { fontSize: ms(11), marginTop: vs(4) },
  unreadDot: { width: s(7), height: s(7), borderRadius: s(4), marginTop: vs(5) },
  chevron: { fontSize: ms(18), color: 'rgba(255,255,255,0.25)', marginLeft: s(4), alignSelf: 'center' as const },
})
