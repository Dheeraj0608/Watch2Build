import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    gemini: !!process.env.GEMINI_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
    groqLength: process.env.GROQ_API_KEY?.length ?? 0,
    groqFirst4: process.env.GROQ_API_KEY?.slice(0, 4) ?? 'none',
  })
}