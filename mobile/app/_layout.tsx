import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFonts, Sora_300Light, Sora_400Regular, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold } from '@expo-google-fonts/sora'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { ThemeProvider, useTheme } from '../lib/theme'
import { BookingsProvider } from '../lib/bookings-context'
import ErrorBoundary from '../components/ErrorBoundary'

SplashScreen.preventAutoHideAsync()

function InnerLayout() {
  const { mode } = useTheme()

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(provider-tabs)" />
        <Stack.Screen name="legal" />
        <Stack.Screen name="profile" />
      </Stack>
    </>
  )
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Sora_300Light,
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <BookingsProvider>
            <InnerLayout />
          </BookingsProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  )
}
