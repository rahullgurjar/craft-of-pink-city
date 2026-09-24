import { useState, useEffect, useRef, useCallback } from 'react'
import { CheckCircle2, X, Sparkles, MapPin, ArrowUpRight, PackageCheck, Layers } from 'lucide-react'
import { products } from '../data/products'

// Resolve image assets dynamically
const newImages = import.meta.glob('../assets/products-new/*', { eager: true, import: 'default' })
const legacyImages = import.meta.glob('../assets/products/*', { eager: true, import: 'default' })

const resolveProductImage = (image) => {
  return (
    newImages[`../assets/products-new/${image}`] ||
    legacyImages[`../assets/products/${image}`] ||
    image
  )
}

// Diverse pool of first names (Global Western, European, Indian Diaspora, East Asian, Middle Eastern, Latin American)
const FIRST_NAMES_GLOBAL = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Sophia', 'Oliver', 'Charlotte', 'James', 'Amelia', 'Lucas',
  'Mia', 'Benjamin', 'Evelyn', 'Henry', 'Harper', 'Alexander', 'Isabella', 'Daniel', 'Maya', 'Sebastian',
  'Chloe', 'Jack', 'Ella', 'Samuel', 'Grace', 'Ethan', 'Victoria', 'Leo', 'Scarlett', 'Gabriel',
  'Zoe', 'Julian', 'Hannah', 'David', 'Elena', 'Adam', 'Clara', 'Arthur', 'Freja', 'Theo',
  'Astrid', 'Felix', 'Camille', 'Louis', 'Mathilde', 'Matteo', 'Giulia', 'Marco', 'Sofia', 'Luca',
  'Valentina', 'Carlos', 'Lucia', 'Diego', 'Lars', 'Linnea', 'Nina', 'Antoine', 'Elise', 'Hugo',
  'Margot', 'Jonas', 'Leon', 'Maximilian', 'Maja', 'Oscar', 'Ingrid', 'Soren', 'Alister', 'Fiona',
  'Callum', 'Isla', 'Declan', 'Siobhan', 'Ciara', 'Logan', 'Harrison', 'Stella', 'Austin', 'Audrey',
  'Gemma', 'Marcus', 'Beatrice', 'Sienna', 'Tobias', 'Eva', 'Dominic', 'Nico', 'Bianca', 'Stefan',
  'Celine', 'Jasper', 'Valerie', 'Giselle', 'Laurent', 'Helena', 'Kasper', 'Nadia', 'Vincent', 'Adele',
  'Penelope', 'Mason', 'Freya', 'Maeve', 'Lachlan', 'Clive', 'Rowan', 'Gemma', 'Eileen', 'Harrison'
]

const FIRST_NAMES_INDIAN = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Vikram', 'Meera', 'Arjun', 'Ishita', 'Kabir', 'Sneha',
  'Dev', 'Tanvi', 'Rahul', 'Pooja', 'Karan', 'Neha', 'Siddharth', 'Shreya', 'Varun', 'Divya',
  'Kunal', 'Riya', 'Aman', 'Tara', 'Raghav', 'Kavita', 'Nikhil', 'Deepa', 'Sameer', 'Payal',
  'Vihaan', 'Krithi', 'Reyansh', 'Diya', 'Aryan', 'Avani', 'Tarun', 'Natasha', 'Sameera', 'Alok',
  'Swati', 'Gaurav', 'Nidhi', 'Harsh', 'Simran', 'Manan', 'Akshara', 'Aditya', 'Radhika', 'Virendra',
  'Shalini', 'Sunil', 'Bhavna', 'Uday', 'Ankita', 'Prateek', 'Pallavi', 'Manish', 'Sonam', 'Ayush',
  'Komal', 'Pranav', 'Garima', 'Saurabh', 'Poonam', 'Abhinav', 'Archana', 'Kartik', 'Bani', 'Yash',
  'Roshni', 'Rishabh', 'Gayatri', 'Chirag', 'Aashi', 'Tushar', 'Lavanya', 'Mayank', 'Mallika', 'Chetan',
  'Geetika', 'Anmol', 'Juhi', 'Dhruv', 'Sanjana', 'Tejas', 'Tanushree', 'Naveen', 'Madhuri', 'Ishaan'
]

