function qualityFromScore(score) {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Optimal'
  if (score >= 70) return 'Good'
  if (score >= 60) return 'Fair'
  return 'Needs work'
}

function ScoreRing({ score, label = 'Sleep score' }) {
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference

  return (
    <>
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
          <span>/ 100</span>
        </div>
      </div>
      <p className="hero-score-label">{label}</p>
      <p className="hero-score-quality">{qualityFromScore(score)}</p>
    </>
  )
}

export default ScoreRing
