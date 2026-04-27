import StageBreakdown from '../components/StageBreakdown'
import AIInsights     from '../components/AIInsights'
import { tonightSleep, weekHistory, sleepFacts } from '../data/mockData'

function formatDur(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}h ${m > 0 ? m + 'm' : ''}`
}

// Weekly trend sparkline
function ScoreTrend({ data }) {
  const W = 280
  const H = 52
  const PAD = 10
  const chartW = W - PAD * 2
  const chartH = H - PAD * 2
  const maxScore = 100
  const minScore = 50

  function xOf(i)  { return PAD + (i / (data.length - 1)) * chartW }
  function yOf(s)  { return PAD + (1 - (s - minScore) / (maxScore - minScore)) * chartH }

  const points = data.map((d, i) => ({ x: xOf(i), y: yOf(d.score), ...d }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`

  const avg = Math.round(data.reduce((s, d) => s + d.score, 0) / data.length)

  return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-2)', fontWeight: 500 }}>7-day average</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-2)', letterSpacing: '-0.02em' }}>
            {avg} <span style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 500 }}>/ 100</span>
          </p>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
          {/* Area fill */}
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#7c6ff7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7c6ff7" stopOpacity="0"    />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#scoreGrad)" />
          {/* Line */}
          <path d={linePath} fill="none" stroke="#7c6ff7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dots */}
          {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={3.5} fill="#1f2233" stroke="#7c6ff7" strokeWidth="1.5" />
                <text
                    x={p.x}
                    y={H}
                    textAnchor="middle"
                    style={{ fontSize: 8, fill: 'var(--text-3)', fontFamily: 'Inter, sans-serif' }}
                >
                  {p.dayLabel}
                </text>
                <text
                    x={p.x}
                    y={p.y - 7}
                    textAnchor="middle"
                    style={{ fontSize: 8, fill: 'var(--text-2)', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  {p.score}
                </text>
              </g>
          ))}
        </svg>
      </div>
  )
}

// Sleep duration bar chart
function DurationBars({ data }) {
  const maxMin = Math.max(...data.map((d) => d.totalMin + d.napsMin))
  return (
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 70 }}>
        {data.map((d, i) => {
          const nightH = ((d.totalMin / maxMin) * 54)
          const napH   = ((d.napsMin / maxMin) * 54)
          const isToday = i === data.length - 1
          return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  {napH > 0 && (
                      <div style={{
                        width: '70%',
                        height: napH,
                        background: 'var(--core)',
                        opacity: 0.6,
                        borderRadius: '3px 3px 0 0',
                      }} />
                  )}
                  <div style={{
                    width: '70%',
                    height: nightH,
                    background: isToday
                        ? 'linear-gradient(180deg, #9b8fff, #7c6ff7)'
                        : 'rgba(124,111,247,0.35)',
                    borderRadius: napH > 0 ? '0 0 3px 3px' : 3,
                    boxShadow: isToday ? '0 0 10px rgba(124,111,247,0.4)' : 'none',
                  }} />
                </div>
                <p style={{
                  fontSize: '0.6rem',
                  color: isToday ? 'var(--accent-2)' : 'var(--text-3)',
                  fontWeight: isToday ? 700 : 400,
                }}>
                  {d.dayLabel}
                </p>
              </div>
          )
        })}
      </div>
  )
}

// Education card
function FactCard({ fact }) {
  return (
      <div style={{
        ...styles.factCard,
        borderLeft: `3px solid ${fact.color}`,
        background: `linear-gradient(135deg, ${fact.color}08, transparent)`,
      }}>
        <span style={{ fontSize: '1.3rem' }}>{fact.icon}</span>
        <div>
          <p style={styles.factTitle}>{fact.title}</p>
          <p style={styles.factBody}>{fact.body}</p>
        </div>
      </div>
  )
}

