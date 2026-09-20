import { naturalizeTextForSpeech, splitTextIntoSpeechChunks, VOICE_PERSONAS } from '../src/utils/humanVoiceEngine.js'

console.log('VOICE_PERSONAS count:', VOICE_PERSONAS.length)
const sampleEn = 'Our **Quilted Travel Duffle** is ₹1,499 with 18"×10"×10" size & MOQ 25 pcs! Call +91 99824 51833.'
const natEn = naturalizeTextForSpeech(sampleEn, 'en')
console.log('Naturalized EN:', natEn)
console.log('Chunks EN:', splitTextIntoSpeechChunks(natEn))

const sampleHi = 'हमारा **क्विल्टेड ट्रेवल डफल** ₹1,499 का है। साइज 18"×10"×10" और MOQ 25 पीस है। संपर्क करें +91 99824 51833.'
const natHi = naturalizeTextForSpeech(sampleHi, 'hi')
console.log('Naturalized HI:', natHi)
console.log('Chunks HI:', splitTextIntoSpeechChunks(natHi))
