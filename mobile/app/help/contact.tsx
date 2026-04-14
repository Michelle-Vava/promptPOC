/** contact.tsx — Smart chat simulation with support agent. */
import { useState, useRef, useEffect } from 'react'
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Platform, StatusBar as RNStatusBar, KeyboardAvoidingView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'
import { s, ms, vs } from '../../lib/scale'
import { getSmartReply, GREETING } from '../../lib/chat-engine'

interface ChatMessage { id: number; from: 'user' | 'agent'; text: string; time: string }

const QUICK_REPLIES = [
  'How do I book?',
  'How much does it cost?',
  'Cancel a booking',
  'Become a provider',
  'Report a bug',
]

function getTimeStr() {
  const now = new Date()
  const h = now.getHours() % 12 || 12
  const m = String(now.getMinutes()).padStart(2, '0')
  const ap = now.getHours() < 12 ? 'AM' : 'PM'
  return `${h}:${m} ${ap}`
}

export default function ContactScreen() {
  const { tk } = useTheme()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top
  const scrollRef = useRef<ScrollView>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, from: 'agent', text: GREETING, time: getTimeStr() },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showChips, setShowChips] = useState(true)

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }, [messages, typing])

  const send = (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg) return
    const userMsg: ChatMessage = { id: Date.now(), from: 'user', text: msg, time: getTimeStr() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setShowChips(false)

    setTimeout(() => {
      const reply = getSmartReply(msg)
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'agent', text: reply, time: getTimeStr() }])
      setTyping(false)
      setShowChips(true)
    }, 800 + Math.random() * 1000)
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: tk.bg }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: topPad + vs(12), backgroundColor: tk.card, borderBottomColor: tk.line }]}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color={tk.text} />
          </Pressable>
          <View style={styles.agentBadge}>
            <View style={[styles.avatar, { backgroundColor: T.accent }]}>
              <Text style={styles.avatarText}>S</Text>
            </View>
            <View>
              <Text style={[styles.agentName, { color: tk.text }]}>Sam · PROMPT Support</Text>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent}>
          {messages.map(msg => (
            <View key={msg.id} style={[styles.bubble, msg.from === 'user' ? styles.userBubble : styles.agentBubble]}>
              <View style={[
                styles.bubbleInner,
                msg.from === 'user'
                  ? { backgroundColor: T.accent, borderBottomRightRadius: s(4) }
                  : { backgroundColor: tk.card, borderBottomLeftRadius: s(4), borderWidth: 1, borderColor: tk.line },
              ]}>
                <Text style={[styles.msgText, { color: msg.from === 'user' ? '#fff' : tk.text }]}>{msg.text}</Text>
                <Text style={[styles.msgTime, { color: msg.from === 'user' ? 'rgba(255,255,255,0.6)' : tk.muted }]}>{msg.time}</Text>
              </View>
            </View>
          ))}
          {typing && (
            <View style={[styles.bubble, styles.agentBubble]}>
              <View style={[styles.bubbleInner, { backgroundColor: tk.card, borderBottomLeftRadius: s(4), borderWidth: 1, borderColor: tk.line, flexDirection: 'row', gap: s(4), paddingVertical: vs(14) }]}>
                {[0, 1, 2].map(i => (
                  <View key={i} style={[styles.typingDot, { backgroundColor: tk.muted }]} />
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick reply chips */}
        {showChips && !typing && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.chipsRow, { borderTopColor: tk.line, backgroundColor: tk.bg }]}
            contentContainerStyle={styles.chipsContent}
          >
            {QUICK_REPLIES.map(q => (
              <Pressable key={q} onPress={() => send(q)} style={[styles.chip, { borderColor: `${T.accent}40`, backgroundColor: `${T.accent}0C` }]}>
                <Text style={[styles.chipText, { color: T.accent }]}>{q}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Input */}
        <View style={[styles.inputBar, { borderTopColor: tk.line, backgroundColor: tk.card, paddingBottom: insets.bottom || vs(12) }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor={tk.muted}
            onSubmitEditing={() => send()}
            returnKeyType="send"
            style={[styles.textInput, { backgroundColor: tk.inputBg, borderColor: tk.inputBorder, color: tk.text }]}
          />
          <Pressable onPress={() => send()} style={[styles.sendBtn, { backgroundColor: T.accent }]}>
            <Feather name="send" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(16), paddingBottom: vs(12), borderBottomWidth: 1 },
  backBtn: { marginRight: s(12) },
  agentBadge: { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  avatar: { width: s(32), height: s(32), borderRadius: s(16), alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontFamily: 'Sora_800ExtraBold', fontSize: ms(13) },
  agentName: { fontSize: ms(14), fontFamily: 'Sora_700Bold' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: s(4), marginTop: vs(1) },
  onlineDot: { width: s(6), height: s(6), borderRadius: s(3), backgroundColor: T.green },
  onlineText: { fontSize: ms(11), color: T.green, fontFamily: 'Sora_600SemiBold' },
  messages: { flex: 1 },
  messagesContent: { padding: s(16), gap: vs(10) },
  bubble: { maxWidth: '78%' },
  userBubble: { alignSelf: 'flex-end' },
  agentBubble: { alignSelf: 'flex-start' },
  bubbleInner: { borderRadius: s(16), padding: s(12), paddingHorizontal: s(14) },
  msgText: { fontSize: ms(14), lineHeight: ms(20) },
  msgTime: { fontSize: ms(10), marginTop: vs(4) },
  typingDot: { width: s(7), height: s(7), borderRadius: s(4), opacity: 0.5 },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: s(8), paddingHorizontal: s(12), paddingTop: vs(10), borderTopWidth: 1 },
  textInput: { flex: 1, borderRadius: s(22), borderWidth: 1.5, paddingHorizontal: s(16), paddingVertical: vs(10), fontSize: ms(14), fontFamily: 'Sora_400Regular' },
  sendBtn: { width: s(42), height: s(42), borderRadius: s(21), alignItems: 'center', justifyContent: 'center' },
  chipsRow: { borderTopWidth: 1, paddingVertical: vs(8) },
  chipsContent: { paddingHorizontal: s(12), gap: s(8) },
  chip: { borderWidth: 1, borderRadius: s(20), paddingHorizontal: s(14), paddingVertical: vs(6) },
  chipText: { fontSize: ms(12), fontFamily: 'Sora_600SemiBold' },
})
