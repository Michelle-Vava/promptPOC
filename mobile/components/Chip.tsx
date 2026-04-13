import { Pressable, Text, StyleSheet } from 'react-native'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'
import { s, ms, vs } from '../lib/scale'

interface ChipProps {
  active: boolean
  color: string
  onPress: () => void
  children: React.ReactNode
}

export default function Chip({ active, color, onPress, children }: ChipProps) {
  const { tk } = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? tk.inputBg : 'transparent',
          borderColor: active ? tk.muted + '55' : tk.line,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: active ? tk.text : tk.muted },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingVertical: vs(7),
    paddingHorizontal: s(14),
    borderRadius: s(20),
    borderWidth: 1.5,
  },
  label: {
    fontSize: ms(12),
    fontFamily: 'Sora_700Bold',
  },
})
