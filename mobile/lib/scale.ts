/**
 * scale.ts — Responsive scaling utilities.
 *
 * Base design target: 390×844 (iPhone 14 / 15 logical points).
 * s(n)   — scale for spacing, padding, sizing (linear by width)
 * vs(n)  — vertical scale for heights (linear by height)
 * ms(n)  — moderate scale (less aggressive, good for font sizes)
 * fs(n)  — font scale using system accessibility setting
 */
import { Dimensions, PixelRatio } from 'react-native'

const { width: W, height: H } = Dimensions.get('window')

const BASE_W = 390
const BASE_H = 844

/** Horizontal / general scale */
export const s = (size: number) => Math.round(size * (W / BASE_W))

/** Vertical scale */
export const vs = (size: number) => Math.round(size * (H / BASE_H))

/** Moderate scale — factor (0–1) controls how much it scales */
export const ms = (size: number, factor = 0.45) =>
  Math.round(size + (s(size) - size) * factor)

/** Screen dimensions */
export const { width: SW, height: SH } = { width: W, height: H }

/** True if small device (iPhone SE, older Androids) */
export const isSmall = W < 375

/** True if large device (Plus/Max/tablets) */
export const isLarge = W >= 428
