/**
 * geo.ts — Geolocation utilities for distance and ETA calculations.
 *
 * Uses Haversine formula for straight-line distance, then applies
 * a road-factor multiplier for realistic driving estimates.
 */

/** Mock user location — central Halifax waterfront */
export const USER_LOCATION = { latitude: 44.6488, longitude: -63.5752 }

/** Haversine distance in kilometres */
export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Road distance estimate (straight-line × 1.35 city factor) */
export function roadDistanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  return haversineKm(lat1, lng1, lat2, lng2) * 1.35
}

/** Estimated driving time in minutes (avg 30 km/h urban) */
export function drivingMinutes(distKm: number): number {
  return Math.max(1, Math.round(distKm / 30 * 60))
}

/** Format distance: "1.2 km" or "350 m" */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

/** Format ETA: "5 min drive" */
export function formatETA(km: number): string {
  const mins = drivingMinutes(km)
  return `${mins} min drive`
}
