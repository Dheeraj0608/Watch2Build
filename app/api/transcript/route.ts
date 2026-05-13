import { NextRequest, NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url?.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function fetchTimedTextXML(url: string): 
  Promise<string | null> {
  try {
    const jsonUrl = url.includes('fmt=') 
      ? url 
      : url + '&fmt=json3'

    const res = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' +
          ' AppleWebKit/537.36 (KHTML, like Gecko)' +
          ' Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      console.error('[transcript] Caption fetch failed:', res.status)
      return null
    }

    const contentType = res.headers.get('content-type') ?? ''

    if (contentType.includes('json')) {
      const data: unknown = await res.json()
      const events = isRecord(data) && Array.isArray(data.events)
        ? data.events
        : []
      const text = events
        .filter((e: unknown) => {
          if (!isRecord(e)) return false
          const segs = e.segs
          return Array.isArray(segs) && segs.length > 0
        })
        .map((e: unknown) => {
          if (!isRecord(e) || !Array.isArray(e.segs)) return ''
          return e.segs
            .map((s: unknown) => {
              if (!isRecord(s)) return ''
              return String(s.utf8 ?? '')
            })
            .join('')
        })
        .join(' ')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      console.log('[transcript] JSON caption length:', text.length)
      return text.length > 100 ? text : null
    } else {
      const xml = await res.text()
      const text = xml
        .replace(/<text[^>]*>/g, '')
        .replace(/<\/text>/g, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      console.log('[transcript] XML caption length:', text.length)
      return text.length > 100 ? text : null
    }
  } catch (err) {
    console.error('[transcript] fetchTimedTextXML failed:', err)
    return null
  }
}

async function fetchViaTimedText(videoId: string): 
  Promise<string | null> {
  try {
    console.log('[transcript] Fetching YouTube page...')

    const pageRes = await fetch(
      `https://www.youtube.com/watch?v=${videoId}`,
      {
        headers: {
          'User-Agent': 
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' +
            ' AppleWebKit/537.36 (KHTML, like Gecko)' +
            ' Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        signal: AbortSignal.timeout(20000),
      }
    )

    if (!pageRes.ok) {
      console.error('[transcript] Page fetch failed:', pageRes.status)
      return null
    }

    const html = await pageRes.text()
    console.log('[transcript] Page HTML length:', html.length)

    // Log a snippet to confirm we got real page content
    const hasYtInitialData = html.includes('ytInitialPlayerResponse')
    const hasCaptionTracks = html.includes('captionTracks')
    console.log('[transcript] Has ytInitialPlayerResponse:', 
      hasYtInitialData)
    console.log('[transcript] Has captionTracks:', hasCaptionTracks)

    if (!hasCaptionTracks) {
      console.log('[transcript] No captionTracks in page — ' +
        'video may truly have no captions')
      return null
    }

    // Try multiple regex patterns to extract caption URL
    const patterns = [
      /"baseUrl":"(https:\\\/\\\/www\.youtube\.com\\\/api\\\/timedtext[^"]+)"/,
      /"baseUrl":"(https:\/\/www\.youtube\.com\/api\/timedtext[^"]+)"/,
      /{"baseUrl":"([^"]*timedtext[^"]*lang[^"]*en[^"]*)"/,
      /{"baseUrl":"([^"]*timedtext[^"]*)"/,
      /"baseUrl":"([^"]*timedtext[^"]*)"/,
    ]

    let captionUrl: string | null = null

    for (const pattern of patterns) {
      const match = html.match(pattern)
      if (match?.[1]) {
        captionUrl = match[1]
          .replace(/\\u0026/g, '&')
          .replace(/\\\//g, '/')
          .replace(/\\"/g, '"')
          .replace(/\\/g, '')
        console.log('[transcript] Found URL with pattern:', 
          pattern.toString().slice(0, 50))
        console.log('[transcript] Caption URL preview:', 
          captionUrl.slice(0, 100))
        break
      }
    }

    if (!captionUrl) {
      console.log('[transcript] Could not extract caption URL')

      // Last resort: extract the full captionTracks JSON blob
      const jsonMatch = html.match(
        /"captionTracks":(\[[\s\S]*?\])/
      )
      if (jsonMatch?.[1]) {
        try {
          const tracks: unknown = JSON.parse(
            jsonMatch[1].replace(/\\u0026/g, '&')
          )
          if (!Array.isArray(tracks) || tracks.length === 0) {
            // leave captionUrl null
          } else {
            console.log('[transcript] Parsed captionTracks:',
              tracks.length, 'tracks')
            const enTrack =
              tracks.find(
                (t: unknown) =>
                  isRecord(t) && t.languageCode === 'en'
              ) || tracks[0]
            if (
              isRecord(enTrack) &&
              typeof enTrack.baseUrl === 'string'
            ) {
              captionUrl = enTrack.baseUrl
              console.log('[transcript] Got URL from JSON parse')
            }
          }
        } catch (e) {
          console.error('[transcript] JSON parse of tracks failed:', e)
        }
      }
    }

    if (!captionUrl) {
      console.log('[transcript] All URL extraction methods failed')
      return null
    }

    return await fetchTimedTextXML(captionUrl)

  } catch (err) {
    console.error('[transcript] timedtext scrape failed:', err)
    return null
  }
}

async function fetchViaYouTubeTranscript(
  videoId: string
): Promise<string | null> {
  try {
    console.log('[transcript] Trying youtube-transcript...')

    const transcriptArray = await YoutubeTranscript
      .fetchTranscript(videoId, { lang: 'en' })

    if (!transcriptArray || transcriptArray.length === 0) {
      console.log('[transcript] youtube-transcript: empty')
      return null
    }

    const text = transcriptArray
      .map((item: unknown) => {
        if (!isRecord(item)) return ''
        return String(item.text ?? '')
      })
      .join(' ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    console.log('[transcript] youtube-transcript length:', 
      text.length)

    return text.length > 100 ? text : null

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[transcript] youtube-transcript failed:',
      msg)
    return null
  }
}

async function fetchViaKome(videoId: string): 
  Promise<string | null> {
  try {
    const res = await fetch(
      'https://api.kome.ai/api/tools/youtube-transcripts',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: videoId, format: true }),
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    const text = data?.transcript ?? ''
    return text.length > 100 ? text : null
  } catch {
    return null
  }
}

