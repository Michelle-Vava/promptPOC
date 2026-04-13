/** CategoryBar — Horizontally scrollable category filter chips. */
import { View, ScrollView, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { GROUPS, T } from '../lib/data'
import { useTheme } from '../lib/theme'
import { s, vs } from '../lib/scale'
import Chip from './Chip'

interface CategoryBarProps {
  category: string | null
  setCategory: (cat: string | null) => void
  /** Optional — resets active pin when a category chip is tapped (map screen). */
  setActiveId?: (id: number | null) => void
}

export default function CategoryBar({ category, setCategory, setActiveId }: CategoryBarProps) {
  const { tk } = useTheme()
  return (
    <View style={[styles.container, { backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Chip
          active={!category}
          color={T.accent}
          onPress={() => { setCategory(null); setActiveId?.(null) }}
        >
          All
        </Chip>
        {GROUPS.map(g => (
          <Chip
            key={g.id}
            active={category === g.id}
            color={g.color}
            onPress={() => { setCategory(category === g.id ? null : g.id); setActiveId?.(null) }}
          >
            <Feather name={g.icon as any} size={12} color={category === g.id ? tk.text : tk.muted} /> {g.label}
          </Chip>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    gap: s(8),
  },
})
