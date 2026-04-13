/**
 * bookings-context.tsx — Global booking state (React Context).
 *
 * Stores confirmed bookings and waitlist entries in memory.
 * Provides add/remove helpers consumed by map, services,
 * activity, and provider screens.
 *
 * NOTE: State is ephemeral — resets on app restart.
 * A production app would persist via AsyncStorage or a backend.
 */
import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Booking, WaitlistEntry } from './data'

interface BookingsState {
  bookings: Booking[]
  waitlisted: WaitlistEntry[]
  addBooking: (b: Booking) => void
  removeBooking: (id: number) => void
  addWaitlist: (w: WaitlistEntry) => void
  removeWaitlist: (id: number) => void
}

const Ctx = createContext<BookingsState | null>(null)

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [waitlisted, setWaitlisted] = useState<WaitlistEntry[]>([])

  const addBooking = useCallback((b: Booking) => setBookings(prev => [...prev, b]), [])
  const removeBooking = useCallback((id: number) => setBookings(prev => prev.filter(x => x.id !== id)), [])
  const addWaitlist = useCallback((w: WaitlistEntry) => setWaitlisted(prev => [...prev, w]), [])
  const removeWaitlist = useCallback((id: number) => setWaitlisted(prev => prev.filter(x => x.id !== id)), [])

  return (
    <Ctx.Provider value={{ bookings, waitlisted, addBooking, removeBooking, addWaitlist, removeWaitlist }}>
      {children}
    </Ctx.Provider>
  )
}

export function useBookings() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useBookings must be used within BookingsProvider')
  return ctx
}
