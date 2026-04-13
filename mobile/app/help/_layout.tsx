/**
 * _layout.tsx — Help screens stack navigator.
 */
import { Stack } from 'expo-router'

export default function HelpLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
}
