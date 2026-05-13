'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import FadeUp from '@/components/animations/FadeUp'
import StaggerList from '@/components/animations/StaggerList'

interface LaunchTabProps {
  deploymentChecklist: string[]
  projectTitle: string
}

export default function LaunchTab({ deploymentChecklist, projectTitle }: LaunchTabProps) {
  const [checked, setChecked] = useState<boolean[]>(
    () => new Array(deploymentChecklist.length).fill(false)
  )

  function toggle(idx: number) {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)))
  }

  const completedCount = checked.filter(Boolean).length
  const total = deploymentChecklist.length
  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100)
  const allDone = completedCount === total

  function resetAll() {
    setChecked(new Array(total).fill(false))
  }

  return (
    <div style={styles.wrapper}>
      {/* ── Progress header ─────────────────────────── */}
      <FadeUp delay={0}>
        <div style={styles.progressCard}>
          <div style={styles.progressTop}>
            <div style={styles.progressLeft}>
              <i className="ti ti-rocket" style={styles.rocketIcon} aria-hidden />
              <div>
                <p style={styles.progressTitle}>Deployment Checklist</p>
                <p style={styles.progressSub}>{completedCount} of {total} steps completed</p>
              </div>
            </div>
            <span style={{
              ...styles.percentBadge,
              backgroundColor: allDone ? 'var(--color-bg-success)' : 'var(--color-bg-info)',
              border: `1px solid ${allDone ? 'var(--color-border-success)' : 'var(--color-border-info)'}`,
              color: allDone ? 'var(--color-accent-success)' : 'var(--color-accent-info)',
            }}>
              {percent}%
            </span>
          </div>
          <div style={styles.barTrack} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <div style={{ ...styles.barFill, width: `${percent}%`, backgroundColor: allDone ? 'var(--color-accent-success)' : 'var(--color-accent-info)' }} />
          </div>
        </div>
      </FadeUp>

      {/* ── All-done banner ─────────────────────────── */}
      {allDone && (
        <FadeUp delay={0.08}>
          <div style={styles.doneBanner} role="status">
            <i className="ti ti-confetti" style={styles.confettiIcon} aria-hidden />
            <div>
              <p style={styles.doneTitle}>🎉 You&apos;re ready to ship {projectTitle}!</p>
              <p style={styles.doneSub}>All deployment steps are complete. Go live!</p>
            </div>
            <button style={styles.resetBtn} onClick={resetAll} id="reset-checklist-btn">
              <i className="ti ti-refresh" aria-hidden /> Reset
            </button>
          </div>
        </FadeUp>
      )}

      {/* ── Checklist items ─────────────────────────── */}
      <FadeUp delay={0.16}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div style={styles.list}>
            <StaggerList>
              {deploymentChecklist.map((item, idx) => {
                const done = checked[idx]
                return (
                  <li key={idx} style={{
                    ...styles.item,
                    backgroundColor: done ? 'var(--color-bg-success)' : 'var(--color-bg-secondary)',
                    border: `1px solid ${done ? 'var(--color-border-success)' : 'var(--color-border)'}`,
                  }}>
                    <button
                      id={`checklist-item-${idx}`}
                      type="button"
                      onClick={() => toggle(idx)}
                      style={{
                        ...styles.checkbox,
                        backgroundColor: done ? 'var(--color-accent-success)' : 'var(--color-bg-tertiary)',
                        border: `2px solid ${done ? 'var(--color-accent-success)' : 'var(--color-border)'}`,
                      }}
                      aria-pressed={done}
                      aria-label={`Mark step ${idx + 1} as ${done ? 'incomplete' : 'complete'}`}
                    >
                      {done && <i className="ti ti-check" style={styles.checkIcon} aria-hidden />}
                    </button>
                    <span style={{
                      ...styles.itemText,
                      color: done ? 'var(--color-accent-success)' : 'var(--color-text-primary)',
                      textDecoration: done ? 'line-through' : 'none',
                      opacity: done ? 0.7 : 1,
                    }}>
                      {item}
                    </span>
                    <span style={styles.stepNum} aria-hidden>{idx + 1}</span>
                  </li>
                )
              })}
            </StaggerList>
          </div>
        </motion.div>
      </FadeUp>

      {!allDone && total > 0 && (
        <button style={styles.resetBtnSmall} onClick={resetAll} id="reset-checklist-small-btn">
          <i className="ti ti-refresh" aria-hidden /> Reset all
        </button>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper:       { display: 'flex', flexDirection: 'column', gap: '16px' },
  progressCard:  { backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  progressTop:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' },
  progressLeft:  { display: 'flex', alignItems: 'center', gap: '12px' },
  rocketIcon:    { fontSize: 22, color: 'var(--color-text-tertiary)' },
  progressTitle: { fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' },
  progressSub:   { fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '2px' },
  percentBadge:  { fontSize: '14px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', flexShrink: 0 },
  barTrack:      { height: '6px', backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: '100px', overflow: 'hidden' },
  barFill:       { height: '100%', borderRadius: '100px', transition: 'width 0.3s ease' },
  doneBanner:    { backgroundColor: 'var(--color-bg-success)', border: '1px solid var(--color-border-success)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' },
  confettiIcon:  { fontSize: 28, color: 'var(--color-accent-success)', flexShrink: 0 },
  doneTitle:     { fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' },
  doneSub:       { fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' },
  list:          { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' },
  item:          { borderRadius: 'var(--radius-md)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background-color 0.2s, border-color 0.2s' },
  checkbox:      { width: 22, height: 22, borderRadius: '6px', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s, border-color 0.15s' },
  checkIcon:     { fontSize: 13, color: '#ffffff' },
  itemText:      { flex: 1, fontSize: '14px', lineHeight: 1.5, transition: 'color 0.2s, opacity 0.2s' },
  stepNum:       { fontSize: '11px', color: 'var(--color-text-tertiary)', flexShrink: 0 },
  resetBtn:      { display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-success)', backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-accent-success)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', flexShrink: 0, marginLeft: 'auto' },
  resetBtnSmall: { alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-tertiary)', fontSize: '13px', cursor: 'pointer' },
}
