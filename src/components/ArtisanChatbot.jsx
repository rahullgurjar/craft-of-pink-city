import { useState, useEffect, useRef } from 'react'
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
  Eye
} from 'lucide-react'
import { processUserMessage } from '../utils/aiChatEngine'
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

export default function ArtisanChatbot({ onSelectProduct }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState(null)
  const [streamedText, setStreamedText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const [copiedId, setCopiedId] = useState(null)
  const [feedbackMap, setFeedbackMap] = useState({})

  const cart = useCart()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const streamTimerRef = useRef(null)

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Namaste! 🙏 I'm **Gulabi 2.5**, your AI Shopping & Craft Concierge for *Craft of Pink City*.\n\nAsk me anything about:\n• 🧳 **Quilted Travel Duffles & Tote Bags**\n• 📦 **Wholesale & Bulk Orders (MOQ 25 pcs)** with custom brand tags\n• 📏 **Bag Sizing & Laptop Fit (13"–16")**\n• 🧼 **Authentic Jaipuri Fabric Care**`,
      quickReplies: [
        '🛍️ Show Bestsellers',
        '🧳 Quilted Travel Duffles',
        '📦 Wholesale & Bulk (MOQ 25)',
        '💻 Laptop Bag Sizes',
        '🚚 Delivery & Schedule'
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
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isOpen])

  // Stream simulation effect (like Gemini / Meta AI)
  const streamBotResponse = (botMsg) => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current)
    const fullText = botMsg.text
    setStreamingMessageId(botMsg.id)
    setStreamedText('')

    let charIndex = 0
    const stepSize = Math.max(2, Math.floor(fullText.length / 40)) // Dynamic streaming speed

    streamTimerRef.current = setInterval(() => {
      charIndex += stepSize
      if (charIndex >= fullText.length) {
        clearInterval(streamTimerRef.current)
        setStreamedText(fullText)
        setStreamingMessageId(null)
      } else {
        setStreamedText(fullText.substring(0, charIndex))
      }
    }, 25)
  }

  const skipStreaming = () => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current)
      setStreamingMessageId(null)
    }
  }

  // Voice synthesis (Text to Speech)
  const handleSpeakText = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.')
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[*#•_`~[\]()]/g, '').replace(/https?:\/\/\S+/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'en-IN'
    utterance.rate = 1.0
    utterance.pitch = 1.05

    // Pick gentle female voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      (v) => v.lang.includes('IN') || v.name.includes('India') || v.name.includes('Google') || v.name.includes('Natural')
    )
    if (preferredVoice) utterance.voice = preferredVoice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  // Voice recognition setup (Web Speech API)
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
      recognition.lang = 'en-IN'
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

    // Simulate AI thinking time and stream response
    setTimeout(() => {
      const botResponse = processUserMessage(query, cart, updatedHistory)
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
    }, 400)
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: `Chat session reset! 🙏 I'm **Gulabi 2.5 Pro**. What handcrafted styles or wholesale quotes can I prepare for you?`,
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
                <p className="text-[10px] text-white/70">Jaipur Artisan Concierge</p>
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
          <div className="relative flex items-center justify-between border-b border-ink/10 bg-gradient-to-r from-ink via-[#2b172a] to-ink px-5 py-4 text-white shadow-md">
            <div className="flex items-center gap-3">
              {/* AI Avatar */}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose to-saffron text-white shadow-md">
                <Sparkles size={20} className="animate-spin-slow" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink bg-emerald-500" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold tracking-wide text-white">Gulabi AI</h3>
                  <span className="rounded-full bg-gradient-to-r from-rose/40 to-saffron/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-saffron border border-saffron/30">
                    ✦ Pro Reasoning
                  </span>
                </div>
                <p className="text-[11px] text-white/75 flex items-center gap-1.5">
                  <span>Direct Jaipur Workshop Assistant</span>
                </p>
              </div>
            </div>

            {/* Header Control Actions */}
            <div className="flex items-center gap-1">
              {/* Voice Read Aloud Toggle */}
              <button
                type="button"
                onClick={() => {
                  const lastBot = [...messages].reverse().find((m) => m.sender === 'bot')
                  if (lastBot) handleSpeakText(lastBot.text)
                }}
                className={`grid h-8 w-8 place-items-center rounded-xl transition-colors ${
                  isSpeaking ? 'bg-rose text-white animate-pulse' : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Read aloud latest answer'}
                aria-label="Read latest response aloud"
              >
                {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

              {/* Reset Chat */}
              <button
                type="button"
                onClick={resetChat}
                className="grid h-8 w-8 place-items-center rounded-xl text-white/75 hover:bg-white/10 hover:text-white transition-colors"
                title="Restart chat session"
                aria-label="Reset chat"
              >
                <RefreshCw size={15} />
              </button>

              {/* Fullscreen Expand/Minimize */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:grid h-8 w-8 place-items-center rounded-xl text-white/75 hover:bg-white/10 hover:text-white transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand full screen'}
                aria-label="Toggle full screen"
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-xl text-white/75 hover:bg-rose hover:text-white transition-colors ml-1"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div
            className="flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-[#faf6ef]/70"
            onClick={skipStreaming}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user'
              const isStreaming = streamingMessageId === msg.id
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
                            <Sparkles size={11} /> Recommended Handcrafted Styles:
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

                      {/* Assistant Response Action Toolbar (Meta & Gemini Standard) */}
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

                            {/* Speak button */}
                            <button
                              type="button"
                              onClick={() => handleSpeakText(msg.text)}
                              className="hover:text-rose transition-colors p-1"
                              title="Listen to answer"
                            >
                              <Volume2 size={13} />
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

                  {/* Contextual Gemini Follow-up Chips */}
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
                    <span className="text-xs text-ink/50 font-medium ml-2">Reasoning...</span>
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
                placeholder="Ask about travel duffles, bulk quotes, sizes..."
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
                title="Voice dictation"
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
              <span>✦ Powered by Jaipur Artisan Intelligence</span>
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

// Markdown helper to support bold (**text**), italics (*text*), and links
function formatMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-ink/5 px-1 py-0.5 rounded text-rose font-mono text-[11px]">$1</code>')
}