const FIRST_NAMES_INTERNATIONAL = [
  'Tariq', 'Fatima', 'Rashid', 'Layla', 'Omar', 'Amira', 'Faisal', 'Soraya', 'Khalid', 'Noor',
  'Zayd', 'Maryam', 'Hamza', 'Reem', 'Mansoor', 'Hessa', 'Kareem', 'Salma', 'Kenji', 'Yoko',
  'Takashi', 'Hana', 'Hiroshi', 'Mei', 'Jin', 'Sakura', 'Ren', 'Emi', 'Kaori', 'Daisuke',
  'Wei', 'Lin', 'Jun', 'Chen', 'Kai', 'Bryan', 'Denise', 'Kiran', 'Sora', 'Minh',
  'Mateo', 'Camila', 'Thiago', 'Valentina', 'Santiago', 'Sofia', 'Rafael', 'Isabella', 'Fernando', 'Gabriela',
  'Luciana', 'Andres', 'Beatriz', 'Felipe', 'Mariana', 'Esteban', 'Javier', 'Carmen', 'Pilar', 'Rodrigo'
]

const COUPLE_NAMES = [
  'Emma & Oliver', 'Priya & Rohan', 'Chloe & Liam', 'Elena & Marco', 'Sophia & Lucas',
  'Ananya & Kabir', 'Sarah & Mark', 'Camille & Antoine', 'Freja & Lars', 'Neha & Varun',
  'Charlotte & James', 'Mia & Noah', 'Tara & Vihaan', 'Lucia & Carlos', 'Hannah & David',
  'Zoe & Alexander', 'Shreya & Aditya', 'Reem & Tariq', 'Sakura & Kenji', 'Isabella & Leo',
  'Pooja & Kunal', 'Maya & Ethan', 'Clara & Julian', 'Rhea & Siddharth', 'Divya & Arjun',
  'Avani & Aryan', 'Valentina & Mateo', 'Ingrid & Soren', 'Astrid & Felix', 'Giselle & Laurent'
]

const LAST_NAME_SUFFIXES = [
  // Authentic Global & Western surnames
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  // European surnames
  'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Roux', 'David', 'Bertrand', 'Müller',
  'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Rossi',
  'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Van Dijk',
  'De Jong', 'Bakker', 'Jansen', 'Visser', 'Smit', 'Meijer', 'De Boer', 'Silva', 'Santos', 'Ferreira',
  // Middle Eastern & East Asian surnames
  'Al-Maktoum', 'Al-Mansoor', 'Al-Sabah', 'Al-Thani', 'Al-Nuaimi', 'Al-Kuwari', 'Al-Harbi', 'Al-Ghamdi',
  'Tanaka', 'Sato', 'Suzuki', 'Takahashi', 'Watanabe', 'Kobayashi', 'Yamamoto', 'Nakamura', 'Chen', 'Lin',
  'Tan', 'Lim', 'Wong', 'Zhang', 'Kim', 'Park', 'Choi',
  // Indian heritage surnames
  'Sharma', 'Mehta', 'Kapoor', 'Verma', 'Joshi', 'Patel', 'Nair', 'Iyer', 'Gupta', 'Rao',
  'Malhotra', 'Chopra', 'Mukherjee', 'Singh', 'Bhatia', 'Saxena', 'Kaur', 'Deshmukh', 'Bansal', 'Chatterjee',
  'Menon', 'Aggarwal', 'Sen', 'Dutta', 'Singhal', 'Kothari', 'Choudhary', 'Rathore', 'Shekhawat', 'Bhandari',
  // Initials
  'A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'J.', 'K.', 'L.', 'M.',
  'N.', 'P.', 'R.', 'S.', 'T.', 'V.', 'W.', 'Y.', 'Z.'
]

