function SleepCard({ title, value, detail, color }) {
  return (
    <article className="metric-card">
      <p className="metric-card-label">
        {color && <i style={{ background: color }} />}
        {title}
      </p>
      <div className="metric-card-value">{value}</div>
      {detail && <div className="metric-card-detail">{detail}</div>}
    </article>
  )
}

export default SleepCard
