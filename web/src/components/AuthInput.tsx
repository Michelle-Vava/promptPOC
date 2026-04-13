/**
 * AuthInput — Styled text/email/password input for the Auth screen.
 *
 * Theme-aware — adapts to light/dark mode using theme tokens.
 * Border brightens on focus to give feedback without outline rings.
 */
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'

interface AuthInputProps {
  label: string
  placeholder: string
  type?: string
}

export default function AuthInput({ label, placeholder, type = 'text' }: AuthInputProps) {
  const { tk } = useTheme()

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block',
        fontSize: 10,
        fontWeight: 700,
        color: tk.muted,
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
          border: `1.5px solid ${tk.inputBorder}`,
          background: tk.inputBg,
          color: tk.text,
          fontSize: 14,
          fontFamily: 'Sora,system-ui',
          outline: 'none',
          transition: 'border .15s',
        }}
        onFocus={e => (e.target.style.borderColor = tk.sub)}
        onBlur={e => (e.target.style.borderColor = tk.inputBorder)}
      />
    </div>
  )
}
