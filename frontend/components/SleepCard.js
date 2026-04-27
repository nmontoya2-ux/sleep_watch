function SleepCard({ title, value, detail, tone = 'default' }) {
  return (
    <article className={`sleep-card sleep-card-${tone}`}>
      <p>{title}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  )
}

export default SleepCard
