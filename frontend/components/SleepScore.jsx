function formatDuration(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function SleepScore({ data }) {
  // Use a fixed scale (0–10h) so days are comparable
  const SCALE_MAX = 600 // 10h in minutes
  const ticks = [0, 2, 4, 6, 8, 10] // hours

  return (
    <div className="sleep-graph">
      <div className="sleep-graph-axis" aria-hidden="true">
        {ticks.map((t) => (
          <span key={t}>{t}h</span>
        ))}
      </div>

      {data.map((item) => {
        const mainPct = (Math.min(item.mainSleep, SCALE_MAX) / SCALE_MAX) * 100
        const napPct = (Math.min(item.napMinutes, SCALE_MAX) / SCALE_MAX) * 100
        return (
          <div key={item.date} className="sleep-graph-row">
            <div className="sleep-graph-day">
              <strong>{item.label}</strong>
              <span>{formatDuration(item.totalSleep)}</span>
            </div>
            <div className="sleep-graph-track">
              <div
                className="sleep-graph-bar sleep-graph-bar-main"
                style={{ left: 0, width: `${mainPct}%` }}
                title={`Main sleep: ${formatDuration(item.mainSleep)}`}
              />
              {item.napMinutes > 0 && (
                <div
                  className="sleep-graph-bar sleep-graph-bar-nap"
                  style={{
                    left: `calc(${mainPct}% + 2px)`,
                    width: `${napPct}%`,
                  }}
                  title={`Nap: ${formatDuration(item.napMinutes)}`}
                />
              )}
            </div>
            <div className="sleep-graph-score">{item.score}</div>
          </div>
        )
      })}
    </div>
  )
}

export default SleepScore