async function fetchViaThirdParty(): Promise<string | null> {
  // Third-party transcript API placeholder
  // Configure with your preferred transcript service
  try {
    // Disabled by default - add API endpoint and key to .env.local
    // Example: THIRD_PARTY_TRANSCRIPT_API_URL, THIRD_PARTY_TRANSCRIPT_API_KEY
    return null
  } catch (err) {
    console.error('[transcript] Third-party API failed:', err)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, manualTranscript } = await req.json()

    if (manualTranscript?.trim()) {
      return NextResponse.json({
        transcript: manualTranscript.trim(),
        source: 'manual',
      })
    }

    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL.' },
        { status: 400 }
      )
    }

    console.log('[transcript] Starting for videoId:', videoId)

    // Strategy 1: youtube-transcript package
    let transcript = await fetchViaYouTubeTranscript(videoId)
    if (transcript) {
      console.log('[transcript] Success via youtube-transcript')
      return NextResponse.json({
        transcript,
        source: 'youtube-transcript'
      })
    }

    // Strategy 2: timedtext page scrape
    console.log('[transcript] Trying timedtext scrape...')
    transcript = await fetchViaTimedText(videoId)
    if (transcript) {
      console.log('[transcript] Success via timedtext')
      return NextResponse.json({
        transcript,
        source: 'timedtext'
      })
    }

    // Strategy 3: third-party API
    console.log('[transcript] Trying third-party API...')
    transcript = await fetchViaThirdParty()
    if (transcript) {
      console.log('[transcript] Success via third-party')
      return NextResponse.json({
        transcript,
        source: 'third-party'
      })
    }

    // Strategy 4: kome.ai
    console.log('[transcript] Trying kome.ai...')
    transcript = await fetchViaKome(videoId)
    if (transcript) {
      console.log('[transcript] Success via kome')
      return NextResponse.json({
        transcript,
        source: 'kome'
      })
    }

    console.log('[transcript] All strategies failed:', videoId)
    return NextResponse.json(
      {
        error: 'Could not extract transcript from this video.',
        suggestion:
          'Open YouTube → click the three-dot menu ' +
          'below the video → click "Show transcript" ' +
          '→ copy all text and paste it manually.',
      },
      { status: 400 }
    )

  } catch (err) {
    console.error('[transcript] Internal error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
