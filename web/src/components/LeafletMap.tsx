/**
 * LeafletMap — Interactive map of Halifax with custom provider pins.
 *
 * Tiles: CartoDB Positron (light) / CartoDB Dark Matter (dark). Free, no API key.
 *
 * Pin rendering (createPinIcon):
 *   - HTML pill per provider: category icon, price, star rating
 *   - Top Rated / Open Now badges add a filled checkmark circle
 *   - Waitlisted providers show a bell icon on their pin
 *   - Unavailable providers render at 35% opacity
 *   - Active (selected) pin: dark bg, scaled up, colour ring shadow
 *
 * Leaflet + Vite: default marker assets 404 in Vite.
 * Fixed by resolving URLs explicitly via import.meta.url.
 *
 * MapContainer fills its parent via position:absolute; inset:0.
 * The parent div must be position:relative with explicit height.
 */
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { GROUPS, Provider } from '../lib/data'
import { USER_LOCATION } from '../lib/geo'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

interface LeafletMapProps {
  providers: Provider[]
  availableIds: Set<number>
  waitlistedIds: Set<number>
  bookedIds?: Set<number>
  activeId: number | null
  onPinClick: (id: number) => void
  darkMode?: boolean
}

function createPinIcon(
  provider: Provider,
  isActive: boolean,
  isAvailable: boolean,
  isWaitlisted: boolean,
  isBooked: boolean = false,
): L.DivIcon {
  const cg = GROUPS.find(g => g.id === provider.cat)
  const price = isBooked ? 'Booked' : provider.price === 0 ? 'Free' : `$${provider.price}`
  const color = cg?.color ?? '#888'

  const bg     = isBooked ? '#E0E0E0' : isActive ? '#0D0D0D' : '#ffffff'
  const fg     = isBooked ? '#999' : isActive ? '#ffffff' : '#0D0D0D'
  const border = isBooked ? '#ccc' : isActive ? color : isWaitlisted ? color : '#ffffff'
  const opacity = isBooked ? 0.55 : (isAvailable || isWaitlisted) ? 1 : 0.35
  const shadow = isActive
    ? `0 3px 14px rgba(0,0,0,0.4), 0 0 0 2px ${color}50`
    : '0 2px 8px rgba(0,0,0,0.18)'

  // rating badge — show if provider is top-rated or verified
  const ratingHtml = `
    <span style="
      font-size:10px; font-weight:800; color:${isActive ? 'rgba(255,255,255,.85)' : color};
      margin-left:2px; letter-spacing:-0.2px; opacity:${isAvailable || isWaitlisted ? 1 : 0.6};
    ">★${provider.rating}</span>`

  // verified tick for badge providers
  const verifiedHtml = provider.badge === 'Top Rated' || provider.badge === 'Open Now' ? `
    <span style="
      display:inline-flex; align-items:center; justify-content:center;
      width:14px; height:14px; border-radius:50%;
      background:${color}; margin-left:2px; flex-shrink:0;
      box-shadow: 0 0 0 1.5px ${color}33;
    ">
      <svg width="8" height="8" viewBox="0 0 7 7" fill="none">
        <path d="M1 3.5L2.8 5.5L6 1.5" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>` : ''

  // bell icon for waitlisted
  const bellHtml = isWaitlisted ? `
    <span style="
      display:inline-flex; align-items:center; justify-content:center;
      width:14px; height:14px; border-radius:50%;
      background:${color}20; border:1px solid ${color}50;
      margin-left:2px; flex-shrink:0; font-size:8px;
    ">🔔</span>` : ''

  return L.divIcon({
    html: `
      <div style="
        display:inline-flex; align-items:center; gap:3px;
        background:${bg}; border:1.5px solid ${border};
        border-radius:20px; padding:4px 8px 4px 5px;
        box-shadow:${shadow};
        transform:${isActive ? 'scale(1.1)' : 'scale(1)'};
        font-family:'Sora',system-ui,sans-serif;
        cursor:pointer; white-space:nowrap;
        opacity:${opacity};
        transition:transform 0.15s;
      ">
        <span style="
          width:18px; height:18px; border-radius:5px;
          background:${color}22; display:inline-flex;
          align-items:center; justify-content:center;
          font-size:10px; flex-shrink:0; line-height:1;
        ">${cg?.icon ?? ''}</span>
        <span style="font-size:11px; font-weight:800; color:${fg}; letter-spacing:-0.2px;">${price}</span>
        ${ratingHtml}
        ${verifiedHtml}
        ${bellHtml}
      </div>
    `,
    className: '',
    iconSize: undefined,
    iconAnchor: [44, 16],
    popupAnchor: [0, -20],
  })
}

const userLocationIcon = L.divIcon({
  html: `
    <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:24px;height:24px;border-radius:50%;background:#3B82F6;animation:userPulse 1.8s ease-out infinite;"></div>
      <div style="width:18px;height:18px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(59,130,246,.4);position:relative;z-index:1;">
        <div style="width:10px;height:10px;border-radius:50%;background:#3B82F6;"></div>
      </div>
    </div>
  `,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

export default function LeafletMap({
  providers, availableIds, waitlistedIds, bookedIds = new Set(), activeId, onPinClick, darkMode = false,
}: LeafletMapProps) {
  const tileUrl = darkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  return (
    <MapContainer
      center={[44.6488, -63.5752]}
      zoom={14}
      zoomControl={false}
      scrollWheelZoom
      style={{ position: 'absolute', inset: 0 }}
    >
      <TileLayer
        url={tileUrl}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />
      {providers.map(p => (
        <Marker
          key={`${p.id}-${p.id === activeId}-${waitlistedIds.has(p.id)}-${bookedIds.has(p.id)}`}
          position={[p.lat, p.lng]}
          icon={createPinIcon(
            p,
            p.id === activeId,
            availableIds.has(p.id),
            waitlistedIds.has(p.id),
            bookedIds.has(p.id),
          )}
          eventHandlers={{ click: () => onPinClick(p.id) }}
        />
      ))}
      <Marker
        position={[USER_LOCATION.latitude, USER_LOCATION.longitude]}
        icon={userLocationIcon}
        interactive={false}
      />
    </MapContainer>
  )
}
