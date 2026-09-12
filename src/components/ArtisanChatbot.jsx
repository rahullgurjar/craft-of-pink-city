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
  Info
} from 'lucide-react'
import { processUserMessage } from '../utils/aiChatEngine'
import { useCart } from '../context/CartContext'
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
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  const cart = useCart()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Namaste! 🙏 I'm **Gulabi**, your Jaipur Craft Assistant.\n\nAsk me anything about our hand block-printed duffles, wedding favors, wholesale prices, or fabric care!`,
      quickReplies: [
        '🛍️ Show Bestsellers',
        '🧳 Quilted Travel Duffles',
        '🎁 Wedding Favors (MOQ 25)',
        '🧵 How are products made?',
        '🚚 Shipping & Timelines'
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
  }, [messages, isOpen, isTyping])

  // Voice recognition setup (Web Speech API)
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please type your message.')
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

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsTyping(true)

    // Simulate smart thinking delay
    setTimeout(() => {
      const botResponse = processUserMessage(query, cart)
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
    }, 450)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    handleSendMessage()
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
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: `Chat reset! How can I assist you with Craft of Pink City today?`,
        quickReplies: [
          '🛍️ Show Bestsellers',
          '🧳 Quilted Travel Duffles',
          '🎁 Wedding Favors (MOQ 25)',
          '🧵 How are products made?'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 rounded-full bg-ink px-4 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-rose hover:shadow-rose/30"
            aria-label="Open AI Craft Assistant Gulabi"
          >
            {/* Avatar & Pulse */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-rose text-white shadow-inner">
              <Sparkles size={18} className="animate-pulse" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-saffron text-[9px] font-bold text-ink">
                  ●
                </span>
              )}
            </div>

            <div className="text-left pr-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-saffron">Ask Gulabi • AI</p>
              <p className="text-xs font-bold leading-none text-white">Jaipur Assistant</p>
            </div>
          </button>
        )}
      </div>

      {/* Chat Window Modal / Drawer */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 z-50 flex h-[580px] w-[92vw] max-w-[420px] flex-col overflow-hidden rounded-3xl border border-ink/15 bg-ivory shadow-2xl transition-all duration-300 animate-slideUp sm:bottom-6 sm:right-6"
          role="dialog"
          aria-label="Gulabi AI Assistant Chat"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ink/10 bg-gradient-to-r from-ink to-[#2b1915] p-4 text-white shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-rose text-white shadow-md">
                <Sparkles size={18} />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-ink" />
              </div>
              <div>
                <h3 className="flex items-center gap-1.5 font-serif text-lg font-bold text-white leading-none">
                  Gulabi <span className="text-xs font-normal text-saffron">✤ Jaipur AI</span>
                </h3>
                <p className="text-[10px] text-white/70 mt-0.5">
                  Always online • Instant catalog & craft answers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                className="grid h-8 w-8 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                title="Reset conversation"
              >
                <RefreshCw size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-white/70 hover:bg-rose hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 bg-[#fffbf5]/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-rose text-white rounded-br-xs'
                      : 'bg-white text-ink border border-ink/10 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Interactive Action Button in Message */}
                  {msg.action && (
                    <div className="mt-3 pt-2 border-t border-ink/10">
                      <button
                        type="button"
                        onClick={() => handleActionClick(msg.action)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-rose transition-colors"
                      >
                        {msg.action.label} <ArrowUpRight size={13} />
                      </button>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1.5 font-medium ${
                      msg.sender === 'user' ? 'text-white/60 text-right' : 'text-ink/40'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Embedded Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2.5 w-full space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose pl-1">
                      Recommended Styles:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id || prod.name}
                          className="flex flex-col justify-between rounded-xl border border-ink/10 bg-white p-2 shadow-xs transition hover:border-rose/50"
                        >
                          <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-ivory">
                            <img
                              src={resolveProductImage(prod.image)}
                              alt={prod.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="mt-1.5">
                            <h4 className="text-[11px] font-bold text-ink truncate font-serif">
                              {prod.name}
                            </h4>
                            <p className="text-[10px] font-bold text-rose">{prod.price}</p>
                          </div>
                          <div className="mt-2 flex gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                window.dispatchEvent(new CustomEvent('open-product-modal', { detail: prod }))
                                setIsOpen(false)
                              }}
                              className="flex-1 rounded-lg bg-ink/5 py-1 text-[10px] font-bold text-ink hover:bg-rose hover:text-white transition-colors"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => cart.addToCart(prod, 1)}
                              className="flex-1 rounded-lg bg-rose py-1 text-[10px] font-bold text-white hover:bg-rose/90 transition-colors"
                            >
                              + Bag
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Reply Chips */}
                {msg.quickReplies && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.quickReplies.map((reply) => (
                      <button
                        type="button"
                        key={reply}
                        onClick={() => handleSendMessage(reply)}
                        className="rounded-full border border-rose/30 bg-white/90 px-3 py-1 text-[11px] font-semibold text-rose shadow-xs hover:bg-rose hover:text-white transition-all"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Animation */}
            {isTyping && (
              <div className="flex items-center gap-2 text-ink/60 bg-white/70 p-2.5 rounded-2xl w-24 border border-ink/5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-rose animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-rose animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleFormSubmit}
            className="flex items-center gap-2 border-t border-ink/10 bg-white p-3 shrink-0"
          >
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors ${
                isListening
                  ? 'bg-rose text-white animate-pulse'
                  : 'bg-ink/5 text-ink/70 hover:text-rose'
              }`}
              title="Voice Speech Input"
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening...' : 'Ask about bags, wedding orders, prints...'}
              className="flex-1 rounded-xl border border-ink/20 bg-ivory/40 px-3.5 py-2 text-xs text-ink placeholder-ink/40 outline-none focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink text-white shadow-sm hover:bg-rose disabled:opacity-40 transition-colors"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
