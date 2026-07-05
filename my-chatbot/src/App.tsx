import { useEffect, useRef, useState, useCallback } from 'react'

const TOPIC_QUESTIONS: Record<string, string> = {
  intro: "Tell me about Ayesha's professional summary.",
  education: "What is Ayesha's educational background?",
  skills: "List Ayesha's technical skills.",
  projects: "What projects has Ayesha worked on?",
  experience: "Describe Ayesha's work experience.",
  certifications: "What certifications does Ayesha have?",
  hobbies: "What are Ayesha's hobbies and extracurriculars?",
  contact: "How can I contact Ayesha?",
}

const TABS = [
  { key: 'intro', label: '✦ Intro' },
  { key: 'education', label: '🎓 Education' },
  { key: 'skills', label: '⚡ Skills' },
  { key: 'projects', label: '🚀 Projects' },
  { key: 'experience', label: '💼 Experience' },
  { key: 'certifications', label: '📜 Certs' },
  { key: 'hobbies', label: '🏸 Hobbies' },
  { key: 'contact', label: '✉ Contact' },
]

type Role = 'user' | 'bot'
interface Msg { id: number; role: Role; text: string; ts: string }

let nextId = 1
const STORAGE_KEY = 'ayesha_chat_v2'

function ts() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function loadHistory(): Msg[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(messages: Msg[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // ignore storage errors
  }
}

async function fetchReply(question: string): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    })

    if (response.ok) {
      const data = await response.json()
      const reply = data?.reply?.trim()
      if (reply) return reply
    }
  } catch {
    // fall back below
  }

  await new Promise((resolve) => setTimeout(resolve, 800))
  return `You asked: "${question}". This is a mock reply because no local backend is running yet.`
}

function GirlAvatar({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ga-bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4c1d95" />
          <stop offset="1" stopColor="#0e7490" />
        </linearGradient>
        <linearGradient id="ga-skin" x1="30" y1="20" x2="70" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fcd9b0" />
          <stop offset="1" stopColor="#f4a96a" />
        </linearGradient>
        <linearGradient id="ga-hair" x1="20" y1="10" x2="80" y2="55" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1c1008" />
          <stop offset="1" stopColor="#3b1f08" />
        </linearGradient>
        <linearGradient id="ga-shirt" x1="20" y1="65" x2="80" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6d28d9" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
        <clipPath id="ga-clip">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        <radialGradient id="ga-cheek" cx="50%" cy="50%" r="50%">
          <stop stopColor="#f87171" stopOpacity="0.45" />
          <stop offset="1" stopColor="#f87171" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#ga-bg)" />
      <g clipPath="url(#ga-clip)">
        <ellipse cx="50" cy="95" rx="30" ry="22" fill="url(#ga-shirt)" />
        <rect x="44" y="60" width="12" height="12" rx="4" fill="url(#ga-skin)" />
        <ellipse cx="50" cy="36" rx="26" ry="27" fill="url(#ga-hair)" />
        <ellipse cx="50" cy="38" rx="20" ry="22" fill="url(#ga-skin)" />
        <path d="M24 30 Q26 8 50 10 Q74 8 76 30 Q72 15 50 15 Q28 15 24 30Z" fill="url(#ga-hair)" />
        <path d="M30 32 Q22 48 24 62 Q27 52 30 46Z" fill="url(#ga-hair)" />
        <path d="M70 32 Q78 48 76 62 Q73 52 70 46Z" fill="url(#ga-hair)" />
        <path d="M50 10 Q52 16 51 22" stroke="rgba(255,255,255,0.07)" strokeWidth="2" strokeLinecap="round" />
        <path d="M37 30 Q41 27 45 30" stroke="#3b1f08" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M55 30 Q59 27 63 30" stroke="#3b1f08" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <ellipse cx="41" cy="36" rx="4.5" ry="5" fill="white" />
        <ellipse cx="59" cy="36" rx="4.5" ry="5" fill="white" />
        <circle cx="41" cy="37" r="3" fill="#2d1a0a" />
        <circle cx="59" cy="37" r="3" fill="#2d1a0a" />
        <circle cx="41" cy="37" r="1.5" fill="#1a0d04" />
        <circle cx="59" cy="37" r="1.5" fill="#1a0d04" />
        <circle cx="42.5" cy="35.5" r="1" fill="white" opacity="0.9" />
        <circle cx="60.5" cy="35.5" r="1" fill="white" opacity="0.9" />
        <path d="M37 32 Q38 30 39 31" stroke="#1c1008" strokeWidth="0.8" fill="none" />
        <path d="M44 31 Q45 29 46 30" stroke="#1c1008" strokeWidth="0.8" fill="none" />
        <path d="M55 31 Q56 29 57 30" stroke="#1c1008" strokeWidth="0.8" fill="none" />
        <path d="M62 32 Q63 30 64 31" stroke="#1c1008" strokeWidth="0.8" fill="none" />
        <path d="M48 43 Q50 46 52 43" stroke="#d4845a" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <ellipse cx="35" cy="44" rx="6" ry="4" fill="url(#ga-cheek)" />
        <ellipse cx="65" cy="44" rx="6" ry="4" fill="url(#ga-cheek)" />
        <path d="M42 50 Q50 57 58 50" stroke="#c0694b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M44 51 Q50 56 56 51" fill="#e07b6a" opacity="0.4" />
        <circle cx="30" cy="39" r="2.5" fill="#8b5cf6" opacity="0.8" />
        <circle cx="70" cy="39" r="2.5" fill="#8b5cf6" opacity="0.8" />
        <circle cx="30" cy="39" r="1" fill="#c4b5fd" />
        <circle cx="70" cy="39" r="1" fill="#c4b5fd" />
        <path d="M20 100 Q30 80 50 78 Q70 80 80 100Z" fill="rgba(139,92,246,0.35)" />
      </g>
    </svg>
  )
}

function BotIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="gi1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="gi2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect x="7" y="16" width="34" height="24" rx="8" fill="url(#gi1)" opacity="0.9" />
      <rect x="22.5" y="8" width="3" height="8" rx="1.5" fill="url(#gi1)" />
      <circle cx="24" cy="7" r="3.5" fill="url(#gi2)" />
      <circle cx="17" cy="27" r="4" fill="rgba(255,255,255,0.95)" />
      <circle cx="31" cy="27" r="4" fill="rgba(255,255,255,0.95)" />
      <circle cx="17" cy="27" r="2" fill="url(#gi1)" />
      <circle cx="31" cy="27" r="2" fill="url(#gi2)" />
      <circle cx="18" cy="26" r="0.8" fill="white" />
      <circle cx="32" cy="26" r="0.8" fill="white" />
      <rect x="17" y="33" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
      <rect x="1" y="20" width="6" height="10" rx="3" fill="url(#gi1)" opacity="0.6" />
      <rect x="41" y="20" width="6" height="10" rx="3" fill="url(#gi1)" opacity="0.6" />
    </svg>
  )
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>(() => {
    const saved = loadHistory()
    if (saved.length > 0) return saved
    return [{ id: nextId++, role: 'bot', text: '👋 Hi! Ask me anything about Ayesha', ts: ts() }]
  })
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [activeTab, setActiveTab] = useState('intro')
  const [mode, setMode] = useState<'text' | 'command' | 'voice_to_text' | 'voice_to_voice'>('text')
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [micActive, setMicActive] = useState(false)
  const [micStatus, setMicStatus] = useState<{ text: string; cls: string }>({ text: 'Ready', cls: '' })

  const chatRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const recRef = useRef<any>(null)

  useEffect(() => {
    saveHistory(messages)
  }, [messages])

  useEffect(() => {
    const el = chatRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, thinking])

  useEffect(() => {
    const speechApi = (window as Window & typeof globalThis & { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition
      || (window as Window & typeof globalThis & { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition

    if (!speechApi) {
      setMicStatus({ text: 'Not supported', cls: 'error' })
      return
    }

    const recognition = new speechApi()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.onstart = () => {
      setMicActive(true)
      setMicStatus({ text: 'Listening…', cls: 'listening' })
    }
    recognition.onresult = (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setMicStatus({ text: 'Processing…', cls: 'processing' })
    }
    recognition.onend = () => setMicActive(false)
    recognition.onerror = (event: { error: string }) => {
      setMicActive(false)
      if (event.error !== 'not-allowed' && event.error !== 'aborted') {
        setMicStatus({ text: 'Mic error', cls: 'error' })
        setTimeout(() => setMicStatus({ text: 'Ready', cls: '' }), 2500)
      } else {
        setMicStatus({ text: 'Ready', cls: '' })
      }
    }

    recRef.current = recognition
  }, [])

  const autoGrow = useCallback(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [])

  function speak(text: string) {
    if (!ttsEnabled || !window.speechSynthesis) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onstart = () => setMicStatus({ text: 'Speaking…', cls: 'speaking' })
    utterance.onend = () => setMicStatus({ text: 'Ready', cls: '' })
    utterance.onerror = () => setMicStatus({ text: 'Ready', cls: '' })
    window.speechSynthesis.speak(utterance)
  }

  async function handleSend(override?: string) {
    const q = (override ?? input).trim()
    if (!q || thinking) return
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'
    setMessages((prev) => [...prev, { id: nextId++, role: 'user', text: q, ts: ts() }])
    setThinking(true)
    const reply = await fetchReply(q)
    setThinking(false)
    setMessages((prev) => [...prev, { id: nextId++, role: 'bot', text: reply, ts: ts() }])
    if (mode === 'voice_to_voice') speak(reply)
    setMicStatus({ text: 'Ready', cls: '' })
  }

  useEffect(() => {
    if ((mode === 'voice_to_text' || mode === 'voice_to_voice' || mode === 'command') && micStatus.cls === 'processing' && input.trim()) {
      handleSend(input)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micStatus])

  function startMic() {
    try {
      recRef.current?.start()
    } catch {
      setMicStatus({ text: 'Mic error', cls: 'error' })
    }
  }

  function stopMic() {
    try {
      recRef.current?.stop()
    } catch {
      // ignore
    }
    setMicActive(false)
    setMicStatus({ text: 'Ready', cls: '' })
  }

  function clearChat() {
    if (!confirm('Clear all messages?')) return
    const welcome: Msg = { id: nextId++, role: 'bot', text: '👋 Hi! Ask me anything about Ayesha', ts: ts() }
    setMessages([welcome])
    localStorage.removeItem(STORAGE_KEY)
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text).catch(() => {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    })
  }

  const MIC_LABEL_MAP: Record<string, string> = {
    listening: '🎙 Listening…',
    processing: '⚙ Processing…',
    speaking: '🔊 Speaking…',
    error: '⚠ Error',
  }

  return (
    <div className="card">
      <div className="hdr">
        <div className="hdr-left">
          <div className="avatar-hero">
            <GirlAvatar size={52} />
          </div>
          <div>
            <div className="name-row">
              <h1 className="name">Ayesha Bashir</h1>
              <span className="role-badge">AI / ML Engineer</span>
            </div>
            <div className="contact-row">
              <span>📞 +92-306-9623910</span>
              <span>
                ✉ <a href="mailto:ayesha104bashir@gmail.com" className="clink">ayesha104bashir@gmail.com</a>
              </span>
              <span>📍 Lahore, PK</span>
              <a href="https://linkedin.com/in/ayesha-bashir-b0b976234" target="_blank" rel="noreferrer" className="pill-link">LinkedIn ↗</a>
              <a href="https://github.com/ayesha-bashir-ai" target="_blank" rel="noreferrer" className="pill-link">GitHub ↗</a>
            </div>
          </div>
        </div>
        <div className="skill-chips">
          {['YOLOv8', 'NLP', 'FastAPI', 'Django', 'OpenCV', 'PyTorch', 'PostgreSQL', 'Python', 'React'].map((skill) => (
            <span key={skill} className="chip">{skill}</span>
          ))}
        </div>
      </div>

      <div className="tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn${activeTab === tab.key ? ' tab-btn--active' : ''}`}
            onClick={() => {
              setActiveTab(tab.key)
              setInput(TOPIC_QUESTIONS[tab.key] ?? '')
              setTimeout(autoGrow, 0)
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="conv-hdr">
        <div className="conv-hdr-left">
          <span className="conv-dot" />
          <span className="conv-label">Conversation</span>
          <span className="conv-count">{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
        </div>
        <button className="clear-btn" onClick={clearChat} title="Clear chat">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
          Clear
        </button>
      </div>

      <div className="chat-win" ref={chatRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`msg${msg.role === 'user' ? ' msg--user' : ''}`}>
            <div className={`av${msg.role === 'bot' ? ' av--bot' : ' av--user'}`}>
              {msg.role === 'bot' ? <BotIcon size={18} /> : 'ME'}
            </div>
            <div className="bwrap">
              <div className={`bubble${msg.role === 'user' ? ' bubble--user' : ''}`}>{msg.text}</div>
              <div className={`meta${msg.role === 'user' ? ' meta--user' : ''}`}>
                <span className="tstamp">{msg.ts}</span>
                {msg.role === 'bot' && <CopyButton text={msg.text} onCopy={copyText} />}
              </div>
            </div>
          </div>
        ))}
        {thinking && (
          <div className="msg">
            <div className="av av--bot">
              <BotIcon size={18} />
            </div>
            <div className="typing-bubble">
              <span className="typing-lbl">Thinking</span>
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="input-area">
        <div className="ctrl-row">
          <div className="mode-group">
            {(['text', 'command', 'voice_to_text', 'voice_to_voice'] as const).map((m) => (
              <button key={m} className={`ctrl-btn${mode === m ? ' ctrl-btn--on' : ''}`} onClick={() => setMode(m)}>
                {m === 'text' ? '✏ Text' : m === 'command' ? '⌘ Cmd' : m === 'voice_to_text' ? '🎙→📝' : '🎙→🔊'}
              </button>
            ))}
          </div>
          <div className="voice-group">
            <button className={`voice-btn${micActive ? ' voice-btn--active' : ''}`} onClick={startMic} disabled={micActive}>
              Start
            </button>
            <button className="voice-btn" onClick={stopMic} disabled={!micActive}>
              Stop
            </button>
            <button
              className={`voice-btn${ttsEnabled ? ' voice-btn--tts' : ''}`}
              onClick={() => {
                setTtsEnabled((value) => !value)
                window.speechSynthesis?.cancel()
              }}
            >
              {ttsEnabled ? '🔊 TTS' : '🔇 TTS'}
            </button>
            <span className={`mic-status mic-status--${micStatus.cls || 'idle'}`}>
              {MIC_LABEL_MAP[micStatus.cls] ?? '● Ready'}
            </span>
          </div>
        </div>

        <div className="send-row">
          <div className="input-wrap">
            <span className="input-icon">
              <BotIcon size={20} />
            </span>
            <textarea
              ref={taRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value)
                autoGrow()
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask me anything about Ayesha…"
              rows={1}
              disabled={thinking}
              className="ta"
            />
          </div>
          <button className={`send-btn${thinking || !input.trim() ? ' send-btn--off' : ''}`} onClick={() => handleSend()} disabled={thinking || !input.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <div className="footer-note">⚡ Powered by Ayesha's CV · GPT-4o mini</div>
      </div>

      <style>{`
        .card {
          width: 100%; max-width: 1240px; height: 95vh; max-height: 880px; display: flex; flex-direction: column;
          border-radius: 2rem; background: linear-gradient(145deg, rgba(17,15,36,0.92) 0%, rgba(10,10,26,0.96) 100%);
          backdrop-filter: blur(32px) saturate(180%); border: 1px solid rgba(139,92,246,0.25);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06) inset, 0 40px 80px -20px rgba(0,0,0,0.9), 0 0 80px -20px rgba(139,92,246,0.3), 0 0 160px -40px rgba(6,182,212,0.15);
          overflow: hidden; font-family: 'Inter', sans-serif; position: relative;
        }
        .card::before {
          content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(139,92,246,0.07) 0%, transparent 30%);
          pointer-events: none; border-radius: 2rem;
        }
        .hdr { padding: 1.1rem 1.8rem 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; flex-wrap: wrap; gap: 0.8rem 1.4rem; align-items: flex-start; justify-content: space-between; background: rgba(255,255,255,0.02); flex-shrink: 0; }
        .hdr-left { display: flex; gap: 1rem; align-items: flex-start; }
        .avatar-hero { width: 58px; height: 58px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 3px rgba(139,92,246,0.5), 0 0 28px rgba(139,92,246,0.4); animation: glow-ring 3s ease-in-out infinite; overflow: hidden; background: transparent; }
        .name-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.3rem; }
        .name { font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; font-weight: 700; letter-spacing: -0.04em; background: linear-gradient(130deg, #ffffff 0%, #c4b5fd 40%, #06b6d4 80%, #67e8f9 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 4s linear infinite; }
        .role-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.25rem 0.9rem; border-radius: 999px; background: linear-gradient(135deg, rgba(139,92,246,0.25), rgba(6,182,212,0.2)); border: 1px solid rgba(139,92,246,0.4); color: #c4b5fd; white-space: nowrap; }
        .contact-row { display: flex; flex-wrap: wrap; gap: 0.35rem 1.1rem; font-size: 0.74rem; color: #94a3b8; }
        .clink { color: #94a3b8; text-decoration: none; }
        .clink:hover { color: #c4b5fd; }
        .pill-link { color: #67e8f9; text-decoration: none; font-size: 0.68rem; font-weight: 600; padding: 0.15rem 0.7rem; border-radius: 999px; border: 1px solid rgba(6,182,212,0.3); background: rgba(6,182,212,0.07); transition: all 0.2s; }
        .pill-link:hover { background: rgba(6,182,212,0.18); }
        .skill-chips { display: flex; flex-wrap: wrap; gap: 0.3rem; align-items: flex-start; }
        .chip { font-size: 0.67rem; font-weight: 600; color: #a5b4fc; letter-spacing: 0.02em; padding: 0.2rem 0.7rem; border-radius: 999px; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2); transition: all 0.2s; }
        .chip:hover { background: rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.4); }
        .tab-bar { display: flex; flex-wrap: wrap; gap: 0.3rem 0.4rem; padding: 0.55rem 1.8rem; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.15); flex-shrink: 0; }
        .tab-btn { padding: 0.3rem 1rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #64748b; font-family: 'Inter', sans-serif; transition: all 0.2s; white-space: nowrap; }
        .tab-btn:hover { color: #a5b4fc; border-color: rgba(139,92,246,0.3); background: rgba(139,92,246,0.08); }
        .tab-btn--active { background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2)); border-color: rgba(139,92,246,0.5); color: #e0e7ff; box-shadow: 0 0 16px rgba(139,92,246,0.25); }
        .conv-hdr { display: flex; align-items: center; justify-content: space-between; padding: 0.4rem 1.8rem; border-bottom: 1px solid rgba(255,255,255,0.04); background: rgba(0,0,0,0.1); flex-shrink: 0; }
        .conv-hdr-left { display: flex; align-items: center; gap: 0.6rem; }
        .conv-dot { width: 7px; height: 7px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #06b6d4); box-shadow: 0 0 8px rgba(139,92,246,0.7); animation: glow-ring 2s ease-in-out infinite; display: inline-block; }
        .conv-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.25); }
        .conv-count { font-size: 0.63rem; color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); padding: 0.1rem 0.6rem; border-radius: 999px; border: 1px solid rgba(255,255,255,0.06); }
        .clear-btn { display: flex; align-items: center; gap: 0.35rem; font-size: 0.68rem; font-weight: 600; color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 999px; padding: 0.25rem 0.8rem; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s; }
        .clear-btn:hover { color: #f87171; border-color: rgba(248,113,113,0.3); background: rgba(248,113,113,0.07); }
        .chat-win { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 1.2rem 1.8rem; display: flex; flex-direction: column; gap: 1rem; scroll-behavior: smooth; background: radial-gradient(ellipse 60% 40% at 20% 80%, rgba(139,92,246,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(6,182,212,0.05) 0%, transparent 60%), rgba(0,0,0,0.2); }
        .msg { display: flex; align-items: flex-start; gap: 0.75rem; max-width: 82%; min-width: 0; animation: fadeSlideUp 0.3s ease; }
        .msg--user { align-self: flex-end; flex-direction: row-reverse; }
        .av { width: 36px; height: 36px; border-radius: 0.75rem; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 800; letter-spacing: 0.04em; }
        .av--bot { background: linear-gradient(135deg, rgba(139,92,246,0.25), rgba(6,182,212,0.15)); border: 1px solid rgba(139,92,246,0.4); box-shadow: 0 0 16px rgba(139,92,246,0.2); }
        .av--user { background: linear-gradient(135deg, rgba(236,72,153,0.3), rgba(139,92,246,0.25)); border: 1px solid rgba(236,72,153,0.4); color: #fce7f3; font-size: 0.58rem; }
        .bwrap { display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; flex: 1; }
        .bubble { padding: 0.75rem 1.1rem; border-radius: 0 1.2rem 1.2rem 1.2rem; font-size: 0.875rem; line-height: 1.6; color: #e2e8f0; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(12px); word-break: break-word; white-space: pre-wrap; overflow-wrap: break-word; width: 100%; position: relative; }
        .bubble--user { background: linear-gradient(135deg, #7c3aed, #6d28d9); border: none; border-radius: 1.2rem 0 1.2rem 1.2rem; box-shadow: 0 8px 32px rgba(124,58,237,0.4), 0 0 0 1px rgba(139,92,246,0.3) inset; color: #ede9fe; }
        .meta { display: flex; align-items: center; gap: 0.5rem; padding: 0 0.3rem; }
        .meta--user { justify-content: flex-end; }
        .tstamp { font-size: 0.6rem; color: rgba(255,255,255,0.18); letter-spacing: 0.02em; }
        .typing-bubble { display: flex; align-items: center; gap: 0.8rem; padding: 0.75rem 1.1rem; border-radius: 0 1.2rem 1.2rem 1.2rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(12px); }
        .typing-lbl { font-size: 0.8rem; color: #94a3b8; font-style: italic; }
        .dots { display: flex; gap: 0.35rem; }
        .dots span { width: 7px; height: 7px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #06b6d4); display: inline-block; animation: pulse-dot 1.4s ease-in-out infinite; }
        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }
        .input-area { padding: 0.75rem 1.8rem 1rem; border-top: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.2); flex-shrink: 0; }
        .ctrl-row { display: flex; flex-wrap: wrap; gap: 0.4rem 1rem; align-items: center; margin-bottom: 0.6rem; }
        .mode-group, .voice-group { display: flex; flex-wrap: wrap; gap: 0.3rem; align-items: center; }
        .ctrl-btn { font-size: 0.68rem; font-weight: 600; padding: 0.25rem 0.8rem; border-radius: 999px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #64748b; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s; }
        .ctrl-btn:hover { color: #a5b4fc; border-color: rgba(139,92,246,0.3); }
        .ctrl-btn--on { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.45); color: #c4b5fd; box-shadow: 0 0 12px rgba(139,92,246,0.2); }
        .voice-btn { font-size: 0.68rem; font-weight: 600; padding: 0.25rem 0.8rem; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #64748b; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s; }
        .voice-btn:hover:not(:disabled) { color: #a5b4fc; border-color: rgba(139,92,246,0.3); }
        .voice-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .voice-btn--active { border-color: rgba(34,197,94,0.5); color: #4ade80; background: rgba(34,197,94,0.08); }
        .voice-btn--tts { border-color: rgba(6,182,212,0.4); color: #67e8f9; background: rgba(6,182,212,0.08); }
        .mic-status { font-size: 0.68rem; font-weight: 600; padding: 0.22rem 0.8rem; border-radius: 999px; border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.03); }
        .mic-status--listening { color: #4ade80; border-color: rgba(74,222,128,0.35); background: rgba(74,222,128,0.07); }
        .mic-status--processing { color: #fbbf24; border-color: rgba(251,191,36,0.35); background: rgba(251,191,36,0.07); }
        .mic-status--speaking { color: #67e8f9; border-color: rgba(103,232,249,0.35); background: rgba(103,232,249,0.07); }
        .mic-status--error { color: #f87171; border-color: rgba(248,113,113,0.35); background: rgba(248,113,113,0.07); }
        .send-row { display: flex; gap: 0.75rem; align-items: flex-end; }
        .input-wrap { flex: 1; position: relative; display: flex; align-items: center; min-width: 0; }
        .input-icon { position: absolute; left: 0.9rem; display: flex; align-items: center; pointer-events: none; z-index: 2; opacity: 0.7; }
        .ta { flex: 1; width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 1.25rem; padding: 0.7rem 1.2rem 0.7rem 3rem; font-size: 0.87rem; font-family: 'Inter', sans-serif; color: #e2e8f0; resize: none; max-height: 120px; min-height: 46px; line-height: 1.5; outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
        .ta::placeholder { color: #475569; }
        .ta:focus { border-color: rgba(139,92,246,0.6); background: rgba(139,92,246,0.06); box-shadow: 0 0 0 3px rgba(139,92,246,0.15), 0 0 20px rgba(139,92,246,0.1); }
        .ta:disabled { opacity: 0.5; cursor: not-allowed; }
        .send-btn { width: 46px; height: 46px; border-radius: 1rem; flex-shrink: 0; border: none; background: linear-gradient(135deg, #7c3aed, #0891b2); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(124,58,237,0.45); transition: all 0.2s; position: relative; overflow: hidden; }
        .send-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent); border-radius: inherit; }
        .send-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(124,58,237,0.55); }
        .send-btn--off { opacity: 0.35; cursor: not-allowed; }
        .footer-note { text-align: center; margin-top: 0.5rem; font-size: 0.62rem; color: rgba(255,255,255,0.15); letter-spacing: 0.04em; }
        button:not(:disabled) { cursor: pointer; }
        @keyframes glow-ring { 0%, 100% { box-shadow: 0 0 0 3px rgba(139,92,246,0.5), 0 0 28px rgba(139,92,246,0.4); } 50% { box-shadow: 0 0 0 4px rgba(6,182,212,0.35), 0 0 36px rgba(6,182,212,0.25); } }
        @keyframes shimmer { to { background-position: 200% center; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot { 0%, 80%, 100% { transform: scale(0.8); opacity: 0.45; } 40% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  )
}

function CopyButton({ text, onCopy }: { text: string; onCopy: (t: string) => void }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        onCopy(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      style={{
        background: 'none',
        border: 'none',
        color: copied ? '#4ade80' : 'rgba(255,255,255,0.2)',
        cursor: 'pointer',
        fontSize: '0.65rem',
        padding: '0.1rem 0.35rem',
        borderRadius: 4,
        fontFamily: 'Inter, sans-serif',
        transition: 'color 0.2s',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}
