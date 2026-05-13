'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ProjectResult } from '@/lib/types'
import OverviewTab from './tabs/OverviewTab'
import RoadmapTab from './tabs/RoadmapTab'
import BoardTab from './tabs/BoardTab'
import DangerTab from './tabs/DangerTab'
import LaunchTab from './tabs/LaunchTab'
import ScrollProgress from './ScrollProgress'

interface DashboardProps {
  result: ProjectResult
  videoUrl: string
}

export default function Dashboard({ result, videoUrl }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'board', label: 'Task Board' },
    { id: 'danger', label: 'Danger Zones' },
    { id: 'launch', label: 'Launch' }
  ]

  const handleStartOver = () => {
    window.location.reload()
  }

  return (
    <div style={styles.container}>
      <ScrollProgress />
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <i className="ti ti-brain" style={styles.brainIcon} />
          <span style={styles.headerTitle}>Watch2Build</span>
        </div>
        <button onClick={handleStartOver} style={styles.startOverBtn}>
          <i className="ti ti-refresh" />
          Start Over
        </button>
      </header>

      <div style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tabButton,
                ...(isActive ? styles.activeTab : styles.inactiveTab)
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <main style={styles.mainContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {activeTab === 'overview' && <OverviewTab result={result} videoUrl={videoUrl} />}
            {activeTab === 'roadmap' && <RoadmapTab result={result} />}
            {activeTab === 'board' && <BoardTab result={result} />}
            {activeTab === 'danger' && <DangerTab beginnerTraps={result.beginnerTraps} />}
            {activeTab === 'launch' && <LaunchTab deploymentChecklist={result.deploymentChecklist} projectTitle={result.projectTitle} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    paddingBottom: '40px'
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 24px',
    backgroundColor: 'var(--color-bg-secondary)',
    borderBottom: '1px solid var(--color-border)',
    boxShadow: '0 20px 40px rgba(31, 28, 23, 0.05)'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  brainIcon: {
    fontSize: '18px',
    color: 'var(--color-text-primary)'
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '0.02em'
  },
  startOverBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    background: 'transparent',
    border: '1px solid var(--color-border)',
    borderRadius: '999px',
    padding: '10px 14px',
    cursor: 'pointer'
  },
  tabBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 24px',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-secondary)',
    overflowX: 'auto',
    whiteSpace: 'nowrap'
  },
  tabButton: {
    padding: '12px 18px',
    fontSize: '14px',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: '999px',
    cursor: 'pointer',
    marginRight: '12px',
    transition: 'all 0.2s ease'
  },
  activeTab: {
    color: 'var(--color-text-primary)',
    fontWeight: 700,
    backgroundColor: 'transparent',
    borderColor: 'var(--color-border)'
  },
  inactiveTab: {
    color: 'var(--color-text-tertiary)',
    backgroundColor: 'transparent',
    borderColor: 'transparent'
  },
  mainContent: {
    padding: '32px 24px',
    maxWidth: '980px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }
}
