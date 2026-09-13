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
  Gauge,
  Zap,
  RotateCcw,
  Languages,
  Globe
} from 'lucide-react'
import { processUserMessage, detectLanguage } from '../utils/aiChatEngine'
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
 * Languages supported by Gulabi AI
 */
export const SUPPORTED_LANGUAGES = [
  { id: 'en', label: 'English', flag: '🇬🇧', tag: 'Global' },
  { id: 'hi', label: 'हिंदी', flag: '🇮🇳', tag: 'Hindi' },
  { id: 'hinglish', label: 'Hinglish', flag: '🪷', tag: 'Jaipuri' }
]

/**
 * Curated Voice Personas with Human Natural Sounding Profiles
 */
export const VOICE_PERSONAS = [
  {
    id: 'jaipur',
    name: 'Gulabi (Jaipur Natural)',
    badge: 'Artisan Native',
    desc: 'Warm Indian English / Hindi natural intonation',
    keywords: [
      'neerja online',
      'neerja',
      'swara online',
      'swara',
      'google हिन्दी',
      'google hindi',
      'indian english',
      'geeta',
      'shruti',
      'anjali',
      'veena',
      'kavya',
      'priya',
      'heera'
    ]
  },
  {
    id: 'hindi_native',
    name: 'Swara (शुद्ध हिंदी)',
    badge: 'Hindi HD',
    desc: 'Pure authentic Hindi natural voice',
    keywords: [
      'swara online',
      'swara',
      'google हिन्दी',
      'google hi',
      'kalpana online',
      'kalpana',
      'hindi'
    ]
  },
  {
    id: 'studio_us',
    name: 'Aria (Warm Studio US)',
    badge: 'Neural HD',
    desc: 'Crystal clear, friendly American studio tone',
    keywords: [
      'aria online',
      'jenny online',
      'google us english',
      'samantha',
      'victoria',
      'michelle online',
      'karen',
      'allison',
      'zira'
    ]
  },
  {
    id: 'british_uk',
    name: 'Sonia (Sophisticated UK)',
    badge: 'Neural HD',
    desc: 'Polished, elegant British boutique concierge',
    keywords: [
      'sonia online',
      'libby online',
      'google uk english female',
      'mia online',
      'moira',
      'fiona',
      'tessa'
    ]
  },
  {
    id: 'auto',
    name: 'Auto (Best Detected)',
    badge: 'Adaptive',
    desc: 'Automatically picks the most lifelike neural female voice',
    keywords: ['natural', 'neural', 'online', 'google', 'premium', 'enhanced']
  }
]

// Speed options tuned for human conversational pacing (1.28x default for lively human speed)
export const SPEED_OPTIONS = [
  { value: 1.1, label: '1.1x', desc: 'Gentle & Relaxed' },
  { value: 1.28, label: '1.28x', desc: 'Natural Human Speed (Default)' },
  { value: 1.45, label: '1.45x', desc: 'Crisp & Fast' },
  { value: 1.65, label: '1.65x', desc: 'Speed Reader' }
]

/**
 * Intelligent Natural Voice Selector
 * Matches language (Hindi, Hinglish, English) and selects high quality Neural / Natural voices
 */
