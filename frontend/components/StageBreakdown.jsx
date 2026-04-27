import { stageConfig } from '../data/mockData'

// Donut chart for stage percentages
function DonutChart({ segments, size = 90 }) {
    const cx = size / 2
    const cy = size / 2
    const r  = size / 2 - 10
    const stroke = 10

    const total = segments.reduce((s, seg) => s + seg.minutes, 0)
    let cumAngle = -90 // start at top

    function polar(deg) {
        const rad = (deg * Math.PI) / 180
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
    }

    function arcPath(startDeg, endDeg) {
        const s  = polar(startDeg)
        const e  = polar(endDeg)
        const lg = endDeg - startDeg > 180 ? 1 : 0
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${lg} 1 ${e.x} ${e.y}`
    }

    const arcs = segments.map((seg) => {
        const sweep = (seg.minutes / total) * 360
        const path  = arcPath(cumAngle, cumAngle + sweep - 1.5)
        const result = { ...seg, path, sweep }
        cumAngle += sweep
        return result
    })

    const dominant = segments.reduce((a, b) => a.minutes > b.minutes ? a : b)

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ overflow: 'visible' }}>
                {/* Track */}
                <circle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth={stroke}
                />
                {arcs.map((arc, i) => (
                    <path
                        key={i}
                        d={arc.path}
                        fill="none"
                        stroke={arc.color}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                    />
                ))}
                {/* Center label */}
                <text
                    x={cx} y={cy - 4}
                    textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: 11, fontWeight: 700, fill: '#e8eaf0', fontFamily: 'Inter,sans-serif' }}
                >
                    {Math.round(dominant.minutes / 60)}h
                </text>
                <text
                    x={cx} y={cy + 10}
                    textAnchor="middle"
                    style={{ fontSize: 7, fill: dominant.color, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}
                >
                    {dominant.label}
                </text>
            </svg>
        </div>
    )
}

function formatMins(m) {
    if (m < 60) return `${m}m`
    const h = Math.floor(m / 60)
    const r = m % 60
    return r === 0 ? `${h}h` : `${h}h ${r}m`
}

export default function StageBreakdown({ stageMinutes }) {
    const segments = Object.entries(stageConfig)
        .filter(([key]) => stageMinutes[stageConfig[key].label.toLowerCase()] > 0)
        .map(([key, cfg]) => ({
            key,
            label:   cfg.label,
            color:   cfg.color,
            minutes: stageMinutes[cfg.label.toLowerCase()] || 0,
        }))
        .filter((s) => s.minutes > 0)

    const total = segments.reduce((sum, s) => sum + s.minutes, 0)

    // Recommended ranges
    const recommended = {
        wake:  { min: 0,  max: 10,  label: '< 10%' },
        light: { min: 10, max: 20,  label: '10–20%' },
        core:  { min: 25, max: 35,  label: '25–35%' },
        deep:  { min: 13, max: 23,  label: '13–23%' },
        rem:   { min: 20, max: 25,  label: '20–25%' },
    }

    return (
        <div style={styles.wrap}>
            <DonutChart segments={segments} size={96} />

            <div style={styles.list}>
                {segments.map((seg) => {
                    const pct = Math.round((seg.minutes / total) * 100)
                    const rec = recommended[seg.label.toLowerCase()]
                    const inRange = rec ? pct >= rec.min && pct <= rec.max : true
                    return (
                        <div key={seg.key} style={styles.row}>
                            <div style={{ ...styles.dot, background: seg.color }} />
                            <div style={styles.info}>
                                <div style={styles.topRow}>
                                    <span style={styles.stageName}>{seg.label}</span>
                                    <span style={styles.pct}>{pct}%</span>
                                    <span style={{ ...styles.dur, color: seg.color }}>{formatMins(seg.minutes)}</span>
                                </div>
                                <div style={styles.trackWrap}>
                                    <div style={styles.track}>
                                        <div
                                            style={{
                                                ...styles.fill,
                                                width: `${pct}%`,
                                                background: seg.color,
                                                boxShadow: `0 0 6px ${seg.color}50`,
                                            }}
                                        />
                                    </div>
                                    {rec && (
                                        <span style={{ ...styles.rec, color: inRange ? '#4ade80' : '#fbbf24' }}>
                      {inRange ? '✓' : '○'} Goal {rec.label}
                    </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const styles = {
    wrap: {
        display: 'flex',
        gap: 16,
        alignItems: 'center',
    },
    list: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    row: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        marginTop: 5,
        flexShrink: 0,
    },
    info: { flex: 1 },
    topRow: {
        display: 'flex',
        gap: 6,
        alignItems: 'baseline',
        marginBottom: 3,
    },
    stageName: {
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'var(--text)',
        flex: 1,
    },
    pct: {
        fontSize: '0.72rem',
        fontWeight: 700,
        color: 'var(--text-2)',
    },
    dur: {
        fontSize: '0.68rem',
        fontWeight: 600,
    },
    trackWrap: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    },
    track: {
        flex: 1,
        height: 4,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 999,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 999,
        transition: 'width 0.8s ease',
    },
    rec: {
        fontSize: '0.6rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
    },
}
