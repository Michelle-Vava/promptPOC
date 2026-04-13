/**
 * Toast — Framer Motion spring notification system.
 * Each toast springs in from below and fades out via AnimatePresence.
 * Auto-dismisses after 3.2s. Stacks vertically, most recent on top.
 */
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { T } from '../lib/data'

export interface ToastData {
  id: number
  message: string
  type?: 'success' | 'info' | 'error'
}

interface ToastProps {
  toasts: ToastData[]
  onDismiss: (id: number) => void
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
      pointerEvents: 'none',
    }}>
      <AnimatePresence>
        {toasts.map(t => <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />)}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 3200)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  const accent = toast.type === 'error' ? '#CC2200' : toast.type === 'info' ? '#0066FF' : T.green

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      style={{
        background: 'rgba(13,13,13,.93)', borderRadius: 16,
        padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: `0 4px 28px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.07)`,
        backdropFilter: 'blur(18px)', pointerEvents: 'all', whiteSpace: 'nowrap',
      }}
    >
      <div style={{
        width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0,
        boxShadow: `0 0 8px ${accent}`,
      }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: T.white, fontFamily: 'Sora,system-ui' }}>
        {toast.message}
      </span>
    </motion.div>
  )
}
