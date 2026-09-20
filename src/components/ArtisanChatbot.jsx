import { useState, useEffect, useRef, useCallback } from 'react'
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  RefreshCw,
  Mic,
  MicOff,
  Bot,
  ExternalLink,
  ChevronDown,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Eye,
  AudioWaveform,
  Play,
  Pause,
  Square,
  SlidersHorizontal,
  Settings2,
  RotateCcw,
  Languages,
  Globe,
  Radio,
  Headphones
} from 'lucide-react'
import { processUserMessage, detectLanguage } from '../utils/aiChatEngine'
import {
  VOICE_PERSONAS,
  SPEAKING_SPEEDS,
  HumanVoicePlayer,
  rankBrowserNeuralVoice,
  naturalizeTextForSpeech
} from '../utils/humanVoiceEngine'
import { useCart } from '../context/CartContext'
import { whatsapp, products } from '../data/products'
import WhatsAppIcon from './WhatsAppIcon'

const newImages = import.meta.glob('../assets/products-new/*', { eager: true, import: 'default' })
const legacyImages = import.meta.glob('../assets/products/*', { eager: true, import: 'default' })

const resolveProductImage = (image) => {
  return (
    newImages[`../assets/products-new/${image}`] ||
    legacyImages[`../assets/products/${image}`] ||
    image
  )
}

/**
 * Languages supported by Gulabi AI (Zero-Emoji Edition)
 */
export const SUPPORTED_LANGUAGES = [
  { id: 'en', label: 'English', code: 'EN', tag: 'Global' },
  { id: 'hi', label: 'हिंदी', code: 'HI', tag: 'Hindi' }
]

