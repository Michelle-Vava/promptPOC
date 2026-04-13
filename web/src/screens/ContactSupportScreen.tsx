/**
 * ContactSupportScreen — Chat simulation with support agent.
 */
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'
import Shell from '../components/Shell'

interface ChatMessage {
  id: number
  from: 'user' | 'agent'
  text: string
  time: string
}

const AGENT_RESPONSES = [
  "Hi there! 👋 I'm Sam from PROMPT support. How can I help you today?",
  "Great question! Let me look into that for you.",
  "I understand the concern. Here's what I'd suggest...",
  "I've made a note of this. Our team will follow up within 24 hours.",
  "Is there anything else I can help you with?",
  "Thanks for reaching out! Don't hesitate to contact us anytime.",
]

function getTimeStr() {
  const now = new Date()
  const h = now.getHours() % 12 || 12
  const m = String(now.getMinutes()).padStart(2, '0')
  const ap = now.getHours() < 12 ? 'AM' : 'PM'
  return `${h}:${m} ${ap}`
}

export default function ContactSupportScreen() {
  const { tk, mode } = useTheme()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, from: 'agent', text: AGENT_RESPONSES[0], time: getTimeStr() },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const responseIdx = useRef(1)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg: ChatMessage = { id: Date.now(), from: 'user', text: input.trim(), time: getTimeStr() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const reply = AGENT_RESPONSES[responseIdx.current % AGENT_RESPONSES.length]
      responseIdx.current++
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'agent', text: reply, time: getTimeStr() }])
      setTyping(false)
    }, 1200 + Math.random() * 800)
  }

  return (
    <Shell>
      <div style={{ height: '100vh', background: tk.bg, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: `1px solid ${tk.line}`,
          display: 'flex', alignItems: 'center', gap: 12, background: tk.card,
        }}>
          <button type="button" onClick={() => navigate({ to: '/profile' })} style={{
            background: 'none', border: 'none', color: tk.muted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', fontFamily: 'Sora,system-ui',
          }}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: T.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: 'Sora,system-ui',
          }}>
            S
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: tk.text, fontFamily: 'Sora,system-ui' }}>Sam · PROMPT Support</div>
            <div style={{ fontSize: 11, color: T.green, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.green }} /> Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '75%', padding: '12px 16px', borderRadius: 16,
                background: msg.from === 'user' ? T.accent : tk.card,
                color: msg.from === 'user' ? '#fff' : tk.text,
                border: msg.from === 'agent' ? `1px solid ${tk.line}` : 'none',
                fontSize: 14, lineHeight: 1.5, fontFamily: 'Sora,system-ui',
                borderBottomRightRadius: msg.from === 'user' ? 4 : 16,
                borderBottomLeftRadius: msg.from === 'agent' ? 4 : 16,
              }}>
                {msg.text}
                <div style={{
                  fontSize: 10, color: msg.from === 'user' ? 'rgba(255,255,255,.6)' : tk.muted,
                  marginTop: 4, textAlign: msg.from === 'user' ? 'right' : 'left',
                }}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '12px 20px', borderRadius: 16, borderBottomLeftRadius: 4,
                background: tk.card, border: `1px solid ${tk.line}`,
                display: 'flex', gap: 4, alignItems: 'center',
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%', background: tk.muted,
                    animation: `pulse 1s ease-in-out ${i * 0.15}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 16px', borderTop: `1px solid ${tk.line}`,
          background: tk.card, display: 'flex', gap: 8,
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 24,
              border: `1.5px solid ${tk.inputBorder}`, background: tk.inputBg,
              color: tk.text, fontSize: 14, fontFamily: 'Sora,system-ui',
              outline: 'none',
            }}
          />
          <button type="button" onClick={sendMessage} style={{
            width: 44, height: 44, borderRadius: '50%',
            background: T.accent, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </Shell>
  )
}
