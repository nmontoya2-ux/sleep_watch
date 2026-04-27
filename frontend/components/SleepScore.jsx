// Circular arc sleep score gauge rendered in SVG
export default function SleepScore({ score = 84, size = 140 }) {
  const cx = size / 2
  const cy = size / 2
  const r  = (size / 2) - 14
  const stroke = 10

  // Arc spans 240° starting from 150° (bottom-left)
  const startAngle = 150
  const totalArc   = 240
  const fillArc    = (score / 100) * totalArc

  function polar(angleDeg, radius) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    }
  }

  function describeArc(startDeg, endDeg, r) {
    const s   = polar(startDeg, r)
    const e   = polar(endDeg, r)
    const lg  = endDeg - startDeg > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${lg} 1 ${e.x} ${e.y}`
  }

  const endAngle = startAngle + fillArc

  // Score → colour
  const scoreColor =
      score >= 85 ? '#4ade80' :
          score >= 70 ? '#7c6ff7' :
              score >= 55 ? '#fbbf24' : '#f87171'

  const label =
      score >= 85 ? 'Excellent' :
          score >= 70 ? 'Good'      :
              score >= 55 ? 'Fair'      : 'Poor'

  return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ overflow: 'visible' }}>
          {/* Track */}
          <path
              d={describeArc(startAngle, startAngle + totalArc, r)}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={stroke}
              strokeLinecap="round"
          />
          {/* Glow (blurred duplicate) */}
          {score > 0 && (
              <path
                  d={describeArc(startAngle, endAngle, r)}
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth={stroke + 6}
                  strokeLinecap="round"
                  style={{ filter: 'blur(6px)', opacity: 0.35 }}
              />
          )}
          {/* Fill */}
          {score > 0 && (
              <path
                  d={describeArc(startAngle, endAngle, r)}
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth={stroke}
                  strokeLinecap="round"
              />
          )}
          {/* Score number */}
          <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: size * 0.25,
                fontWeight: 700,
                fill: 'var(--text)',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.04em',
              }}
          >
            {score}
          </text>
          {/* Label */}
          <text
              x={cx}
              y={cy + size * 0.14}
              textAnchor="middle"
              style={{
                fontSize: size * 0.095,
                fill: scoreColor,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
          >
            {label}
          </text>
        </svg>
      </div>
  )
}
