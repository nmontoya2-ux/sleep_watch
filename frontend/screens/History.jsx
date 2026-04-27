import SleepScore from '../components/SleepScore.jsx'
import { formatClock, formatMinutes } from '../utils/sleepUtils'

function History({ historySeries, weeklyOverview }) {
  return (
    <section className="screen">
      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Weekly sleep</p>
            <h2 className="panel-title" style={{ fontSize: '1.6rem', letterSpacing: '-0.02em' }}>
              {formatMinutes(weeklyOverview.averageSleep)} average per night
            </h2>
            <p className="panel-subtitle">
              Naps are included in the total so your recovery picture stays complete.
            </p>
          </div>
        </div>

        <div className="history-summary">
          <div className="history-summary-cell">
            <span>Average score</span>
            <strong>{weeklyOverview.averageScore}</strong>
          </div>
          <div className="history-summary-cell">
            <span>Total nap time</span>
            <strong>{formatMinutes(weeklyOverview.totalNaps)}</strong>
          </div>
          <div className="history-summary-cell">
            <span>Bedtime drift</span>
            <strong>{weeklyOverview.consistency} hr</strong>
          </div>
        </div>
      </article>

      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">7-day overview</p>
            <h3 className="panel-title">Main sleep and naps by day</h3>
            <p className="panel-subtitle">
              Solid bar = main sleep, soft bar = naps. Score shown on the right.
            </p>
          </div>
          <div className="hypnogram-legend" style={{ alignSelf: 'center' }}>
            <span className="hypnogram-legend-item">
              <i style={{ background: 'var(--stage-deep)' }} />
              Main
            </span>
            <span className="hypnogram-legend-item">
              <i style={{ background: 'var(--stage-nap)' }} />
              Nap
            </span>
          </div>
        </div>
        <SleepScore data={historySeries} />
      </article>

      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Trend detail</p>
            <h3 className="panel-title">Timing and recovery snapshot</h3>
            <p className="panel-subtitle">Bedtime, wake time, total sleep, naps, and daily score.</p>
          </div>
        </div>

        <div className="history-table">
          {historySeries.map((day) => (
            <div key={day.date} className="history-table-row">
              <strong>{day.label}</strong>
              <span>{formatClock(day.bedtime)}</span>
              <span>{formatClock(day.wakeTime)}</span>
              <span>{formatMinutes(day.mainSleep)}</span>
              <span className={day.napMinutes ? 'pill' : 'pill pill-empty'}>
                {day.napMinutes ? `+ ${formatMinutes(day.napMinutes)}` : 'No nap'}
              </span>
              <span className="score-pill">{day.score}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default History
