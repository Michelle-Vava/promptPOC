/**
 * router.tsx — TanStack Router configuration.
 *
 * Routes:
 *   /                — Splash landing page
 *   /auth            — Auth screen (role passed via search params)
 *   /map             — Map booking screen (customer home)
 *   /services        — Services listing screen
 *   /profile         — Customer profile/settings
 *   /provider        — Provider dashboard
 *   /help/faq        — FAQ page
 *   /help/contact    — Contact support (chat simulation)
 *   /help/report     — Report a problem
 *   /legal/terms     — Terms of Service
 *   /legal/privacy   — Privacy Policy
 *   /legal/cookies   — Cookie Policy
 *   /activity        — Activity/bookings screen
 */
import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from '@tanstack/react-router'
import { ThemeProvider } from './lib/theme'
import Splash from './screens/Splash'
import Auth from './screens/Auth'
import MapScreen from './screens/MapScreen'
import ProviderDashboard from './screens/ProviderDashboard'
import ProfileScreen from './screens/ProfileScreen'
import ServicesScreen from './screens/ServicesScreen'
import ActivityScreen from './screens/ActivityScreen'
import FAQScreen from './screens/FAQScreen'
import ContactSupportScreen from './screens/ContactSupportScreen'
import ReportProblemScreen from './screens/ReportProblemScreen'
import TermsScreen from './screens/TermsScreen'
import PrivacyScreen from './screens/PrivacyScreen'
import CookiesScreen from './screens/CookiesScreen'

/* ── Root layout ── */
const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  ),
})

/* ── Splash ── */
const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Splash,
})

/* ── Auth ── */
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: Auth,
  validateSearch: (search: Record<string, unknown>) => ({
    role: (search.role as string) || 'customer',
  }),
})

/* ── Map ── */
const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/map',
  component: MapScreen,
})

/* ── Services ── */
const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: ServicesScreen,
})

/* ── Profile ── */
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfileScreen,
})

/* ── Provider dashboard ── */
const providerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/provider',
  component: ProviderDashboard,
})

/* ── Activity ── */
const activityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/activity',
  component: ActivityScreen,
})

/* ── Help pages ── */
const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help/faq',
  component: FAQScreen,
})

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help/contact',
  component: ContactSupportScreen,
})

const reportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help/report',
  component: ReportProblemScreen,
})

/* ── Legal pages ── */
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/legal/terms',
  component: TermsScreen,
})

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/legal/privacy',
  component: PrivacyScreen,
})

const cookiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/legal/cookies',
  component: CookiesScreen,
})

/* ── Route tree ── */
const routeTree = rootRoute.addChildren([
  splashRoute,
  authRoute,
  mapRoute,
  servicesRoute,
  profileRoute,
  providerRoute,
  activityRoute,
  faqRoute,
  contactRoute,
  reportRoute,
  termsRoute,
  privacyRoute,
  cookiesRoute,
])

/* ── Router instance ── */
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
