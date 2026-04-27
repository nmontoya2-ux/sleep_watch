function SleepGraph({ data }) {
  const maxSleep = Math.max(...data.map((item) => item.totalSleep))

  return (
    <div className="sleep-graph">
      {data.map((item) => (
        <div key={item.date} className="sleep-graph-row">
          <div className="sleep-graph-meta">
            <strong>{item.label}</strong>
            <span>{item.score}</span>
          </div>
          <div className="sleep-graph-bar">
            <div
              className="sleep-graph-main"
              style={{ width: `${(item.mainSleep / maxSleep) * 100}%` }}
            />
            {item.napMinutes > 0 && (
              <div
                className="sleep-graph-nap"
                style={{ width: `${(item.napMinutes / maxSleep) * 100}%` }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SleepGraph
