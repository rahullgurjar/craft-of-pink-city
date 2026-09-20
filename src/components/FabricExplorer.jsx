import { useState } from 'react'
import { Sparkles, Layers, ShieldCheck, Feather, Sun, CheckCircle2, Award, ArrowRight } from 'lucide-react'

// Import representative heritage photos
import cottonImg from '../assets/brand/about-red-dress.webp'
import blockImg from '../assets/products/duffle-heritage-patchwork.jpg'
import dyeImg from '../assets/products/duffle-indigo-blossom.jpg'
import quiltImg from '../assets/brand/hero-yellow-pouch.webp'

const PILLARS = [
  {
    id: 'cotton',
    title: '100% Pure Jaipur Cotton',
    shortTitle: 'Pure Cotton',
    icon: Feather,
    tag: '40s & 60s Count Voile',
    image: cottonImg,
    lead: 'Natural breathability, featherlight softness, and skin-friendly luxury.',
    description:
      'We exclusively weave with premium long-staple Indian cotton. Free from synthetic polyester or plastic blends, our fabric allows air to circulate freely and becomes softer with every gentle hand wash.',
    specs: [
      { label: 'Composition', value: '100% Pure Natural Cotton' },
      { label: 'Weave Grade', value: '60s Combed Voile / Cambric' },
      { label: 'Feel', value: 'Ultra-Soft, Breathable, Lightweight' },
      { label: 'Certification', value: 'Zero Synthetic Blends' },
    ],
    highlight: 'Hand-Selected Cotton Batting',
  },
  {
    id: 'blocks',
    title: 'Hand-Carved Sheesham Woodblocks',
    shortTitle: 'Carved Woodblocks',
    icon: Award,
    tag: 'Artisan Woodcarving',
    image: blockImg,
    lead: 'Every motif is first chiseled by hand into seasoned rosewood.',
    description:
      'Master woodcarvers in Jaipur spend days hand-chiseling intricate floral and geometric motifs onto dense Sheesham blocks with precision air-release flutes that ensure crisp, even transfer of artisanal dyes.',
    specs: [
      { label: 'Material', value: 'Seasoned Sheesham (Rosewood)' },
      { label: 'Craft Origin', value: 'Sanganer & Bagru Workshops' },
      { label: 'Technique', value: 'Chisel & Gouge Hand Carving' },
      { label: 'Lifespan', value: 'Heirloom Tooling (10+ Years)' },
    ],
    highlight: 'Master Woodcarver Certified',
  },
  {
    id: 'dyes',
    title: 'Azo-Free Botanical Dyes',
    shortTitle: 'Natural Dyes',
    icon: Sun,
    tag: 'Skin-Safe & Eco-Friendly',
    image: dyeImg,
    lead: 'Sun-dried under the Rajasthan skies for rich, deep heritage tones.',
    description:
      'Our color palettes rely on eco-safe, azo-free pigments blended with natural indigo, madder root, and turmeric. Each piece is hand-washed in open-air water tanks and sun-baked in the Jaipur sun to fix vibrant tones.',
    specs: [
      { label: 'Dye Safety', value: '100% Azo-Free & Non-Toxic' },
      { label: 'Drying Process', value: 'Natural Open-Air Sun Drying' },
      { label: 'Color Fastness', value: 'Pre-Washed & Color-Fixed' },
      { label: 'Impact', value: 'Water-Conscious Artisan Craft' },
    ],
    highlight: 'Eco-Friendly & Hypoallergenic',
  },
  {
    id: 'quilting',
    title: 'Precision Diamond Hand-Quilting',
    shortTitle: 'Diamond Quilting',
    icon: Layers,
    tag: 'Cushioned Luxury',
    image: quiltImg,
    lead: 'Multi-layer padded construction that protects your essentials.',
    description:
      'Each duffle bag, cosmetic vanity box, and yoga carrier features pure cotton batting layered between handblock fabrics, secured with thousands of precise diamond stitches and reinforced piped edges.',
    specs: [
      { label: 'Batting Layer', value: '100% Fluffy Pure Cotton' },
      { label: 'Stitch Pattern', value: 'Reinforced Diamond Quilting' },
      { label: 'Structure', value: 'Padded Protection with Piped Edges' },
      { label: 'Zippers', value: 'Smooth Heavy-Duty Artisan Sliders' },
    ],
    highlight: 'Durable Diamond Architecture',
  },
]

