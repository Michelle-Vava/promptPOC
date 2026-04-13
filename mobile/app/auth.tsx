import { useState } from 'react'
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { T } from '../lib/data'
import AuthInput from '../components/AuthInput'

type AuthMode = 'login' | 'signup'

export default function Auth() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { role = 'customer' } = useLocalSearchParams<{ role: string }>()
  const [authMode, setAuthMode] = useState<AuthMode>('login')

  const handleSubmit = () => {
    if (role === 'provider') {
      router.replace('/(provider-tabs)')
    } else {
      router.replace('/(tabs)')
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: T.ink }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        {/* Title */}
        <Text style={styles.title}>
          {role === 'customer' ? 'Welcome.' : 'List your slots.'}
        </Text>
        <Text style={styles.subtitle}>
          {role === 'customer' ? 'Book anything today. Zero fees, forever.' : '$1 per booking confirmed.'}
        </Text>

        {/* Social buttons */}
        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtn}>
            <Text style={styles.socialText}> Apple</Text>
          </Pressable>
          <Pressable style={styles.socialBtn}>
            <Text style={styles.socialText}> Google</Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with email</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Tab toggle */}
        <View style={styles.tabRow}>
          {(['login', 'signup'] as AuthMode[]).map(m => (
            <Pressable
              key={m}
              onPress={() => setAuthMode(m)}
              style={[styles.tab, authMode === m && styles.tabActive]}
            >
              <Text style={[styles.tabText, authMode === m && styles.tabTextActive]}>
                {m === 'login' ? 'Log in' : 'Sign up'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Form fields */}
        {authMode === 'signup' && role === 'provider' && (
          <AuthInput label="Business name" placeholder="e.g. Tom's Barbershop" />
        )}
        {authMode === 'signup' && <AuthInput label="Full name" placeholder="Jane Doe" />}
        <AuthInput label="Email" placeholder="you@email.com" type="email" />
        <AuthInput label="Password" placeholder="••••••••" type="password" />
        {authMode === 'signup' && role === 'provider' && (
          <>
            <AuthInput label="Business address" placeholder="123 Barrington St" />
            <AuthInput label="Service category" placeholder="Hair, Repair, Wellness…" />
          </>
        )}

        {/* Submit */}
        <Pressable
          style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>
            {authMode === 'login' ? 'Log in →' : 'Create account →'}
          </Text>
        </Pressable>

        {authMode === 'signup' && (
          <Text style={styles.terms}>
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    justifyContent: 'center',
    flexGrow: 1,
  },
  backBtn: {
    marginBottom: 28,
  },
  backText: {
    fontSize: 13,
    fontFamily: 'Sora_400Regular',
    color: 'rgba(255,255,255,0.35)',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Sora_800ExtraBold',
    color: T.white,
    letterSpacing: -1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.32)',
    marginBottom: 28,
    lineHeight: 22,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  socialBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  socialText: {
    fontSize: 13,
    fontFamily: 'Sora_600SemiBold',
    color: 'rgba(255,255,255,0.7)',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    fontSize: 11,
    fontFamily: 'Sora_600SemiBold',
    color: 'rgba(255,255,255,0.24)',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 4,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: T.white,
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'Sora_700Bold',
    color: 'rgba(255,255,255,0.4)',
  },
  tabTextActive: {
    color: T.ink,
  },
  submitBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 13,
    backgroundColor: T.white,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    fontSize: 14,
    fontFamily: 'Sora_800ExtraBold',
    color: T.ink,
  },
  terms: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.2)',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
})
