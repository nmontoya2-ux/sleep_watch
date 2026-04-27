import { useState } from 'react'
import { stageConfig } from '../data/mockData'

// Stage order on Y-axis (top → bottom)
// Wake=0 (top), REM=4, Light=1, Core=2, Deep=3 (bottom)
const Y_ORDER = [0, 4, 1, 2, 3]
const Y_LABELS = ['Wake', 'REM', 'Light', 'Core', 'Deep']

export default function Hypnogram({ stages = [], totalMinutes = 467 }) {
  const [tooltip, setTooltip] = useState(null)

  const W = 340
  const H = 130
  const PAD_L = 44
  const PAD_R = 10
  const PAD_T = 10
  const PAD_B = 24
  const chartW = W - PAD_L - PAD_R
  const chartH = H - PAD_T - PAD_B
  const rowH   = chartH / (Y_ORDER.length - 1)

  function xOf(min) {
    return PAD_L + (min / totalMinutes) * chartW
  }

  function yOf(stage) {
    const idx = Y_ORDER.indexOf(stage)
    return PAD_T + idx * rowH
  }

  // Build step-line path
  let pathD = ''
  stages.forEach((seg, i) => {
    const x1 = xOf(seg.start)
    const x2 = xOf(seg.start + seg.duration)
    const y  = yOf(seg.stage)
    if (i === 0) {
      pathD += `M ${x1} ${y}`
    } else {
      // Vertical step then horizontal
      pathD += ` V ${y}`
    }
    pathD += ` H ${x2}`
  })

  // Time labels (every ~90 min)
  const tickCount = 6
  const tickLabels = Array.from({ length: tickCount + 1 }, (_, i) => {
    const min = (i / tickCount) * totalMinutes
    // Bedtime is 10:45 PM = 22*60+45 = 1365
    const absMin = (1365 + min) % (24 * 60)
    const h = Math.floor(absMin / 60) % 12 || 12
    const m = String(absMin % 60).padStart(2, '0')
    const ampm = Math.floor(absMin / 60) >= 12 ? 'PM' : 'AM'
    return { min, label: `${h}:${m}` }
  })

  // Colored fill under each stage segment
  const fills = stages.map((seg) => {
    const x1 = xOf(seg.start)
    const x2 = xOf(seg.start + seg.duration)
    const y  = yOf(seg.stage)
    const color = stageConfig[seg.stage]?.color || '#fff'
    return { x: x1, y: PAD_T, width: x2 - x1, height: y - PAD_T, color, seg }
  })

  return (
      <div style={{ position: 'relative' }}>
        <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            style={{ display: 'block', overflow: 'visible' }}
            onMouseLeave={() => setTooltip(null)}
        >
          {/* Horizontal grid lines */}
          {Y_ORDER.map((stage, i) => (
              <line
                  key={stage}
                  x1={PAD_L}
                  y1={PAD_T + i * rowH}
                  x2={W - PAD_R}
                  y2={PAD_T + i * rowH}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
              />
          ))}

          {/* Y axis labels */}
          {Y_LABELS.map((lbl, i) => (
              <text
                  key={lbl}
                  x={PAD_L - 6}
                  y={PAD_T + i * rowH}
                  textAnchor="end"
                  dominantBaseline="middle"
                  style={{
                    fontSize: 8.5,
                    fill: 'rgba(160,163,184,0.7)',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                  }}
              >
                {lbl}
              </text>
          ))}

          {/* Colored vertical fills showing stage transitions */}
          {fills.map((f, i) => (
              <rect
                  key={i}
                  x={f.x}
                  y={f.y}
                  width={f.width}
                  height={f.height}
                  fill={f.color}
                  opacity={0.06}
              />
          ))}

          {/* Stage blocks (clickable) */}
          {stages.map((seg, i) => {
            const x1    = xOf(seg.start)
            const x2    = xOf(seg.start + seg.duration)
            const y     = yOf(seg.stage)
            const color = stageConfig[seg.stage]?.color || '#aaa'
            return (
                <rect
                    key={i}
                    x={x1}
                    y={y - 5}
                    width={x2 - x1}
                    height={10}
                    rx={3}
                    fill={color}
                    opacity={0.15}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) =>
                        setTooltip({
                          x: (x1 + x2) / 2,
                          y: y - 14,
                          label: stageConfig[seg.stage]?.label,
                          dur: seg.duration,
                          color,
                        })
                    }
                />
            )
          })}

          {/* Step-line */}
          <path
              d={pathD}
              fill="none"
              stroke="rgba(124,111,247,0.85)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
          />

          {/* Glowing line */}
          <path
              d={pathD}
              fill="none"
              stroke="rgba(124,111,247,0.35)"
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{ filter: 'blur(3px)' }}
          />

          {/* X axis time labels */}
          {tickLabels.filter((_, i) => i % 2 === 0).map(({ min, label }) => (
              <text
                  key={min}
                  x={xOf(min)}
                  y={H - 4}
                  textAnchor="middle"
                  style={{
                    fontSize: 7.5,
                    fill: 'rgba(92,96,122,0.9)',
                    fontFamily: 'Inter, sans-serif',
                  }}
              >
                {label}
              </text>
          ))}

          {/* Tooltip */}
          {tooltip && (
              <g>
                <rect
                    x={tooltip.x - 32}
                    y={tooltip.y - 18}
                    width={64}
                    height={18}
                    rx={5}
                    fill="#1f2233"
                    stroke={tooltip.color}
                    strokeWidth="0.8"
                />
                <text
                    x={tooltip.x}
                    y={tooltip.y - 7}
                    textAnchor="middle"
                    style={{
                      fontSize: 8,
                      fill: '#e8eaf0',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                    }}
                >
                  {tooltip.label} · {tooltip.dur}m
                </text>
              </g>
          )}
        </svg>

        {/* Stage legend */}
        <div style={legendStyle}>
          {Object.entries(stageConfig).map(([key, cfg]) => (
              <div key={key} style={legendItem}>
                <div style={{ ...dot, background: cfg.color }} />
                <span style={legendText}>{cfg.label}</span>
              </div>
          ))}
        </div>
      </div>
  )
}

const legendStyle = {
  display: 'flex',
  gap: '14px',
  flexWrap: 'wrap',
  marginTop: 10,
  paddingLeft: 44,
}
const legendItem = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
}
const dot = {
  width: 7,
  height: 7,
  borderRadius: '50%',
  flexShrink: 0,
}
const legendText = {
  fontSize: '0.67rem',
  color: 'var(--text-3)',
  fontFamily: 'Inter, sans-serif',
}
