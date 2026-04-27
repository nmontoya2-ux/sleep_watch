import { flattenStages, stagePalette } from '../utils/sleepUtils'

const stageRows = [
  { key: 'awake', label: 'Wake', y: 0 },
  { key: 'rem', label: 'REM', y: 1 },
  { key: 'light', label: 'Core', y: 2 },
  { key: 'deep', label: 'Deep', y: 3 },
]

function Hypnogram({ day, compact = false }) {
  const segments = flattenStages(day)
  const totalMinutes = segments.reduce((sum, segment) => sum + segment.minutes, 0)
  let cursor = 0

  return (
    <div className={compact ? 'hypnogram hypnogram-compact' : 'hypnogram'}>
      <div className="hypnogram-legend">
        {stageRows.map((row) => (
          <span key={row.key}>
            <i style={{ backgroundColor: stagePalette[row.key] }} />
            {row.label}
          </span>
        ))}
      </div>

      <svg viewBox="0 0 100 48" preserveAspectRatio="none" role="img" aria-label="Sleep stages over time">
        {stageRows.map((row) => (
          <line key={row.key} x1="0" y1={6 + row.y * 12} x2="100" y2={6 + row.y * 12} />
        ))}

        {segments.map((segment) => {
          const x = (cursor / totalMinutes) * 100
          const width = (segment.minutes / totalMinutes) * 100
          cursor += segment.minutes
          const row = stageRows.find((item) => item.key === segment.stage)
          return (
            <rect
              key={segment.id}
              x={x}
              y={2 + row.y * 12}
              width={Math.max(width, 0.8)}
              height="8"
              rx="3"
              fill={stagePalette[segment.stage]}
              opacity={segment.sessionType === 'nap' ? 0.72 : 1}
            />
          )
        })}
      </svg>
    </div>
  )
}

export default Hypnogram