// Curated worldwide cities & countries across all major continents (EXCLUDING Pakistan)
const WORLD_LOCATIONS = [
  // ── United States ──
  { city: 'New York', display: 'New York, USA', country: 'USA' },
  { city: 'Los Angeles', display: 'Los Angeles, USA', country: 'USA' },
  { city: 'San Francisco', display: 'San Francisco, USA', country: 'USA' },
  { city: 'Chicago', display: 'Chicago, USA', country: 'USA' },
  { city: 'Austin', display: 'Austin, USA', country: 'USA' },
  { city: 'Seattle', display: 'Seattle, USA', country: 'USA' },
  { city: 'Boston', display: 'Boston, USA', country: 'USA' },
  { city: 'Miami', display: 'Miami, USA', country: 'USA' },
  { city: 'Dallas', display: 'Dallas, USA', country: 'USA' },
  { city: 'Brooklyn', display: 'Brooklyn, USA', country: 'USA' },
  { city: 'Honolulu', display: 'Honolulu, USA', country: 'USA' },
  { city: 'Atlanta', display: 'Atlanta, USA', country: 'USA' },
  { city: 'Denver', display: 'Denver, USA', country: 'USA' },
  { city: 'San Diego', display: 'San Diego, USA', country: 'USA' },
  { city: 'Portland', display: 'Portland, USA', country: 'USA' },
  { city: 'Nashville', display: 'Nashville, USA', country: 'USA' },
  { city: 'Washington D.C.', display: 'Washington D.C., USA', country: 'USA' },
  { city: 'Charleston', display: 'Charleston, USA', country: 'USA' },
  { city: 'Scottsdale', display: 'Scottsdale, USA', country: 'USA' },
  { city: 'Aspen', display: 'Aspen, USA', country: 'USA' },

  // ── United Kingdom ──
  { city: 'London', display: 'London, UK', country: 'UK' },
  { city: 'Edinburgh', display: 'Edinburgh, UK', country: 'UK' },
  { city: 'Manchester', display: 'Manchester, UK', country: 'UK' },
  { city: 'Oxford', display: 'Oxford, UK', country: 'UK' },
  { city: 'Cambridge', display: 'Cambridge, UK', country: 'UK' },
  { city: 'Bath', display: 'Bath, UK', country: 'UK' },
  { city: 'Bristol', display: 'Bristol, UK', country: 'UK' },
  { city: 'Brighton', display: 'Brighton, UK', country: 'UK' },
  { city: 'Cotswolds', display: 'Cotswolds, UK', country: 'UK' },
  { city: 'Glasgow', display: 'Glasgow, UK', country: 'UK' },
  { city: 'York', display: 'York, UK', country: 'UK' },

  // ── Canada ──
  { city: 'Toronto', display: 'Toronto, Canada', country: 'Canada' },
  { city: 'Vancouver', display: 'Vancouver, Canada', country: 'Canada' },
  { city: 'Montreal', display: 'Montreal, Canada', country: 'Canada' },
  { city: 'Calgary', display: 'Calgary, Canada', country: 'Canada' },
  { city: 'Ottawa', display: 'Ottawa, Canada', country: 'Canada' },
  { city: 'Victoria', display: 'Victoria, Canada', country: 'Canada' },

  // ── Australia & New Zealand ──
  { city: 'Sydney', display: 'Sydney, Australia', country: 'Australia' },
  { city: 'Melbourne', display: 'Melbourne, Australia', country: 'Australia' },
  { city: 'Brisbane', display: 'Brisbane, Australia', country: 'Australia' },
  { city: 'Perth', display: 'Perth, Australia', country: 'Australia' },
  { city: 'Adelaide', display: 'Adelaide, Australia', country: 'Australia' },
  { city: 'Gold Coast', display: 'Gold Coast, Australia', country: 'Australia' },
  { city: 'Auckland', display: 'Auckland, New Zealand', country: 'New Zealand' },
  { city: 'Wellington', display: 'Wellington, New Zealand', country: 'New Zealand' },
  { city: 'Christchurch', display: 'Christchurch, New Zealand', country: 'New Zealand' },

  // ── United Arab Emirates & Gulf (Strictly No Pakistan) ──
  { city: 'Dubai', display: 'Dubai, UAE', country: 'UAE' },
  { city: 'Abu Dhabi', display: 'Abu Dhabi, UAE', country: 'UAE' },
  { city: 'Sharjah', display: 'Sharjah, UAE', country: 'UAE' },
  { city: 'Riyadh', display: 'Riyadh, Saudi Arabia', country: 'Saudi Arabia' },
  { city: 'Jeddah', display: 'Jeddah, Saudi Arabia', country: 'Saudi Arabia' },
  { city: 'Doha', display: 'Doha, Qatar', country: 'Qatar' },
  { city: 'Kuwait City', display: 'Kuwait City, Kuwait', country: 'Kuwait' },
  { city: 'Manama', display: 'Manama, Bahrain', country: 'Bahrain' },
  { city: 'Muscat', display: 'Muscat, Oman', country: 'Oman' },

  // ── France ──
  { city: 'Paris', display: 'Paris, France', country: 'France' },
  { city: 'Nice', display: 'Nice, France', country: 'France' },
  { city: 'Lyon', display: 'Lyon, France', country: 'France' },
  { city: 'Bordeaux', display: 'Bordeaux, France', country: 'France' },
  { city: 'Cannes', display: 'Cannes, France', country: 'France' },
  { city: 'Marseille', display: 'Marseille, France', country: 'France' },

  // ── Italy ──
  { city: 'Milan', display: 'Milan, Italy', country: 'Italy' },
  { city: 'Rome', display: 'Rome, Italy', country: 'Italy' },
  { city: 'Florence', display: 'Florence, Italy', country: 'Italy' },
  { city: 'Venice', display: 'Venice, Italy', country: 'Italy' },
  { city: 'Lake Como', display: 'Como, Italy', country: 'Italy' },
  { city: 'Naples', display: 'Naples, Italy', country: 'Italy' },

  // ── Germany ──
  { city: 'Berlin', display: 'Berlin, Germany', country: 'Germany' },
  { city: 'Munich', display: 'Munich, Germany', country: 'Germany' },
  { city: 'Frankfurt', display: 'Frankfurt, Germany', country: 'Germany' },
  { city: 'Hamburg', display: 'Hamburg, Germany', country: 'Germany' },
  { city: 'Cologne', display: 'Cologne, Germany', country: 'Germany' },

  // ── Spain & Portugal ──
  { city: 'Barcelona', display: 'Barcelona, Spain', country: 'Spain' },
  { city: 'Madrid', display: 'Madrid, Spain', country: 'Spain' },
  { city: 'Seville', display: 'Seville, Spain', country: 'Spain' },
  { city: 'Ibiza', display: 'Ibiza, Spain', country: 'Spain' },
  { city: 'Mallorca', display: 'Palma, Spain', country: 'Spain' },
  { city: 'Lisbon', display: 'Lisbon, Portugal', country: 'Portugal' },
  { city: 'Porto', display: 'Porto, Portugal', country: 'Portugal' },
  { city: 'Algarve', display: 'Algarve, Portugal', country: 'Portugal' },

  // ── Northern & Central Europe ──
  { city: 'Amsterdam', display: 'Amsterdam, Netherlands', country: 'Netherlands' },
  { city: 'Rotterdam', display: 'Rotterdam, Netherlands', country: 'Netherlands' },
  { city: 'Utrecht', display: 'Utrecht, Netherlands', country: 'Netherlands' },
  { city: 'Zurich', display: 'Zurich, Switzerland', country: 'Switzerland' },
  { city: 'Geneva', display: 'Geneva, Switzerland', country: 'Switzerland' },
  { city: 'Basel', display: 'Basel, Switzerland', country: 'Switzerland' },
  { city: 'Vienna', display: 'Vienna, Austria', country: 'Austria' },
  { city: 'Salzburg', display: 'Salzburg, Austria', country: 'Austria' },
  { city: 'Brussels', display: 'Brussels, Belgium', country: 'Belgium' },
  { city: 'Antwerp', display: 'Antwerp, Belgium', country: 'Belgium' },
  { city: 'Stockholm', display: 'Stockholm, Sweden', country: 'Sweden' },
  { city: 'Gothenburg', display: 'Gothenburg, Sweden', country: 'Sweden' },
  { city: 'Copenhagen', display: 'Copenhagen, Denmark', country: 'Denmark' },
  { city: 'Oslo', display: 'Oslo, Norway', country: 'Norway' },
  { city: 'Helsinki', display: 'Helsinki, Finland', country: 'Finland' },
  { city: 'Dublin', display: 'Dublin, Ireland', country: 'Ireland' },
  { city: 'Galway', display: 'Galway, Ireland', country: 'Ireland' },
  { city: 'Athens', display: 'Athens, Greece', country: 'Greece' },
  { city: 'Santorini', display: 'Santorini, Greece', country: 'Greece' },
  { city: 'Mykonos', display: 'Mykonos, Greece', country: 'Greece' },
  { city: 'Monte Carlo', display: 'Monte Carlo, Monaco', country: 'Monaco' },
  { city: 'Luxembourg City', display: 'Luxembourg City, Luxembourg', country: 'Luxembourg' },

  // ── Asia-Pacific ──
  { city: 'Singapore', display: 'Singapore', country: 'Singapore' },
  { city: 'Tokyo', display: 'Tokyo, Japan', country: 'Japan' },
  { city: 'Kyoto', display: 'Kyoto, Japan', country: 'Japan' },
  { city: 'Osaka', display: 'Osaka, Japan', country: 'Japan' },
  { city: 'Yokohama', display: 'Yokohama, Japan', country: 'Japan' },
  { city: 'Seoul', display: 'Seoul, South Korea', country: 'South Korea' },
  { city: 'Busan', display: 'Busan, South Korea', country: 'South Korea' },
  { city: 'Kuala Lumpur', display: 'Kuala Lumpur, Malaysia', country: 'Malaysia' },
  { city: 'Penang', display: 'Penang, Malaysia', country: 'Malaysia' },
  { city: 'Bangkok', display: 'Bangkok, Thailand', country: 'Thailand' },
  { city: 'Phuket', display: 'Phuket, Thailand', country: 'Thailand' },
  { city: 'Chiang Mai', display: 'Chiang Mai, Thailand', country: 'Thailand' },
  { city: 'Bali', display: 'Bali, Indonesia', country: 'Indonesia' },
  { city: 'Jakarta', display: 'Jakarta, Indonesia', country: 'Indonesia' },
  { city: 'Hong Kong', display: 'Hong Kong', country: 'Hong Kong' },
  { city: 'Taipei', display: 'Taipei, Taiwan', country: 'Taiwan' },

  // ── Latin America & Caribbean ──
  { city: 'Mexico City', display: 'Mexico City, Mexico', country: 'Mexico' },
  { city: 'Tulum', display: 'Tulum, Mexico', country: 'Mexico' },
  { city: 'San Miguel de Allende', display: 'San Miguel, Mexico', country: 'Mexico' },
  { city: 'São Paulo', display: 'São Paulo, Brazil', country: 'Brazil' },
  { city: 'Rio de Janeiro', display: 'Rio de Janeiro, Brazil', country: 'Brazil' },
  { city: 'Buenos Aires', display: 'Buenos Aires, Argentina', country: 'Argentina' },
  { city: 'Santiago', display: 'Santiago, Chile', country: 'Chile' },
  { city: 'Bogotá', display: 'Bogotá, Colombia', country: 'Colombia' },
  { city: 'San José', display: 'San José, Costa Rica', country: 'Costa Rica' },
  { city: 'Nassau', display: 'Nassau, Bahamas', country: 'Bahamas' },

  // ── Africa & Indian Ocean ──
  { city: 'Cape Town', display: 'Cape Town, South Africa', country: 'South Africa' },
  { city: 'Johannesburg', display: 'Johannesburg, South Africa', country: 'South Africa' },
  { city: 'Port Louis', display: 'Port Louis, Mauritius', country: 'Mauritius' },
  { city: 'Grand Baie', display: 'Grand Baie, Mauritius', country: 'Mauritius' },
  { city: 'Victoria', display: 'Victoria, Seychelles', country: 'Seychelles' },
  { city: 'Nairobi', display: 'Nairobi, Kenya', country: 'Kenya' },
  { city: 'Marrakech', display: 'Marrakech, Morocco', country: 'Morocco' },

  // ── India (Heritage Craft & Metro Centers) ──
  { city: 'Jaipur', display: 'Jaipur, Rajasthan', country: 'India' },
  { city: 'Mumbai', display: 'Mumbai, Maharashtra', country: 'India' },
  { city: 'Bengaluru', display: 'Bengaluru, Karnataka', country: 'India' },
  { city: 'New Delhi', display: 'New Delhi, Delhi NCR', country: 'India' },
  { city: 'Udaipur', display: 'Udaipur, Rajasthan', country: 'India' },
  { city: 'Kolkata', display: 'Kolkata, West Bengal', country: 'India' },
  { city: 'Hyderabad', display: 'Hyderabad, Telangana', country: 'India' },
  { city: 'Chennai', display: 'Chennai, Tamil Nadu', country: 'India' },
  { city: 'Ahmedabad', display: 'Ahmedabad, Gujarat', country: 'India' },
  { city: 'Pune', display: 'Pune, Maharashtra', country: 'India' },
  { city: 'Chandigarh', display: 'Chandigarh, Punjab', country: 'India' },
  { city: 'Panaji', display: 'Panaji, Goa', country: 'India' },
  { city: 'Kochi', display: 'Kochi, Kerala', country: 'India' },
  { city: 'Gurugram', display: 'Gurugram, Haryana', country: 'India' },
  { city: 'Lucknow', display: 'Lucknow, Uttar Pradesh', country: 'India' },
  { city: 'Jodhpur', display: 'Jodhpur, Rajasthan', country: 'India' },
  { city: 'Surat', display: 'Surat, Gujarat', country: 'India' },
  { city: 'Dehradun', display: 'Dehradun, Uttarakhand', country: 'India' },
  { city: 'Mysuru', display: 'Mysuru, Karnataka', country: 'India' },
  { city: 'Indore', display: 'Indore, Madhya Pradesh', country: 'India' }
]

