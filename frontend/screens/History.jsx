import NapBadge from '../components/NapBadge.jsx'
import SleepGraph from '../components/SleepGraph.jsx'
import { formatClock, formatMinutes } from '../utils/sleepUtils'

function History({ historySeries, weeklyOverview }) {
  return (
    <section className="screen">
      <div className="layout-two">
        <article className="panel panel-elevated">
          <p className="section-label">Weekly sleep</p>
          <h2>{formatMinutes(weeklyOverview.averageSleep)} average total sleep</h2>
          <p className="section-copy">
            Naps are counted alongside overnight sleep so your recovery picture stays complete.
          </p>
          <div className="metrics-inline">
            <div>
              <span>Average score</span>
              <strong>{weeklyOverview.averageScore}</strong>
            </div>
            <div>
              <span>Total naps</span>
              <strong>{formatMinutes(weeklyOverview.totalNaps)}</strong>
            </div>
            <div>
              <span>Bedtime drift</span>
              <strong>{weeklyOverview.consistency} hr</strong>
            </div>
          </div>
        </article>

        <article className="panel panel-summary">
          <p className="section-label">Why it matters</p>
          <h3>Consistency is good, but late nights still compress recovery.</h3>
          <p>
            Your weekly pattern is stable enough to build on. The easiest quality gain is extending
            main sleep on the shorter nights rather than relying on naps to fully offset the gap.
          </p>
          <NapBadge minutes={weeklyOverview.totalNaps} />
        </article>
      </div>

      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">History</p>
            <h3>Main sleep and naps by day</h3>
          </div>
        </div>
        <SleepGraph data={historySeries} />
      </article>

      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="section-label">Trend detail</p>
            <h3>Weekly timing and recovery snapshot</h3>
          </div>
        </div>
        <div className="history-table">
          {historySeries.map((day) => (
            <div key={day.date} className="history-table-row">
              <strong>{day.label}</strong>
              <span>{formatClock(day.bedtime)}</span>
              <span>{formatClock(day.wakeTime)}</span>
              <span>{formatMinutes(day.mainSleep)}</span>
              <span>{day.napMinutes ? `+ ${formatMinutes(day.napMinutes)} nap` : 'No nap'}</span>
              <span>Score {day.score}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default History
