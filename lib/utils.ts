/**
 * Extracts the YouTube video ID from various URL formats.
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Formats a number of hours into a human-readable string.
 * e.g. 1.5 → "1h 30m", 0.5 → "30m"
 */
export function formatHours(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/**
 * Returns a CSS variable colour token for a difficulty level.
 */
export function difficultyColor(
  level: 'beginner' | 'intermediate' | 'advanced'
): string {
  switch (level) {
    case 'beginner':
      return 'var(--color-bg-success)'
    case 'intermediate':
      return 'var(--color-bg-warning)'
    case 'advanced':
      return 'var(--color-bg-danger)'
  }
}

/**
 * Maps a tech category to a Tabler icon class name.
 */
export function categoryIcon(
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'other'
): string {
  switch (category) {
    case 'frontend':
      return 'ti-layout'
    case 'backend':
      return 'ti-server'
    case 'database':
      return 'ti-database'
    case 'devops':
      return 'ti-brand-docker'
    case 'other':
      return 'ti-puzzle'
  }
}

/**
 * Maps a roadmap phase to a label string.
 */
export function phaseLabel(
  phase: '1-day' | '3-day' | '1-week' | 'launch'
): string {
  switch (phase) {
    case '1-day':
      return 'Day 1'
    case '3-day':
      return '3 Days'
    case '1-week':
      return '1 Week'
    case 'launch':
      return 'Launch'
  }
}