export default function FabricExplorer() {
  const [activeTab, setActiveTab] = useState(PILLARS[0].id)
  const currentPillar = PILLARS.find((p) => p.id === activeTab) || PILLARS[0]
  const Icon = currentPillar.icon

  return (
    <section id="fabric-explorer" className="relative overflow-hidden bg-[#faf6ef] py-20 lg:py-28 border-y border-ink/10">
      {/* Decorative Jharokha Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-rose/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-saffron/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="eyebrow flex items-center justify-center gap-2">
            <Sparkles size={13} className="text-saffron" />
            Tactile Sensory Craftsmanship
          </p>
          <h2 className="section-title mt-3">
            The Touch of Pure <i>Jaipur Cotton.</i>
          </h2>
          <p className="body-copy mx-auto mt-4 text-sm sm:text-base">
            Every Craft of Pink City creation begins with tactile materials — pure natural fibers, hand-carved woodblocks, and artisanal quilting passed down through generations.
          </p>
        </div>

        {/* Sensory Pillar Navigation Tabs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {PILLARS.map((pillar) => {
            const isSelected = pillar.id === activeTab
            const TabIcon = pillar.icon

            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActiveTab(pillar.id)}
                className={`group flex items-center gap-2 rounded-2xl px-4 sm:px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isSelected
                    ? 'bg-ink text-white shadow-xl shadow-ink/20 ring-2 ring-rose/40 scale-105'
                    : 'bg-white/80 text-ink/70 hover:bg-white hover:text-ink border border-ink/10 shadow-sm'
                }`}
              >
                <TabIcon
                  size={15}
                  className={`transition-colors ${
                    isSelected ? 'text-saffron' : 'text-rose group-hover:text-terracotta'
                  }`}
                />
                <span>{pillar.shortTitle}</span>
              </button>
            )
          })}
        </div>

        {/* Interactive Feature Display Card */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-ink/15 bg-white shadow-2xl shadow-ink/10 transition-all duration-500">
          <div className="grid lg:grid-cols-[1.1fr_.9fr] items-stretch">
            {/* Left: Deep Storytelling & Specs */}
            <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-rose/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose border border-rose/20 mb-4">
                  <Icon size={14} className="text-rose" />
                  <span>{currentPillar.tag}</span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
                  {currentPillar.title}
                </h3>

                <p className="mt-3 text-base sm:text-lg font-medium text-rose italic">
                  "{currentPillar.lead}"
                </p>

                <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink/75">
                  {currentPillar.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="mt-8 pt-6 border-t border-ink/10">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-ink/40 mb-3">
                  Artisan Quality Specifications
                </h4>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {currentPillar.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-2xl bg-[#faf6ef] p-3 border border-ink/5"
                    >
                      <div className="text-[10px] font-semibold text-ink/50 uppercase tracking-wider">
                        {spec.label}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-ink mt-0.5">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Rich Visual & Seal */}
            <div className="relative min-h-[320px] lg:min-h-full bg-ink/5 overflow-hidden group">
              <img
                src={currentPillar.image}
                alt={currentPillar.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />

              {/* Shimmer Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />

              {/* Floating Guarantee Ribbon */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-3 rounded-2xl bg-white/95 backdrop-blur-md p-4 border border-ink/10 shadow-xl text-ink">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose to-saffron text-white shadow-md">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink">
                      {currentPillar.highlight}
                    </div>
                    <div className="text-[10px] text-ink/60">
                      Handcrafted in Jaipur Atelier
                    </div>
                  </div>
                </div>

                <a
                  href="#products"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-rose hover:underline"
                >
                  Explore <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