export default function Insights() {
  const stageMinutes = tonightSleep.stageMinutes

  return (
      <div style={styles.page}>
        <div style={styles.header} className="fade-up">
          <h2>Sleep Insights</h2>
          <p style={styles.sub}>Based on your last 7 nights</p>
        </div>

        {/* Weekly score trend */}
        <div className="card fade-up-1" style={{ marginBottom: 14 }}>
          <div className="section-header">
            <h3>Sleep Score Trend</h3>
          </div>
          <ScoreTrend data={weekHistory} />
        </div>

        {/* Duration breakdown */}
        <div className="card fade-up-2" style={{ marginBottom: 14 }}>
          <div className="section-header">
            <h3>Duration · This Week</h3>
            <div style={styles.legend}>
              <span style={{ ...styles.legDot, background: 'var(--accent)' }} /> Night
              <span style={{ ...styles.legDot, background: 'var(--core)', marginLeft: 8 }} /> Nap
            </div>
          </div>
          <DurationBars data={weekHistory} />
          <div style={styles.avgRow}>
            <span style={styles.avgLbl}>Avg nightly</span>
            <span style={styles.avgVal}>
            {formatDur(Math.round(weekHistory.reduce((s, d) => s + d.totalMin, 0) / weekHistory.length))}
          </span>
            <span style={{ ...styles.avgLbl, marginLeft: 14 }}>With naps</span>
            <span style={{ ...styles.avgVal, color: 'var(--core)' }}>
            {formatDur(Math.round(weekHistory.reduce((s, d) => s + d.totalMin + d.napsMin, 0) / weekHistory.length))}
          </span>
          </div>
        </div>

        {/* Stage breakdown */}
        <div className="card fade-up-3" style={{ marginBottom: 14 }}>
          <div className="section-header">
            <h3>Last Night's Stages</h3>
          </div>
          <StageBreakdown stageMinutes={stageMinutes} />
        </div>

        {/* Recovery metrics */}
        <div className="card fade-up-4" style={{ marginBottom: 14 }}>
          <div className="section-header">
            <h3>Recovery Metrics</h3>
          </div>
          <div style={styles.metrics}>
            {[
              { label: 'Sleep efficiency', value: tonightSleep.efficiency, unit: '%', goal: 85, color: 'var(--accent)' },
              { label: 'Deep sleep',       value: Math.round((stageMinutes.deep / tonightSleep.totalMinutes) * 100), unit: '%', goal: 18, color: 'var(--deep)' },
              { label: 'REM sleep',        value: Math.round((stageMinutes.rem  / tonightSleep.totalMinutes) * 100), unit: '%', goal: 22, color: 'var(--rem)'  },
            ].map((m) => {
              const pct = Math.min((m.value / m.goal) * 100, 100)
              const ok  = m.value >= m.goal
              return (
                  <div key={m.label} style={styles.metricRow}>
                    <div style={styles.metricTop}>
                      <span style={styles.metricLabel}>{m.label}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: ok ? '#4ade80' : 'var(--amber)' }}>
                    {m.value}{m.unit}
                  </span>
                    </div>
                    <div className="progress-track">
                      <div
                          className="progress-fill"
                          style={{ width: `${pct}%`, background: m.color }}
                      />
                    </div>
                    <p style={{ fontSize: '0.62rem', color: 'var(--text-3)', marginTop: 3 }}>
                      {ok ? '✓ Above goal' : `Goal: ${m.goal}${m.unit}`}
                    </p>
                  </div>
              )
            })}
          </div>
        </div>

        {/* Sleep education */}
        <div className="fade-up-5" style={{ marginBottom: 14 }}>
          <div className="section-header">
            <h3>Learn: Sleep Science</h3>
          </div>
          <div style={styles.factList}>
            {sleepFacts.map((f) => <FactCard key={f.id} fact={f} />)}
          </div>
        </div>

        {/* Full AI insights */}
        <div style={{ marginBottom: 14 }}>
          <div className="section-header">
            <h3>All AI Suggestions</h3>
          </div>
          <AIInsights />
        </div>
      </div>
  )
}

const styles = {
  page: { padding: '20px 16px 0' },
  header: { marginBottom: 18 },
  sub: { fontSize: '0.78rem', color: 'var(--text-3)', marginTop: 2 },
  legend: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.65rem',
    color: 'var(--text-3)',
  },
  legDot: {
    display: 'inline-block',
    width: 7,
    height: 7,
    borderRadius: '50%',
    marginRight: 4,
  },
  avgRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTop: '1px solid var(--border)',
  },
  avgLbl: { fontSize: '0.68rem', color: 'var(--text-3)', fontWeight: 500 },
  avgVal: { fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' },
  metrics: { display: 'flex', flexDirection: 'column', gap: 14 },
  metricRow: {},
  metricTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  metricLabel: { fontSize: '0.78rem', color: 'var(--text-2)', fontWeight: 500 },
  factList: { display: 'flex', flexDirection: 'column', gap: 10 },
  factCard: {
    display: 'flex',
    gap: 12,
    padding: '13px',
    borderRadius: 12,
    border: '1px solid var(--border)',
    alignItems: 'flex-start',
  },
  factTitle: { fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4 },
  factBody: { fontSize: '0.73rem', color: 'var(--text-2)', lineHeight: 1.55 },
}
