import { ai } from '../genkit'
import { z } from 'zod'

const DefinitionsSchema = z.array(z.object({
  letter: z.string(),
  definition: z.string(),
  answer: z.string(),
  category: z.string().optional(),
}))

export async function generateDefinitions(letters: string[], options: {
  difficulty?: 'easy' | 'medium' | 'hard'
  categories?: string[]
  language?: string
} = {}) {
  const { difficulty = 'medium', categories, language = 'español' } = options

  const prompt = `
Genera definiciones para el juego Pasapalabra/Rosco para las siguientes letras: ${letters.join(', ')}.

Requisitos:
- Cada respuesta debe comenzar con su letra correspondiente
- Dificultad: ${difficulty}
- Idioma: ${language}
${categories ? `- Categorías preferidas: ${categories.join(', ')}` : ''}

Las definiciones deben ser claras y precisas, como en el programa de televisión.
Las respuestas deben ser palabras o conceptos únicos.

Formato de respuesta JSON (array):
[
  {
    "letter": "A",
    "definition": "definición clara y concisa",
    "answer": "respuesta correcta",
    "category": "categoría opcional"
  },
  ...
]
`

  try {
    const response = await ai.generate({
      prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    })

    const content = response.text()
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta')
    }

    const parsed = JSON.parse(jsonMatch[0])
    const validated = DefinitionsSchema.parse(parsed)

    return {
      success: true,
      data: validated,
    }
  } catch (error) {
    console.error('Error generating definitions:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}