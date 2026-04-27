import Hypnogram from '../components/Hypnogram.jsx'
import NapBadge from '../components/NapBadge.jsx'
import ScoreRing from '../components/ScoreRing.jsx'
import SleepCard from '../components/SleepCard.jsx'
import {
  formatClock,
  formatMinutes,
  getNapMinutes,
  getSleepScore,
  getTotalSleepMinutes,
  stagePalette,
} from '../utils/sleepUtils'

function Home({ today, stageTotals }) {
  const totalSleep = getTotalSleepMinutes(today)
  const sleepScore = getSleepScore(today)
  const napMinutes = getNapMinutes(today)
  const awakeMinutes = stageTotals.find((s) => s.stage === 'awake')?.minutes ?? 0
  const remMinutes = stageTotals.find((s) => s.stage === 'rem')?.minutes ?? 0
  const deepMinutes = stageTotals.find((s) => s.stage === 'deep')?.minutes ?? 0
  const mainSleep = totalSleep - napMinutes
  const efficiency = Math.round(
    (totalSleep / Math.max(totalSleep + awakeMinutes, 1)) * 100,
  )

  return (
    <section className="screen">
      {/* Hero: total sleep + score */}
      <div className="hero">
        <div className="hero-main">
          <div className="hero-eyebrow">
            <span className="hero-dot" />
            Today's sleep
          </div>
          <h2 className="hero-total">
            {formatMinutes(totalSleep)}
            <small>total</small>
          </h2>
          <p className="hero-window">
            Main sleep <strong>{formatClock(today.bedtime)}</strong> – <strong>{formatClock(today.wakeTime)}</strong>
            {napMinutes > 0 && <> · plus a {napMinutes}-min nap</>}
          </p>
          <div className="hero-tags">
            <span className="tag">
              <i style={{ color: stagePalette.deep }} />
              {formatMinutes(deepMinutes)} deep
            </span>
            <span className="tag">
              <i style={{ color: stagePalette.rem }} />
              {formatMinutes(remMinutes)} REM
            </span>
            <span className="tag">
              <i style={{ color: stagePalette.awake }} />
              {formatMinutes(awakeMinutes)} awake
            </span>
            <NapBadge minutes={napMinutes} />
          </div>
        </div>

        <div className="hero-score">
          <ScoreRing score={sleepScore} label="Sleep score" />
        </div>
      </div>

      {/* Key metrics */}
      <div className="metric-grid">
        <SleepCard
          title="Main sleep"
          value={formatMinutes(mainSleep)}
          detail="Overnight session"
          color={stagePalette.light}
        />
        <SleepCard
          title="Naps"
          value={napMinutes ? formatMinutes(napMinutes) : '0m'}
          detail={napMinutes ? 'Counted toward total' : 'None today'}
          color={stagePalette.nap}
        />
        <SleepCard
          title="Efficiency"
          value={`${efficiency}%`}
          detail="Asleep vs in-bed"
          color={stagePalette.rem}
        />
        <SleepCard
          title="Readiness"
          value={sleepScore >= 80 ? 'Ready' : sleepScore >= 65 ? 'Moderate' : 'Low'}
          detail="Today's recovery state"
          color="#22c55e"
        />
      </div>

      {/* Hypnogram + summary */}
      <div className="layout-two">
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="section-label">Hypnogram</p>
              <h3 className="panel-title">Sleep stages across all sessions</h3>
              <p className="panel-subtitle">
                Includes overnight sleep and any naps in chronological order.
              </p>
            </div>
          </div>
          <Hypnogram day={today} compact />
        </article>

        <article className="summary-card">
          <p className="section-label">Summary</p>
          <h3 className="panel-title">How you slept</h3>
          <p className="summary-readiness">{today.readiness}</p>

          <div className="summary-improve">
            <span>Improve next</span>
            <p>{today.improvement}</p>
          </div>
        </article>
      </div>

      {/* Stage contribution */}
      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Key metrics</p>
            <h3 className="panel-title">Stage contribution</h3>
            <p className="panel-subtitle">Time spent in each stage today.</p>
          </div>
        </div>
        <div className="stage-list">
          {stageTotals.map((stage) => (
            <div key={stage.stage} className="stage-row">
              <div className="stage-title">
                <i style={{ background: stage.color }} />
                <span>{stage.label}</span>
              </div>
              <div className="stage-bar">
                <div style={{ width: `${stage.value}%`, background: stage.color }} />
              </div>
              <strong className="stage-amount">
                {formatMinutes(stage.minutes)}
                <small>{stage.value}%</small>
              </strong>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default Home
