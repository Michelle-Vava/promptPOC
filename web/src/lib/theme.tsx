/**
 * theme.tsx — Light/dark theme system with localStorage persistence.
 *
 * Token naming:
 *   bg        — page background
 *   surface   — slightly elevated surface
 *   card      — card / panel background
 *   text      — primary text
 *   sub       — secondary text
 *   muted     — tertiary / placeholder text
 *   line      — border / divider
 *   inputBg   — input field background
 *   inputBorder — input field border
 */
import { createContext, useContext, useState, type ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark'

export interface Tokens {
  bg: string; surface: string; card: string; text: string
  sub: string; muted: string; line: string; inputBg: string; inputBorder: string
}

const LIGHT: Tokens = {
  bg: '#FAFAF8', surface: '#F5F3EF', card: '#FFFFFF', text: '#0D0D0D',
  sub: '#1A1A1A', muted: '#888888', line: '#E8E8E8',
  inputBg: 'rgba(0,0,0,.04)', inputBorder: 'rgba(0,0,0,.12)',
}
const DARK: Tokens = {
  bg: '#0D0D0D', surface: '#111111', card: '#1A1A1A', text: '#F5F3EF',
  sub: '#C8C4BE', muted: '#6B6B6B', line: 'rgba(255,255,255,.08)',
  inputBg: 'rgba(255,255,255,.06)', inputBorder: 'rgba(255,255,255,.1)',
}

const STORAGE_KEY = 'prompt-theme'

function getInitialMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

interface Ctx { mode: ThemeMode; tk: Tokens; toggle: () => void }
const ThemeCtx = createContext<Ctx>({ mode: 'light', tk: LIGHT, toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode)

  const toggle = () => setMode(m => {
    const next = m === 'light' ? 'dark' : 'light'
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
    return next
  })

  return (
    <ThemeCtx.Provider value={{ mode, tk: mode === 'light' ? LIGHT : DARK, toggle }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
