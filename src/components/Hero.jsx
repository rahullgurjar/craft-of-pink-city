import { useState, useEffect } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { instagram } from '../data/products';
import InstagramIcon from './InstagramIcon';

import heroYellowPouch from '../assets/brand/hero-yellow-pouch.webp';
import heroPinkDuffle from '../assets/products/duffle-pink-lemonade.jpg';
import heroPinkRuffleTote from '../assets/products/tote-pink-ruffle.jpg';
import heroPatchworkDuffle from '../assets/products/duffle-heritage-patchwork.jpg';
import heroIndigoVanity from '../assets/products/vanity-blue-toile.webp';

const HERO_SLIDES = [
  {
    image: heroYellowPouch,
    alt: 'Yellow block-print vanity pouch by Craft of Pink City',
    title: 'Made in Jaipur',
    subtitle: 'for everyday colour.',
    tag: '✨ Pure Handblock Cotton',
  },
  {
    image: heroPinkDuffle,
    alt: 'Pink lemonade handcrafted quilted duffle bag',
    title: 'Artisan Travel',
    subtitle: 'pure quilted cotton.',
    tag: '🌸 Quilted Weekender',
  },
  {
    image: heroPatchworkDuffle,
    alt: 'Heritage Jaipur Indigo Patchwork Duffle Bag',
    title: 'Dabu & Indigo',
    subtitle: 'sustainable heritage craft.',
    tag: '🪡 Artisan Patchwork',
  },
  {
    image: heroPinkRuffleTote,
    alt: 'Blush pink ruffle handcrafted floral tote bag',
    title: 'Sanganeri Floral',
    subtitle: 'timeless Jaipur motif.',
    tag: '🌿 Ruffle Accent Tote',
  },
  {
    image: heroIndigoVanity,
    alt: 'Vintage Jaipur Blue Toile Vanity Case',
    title: 'Jaipur Blue Toile',
    subtitle: 'heirloom craftsmanship.',
    tag: '🧵 Luxury Vanity Case',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeItem = HERO_SLIDES[currentSlide];

  return (
    <section id="home" className="hero-pattern overflow-hidden">
      <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20">
        <div className="reveal">
          <p className="eyebrow flex items-center gap-2">
            <Sparkles size={13} className="text-saffron" /> Crafted in Jaipur
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-6xl leading-[.88] tracking-tight text-ink sm:text-7xl lg:text-8xl">
            The Art of Block Printing, <i className="font-normal text-rose">Crafted</i> in Jaipur.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-ink/75">
            Discover thoughtfully crafted fabrics, quilted travel duffles, and handmade vanity pouches inspired by traditional block-printing techniques and the rich textile heritage of Jaipur.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a className="btn-primary" href="#craft">
              Explore Our Craft <ArrowDown size={16} />
            </a>
            <a className="btn-secondary" href={instagram} target="_blank" rel="noreferrer">
              <InstagramIcon size={16} /> Follow on Instagram
            </a>
          </div>
        </div>

        <div
          className="hero-photo-wrap reveal"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Ambient warm aura pulse */}
          <div className="hero-photo-glow" />

          {/* Rotating Handcrafted Seal Stamp */}
          <div className="hero-stamp-badge">
            <svg
              viewBox="0 0 100 100"
              className="hero-stamp-rotate h-full w-full fill-current text-saffron p-1"
            >
              <path
                id="stampCirclePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
              <text fontSize="9.2" fontWeight="bold" letterSpacing="0.14em" fill="#f8e0d4">
                <textPath href="#stampCirclePath" startOffset="0%">
                  • JAIPUR HANDBLOCK • 100% ARTISAN
                </textPath>
              </text>
            </svg>
            <span className="absolute font-serif text-xl text-saffron">✤</span>
          </div>

          <div className="hero-photo">
            {/* Dynamic Sliding Images with Ken Burns Zoom */}
            {HERO_SLIDES.map((slide, idx) => (
              <img
                key={slide.title}
                src={slide.image}
                alt={slide.alt}
                className={`hero-slide-img ${idx === currentSlide ? 'active' : 'inactive'}`}
              />
            ))}

            {/* Shimmer light sweep animation */}
            <div className="hero-shimmer" />

            {/* Floating Artisan Quality Tag */}
            <div className="hero-tag-pill">
              <span>{activeItem.tag}</span>
            </div>

            {/* Slide Caption with smooth fade */}
            <div className="hero-photo-caption">
              {activeItem.title}
              <br />
              <i>{activeItem.subtitle}</i>
            </div>

            {/* Slide Navigation Dots */}
            <div className="hero-controls">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setCurrentSlide(idx)}
                  className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
