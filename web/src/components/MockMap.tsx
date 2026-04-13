import { GROUPS, Provider, T } from '../lib/data'

interface MockMapProps {
  providers: Provider[]
  activeId: number | null
  onPinClick: (id: number) => void
}

export default function MockMap({ providers, activeId, onPinClick }: MockMapProps) {
  const LAT_MIN = -63.592, LAT_MAX = -63.562, LNG_MIN = 44.635, LNG_MAX = 44.660
  const MW = 900, MH = 560

  const toXY = (lat: number, lng: number) => ({
    x: ((lng - LAT_MIN) / (LAT_MAX - LAT_MIN)) * MW,
    y: ((LNG_MAX - lat) / (LNG_MAX - LNG_MIN)) * MH,
  })

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#E8EBE0', overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${MW} ${MH}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="ms"><feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity=".15" /></filter>
        </defs>

        {/* Water */}
        <ellipse cx={-20} cy={MH * .72} rx={110} ry={190} fill="#B8D4E8" opacity=".7" />
        <ellipse cx={25}  cy={MH * .55} rx={65}  ry={130} fill="#C8DDEF" opacity=".5" />

        {/* Major roads */}
        {([
          [0, MH*.38, MW, MH*.42, 20],
          [0, MH*.58, MW, MH*.62, 16],
          [MW*.22, 0, MW*.24, MH, 18],
          [MW*.48, 0, MW*.50, MH, 14],
          [MW*.72, 0, MW*.74, MH, 12],
        ] as [number, number, number, number, number][]).map(([x1, y1, x2, y2, w], i) => (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={w} />
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D8D4C8" strokeWidth={w - 5} strokeDasharray="40 18" opacity=".5" />
          </g>
        ))}

        {/* Secondary roads */}
        {([
          [0, MH*.22, MW, MH*.25, 7],
          [0, MH*.72, MW, MH*.76, 7],
          [MW*.12, 0, MW*.13, MH, 6],
          [MW*.36, 0, MW*.37, MH, 6],
          [MW*.62, 0, MW*.63, MH, 6],
          [MW*.86, 0, MW*.87, MH, 6],
        ] as [number, number, number, number, number][]).map(([x1, y1, x2, y2, w], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={w} opacity=".8" />
        ))}

        {/* City blocks */}
        {([
          [MW*.13,MH*.04,MW*.22,MH*.21], [MW*.25,MH*.04,MW*.36,MH*.21], [MW*.38,MH*.04,MW*.48,MH*.21],
          [MW*.51,MH*.04,MW*.62,MH*.21], [MW*.64,MH*.04,MW*.72,MH*.21], [MW*.75,MH*.04,MW*.85,MH*.21],
          [MW*.13,MH*.26,MW*.22,MH*.37], [MW*.25,MH*.26,MW*.36,MH*.37], [MW*.38,MH*.26,MW*.48,MH*.37],
          [MW*.51,MH*.26,MW*.62,MH*.37], [MW*.64,MH*.26,MW*.72,MH*.37], [MW*.75,MH*.26,MW*.85,MH*.37],
          [MW*.13,MH*.44,MW*.22,MH*.57], [MW*.25,MH*.44,MW*.36,MH*.57], [MW*.38,MH*.44,MW*.48,MH*.57],
          [MW*.51,MH*.44,MW*.62,MH*.57], [MW*.64,MH*.44,MW*.72,MH*.57], [MW*.75,MH*.44,MW*.85,MH*.57],
          [MW*.13,MH*.64,MW*.36,MH*.76], [MW*.38,MH*.64,MW*.62,MH*.76], [MW*.64,MH*.64,MW*.85,MH*.76],
          [MW*.13,MH*.80,MW*.48,MH*.94], [MW*.51,MH*.80,MW*.85,MH*.94],
        ] as [number, number, number, number][]).map(([x1, y1, x2, y2], i) => (
          <rect key={i} x={x1} y={y1} width={x2 - x1} height={y2 - y1} rx="5" fill="#D5D1C2" filter="url(#ms)" opacity=".9" />
        ))}

        {/* Green space */}
        <rect x={MW*.38} y={MH*.04} width={MW*.10} height={MH*.17} rx="4" fill="#C4D8A4" opacity=".55" />
        <rect x={MW*.64} y={MH*.04} width={MW*.08} height={MH*.15} rx="4" fill="#C4D8A4" opacity=".45" />

        {/* Provider pins */}
        {providers.map(p => {
          const { x, y } = toXY(p.lat, p.lng)
          const isAct = p.id === activeId
          const cg = GROUPS.find(g => g.id === p.cat)
          return (
            <g key={p.id} style={{ cursor: 'pointer' }} onClick={() => onPinClick(p.id)}>
              {isAct && <circle cx={x} cy={y} r="30" fill={cg?.color} opacity=".12" />}
              <rect
                x={x - 36} y={y - 27} width={72} height={26} rx="9"
                fill={isAct ? T.ink : T.white}
                stroke={isAct ? cg?.color : T.white}
                strokeWidth={isAct ? 1.5 : 1}
                filter="url(#ms)"
              />
              <rect x={x - 34} y={y - 25} width={21} height={21} rx="6" fill={`${cg?.color}22`} />
              <text
                x={x + 2} y={y - 10} fontSize="10.5" fontWeight="800"
                fill={isAct ? T.white : T.ink}
                fontFamily="Sora,system-ui"
                textAnchor="start"
              >
                {p.price === 0 ? 'Free' : `$${p.price}`}
              </text>
              <line x1={x} y1={y} x2={x} y2={y + 9} stroke={isAct ? T.ink : 'rgba(0,0,0,.2)'} strokeWidth="1.5" />
              <circle cx={x} cy={y + 11} r="3" fill={isAct ? T.ink : 'rgba(0,0,0,.18)'} />
            </g>
          )
        })}

        {/* User location dot */}
        <circle cx={MW * .49} cy={MH * .48} r="9"   fill={T.accent} opacity=".18" />
        <circle cx={MW * .49} cy={MH * .48} r="5.5" fill={T.accent} />
        <circle cx={MW * .49} cy={MH * .48} r="2.5" fill="#fff" />
      </svg>

      <div style={{
        position: 'absolute', bottom: 8, right: 12,
        fontSize: 10, color: 'rgba(0,0,0,.3)', fontFamily: 'system-ui',
      }}>
        Halifax, NS · Mock map
      </div>
    </div>
  )
}
