import { useMemo, useState } from 'react'
import './App.css'
import { sleepDays } from '../data/mockSleepData'
import Home from '../screens/Home.jsx'
import History from '../screens/History.jsx'
import Insights from '../screens/Insights.jsx'
import {
  getAverageScore,
  getHistorySeries,
  getStageMinutesForDay,
  getTodayData,
  getWeeklyOverview,
  formatMinutes,
} from '../utils/sleepUtils'

const tabs = [
  { id: 'today', label: 'Today' },
  { id: 'history', label: 'History' },
  { id: 'insights', label: 'Insights' },
]

function todayLabel(dateStr) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

function App() {
  const [activeTab, setActiveTab] = useState('today')

  const today = useMemo(() => getTodayData(sleepDays), [])
  const weeklyOverview = useMemo(() => getWeeklyOverview(sleepDays), [])
  const historySeries = useMemo(() => getHistorySeries(sleepDays), [])
  const averageScore = useMemo(() => getAverageScore(sleepDays), [])
  const stageTotals = useMemo(() => getStageMinutesForDay(today), [today])

  const screenProps = {
    today,
    weeklyOverview,
    historySeries,
    averageScore,
    stageTotals,
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">SW</div>
          <div className="brand-text">
            <strong>Sleep Watch</strong>
            <span>{todayLabel(today.date)}</span>
          </div>
        </div>
        <div className="topbar-meta">
          <span>7-day avg score <strong>{averageScore}</strong></span>
          <span className="topbar-meta-sep" />
          <span>Weekly avg <strong>{formatMinutes(weeklyOverview.averageSleep)}</strong></span>
        </div>
      </header>

      <nav className="tabbar" aria-label="Sleep views">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={tab.id === activeTab ? 'tab is-active' : 'tab'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {activeTab === 'today' && <Home {...screenProps} />}
        {activeTab === 'history' && <History {...screenProps} />}
        {activeTab === 'insights' && <Insights {...screenProps} />}
      </main>
    </div>
  )
}

export default App
