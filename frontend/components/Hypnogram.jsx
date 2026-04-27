import { stagePalette } from '../utils/sleepUtils'

/**
 * A clinically-styled hypnogram:
 *   - Y axis = sleep stage (Wake at top, Deep at bottom)
 *   - X axis = time
 *   - Each segment drawn as a horizontal bar at its stage row
 *   - Vertical thin connectors between adjacent stage transitions
 *   - Multiple sessions (main + naps) are laid out on a single timeline,
 *     widths proportional to duration with a small visual divider between sessions.
 */

const stageRows = [
  { key: 'awake', label: 'Wake', y: 28 },
  { key: 'rem', label: 'REM', y: 64 },
  { key: 'light', label: 'Core', y: 100 },
  { key: 'deep', label: 'Deep', y: 136 },
]
const stageMap = Object.fromEntries(stageRows.map((r) => [r.key, r]))

const VIEW_W = 1000
const VIEW_H = 200
const X_LEFT = 56
const X_RIGHT = 990
const SESSION_GAP = 22
const LANE_W = X_RIGHT - X_LEFT
const BAR_HEIGHT = 8

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minutesToClock(min) {
  const m = ((min % (24 * 60)) + 24 * 60) % (24 * 60)
  const hour = Math.floor(m / 60) % 24
  const minute = m % 60
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const normalized = hour % 12 || 12
  return `${normalized}:${minute.toString().padStart(2, '0')} ${suffix}`
}

function sessionDurationMinutes(session) {
  return session.stages.reduce((s, st) => s + st.minutes, 0)
}

function Hypnogram({ day, compact = false }) {
  const sessions = day.sessions
  const totalMinutes = sessions.reduce((sum, s) => sum + sessionDurationMinutes(s), 0)
  const gapTotal = SESSION_GAP * Math.max(sessions.length - 1, 0)
  const widthPerMinute = (LANE_W - gapTotal) / Math.max(totalMinutes, 1)

  // Build session/segment layout
  let cursor = X_LEFT
  const sessionLayout = sessions.map((session) => {
    const startX = cursor
    let segCursor = 0
    const segs = session.stages.map((stage, si) => {
      const w = stage.minutes * widthPerMinute
      const x = cursor + segCursor * widthPerMinute
      segCursor += stage.minutes
      return {
        ...stage,
        id: `${session.id}-${si}`,
        x,
        w,
        y: stageMap[stage.stage].y,
      }
    })
    const sessionWidth = segs.reduce((s, seg) => s + seg.w, 0)
    cursor += sessionWidth + SESSION_GAP
    return {
      ...session,
      startX,
      endX: startX + sessionWidth,
      segs,
    }
  })

  return (
    <div className={compact ? 'hypnogram hypnogram-compact' : 'hypnogram'}>
      <div className="hypnogram-legend">
        {stageRows.map((row) => (
          <span key={row.key} className="hypnogram-legend-item">
            <i style={{ background: stagePalette[row.key] }} />
            {row.label}
          </span>
        ))}
      </div>

      <svg
        className="hypnogram-canvas"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Sleep stages over time"
      >
        {/* Horizontal stage gridlines */}
        <g className="hypno-grid">
          {stageRows.map((row) => (
            <line key={row.key} x1={X_LEFT} y1={row.y} x2={X_RIGHT} y2={row.y} />
          ))}
        </g>

        {/* Stage labels on the left */}
        {stageRows.map((row) => (
          <text
            key={`label-${row.key}`}
            className="hypno-stage-label"
            x={X_LEFT - 8}
            y={row.y + 3}
            textAnchor="end"
          >
            {row.label}
          </text>
        ))}

        {/* Sessions */}
        {sessionLayout.map((session, sIdx) => (
          <g key={session.id}>
            {/* Divider between sessions */}
            {sIdx > 0 && (
              <line
                className="hypno-nap-divider"
                x1={session.startX - SESSION_GAP / 2}
                y1={20}
                x2={session.startX - SESSION_GAP / 2}
                y2={150}
              />
            )}

            {/* Vertical connectors between adjacent stages within the session */}
            {session.segs.slice(1).map((seg, i) => {
              const prev = session.segs[i]
              if (prev.y === seg.y) return null
              return (
                <line
                  key={`con-${seg.id}`}
                  x1={seg.x}
                  y1={prev.y}
                  x2={seg.x}
                  y2={seg.y}
                  stroke="rgba(15, 23, 42, 0.18)"
                  strokeWidth="1"
                />
              )
            })}

            {/* Stage segments */}
            {session.segs.map((seg) => (
              <rect
                key={seg.id}
                className="hypno-segment"
                x={seg.x}
                y={seg.y - BAR_HEIGHT / 2}
                width={Math.max(seg.w, 1.2)}
                height={BAR_HEIGHT}
                rx={1.5}
                fill={stagePalette[seg.stage]}
                opacity={session.type === 'nap' ? 0.85 : 1}
              />
            ))}

            {/* Session axis labels */}
            <text
              className="hypno-axis"
              x={session.startX}
              y={170}
              textAnchor="start"
            >
              {minutesToClock(timeToMinutes(session.start))}
            </text>
            <text
              className="hypno-axis"
              x={session.endX}
              y={170}
              textAnchor="end"
            >
              {minutesToClock(timeToMinutes(session.end))}
            </text>

            {/* Session label centered below */}
            <text
              className="hypno-session-label"
              x={(session.startX + session.endX) / 2}
              y={190}
              textAnchor="middle"
            >
              {session.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export default Hypnogram
