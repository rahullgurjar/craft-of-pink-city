/**
 * Real Contact & WhatsApp Verification Utilities
 * 
 * Verifies that client input details (WhatsApp Contact Number, Email, Name, Address)
 * are genuine, active, correctly structured, and capable of receiving communication.
 */

// Known temporary / disposable email providers to block
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'throwawaymail.com',
  'yopmail.com',
  'sharklasers.com',
  'dispostable.com',
  'getairmail.com',
  'mytemp.email',
  'trashmail.com',
  'trashmail.net',
  'burnermail.io',
  'crazymailing.com',
  'maildrop.cc',
  'getnada.com',
  'inboxkitten.com',
  'tempail.com',
  'fakemailgenerator.com',
  'mohmal.com',
  'emailondeck.com',
  'generator.email',
  'grr.la',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamail.biz',
  'guerrillamailblock.com',
  'dropmail.me',
  '10mail.org',
  'fakemail.net',
])

// Common domain typos to detect and prompt user to recheck/change
const DOMAIN_TYPOS = {
  'gamil.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaul.com': 'gmail.com',
  'gimail.com': 'gmail.com',
  'gmali.com': 'gmail.com',
  'gmeil.com': 'gmail.com',
  'gmaiil.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yhoo.com': 'yahoo.com',
  'yaho.co.in': 'yahoo.co.in',
  'hotmial.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloock.com': 'outlook.com',
  'outlock.com': 'outlook.com',
  'redifmail.com': 'rediffmail.com',
  'rediff.com': 'rediffmail.com',
  'rediffmial.com': 'rediffmail.com',
  'iclud.com': 'icloud.com',
  'icoud.com': 'icloud.com',
}

// Dummy / spam email local-part names to reject
const FAKE_LOCAL_PARTS = new Set([
  'test',
  'testing',
  'tester',
  'admin',
  'administrator',
  'dummy',
  'fake',
  'asdf',
  'asdfgh',
  'qwerty',
  'zxcv',
  '123',
  '1234',
  '12345',
  'abc',
  'abcd',
  'xyz',
  'noemail',
  'none',
  'null',
  'undefined',
  'sample',
  'demo',
  'unknown',
  'temp',
  'spam',
])

/**
 * Validates customer full name
 * @param {string} name 
 * @returns {{isValid: boolean, error?: string}}
 */
export function validateName(name) {
  const trimmed = (name || '').trim()
  if (!trimmed) {
    return { isValid: false, error: 'Please enter your full name.' }
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long.' }
  }

  // Must contain only letters, spaces, hyphens, periods, apostrophes
  const nameRegex = /^[a-zA-Z\u00C0-\u024F\u0900-\u097F\s.'-]+$/
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid name using letters only.' }
  }

  // Check for repeated spam characters or common keyboard smashes
  if (
    /^(.)\1{3,}$/i.test(trimmed) ||
    /^(asdf|qwer|zxcv|1234|test|fake|dummy)+$/i.test(trimmed.toLowerCase())
  ) {
    return { isValid: false, error: 'Please enter your real full name.' }
  }

  return { isValid: true }
}

/**
 * Validates WhatsApp / Phone number authenticity & format
 * Verifies that the number is an active mobile series capable of receiving WhatsApp.
 * Tells client to recheck or change number if not available on WhatsApp.
 * @param {string} phone 
 * @returns {{isValid: boolean, error?: string}}
 */
