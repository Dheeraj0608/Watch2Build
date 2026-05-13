'use client'

import { useState, useEffect, useRef, type CSSProperties } from 'react'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion'

interface UrlInputProps {
  onSubmit: (url: string) => void
}

const features = [
  {
    emoji: '🔍',
    title: 'Tech Stack Detection',
    description:
      'Instantly identifies every tool, framework, and library used in the tutorial. No more pausing and rewinding to catch dependency names.',
    tag: 'Automatic',
  },
  {
    emoji: '🗺️',
    title: 'Smart Roadmap',
    description:
      'Breaks the project into realistic phases with actual time estimates based on real developer experience — not tutorial runtime.',
    tag: 'AI Powered',
  },
  {
    emoji: '⚠️',
    title: 'Beginner Trap Warnings',
    description:
      'Surfaces the exact errors most developers hit, with specific fixes — before you spend 3 hours debugging something that had a one-line solution.',
    tag: 'Critical',
  },
  {
    emoji: '📋',
    title: 'GitHub-style Task Board',
    description:
      'Every task lands on a kanban board. Move cards from To Do to Done as you build. Turn passive watching into active shipping.',
    tag: 'Interactive',
  },
  {
    emoji: '🎯',
    title: 'MVP Definition',
    description:
      'Cuts through tutorial bloat to define the smallest version that actually works. Ship something real in one sitting.',
    tag: 'Focused',
  },
  {
    emoji: '🚀',
    title: 'Deployment Checklist',
    description:
      'Step by step deployment guide with exact commands and service names. From local dev to production without missing a step.',
    tag: 'Ship Ready',
  },
]

const steps = [
  {
    number: '01',
    title: 'Paste a YouTube URL',
    description:
      'Any coding tutorial — React, Python, DevOps, ML. If it has audio or captions we can read it.',
  },
  {
    number: '02',
    title: 'AI analyzes the tutorial',
    description:
      'AI extracts the project structure, tech stack, timeline, and failure points in seconds.',
  },
  {
    number: '03',
    title: 'Get your project plan',
    description:
      'A full engineer-grade project plan with roadmap, task board, traps, and deployment checklist. Ready to build.',
  },
]

const marqueeText =
  'Tech Stack · Roadmap · Task Board · Beginner Traps · Time Estimates · Deploy Checklist · MVP Definition · Architecture ·'

