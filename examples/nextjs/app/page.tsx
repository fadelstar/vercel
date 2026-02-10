'use client'
import { useState } from 'react'

export default function Home() {
  const [listening, setListening] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [language, setLanguage] = useState('en-US')

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Voice recognition not supported')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.start()
    setListening(true)

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      setQuery(text)
      setListening(false)
      fetchNews(text)
    }

    recognition.onerror = () => setListening(false)
  }

  const fetchNews = async (text: string) => {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        text
      )}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    )
    const data = await res.json()
    setResults(data.articles || [])
  }

  return (
    <main style={{ padding: 30, maxWidth: 700, margin: 'auto' }}>
      <h1>🎙️ AI Voice News Finder</h1>

      <select onChange={(e) => setLanguage(e.target.value)}>
        <option value="en-US">English</option>
        <option value="fr-FR">French</option>
      </select>

      <br /><br />

      <button onClick={startListening}>
        {listening ? 'Listening...' : '🎤 Speak'}
      </button>

      {query && <p><strong>You said:</strong> {query}</p>}

      <ul>
        {results.map((a, i) => (
          <li key={i}>
            <a href={a.url} target="_blank">{a.title}</a>
          </li>
        ))}
      </ul>
    </main>
  )
}
