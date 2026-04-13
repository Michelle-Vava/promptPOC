/**
 * _layout.tsx — Legal screens stack navigator.
 * Wraps Terms, Privacy, and Cookie policy screens with
 * slide-from-right animation and themed headers.
 */
import { Stack } from 'expo-router'

export default function LegalLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
}
