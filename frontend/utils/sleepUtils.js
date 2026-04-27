const stageOrder = ['awake', 'light', 'deep', 'rem']

const stageLevels = {
  awake: 0,
  rem: 1,
  light: 2,
  deep: 3,
}

export const stagePalette = {
  awake: '#f29b6c',
  light: '#8aa4ff',
  deep: '#26408b',
  rem: '#5ec6b3',
  nap: '#d8deec',
}

export function getTodayData(days) {
  return days[0]
}

export function getMinutesByStage(day) {
  return day.sessions.reduce(
    (totals, session) => {
      session.stages.forEach(({ stage, minutes }) => {
        totals[stage] += minutes
      })
      return totals
    },
    { awake: 0, light: 0, deep: 0, rem: 0 },
  )
}

export function getTotalSleepMinutes(day) {
  const stages = getMinutesByStage(day)
  return stages.light + stages.deep + stages.rem
}

export function getNapMinutes(day) {
  return day.sessions
    .filter((session) => session.type === 'nap')
    .reduce(
      (total, session) =>
        total +
        session.stages.reduce((sum, stage) => {
          if (stage.stage === 'awake') {
            return sum
          }
          return sum + stage.minutes
        }, 0),
      0,
    )
}

export function getMainSleepMinutes(day) {
  return day.sessions
    .filter((session) => session.type === 'main')
    .reduce(
      (total, session) =>
        total +
        session.stages.reduce((sum, stage) => {
          if (stage.stage === 'awake') {
            return sum
          }
          return sum + stage.minutes
        }, 0),
      0,
    )
}

export function getSleepScore(day) {
  const stages = getMinutesByStage(day)
  const totalSleep = stages.light + stages.deep + stages.rem
  const qualityRatio = (stages.deep + stages.rem) / Math.max(totalSleep, 1)
  const durationScore = Math.min(totalSleep / 480, 1) * 55
  const qualityScore = Math.min(qualityRatio / 0.46, 1) * 30
  const interruptionPenalty = Math.min(stages.awake / 28, 1) * 15
  return Math.max(45, Math.round(durationScore + qualityScore - interruptionPenalty))
}

export function getStageMinutesForDay(day) {
  const totals = getMinutesByStage(day)
  const total = Object.values(totals).reduce((sum, minutes) => sum + minutes, 0)

  return stageOrder.map((stage) => ({
    stage,
    label: stage === 'light' ? 'Core' : stage.charAt(0).toUpperCase() + stage.slice(1),
    minutes: totals[stage],
    value: total ? Math.round((totals[stage] / total) * 100) : 0,
    color: stagePalette[stage],
  }))
}

export function formatMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`
}

export function formatClock(time) {
  const [hourText, minute] = time.split(':')
  const hour = Number(hourText)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const normalized = hour % 12 || 12
  return `${normalized}:${minute} ${suffix}`
}

export function formatDateLabel(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function getWeeklyOverview(days) {
  const week = days.slice(0, 7)
  const totalSleep = week.reduce((sum, day) => sum + getTotalSleepMinutes(day), 0)
  const totalNaps = week.reduce((sum, day) => sum + getNapMinutes(day), 0)

  return {
    averageSleep: Math.round(totalSleep / week.length),
    averageScore: Math.round(
      week.reduce((sum, day) => sum + getSleepScore(day), 0) / week.length,
    ),
    totalNaps,
    consistency:
      Math.max(...week.map((day) => Number(day.bedtime.split(':')[0]))) -
      Math.min(...week.map((day) => Number(day.bedtime.split(':')[0]))),
  }
}

export function getAverageScore(days) {
  return Math.round(
    days.slice(0, 7).reduce((sum, day) => sum + getSleepScore(day), 0) / 7,
  )
}

export function getHistorySeries(days) {
  return days
    .slice(0, 7)
    .map((day) => {
      const totalSleep = getTotalSleepMinutes(day)
      const napMinutes = getNapMinutes(day)
      return {
        date: day.date,
        label: formatDateLabel(day.date).split(',')[0],
        totalSleep,
        mainSleep: getMainSleepMinutes(day),
        napMinutes,
        score: getSleepScore(day),
        bedtime: day.bedtime,
        wakeTime: day.wakeTime,
      }
    })
    .reverse()
}

export function flattenStages(day) {
  return day.sessions.flatMap((session) =>
    session.stages.map((segment, index) => ({
      ...segment,
      sessionType: session.type,
      sessionLabel: session.label,
      id: `${session.id}-${index}`,
    })),
  )
}

export function getHypnogramPath(day) {
  const segments = flattenStages(day)
  const totalMinutes = segments.reduce((sum, segment) => sum + segment.minutes, 0)
  let cursor = 0

  const points = segments.flatMap((segment, index) => {
    const startX = (cursor / totalMinutes) * 100
    const y = stageLevels[segment.stage]
    cursor += segment.minutes
    const endX = (cursor / totalMinutes) * 100

    if (index === 0) {
      return [`${startX},${y}`, `${endX},${y}`]
    }

    return [`${startX},${y}`, `${endX},${y}`]
  })

  return points.join(' ')
}

export function getBiometricTrend(day, key) {
  return day[key].map((value, index, series) => ({
    x: (index / (series.length - 1)) * 100,
    y: value,
  }))
}
