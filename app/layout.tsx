import type { Metadata } from 'next'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import LoadingOverlay from '@/components/LoadingOverlay'

export const metadata: Metadata = {
  title: 'Watch2Build',
  description:
    'Paste a YouTube tutorial URL and get an AI-generated project plan, tech stack breakdown, roadmap, and deployment checklist — powered by Claude.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body>
        <LoadingOverlay />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
