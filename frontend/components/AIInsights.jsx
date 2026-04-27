import { useState } from 'react'
import { aiSuggestions } from '../data/mockData'

const impactStyles = {
    high:   { label: 'High impact',   dot: '#4ade80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.2)'  },
    medium: { label: 'Medium impact', dot: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)'  },
    low:    { label: 'Low impact',    dot: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
}

function InsightCard({ insight, delay = 0 }) {
    const [expanded, setExpanded] = useState(false)
    const imp = impactStyles[insight.impact] || impactStyles.medium

    return (
        <div
            style={{
                ...styles.card,
                border: `1px solid ${expanded ? 'rgba(124,111,247,0.3)' : 'var(--border)'}`,
                transition: 'border-color 0.2s, background 0.2s',
                background: expanded ? 'var(--card-hover)' : 'var(--card)',
            }}
            onClick={() => setExpanded((v) => !v)}
            className={`fade-up-${delay}`}
        >
            <div style={styles.header}>
                <span style={styles.iconBox}>{insight.icon}</span>
                <div style={styles.headerText}>
                    <div style={styles.meta}>
            <span style={{ ...styles.tag, background: imp.bg, color: imp.dot, border: `1px solid ${imp.border}` }}>
              <span style={{ ...styles.impDot, background: imp.dot }} />
                {imp.label}
            </span>
                        <span style={styles.category}>{insight.tag}</span>
                    </div>
                    <p style={styles.title}>{insight.title}</p>
                </div>
                <div style={{ ...styles.chevron, transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {expanded && (
                <p style={styles.body}>{insight.body}</p>
            )}
        </div>
    )
}

export default function AIInsights({ limit }) {
    const items = limit ? aiSuggestions.slice(0, limit) : aiSuggestions

    return (
        <div style={styles.wrap}>
            <div style={styles.aiHeader}>
                <div style={styles.aiPill}>
                    <span style={styles.aiDot} />
                    AI
                </div>
                <p style={styles.aiLabel}>Tap any insight to expand</p>
            </div>
            <div style={styles.list}>
                {items.map((insight, i) => (
                    <InsightCard key={insight.id} insight={insight} delay={Math.min(i + 1, 5)} />
                ))}
            </div>
        </div>
    )
}

const styles = {
    wrap: {},
    aiHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    aiPill: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: 'var(--accent-glow)',
        color: 'var(--accent-2)',
        border: '1px solid rgba(124,111,247,0.3)',
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
    },
    aiDot: {
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: '#9b8fff',
        boxShadow: '0 0 6px #9b8fff',
    },
    aiLabel: {
        fontSize: '0.72rem',
        color: 'var(--text-3)',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    card: {
        borderRadius: 12,
        padding: '13px',
        cursor: 'pointer',
        userSelect: 'none',
    },
    header: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
    },
    iconBox: {
        fontSize: '1.2rem',
        flexShrink: 0,
        lineHeight: 1,
        marginTop: 2,
    },
    headerText: { flex: 1 },
    meta: {
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        marginBottom: 4,
    },
    tag: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 7px',
        borderRadius: 999,
        fontSize: '0.62rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
    },
    impDot: {
        width: 5,
        height: 5,
        borderRadius: '50%',
        flexShrink: 0,
    },
    category: {
        fontSize: '0.65rem',
        color: 'var(--text-3)',
        fontWeight: 500,
    },
    title: {
        fontSize: '0.82rem',
        fontWeight: 600,
        color: 'var(--text)',
        lineHeight: 1.35,
    },
    chevron: {
        flexShrink: 0,
        transition: 'transform 0.2s',
        marginTop: 2,
    },
    body: {
        marginTop: 10,
        paddingTop: 10,
        borderTop: '1px solid var(--border)',
        fontSize: '0.78rem',
        color: 'var(--text-2)',
        lineHeight: 1.6,
    },
}
