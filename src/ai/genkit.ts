import { genkit } from '@google/genkit'
import { googleAI } from '@google/genkit-ai/google'

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash',
})

export const generateText = ai.generate