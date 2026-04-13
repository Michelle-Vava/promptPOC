/**
 * ErrorBoundary — Global React error boundary.
 * Catches render-time crashes and shows a friendly recovery screen
 * instead of a white screen / red box. Reports error to console.
 */
import { Component, ReactNode } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { T } from '../lib/data'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error.message, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>⚠️</Text>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>{this.state.error.message}</Text>
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}
          onPress={() => this.setState({ error: null })}
        >
          <Text style={styles.btnText}>Try again</Text>
        </Pressable>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  btnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
})