// Defensive safeguard: Ensure Pakistan and related cities are strictly excluded
const SANITIZED_LOCATIONS = WORLD_LOCATIONS.filter(loc => {
  const combined = `${loc.city} ${loc.display} ${loc.country || ''}`.toLowerCase()
  return (
    !combined.includes('pakistan') &&
    !combined.includes('karachi') &&
    !combined.includes('lahore') &&
    !combined.includes('islamabad') &&
    !combined.includes('rawalpindi') &&
    !combined.includes('faisalabad') &&
    !combined.includes('peshawar') &&
    !combined.includes('quetta') &&
    !combined.includes('multan')
  )
})

const BULK_QUANTITIES = [
  '15 pieces (Sample Trial)', '25 pieces', '35 units', '40 pieces', '50 units', '60 pieces',
  '75 units', '80 pieces', '100 units', '120 pieces', '150 units',
  '180 pieces', '200 units', '250 pieces', '300 units', '450 pieces', '500 units'
]

const TAGS_AND_ROLES = [
  { tag: 'Wedding Favors', role: 'Wedding Planner', badge: 'Bulk Order Placed' },
  { tag: 'Boutique Wholesale', role: 'Boutique Curator', badge: 'Wholesale Order Placed' },
  { tag: 'Corporate Hampers', role: 'Corporate Gifting Lead', badge: 'Bulk Order Placed' },
  { tag: 'Mehendi Giveaways', role: 'Event Designer', badge: 'Bulk Order Placed' },
  { tag: 'Resort Gift Shop', role: 'Resort Store Buyer', badge: 'Boutique Order Placed' },
  { tag: 'Export Consignment', role: 'Textile Importer', badge: 'Export Order Placed' },
  { tag: 'Custom Batch Print', role: 'Handloom Studio', badge: 'Custom Batch Placed' },
  { tag: 'Wedding Welcome Bags', role: 'Bride & Groom', badge: 'Bulk Order Placed' },
  { tag: 'Festive Collection Lot', role: 'Concept Store Owner', badge: 'Wholesale Order Placed' },
  { tag: 'Client Appreciation Kit', role: 'Merchandising Head', badge: 'Bulk Order Placed' },
  { tag: 'Boutique Restock', role: 'Boutique Owner', badge: 'Boutique Order Placed' },
  { tag: 'Monogram Favors', role: 'Luxury Gifting Lead', badge: 'Custom Batch Placed' },
  { tag: 'International Consignment', role: 'Overseas Importer', badge: 'Export Order Placed' },
  { tag: 'Anniversary Return Gifts', role: 'Celebration Host', badge: 'Bulk Order Placed' },
  { tag: 'Hospitality Gifting Lot', role: 'Heritage Hotel Partner', badge: 'Wholesale Order Placed' },
  { tag: 'Exhibition Restock', role: 'Gallery Curator', badge: 'Boutique Order Placed' },
  { tag: 'VIP Suite Welcome Pack', role: 'Luxury Concierge', badge: 'Bulk Order Placed' },
  { tag: 'Luxury Resort Spa Lot', role: 'Spa Director', badge: 'Export Order Placed' },
  { tag: 'Yoga Studio Batch', role: 'Studio Founder', badge: 'Bulk Order Placed' },
  { tag: 'Artisan Boutique Order', role: 'Retail Buyer', badge: 'Boutique Order Placed' }
]

