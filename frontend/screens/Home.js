import Hypnogram from '../components/Hypnogram'
import NapBadge from '../components/NapBadge'
import ScoreRing from '../components/ScoreRing'
import SleepCard from '../components/SleepCard'
import {
  formatClock,
  formatMinutes,
  getNapMinutes,
  getSleepScore,
  getTotalSleepMinutes,
} from '../utils/sleepUtils'

function Home({ today, stageTotals }) {
  const totalSleep = getTotalSleepMinutes(today)
  const sleepScore = getSleepScore(today)
  const napMinutes = getNapMinutes(today)
  const awakeMinutes = stageTotals.find((stage) => stage.stage === 'awake')?.minutes ?? 0
  const remMinutes = stageTotals.find((stage) => stage.stage === 'rem')?.minutes ?? 0
  const deepMinutes = stageTotals.find((stage) => stage.stage === 'deep')?.minutes ?? 0

  return (
    <section className="screen screen-home">
      <div className="hero-panel">
        <div className="hero-copy">
          <p className="section-label">Today overview</p>
          <h2>{formatMinutes(totalSleep)} total sleep with naps included.</h2>
          <p className="section-copy">
            Main sleep ran from {formatClock(today.bedtime)} to {formatClock(today.wakeTime)}.
            Your recovery stayed steady and the daytime nap meaningfully supported total rest.
          </p>
          <NapBadge minutes={napMinutes} />
        </div>
        <ScoreRing score={sleepScore} label="Sleep score" />
      </div>

      <div className="metrics-grid">
        <SleepCard title="Deep sleep" value={formatMinutes(deepMinutes)} detail="Restoration and physical recovery" />
        <SleepCard title="REM sleep" value={formatMinutes(remMinutes)} detail="Memory, mood, and learning support" />
        <SleepCard title="Awake time" value={formatMinutes(awakeMinutes)} detail="Short interruptions kept quality intact" tone="warning" />
        <SleepCard title="Readiness" value="Ready" detail="Good baseline for focus and training today" tone="success" />
      </div>

      <div className="layout-two">
        <article className="panel panel-elevated">
          <div className="panel-head">
            <div>
              <p className="section-label">Quick hypnogram</p>
              <h3>Sleep stages across all sessions</h3>
            </div>
          </div>
          <Hypnogram day={today} compact />
        </article>

        <article className="panel panel-summary">
          <p className="section-label">Today summary</p>
          <h3>Recovery is solid, with one clear improvement area.</h3>
          <p>{today.readiness}</p>
          <div className="summary-callout">
            <span>Improvement</span>
            <strong>{today.improvement}</strong>
          </div>
        </article>
      </div>

      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Key metrics</p>
            <h3>Stage contribution to total recovery</h3>
          </div>
        </div>
        <div className="stage-list">
          {stageTotals.map((stage) => (
            <div key={stage.stage} className="stage-row">
              <div className="stage-title">
                <i style={{ backgroundColor: stage.color }} />
                <span>{stage.label}</span>
              </div>
              <div className="stage-bar">
                <div style={{ width: `${stage.value}%`, backgroundColor: stage.color }} />
              </div>
              <strong>{formatMinutes(stage.minutes)}</strong>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default Home
