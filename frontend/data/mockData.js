// ─── Tonight's sleep session ──────────────────────────────────────────────────
// Stages: 0 = Wake, 1 = Light, 2 = Core, 3 = Deep, 4 = REM
// start = minutes after bedtime (10:45 PM)
export const tonightSleep = {
  date: '2026-04-27',
  bedtime: '10:45 PM',
  wakeTime: '6:32 AM',
  totalMinutes: 467,
  score: 84,
  efficiency: 91, // %
  stages: [
    { start: 0,   duration: 8,  stage: 1 }, // Light
    { start: 8,   duration: 22, stage: 2 }, // Core
    { start: 30,  duration: 38, stage: 3 }, // Deep
    { start: 68,  duration: 18, stage: 2 }, // Core
    { start: 86,  duration: 22, stage: 4 }, // REM
    { start: 108, duration: 12, stage: 2 }, // Core
    { start: 120, duration: 6,  stage: 0 }, // Wake
    { start: 126, duration: 28, stage: 2 }, // Core
    { start: 154, duration: 30, stage: 3 }, // Deep
    { start: 184, duration: 14, stage: 2 }, // Core
    { start: 198, duration: 35, stage: 4 }, // REM
    { start: 233, duration: 10, stage: 1 }, // Light
    { start: 243, duration: 22, stage: 2 }, // Core
    { start: 265, duration: 18, stage: 3 }, // Deep
    { start: 283, duration: 38, stage: 4 }, // REM
    { start: 321, duration: 16, stage: 2 }, // Core
    { start: 337, duration: 42, stage: 4 }, // REM
    { start: 379, duration: 18, stage: 1 }, // Light
    { start: 397, duration: 20, stage: 2 }, // Core
    { start: 417, duration: 5,  stage: 0 }, // Wake
    { start: 422, duration: 25, stage: 1 }, // Light
    { start: 447, duration: 20, stage: 0 }, // Wake (final wakeup)
  ],
  stageMinutes: {
    wake:  31,
    light: 51,
    core: 132,
    deep:  86,
    rem:  137,
  },
}

// ─── Today's naps ──────────────────────────────────────────────────────────────
export const todayNaps = [
  {
    id: 'nap-1',
    label: 'Afternoon Nap',
    startTime: '1:15 PM',
    endTime: '1:47 PM',
    durationMinutes: 32,
    stages: [
      { start: 0,  duration: 5,  stage: 1 },
      { start: 5,  duration: 18, stage: 2 },
      { start: 23, duration: 9,  stage: 0 },
    ],
    quality: 'good', // good | light | deep
    note: 'Post-lunch recharge',
  },
]

// ─── Weekly history ────────────────────────────────────────────────────────────
export const weekHistory = [
  { date: 'Apr 21', dayLabel: 'Mon', score: 76, totalMin: 422, napsMin: 0,  deep: 68,  rem: 112 },
  { date: 'Apr 22', dayLabel: 'Tue', score: 81, totalMin: 448, napsMin: 0,  deep: 80,  rem: 125 },
  { date: 'Apr 23', dayLabel: 'Wed', score: 70, totalMin: 390, napsMin: 25, deep: 55,  rem: 98  },
  { date: 'Apr 24', dayLabel: 'Thu', score: 88, totalMin: 475, napsMin: 0,  deep: 98,  rem: 148 },
  { date: 'Apr 25', dayLabel: 'Fri', score: 65, totalMin: 355, napsMin: 40, deep: 42,  rem: 88  },
  { date: 'Apr 26', dayLabel: 'Sat', score: 79, totalMin: 510, napsMin: 0,  deep: 88,  rem: 130 },
  { date: 'Apr 27', dayLabel: 'Sun', score: 84, totalMin: 467, napsMin: 32, deep: 86,  rem: 137 },
]

// ─── Stage metadata ────────────────────────────────────────────────────────────
export const stageConfig = {
  0: { label: 'Wake',  color: '#ff6b6b', shortColor: '#ff4444' },
  1: { label: 'Light', color: '#ffd166', shortColor: '#ffb703' },
  2: { label: 'Core',  color: '#4cc9f0', shortColor: '#0095b6' },
  3: { label: 'Deep',  color: '#4361ee', shortColor: '#3a0ca3' },
  4: { label: 'REM',   color: '#9b5de5', shortColor: '#7209b7' },
}

// ─── AI suggestions ────────────────────────────────────────────────────────────
export const aiSuggestions = [
  {
    id: 1,
    icon: '🌙',
    category: 'Consistency',
    title: 'Shift bedtime 15 min earlier',
    body: 'Your sleep onset averages 11:02 PM. Moving to 10:45 PM consistently could add ~18 min of deep sleep per night based on your cycle patterns.',
    impact: 'high',
    tag: 'Bedtime',
  },
  {
    id: 2,
    icon: '☀️',
    category: 'Recovery',
    title: 'Your nap timing is optimal',
    body: 'A 32-min nap at 1:15 PM sits perfectly in your circadian dip. Keep it under 35 min to avoid grogginess and stay in Stage 2 (core) sleep.',
    impact: 'medium',
    tag: 'Naps',
  },
  {
    id: 3,
    icon: '📵',
    category: 'Sleep Hygiene',
    title: 'Reduce screen exposure 1h before bed',
    body: 'Blue light suppresses melatonin by up to 50%. Try enabling night mode or switching to a book at 9:45 PM — your data shows longer sleep latency on screen-heavy evenings.',
    impact: 'high',
    tag: 'Hygiene',
  },
  {
    id: 4,
    icon: '🏃',
    category: 'Exercise',
    title: 'Morning workouts deepen your sleep',
    body: 'On days with logged morning activity, your deep sleep averages 94 min vs. 71 min on inactive days. Even a 20-min walk helps.',
    impact: 'medium',
    tag: 'Activity',
  },
  {
    id: 5,
    icon: '🌡️',
    category: 'Environment',
    title: 'Cool your room to 65–68 °F',
    body: 'Core body temperature drops ~2 °F during deep sleep. A cooler room (18–20 °C) accelerates this drop and can extend deep sleep by 10–15%.',
    impact: 'medium',
    tag: 'Environment',
  },
]

// ─── Sleep education cards ─────────────────────────────────────────────────────
export const sleepFacts = [
  {
    id: 1,
    title: 'Why Deep Sleep Matters',
    body: 'Deep (N3) sleep is when your brain flushes waste via the glymphatic system and your body releases growth hormone. Adults need 13–23% of total sleep as deep.',
    icon: '🧠',
    color: '#4361ee',
  },
  {
    id: 2,
    title: 'REM & Memory',
    body: 'REM sleep consolidates emotional memories and fuels creativity. It dominates in the final 2 hours of sleep — cutting sleep short hits REM hardest.',
    icon: '💭',
    color: '#9b5de5',
  },
  {
    id: 3,
    title: 'Naps & Recovery',
    body: 'A 20–30 min nap between noon and 3 PM reduces cortisol, boosts alertness by 34%, and doesn\'t significantly affect nighttime sleep quality.',
    icon: '😴',
    color: '#4cc9f0',
  },
  {
    id: 4,
    title: 'Sleep Debt is Real',
    body: 'Missing 2 hours nightly for 5 days equals one full night of no sleep. Naps can partially repay debt but full recovery nights are irreplaceable.',
    icon: '📉',
    color: '#ff6b6b',
  },
]
