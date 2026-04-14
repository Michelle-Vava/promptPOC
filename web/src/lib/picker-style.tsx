/**
 * picker-style.tsx — Shared picker style preference context (web).
 *
 * Context-based so sidebar & map screen share the same state.
 * Persists 'wheel' | 'dial' to localStorage. Default: 'wheel'.
 */
import { createContext, useContext, useState, type ReactNode } from 'react'

export type PickerStyle = 'wheel' | 'dial' | 'arc'

export const PICKER_OPTIONS: { id: PickerStyle; label: string; icon: string }[] = [
  { id: 'wheel', label: 'Wheel', icon: '🎡' },
  { id: 'dial',  label: 'Dial',  icon: '🕐' },
  { id: 'arc',   label: 'Arc',   icon: '🌗' },
]

const KEY = 'prompt-picker-style'

function getInitial(): PickerStyle {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'wheel' || v === 'dial' || v === 'arc') return v
  } catch {}
  return 'wheel'
}

interface Ctx { pickerStyle: PickerStyle; setPickerStyle: (s: PickerStyle) => void }
const PickerCtx = createContext<Ctx>({ pickerStyle: 'wheel', setPickerStyle: () => {} })

export function PickerStyleProvider({ children }: { children: ReactNode }) {
  const [pickerStyle, _set] = useState<PickerStyle>(getInitial)

  const setPickerStyle = (s: PickerStyle) => {
    _set(s)
    try { localStorage.setItem(KEY, s) } catch {}
  }

  return (
    <PickerCtx.Provider value={{ pickerStyle, setPickerStyle }}>
      {children}
    </PickerCtx.Provider>
  )
}

export const usePickerStyle = () => useContext(PickerCtx)