function rankAndSelectNaturalVoice(voices, personaId = 'jaipur', targetLang = 'en') {
  if (!voices || voices.length === 0) return null

  const maleKeywords = [
    'david', 'ravi', 'mark', 'george', 'rishi', 'james', 'guy', 'male',
    'prabhat', 'ajay', 'rahul', 'stefan', 'daniel', 'oliver', 'alex', 'fred',
    'bruce', 'junior', 'ralph', 'albert'
  ]

  const isLowQualityRobotic = (name) => {
    const lower = name.toLowerCase()
    return (
      (lower.includes('desktop') && !lower.includes('natural')) ||
      lower.includes('espeak') ||
      lower.includes('compact')
    )
  }

  const isMale = (name) => {
    const lower = name.toLowerCase()
    return maleKeywords.some((m) => lower.includes(m))
  }

  const isHighQualityNeural = (v) => {
    const lower = (v.name + ' ' + (v.voiceURI || '')).toLowerCase()
    return (
      lower.includes('natural') ||
      lower.includes('neural') ||
      lower.includes('online (natural)') ||
      lower.includes('google') ||
      lower.includes('premium') ||
      lower.includes('enhanced') ||
      lower.includes('siri')
    )
  }

  // Filter out male voices
  const femaleVoices = voices.filter((v) => !isMale(v.name))

  // If Target Language is Hindi, strictly prioritize Hindi voices first
  if (targetLang === 'hi') {
    const hindiKeywords = ['swara', 'google हिन्दी', 'google hi', 'kalpana', 'geeta', 'shruti', 'hindi']
    for (const kw of hindiKeywords) {
      const match = femaleVoices.find((v) => (v.lang.startsWith('hi') || v.name.toLowerCase().includes(kw)) && isHighQualityNeural(v))
      if (match) return match
    }
    for (const kw of hindiKeywords) {
      const match = femaleVoices.find((v) => (v.lang.startsWith('hi') || v.name.toLowerCase().includes(kw)) && !isLowQualityRobotic(v.name))
      if (match) return match
    }
    const anyHindi = femaleVoices.find((v) => v.lang.startsWith('hi'))
    if (anyHindi) return anyHindi
  }

  // If Hinglish, prioritize Indian English / Hindi voices (Neerja, Swara, Google Indian English)
  if (targetLang === 'hinglish') {
    const hinglishKeywords = ['neerja', 'swara', 'google हिन्दी', 'indian english', 'heera online', 'anjali', 'geeta']
    for (const kw of hinglishKeywords) {
      const match = femaleVoices.find((v) => v.name.toLowerCase().includes(kw) && isHighQualityNeural(v))
      if (match) return match
    }
    for (const kw of hinglishKeywords) {
      const match = femaleVoices.find((v) => v.name.toLowerCase().includes(kw) && !isLowQualityRobotic(v.name))
      if (match) return match
    }
  }

  const persona = VOICE_PERSONAS.find((p) => p.id === personaId) || VOICE_PERSONAS[0]

  // Tier 1: Persona match with Neural / High Quality
  for (const kw of persona.keywords) {
    const match = femaleVoices.find(
      (v) => v.name.toLowerCase().includes(kw) && isHighQualityNeural(v)
    )
    if (match) return match
  }

  // Tier 2: Persona match without low-quality restriction
  for (const kw of persona.keywords) {
    const match = femaleVoices.find(
      (v) => v.name.toLowerCase().includes(kw) && !isLowQualityRobotic(v.name)
    )
    if (match) return match
  }

  // Tier 3: Any Global Neural / Natural Female Voice
  const globalNeural = femaleVoices.find((v) => isHighQualityNeural(v) && !isLowQualityRobotic(v.name))
  if (globalNeural) return globalNeural

  // Tier 4: Clean non-robotic English / Hindi voice
  const cleanVoice = femaleVoices.find(
    (v) => (v.lang.startsWith('en') || v.lang.startsWith('hi')) && !isLowQualityRobotic(v.name)
  )
  if (cleanVoice) return cleanVoice

  // Tier 5: Fallback to first available non-male or any voice
  return femaleVoices[0] || voices[0] || null
}

/**
 * Naturalizes text for human speech in English, Hindi, and Hinglish:
 * - Converts raw numbers, dimensions, prices, and percentages into spoken human phrases
 * - Cleans markdown, formatting, emojis, hashtags
 * - Translates numbers and phrases appropriately for Hindi / Hinglish pronunciation
 */
