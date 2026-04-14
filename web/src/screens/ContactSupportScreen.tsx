/**
 * ContactSupportScreen — Smart chat simulation with support agent.
 *
 * Uses keyword-aware response engine for contextual replies.
 * Includes quick-reply suggestion chips for common topics.
 */
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'
import { getSmartReply, GREETING } from '../lib/chat-engine'
import PageLayout from '../components/PageLayout'

interface ChatMessage {
  id: number
  from: 'user' | 'agent'
  text: string
  time: string
}

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

export default function ContactSupportScreen() {
  const { tk, mode } = useTheme()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, from: 'agent', text: GREETING, time: getTimeStr() },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showChips, setShowChips] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text?: string) => {
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
    <PageLayout fill footer={false}>
        {/* Chat header */}
        <div style={{
          padding: '12px 20px', borderBottom: `1px solid ${tk.line}`,
          display: 'flex', alignItems: 'center', gap: 12, background: tk.card,
        }}>
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

        {/* Quick reply chips */}
        {showChips && !typing && (
          <div style={{
            padding: '8px 16px', display: 'flex', gap: 6, flexWrap: 'wrap',
            borderTop: `1px solid ${tk.line}`, background: tk.bg,
          }}>
            {QUICK_REPLIES.map(q => (
              <button key={q} type="button" onClick={() => sendMessage(q)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: `${T.accent}0C`, border: `1px solid ${T.accent}25`,
                color: T.accent, cursor: 'pointer', fontFamily: 'Sora,system-ui',
                transition: 'all .15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = `${T.accent}18`)}
                onMouseLeave={e => (e.currentTarget.style.background = `${T.accent}0C`)}
              >{q}</button>
            ))}
          </div>
        )}

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
          <button type="button" onClick={() => sendMessage()} style={{
            width: 44, height: 44, borderRadius: '50%',
            background: T.accent, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
    </PageLayout>
  )
}
