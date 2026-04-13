/**
 * AuthInput — Styled text/email/password input for the Auth screen.
 *
 * Always dark (used on the dark auth screen only).
 * Border brightens on focus to give feedback without outline rings.
 */
import { T } from '../lib/data'

interface AuthInputProps {
  label: string
  placeholder: string
  type?: string
}

export default function AuthInput({ label, placeholder, type = 'text' }: AuthInputProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block',
        fontSize: 10,
        fontWeight: 700,
        color: 'rgba(255,255,255,.32)',
        marginBottom: 7,
        letterSpacing: '1.2px',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '13px 15px',
          borderRadius: 11,
          border: '1.5px solid rgba(255,255,255,.1)',
          background: 'rgba(255,255,255,.06)',
          color: T.white,
          fontSize: 14,
          fontFamily: 'Sora,system-ui',
          outline: 'none',
          transition: 'border .15s',
        }}
        onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,.28)')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.1)')}
      />
    </div>
  )
}
