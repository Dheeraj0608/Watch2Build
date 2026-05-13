'use client'

import { useState } from 'react'
import type { AppState, ProjectResult } from '@/lib/types'
import UrlInput      from '@/components/UrlInput'
import LoadingScreen from '@/components/LoadingScreen'
import ErrorScreen   from '@/components/ErrorScreen'
import Dashboard     from '@/components/Dashboard'

export default function HomePage() {
  const [appState,   setAppState]   = useState<AppState>('idle')
  const [result,     setResult]     = useState<ProjectResult | null>(null)
  const [videoUrl,   setVideoUrl]   = useState<string>('')
  const [error,      setError]      = useState<string | null>(null)

  async function handleSubmit(url: string) {
    setVideoUrl(url)
    setAppState('fetching')

    try {
      // ── Step 1: Fetch transcript (multi-strategy) ──────────────────
      const transcriptRes = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!transcriptRes.ok) {
        const errData = await transcriptRes.json()
        setError(errData.error ?? 'Could not fetch transcript.')
        setAppState('error')
        return
      }

      const { transcript: text } = await transcriptRes.json()
      setAppState('analyzing')

      // ── Step 2: Analyse with AI ────────────────────────────────────
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text }),
      })

      if (!analyzeRes.ok) {
        const { error: msg } = await analyzeRes.json()
        setError(msg ?? 'Analysis failed. Please try again.')
        setAppState('error')
        return
      }

      const result: ProjectResult = await analyzeRes.json()
      setResult(result)
      setAppState('done')
    } catch {
      setError('Something went wrong. Check your connection.')
      setAppState('error')
    }
  }

  // ── State machine render ────────────────────────────────────────────
  if (appState === 'idle') {
    return <UrlInput onSubmit={handleSubmit} />
  }

  if (appState === 'fetching') {
    return <LoadingScreen message="Fetching transcript…" />
  }

  if (appState === 'analyzing') {
    return <LoadingScreen message="Analyzing with AI…" />
  }

  if (appState === 'error') {
    return (
      <ErrorScreen
        error={error ?? 'An unexpected error occurred.'}
        onReset={() => { setAppState('idle'); setError(null) }}
        onManualSubmit={async (manualTranscript: string) => {
          setAppState('analyzing')
          setError(null)
          try {
            const analyzeRes = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ transcript: manualTranscript }),
            })
            if (!analyzeRes.ok) {
              const { error: msg } = await analyzeRes.json()
              setError(msg ?? 'Analysis failed. Please try again.')
              setAppState('error')
              return
            }
            const result: ProjectResult = await analyzeRes.json()
            setResult(result)
            setAppState('done')
          } catch {
            setError('Analysis failed. Check your connection.')
            setAppState('error')
          }
        }}
      />
    )
  }

  if (appState === 'done' && result) {
    return <Dashboard result={result} videoUrl={videoUrl} />
  }

  return null
}
