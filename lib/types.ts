export interface TechItem {
  name: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'other'
  purpose: string
}

export interface Milestone {
  milestone: string
  phase: string
  tasks: string[]
  deliverable: string
  estimatedHours: number
}

export interface Checkpoint {
  title: string
  description: string
  successCriteria: string
}

export interface SkippableSection {
  section: string
  reason: string
  timeStamp: string
}

export interface BeginnerTrap {
  trap: string
  why: string
  fix: string
}

export interface ProjectResult {
  projectTitle: string
  projectSummary: string
  whatThisActuallyTeaches?: string[]
  whatToSkip?: SkippableSection[]
  techStack: TechItem[]
  architecture: {
    overview: string
    components: string[]
  }
  roadmap: Milestone[]
  checkpoints: Checkpoint[]
  beginnerTraps: BeginnerTrap[]
  deploymentChecklist: string[]
  estimatedTotalHours: number
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  resumeBullet: string
  mvpDefinition: string
}

export type AppState = 'idle' | 'fetching' | 'analyzing' | 'done' | 'error'
