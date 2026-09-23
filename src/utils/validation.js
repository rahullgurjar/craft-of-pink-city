/**
 * Form Validation & Verification Utilities
 * 
 * Verifies that client input details (Name, Phone, Email, Address)
 * are real, authentic, and properly structured before submitting.
 */

// Dummy / spam email patterns to reject
const FAKE_EMAIL_PATTERNS = [
  /^test@test/i,
  /^admin@admin/i,
  /^dummy@/i,
  /^fake@/i,
  /^asdf@asdf/i,
  /^abc@abc/i,
  /^123@/i,
  /^xyz@xyz/i,
  /^noemail@/i,
  /@example\.(com|net|org)$/i,
  /@test\.(com|net|org)$/i,
  /@fake\.(com|net|org)$/i,
]

// Dummy / repetitive phone patterns to reject
const FAKE_PHONE_PATTERNS = [
  '0000000000',
  '1111111111',
  '2222222222',
  '3333333333',
  '4444444444',
  '5555555555',
  '6666666666',
  '7777777777',
  '8888888888',
  '9999999999',
  '1234567890',
  '0987654321',
  '1234512345',
]

/**
 * Validates a customer's full name
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
    return { isValid: false, error: 'Please enter a valid name (letters only).' }
  }

  // Check for gibberish repeated letters (e.g. "aaaaa", "asdfasdf")
  if (/^(.)\1{3,}$/i.test(trimmed) || /^(asdf|qwer|zxcv|1234)+$/i.test(trimmed)) {
    return { isValid: false, error: 'Please enter a genuine full name.' }
  }

  return { isValid: true }
}

/**
 * Validates a customer's phone or WhatsApp number
 * @param {string} phone 
 * @returns {{isValid: boolean, error?: string}}
 */
export function validatePhone(phone) {
  const trimmed = (phone || '').trim()
  if (!trimmed) {
    return { isValid: false, error: 'Please enter your phone / WhatsApp number.' }
  }

  // Remove spaces, dashes, parentheses, plus
  const digitsOnly = trimmed.replace(/\D/g, '')

  if (digitsOnly.length < 10) {
    return { isValid: false, error: 'Phone number must have at least 10 digits.' }
  }

  if (digitsOnly.length > 15) {
    return { isValid: false, error: 'Please enter a valid phone number (max 15 digits).' }
  }

  // Check against obvious dummy numbers
  for (const fake of FAKE_PHONE_PATTERNS) {
    if (digitsOnly.includes(fake)) {
      return { isValid: false, error: 'Please enter a genuine, active phone number.' }
    }
  }

  // If 10-digit Indian number, it must start with 6, 7, 8, or 9
  if (digitsOnly.length === 10) {
    if (!/^[6-9]/.test(digitsOnly)) {
      return {
        isValid: false,
        error: 'Indian 10-digit mobile numbers must start with 6, 7, 8, or 9.',
      }
    }
  }

  // If 12-digit Indian number with 91 country code
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    const localPart = digitsOnly.slice(2)
    if (!/^[6-9]/.test(localPart)) {
      return {
        isValid: false,
        error: 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.',
      }
    }
  }

  return { isValid: true }
}

/**
 * Validates a customer's email address
 * @param {string} email 
 * @returns {{isValid: boolean, error?: string}}
 */
export function validateEmail(email) {
  const trimmed = (email || '').trim().toLowerCase()
  if (!trimmed) {
    return { isValid: false, error: 'Email address is required.' }
  }

  // Standard RFC 5322 compliant regex for web forms
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email format (e.g. name@domain.com).' }
  }

  // Ensure domain has at least a valid 2-letter extension (e.g. .com, .in, .org, .co)
  const parts = trimmed.split('@')
  if (parts.length !== 2) {
    return { isValid: false, error: 'Please enter a valid email address.' }
  }

  const domain = parts[1]
  const domainParts = domain.split('.')
  const tld = domainParts[domainParts.length - 1]

  if (!tld || tld.length < 2) {
    return { isValid: false, error: 'Please provide a valid email domain (e.g. .com, .in).' }
  }

  // Reject known test / fake email addresses
  for (const pattern of FAKE_EMAIL_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: 'Please enter a genuine, active email address.' }
    }
  }

  return { isValid: true }
}

/**
 * Validates a delivery address
 * @param {string} address 
 * @returns {{isValid: boolean, error?: string}}
 */
export function validateAddress(address) {
  const trimmed = (address || '').trim()
  if (!trimmed) {
    return { isValid: false, error: 'Please provide complete delivery address with PIN code.' }
  }

  if (trimmed.length < 8) {
    return { isValid: false, error: 'Please provide full address (house, street, city, PIN).' }
  }

  // Check for repeated spam characters
  if (/^(.)\1{4,}$/i.test(trimmed)) {
    return { isValid: false, error: 'Please enter a genuine delivery address.' }
  }

  return { isValid: true }
}
