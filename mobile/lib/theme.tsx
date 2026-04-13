import { createContext, useContext, useState, type ReactNode } from 'react'
import { useColorScheme } from 'react-native'

export type ThemeMode = 'light' | 'dark'

export interface Tokens {
  bg: string; surface: string; card: string; text: string
  sub: string; muted: string; line: string; inputBg: string; inputBorder: string
}

const LIGHT: Tokens = {
  bg: '#FAFAF8', surface: '#F5F3EF', card: '#FFFFFF', text: '#0D0D0D',
  sub: '#1A1A1A', muted: '#888888', line: '#E8E8E8',
  inputBg: 'rgba(0,0,0,0.04)', inputBorder: 'rgba(0,0,0,0.12)',
}
const DARK: Tokens = {
  bg: '#0D0D0D', surface: '#111111', card: '#1A1A1A', text: '#F5F3EF',
  sub: '#C8C4BE', muted: '#6B6B6B', line: 'rgba(255,255,255,0.08)',
  inputBg: 'rgba(255,255,255,0.06)', inputBorder: 'rgba(255,255,255,0.1)',
}

interface Ctx { mode: ThemeMode; tk: Tokens; toggle: () => void }
const ThemeCtx = createContext<Ctx>({ mode: 'light', tk: LIGHT, toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme()
  const [mode, setMode] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light')

  const toggle = () => setMode(m => m === 'light' ? 'dark' : 'light')

  return (
    <ThemeCtx.Provider value={{ mode, tk: mode === 'light' ? LIGHT : DARK, toggle }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
