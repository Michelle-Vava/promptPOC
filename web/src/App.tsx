/**
 * App — Root component and state-based screen router.
 *
 * Screens: splash → auth → map | provider | profile
 * role (customer | provider) is set on Splash, passed to Auth to control
 * form fields and the post-login destination.
 *
 * ThemeProvider wraps everything — any component can call useTheme()
 * to get the current token set and toggle dark mode.
 */
import { useState } from 'react'
import { ThemeProvider } from './lib/theme'
import Splash from './screens/Splash'
import Auth from './screens/Auth'
import MapScreen from './screens/MapScreen'
import ProviderDashboard from './screens/ProviderDashboard'
import ProfileScreen from './screens/ProfileScreen'
import ServicesScreen from './screens/ServicesScreen'

type Screen = 'splash' | 'auth' | 'map' | 'provider' | 'profile' | 'services'
type Role = 'customer' | 'provider'

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [role, setRole] = useState<Role>('customer')

  return (
    <ThemeProvider>
      {screen === 'splash' && (
        <Splash onGetStarted={r => { setRole(r); setScreen('auth') }} />
      )}
      {screen === 'auth' && (
        <Auth
          role={role}
          onBack={() => setScreen('splash')}
          onSubmit={() => setScreen(role === 'provider' ? 'provider' : 'map')}
        />
      )}
      {screen === 'map' && (
        <MapScreen
          onSwitchToProvider={() => setScreen('provider')}
          onNavigateToProfile={() => setScreen('profile')}
          onNavigateToServices={() => setScreen('services')}
        />
      )}
      {screen === 'provider' && (
        <ProviderDashboard
          onSignOut={() => setScreen('splash')}
          onSwitchToCustomer={() => setScreen('map')}
        />
      )}
      {screen === 'profile' && (
        <ProfileScreen
          onBack={() => setScreen('map')}
          onSignOut={() => setScreen('splash')}
          onSwitchToProvider={() => setScreen('provider')}
        />
      )}
      {screen === 'services' && (
        <ServicesScreen
          onBack={() => setScreen('map')}
          onNavigateToProfile={() => setScreen('profile')}
        />
      )}
    </ThemeProvider>
  )
}
