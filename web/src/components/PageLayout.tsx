/**
 * PageLayout — Unified layout wrapper for all logged-in content pages.
 *
 * Provides consistent structure: AppBar, animated content area, Footer.
 * All post-auth screens except MapScreen, Splash, and Auth use this.
 *
 * Props:
 *   maxWidth   – content max width (default: 640)
 *   padding    – content padding (default: '32px 24px')
 *   footer     – show footer (default: true)
 *   fill       – content fills remaining height, no maxWidth (chat screen)
 */
import { motion } from 'framer-motion'
import { useTheme } from '../lib/theme'
import Shell from './Shell'
import AppBar from './AppBar'
import Footer from './Footer'

interface PageLayoutProps {
  children: React.ReactNode
  maxWidth?: number
  padding?: string
  footer?: boolean
  fill?: boolean
}

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: 'easeOut' as const },
}

export default function PageLayout({
  children,
  maxWidth = 640,
  padding = '32px 24px',
  footer = true,
  fill = false,
}: PageLayoutProps) {
  const { tk } = useTheme()

  return (
    <Shell>
      <div style={{
        minHeight: '100vh',
        background: tk.bg,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <AppBar />

        <motion.div
          initial={pageMotion.initial}
          animate={pageMotion.animate}
          transition={pageMotion.transition}
          style={{
            flex: 1,
            ...(fill
              ? { display: 'flex', flexDirection: 'column' as const }
              : { maxWidth, margin: '0 auto', width: '100%', padding }),
          }}
        >
          {children}
        </motion.div>

        {footer && <Footer />}
      </div>
    </Shell>
  )
}
