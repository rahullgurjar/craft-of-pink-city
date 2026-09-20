/**
 * Human Voice Engine for Gulabi AI
 * Ultra-Realistic, Expressive Human Speech Synthesis System
 * 
 * Features:
 * 1. Studio Neural Human Audio Streamer (High-Definition Neural Voice Audio)
 * 2. Intelligent Gapless Sentence Pre-buffering (zero latency between sentences)
 * 3. Conversational Speech Text Naturalizer (Natural prosody for English & Hindi)
 * 4. High-Quality Web Speech Synthesis Fallback (Strictly filters robotic SAPI desktop voices)
 */

export const VOICE_PERSONAS = [
  {
    id: 'jaipur',
    name: 'Gulabi (Jaipur Warm Human)',
    badge: 'Artisan Native',
    lang: 'en',
    ttsLang: 'en-IN',
    desc: 'Warm, welcoming Indian accent with natural conversational cadence',
    sampleText: {
      en: 'Namaste! Welcome to Craft of Pink City. I can help you explore our handcrafted quilted bags, laptop sleeves, or wholesale quotes.',
      hi: 'नमस्ते! क्राफ्ट ऑफ पिंक सिटी में आपका स्वागत है। मैं आपके लिए हस्तनिर्मित बैग्स और थोक भाव की जानकारी दे सकती हूँ।'
    },
    browserKeywords: [
      'neerja online (natural)',
      'neerja',
      'swara online (natural)',
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
    name: 'Swara (Hindi Studio Pure)',
    badge: 'Hindi HD',
    lang: 'hi',
    ttsLang: 'hi',
    desc: 'Authentic, expressive native Hindi voice with crystal clear intonation',
    sampleText: {
      en: 'Namaste! I am Swara. How can I assist you with our Jaipuri handcrafted collection today?',
      hi: 'नमस्ते! मैं स्वरा हूँ। आज मैं आपके लिए जयपुर के कौन से प्रामाणिक हस्तनिर्मित बैग्स दिखाऊँ?'
    },
    browserKeywords: [
      'swara online (natural)',
      'swara',
      'google हिन्दी',
      'google hi',
      'kalpana online (natural)',
      'kalpana',
      'hindi',
      'geeta'
    ]
  },
  {
    id: 'studio_us',
    name: 'Aria (Warm Studio US)',
    badge: 'Neural HD',
    lang: 'en',
    ttsLang: 'en-US',
    desc: 'Clear, friendly, modern American studio concierge',
    sampleText: {
      en: 'Hello! I am Aria, your personal shopping concierge for authentic Jaipur block print bags.',
      hi: 'नमस्ते! मैं एरिया हूँ। क्राफ्ट ऑफ पिंक सिटी में आपका स्वागत है।'
    },
    browserKeywords: [
      'aria online (natural)',
      'jenny online (natural)',
      'google us english',
      'samantha',
      'victoria',
      'michelle online (natural)',
      'allison',
      'siri'
    ]
  },
  {
    id: 'british_uk',
    name: 'Sonia (Sophisticated UK)',
    badge: 'Neural HD',
    lang: 'en',
    ttsLang: 'en-GB',
    desc: 'Polished, elegant British boutique concierge',
    sampleText: {
      en: 'Good day! I am Sonia. It is a pleasure to guide you through our bespoke Jaipuri collection.',
      hi: 'नमस्ते! मैं सोनिया हूँ। क्राफ्ट ऑफ पिंक सिटी में आपका स्वागत है।'
    },
    browserKeywords: [
      'sonia online (natural)',
      'libby online (natural)',
      'google uk english female',
      'mia online (natural)',
      'moira',
      'fiona',
      'tessa'
    ]
  }
]

export const SPEAKING_SPEEDS = [
  { value: 0.9, label: '0.9x', desc: 'Relaxed' },
  { value: 1.0, label: '1.0x', desc: 'Standard Human' },
  { value: 1.15, label: '1.15x', desc: 'Brisk' }
]

/**
 * Naturalizes text for fluent, conversational human speech.
 * Expands currencies, dimensions, phone numbers, abbreviations, bullet points,
 * and removes robotic characters/markdown syntax.
 */
export function naturalizeTextForSpeech(text, targetLang = 'en') {
  if (!text) return ''

  let cleaned = text
    // 1. Decode HTML entities
    .replace(/&amp;/gi, ' and ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')

    // 2. Strip Markdown syntax & URLs
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/#+\s*/g, '')

    // 3. Parentheses into natural conversational pauses
    .replace(/\(([^)]+)\)/g, ', $1, ')

    // 4. Bullet points and list markers into smooth pauses
    .replace(/^\s*[\u2022\u2023\u25E6\u2043\u2219\*\-\+]\s+/gm, '. ')
    .replace(/^\s*\d+\.\s+/gm, '. ')

    // 5. Special compound abbreviations
    .replace(/\bw\/o\s+/gi, targetLang === 'hi' ? ' के बिना ' : ' without ')
    .replace(/\bw\/\s+/gi, targetLang === 'hi' ? ' के साथ ' : ' with ')
    .replace(/\band\/or\b/gi, targetLang === 'hi' ? ' और या ' : ' and or ')
    .replace(/\bT&C\b|\bT&Cs\b/gi, targetLang === 'hi' ? 'नियम और शर्तें' : 'Terms and Conditions')
    .replace(/\bB&B\b/gi, 'Bed and Breakfast')

    // 6. Phone Numbers (BEFORE single + replacement)
    .replace(/\+91[\s-]*(\d{5})[\s-]*(\d{5})\b/g, (match, p1, p2) => {
      const p1Spaced = p1.split('').join(' ')
      const p2Spaced = p2.split('').join(' ')
      return targetLang === 'hi'
        ? `प्लस 91, ${p1Spaced}, ${p2Spaced}`
        : `plus 91, ${p1Spaced}, ${p2Spaced}`
    })

    // 7. Number ranges with hyphen: e.g. 5-7 days -> 5 to 7 days
    .replace(/(\d+)\s*[-–—]\s*(\d+)\s*(days?|दिन|din|hrs?|hours?|weeks?|months?)/gi, (m, p1, p2, p3) => {
      if (targetLang === 'hi') return `${p1} से ${p2} ${p3}`
      return `${p1} to ${p2} ${p3}`
    })

  // 8. Expand universal symbols & abbreviations by language
  if (targetLang === 'hi') {
    cleaned = cleaned
      // Dimensions & Measurements
      .replace(/(\d+(?:\.\d+)?)\s*["”]\s*[×xX]\s*(\d+(?:\.\d+)?)\s*["”]\s*[×xX]\s*(\d+(?:\.\d+)?)\s*["”]/g, '$1 बाई $2 बाई $3 इंच')
      .replace(/(\d+(?:\.\d+)?)\s*["”]\s*[×xX]\s*(\d+(?:\.\d+)?)\s*["”]/g, '$1 बाई $2 इंच')
      .replace(/(\d+(?:\.\d+)?)\s*["”]\s*[–-]\s*(\d+(?:\.\d+)?)\s*["”]/g, '$1 से $2 इंच')
      .replace(/(\d+(?:\.\d+)?)\s*["”]/g, '$1 इंच')
      .replace(/(\d+(?:\.\d+)?)\s*cm\b/gi, '$1 सेंटीमीटर')
      .replace(/(\d+(?:\.\d+)?)\s*mm\b/gi, '$1 मिलीमीटर')
      .replace(/(\d+(?:\.\d+)?)\s*kg\b/gi, '$1 किलोग्राम')
      .replace(/(\d+(?:\.\d+)?)\s*gm?\b/gi, '$1 ग्राम')
      .replace(/(\d+(?:\.\d+)?)\s*(?:Litres|Liters|L)\b/gi, '$1 लीटर')

      // Currencies
      .replace(/₹\s*([0-9,]+(?:\.\d+)?)/g, '$1 रुपये')
      .replace(/\b(?:Rs\.?|INR)\s*([0-9,]+(?:\.\d+)?)/gi, '$1 रुपये')
      .replace(/\$\s*([0-9,]+(?:\.\d+)?)/g, '$1 डॉलर')

      // Wholesale & Retail terms (before single symbol replacements)
      .replace(/\bMOQ\s*(\d+)(?:\s*(?:pcs|pieces|pc|पीस))?/gi, 'कम से कम $1 पीस')
      .replace(/\bMOQ\b/gi, 'न्यूनतम ऑर्डर मात्रा')
      .replace(/\b(?:pcs|pieces)\b/gi, 'पीस')
      .replace(/\bpc\b/gi, 'पीस')
      .replace(/पीस\s+पीस/g, 'पीस')
      .replace(/\bvs\.?\s*/gi, 'बनाम ')
      .replace(/\b(?:e\.g\.|eg\.?)\s*/gi, 'जैसे कि ')
      .replace(/\b(?:i\.e\.|ie\.?)\s*/gi, 'अर्थात ')
      .replace(/\b(?:etc\.|etc)\b/gi, 'इत्यादि')
      .replace(/\b(?:approx\.|approx)\b/gi, 'लगभग')
      .replace(/\bavail\.?\b/gi, 'उपलब्ध')
      .replace(/\b(?:incl\.|inc\.)\b/gi, 'सहित')
      .replace(/\bCOD\b/gi, 'कैश ऑन डिलीवरी')
      .replace(/\bUPI\b/gi, 'यू पी आई')
      .replace(/\bGST\b/gi, 'जी एस टी')
      .replace(/\bPIN:\s*(\d{6})\b/gi, 'पिन कोड $1')
      .replace(/\bQty:\s*(\d+)/gi, 'मात्रा $1')

      // Percentages
      .replace(/(\d+(?:\.\d+)?)\s*%\s*[–-]\s*(\d+(?:\.\d+)?)\s*%\+?/g, '$1 से $2 प्रतिशत')
      .replace(/(\d+(?:\.\d+)?)\s*%\+/g, '$1 प्रतिशत या अधिक')
      .replace(/(\d+(?:\.\d+)?)\s*%/g, '$1 प्रतिशत')

      // Conjunctions & Symbols
      .replace(/\s*&\s*/g, ' और ')
      .replace(/\s*\+\s*/g, ' प्लस ')
      .replace(/(\w+)\s*[/]\s*(\w+)/g, '$1 या $2')
      .replace(/\s*[/]\s*/g, ' या ')
      .replace(/\s*[@]\s*/g, ' एट ')
      .replace(/#(\d+)/g, 'नंबर $1')
      .replace(/[~～≈](\d+)/g, 'लगभग $1')
  } else {
    // English
    cleaned = cleaned
      // Dimensions & Measurements
      .replace(/(\d+(?:\.\d+)?)\s*["”]\s*[×xX]\s*(\d+(?:\.\d+)?)\s*["”]\s*[×xX]\s*(\d+(?:\.\d+)?)\s*["”]/g, '$1 by $2 by $3 inches')
      .replace(/(\d+(?:\.\d+)?)\s*["”]\s*[×xX]\s*(\d+(?:\.\d+)?)\s*["”]/g, '$1 by $2 inches')
      .replace(/(\d+(?:\.\d+)?)\s*["”]\s*[–-]\s*(\d+(?:\.\d+)?)\s*["”]/g, '$1 to $2 inches')
      .replace(/(\d+(?:\.\d+)?)\s*["”]/g, '$1 inches')
      .replace(/(\d+(?:\.\d+)?)\s*cm\b/gi, '$1 centimeters')
      .replace(/(\d+(?:\.\d+)?)\s*mm\b/gi, '$1 millimeters')
      .replace(/(\d+(?:\.\d+)?)\s*kg\b/gi, '$1 kilograms')
      .replace(/(\d+(?:\.\d+)?)\s*gm?\b/gi, '$1 grams')
      .replace(/(\d+(?:\.\d+)?)\s*(?:Litres|Liters|L)\b/gi, '$1 litres')

      // Currencies
      .replace(/₹\s*([0-9,]+(?:\.\d+)?)/g, '$1 rupees')
      .replace(/\b(?:Rs\.?|INR)\s*([0-9,]+(?:\.\d+)?)/gi, '$1 rupees')
      .replace(/\$\s*([0-9,]+(?:\.\d+)?)/g, '$1 dollars')

      // Wholesale & Retail terms (before single symbol replacements)
      .replace(/\bMOQ\s*(\d+)\s*(?:pcs|pieces|pc)?\b/gi, 'minimum order of $1 pieces')
      .replace(/\bMOQ\b/gi, 'minimum order quantity')
      .replace(/\b(?:pcs|pieces)\b/gi, 'pieces')
      .replace(/\bpc\b/gi, 'piece')
      .replace(/\bvs\.?\s*/gi, 'versus ')
      .replace(/\b(?:e\.g\.|eg\.?)\s*/gi, 'for example, ')
      .replace(/\b(?:i\.e\.|ie\.?)\s*/gi, 'that is, ')
      .replace(/\b(?:etc\.|etc)\b/gi, 'and so on')
      .replace(/\b(?:approx\.|approx)\b/gi, 'approximately')
      .replace(/\bavail\.?\b/gi, 'available')
      .replace(/\b(?:incl\.|inc\.)\b/gi, 'including')
      .replace(/\bCOD\b/gi, 'Cash on Delivery')
      .replace(/\bUPI\b/gi, 'U P I')
      .replace(/\bGST\b/gi, 'G S T')
      .replace(/\bPIN:\s*(\d{6})\b/gi, 'PIN code $1')
      .replace(/\bQty:\s*(\d+)/gi, 'Quantity $1')

      // Percentages
      .replace(/(\d+(?:\.\d+)?)\s*%\s*[–-]\s*(\d+(?:\.\d+)?)\s*%\+?/g, '$1 to $2 percent')
      .replace(/(\d+(?:\.\d+)?)\s*%\+/g, '$1 percent or more')
      .replace(/(\d+(?:\.\d+)?)\s*%/g, '$1 percent')

      // Conjunctions & Symbols
      .replace(/\s*&\s*/g, ' and ')
      .replace(/\s*\+\s*/g, ' plus ')
      .replace(/(\w+)\s*[/]\s*(\w+)/g, '$1 or $2')
      .replace(/\s*[/]\s*/g, ' or ')
      .replace(/\s*[@]\s*/g, ' at ')
      .replace(/#(\d+)/g, 'Number $1')
      .replace(/[~～≈](\d+)/g, 'about $1')
  }

  // 9. Conversational Human Micro-pauses
  if (targetLang === 'hi') {
    cleaned = cleaned.replace(/\b(नमस्ते|धन्यवाद|जरूर|बिल्कुल|जी हाँ)\b(?!\s*[,.!?])/g, '$1,')
  } else {
    cleaned = cleaned.replace(/\b(Hello|Hi|Greetings|Certainly|Sure|Thank you|Namaste)\b(?!\s*[,.!?])/gi, '$1,')
  }

  // 10. Final Clean of non-pronounceable special symbols
  cleaned = cleaned
    .replace(/[^\w\s.,!?:;'"–—\u0900-\u097F]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '. ')
    .replace(/\.\s*\.+/g, '.')
    .replace(/,\s*,+/g, ',')
    .trim()

  return cleaned
}

/**
 * Splits text into natural breath-length speech chunks (under 120 chars)
 */
export function splitTextIntoSpeechChunks(text) {
  if (!text) return []

  const rawSentences = text
    .split(/(?<=[.!?।])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  const chunks = []
  for (const s of rawSentences) {
    if (s.length > 120) {
      const sub = s.split(/(?<=[,;:])\s+/).filter(Boolean)
      chunks.push(...sub)
    } else {
      chunks.push(s)
    }
  }

  return chunks.length > 0 ? chunks : [text]
}

/**
 * Selects the highest fidelity neural / natural voice from Web Speech API voices.
 * Strictly penalizes and rejects robotic legacy desktop voices.
 */
export function rankBrowserNeuralVoice(voices, personaId = 'jaipur', targetLang = 'en') {
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

  const femaleVoices = voices.filter((v) => !isMale(v.name))

  // Hindi priority
  if (targetLang === 'hi') {
    const hindiKeywords = ['swara', 'google हिन्दी', 'google hi', 'kalpana', 'geeta', 'shruti', 'hindi']
    for (const kw of hindiKeywords) {
      const match = femaleVoices.find(
        (v) => (v.lang.startsWith('hi') || v.name.toLowerCase().includes(kw)) && isHighQualityNeural(v)
      )
      if (match) return match
    }
    for (const kw of hindiKeywords) {
      const match = femaleVoices.find(
        (v) => (v.lang.startsWith('hi') || v.name.toLowerCase().includes(kw)) && !isLowQualityRobotic(v.name)
      )
      if (match) return match
    }
    const anyHindi = femaleVoices.find((v) => v.lang.startsWith('hi'))
    if (anyHindi) return anyHindi
  }

  const persona = VOICE_PERSONAS.find((p) => p.id === personaId) || VOICE_PERSONAS[0]

  // Tier 1: Persona match with Neural
  for (const kw of persona.browserKeywords) {
    const match = femaleVoices.find(
      (v) => v.name.toLowerCase().includes(kw) && isHighQualityNeural(v)
    )
    if (match) return match
  }

  // Tier 2: Persona match without low-quality restriction
  for (const kw of persona.browserKeywords) {
    const match = femaleVoices.find(
      (v) => v.name.toLowerCase().includes(kw) && !isLowQualityRobotic(v.name)
    )
    if (match) return match
  }

  // Tier 3: Any Global Neural Female Voice
  const globalNeural = femaleVoices.find((v) => isHighQualityNeural(v) && !isLowQualityRobotic(v.name))
  if (globalNeural) return globalNeural

  // Tier 4: Clean non-robotic English / Hindi voice
  const cleanVoice = femaleVoices.find(
    (v) => (v.lang.startsWith('en') || v.lang.startsWith('hi')) && !isLowQualityRobotic(v.name)
  )
  if (cleanVoice) return cleanVoice

  return femaleVoices[0] || voices[0] || null
}

/**
 * Builds high-fidelity Neural Audio stream URL for human voice synthesis.
 */
function buildNeuralAudioUrl(text, ttsLang) {
  const clean = encodeURIComponent(text.trim())
  return `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${ttsLang}&q=${clean}`
}

/**
 * Universal Human Voice Player Manager
 * Coordinates Studio Neural Audio Streaming with seamless pre-buffering
 * and automatic fallback to browser neural speech synthesis.
 */
export class HumanVoicePlayer {
  constructor({
    onStart,
    onEnd,
    onProgress,
    onError,
    onStateChange
  } = {}) {
    this.onStart = onStart || (() => {})
    this.onEnd = onEnd || (() => {})
    this.onProgress = onProgress || (() => {})
    this.onError = onError || (() => {})
    this.onStateChange = onStateChange || (() => {})

    this.isPlaying = false
    this.isPaused = false
    this.currentPersonaId = 'jaipur'
    this.currentLanguage = 'en'
    this.playbackSpeed = 1.0
    this.activeEngine = 'Studio Neural HD' // 'Studio Neural HD' | 'Browser Neural'

    this.queue = []
    this.currentIndex = 0
    this.activeAudio = null
    this.prefetchedAudio = null
    this.prefetchedIndex = -1
    this.isCancelled = false
    this.browserUtterance = null
  }

  setPersona(personaId) {
    this.currentPersonaId = personaId
  }

  setLanguage(lang) {
    this.currentLanguage = lang
  }

  setSpeed(speed) {
    this.playbackSpeed = speed
    if (this.activeAudio) {
      this.activeAudio.playbackRate = speed
    }
  }

  /**
   * Pre-fetches the next audio chunk into memory for gapless continuous playback
   */
  _prefetchNextChunk(nextIndex, ttsLang) {
    if (nextIndex >= this.queue.length || this.isCancelled) return
    const nextText = this.queue[nextIndex]
    if (!nextText) return

    try {
      const url = buildNeuralAudioUrl(nextText, ttsLang)
      const audio = new Audio()
      audio.preload = 'auto'
      audio.src = url
      this.prefetchedAudio = audio
      this.prefetchedIndex = nextIndex
    } catch {
      this.prefetchedAudio = null
      this.prefetchedIndex = -1
    }
  }

  /**
   * Main entry point to speak text with Real Human Voice
   */
  async speak(rawText, { personaId = null, lang = null, speed = null, messageId = null } = {}) {
    this.stop()
    this.isCancelled = false

    const activePersonaId = personaId || this.currentPersonaId
    const activeLang = lang || this.currentLanguage
    const activeSpeed = speed || this.playbackSpeed

    const persona = VOICE_PERSONAS.find((p) => p.id === activePersonaId) || VOICE_PERSONAS[0]
    const ttsLang = activeLang === 'hi' ? 'hi' : persona.ttsLang || 'en-IN'

    // Naturalize text into human conversational phrases
    const naturalized = naturalizeTextForSpeech(rawText, activeLang)
    const chunks = splitTextIntoSpeechChunks(naturalized)

    if (chunks.length === 0) return

    this.queue = chunks
    this.currentIndex = 0
    this.isPlaying = true
    this.isPaused = false
    this.activeEngine = 'Studio Neural HD'

    this.onStart({
      messageId,
      totalChunks: chunks.length,
      currentChunk: 1,
      persona,
      engine: this.activeEngine
    })

    this.onProgress({
      messageId,
      totalChunks: chunks.length,
      currentChunk: 1,
      text: chunks[0]
    })

    // Play via Studio Neural HD Audio Stream
    this._playChunkViaAudio(0, ttsLang, activeSpeed, messageId, persona, activeLang)
  }

  _playChunkViaAudio(index, ttsLang, speed, messageId, persona, lang) {
    if (this.isCancelled) return

    if (index >= this.queue.length) {
      this._finishPlayback()
      return
    }

    this.currentIndex = index
    const text = this.queue[index]

    this.onProgress({
      messageId,
      totalChunks: this.queue.length,
      currentChunk: index + 1,
      text
    })

    let audio = null

    // Use pre-fetched audio if available for this index
    if (this.prefetchedAudio && this.prefetchedIndex === index) {
      audio = this.prefetchedAudio
      this.prefetchedAudio = null
      this.prefetchedIndex = -1
    } else {
      const url = buildNeuralAudioUrl(text, ttsLang)
      audio = new Audio(url)
    }

    this.activeAudio = audio
    audio.playbackRate = speed

    // Pre-fetch next chunk immediately
    this._prefetchNextChunk(index + 1, ttsLang)

    audio.onended = () => {
      if (this.isCancelled) return
      // Natural human breath pause between clauses (50ms)
      setTimeout(() => {
        if (!this.isCancelled) {
          this._playChunkViaAudio(index + 1, ttsLang, speed, messageId, persona, lang)
        }
      }, 50)
    }

    audio.onerror = () => {
      if (this.isCancelled) return
      // If audio streaming fails (e.g. offline), smoothly fallback to browser neural synthesizer
      console.warn('Neural audio stream unavailable, falling back to Browser Neural voice engine.')
      this.activeEngine = 'Browser Neural'
      this._fallbackToBrowserSynthesis(index, persona, lang, speed, messageId)
    }

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (this.isCancelled) return
        console.warn('Audio play interrupted or blocked:', err)
        this.activeEngine = 'Browser Neural'
        this._fallbackToBrowserSynthesis(index, persona, lang, speed, messageId)
      })
    }
  }

  /**
   * Browser Web Speech Synthesis fallback with Neural voice filtering
   */
  _fallbackToBrowserSynthesis(startIndex, persona, lang, speed, messageId) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this._finishPlayback()
      return
    }

    const playNextBrowserChunk = (index) => {
      if (this.isCancelled) return
      if (index >= this.queue.length) {
        this._finishPlayback()
        return
      }

      this.currentIndex = index
      const text = this.queue[index]

      this.onProgress({
        messageId,
        totalChunks: this.queue.length,
        currentChunk: index + 1,
        text
      })

      const utterance = new SpeechSynthesisUtterance(text)
      this.browserUtterance = utterance

      const voices = window.speechSynthesis.getVoices()
      const matched = rankBrowserNeuralVoice(voices, persona.id, lang)

      if (matched) {
        utterance.voice = matched
        utterance.lang = lang === 'hi' ? 'hi-IN' : matched.lang || 'en-IN'
      } else {
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
      }

      utterance.rate = speed
      utterance.pitch = 1.02
      utterance.volume = 1.0

      utterance.onend = () => {
        if (this.isCancelled) return
        setTimeout(() => {
          if (!this.isCancelled) {
            playNextBrowserChunk(index + 1)
          }
        }, 40)
      }

      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return
        setTimeout(() => {
          if (!this.isCancelled) {
            playNextBrowserChunk(index + 1)
          }
        }, 40)
      }

      window.speechSynthesis.speak(utterance)
    }

    playNextBrowserChunk(startIndex)
  }

  pause() {
    if (!this.isPlaying || this.isPaused) return

    this.isPaused = true
    if (this.activeAudio) {
      this.activeAudio.pause()
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause()
    }
    this.onStateChange({ isPlaying: true, isPaused: true })
  }

  resume() {
    if (!this.isPlaying || !this.isPaused) return

    this.isPaused = false
    if (this.activeAudio) {
      this.activeAudio.play().catch(() => {})
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume()
    }
    this.onStateChange({ isPlaying: true, isPaused: false })
  }

  stop() {
    this.isCancelled = true
    this.isPlaying = false
    this.isPaused = false
    this.queue = []
    this.currentIndex = 0

    if (this.activeAudio) {
      this.activeAudio.pause()
      this.activeAudio.src = ''
      this.activeAudio = null
    }

    if (this.prefetchedAudio) {
      this.prefetchedAudio.src = ''
      this.prefetchedAudio = null
      this.prefetchedIndex = -1
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }

    this.browserUtterance = null
    this.onStateChange({ isPlaying: false, isPaused: false })
  }

  _finishPlayback() {
    this.isPlaying = false
    this.isPaused = false
    this.queue = []
    this.currentIndex = 0
    this.activeAudio = null
    this.onEnd()
    this.onStateChange({ isPlaying: false, isPaused: false })
  }
}
