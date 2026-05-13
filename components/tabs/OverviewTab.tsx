'use client'

import FadeUp from '@/components/animations/FadeUp'
import StaggerList from '@/components/animations/StaggerList'
import ScaleOnHover from '@/components/animations/ScaleOnHover'
import CountUp from '@/components/animations/CountUp'
import type { ProjectResult, TechItem } from '@/lib/types'

function convertTimestampToSeconds(
  timestamp: string
): number {
  const startTime = timestamp
    .split(' - ')[0]
    .replace('(estimated)', '')
    .replace('Approximately', '')
    .trim()

  const parts = startTime.split(':').map(Number)

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }
  return 0
}

function extractVideoId(url: string): string {
  const match = url?.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  )
  return match?.[1] ?? ''
}

interface OverviewTabProps {
  result: ProjectResult
  videoUrl: string
}

export default function OverviewTab({
  result,
  videoUrl
}: OverviewTabProps) {
  const groupedTech: Record<string, TechItem[]> = {}
  const techStack = Array.isArray(result.techStack) ? result.techStack : []
  techStack.forEach(item => {
    if (!groupedTech[item.category]) {
      groupedTech[item.category] = []
    }
    groupedTech[item.category].push(item)
  })

  let difficultyBg = 'var(--color-bg-tertiary)'
  let difficultyColor = 'var(--color-text-secondary)'

  if (result.difficultyLevel === 'beginner') {
    difficultyBg = 'var(--color-bg-success)'
    difficultyColor = 'var(--color-accent-success)'
  } else if (result.difficultyLevel === 'intermediate') {
    difficultyBg = 'var(--color-bg-warning)'
    difficultyColor = 'var(--color-accent-warning)'
  } else if (result.difficultyLevel === 'advanced') {
    difficultyBg = 'var(--color-bg-danger)'
    difficultyColor = 'var(--color-accent-danger)'
  }

  const teaches = Array.isArray(result.whatThisActuallyTeaches) ? result.whatThisActuallyTeaches : []
  const skippableSections = Array.isArray(result.whatToSkip) ? result.whatToSkip : []

  const roadmap = Array.isArray(result.roadmap) ? result.roadmap : []
  const calculatedTotalHours = roadmap.reduce(
    (sum, milestone) => sum + (milestone.estimatedHours ?? 0), 
    0
  )

  return (
    <div style={styles.container}>
      <FadeUp delay={0}>
        <section style={styles.heroCard}>
          <h2 style={styles.projectTitle}>{result.projectTitle}</h2>
          {result.projectSummary && (
            <p style={styles.projectSummary}>{result.projectSummary}</p>
          )}
          <div style={styles.heroMetaRow}>
            <span style={styles.heroMetaItem}>
              <i className="ti ti-clock" style={styles.heroMetaIcon} aria-hidden />
              <CountUp value={calculatedTotalHours} suffix="h" /> total build time
            </span>
            <span style={styles.heroMetaItem}>
              <i className="ti ti-chart-bar" style={styles.heroMetaIcon} aria-hidden />
              <span
                style={{
                  ...styles.heroDifficultyBadge,
                  backgroundColor: difficultyBg,
                  color: difficultyColor,
                  textTransform: 'capitalize'
                }}
              >
                {result.difficultyLevel}
              </span>
            </span>
          </div>
          <div style={styles.badgeRow}>
            <span
              style={{
                ...styles.badge,
                backgroundColor: difficultyBg,
                color: difficultyColor,
                textTransform: 'capitalize'
              }}
            >
              {result.difficultyLevel}
            </span>
            <span
              style={{
                ...styles.badge,
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-secondary)'
              }}
            >
              <i className="ti ti-clock" style={{ marginRight: '4px' }} />
              <CountUp value={calculatedTotalHours} suffix="h" />
            </span>
          </div>
        </section>
      </FadeUp>

      <FadeUp delay={0.1}>
        <section style={styles.mvpCallout}>
          <div style={styles.mvpLabel}>Minimum Viable Version</div>
          <p style={styles.mvpText}>{result.mvpDefinition}</p>
        </section>
      </FadeUp>

      <FadeUp delay={0.15}>
        <section style={styles.teachesSection}>
          <div style={styles.teachesLabel}>What this actually teaches</div>
          <StaggerList>
            {teaches.map((item, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.teachesItem,
                  ...(idx === teaches.length - 1 ? styles.teachesItemLast : null)
                }}
              >
                <i className="ti ti-circle-check" style={styles.teachesIcon} aria-hidden />
                <span style={styles.teachesText}>{item}</span>
              </div>
            ))}
          </StaggerList>
        </section>
      </FadeUp>

      <FadeUp delay={0.2}>
        <section style={styles.skipSection}>
          <div style={styles.skipHeader}>
            <i className="ti ti-player-skip-forward" style={styles.skipHeaderIcon} aria-hidden />
            <div style={styles.skipLabel}>What to skip</div>
          </div>
          {skippableSections.length === 0 ? (
            <p style={styles.skipEmpty}>
              No skippable sections identified — this tutorial is worth watching fully.
            </p>
          ) : (
            skippableSections.map((item, idx) => (
              <FadeUp key={idx} delay={idx * 0.1}>
                <article style={styles.skipCard}>
                  <div style={styles.skipCardHeader}>
                    <span style={styles.skipSectionName}>{item.section}</span>
                    {item.timeStamp && item.timeStamp !== 'unknown' && (
                      <a
                        href={`https://www.youtube.com/watch?v=${
                          extractVideoId(videoUrl)
                        }&t=${convertTimestampToSeconds(item.timeStamp)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'var(--brand-amber-light)',
                          color: 'var(--brand-amber)',
                          border: '1px solid rgba(217,119,6,0.2)',
                          borderRadius: 'var(--radius-full)',
                          padding: '3px 10px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          textDecoration: 'none',
                          marginLeft: '8px',
                          transition: 'all 0.15s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 
                            'rgba(217,119,6,0.2)'
                          e.currentTarget.style.borderColor = 
                            'rgba(217,119,6,0.4)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 
                            'var(--brand-amber-light)'
                          e.currentTarget.style.borderColor = 
                            'rgba(217,119,6,0.2)'
                        }}
                      >
                        <i className="ti ti-brand-youtube" 
                           style={{ fontSize: '12px' }} />
                        {item.timeStamp.split(' - ')[0]}
                      </a>
                    )}
                  </div>
                  <p style={styles.skipReason}>{item.reason}</p>
                </article>
              </FadeUp>
            ))
          )}
        </section>
      </FadeUp>

      <FadeUp delay={0.1}>
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Tech Stack</h3>
          <div style={styles.techStackContainer}>
            {Object.entries(groupedTech).map(([category, items]) => (
              <div key={category} style={styles.techCategory}>
                <div style={styles.categoryLabel}>{category}</div>
                <div style={styles.chipRow}>
                  {items.map((item, idx) => (
                    <ScaleOnHover key={idx} scale={1.01} style={styles.techChipWrapper}>
                      <span style={styles.techChip} title={item.purpose}>
                        {item.name}
                      </span>
                    </ScaleOnHover>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeUp>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Architecture</h3>
        {result.architecture && (
          <>
            {result.architecture.overview && (
              <p style={styles.archOverview}>{result.architecture.overview}</p>
            )}
            {result.architecture.components && result.architecture.components.length > 0 && (
              <ol style={styles.archList}>
                {result.architecture.components.map((comp, idx) => (
                  <li key={idx} style={styles.archListItem}>
                    {comp}
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </section>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  heroCard: {
    backgroundColor: 'var(--color-bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  projectTitle: {
    fontSize: '22px',
    fontWeight: 500,
    color: 'var(--color-text-primary)'
  },
  projectSummary: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.7
  },
  heroMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  heroMetaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: 'var(--color-text-tertiary)'
  },
  heroMetaIcon: {
    fontSize: '14px'
  },
  heroDifficultyBadge: {
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: 'var(--radius-md)',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center'
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  badge: {
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: 'var(--radius-md)',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center'
  },
  mvpCallout: {
    backgroundColor: 'var(--color-bg-info)',
    borderLeft: '3px solid var(--color-border-info)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  mvpLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--color-text-secondary)',
    fontWeight: 600
  },
  mvpText: {
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'var(--color-text-primary)'
  },
  teachesSection: {
    backgroundColor: 'var(--color-bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem',
    marginBottom: '1.5rem'
  },
  teachesLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--color-text-tertiary)',
    marginBottom: '10px',
    fontWeight: 600
  },
  teachesList: {
    display: 'flex',
    flexDirection: 'column'
  },
  teachesItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '6px 0',
    borderBottom: '0.5px solid var(--color-border)'
  },
  teachesItemLast: {
    borderBottom: 'none'
  },
  teachesIcon: {
    fontSize: '16px',
    color: 'var(--color-accent-success)',
    flexShrink: 0,
    marginTop: '2px'
  },
  teachesText: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: 'var(--color-text-primary)'
  },
  skipSection: {
    backgroundColor: 'color-mix(in srgb, var(--color-bg-warning) 40%, transparent)',
    border: '0.5px solid var(--color-border-warning)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem',
    marginBottom: '1.5rem'
  },
  skipHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  skipHeaderIcon: {
    fontSize: '16px',
    color: 'var(--color-accent-warning)'
  },
  skipLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--color-accent-warning)',
    fontWeight: 600
  },
  skipEmpty: {
    fontSize: '13px',
    color: 'var(--color-text-tertiary)',
    marginTop: '8px',
    lineHeight: 1.6
  },
  skipCard: {
    backgroundColor: 'var(--color-bg-primary)',
    border: '0.5px solid var(--color-border-warning)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 12px',
    marginTop: '8px'
  },
  skipCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  skipSectionName: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text-primary)'
  },
  skipTimeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: 'var(--color-bg-tertiary)',
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-secondary)'
  },
  skipReason: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    marginTop: '4px',
    lineHeight: 1.6
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '16px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 500,
    color: 'var(--color-text-primary)'
  },
  techStackContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  techChipWrapper: {
    display: 'inline-flex'
  },
  techCategory: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  categoryLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: 'var(--color-text-secondary)',
    fontWeight: 600
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  techChip: {
    display: 'inline-flex',
    border: '0.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '4px 10px',
    fontSize: '13px',
    backgroundColor: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    cursor: 'help'
  },
  archOverview: {
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'var(--color-text-secondary)'
  },
  archList: {
    listStylePosition: 'inside',
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    padding: 0
  },
  archListItem: {
    fontSize: '14px',
    padding: '6px 0',
    borderBottom: '0.5px solid var(--color-border)',
    color: 'var(--color-text-primary)'
  }
}
