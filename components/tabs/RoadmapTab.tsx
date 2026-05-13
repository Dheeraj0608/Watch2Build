'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import FadeUp from '@/components/animations/FadeUp'
import StaggerList from '@/components/animations/StaggerList'
import type { ProjectResult } from '@/lib/types'

interface RoadmapTabProps {
  result: ProjectResult
}

export default function RoadmapTab({ result }: RoadmapTabProps) {
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({})
  const totalHours = result.roadmap.reduce(
    (sum, milestone) => sum + (milestone.estimatedHours ?? 0),
    0
  )
  const totalTasks = result.roadmap.reduce((sum, milestone) => sum + milestone.tasks.length, 0)

  // Group milestones by phase (day)
  const groupedByPhase = result.roadmap.reduce(
    (groups, milestone, index) => {
      const phase = milestone.phase
      if (!groups[phase]) {
        groups[phase] = []
      }
      groups[phase].push({ milestone, index })
      return groups
    },
    {} as Record<string, Array<{ milestone: typeof result.roadmap[0]; index: number }>>
  )

  // Get unique phases in order of first appearance
  const phaseOrder = result.roadmap
    .map((m) => m.phase)
    .filter((phase, index, arr) => arr.indexOf(phase) === index)

  function handleTaskToggle(key: string) {
    setCheckedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div style={styles.wrapper}>
      <StaggerList>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Milestones</div>
            <div style={styles.summaryValue}>{result.roadmap.length}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Total hours</div>
            <div style={styles.summaryValue}>{totalHours}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Total tasks</div>
            <div style={styles.summaryValue}>{totalTasks}</div>
          </div>
        </div>
      </StaggerList>

      {phaseOrder.map((phase) => (
        <div key={phase} style={styles.dayContainer}>
          <div style={styles.dayHeader}>{phase}</div>
          {groupedByPhase[phase].map(({ milestone, index: milestoneIndex }) => {
            const checkedCount = milestone.tasks.reduce((count, _, taskIndex) => {
              const key = `${milestoneIndex}-${taskIndex}`
              return checkedTasks[key] ? count + 1 : count
            }, 0)
            const totalTasks = milestone.tasks.length
            const progress = totalTasks === 0 ? 0 : (checkedCount / totalTasks) * 100

            return (
              <FadeUp key={`${milestone.phase}-${milestoneIndex}`} delay={milestoneIndex * 0.08}>
                <section style={styles.card}>
                  <div style={styles.headerRow}>
                    <div style={styles.headerLeft}>
                      <h2 style={styles.milestoneTitle}>{milestone.milestone}</h2>
                    </div>
                    <span style={styles.hoursText}>{milestone.estimatedHours} hrs</span>
                  </div>

                  <div style={styles.deliverableBlock}>
                    <div style={styles.deliverableLabel}>Deliverable:</div>
                    <div style={styles.deliverableValue}>{milestone.deliverable}</div>
                  </div>

                  <div style={styles.progressBlock}>
                    <div style={styles.progressBar}>
                      <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                    </div>
                    <div style={styles.progressLabel}>
                      {checkedCount} / {totalTasks} tasks
                    </div>
                  </div>

                  <div style={styles.taskList}>
                    {milestone.tasks.map((task, taskIndex) => {
                      const key = `${milestoneIndex}-${taskIndex}`
                      const checked = Boolean(checkedTasks[key])

                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: taskIndex * 0.04 }}
                        >
                          <label style={styles.taskRow}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleTaskToggle(key)}
                            />
                            <span
                              style={{
                                ...styles.taskText,
                                ...(checked ? styles.taskTextChecked : null),
                              }}
                            >
                              {task}
                            </span>
                          </label>
                        </motion.div>
                      )
                    })}
                  </div>
                </section>
              </FadeUp>
            )
          })}
        </div>
      ))}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '1.5rem',
  },
  summaryCard: {
    background: 'var(--color-bg-secondary)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: '12px',
    color: 'var(--color-text-tertiary)',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  summaryValue: {
    fontSize: '22px',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
  },
  dayContainer: {
    marginBottom: '2rem',
  },
  dayHeader: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '2px solid var(--color-border)',
  },
  card: {
    background: 'var(--color-bg-primary)',
    border: '0.5px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem',
    marginBottom: '12px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '14px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  phaseBadge: {
    fontSize: '11px',
    fontWeight: 500,
    padding: '3px 10px',
    borderRadius: 'var(--radius-md)',
    display: 'inline-block',
    marginBottom: '8px',
  },
  milestoneTitle: {
    fontSize: '16px',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  hoursText: {
    fontSize: '13px',
    color: 'var(--color-text-tertiary)',
    whiteSpace: 'nowrap',
  },
  deliverableBlock: {
    marginBottom: '14px',
  },
  deliverableLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    color: 'var(--color-text-tertiary)',
    marginBottom: '4px',
  },
  deliverableValue: {
    fontSize: '13px',
    fontWeight: 400,
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
  },
  progressBlock: {
    marginBottom: '16px',
  },
  progressBar: {
    height: '4px',
    background: 'var(--color-bg-tertiary)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    background: 'var(--color-text-primary)',
    borderRadius: '2px',
  },
  progressLabel: {
    fontSize: '12px',
    color: 'var(--color-text-tertiary)',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  taskRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    cursor: 'pointer',
  },
  taskText: {
    fontSize: '14px',
    color: 'var(--color-text-primary)',
    lineHeight: 1.5,
  },
  taskTextChecked: {
    textDecoration: 'line-through',
    color: 'var(--color-text-tertiary)',
  },
}
