import { useState } from 'react'
import Home     from '../screens/Home'
import Insights from '../screens/Insights'
import History  from './screens/History'
import NavBar   from './components/NavBar'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  const screens = {
    home:     <Home />,
    insights: <Insights />,
    history:  <History />,
  }

  return (
      <div className="app-shell">
        <div className="screen">
          {screens[activeTab]}
        </div>
        <NavBar active={activeTab} onChange={setActiveTab} />
      </div>
  )
}
