/** AuthInput — Themed text input with floating label for auth forms. */
import { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'

interface AuthInputProps {
  label: string
  placeholder: string
  type?: 'text' | 'email' | 'password'
}

export default function AuthInput({ label, placeholder, type = 'text' }: AuthInputProps) {
  const [focused, setFocused] = useState(false)
  const { tk } = useTheme()

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: tk.muted }]}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={tk.muted}
        secureTextEntry={type === 'password'}
        keyboardType={type === 'email' ? 'email-address' : 'default'}
        autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        style={[styles.input, { backgroundColor: tk.inputBg, borderColor: tk.inputBorder, color: tk.text }, focused && { borderColor: tk.sub }]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Sora_700Bold',
    color: 'rgba(255,255,255,0.32)',
    marginBottom: 7,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: T.white,
    fontSize: 14,
    fontFamily: 'Sora_400Regular',
  },
  inputFocused: {
    borderColor: 'rgba(255,255,255,0.28)',
  },
})
