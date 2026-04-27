import Hypnogram from '../components/Hypnogram.jsx'
import {
  formatMinutes,
  getBiometricTrend,
  getNapMinutes,
  stagePalette,
} from '../utils/sleepUtils'

function renderPolyline(points, min, max) {
  return points
    .map(({ x, y }) => {
      const normalizedY = max === min ? 50 : 100 - ((y - min) / (max - min)) * 100
      return `${x},${normalizedY}`
    })
    .join(' ')
}

function Insights({ today, stageTotals }) {
  const heartRateTrend = getBiometricTrend(today, 'heartRate')
  const breathingTrend = getBiometricTrend(today, 'breathingRate')
  const heartMin = Math.min(...today.heartRate)
  const heartMax = Math.max(...today.heartRate)
  const breathMin = Math.min(...today.breathingRate)
  const breathMax = Math.max(...today.breathingRate)
  const napMinutes = getNapMinutes(today)

  return (
    <section className="screen">
      <div className="layout-two">
        <article className="panel panel-elevated">
          <div className="panel-head">
            <div>
              <p className="section-label">Full hypnogram</p>
              <h2>One overnight session plus a short recovery nap</h2>
            </div>
          </div>
          <Hypnogram day={today} />
        </article>

        <article className="panel panel-summary">
          <p className="section-label">AI style tips</p>
          <h3>Protect the final third of the night.</h3>
          <p>
            Your strongest opportunity is preserving uninterrupted REM near morning. Earlier
            caffeine cutoff and a cooler sleep environment should help reduce wake bursts.
          </p>
          <div className="tips-list">
            <span>Keep naps under 30 minutes. Today&apos;s nap added {formatMinutes(napMinutes)}.</span>
            <span>Target another 20 to 30 minutes of main sleep on shorter nights.</span>
            <span>Use a lighter evening meal to support steadier breathing overnight.</span>
          </div>
        </article>
      </div>

      <div className="layout-two">
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="section-label">Stage breakdown</p>
              <h3>Distribution of the day&apos;s sleep</h3>
            </div>
          </div>
          <div className="breakdown-donut">
            <div className="donut-chart">
              <div
                className="donut-fill"
                style={{
                  background: `conic-gradient(
                    ${stagePalette.awake} 0% ${stageTotals[0].value}%,
                    ${stagePalette.light} ${stageTotals[0].value}% ${stageTotals[0].value + stageTotals[1].value}%,
                    ${stagePalette.deep} ${stageTotals[0].value + stageTotals[1].value}% ${stageTotals[0].value + stageTotals[1].value + stageTotals[2].value}%,
                    ${stagePalette.rem} ${stageTotals[0].value + stageTotals[1].value + stageTotals[2].value}% 100%
                  )`,
                }}
              />
              <div className="donut-center">
                <strong>{stageTotals[2].value + stageTotals[3].value}%</strong>
                <span>deep + REM</span>
              </div>
            </div>
            <div className="stage-list compact">
              {stageTotals.map((stage) => (
                <div key={stage.stage} className="stage-row">
                  <div className="stage-title">
                    <i style={{ backgroundColor: stage.color }} />
                    <span>{stage.label}</span>
                  </div>
                  <strong>{stage.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="section-label">Biometrics trends</p>
              <h3>Overnight heart and breathing patterns</h3>
            </div>
          </div>
          <div className="trend-stack">
            <div className="trend-chart">
              <span>Heart rate</span>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <polyline points={renderPolyline(heartRateTrend, heartMin, heartMax)} />
              </svg>
              <strong>{heartMin} to {heartMax} bpm</strong>
            </div>
            <div className="trend-chart trend-chart-breathing">
              <span>Breathing rate</span>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <polyline points={renderPolyline(breathingTrend, breathMin, breathMax)} />
              </svg>
              <strong>{breathMin} to {breathMax} brpm</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Insights
