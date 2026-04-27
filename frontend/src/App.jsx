import { useMemo, useState } from 'react'
import './App.css'
import { sleepDays } from '../data/mockSleepData'
import Home from '../screens/Home'
import History from '../screens/History'
import Insights from '../screens/Insights'
import {
  getAverageScore,
  getHistorySeries,
  getStageMinutesForDay,
  getTodayData,
  getWeeklyOverview,
} from '../utils/sleepUtils'

const tabs = [
  { id: 'today', label: 'Today' },
  { id: 'history', label: 'History' },
  { id: 'insights', label: 'Insights' },
]

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
        <div>
          <p className="eyebrow">Sleep Watch</p>
          <h1>Understand how you slept and what to improve next.</h1>
        </div>
        <div className="topbar-summary">
          <span>7 day average score</span>
          <strong>{averageScore}</strong>
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

      <main className="screen-frame">
        {activeTab === 'today' && <Home {...screenProps} />}
        {activeTab === 'history' && <History {...screenProps} />}
        {activeTab === 'insights' && <Insights {...screenProps} />}
      </main>
    </div>
  )
}

export default App
