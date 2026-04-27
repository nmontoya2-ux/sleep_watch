import Hypnogram from '../components/Hypnogram.jsx'
import {
  formatMinutes,
  getNapMinutes,
  stagePalette,
} from '../utils/sleepUtils'

/* ---------- SVG donut ---------- */
function Donut({ stageTotals }) {
  const RADIUS = 70
  const STROKE = 18
  const C = 2 * Math.PI * RADIUS
  const total = stageTotals.reduce((s, x) => s + x.minutes, 0) || 1

  let cumulative = 0
  const deepRemPct = stageTotals
    .filter((s) => s.stage === 'deep' || s.stage === 'rem')
    .reduce((sum, s) => sum + s.value, 0)

  return (
    <svg className="donut-svg" viewBox="0 0 200 200" role="img" aria-label="Stage breakdown">
      <circle className="donut-track" cx="100" cy="100" r={RADIUS} />
      {stageTotals.map((s) => {
        const fraction = s.minutes / total
        const length = fraction * C
        const offset = -cumulative
        cumulative += length
        return (
          <circle
            key={s.stage}
            className="donut-segment"
            cx="100"
            cy="100"
            r={RADIUS}
            stroke={s.color}
            strokeDasharray={`${length} ${C - length}`}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
          />
        )
      })}
      <text className="donut-center" x="100" y="98">{deepRemPct}%</text>
      <text className="donut-center-small" x="100" y="118">deep + REM</text>
    </svg>
  )
}

/* ---------- Trend line chart with area fill ---------- */
function TrendChart({ values, label, unit, color = 'var(--accent)', areaClass = 'trend-area', lineClass = 'trend-line' }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const padTop = 8
  const padBottom = 8
  const W = 100
  const H = 100

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W
    const y = padTop + (1 - (v - min) / range) * (H - padTop - padBottom)
    return [x, y]
  })

  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
  const areaPath = `${linePath} L${W},${H} L0,${H} Z`

  return (
    <div className="trend-chart">
      <div className="trend-chart-head">
        <span>{label}</span>
        <strong>{min.toFixed(values.some(v => !Number.isInteger(v)) ? 1 : 0)}–{max.toFixed(values.some(v => !Number.isInteger(v)) ? 1 : 0)} {unit}</strong>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <path className={areaClass} d={areaPath} style={{ fill: color }} />
        <path className={lineClass} d={linePath} style={{ stroke: color }} />
      </svg>
    </div>
  )
}

function Insights({ today, stageTotals }) {
  const napMinutes = getNapMinutes(today)

  return (
    <section className="screen">
      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Full hypnogram</p>
            <h2 className="panel-title" style={{ fontSize: '1.3rem' }}>
              Stage transitions across all sessions
            </h2>
            <p className="panel-subtitle">
              {today.sessions.length} session{today.sessions.length > 1 ? 's' : ''} ·
              {' '}
              {formatMinutes(today.sessions.reduce((s, x) => s + x.stages.reduce((a, b) => a + b.minutes, 0), 0))} total
            </p>
          </div>
        </div>
        <Hypnogram day={today} />
      </article>

      <div className="layout-two layout-two-equal">
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="section-label">Stage breakdown</p>
              <h3 className="panel-title">Distribution of sleep</h3>
            </div>
          </div>
          <div className="donut-wrap">
            <Donut stageTotals={stageTotals} />
            <div className="stage-list">
              {stageTotals.map((stage) => (
                <div key={stage.stage} className="stage-row" style={{ gridTemplateColumns: '110px 1fr auto' }}>
                  <div className="stage-title">
                    <i style={{ background: stage.color }} />
                    <span>{stage.label}</span>
                  </div>
                  <div className="stage-bar">
                    <div style={{ width: `${stage.value}%`, background: stage.color }} />
                  </div>
                  <strong className="stage-amount">{stage.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="section-label">Biometric trends</p>
              <h3 className="panel-title">Overnight heart and breathing</h3>
            </div>
          </div>
          <div className="trend-stack">
            <TrendChart
              values={today.heartRate}
              label="Heart rate"
              unit="bpm"
              color="var(--accent)"
            />
            <TrendChart
              values={today.breathingRate}
              label="Breathing rate"
              unit="brpm"
              color="var(--stage-rem)"
            />
          </div>
        </article>
      </div>

      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">AI-style tips</p>
            <h3 className="panel-title">Where to focus next</h3>
            <p className="panel-subtitle">
              Personalized suggestions based on tonight's stage data and biometrics.
            </p>
          </div>
        </div>
        <div className="tips-list">
          <div className="tip">
            <span className="tip-bullet" />
            <span>
              Protect the final third of the night — your strongest opportunity is preserving
              uninterrupted REM near morning. Consider an earlier caffeine cutoff and a cooler
              sleep environment to reduce wake bursts.
            </span>
          </div>
          <div className="tip">
            <span className="tip-bullet" />
            <span>
              Keep naps under 30 minutes. Today's nap added <strong>{formatMinutes(napMinutes)}</strong> of recovery
              without disrupting overnight sleep pressure.
            </span>
          </div>
          <div className="tip">
            <span className="tip-bullet" />
            <span>
              Aim for another 20–30 minutes of main sleep on shorter nights. Extending main sleep
              raises deep-sleep yield more reliably than relying on naps to close the gap.
            </span>
          </div>
        </div>
      </article>
    </section>
  )
}

export default Insights