export default function ArtisanChatbot({ onSelectProduct }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState(null)
  const [streamedText, setStreamedText] = useState('')
  const [isListening, setIsListening] = useState(false)

  // Language state: 'en', 'hi'
  const [currentLanguage, setCurrentLanguage] = useState('en')

  // Real Human Voice Synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speakingMessageId, setSpeakingMessageId] = useState(null)
  const [speakingSentenceIndex, setSpeakingSentenceIndex] = useState(0)
  const [totalSentences, setTotalSentences] = useState(0)
  const [selectedPersona, setSelectedPersona] = useState('jaipur')
  const [speakingSpeed, setSpeakingSpeed] = useState(1.0)
  const [showVoiceSettings, setShowVoiceSettings] = useState(false)
  const [activeEngineName, setActiveEngineName] = useState('Studio Neural HD (Real Human Voice)')
  const [testingPersonaId, setTestingPersonaId] = useState(null)

  const [hasUnread, setHasUnread] = useState(true)
  const [copiedId, setCopiedId] = useState(null)
  const [feedbackMap, setFeedbackMap] = useState({})

  const cart = useCart()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const streamTimerRef = useRef(null)
  const voicePlayerRef = useRef(null)

  // Initialize HumanVoicePlayer with reactive state callbacks
  useEffect(() => {
    const player = new HumanVoicePlayer({
      onStart: ({ messageId, totalChunks, currentChunk, persona, engine }) => {
        setIsSpeaking(true)
        setIsPaused(false)
        setSpeakingMessageId(messageId)
        setTotalSentences(totalChunks)
        setSpeakingSentenceIndex(currentChunk)
        if (engine) setActiveEngineName(engine === 'Studio Neural HD' ? 'Studio Neural HD (Real Human Voice)' : engine)
      },
      onProgress: ({ messageId, totalChunks, currentChunk }) => {
        setSpeakingMessageId(messageId)
        setSpeakingSentenceIndex(currentChunk)
        setTotalSentences(totalChunks)
      },
      onEnd: () => {
        setIsSpeaking(false)
        setIsPaused(false)
        setSpeakingMessageId(null)
        setSpeakingSentenceIndex(0)
        setTotalSentences(0)
        setTestingPersonaId(null)
      },
      onStateChange: ({ isPlaying, isPaused }) => {
        setIsSpeaking(isPlaying)
        setIsPaused(isPaused)
        if (!isPlaying) {
          setTestingPersonaId(null)
        }
      }
    })

    player.setPersona(selectedPersona)
    player.setLanguage(currentLanguage)
    player.setSpeed(speakingSpeed)
    voicePlayerRef.current = player

    return () => {
      player.stop()
    }
  }, [])

  // Synchronize persona, language, and speed with player
  useEffect(() => {
    if (voicePlayerRef.current) {
      voicePlayerRef.current.setPersona(selectedPersona)
      voicePlayerRef.current.setLanguage(currentLanguage)
      voicePlayerRef.current.setSpeed(speakingSpeed)
    }
  }, [selectedPersona, currentLanguage, speakingSpeed])

  // Initial welcome message (Zero-Emoji)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Namaste. I'm **Gulabi**, your Jaipur Shopping & Craft Concierge for *Craft of Pink City*.\n\n**Language:** You can chat with me in **English** or **हिंदी**.\n\nAsk me anything about:\n• **Quilted Travel Duffles & Tote Bags**\n• **Wholesale & Bulk Orders (MOQ 25 pcs)** with custom brand tags\n• **Bag Sizing & Laptop Fit (13"–16")**\n• **Authentic Jaipuri Fabric Care**`,
      quickReplies: [
        'Show Bestsellers',
        'Quilted Travel Duffles',
        'Wholesale & Bulk (MOQ 25)',
        'Laptop Bag Sizes',
        'हिंदी'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setHasUnread(false)
    }
  }, [messages, isOpen, isTyping, streamedText])

  // Clean stop helper
  const stopSpeaking = () => {
    voicePlayerRef.current?.stop()
    setIsSpeaking(false)
    setIsPaused(false)
    setSpeakingMessageId(null)
    setSpeakingSentenceIndex(0)
    setTotalSentences(0)
    setTestingPersonaId(null)
  }

  // Stop voice speech if window closed
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking()
    }
  }, [isOpen])

  // Toggle pause/resume
  const togglePauseSpeech = () => {
    if (isPaused) {
      voicePlayerRef.current?.resume()
    } else {
      voicePlayerRef.current?.pause()
    }
  }

  // Stream simulation effect
  const streamBotResponse = (botMsg) => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current)
    const fullText = botMsg.text
    setStreamingMessageId(botMsg.id)
    setStreamedText('')

    let charIndex = 0
    const stepSize = Math.max(2, Math.floor(fullText.length / 35))

    streamTimerRef.current = setInterval(() => {
      charIndex += stepSize
      if (charIndex >= fullText.length) {
        clearInterval(streamTimerRef.current)
        setStreamedText(fullText)
        setStreamingMessageId(null)
      } else {
        setStreamedText(fullText.substring(0, charIndex))
      }
    }, 18)
  }

  const skipStreaming = () => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current)
      setStreamingMessageId(null)
    }
  }

  // Speak text with Ultra-Realistic Human Voice Engine
  const handleSpeakText = (messageId, rawText, overridePersona = null, overrideLang = null) => {
    if (isSpeaking && speakingMessageId === messageId && !overridePersona && !overrideLang) {
      stopSpeaking()
      return
    }

    stopSpeaking()
    const persona = overridePersona || selectedPersona
    const lang = overrideLang || currentLanguage

    voicePlayerRef.current?.speak(rawText, {
      messageId,
      personaId: persona,
      lang,
      speed: speakingSpeed
    })
  }

  // Test / Preview Persona Voice sample
  const handleTestPersonaVoice = (persona) => {
    if (testingPersonaId === persona.id && isSpeaking) {
      stopSpeaking()
      return
    }

    stopSpeaking()
    setTestingPersonaId(persona.id)
    const sample = persona.sampleText[currentLanguage] || persona.sampleText.en

    voicePlayerRef.current?.speak(sample, {
      messageId: `test-${persona.id}`,
      personaId: persona.id,
      lang: currentLanguage,
      speed: speakingSpeed
    })
  }

  const handlePersonaChange = (newPersona) => {
    setSelectedPersona(newPersona)
    if (isSpeaking && speakingMessageId) {
      const activeMsg = messages.find((m) => m.id === speakingMessageId)
      if (activeMsg) {
        handleSpeakText(speakingMessageId, activeMsg.text, newPersona, currentLanguage)
      }
    }
  }

  const handleLanguageChange = (newLang) => {
    setCurrentLanguage(newLang)
    if (isSpeaking && speakingMessageId) {
      const activeMsg = messages.find((m) => m.id === speakingMessageId)
      if (activeMsg) {
        handleSpeakText(speakingMessageId, activeMsg.text, selectedPersona, newLang)
      }
    }
  }

  const handleSpeedChange = (newSpeed) => {
    setSpeakingSpeed(newSpeed)
    voicePlayerRef.current?.setSpeed(newSpeed)
  }

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice dictation is not supported in this browser. Please type your message.')
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN'
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
        handleSendMessage(transcript)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch {
      setIsListening(false)
    }
  }

  const handleSendMessage = (textToSend = null) => {
    const query = (textToSend || input).trim()
    if (!query) return

    if (query === 'हिंदी' || query.toLowerCase() === 'hindi') {
      handleLanguageChange('hi')
    } else if (query.toLowerCase() === 'english') {
      handleLanguageChange('en')
    }

    const detected = detectLanguage(query)
    const effectiveLang = (detected !== 'en') ? detected : currentLanguage

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const updatedHistory = [...messages, userMsg]
    setMessages(updatedHistory)
    if (!textToSend) setInput('')
    setIsTyping(true)

    stopSpeaking()

    setTimeout(() => {
      const botResponse = processUserMessage(query, cart, updatedHistory, effectiveLang)
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse.text,
        quickReplies: botResponse.quickReplies,
        products: botResponse.products,
        action: botResponse.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
      streamBotResponse(botMsg)
    }, 380)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    handleSendMessage()
  }

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleFeedback = (id, type) => {
    setFeedbackMap((prev) => ({ ...prev, [id]: type }))
  }

  const handleActionClick = (action) => {
    if (!action) return
    if (action.type === 'OPEN_CART') {
      cart.setIsCartOpen(true)
    } else if (action.type === 'LINK') {
      if (action.internalAnchor) {
        setIsOpen(false)
        window.location.hash = action.internalAnchor
      } else if (action.url) {
        window.open(action.url, '_blank', 'noopener,noreferrer')
      }
    }
  }

  const resetChat = () => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current)
    stopSpeaking()
    const welcome = currentLanguage === 'hi'
      ? `चैट सत्र रीसेट हो गया। मैं **गुलाबी** हूँ। आज आपके लिए क्या जयपुरी बैग्स या थोक कोटेशन तैयार करूँ?`
      : `Chat session reset. I'm **Gulabi**. What handcrafted styles or wholesale quotes can I prepare for you?`

    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: welcome,
        quickReplies: [
          'Show Bestsellers',
          'Quilted Travel Duffles',
          'Wholesale & Bulk (MOQ 25)',
          'How are bags made?'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  const currentPersonaObj = VOICE_PERSONAS.find((p) => p.id === selectedPersona) || VOICE_PERSONAS[0]
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.id === currentLanguage) || SUPPORTED_LANGUAGES[0]

  return (
    <>
      {/* Floating Aura Launcher */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-ink via-[#2a1728] to-ink p-1 pl-4 pr-5 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-rose/40 ring-1 ring-white/20"
            aria-label="Open AI Craft Assistant Gulabi"
          >
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-rose via-saffron to-rose opacity-75 blur-sm group-hover:opacity-100 animate-pulse transition duration-500" />

            <div className="relative flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-rose to-saffron text-white shadow-inner">
                <Sparkles size={18} className="animate-pulse" />
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full bg-saffron ring-2 ring-ink" />
                )}
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-wide text-white">Ask Gulabi AI</span>
                  <span className="rounded bg-rose/30 px-1 py-0.2 text-[9px] font-semibold uppercase text-rose-200">Pro</span>
                </div>
                <p className="text-[10px] text-white/70">English · हिंदी</p>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Main AI Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col bg-ivory shadow-2xl border border-ink/15 transition-all duration-300 animate-slideUp overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10 sm:max-w-4xl sm:mx-auto rounded-3xl'
              : 'bottom-4 right-4 w-[95vw] sm:w-[440px] h-[640px] max-h-[88vh] rounded-3xl'
          }`}
          role="dialog"
          aria-label="Gulabi AI Shopping Assistant"
        >
          {/* Header */}
          <div className="relative flex items-center justify-between border-b border-ink/10 bg-gradient-to-r from-ink via-[#2b172a] to-ink px-4 sm:px-5 py-3 text-white shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose to-saffron text-white shadow-md shrink-0">
                <Sparkles size={18} className="animate-spin-slow" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-emerald-500" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-base sm:text-lg font-bold tracking-wide text-white">Gulabi AI</h3>
                  <span className="rounded-full bg-gradient-to-r from-rose/40 to-saffron/40 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-saffron border border-saffron/30">
                    Pro
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/75">
                  <span>Jaipur Concierge</span>
                  <span className="text-white/40">•</span>
                  <span className="text-saffron font-medium">{currentLangObj.label}</span>
                </div>
              </div>
            </div>

            {/* Header Control Actions */}
            <div className="flex items-center gap-1">
              {/* Quick Language Switcher Pills */}
              <div className="hidden xs:flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => handleLanguageChange(l.id)}
                    className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      currentLanguage === l.id
                        ? 'bg-rose text-white shadow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    title={`Switch to ${l.label}`}
                  >
                    {l.code}
                  </button>
                ))}
              </div>

              {/* Voice Read Aloud Toggle */}
              <button
                type="button"
                onClick={() => {
                  const lastBot = [...messages].reverse().find((m) => m.sender === 'bot')
                  if (lastBot) handleSpeakText(lastBot.id, lastBot.text)
                }}
                className={`relative flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  isSpeaking
                    ? 'bg-rose text-white shadow-sm'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Listen in Real Human Voice'}
                aria-label="Listen in Real Human Voice"
              >
                {isSpeaking ? (
                  <>
                    <span className="flex items-end gap-0.5 h-3">
                      <span className="w-0.5 bg-white rounded-full animate-soundwave-1" />
                      <span className="w-0.5 bg-white rounded-full animate-soundwave-2" />
                      <span className="w-0.5 bg-white rounded-full animate-soundwave-3" />
                    </span>
                    <span className="text-[11px] font-bold">Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={15} />
                    <span className="hidden sm:inline text-[11px]">Voice</span>
                  </>
                )}
              </button>

              {/* Voice Settings Popover Trigger */}
              <button
                type="button"
                onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                className={`grid h-8 w-8 place-items-center rounded-xl transition-colors ${
                  showVoiceSettings
                    ? 'bg-saffron text-ink font-bold shadow'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
                title="Voice Persona & Language Settings"
                aria-label="Voice settings"
              >
                <SlidersHorizontal size={14} />
              </button>

              {/* Reset Chat */}
              <button
                type="button"
                onClick={resetChat}
                className="grid h-8 w-8 place-items-center rounded-xl text-white/75 hover:bg-white/10 hover:text-white transition-colors"
                title="Restart chat session"
                aria-label="Reset chat"
              >
                <RefreshCw size={14} />
              </button>

              {/* Fullscreen Expand/Minimize */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:grid h-8 w-8 place-items-center rounded-xl text-white/75 hover:bg-white/10 hover:text-white transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand full screen'}
                aria-label="Toggle full screen"
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-xl text-white/75 hover:bg-rose hover:text-white transition-colors ml-0.5"
                aria-label="Close chat"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Voice Settings Dropdown / Drawer Popover */}
          {showVoiceSettings && (
            <div className="bg-ink text-white px-5 py-4 border-b border-white/10 text-xs shadow-2xl animate-fadeIn z-20 max-h-[75vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2 font-bold text-saffron text-sm">
                  <AudioWaveform size={16} />
                  <span>Real Human Voice Studio</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVoiceSettings(false)}
                  className="rounded-lg bg-white/10 px-2.5 py-1 text-white/70 hover:bg-white/20 hover:text-white text-[11px] font-semibold transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Engine Status Banner */}
              <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-white/10 to-white/5 p-2.5 border border-white/10 shadow-inner">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white tracking-wide">
                      {activeEngineName}
                    </div>
                    <div className="text-[9px] text-white/60">
                      Expressive human intonation & natural breath cadence
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  Live HD
                </span>
              </div>

              {/* 1. Language Preference */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/70 block mb-1.5 flex items-center gap-1.5">
                  <Globe size={12} className="text-saffron" />
                  <span>Speaking & Chat Language:</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => handleLanguageChange(l.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        currentLanguage === l.id
                          ? 'border-saffron bg-saffron/20 text-white ring-1 ring-saffron/50 font-bold'
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{l.label}</span>
                        <span className="text-[10px] text-saffron uppercase font-mono">{l.code}</span>
                      </div>
                      <div className="text-[9px] text-white/50 mt-0.5">{l.tag} Voice Model</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Persona Selector with Live Test Previews */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/70 block mb-1.5 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-saffron" />
                  <span>Human Voice Personas:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {VOICE_PERSONAS.map((p) => {
                    const isSelected = selectedPersona === p.id
                    const isThisTesting = testingPersonaId === p.id && isSpeaking

                    return (
                      <div
                        key={p.id}
                        className={`rounded-2xl border p-3 transition-all ${
                          isSelected
                            ? 'border-saffron bg-saffron/15 text-white ring-1 ring-saffron/40'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <button
                            type="button"
                            onClick={() => handlePersonaChange(p.id)}
                            className="text-left font-bold text-xs hover:text-saffron transition-colors flex-1 truncate mr-2"
                          >
                            {p.name}
                          </button>
                          <span className="shrink-0 rounded-full bg-rose/40 px-1.5 py-0.5 text-[8px] font-bold uppercase text-rose-200 border border-rose/30">
                            {p.badge}
                          </span>
                        </div>

                        <p className="text-[10px] text-white/60 leading-relaxed mb-2.5">
                          {p.desc}
                        </p>

                        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => handlePersonaChange(p.id)}
                            className={`flex-1 rounded-lg py-1 px-2 text-[10px] font-bold transition-all text-center ${
                              isSelected
                                ? 'bg-saffron text-ink font-bold shadow-sm'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTestPersonaVoice(p)}
                            className={`flex items-center gap-1 rounded-lg py-1 px-2.5 text-[10px] font-semibold border transition-all ${
                              isThisTesting
                                ? 'bg-rose text-white border-rose animate-pulse'
                                : 'bg-white/5 border-white/15 text-white/80 hover:bg-white/15 hover:text-white'
                            }`}
                            title="Preview sample voice"
                          >
                            {isThisTesting ? (
                              <>
                                <Square size={10} />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Play size={10} />
                                <span>Preview</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 3. Speaking Speed Selector */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/70 block mb-1.5 flex items-center gap-1.5">
                  <RotateCcw size={12} className="text-saffron" />
                  <span>Speaking Cadence / Speed:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SPEAKING_SPEEDS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => handleSpeedChange(s.value)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        speakingSpeed === s.value
                          ? 'border-saffron bg-saffron/20 text-white ring-1 ring-saffron/50 font-bold'
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[9px] text-white/50">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Audio Playback HUD Bar */}
          {isSpeaking && (
            <div className="bg-gradient-to-r from-ink via-[#381d33] to-ink px-4 py-2.5 text-white flex items-center justify-between shadow-lg border-b border-rose/30 animate-fadeIn text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex items-end gap-1 h-4">
                  <span className="w-1 bg-saffron rounded-full animate-soundwave-1" />
                  <span className="w-1 bg-rose rounded-full animate-soundwave-2" />
                  <span className="w-1 bg-saffron rounded-full animate-soundwave-3" />
                  <span className="w-1 bg-rose rounded-full animate-soundwave-1" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-saffron text-xs truncate">
                      {currentPersonaObj.name}
                    </span>
                    <span className="rounded-full bg-rose/40 px-1.5 py-0.2 text-[8px] font-bold text-rose-200">
                      Human HD
                    </span>
                  </div>
                  <div className="text-[10px] text-white/70">
                    {isPaused ? 'Paused' : 'Speaking'} {totalSentences > 0 ? `· Sentence ${speakingSentenceIndex} of ${totalSentences}` : ''}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Pause/Resume button */}
                <button
                  type="button"
                  onClick={togglePauseSpeech}
                  className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title={isPaused ? 'Resume speech' : 'Pause speech'}
                  aria-label={isPaused ? 'Resume speech' : 'Pause speech'}
                >
                  {isPaused ? <Play size={14} /> : <Pause size={14} />}
                </button>

                {/* Stop button */}
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="grid h-8 w-8 place-items-center rounded-xl bg-rose text-white hover:bg-terracotta transition-colors shadow-sm"
                  title="Stop speaking"
                  aria-label="Stop speaking"
                >
                  <Square size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Feed */}
          <div
            className="flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-[#faf6ef]/70"
            onClick={skipStreaming}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user'
              const isStreaming = streamingMessageId === msg.id
              const isThisMessageSpeaking = isSpeaking && speakingMessageId === msg.id
              const displayText = isStreaming ? streamedText : msg.text

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fadeIn`}
                >
                  <div className={`flex gap-3 max-w-[88%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Bot Avatar Icon */}
                    {!isUser && (
                      <div className="shrink-0 mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-ink text-saffron shadow-sm">
                        <Sparkles size={15} />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`relative rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-gradient-to-br from-ink to-[#42223a] text-white rounded-tr-none'
                          : 'bg-white text-ink/90 border border-ink/10 rounded-tl-none'
                      }`}
                    >
                      {/* Markdown rendering simulation */}
                      <div className="space-y-2.5">
                        {displayText.split('\n\n').map((para, idx) => {
                          if (para.startsWith('• ') || para.includes('\n• ')) {
                            const items = para.split('\n').filter(Boolean)
                            return (
                              <ul key={idx} className="space-y-1.5 pl-1">
                                {items.map((line, liIdx) => {
                                  const formatted = line.replace(/^•\s*/, '')
                                  return (
                                    <li key={liIdx} className="flex items-start gap-1.5">
                                      <span className="text-rose font-bold mt-0.5">•</span>
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: formatMarkdown(formatted)
                                        }}
                                      />
                                    </li>
                                  )
                                })}
                              </ul>
                            )
                          }

                          return (
                            <p
                              key={idx}
                              dangerouslySetInnerHTML={{
                                __html: formatMarkdown(para)
                              }}
                            />
                          )
                        })}

                        {/* Blinking Cursor during live streaming */}
                        {isStreaming && (
                          <span className="inline-block h-3.5 w-1.5 ml-1 bg-rose animate-pulse align-middle" />
                        )}
                      </div>

                      {/* Embedded Interactive Product Carousel */}
                      {!isUser && msg.products && msg.products.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-ink/10">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-rose mb-2 flex items-center gap-1">
                            <Sparkles size={11} /> {currentLanguage === 'hi' ? 'हस्तनिर्मित बैग्स:' : 'Recommended Handcrafted Styles:'}
                          </p>

                          <div className="grid gap-2 sm:grid-cols-2">
                            {msg.products.map((prod) => (
                              <div
                                key={prod.id || prod.name}
                                className="flex gap-2.5 rounded-xl border border-ink/10 bg-ivory/50 p-2 hover:border-rose/40 hover:bg-white transition-all group"
                              >
                                <img
                                  src={resolveProductImage(prod.image)}
                                  alt={prod.name}
                                  className="h-16 w-16 rounded-lg object-cover border border-ink/10 shrink-0"
                                />
                                <div className="flex flex-col justify-between flex-1 min-w-0">
                                  <div>
                                    <h4 className="font-serif text-xs font-bold text-ink truncate group-hover:text-rose transition-colors">
                                      {prod.name}
                                    </h4>
                                    <p className="text-[11px] font-bold text-rose">{prod.price}</p>
                                  </div>

                                  <div className="flex items-center gap-1.5 mt-1">
                                    <button
                                      type="button"
                                      onClick={() => cart.addToCart(prod, 1)}
                                      className="flex-1 rounded-lg bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-rose transition-colors"
                                    >
                                      + Bag
                                    </button>
                                    <a
                                      href={`${whatsapp}?text=${encodeURIComponent(`Hello Craft of Pink City, I would like to order "${prod.name}" (${prod.price}) recommended by Gulabi AI.`)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                                      title="Order on WhatsApp"
                                    >
                                      <WhatsAppIcon size={12} />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Primary Interactive CTA Action */}
                      {!isUser && msg.action && (
                        <div className="mt-3 pt-2">
                          <button
                            type="button"
                            onClick={() => handleActionClick(msg.action)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-rose px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-terracotta transition-colors"
                          >
                            <span>{msg.action.label}</span>
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      )}

                      {/* Assistant Response Action Toolbar */}
                      {!isUser && !isStreaming && (
                        <div className="mt-2.5 pt-2 border-t border-ink/5 flex items-center justify-between text-[11px] text-ink/40">
                          <span>{msg.timestamp}</span>

                          <div className="flex items-center gap-2">
                            {/* Copy button */}
                            <button
                              type="button"
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              className="hover:text-rose transition-colors p-1"
                              title="Copy text"
                            >
                              {copiedId === msg.id ? (
                                <Check size={13} className="text-emerald-600" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>

                            {/* Voice Speak button */}
                            <button
                              type="button"
                              onClick={() => handleSpeakText(msg.id, msg.text)}
                              className={`transition-colors p-1 flex items-center gap-1.5 rounded-md px-2 py-0.5 ${
                                isThisMessageSpeaking
                                  ? 'bg-rose/15 text-rose font-bold ring-1 ring-rose/30'
                                  : 'hover:text-rose hover:bg-ink/5'
                              }`}
                              title={isThisMessageSpeaking ? 'Stop speaking' : 'Listen with Real Human Voice'}
                              aria-label="Listen with Real Human Voice"
                            >
                              {isThisMessageSpeaking ? (
                                <>
                                  <span className="flex items-end gap-0.5 h-3">
                                    <span className="w-0.5 bg-rose rounded-full animate-soundwave-1" />
                                    <span className="w-0.5 bg-rose rounded-full animate-soundwave-2" />
                                    <span className="w-0.5 bg-rose rounded-full animate-soundwave-3" />
                                  </span>
                                  <span className="text-[10px] font-bold text-rose">Speaking HD</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 size={13} />
                                  <span className="text-[10px] font-medium text-ink/70">Human Voice</span>
                                </>
                              )}
                            </button>

                            {/* Thumbs Up */}
                            <button
                              type="button"
                              onClick={() => handleFeedback(msg.id, 'up')}
                              className={`transition-colors p-1 ${
                                feedbackMap[msg.id] === 'up' ? 'text-emerald-600 font-bold' : 'hover:text-emerald-600'
                              }`}
                              title="Helpful"
                            >
                              <ThumbsUp size={12} />
                            </button>

                            {/* Thumbs Down */}
                            <button
                              type="button"
                              onClick={() => handleFeedback(msg.id, 'down')}
                              className={`transition-colors p-1 ${
                                feedbackMap[msg.id] === 'down' ? 'text-rose font-bold' : 'hover:text-rose'
                              }`}
                              title="Not helpful"
                            >
                              <ThumbsDown size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contextual Follow-up Chips */}
                  {!isUser && msg.quickReplies && msg.quickReplies.length > 0 && !isStreaming && (
                    <div className="mt-2.5 ml-11 flex flex-wrap gap-1.5 max-w-[85%]">
                      {msg.quickReplies.map((reply, rIdx) => (
                        <button
                          key={rIdx}
                          type="button"
                          onClick={() => handleSendMessage(reply)}
                          className="rounded-full border border-ink/15 bg-white/90 px-3 py-1 text-[11px] font-semibold text-ink/80 shadow-2xs hover:border-rose hover:bg-rose hover:text-white transition-all transform hover:-translate-y-0.5"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {/* AI Thinking Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3 animate-fadeIn">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink text-saffron shadow-sm">
                  <Sparkles size={15} className="animate-spin-slow" />
                </div>
                <div className="rounded-2xl rounded-tl-none border border-ink/10 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-rose animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-rose animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-xs text-ink/50 font-medium ml-2">
                      {currentLanguage === 'hi' ? 'सोच रहे हैं...' : 'Reasoning...'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box with Voice Dictation & Quick Send */}
          <div className="border-t border-ink/10 bg-white p-3 sm:p-4">
            <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  currentLanguage === 'hi'
                    ? 'डफल बैग्स, थोक भाव, साइज के बारे में पूछें...'
                    : 'Ask about travel duffles, bulk quotes, sizes...'
                }
                className="flex-1 rounded-2xl border border-ink/20 bg-ivory/50 px-4 py-3 text-xs sm:text-sm text-ink placeholder-ink/40 outline-none transition focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20"
                aria-label="Type message to Gulabi AI"
              />

              {/* Microphone Dictation Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`grid h-11 w-11 place-items-center rounded-2xl transition-all ${
                  isListening
                    ? 'bg-rose text-white animate-ping'
                    : 'bg-ink/5 text-ink/70 hover:bg-rose/10 hover:text-rose'
                }`}
                title={`Voice dictation (${currentLangObj.label})`}
                aria-label="Voice input"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim()}
                className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-ink to-rose text-white shadow-md transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-ink/40 px-1">
              <span className="flex items-center gap-1.5">
                <span>{currentLangObj.label} · Real Human Voice</span>
                <span className="text-rose font-semibold cursor-pointer hover:underline" onClick={() => setShowVoiceSettings(!showVoiceSettings)}>
                  · Voice Studio
                </span>
              </span>
              <button
                type="button"
                onClick={() => cart.setIsCartOpen(true)}
                className="flex items-center gap-1 font-semibold text-rose hover:underline"
              >
                <ShoppingBag size={11} /> Bag: {cart.totalCount} items
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function formatMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-ink/5 px-1 py-0.5 rounded text-rose font-mono text-[11px]">$1</code>')
}
