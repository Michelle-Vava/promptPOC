import { useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { T } from '../../lib/data'
import { useTheme } from '../../lib/theme'

const SLOT_HOURS = ['8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','8 PM'] // matches HOURS from data.ts + 8 AM boundary
const DURATIONS = [15, 20, 30, 45, 60, 90]

function to24(h: string) {
  const [n, m] = h.split(' ')
  let num = parseInt(n)
  if (m === 'PM' && num !== 12) num += 12
  if (m === 'AM' && num === 12) num = 0
  return num
}

function generateSlots(start: string, end: string, dur: number): string[] {
  const s = to24(start), e = to24(end)
  const slots: string[] = []
  for (let h = s; h < e; h++) {
    for (let m = 0; m < 60; m += dur) {
      if (h * 60 + m + dur > e * 60) break
      const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
      const ampm = h < 12 ? 'AM' : 'PM'
      slots.push(m === 0 ? `${hour} ${ampm}` : `${hour}:${String(m).padStart(2, '0')} ${ampm}`)
    }
  }
  return slots
}

export default function ProviderSlots() {
  const { tk } = useTheme()
  const insets = useSafeAreaInsets()
  const topPad = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : insets.top

  const [editing, setEditing] = useState(false)
  const [startHour, setStartHour] = useState('9 AM')
  const [endHour, setEndHour] = useState('6 PM')
  const [slotDur, setSlotDur] = useState(30)
  const [savedStart, setSavedStart] = useState('9 AM')
  const [savedEnd, setSavedEnd] = useState('6 PM')
  const [savedDur, setSavedDur] = useState(30)

  const handleSave = () => {
    setSavedStart(startHour)
    setSavedEnd(endHour)
    setSavedDur(slotDur)
    setEditing(false)
  }

  const previewSlots = generateSlots(startHour, endHour, slotDur)
  const savedSlots = generateSlots(savedStart, savedEnd, savedDur)

  const PickerRow = ({ label, value, options, onChange }: { label: string; value: string | number; options: { label: string; value: string | number }[]; onChange: (v: string) => void }) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.fieldLabel, { color: tk.muted }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
        {options.map(o => (
          <Pressable
            key={String(o.value)}
            onPress={() => onChange(String(o.value))}
            style={[styles.pickerChip, { backgroundColor: String(o.value) === String(value) ? T.accent : tk.surface, borderColor: String(o.value) === String(value) ? T.accent : tk.line }]}
          >
            <Text style={[styles.pickerChipText, { color: String(o.value) === String(value) ? T.white : tk.text }]}>{o.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: tk.bg }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: tk.bg, borderBottomColor: tk.line }]}>
        <Text style={[styles.title, { color: tk.text }]}>Slots</Text>
        <Text style={[styles.subtitle, { color: tk.muted }]}>Manage your availability</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {!editing ? (
          <>
            {/* Current config */}
            <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
              <Text style={[styles.cardTitle, { color: tk.text }]}>Today's availability</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                {([['Start', savedStart], ['End', savedEnd], ['Slot', `${savedDur} min`]] as [string, string][]).map(([l, v]) => (
                  <View key={l}>
                    <Text style={[styles.fieldLabel, { color: tk.muted }]}>{l}</Text>
                    <Text style={[styles.fieldValue, { color: tk.text }]}>{v}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.chipsWrap}>
                {savedSlots.map(s => (
                  <View key={s} style={styles.slotChip}>
                    <Text style={styles.slotChipText}>{s}</Text>
                  </View>
                ))}
              </View>
              <Pressable
                onPress={() => setEditing(true)}
                style={({ pressed }) => [styles.editBtn, { backgroundColor: tk.surface, borderColor: tk.line }, pressed && { opacity: 0.7 }]}
              >
                <Feather name="edit-2" size={14} color={tk.text} />
                <Text style={{ fontSize: 13, fontFamily: 'Sora_700Bold', color: tk.text }}>Edit slots</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={[styles.card, { backgroundColor: tk.card, borderColor: tk.line }]}>
            <Text style={[styles.cardTitle, { color: tk.text }]}>Edit availability</Text>

            <PickerRow label="Start" value={startHour} options={SLOT_HOURS.slice(0, -1).map(h => ({ label: h, value: h }))} onChange={v => setStartHour(v)} />
            <PickerRow label="End" value={endHour} options={SLOT_HOURS.slice(1).map(h => ({ label: h, value: h }))} onChange={v => setEndHour(v)} />
            <PickerRow label="Duration" value={slotDur} options={DURATIONS.map(d => ({ label: `${d} min`, value: d }))} onChange={v => setSlotDur(Number(v))} />

            <Text style={[styles.fieldLabel, { color: tk.muted, marginTop: 8 }]}>Preview · {previewSlots.length} slots</Text>
            <View style={[styles.chipsWrap, { marginTop: 6, marginBottom: 16 }]}>
              {previewSlots.length > 0
                ? previewSlots.map(s => (
                    <View key={s} style={[styles.slotChip, { backgroundColor: T.accent + '15', borderColor: T.accent + '28' }]}>
                      <Text style={[styles.slotChipText, { color: T.accent }]}>{s}</Text>
                    </View>
                  ))
                : <Text style={{ fontSize: 12, color: tk.muted }}>End must be after start</Text>
              }
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable onPress={handleSave} disabled={previewSlots.length === 0} style={[styles.saveBtn, { backgroundColor: previewSlots.length > 0 ? T.green : tk.line }]}>
                <Text style={{ color: previewSlots.length > 0 ? T.white : tk.muted, fontSize: 13, fontFamily: 'Sora_700Bold' }}>Save</Text>
              </Pressable>
              <Pressable onPress={() => { setStartHour(savedStart); setEndHour(savedEnd); setSlotDur(savedDur); setEditing(false) }} style={[styles.cancelBtn, { backgroundColor: tk.surface, borderColor: tk.line }]}>
                <Text style={{ color: tk.text, fontSize: 13, fontFamily: 'Sora_600SemiBold' }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  title: { fontSize: 26, fontFamily: 'Sora_800ExtraBold', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontFamily: 'Sora_400Regular', marginTop: 4 },
  card: { borderRadius: 18, padding: 20, marginBottom: 16, borderWidth: 1 },
  cardTitle: { fontSize: 14, fontFamily: 'Sora_800ExtraBold', marginBottom: 16 },
  fieldLabel: { fontSize: 10, fontFamily: 'Sora_700Bold', textTransform: 'uppercase', letterSpacing: 1 },
  fieldValue: { fontSize: 16, fontFamily: 'Sora_800ExtraBold', marginTop: 4 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 16 },
  slotChip: { backgroundColor: T.green + '18', borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8, borderWidth: 1, borderColor: T.green + '28' },
  slotChipText: { fontSize: 10, fontFamily: 'Sora_600SemiBold', color: T.green },
  pickerChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, marginRight: 6, borderWidth: 1 },
  pickerChipText: { fontSize: 12, fontFamily: 'Sora_600SemiBold' },
  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  saveBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },
  cancelBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
})