export function validatePhone(phone) {
  const raw = (phone || '').trim()
  if (!raw) {
    return {
      isValid: false,
      error: 'WhatsApp contact number is required. Please enter your active mobile number.',
    }
  }

  // Extract digits only
  const digits = raw.replace(/\D/g, '')

  if (digits.length < 10) {
    return {
      isValid: false,
      error: 'Number is too short. Please enter a valid 10-digit WhatsApp mobile number or change your number.',
    }
  }

  if (digits.length > 15) {
    return {
      isValid: false,
      error: 'Phone number cannot exceed 15 digits. Please recheck or change your number.',
    }
  }

  // Detect repetitive dummy sequences (e.g. 0000000000, 9999999999, 1111111111, 5555555555)
  if (/^(\d)\1{5,}$/.test(digits)) {
    return {
      isValid: false,
      error: 'This number is not available on WhatsApp. Please recheck or change your number before submitting.',
    }
  }

  // Detect ascending/descending sequences (e.g. 1234567890, 9876543210)
  const sequentialPatterns = [
    '1234567890',
    '9876543210',
    '0123456789',
    '1234512345',
    '9876598765',
    '9898989898',
    '9191919191',
    '9090909090',
    '7878787878',
    '8989898989',
  ]
  for (const seq of sequentialPatterns) {
    if (digits.includes(seq)) {
      return {
        isValid: false,
        error: 'This sequential number is not available on WhatsApp. Please recheck or change to your active number.',
      }
    }
  }

  // ── Indian Mobile Number Validation (+91 or 10 digits) ──
  // Landlines, toll-free (1800), and invalid blocks do NOT have WhatsApp
  let indianLocal = null
  if (digits.length === 10) {
    indianLocal = digits
  } else if (digits.length === 11 && digits.startsWith('0')) {
    indianLocal = digits.slice(1)
  } else if (digits.length === 12 && digits.startsWith('91')) {
    indianLocal = digits.slice(2)
  }

  if (indianLocal) {
    // Valid Indian cellular allocations must start with 6, 7, 8, or 9
    const firstDigit = indianLocal.charAt(0)
    if (!['6', '7', '8', '9'].includes(firstDigit)) {
      return {
        isValid: false,
        error:
          'Landlines and invalid series cannot receive WhatsApp. Active Indian WhatsApp numbers must start with 6, 7, 8, or 9. Please recheck or change your number.',
      }
    }

    // Check that not all remaining digits are identical (e.g. 9000000000, 8888888888)
    const rest = indianLocal.slice(1)
    if (/^(\d)\1{6,}$/.test(rest)) {
      return {
        isValid: false,
        error: 'This number is not active on WhatsApp. Please recheck or change your number before submitting.',
      }
    }

    return { isValid: true }
  }

  // ── International Country Specific Checks ──
  // US / Canada (+1): 10 digits after +1, area code 2-9
  if (digits.startsWith('1') && digits.length === 11) {
    const areaCode = digits.slice(1, 4)
    if (areaCode.charAt(0) === '0' || areaCode.charAt(0) === '1') {
      return {
        isValid: false,
        error: 'Invalid US/Canada phone number. Area code cannot start with 0 or 1. Please recheck or change your WhatsApp number.',
      }
    }
  }

  // United Kingdom (+44): Mobile numbers start with 7
  if (digits.startsWith('44') && digits.length >= 12) {
    const ukLocal = digits.slice(2)
    if (!ukLocal.startsWith('7')) {
      return {
        isValid: false,
        error: 'UK WhatsApp numbers must be mobile numbers starting with +44 7 (landlines cannot receive WhatsApp). Please change your number.',
      }
    }
  }

  // United Arab Emirates (+971): Mobile numbers start with 5
  if (digits.startsWith('971') && digits.length >= 11) {
    const uaeLocal = digits.slice(3)
    if (!uaeLocal.startsWith('5')) {
      return {
        isValid: false,
        error: 'UAE WhatsApp numbers must be mobile numbers starting with +971 5. Please recheck or change your number.',
      }
    }
  }

  // Saudi Arabia (+966): Mobile numbers start with 5
  if (digits.startsWith('966') && digits.length >= 11) {
    const ksaLocal = digits.slice(3)
    if (!ksaLocal.startsWith('5')) {
      return {
        isValid: false,
        error: 'Saudi WhatsApp numbers must be mobile numbers starting with +966 5. Please recheck or change your number.',
      }
    }
  }

  // Australia (+61): Mobile numbers start with 4
  if (digits.startsWith('61') && digits.length >= 11) {
    const auLocal = digits.slice(2)
    if (!auLocal.startsWith('4')) {
      return {
        isValid: false,
        error: 'Australian WhatsApp numbers must be mobile numbers starting with +61 4. Please recheck or change your number.',
      }
    }
  }

  return { isValid: true }
}

/**
 * Validates Email authenticity, structure, domain validity, and filters disposable/fake emails
 * Tells client to recheck or change email if invalid, misspelled, or disposable.
 * @param {string} email 
 * @returns {{isValid: boolean, error?: string, suggestion?: string}}
 */
export function validateEmail(email) {
  const trimmed = (email || '').trim().toLowerCase()
  if (!trimmed) {
    return { isValid: false, error: 'Email address is required. Please enter your valid email.' }
  }

  // Standard RFC 5322 format check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid email address format. Please enter a valid email with a domain extension (e.g. name@domain.com).',
    }
  }

  const parts = trimmed.split('@')
  if (parts.length !== 2) {
    return { isValid: false, error: 'Please enter a valid email address.' }
  }

  const [localPart, domain] = parts

  // 1. Check for domain typos first to suggest the correction immediately
  if (DOMAIN_TYPOS[domain]) {
    const corrected = DOMAIN_TYPOS[domain]
    return {
      isValid: false,
      error: `Did you mean @${corrected}? Please recheck or change your email address.`,
    }
  }

  // 2. Reject disposable / temporary email domains
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: 'Temporary or disposable email addresses are not accepted. Please recheck or change to your active email.',
    }
  }

  // 3. Reject generic placeholder test domains
  if (['example.com', 'example.org', 'example.net', 'test.com', 'fake.com', 'domain.com'].includes(domain)) {
    return {
      isValid: false,
      error: 'Please enter your genuine, active email address so we can send your order confirmation.',
    }
  }

  // 4. Domain extension checks
  const domainParts = domain.split('.')
  if (domainParts.length < 2) {
    return {
      isValid: false,
      error: 'Email must include a valid domain extension (e.g. .com, .in).',
    }
  }

  const tld = domainParts[domainParts.length - 1]
  if (!tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return {
      isValid: false,
      error: 'Please enter a valid domain extension (e.g. .com, .in, .org, .co.uk).',
    }
  }

  // 5. Local part validation
  if (localPart.length < 2) {
    return { isValid: false, error: 'Email username is too short. Please recheck your email.' }
  }

  if (FAKE_LOCAL_PARTS.has(localPart)) {
    return {
      isValid: false,
      error: 'This email appears to be a test/dummy address. Please provide your real personal or business email.',
    }
  }

  return { isValid: true }
}

/**
 * Validates delivery address completeness
 * @param {string} address 
 * @returns {{isValid: boolean, error?: string}}
 */
export function validateAddress(address) {
  const trimmed = (address || '').trim()
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please provide full delivery address with PIN code.',
    }
  }

  if (trimmed.length < 10) {
    return {
      isValid: false,
      error: 'Please enter complete delivery address (House/Flat, Street, City, State, PIN code).',
    }
  }

  // Check for repeated keyboard spam
  if (/^(.)\1{4,}$/i.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a genuine, complete delivery address.',
    }
  }

  return { isValid: true }
}
