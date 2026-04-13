/**
 * UserLocationPin — Subtle blue/white pulsing dot for user's location.
 * Minimal design: white outer ring, blue core, soft pulse animation.
 */
import { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { Marker } from 'react-native-maps'

interface UserLocationPinProps {
  latitude: number
  longitude: number
}

export default function UserLocationPin({ latitude, longitude }: UserLocationPinProps) {
  const pulseScale = useRef(new Animated.Value(1)).current
  const pulseOpacity = useRef(new Animated.Value(0.4)).current

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, { toValue: 2.2, duration: 1800, useNativeDriver: true }),
          Animated.timing(pulseScale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, { toValue: 0, duration: 1800, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.4, duration: 0, useNativeDriver: true }),
        ]),
      ])
    )
    pulse.start()
    return () => pulse.stop()
  }, [])

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}
    >
      <View style={styles.container}>
        {/* Pulse ring */}
        <Animated.View style={[styles.pulseRing, {
          transform: [{ scale: pulseScale }],
          opacity: pulseOpacity,
        }]} />
        {/* Outer white ring */}
        <View style={styles.outerRing}>
          {/* Blue core */}
          <View style={styles.core} />
        </View>
      </View>
    </Marker>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3B82F6',
  },
  outerRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  core: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
})
