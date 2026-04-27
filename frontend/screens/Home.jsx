import SleepScore  from '../components/SleepScore'
import Hypnogram   from '../components/Hypnogram'
import NapTracker  from '../components/NapTracker'
import AIInsights  from '../components/AIInsights'
import { tonightSleep, todayNaps } from '../data/mockData'

function formatDur(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}h ${m}m`
}

// Total sleep = night + naps
const totalNapMin  = todayNaps.reduce((s, n) => s + n.durationMinutes, 0)
const totalSleepMin = tonightSleep.totalMinutes + totalNapMin

export default function Home() {
  return (
      <div style={styles.page}>

        {/* ── Header ──────────────────────────────────────────── */}
        <div style={styles.header} className="fade-up">
          <div>
            <p style={styles.greeting}>Good morning, Nat 👋</p>
            <p style={styles.date}>Monday, Apr 27</p>
          </div>
          <div style={styles.avatar}>N</div>
        </div>

        {/* ── Hero card: Score + times ─────────────────────────── */}
        <div style={styles.heroCard} className="fade-up-1">
          <div style={styles.heroTop}>
            <SleepScore score={tonightSleep.score} size={130} />
            <div style={styles.heroRight}>
              <p className="label" style={{ marginBottom: 8 }}>Last night</p>
              <div style={styles.timeRow}>
                <div style={styles.timePiece}>
                  <p style={styles.timeVal}>{tonightSleep.bedtime}</p>
                  <p style={styles.timeLbl}>Bedtime</p>
                </div>
                <div style={styles.timeSep}>
                  <svg width="24" height="2" viewBox="0 0 24 2">
                    <line x1="0" y1="1" x2="24" y2="1" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3 2" />
                  </svg>
                </div>
                <div style={styles.timePiece}>
                  <p style={styles.timeVal}>{tonightSleep.wakeTime}</p>
                  <p style={styles.timeLbl}>Wake</p>
                </div>
              </div>

              <div style={styles.durationRow}>
                <div style={styles.durBlock}>
                  <p style={styles.durVal}>{formatDur(tonightSleep.totalMinutes)}</p>
                  <p style={styles.durLbl}>Night sleep</p>
                </div>
                {totalNapMin > 0 && (
                    <div style={styles.durBlock}>
                      <p style={{ ...styles.durVal, color: 'var(--core)' }}>
                        +{formatDur(totalNapMin)}
                      </p>
                      <p style={styles.durLbl}>Naps</p>
                    </div>
                )}
              </div>

              {/* Total daily bar */}
              <div style={styles.totalRow}>
                <p style={styles.totalLbl}>Daily total</p>
                <p style={styles.totalVal}>{formatDur(totalSleepMin)}</p>
              </div>
              <div style={styles.totalTrack}>
                <div style={{ ...styles.nightFill, width: `${(tonightSleep.totalMinutes / 480) * 100}%` }} />
                {totalNapMin > 0 && (
                    <div style={{ ...styles.napFill, width: `${(totalNapMin / 480) * 100}%` }} />
                )}
              </div>
              <p style={styles.goalHint}>Goal 8h</p>
            </div>
          </div>
        </div>

        {/* ── Quick stats ──────────────────────────────────────── */}
        <div className="stat-row fade-up-2" style={{ padding: '0 16px', marginBottom: 16 }}>
          {[
            { val: `${tonightSleep.efficiency}%`,  lbl: 'Efficiency' },
            { val: `${formatDur(tonightSleep.stageMinutes.deep)}`, lbl: 'Deep', color: 'var(--deep)' },
            { val: `${formatDur(tonightSleep.stageMinutes.rem)}`,  lbl: 'REM',  color: 'var(--rem)'  },
            { val: `${formatDur(tonightSleep.stageMinutes.core)}`, lbl: 'Core', color: 'var(--core)' },
          ].map(({ val, lbl, color }) => (
              <div key={lbl} className="stat-tile">
                <p className="stat-val" style={color ? { color } : {}}>{val}</p>
                <p className="stat-lbl">{lbl}</p>
              </div>
          ))}
        </div>

        {/* ── Hypnogram ────────────────────────────────────────── */}
        <div style={styles.section} className="fade-up-3">
          <div className="section-header">
            <h3>Sleep Stages</h3>
            <span className="label">Hover to inspect</span>
          </div>
          <div className="card" style={{ padding: '16px 12px 12px' }}>
            <Hypnogram stages={tonightSleep.stages} totalMinutes={tonightSleep.totalMinutes} />
          </div>
        </div>

        {/* ── Nap tracker ──────────────────────────────────────── */}
        <div style={styles.section} className="fade-up-4">
          <div className="section-header">
            <h3>Naps · Today</h3>
            {todayNaps.length > 0 && (
                <span style={styles.napBadge}>+{formatDur(totalNapMin)} recovery</span>
            )}
          </div>
          <NapTracker naps={todayNaps} />
        </div>

        {/* ── AI tip ───────────────────────────────────────────── */}
        <div style={styles.section} className="fade-up-5">
          <div className="section-header">
            <h3>AI Suggestions</h3>
          </div>
          <AIInsights limit={2} />
        </div>

      </div>
  )
}

const styles = {
  page: {
    padding: '20px 16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.01em',
  },
  date: {
    fontSize: '0.78rem',
    color: 'var(--text-3)',
    marginTop: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c6ff7, #9b5de5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#fff',
    boxShadow: '0 0 16px rgba(124,111,247,0.4)',
  },
  heroCard: {
    background: 'linear-gradient(135deg, #1a1d2a 0%, #1f2233 100%)',
    border: '1px solid rgba(124,111,247,0.15)',
    borderRadius: 20,
    padding: '18px',
    marginBottom: 14,
    boxShadow: '0 4px 32px rgba(124,111,247,0.1)',
  },
  heroTop: {
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
  },
  heroRight: { flex: 1, paddingTop: 4 },
  timeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  timePiece: {},
  timeSep: { flex: 1, display: 'flex', justifyContent: 'center', opacity: 0.5 },
  timeVal: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
  },
  timeLbl: {
    fontSize: '0.62rem',
    color: 'var(--text-3)',
    marginTop: 1,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 600,
  },
  durationRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 10,
  },
  durBlock: {},
  durVal: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
    lineHeight: 1,
  },
  durLbl: {
    fontSize: '0.62rem',
    color: 'var(--text-3)',
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 600,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  totalLbl: {
    fontSize: '0.65rem',
    color: 'var(--text-3)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  totalVal: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-2)',
  },
  totalTrack: {
    height: 5,
    borderRadius: 999,
    background: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    display: 'flex',
    maxWidth: '100%',
  },
  nightFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #7c6ff7, #9b5de5)',
    borderRadius: '999px 0 0 999px',
    flexShrink: 0,
  },
  napFill: {
    height: '100%',
    background: 'var(--core)',
    opacity: 0.7,
    flexShrink: 0,
  },
  goalHint: {
    fontSize: '0.6rem',
    color: 'var(--text-3)',
    marginTop: 3,
    textAlign: 'right',
  },
  section: {
    marginBottom: 20,
  },
  napBadge: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--core)',
    background: 'rgba(76,201,240,0.1)',
    padding: '2px 8px',
    borderRadius: 999,
    border: '1px solid rgba(76,201,240,0.2)',
  },
}
