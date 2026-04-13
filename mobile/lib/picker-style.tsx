/**
 * picker-style.ts — Shared picker style preference context.
 *
 * Provides 'wheel' | 'dial' preference with React Context + AsyncStorage
 * persistence, matching the existing ThemeProvider pattern.
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type PickerStyle = 'wheel' | 'dial'

const STORAGE_KEY = 'prompt-picker-style'

interface Ctx { pickerStyle: PickerStyle; setPickerStyle: (s: PickerStyle) => void }
const PickerCtx = createContext<Ctx>({ pickerStyle: 'wheel', setPickerStyle: () => {} })

export function PickerStyleProvider({ children }: { children: ReactNode }) {
  const [pickerStyle, _set] = useState<PickerStyle>('wheel')

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(v => {
      if (v === 'dial' || v === 'wheel') _set(v)
    })
  }, [])

  const setPickerStyle = (s: PickerStyle) => {
    _set(s)
    AsyncStorage.setItem(STORAGE_KEY, s)
  }

  return (
    <PickerCtx.Provider value={{ pickerStyle, setPickerStyle }}>
      {children}
    </PickerCtx.Provider>
  )
}

export const usePickerStyle = () => useContext(PickerCtx)