const TIME_AGO_LIST = [
  'Just now',
  '2 minutes ago',
  '4 minutes ago',
  '7 minutes ago',
  '12 minutes ago',
  '18 minutes ago',
  '26 minutes ago',
  '38 minutes ago',
  '45 minutes ago'
]

export default function SalesPopup() {
  const [currentSale, setCurrentSale] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  
  const timerRef = useRef(null)
  const hideTimerRef = useRef(null)
  const usedNamesHistoryRef = useRef([])
  const usedProductsHistoryRef = useRef([])

  // Helper to generate a unique random buyer name
  const generateUniqueBuyerName = useCallback(() => {
    let nameCandidate = ''
    let attempts = 0
    const history = usedNamesHistoryRef.current

    while (attempts < 20) {
      attempts++
      const isCouple = Math.random() < 0.10
      if (isCouple) {
        nameCandidate = COUPLE_NAMES[Math.floor(Math.random() * COUPLE_NAMES.length)]
      } else {
        const poolPicker = Math.random()
        let firstName = ''
        if (poolPicker < 0.28) {
          firstName = FIRST_NAMES_INDIAN[Math.floor(Math.random() * FIRST_NAMES_INDIAN.length)]
        } else if (poolPicker < 0.72) {
          firstName = FIRST_NAMES_GLOBAL[Math.floor(Math.random() * FIRST_NAMES_GLOBAL.length)]
        } else {
          firstName = FIRST_NAMES_INTERNATIONAL[Math.floor(Math.random() * FIRST_NAMES_INTERNATIONAL.length)]
        }

        const lastNameOrInitial = LAST_NAME_SUFFIXES[Math.floor(Math.random() * LAST_NAME_SUFFIXES.length)]
        nameCandidate = `${firstName} ${lastNameOrInitial}`
      }

      // Ensure no recently used duplicate names
      if (!history.includes(nameCandidate)) {
        break
      }
    }

    // Keep history sliding window of last 40 names
    usedNamesHistoryRef.current = [...history.slice(-39), nameCandidate]
    return nameCandidate
  }, [])

  // Helper to pick a non-consecutive product
  const pickProduct = useCallback(() => {
    if (!products || products.length === 0) return null
    const history = usedProductsHistoryRef.current
    let available = products.filter(p => !history.includes(p.id))
    if (available.length === 0) {
      available = products
      usedProductsHistoryRef.current = []
    }
    const product = available[Math.floor(Math.random() * available.length)]
    usedProductsHistoryRef.current = [...usedProductsHistoryRef.current.slice(-6), product.id]
    return product
  }, [])

  // Generate a random bulk sale record pairing buyer with a product & worldwide country
  const generateSaleRecord = useCallback(() => {
    const product = pickProduct()
    if (!product) return null

    const buyerName = generateUniqueBuyerName()
    const loc = SANITIZED_LOCATIONS[Math.floor(Math.random() * SANITIZED_LOCATIONS.length)]
    const tagRole = TAGS_AND_ROLES[Math.floor(Math.random() * TAGS_AND_ROLES.length)]
    const quantity = BULK_QUANTITIES[Math.floor(Math.random() * BULK_QUANTITIES.length)]
    const timeAgo = TIME_AGO_LIST[Math.floor(Math.random() * TIME_AGO_LIST.length)]

    return {
      buyerName,
      role: tagRole.role,
      city: loc.display,
      country: loc.country,
      quantity,
      tag: tagRole.tag,
      badge: tagRole.badge,
      timeAgo,
      product,
    }
  }, [generateUniqueBuyerName, pickProduct])

  // Show a notification
  const showNextSale = useCallback(() => {
    if (isDismissed) return

    const sale = generateSaleRecord()
    if (!sale) return

    setCurrentSale(sale)
    setIsVisible(true)

    // Auto-hide after 5.5 seconds (unless hovered)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false)
      scheduleNextSale()
    }, 5500)
  }, [generateSaleRecord, isDismissed])

  // Schedule next appearance with a balanced cadence (14s to 22s)
  const scheduleNextSale = useCallback(() => {
    if (isDismissed) return
    if (timerRef.current) clearTimeout(timerRef.current)

    // Interval: 14,000ms to 22,000ms
    const delay = Math.floor(Math.random() * 8000) + 14000
    timerRef.current = setTimeout(() => {
      showNextSale()
    }, delay)
  }, [showNextSale, isDismissed])

  // Initial startup after a quick 2.5s delay
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      showNextSale()
    }, 2500)

    return () => {
      clearTimeout(initialDelay)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [showNextSale])

  // Handle Pause on Hover
  const handleMouseEnter = () => {
    setIsPaused(true)
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
    }
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
    if (isVisible && !isDismissed) {
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false)
        scheduleNextSale()
      }, 4000)
    }
  }

  // Handle dismiss click
  const handleDismiss = (e) => {
    e.stopPropagation()
    setIsVisible(false)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    if (timerRef.current) clearTimeout(timerRef.current)

    // Snooze for 45 seconds before resuming
    timerRef.current = setTimeout(() => {
      scheduleNextSale()
    }, 45000)
  }

  // Open product details modal
  const handleOpenProduct = () => {
    if (!currentSale?.product) return
    
    // Dispatch custom event to trigger ProductModal in Products.jsx
    window.dispatchEvent(
      new CustomEvent('open-product-modal', {
        detail: currentSale.product,
      })
    )
  }

  if (!currentSale || !currentSale.product) return null

  const { buyerName, role, city, quantity, tag, badge, timeAgo, product } = currentSale
  const productImage = resolveProductImage(product.image)

  return (
    <aside
      aria-label="Recent bulk order placed notification"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed bottom-20 left-3 sm:bottom-20 sm:left-6 z-[70] max-w-[280px] sm:max-w-[390px] w-auto transition-all duration-500 ease-out transform ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
          : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div
        onClick={handleOpenProduct}
        className="group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border border-ink/15 bg-white/95 backdrop-blur-md p-2 sm:p-3.5 shadow-xl sm:shadow-2xl shadow-ink/20 transition-all duration-300 hover:border-rose/50 hover:shadow-rose/20 hover:-translate-y-0.5"
      >
        {/* Top Gradient Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-rose via-saffron to-terracotta" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-1 right-1 sm:top-2 sm:right-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-ink/5 text-ink/40 transition-colors hover:bg-rose/10 hover:text-rose"
          aria-label="Dismiss order notification"
          title="Dismiss notification"
        >
          <X size={11} />
        </button>

        {/* Header Ribbon: Bulk Order Placed Badge */}
        <div className="flex items-center gap-1 mb-1 sm:mb-2 pr-4 sm:pr-5">
          <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-rose/10 px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-rose border border-rose/20 shrink-0">
            <PackageCheck size={9} className="text-rose shrink-0" />
            <span className="hidden sm:inline">{badge}</span>
            <span className="sm:hidden">Bulk Order</span>
          </span>
          <span className="inline-flex items-center rounded-full bg-saffron/10 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-semibold text-terracotta truncate">
            {tag}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3.5 pr-1 sm:pr-2">
          {/* Product Thumbnail with Live Pulse */}
          <div className="relative h-10 w-10 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg sm:rounded-xl border border-ink/10 bg-[#faf6ef]">
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
            {/* Live Indicator Dot */}
            <span className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 flex h-1.5 w-1.5 sm:h-2.5 sm:w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500 border border-white" />
            </span>
          </div>

          {/* Bulk Order Details */}
          <div className="min-w-0 flex-1">
            {/* Buyer & Location */}
            <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-ink/70 truncate">
              <span className="font-bold text-ink truncate">{buyerName}</span>
              <span className="text-ink/40">•</span>
              <span className="text-terracotta font-medium flex items-center gap-0.5 shrink-0">
                <MapPin size={8} className="text-rose shrink-0" />
                {city}
              </span>
            </div>

            {/* Order Placed Statement */}
            <p className="mt-0.5 text-[10px] sm:text-xs text-ink/90 font-medium line-clamp-1">
              Order: <strong className="text-rose font-bold">{quantity}</strong>
            </p>

            {/* Product Name */}
            <h4 className="text-[10px] sm:text-xs font-bold text-ink truncate group-hover:text-rose transition-colors leading-tight">
              {product.name}
            </h4>

            {/* Footer / Meta (Hidden or ultra-compact on mobile) */}
            <div className="mt-0.5 sm:mt-1.5 flex items-center justify-between gap-1 text-[8px] sm:text-[10px] text-ink/50">
              <span className="text-ink/60 truncate">{timeAgo}</span>

              <div className="flex items-center gap-0.5 text-emerald-700 font-semibold bg-emerald-50 px-1 py-0.2 rounded-full border border-emerald-200 text-[8px] sm:text-[9px] shrink-0">
                <CheckCircle2 size={8} className="text-emerald-600 shrink-0" />
                <span className="hidden sm:inline">Verified Order</span>
                <span className="sm:hidden">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Wholesale Prompt (Cleanly hidden on mobile) */}
        <div className="hidden sm:flex mt-2.5 pt-2 border-t border-ink/5 items-center justify-between text-[10px] text-rose font-semibold">
          <span className="flex items-center gap-1 text-ink/60 font-normal truncate">
            <Sparkles size={11} className="text-saffron shrink-0" />
            Tap to View Product & Bulk Quotes
          </span>
          <span className="inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform shrink-0">
            Wholesale Quote <ArrowUpRight size={11} />
          </span>
        </div>

        {/* Subtle Progress Bar */}
        {isVisible && !isPaused && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose to-saffron animate-sales-progress"
            />
          </div>
        )}
      </div>
    </aside>
  )
}
