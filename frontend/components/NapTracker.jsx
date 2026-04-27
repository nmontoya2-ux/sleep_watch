import { stageConfig } from '../data/mockData'

function NapMiniGraph({ stages, totalMinutes }) {
  const W = 80
  const H = 24
  const PAD = 2

  const Y_ORDER = [0, 1, 2, 3, 4]
  const chartW  = W - PAD * 2
  const chartH  = H - PAD * 2
  const rowH    = chartH / (Y_ORDER.length - 1)

  function xOf(min) { return PAD + (min / totalMinutes) * chartW }
  function yOf(s)   { return PAD + Y_ORDER.indexOf(s) * rowH }

  let pathD = ''
  stages.forEach((seg, i) => {
    const x1 = xOf(seg.start)
    const x2 = xOf(seg.start + seg.duration)
    const y  = yOf(seg.stage)
    if (i === 0) pathD += `M ${x1} ${y}`
    else         pathD += ` V ${y}`
    pathD += ` H ${x2}`
  })

  return (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block' }}>
        {stages.map((seg, i) => {
          const x1    = xOf(seg.start)
          const x2    = xOf(seg.start + seg.duration)
          const y     = yOf(seg.stage)
          const color = stageConfig[seg.stage]?.color || '#aaa'
          return (
              <rect
                  key={i}
                  x={x1} y={PAD}
                  width={x2 - x1}
                  height={y - PAD}
                  fill={color}
                  opacity={0.18}
              />
          )
        })}
        <path
            d={pathD}
            fill="none"
            stroke="rgba(124,111,247,0.8)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
        />
      </svg>
  )
}

function formatDur(min) {
  if (min < 60) return `${min}m`
  return `${Math.floor(min / 60)}h ${min % 60}m`
}

const qualityMap = {
  good:  { label: 'Restorative', color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
  light: { label: 'Light',       color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  deep:  { label: 'Deep',        color: '#4361ee', bg: 'rgba(67,97,238,0.1)'  },
}

export default function NapTracker({ naps = [] }) {
  if (naps.length === 0) {
    return (
        <div style={styles.empty}>
          <span style={{ fontSize: '1.4rem' }}>😴</span>
          <p style={styles.emptyText}>No naps logged today</p>
        </div>
    )
  }

  return (
      <div style={styles.list}>
        {naps.map((nap) => {
          const q = qualityMap[nap.quality] || qualityMap.light
          return (
              <div key={nap.id} style={styles.card}>
                <div style={styles.top}>
                  <div>
                    <p style={styles.napLabel}>{nap.label}</p>
                    <p style={styles.napTime}>{nap.startTime} – {nap.endTime}</p>
                  </div>
                  <div style={styles.right}>
                    <p style={styles.dur}>{formatDur(nap.durationMinutes)}</p>
                    <div style={{ ...styles.badge, background: q.bg, color: q.color }}>
                      {q.label}
                    </div>
                  </div>
                </div>

                {nap.stages && nap.stages.length > 0 && (
                    <div style={styles.graphRow}>
                      <NapMiniGraph stages={nap.stages} totalMinutes={nap.durationMinutes} />
                      {nap.note && <p style={styles.note}>{nap.note}</p>}
                    </div>
                )}

                {/* Stage pills */}
                <div style={styles.pills}>
                  {nap.stages.map((seg, i) => {
                    const cfg = stageConfig[seg.stage]
                    return (
                        <div
                            key={i}
                            style={{
                              ...styles.pill,
                              background: `${cfg.color}18`,
                              color: cfg.color,
                              border: `1px solid ${cfg.color}33`,
                            }}
                        >
                          {cfg.label} {seg.duration}m
                        </div>
                    )
                  })}
                </div>
              </div>
          )
        })}
      </div>
  )
}

const styles = {
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '14px',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  napLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: 2,
  },
  napTime: { fontSize: '0.75rem', color: 'var(--text-3)' },
  right:   { textAlign: 'right' },
  dur: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 4,
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 999,
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
  },
  graphRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  note: {
    fontSize: '0.72rem',
    color: 'var(--text-3)',
    fontStyle: 'italic',
    flex: 1,
  },
  pills: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  pill: {
    padding: '2px 8px',
    borderRadius: 999,
    fontSize: '0.65rem',
    fontWeight: 600,
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '20px 0',
  },
  emptyText: {
    fontSize: '0.8rem',
    color: 'var(--text-3)',
  },
}
