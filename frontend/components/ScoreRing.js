function ScoreRing({ score, label }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (score / 100) * circumference

  return (
    <div className="score-ring">
      <svg viewBox="0 0 140 140" aria-hidden="true">
        <circle className="score-ring-track" cx="70" cy="70" r={radius} />
        <circle
          className="score-ring-progress"
          cx="70"
          cy="70"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="score-ring-copy">
        <strong>{score}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}

export default ScoreRing