function naturalizeTextForSpeech(text, targetLang = 'en') {
  if (!text) return ''
  let cleaned = text
    // 1. Remove markdown links, code blocks, hashtags, formatting
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
    .replace(/#+\s*/g, '')

    // 2. Cultural & Indian Greetings
    .replace(/🙏/g, 'Namaste. ')

    // 3. Emojis and visual symbols removal for clean speech flow
    .replace(/[🌸✨🛍️🧳📦💻🧘‍♀️💄💇‍♀️🧵🧼🚚✈️💳🛡️🎉❤️🌿●✦•—–]/g, ' ')

  if (targetLang === 'hi') {
    // Hindi specific naturalization
    cleaned = cleaned
      .replace(/₹\s*([0-9,]+)/g, '$1 रुपये')
      .replace(/(\d+)\s*["”]\s*[×xX]\s*(\d+)\s*["”]\s*[×xX]\s*(\d+)\s*["”]/g, '$1 बाई $2 बाई $3 इंच')
      .replace(/(\d+)\s*["”]\s*[×xX]\s*(\d+)\s*["”]/g, '$1 बाई $2 इंच')
      .replace(/(\d+)\s*["”]/g, '$1 इंच')
      .replace(/(\d+)\s*%\s*[–-]\s*(\d+)\s*%/g, '$1 से $2 प्रतिशत')
      .replace(/(\d+)\s*%/g, '$1 प्रतिशत')
      .replace(/\bMOQ\s*(\d+)\b/gi, 'कम से कम $1 पीस')
      .replace(/\bMOQ\b/gi, 'न्यूनतम ऑर्डर')
      .replace(/\bpcs\b/gi, 'पीस')
  } else if (targetLang === 'hinglish') {
    // Hinglish specific naturalization
    cleaned = cleaned
      .replace(/₹\s*([0-9,]+)/g, '$1 rupaye')
      .replace(/(\d+(?:\.\d+)?)\s*["”]\s*[×xX]\s*(\d+(?:\.\d+)?)\s*["”]\s*[×xX]\s*(\d+(?:\.\d+)?)\s*["”]/g, '$1 by $2 by $3 inch')
      .replace(/(\d+(?:\.\d+)?)\s*["”]\s*[×xX]\s*(\d+(?:\.\d+)?)\s*["”]/g, '$1 by $2 inch')
      .replace(/(\d+(?:\.\d+)?)\s*["”]\s*[–-]\s*(\d+(?:\.\d+)?)\s*["”]/g, '$1 to $2 inch')
      .replace(/(\d+(?:\.\d+)?)\s*["”]/g, '$1 inch')
      .replace(/(\d+)\s*mm\b/gi, '$1 millimeter')
      .replace(/[~～](\d+)\s*(?:Litres|Liters|L)\b/gi, 'lagbhag $1 litres')
      .replace(/(\d+)\s*%\s*[–-]\s*(\d+)\s*%\+?/g, '$1 se $2 percent')
      .replace(/(\d+)\s*%\+/g, '$1 percent ya usse zyada')
      .replace(/(\d+)\s*%/g, '$1 percent')
      .replace(/\bMOQ\s*(\d+)\s*pcs\b/gi, 'minimum $1 pieces ka wholesale order')
      .replace(/\bMOQ\s*(\d+)\b/gi, 'minimum $1 pieces')
      .replace(/\bMOQ\b/gi, 'minimum wholesale quantity')
      .replace(/\bpcs\b/gi, 'pieces')
      .replace(/\bPIN:\s*(\d{6})\b/gi, 'PIN code $1')
      .replace(/\bCOD\b/gi, 'Cash on Delivery')
      .replace(/\bQty:\s*(\d+)/gi, 'Quantity $1')
  } else {
    // English naturalization
    cleaned = cleaned
      .replace(/₹\s*([0-9,]+)/g, '$1 rupees')
      .replace(/\bRs\.?\s*([0-9,]+)/gi, '$1 rupees')
      .replace(/(\d+(?:\.\d+)?)\s*["”]\s*[×xX]\s*(\d+(?:\.\d+)?)\s*["”]\s*[×xX]\s*(\d+(?:\.\d+)?)\s*["”]/g, '$1 by $2 by $3 inches')
      .replace(/(\d+(?:\.\d+)?)\s*["”]\s*[×xX]\s*(\d+(?:\.\d+)?)\s*["”]/g, '$1 by $2 inches')
      .replace(/(\d+(?:\.\d+)?)\s*["”]\s*[–-]\s*(\d+(?:\.\d+)?)\s*["”]/g, '$1 to $2 inches')
      .replace(/(\d+(?:\.\d+)?)\s*["”]/g, '$1 inches')
      .replace(/(\d+)\s*mm\b/gi, '$1 millimeter')
      .replace(/[~～](\d+)\s*(?:Litres|Liters|L)\b/gi, 'about $1 litres')
      .replace(/(\d+)\s*(?:Litres|Liters|L)\b/gi, '$1 litres')
      .replace(/(\d+)\s*%\s*[–-]\s*(\d+)\s*%\+?/g, '$1 to $2 percent')
      .replace(/(\d+)\s*%\+/g, '$1 percent or more')
      .replace(/(\d+)\s*%/g, '$1 percent')
      .replace(/\bMOQ\s*(\d+)\s*pcs\b/gi, 'minimum order of $1 pieces')
      .replace(/\bMOQ\s*(\d+)\b/gi, 'minimum order of $1 pieces')
      .replace(/\bMOQ\b/gi, 'minimum order quantity')
      .replace(/\bpcs\b/gi, 'pieces')
      .replace(/\bPIN:\s*(\d{6})\b/gi, 'PIN code $1')
      .replace(/\bCOD\b/gi, 'Cash on Delivery')
      .replace(/\bQty:\s*(\d+)/gi, 'Quantity $1')
  }

  // Conversational smoothing for lists & bullet points
  return cleaned
    .replace(/^\s*\d+\.\s+/gm, '. ')
    .replace(/^\s*[\-\*]\s+/gm, '. ')
    .replace(/\n+/g, '. ')
    .replace(/\.\s*\.+/g, '.')
    .replace(/,\s*,+/g, ',')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Splits text into natural conversational sentence chunks
 * for crisp pronunciation and zero browser timeout bugs.
 */
function splitTextIntoSentences(text) {
  if (!text) return []
  const rawSentences = text
    .split(/(?<=[.!?।])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  const chunks = []
  for (const s of rawSentences) {
    if (s.length > 160) {
      const sub = s.split(/(?<=[,;:])\s+/).filter(Boolean)
      chunks.push(...sub)
    } else {
      chunks.push(s)
    }
  }
  return chunks.length > 0 ? chunks : [text]
}

export default function ArtisanChatbot({ onSelectProduct }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState(null)
  const [streamedText, setStreamedText] = useState('')
  const [isListening, setIsListening] = useState(false)

  // Language state: 'en', 'hi', 'hinglish'
  const [currentLanguage, setCurrentLanguage] = useState('en')

  // Voice & Speech synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speakingMessageId, setSpeakingMessageId] = useState(null)
  const [speakingSentenceIndex, setSpeakingSentenceIndex] = useState(0)
  const [totalSentences, setTotalSentences] = useState(0)
  const [selectedSpeed, setSelectedSpeed] = useState(1.28) // Fast natural human conversational speed
  const [selectedPersona, setSelectedPersona] = useState('jaipur')
  const [showVoiceSettings, setShowVoiceSettings] = useState(false)
  const [activeVoiceName, setActiveVoiceName] = useState('')

  const [hasUnread, setHasUnread] = useState(true)
  const [copiedId, setCopiedId] = useState(null)
  const [feedbackMap, setFeedbackMap] = useState({})
  const [availableVoices, setAvailableVoices] = useState([])

  const cart = useCart()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const streamTimerRef = useRef(null)

  // Speech queue control refs
  const speechQueueRef = useRef([])
  const currentChunkIndexRef = useRef(0)
  const isCancelledRef = useRef(false)
  const currentUtteranceRef = useRef(null)

  // Pre-load synthesis voices on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices()
      if (v && v.length > 0) {
        setAvailableVoices(v)
        const matched = rankAndSelectNaturalVoice(v, selectedPersona, currentLanguage)
        if (matched) setActiveVoiceName(matched.name)
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [selectedPersona, currentLanguage])

  // Update voice name when persona or language changes
  useEffect(() => {
    if (availableVoices.length > 0) {
      const matched = rankAndSelectNaturalVoice(availableVoices, selectedPersona, currentLanguage)
      if (matched) setActiveVoiceName(matched.name)
    }
  }, [selectedPersona, currentLanguage, availableVoices])

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Namaste! 🙏 I'm **Gulabi 2.5**, your Jaipur Shopping & Craft Concierge for *Craft of Pink City*.\n\n🌐 **Language:** You can chat with me in **English**, **हिंदी (Hindi)**, or **Hinglish**!\n\nAsk me anything about:\n• 🧳 **Quilted Travel Duffles & Tote Bags**\n• 📦 **Wholesale & Bulk Orders (MOQ 25 pcs)** with custom brand tags\n• 📏 **Bag Sizing & Laptop Fit (13"–16")**\n• 🧼 **Authentic Jaipuri Fabric Care**`,
      quickReplies: [
        '🛍️ Show Bestsellers',
        '🧳 Quilted Travel Duffles',
        '📦 Wholesale & Bulk (MOQ 25)',
        '💻 Laptop Bag Sizes',
        '🇮🇳 हिंदी में बात करें',
        '🪷 Hinglish'
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

  // Stop voice speech if window closed
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      stopSpeaking()
    }
  }, [isOpen])

  // Clean stop helper
  const stopSpeaking = () => {
    isCancelledRef.current = true
    speechQueueRef.current = []
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setIsPaused(false)
    setSpeakingMessageId(null)
    setSpeakingSentenceIndex(0)
    setTotalSentences(0)
  }

  // Toggle pause/resume
  const togglePauseSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    } else {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }

  // Stream simulation effect (like Gemini / Meta AI)
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

  // Sequential sentence player for natural continuous speech without pauses
  const playNextSpeechChunk = useCallback((messageId, rate = selectedSpeed, persona = selectedPersona, lang = currentLanguage) => {
    if (isCancelledRef.current) return
    if (currentChunkIndexRef.current >= speechQueueRef.current.length) {
      setIsSpeaking(false)
      setIsPaused(false)
      setSpeakingMessageId(null)
      setSpeakingSentenceIndex(0)
      setTotalSentences(0)
      return
    }

    const currentSentence = speechQueueRef.current[currentChunkIndexRef.current]
    setSpeakingSentenceIndex(currentChunkIndexRef.current + 1)

    const utterance = new SpeechSynthesisUtterance(currentSentence)
    currentUtteranceRef.current = utterance

    // Voice Selection matching language and persona
    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices()
    const chosenVoice = rankAndSelectNaturalVoice(voices, persona, lang)

    if (chosenVoice) {
      utterance.voice = chosenVoice
      utterance.lang = lang === 'hi' ? 'hi-IN' : chosenVoice.lang || 'en-IN'
    } else {
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    }

    // Fast Natural Human Conversational Prosody
    utterance.rate = rate
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onstart = () => {
      setIsSpeaking(true)
      setIsPaused(false)
      setSpeakingMessageId(messageId)
    }

    utterance.onend = () => {
      if (isCancelledRef.current) return
      currentChunkIndexRef.current += 1
      // Continuous pipeline without artificial setTimeout delays
      playNextSpeechChunk(messageId, rate, persona, lang)
    }

    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return
      currentChunkIndexRef.current += 1
      playNextSpeechChunk(messageId, rate, persona, lang)
    }

    window.speechSynthesis.speak(utterance)
  }, [availableVoices, selectedSpeed, selectedPersona, currentLanguage])

  // Voice synthesis with Natural Human Voice & Speed Controls
  const handleSpeakText = (messageId, rawText, overrideSpeed = null, overridePersona = null, overrideLang = null) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.')
      return
    }

    // Toggle off if already speaking this message and not changing settings
    if (isSpeaking && speakingMessageId === messageId && !overrideSpeed && !overridePersona && !overrideLang) {
      stopSpeaking()
      return
    }

    const speed = overrideSpeed || selectedSpeed
    const persona = overridePersona || selectedPersona
    const lang = overrideLang || currentLanguage

    stopSpeaking()
    isCancelledRef.current = false

    const naturalSpokenText = naturalizeTextForSpeech(rawText, lang)
    const sentenceChunks = splitTextIntoSentences(naturalSpokenText)

    if (sentenceChunks.length === 0) return

    speechQueueRef.current = sentenceChunks
    currentChunkIndexRef.current = 0
    setTotalSentences(sentenceChunks.length)
    setSpeakingSentenceIndex(1)
    setSpeakingMessageId(messageId)
    setIsSpeaking(true)
    setIsPaused(false)

    // Immediate playback start
    setTimeout(() => {
      playNextSpeechChunk(messageId, speed, persona, lang)
    }, 40)
  }

  // Change speed on the fly during speech
  const handleSpeedChange = (newSpeed) => {
    setSelectedSpeed(newSpeed)
    if (isSpeaking && speakingMessageId) {
      const activeMsg = messages.find((m) => m.id === speakingMessageId)
      if (activeMsg) {
        handleSpeakText(speakingMessageId, activeMsg.text, newSpeed, selectedPersona, currentLanguage)
      }
    }
  }

  // Change persona on the fly
  const handlePersonaChange = (newPersona) => {
    setSelectedPersona(newPersona)
    if (availableVoices.length > 0) {
      const matched = rankAndSelectNaturalVoice(availableVoices, newPersona, currentLanguage)
      if (matched) setActiveVoiceName(matched.name)
    }
    if (isSpeaking && speakingMessageId) {
      const activeMsg = messages.find((m) => m.id === speakingMessageId)
      if (activeMsg) {
        handleSpeakText(speakingMessageId, activeMsg.text, selectedSpeed, newPersona, currentLanguage)
      }
    }
  }

  // Change language on the fly
  const handleLanguageChange = (newLang) => {
    setCurrentLanguage(newLang)
    if (availableVoices.length > 0) {
      const matched = rankAndSelectNaturalVoice(availableVoices, selectedPersona, newLang)
      if (matched) setActiveVoiceName(matched.name)
    }
    if (isSpeaking && speakingMessageId) {
      const activeMsg = messages.find((m) => m.id === speakingMessageId)
      if (activeMsg) {
        handleSpeakText(speakingMessageId, activeMsg.text, selectedSpeed, selectedPersona, newLang)
      }
    }
  }

  // Voice recognition setup (Web Speech API) supporting Hindi and English
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

    // Check if user explicitly clicked a language switch quick reply
    if (query === '🇮🇳 हिंदी में बात करें' || query.toLowerCase() === 'hindi') {
      handleLanguageChange('hi')
    } else if (query === '🪷 Hinglish' || query.toLowerCase() === 'hinglish') {
      handleLanguageChange('hinglish')
    } else if (query.toLowerCase() === 'english' || query.toLowerCase() === 'speak in english') {
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

    // Stop previous speech
    stopSpeaking()

    // Simulate AI thinking time and stream response
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
      ? `चैट सत्र रीसेट हो गया! 🙏 मैं **गुलाबी 2.5 प्रो** हूँ। आज आपके लिए क्या जयपुरी बैग्स या थोक कोटेशन तैयार करूँ?`
      : currentLanguage === 'hinglish'
      ? `Chat session reset! 🙏 Main **Gulabi 2.5 Pro** hoon. Bataiye aaj handcrafted styles ya wholesale bulk quotes me kya share karoon?`
      : `Chat session reset! 🙏 I'm **Gulabi 2.5 Pro**. What handcrafted styles or wholesale quotes can I prepare for you?`

    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: welcome,
        quickReplies: [
          '🛍️ Show Bestsellers',
          '🧳 Quilted Travel Duffles',
          '📦 Wholesale & Bulk (MOQ 25)',
          '🧵 How are bags made?'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  const currentPersonaObj = VOICE_PERSONAS.find((p) => p.id === selectedPersona) || VOICE_PERSONAS[0]
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.id === currentLanguage) || SUPPORTED_LANGUAGES[0]

  return (
    <>
      {/* Floating Meta/Gemini Aura Launcher */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-ink via-[#2a1728] to-ink p-1 pl-4 pr-5 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-rose/40 ring-1 ring-white/20"
            aria-label="Open AI Craft Assistant Gulabi"
          >
            {/* Meta AI / Gemini Iridescent Aura Ring */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-rose via-saffron to-rose opacity-75 blur-sm group-hover:opacity-100 animate-pulse transition duration-500" />

            <div className="relative flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-rose to-saffron text-white shadow-inner">
                <Sparkles size={18} className="animate-pulse" />
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-saffron text-[9px] font-bold text-ink">
                    ●
                  </span>
                )}
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-wide text-white">Ask Gulabi AI</span>
                  <span className="rounded bg-rose/30 px-1 py-0.2 text-[9px] font-semibold uppercase text-rose-200">2.5 Pro</span>
                </div>
                <p className="text-[10px] text-white/70">English · हिंदी · Hinglish</p>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Main Meta/Gemini AI Chat Window */}
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
          {/* Gemini/Meta AI Luxury Glowing Header */}
          <div className="relative flex items-center justify-between border-b border-ink/10 bg-gradient-to-r from-ink via-[#2b172a] to-ink px-4 sm:px-5 py-3 text-white shadow-md">
            <div className="flex items-center gap-2.5">
              {/* AI Avatar */}
              <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose to-saffron text-white shadow-md shrink-0">
                <Sparkles size={18} className="animate-spin-slow" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-emerald-500" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-base sm:text-lg font-bold tracking-wide text-white">Gulabi AI</h3>
                  <span className="rounded-full bg-gradient-to-r from-rose/40 to-saffron/40 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-saffron border border-saffron/30">
                    ✦ Pro
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/75">
                  <span>Jaipur Concierge</span>
                  <span className="text-white/40">•</span>
                  <span className="text-saffron font-medium">{currentLangObj.flag} {currentLangObj.label}</span>
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
                    {l.flag} {l.label.split(' ')[0]}
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
                className={`relative flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-semibold transition-colors ${
                  isSpeaking
                    ? 'bg-rose text-white shadow-sm'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Listen with Fast Human Voice'}
                aria-label="Listen with Fast Human Voice"
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
                    <span className="hidden sm:inline text-[11px]">{selectedSpeed}x</span>
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
                title="Voice, Speed & Language Settings"
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
            <div className="bg-ink text-white px-5 py-3.5 border-b border-white/10 text-xs shadow-lg animate-fadeIn z-20 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5 font-bold text-saffron">
                  <AudioWaveform size={14} />
                  <span>Human Voice, Speed & Language Studio</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVoiceSettings(false)}
                  className="text-white/60 hover:text-white text-[11px]"
                >
                  ✕ Close
                </button>
              </div>

              {/* 1. Language Preference */}
              <div className="mt-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/70 block mb-1.5">
                  🌐 Bot Speaking & Chat Language:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => handleLanguageChange(l.id)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        currentLanguage === l.id
                          ? 'border-saffron bg-saffron/20 text-white ring-1 ring-saffron/50 font-bold'
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="text-base">{l.flag}</div>
                      <div className="text-[11px] font-bold mt-0.5">{l.label}</div>
                      <div className="text-[9px] text-white/50">{l.tag}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Conversational Speaking Speed */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                    ⚡ Human Conversational Speaking Speed:
                  </label>
                  <span className="text-saffron font-bold text-[11px]">{selectedSpeed}x</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {SPEED_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSpeedChange(opt.value)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-bold text-[11px] transition-all ${
                        selectedSpeed === opt.value
                          ? 'border-rose bg-rose text-white shadow-sm'
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                      title={opt.desc}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Persona Selector */}
              <div className="mt-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/70 block mb-1.5">
                  🌸 Voice Persona / Tone:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {VOICE_PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePersonaChange(p.id)}
                      className={`text-left p-2 rounded-xl border transition-all ${
                        selectedPersona === p.id
                          ? 'border-saffron bg-saffron/15 text-white ring-1 ring-saffron/40'
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] truncate">{p.name}</span>
                      </div>
                      <p className="text-[9px] text-white/50 truncate mt-0.5">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detected Engine Info */}
              {activeVoiceName && (
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
                  <span className="truncate">Synthesizer: {activeVoiceName}</span>
                  <span className="shrink-0 text-emerald-400 font-semibold">✓ Ready</span>
                </div>
              )}
            </div>
          )}

          {/* Active Audio Playback HUD Bar */}
          {isSpeaking && (
            <div className="bg-gradient-to-r from-ink via-[#381d33] to-ink px-4 py-2 text-white flex items-center justify-between shadow-md border-b border-rose/30 animate-fadeIn text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-1 bg-saffron rounded-full animate-soundwave-1" />
                  <span className="w-1 bg-rose rounded-full animate-soundwave-2" />
                  <span className="w-1 bg-saffron rounded-full animate-soundwave-3" />
                </div>
                <div className="truncate">
                  <span className="font-bold text-saffron text-[11px]">
                    {currentLangObj.flag} {currentPersonaObj.name}
                  </span>
                  <span className="text-[10px] text-white/70 ml-1.5">
                    ({selectedSpeed}x {isPaused ? '· Paused' : '· Speaking'} {totalSentences > 0 ? `${speakingSentenceIndex}/${totalSentences}` : ''})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Speed cycle button */}
                <button
                  type="button"
                  onClick={() => {
                    const nextSpeed = selectedSpeed === 1.1 ? 1.28 : selectedSpeed === 1.28 ? 1.45 : selectedSpeed === 1.45 ? 1.65 : 1.1
                    handleSpeedChange(nextSpeed)
                  }}
                  className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-saffron transition-colors"
                  title="Cycle reading speed"
                >
                  {selectedSpeed}x
                </button>

                {/* Pause/Resume button */}
                <button
                  type="button"
                  onClick={togglePauseSpeech}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title={isPaused ? 'Resume speech' : 'Pause speech'}
                >
                  {isPaused ? <Play size={13} /> : <Pause size={13} />}
                </button>

                {/* Stop button */}
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-rose text-white hover:bg-terracotta transition-colors"
                  title="Stop speaking"
                >
                  <Square size={12} />
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
                      {/* Markdown rendering simulation with bold/bullets */}
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

                            {/* Voice Speak button (Fast Natural Voice) */}
                            <button
                              type="button"
                              onClick={() => handleSpeakText(msg.id, msg.text)}
                              className={`transition-colors p-1 flex items-center gap-1.5 rounded-md px-1.5 py-0.5 ${
                                isThisMessageSpeaking
                                  ? 'bg-rose/15 text-rose font-bold'
                                  : 'hover:text-rose hover:bg-ink/5'
                              }`}
                              title={isThisMessageSpeaking ? 'Stop speaking' : `Listen (${selectedSpeed}x ${currentLangObj.label} Voice)`}
                              aria-label="Listen with Natural Voice"
                            >
                              {isThisMessageSpeaking ? (
                                <>
                                  <span className="flex items-end gap-0.5 h-3">
                                    <span className="w-0.5 bg-rose rounded-full animate-soundwave-1" />
                                    <span className="w-0.5 bg-rose rounded-full animate-soundwave-2" />
                                    <span className="w-0.5 bg-rose rounded-full animate-soundwave-3" />
                                  </span>
                                  <span className="text-[10px] font-bold text-rose">Speaking</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 size={13} />
                                  <span className="text-[10px] font-medium text-ink/60">{selectedSpeed}x</span>
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
                      {currentLanguage === 'hi' ? 'सोच रहे हैं...' : currentLanguage === 'hinglish' ? 'Thinking...' : 'Reasoning...'}
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
                    : currentLanguage === 'hinglish'
                    ? 'Duffle bags, bulk wholesale quotes, size ke bare me puchein...'
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
                <span>✦ {currentLangObj.flag} {currentLangObj.label} · {selectedSpeed}x Speed</span>
                <span className="text-rose font-semibold cursor-pointer hover:underline" onClick={() => setShowVoiceSettings(!showVoiceSettings)}>
                  · Settings
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

// Markdown helper to support bold (**text**), italics (*text*), and code
function formatMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-ink/5 px-1 py-0.5 rounded text-rose font-mono text-[11px]">$1</code>')
}
