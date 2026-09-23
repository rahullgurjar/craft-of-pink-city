import { validatePhone, validateEmail, validateName, validateAddress } from '../src/utils/validation.js'

console.log('====================================================')
console.log('🧪 RUNNING COMPREHENSIVE PHONE & EMAIL VALIDATION TESTS')
console.log('====================================================\n')

let passed = 0
let failed = 0

function test(description, result, shouldBeValid, expectedErrorIncludes = null) {
  const isOk = result.isValid === shouldBeValid
  const errorOk = !expectedErrorIncludes || (result.error && result.error.toLowerCase().includes(expectedErrorIncludes.toLowerCase()))

  if (isOk && errorOk) {
    console.log(`✅ PASS: ${description}`)
    passed++
  } else {
    console.error(`❌ FAIL: ${description}`)
    console.error(`   Got: isValid=${result.isValid}, error="${result.error}"`)
    console.error(`   Expected: isValid=${shouldBeValid}, errorSubstring="${expectedErrorIncludes}"`)
    failed++
  }
}

// 1. WhatsApp / Phone Tests
console.log('--- WHATSAPP PHONE NUMBER TESTS ---')
test('Valid Indian Mobile (+91 98290 12345)', validatePhone('+91 98290 12345'), true)
test('Valid Indian Mobile (9829012345)', validatePhone('9829012345'), true)
test('Valid Indian Mobile with leading 0 (09829012345)', validatePhone('09829012345'), true)
test('Valid US Mobile (+1 415 555 2671)', validatePhone('+1 415 555 2671'), true)
test('Valid UK Mobile (+44 7911 123456)', validatePhone('+44 7911 123456'), true)
test('Valid UAE Mobile (+971 50 123 4567)', validatePhone('+971 50 123 4567'), true)

test('Reject Empty Phone', validatePhone(''), false, 'required')
test('Reject Short Phone (98765)', validatePhone('98765'), false, 'too short')
test('Reject Repetitive Digits (9999999999)', validatePhone('9999999999'), false, 'not available on whatsapp')
test('Reject Repetitive Digits (0000000000)', validatePhone('0000000000'), false, 'not available on whatsapp')
test('Reject Repetitive Digits (5555555555)', validatePhone('5555555555'), false, 'not available on whatsapp')
test('Reject Sequence (1234567890)', validatePhone('1234567890'), false, 'not available on whatsapp')
test('Reject Indian Landline (011-23456789)', validatePhone('01123456789'), false, 'landlines and invalid series cannot receive whatsapp')
test('Reject Indian Toll-free / 1800 (1800123456)', validatePhone('1800123456'), false, 'landlines and invalid series cannot receive whatsapp')
test('Reject UK Landline (+44 20 7946 0919)', validatePhone('+44 20 7946 0919'), false, 'landlines cannot receive whatsapp')
test('Reject UAE Landline (+971 4 123 4567)', validatePhone('+971 4 123 4567'), false, 'uae whatsapp numbers must be mobile')

// 2. Email Tests
console.log('\n--- EMAIL AUTHENTICITY TESTS ---')
test('Valid Personal Email (ananya.sharma@gmail.com)', validateEmail('ananya.sharma@gmail.com'), true)
test('Valid Business Email (contact@craftofpinkcity.shop)', validateEmail('contact@craftofpinkcity.shop'), true)
test('Valid Country TLD Email (rahul@artisan.co.in)', validateEmail('rahul@artisan.co.in'), true)

test('Reject Empty Email', validateEmail(''), false, 'required')
test('Reject Invalid Syntax (user@domain)', validateEmail('user@domain'), false, 'domain extension')
test('Reject Missing @ (userdomain.com)', validateEmail('userdomain.com'), false, 'format')
test('Reject Missing Local Part (@gmail.com)', validateEmail('@gmail.com'), false, 'format')
test('Reject Typo Domain (client@gamil.com)', validateEmail('client@gamil.com'), false, 'did you mean @gmail.com')
test('Reject Typo Domain (client@yaho.com)', validateEmail('client@yaho.com'), false, 'did you mean @yahoo.com')
test('Reject Typo Domain (client@hotmial.com)', validateEmail('client@hotmial.com'), false, 'did you mean @hotmail.com')
test('Reject Disposable Email (client@mailinator.com)', validateEmail('client@mailinator.com'), false, 'disposable')
test('Reject Disposable Email (client@tempmail.com)', validateEmail('client@tempmail.com'), false, 'disposable')
test('Reject Disposable Email (client@10minutemail.com)', validateEmail('client@10minutemail.com'), false, 'disposable')
test('Reject Dummy Local Part (test@gmail.com)', validateEmail('test@gmail.com'), false, 'test/dummy')
test('Reject Dummy Local Part (dummy@gmail.com)', validateEmail('dummy@gmail.com'), false, 'test/dummy')
test('Reject Placeholder Domain (client@example.com)', validateEmail('client@example.com'), false, 'genuine, active email')

console.log(`\n====================================================`)
console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`)
console.log(`====================================================`)

if (failed > 0) {
  process.exit(1)
}
