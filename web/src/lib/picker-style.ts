/**
 * usePickerStyle — Hook for time-picker style preference (web).
 *
 * Persists 'wheel' | 'dial' to localStorage. Default: 'wheel'.
 */
import { useState } from 'react'

export type PickerStyle = 'wheel' | 'dial'
const KEY = 'prompt-picker-style'

function getInitial(): PickerStyle {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'wheel' || v === 'dial') return v
  } catch {}
  return 'wheel'
}

export function usePickerStyle(): { pickerStyle: PickerStyle; setPickerStyle: (s: PickerStyle) => void } {
  const [pickerStyle, _set] = useState<PickerStyle>(getInitial)

  const setPickerStyle = (s: PickerStyle) => {
    _set(s)
    try { localStorage.setItem(KEY, s) } catch {}
  }

  return { pickerStyle, setPickerStyle }
}
