'use client'

import type { BeginnerTrap } from '@/lib/types'

import FadeUp from '@/components/animations/FadeUp'
import ScaleOnHover from '@/components/animations/ScaleOnHover'

interface DangerTabProps {
  beginnerTraps: BeginnerTrap[]
}

export default function DangerTab({ beginnerTraps }: DangerTabProps) {
  return (
    <div style={styles.wrapper}>
      <FadeUp delay={0}>
        <div style={styles.banner}>
          <i className="ti ti-alert-triangle" style={styles.bannerIcon} aria-hidden />
          <div>
            <p style={styles.bannerTitle}>Pitfall Radar</p>
            <p style={styles.bannerSub}>{beginnerTraps.length} common mistakes to avoid on this project.</p>
          </div>
        </div>
      </FadeUp>

      <ol style={styles.list}>
        {beginnerTraps.map((trap, idx) => (
          <FadeUp key={idx} delay={idx * 0.1}>
            <ScaleOnHover scale={1.01}>
              <li style={styles.trapCard}>
                <div style={styles.numBadge} aria-hidden>{idx + 1}</div>
                <div style={styles.trapBody}>
                  <h2 style={styles.trapTitle}>
                    <i className="ti ti-flame" style={styles.flameIcon} aria-hidden />
                    {trap.trap}
                  </h2>
                  <div style={styles.section}>
                    <span style={styles.sectionLabel}><i className="ti ti-question-mark" aria-hidden /> Why it happens</span>
                    <p style={styles.sectionText}>{trap.why}</p>
                  </div>
                  <div style={{ ...styles.section, ...styles.fixSection }}>
                    <span style={{ ...styles.sectionLabel, color: 'var(--color-accent-success)' }}>
                      <i className="ti ti-bulb" aria-hidden /> How to fix it
                    </span>
                    <p style={styles.sectionText}>{trap.fix}</p>
                  </div>
                </div>
              </li>
            </ScaleOnHover>
          </FadeUp>
        ))}
      </ol>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper:     { display: 'flex', flexDirection: 'column', gap: '16px' },
  banner:      { backgroundColor: 'var(--color-bg-danger)', border: '1px solid var(--color-border-danger)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' },
  bannerIcon:  { fontSize: 28, color: 'var(--color-accent-danger)', flexShrink: 0 },
  bannerTitle: { fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' },
  bannerSub:   { fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' },
  list:        { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' },
  trapCard:    { backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: '16px' },
  numBadge:    { width: 28, height: 28, borderRadius: '50%', backgroundColor: 'var(--color-bg-danger)', border: '1px solid var(--color-border-danger)', color: 'var(--color-accent-danger)', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' },
  trapBody:    { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' },
  trapTitle:   { fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'flex-start', gap: '8px' },
  flameIcon:   { fontSize: 17, color: 'var(--color-accent-danger)', flexShrink: 0, marginTop: '1px' },
  section:     { display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px 14px', backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' },
  fixSection:  { backgroundColor: 'var(--color-bg-success)', border: '1px solid var(--color-border-success)' },
  sectionLabel:{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent-danger)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' },
  sectionText: { fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 },
}
