import { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { Marker } from 'react-native-maps'
import { Feather } from '@expo/vector-icons'
import { GROUPS, Provider, T } from '../lib/data'

interface MapPinProps {
  provider: Provider
  isActive: boolean
  index?: number
  onPress: () => void
}

export default function MapPin({ provider, isActive, index = 0, onPress }: MapPinProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current
  const entranceAnim = useRef(new Animated.Value(0)).current

  // Staggered entrance spring
  useEffect(() => {
    entranceAnim.setValue(0)
    Animated.spring(entranceAnim, {
      toValue: 1,
      delay: index * 60,
      useNativeDriver: true,
      stiffness: 300,
      damping: 18,
    }).start()
  }, [provider.id])

  // Pulse when not active
  useEffect(() => {
    if (!isActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      )
      pulse.start()
      return () => pulse.stop()
    } else {
      pulseAnim.setValue(1)
    }
  }, [isActive])

  return (
    <Marker
      coordinate={{ latitude: provider.lat, longitude: provider.lng }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <Animated.View style={[styles.pin, {
        opacity: entranceAnim,
        borderColor: isActive ? T.accent : 'rgba(255,255,255,0.15)',
        transform: [
          { scale: Animated.multiply(isActive ? 1.1 : pulseAnim, entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] })) },
        ],
      }]}>
        {/* Price */}
        <View style={[styles.priceRow, { backgroundColor: isActive ? T.accent : T.green }]}>
          <Text style={[styles.priceText, { color: '#fff' }]}>
            {provider.price === 0 ? 'Free' : `$${provider.price}`}
          </Text>
        </View>

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          <Text style={[styles.rating, { color: isActive ? T.accent : 'rgba(255,255,255,0.6)' }]}>
            ★ {provider.rating}
          </Text>

          {provider.badge === 'Top Rated' && (
            <View style={styles.badge}>
              <Feather name="check" size={8} color={T.white} />
            </View>
          )}
        </View>
      </Animated.View>
    </Marker>
  )
}

const styles = StyleSheet.create({
  pin: {
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
    minWidth: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  priceRow: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: '100%',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 11,
    fontFamily: 'Sora_800ExtraBold',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  rating: {
    fontSize: 10,
    fontFamily: 'Sora_800ExtraBold',
  },
  badge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,92,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 8,
    fontFamily: 'Sora_700Bold',
    color: T.accent,
  },
})
