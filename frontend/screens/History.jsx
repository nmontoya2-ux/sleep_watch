import { useState } from 'react'
import SleepScore from '../components/SleepScore'
import { weekHistory, todayNaps } from '../data/mockData'

function formatDur(min) {
  if (!min || min === 0) return '—'
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}h ${m > 0 ? m + 'm' : ''}`
}

function scoreColor(s) {
  if (s >= 85) return '#4ade80'
  if (s >= 70) return '#7c6ff7'
  if (s >= 55) return '#fbbf24'
  return '#f87171'
}

function ScoreRing({ score, size = 44 }) {
  const cx = size / 2
  const cy = size / 2
  const r  = size / 2 - 5
  const stroke = 4
  const startAngle = 150
  const totalArc   = 240
  const fillArc    = (score / 100) * totalArc

  function polar(deg) {
    const rad = ((deg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function arcPath(s, e) {
    const sp = polar(s)
    const ep = polar(e)
    return `M ${sp.x} ${sp.y} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${ep.x} ${ep.y}`
  }

  const color = scoreColor(score)

  return (
      <svg width={size} height={size} style={{ overflow: 'visible', flexShrink: 0 }}>
        <path d={arcPath(startAngle, startAngle + totalArc)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} strokeLinecap="round" />
        <path d={arcPath(startAngle, startAngle + fillArc)} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: 10, fontWeight: 700, fill: 'var(--text)', fontFamily: 'Inter, sans-serif' }}
        >{score}</text>
      </svg>
  )
}

// Monthly mock data (extended from weekHistory)
const extendedHistory = [
  { date: 'Apr 7',  dayLabel: 'Mon', score: 72, totalMin: 430, napsMin: 0,  deep: 72, rem: 115 },
  { date: 'Apr 8',  dayLabel: 'Tue', score: 68, totalMin: 405, napsMin: 20, deep: 60, rem: 100 },
  { date: 'Apr 9',  dayLabel: 'Wed', score: 85, totalMin: 480, napsMin: 0,  deep: 95, rem: 148 },
  { date: 'Apr 10', dayLabel: 'Thu', score: 78, totalMin: 445, napsMin: 0,  deep: 78, rem: 125 },
  { date: 'Apr 11', dayLabel: 'Fri', score: 62, totalMin: 375, napsMin: 30, deep: 50, rem: 90  },
  { date: 'Apr 12', dayLabel: 'Sat', score: 91, totalMin: 500, napsMin: 0,  deep: 104,rem: 152 },
  { date: 'Apr 13', dayLabel: 'Sun', score: 80, totalMin: 462, napsMin: 0,  deep: 88, rem: 132 },
  { date: 'Apr 14', dayLabel: 'Mon', score: 74, totalMin: 420, napsMin: 25, deep: 70, rem: 110 },
  { date: 'Apr 15', dayLabel: 'Tue', score: 83, totalMin: 455, napsMin: 0,  deep: 90, rem: 138 },
  { date: 'Apr 16', dayLabel: 'Wed', score: 79, totalMin: 450, napsMin: 0,  deep: 85, rem: 128 },
  { date: 'Apr 17', dayLabel: 'Thu', score: 88, totalMin: 472, napsMin: 0,  deep: 98, rem: 144 },
  { date: 'Apr 18', dayLabel: 'Fri', score: 66, totalMin: 388, napsMin: 40, deep: 55, rem: 95  },
  { date: 'Apr 19', dayLabel: 'Sat', score: 82, totalMin: 468, napsMin: 0,  deep: 88, rem: 134 },
  { date: 'Apr 20', dayLabel: 'Sun', score: 77, totalMin: 440, napsMin: 20, deep: 76, rem: 120 },
  ...weekHistory,
]

export default function History() {
  const [view, setView] = useState('week') // 'week' | 'month'

  const data = view === 'week' ? weekHistory : extendedHistory

  const avg = Math.round(data.reduce((s, d) => s + d.score, 0) / data.length)
  const avgDur = Math.round(data.reduce((s, d) => s + d.totalMin, 0) / data.length)
  const napDays = data.filter((d) => d.napsMin > 0).length
  const bestDay = [...data].sort((a, b) => b.score - a.score)[0]

  return (
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.header} className="fade-up">
          <h2>Sleep History</h2>
          <div style={styles.toggle}>
            {['week', 'month'].map((v) => (
                <button
                    key={v}
                    onClick={() => setView(v)}
                    style={{
                      ...styles.toggleBtn,
                      background: view === v ? 'var(--accent)' : 'transparent',
                      color: view === v ? '#fff' : 'var(--text-3)',
                    }}
                >
                  {v === 'week' ? '7 days' : '30 days'}
                </button>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div style={styles.statsRow} className="fade-up-1">
          {[
            { val: avg,              lbl: 'Avg score',    color: scoreColor(avg) },
            { val: formatDur(avgDur), lbl: 'Avg duration', color: 'var(--accent-2)' },
            { val: napDays,           lbl: 'Nap days',     color: 'var(--core)'     },
            { val: bestDay.score,     lbl: 'Best night',   color: '#4ade80'         },
          ].map(({ val, lbl, color }) => (
              <div key={lbl} className="stat-tile">
                <p className="stat-val" style={{ color }}>{val}</p>
                <p className="stat-lbl">{lbl}</p>
              </div>
          ))}
        </div>

        {/* Score chart overview */}
        <div className="card fade-up-2" style={{ marginBottom: 14, padding: '16px' }}>
          <div className="section-header">
            <h3>Score Overview</h3>
            <span className="label">Last {data.length} nights</span>
          </div>
          <ScoreCalendar data={data} />
        </div>

        {/* Session list */}
        <div className="fade-up-3">
          <div className="section-header">
            <h3>Sessions</h3>
            <span className="label">{data.length} nights</span>
          </div>
          <div style={styles.sessionList}>
            {[...data].reverse().map((d, i) => {
              const isToday = d.date === 'Apr 27'
              const withNap = d.napsMin > 0
              return (
                  <div
                      key={i}
                      style={{
                        ...styles.sessionRow,
                        background: isToday ? 'rgba(124,111,247,0.06)' : 'var(--card)',
                        border: isToday ? '1px solid rgba(124,111,247,0.2)' : '1px solid var(--border)',
                      }}
                  >
                    <ScoreRing score={d.score} />

                    <div style={styles.sessionInfo}>
                      <div style={styles.sessionTop}>
                        <p style={styles.sessionDate}>
                          {d.date}
                          {isToday && (
                              <span style={styles.todayBadge}>Today</span>
                          )}
                        </p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                          {formatDur(d.totalMin)}
                        </p>
                      </div>

                      {/* Mini bar: deep + rem */}
                      <div style={styles.stageMini}>
                        <div style={{ ...styles.stageChip, background: 'rgba(67,97,238,0.15)', color: 'var(--deep)' }}>
                          Deep {formatDur(d.deep)}
                        </div>
                        <div style={{ ...styles.stageChip, background: 'rgba(155,93,229,0.15)', color: 'var(--rem)' }}>
                          REM {formatDur(d.rem)}
                        </div>
                        {withNap && (
                            <div style={{ ...styles.stageChip, background: 'rgba(76,201,240,0.12)', color: 'var(--core)' }}>
                              Nap +{formatDur(d.napsMin)}
                            </div>
                        )}
                      </div>
                    </div>

                    {/* Score color band */}
                    <div style={{
                      width: 3,
                      height: '100%',
                      background: scoreColor(d.score),
                      borderRadius: '0 12px 12px 0',
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      opacity: 0.7,
                    }} />
                  </div>
              )
            })}
          </div>
        </div>
      </div>
  )
}

// Score calendar heatmap
function ScoreCalendar({ data }) {
  const maxScore = 100

  return (
      <div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {data.map((d, i) => {
            const opacity = 0.15 + (d.score / maxScore) * 0.75
            const color   = scoreColor(d.score)
            const isToday = d.date === 'Apr 27'
            return (
                <div
                    key={i}
                    title={`${d.date}: ${d.score}`}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 7,
                      background: color,
                      opacity,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isToday ? `1.5px solid ${color}` : 'none',
                      boxSizing: 'border-box',
                    }}
                >
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#fff', opacity: 1 / opacity * 0.9 }}>
                {d.score}
              </span>
                </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, alignItems: 'center' }}>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-3)' }}>Low</span>
          {['#f87171', '#fbbf24', '#7c6ff7', '#4ade80'].map((c) => (
              <div key={c} style={{ width: 14, height: 8, borderRadius: 3, background: c, opacity: 0.7 }} />
          ))}
          <span style={{ fontSize: '0.62rem', color: 'var(--text-3)' }}>High</span>
        </div>
      </div>
  )
}

const styles = {
  page: { padding: '20px 16px 0' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggle: {
    display: 'flex',
    background: 'var(--surface)',
    borderRadius: 8,
    padding: 2,
    gap: 2,
    border: '1px solid var(--border)',
  },
  toggleBtn: {
    padding: '5px 12px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.72rem',
    fontWeight: 600,
    transition: 'all 0.2s',
    fontFamily: 'Inter, sans-serif',
  },
  statsRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 14,
  },
  sessionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingBottom: 8,
  },
  sessionRow: {
    display: 'flex',
    gap: 12,
    borderRadius: 12,
    padding: '12px 14px',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  sessionInfo: { flex: 1 },
  sessionTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  sessionDate: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--text)',
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
  todayBadge: {
    fontSize: '0.6rem',
    fontWeight: 700,
    background: 'var(--accent-glow)',
    color: 'var(--accent-2)',
    padding: '1px 6px',
    borderRadius: 999,
    border: '1px solid rgba(124,111,247,0.3)',
    letterSpacing: '0.04em',
  },
  stageMini: { display: 'flex', gap: 5, flexWrap: 'wrap' },
  stageChip: {
    fontSize: '0.62rem',
    fontWeight: 600,
    padding: '2px 7px',
    borderRadius: 999,
  },
}