function FadeUp({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode
  delay?: number
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

export default function UrlInput({ onSubmit }: UrlInputProps) {
  const [url, setUrl] = useState('')
  const [touched, setTouched] = useState(false)
  const heroRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: heroRef })
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -40])

  useEffect(() => {
    const handleScroll = () => setTouched(false)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function isValidUrl(url: string): boolean {
    return /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)[a-zA-Z0-9_-]{11}/.test(
      url
    )
  }

  function handleSubmit() {
    setTouched(true)
    if (isValidUrl(url)) onSubmit(url)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        overflowX: 'hidden',
      }}
    >
      <section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, var(--bg-base) 100%)`,
            pointerEvents: 'none',
          }}
        />

        <motion.div
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
            y: yTransform,
          }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '8%',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
          animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '680px',
            width: '100%',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--brand-purple-light)',
              border: '1px solid var(--border-accent)',
              borderRadius: '100px',
              padding: '6px 14px',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--text-accent)',
              marginBottom: '24px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--brand-purple)',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            AI Powered · Free to use
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.span
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{
                display: 'inline-block',
                fontSize: '56px',
                marginBottom: '20px',
                lineHeight: 1,
              }}
            >
              🧠
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              fontSize: 'clamp(32px, 6vw, 52px)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '16px',
              color: 'var(--text-primary)',
            }}
          >
            Watch2Build
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: '17px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '40px',
              maxWidth: '500px',
              margin: '0 auto 40px',
            }}
          >
            Paste a coding tutorial URL. Get a senior engineer's project plan — roadmap, traps, task board, and deploy checklist in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ width: '100%', maxWidth: '560px', margin: '0 auto 16px' }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onBlur={() => setTouched(true)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSubmit()
                }}
                placeholder="https://youtube.com/watch?v=..."
                style={{
                  flex: 1,
                  background: 'var(--bg-surface)',
                  border: touched && url && !isValidUrl(url)
                    ? '1.5px solid var(--brand-red)'
                    : '1.5px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'var(--brand-purple)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'
                }}
              />

              <motion.button
                onClick={handleSubmit}
                disabled={!isValidUrl(url)}
                whileHover={isValidUrl(url) ? { scale: 1.02, y: -1 } : {}}
                whileTap={isValidUrl(url) ? { scale: 0.98 } : {}}
                style={{
                  background: isValidUrl(url) ? 'var(--brand-purple)' : 'var(--bg-elevated)',
                  color: isValidUrl(url) ? 'white' : 'var(--text-tertiary)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 22px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: isValidUrl(url) ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s, color 0.2s',
                  boxShadow: isValidUrl(url) ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
                }}
              >
                Analyze →
              </motion.button>
            </div>

            <AnimatePresence>
              {touched && url && !isValidUrl(url) && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  style={{
                    fontSize: '12px',
                    color: 'var(--brand-red)',
                    marginTop: '8px',
                    textAlign: 'left',
                  }}
                >
                  ⚠ Please enter a valid YouTube URL
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}
          >
            {[
              '🔍 Tech Stack',
              '🗺️ Roadmap',
              '⚠️ Beginner Traps',
              '📋 Task Board',
              '⏱ Time Estimates',
              '🚀 Deploy Checklist',
            ].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.3 }}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '100px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-tertiary)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Scroll to learn more
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '16px' }}
            >
              ↓
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div
        style={{
          overflow: 'hidden',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '14px 0',
          background: 'var(--bg-elevated)',
        }}
      >
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ paddingRight: '0' }}>
              {marqueeText}&nbsp;&nbsp;&nbsp;&nbsp;{marqueeText}&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </motion.div>
      </div>

      <section
        style={{
          padding: '100px 24px',
          maxWidth: '860px',
          margin: '0 auto',
        }}
      >
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--text-accent)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              How it works
            </span>
            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}
            >
              Three steps to shipping
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                maxWidth: '400px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              From passive watching to active building in under 60 seconds.
            </p>
          </div>
        </FadeUp>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {steps.map((step, i) => (
            <FadeUp key={i} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '28px 24px',
                  boxShadow: 'var(--shadow-sm)',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--text-accent)',
                    letterSpacing: '0.06em',
                    marginBottom: '16px',
                    background: 'var(--brand-purple-light)',
                    border: '1px solid var(--border-accent)',
                    borderRadius: '100px',
                    padding: '4px 12px',
                    display: 'inline-block',
                  }}
                >
                  {step.number}
                </div>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    marginBottom: '10px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                  }}
                >
                  {step.description}
                </p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      <section
        style={{
          padding: '60px 24px 100px',
          maxWidth: '860px',
          margin: '0 auto',
        }}
      >
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--text-accent)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              What you get
            </span>
            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}
            >
              Everything a senior engineer would tell you
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                maxWidth: '420px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              The stuff the tutorial doesn't cover — but that separates people who ship from people who rewatch.
            </p>
          </div>
        </FadeUp>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '12px',
          }}
        >
          {features.map((feature, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -3, borderColor: 'var(--border-accent)' }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '28px', lineHeight: 1 }}>{feature.emoji}</span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      color: 'var(--text-accent)',
                      background: 'var(--brand-purple-light)',
                      border: '1px solid var(--border-accent)',
                      borderRadius: '100px',
                      padding: '3px 8px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {feature.tag}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    flex: 1,
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      <div
        style={{
          overflow: 'hidden',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '14px 0',
          background: 'var(--bg-elevated)',
        }}
      >
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {[...Array(8)].map((_, i) => (
            <span key={i} style={{ paddingRight: '32px' }}>
              Stop rewatching · Start shipping ·
            </span>
          ))}
        </motion.div>
      </div>

      <section
        style={{
          padding: '100px 24px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <FadeUp>
          <motion.div
            animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              fontSize: '48px',
              marginBottom: '24px',
              display: 'inline-block',
            }}
          >
            🧠
          </motion.div>

          <h2
            style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '12px',
            }}
          >
            Ready to stop watching and start shipping?
          </h2>

          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '40px',
            }}
          >
            Paste your first tutorial URL above and get your project plan in seconds. No signup. No credit card.
          </p>

          <motion.button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'var(--brand-purple)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 32px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              transition: 'background 0.2s',
            }}
          >
            Get Started — It's Free →
          </motion.button>

          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              marginTop: '16px',
            }}
          >
            Works with coding tutorials on YouTube
          </p>
        </FadeUp>
      </section>
    </div>
  )
}
