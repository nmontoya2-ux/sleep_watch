const tabs = [
    {
        id: 'home',
        label: 'Sleep',
        icon: (active) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                    d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                    stroke={active ? '#7c6ff7' : '#5c607a'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill={active ? 'rgba(124,111,247,0.15)' : 'none'}
                />
            </svg>
        ),
    },
    {
        id: 'insights',
        label: 'Insights',
        icon: (active) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                    d="M18 20V10M12 20V4M6 20v-6"
                    stroke={active ? '#7c6ff7' : '#5c607a'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        id: 'history',
        label: 'History',
        icon: (active) => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect
                    x="3" y="4" width="18" height="18" rx="3"
                    stroke={active ? '#7c6ff7' : '#5c607a'}
                    strokeWidth="1.8"
                    fill={active ? 'rgba(124,111,247,0.1)' : 'none'}
                />
                <path
                    d="M16 2v4M8 2v4M3 10h18"
                    stroke={active ? '#7c6ff7' : '#5c607a'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
    },
]

export default function NavBar({ active, onChange }) {
    return (
        <nav style={styles.nav}>
            <div style={styles.inner}>
                {tabs.map((tab) => {
                    const isActive = active === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            style={styles.tab}
                            aria-label={tab.label}
                        >
                            <div style={styles.iconWrap}>
                                {isActive && <div style={styles.activePill} />}
                                {tab.icon(isActive)}
                            </div>
                            <span
                                style={{
                                    ...styles.label,
                                    color: isActive ? '#9b8fff' : '#5c607a',
                                    fontWeight: isActive ? 600 : 400,
                                }}
                            >
                {tab.label}
              </span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}

const styles = {
    nav: {
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-h)',
        background: 'rgba(13, 15, 20, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        zIndex: 100,
        flexShrink: 0,
    },
    inner: {
        display: 'flex',
        height: '100%',
        alignItems: 'center',
    },
    tab: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px 0',
        transition: 'opacity 0.15s',
    },
    iconWrap: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 28,
    },
    activePill: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(124,111,247,0.12)',
        borderRadius: 8,
    },
    label: {
        fontSize: '0.65rem',
        letterSpacing: '0.04em',
        transition: 'color 0.15s',
    },
}
