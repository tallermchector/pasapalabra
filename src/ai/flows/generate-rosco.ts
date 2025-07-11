import { ai } from '../genkit'
import { z } from 'zod'
import type { GenerateRoscoOptions } from '@/types'

const RoscoSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  questions: z.array(z.object({
    letter: z.string(),
    definition: z.string(),
    answer: z.string(),
    category: z.string().optional(),
  })),
})

export async function generateRosco(options: GenerateRoscoOptions) {
  const { name, difficulty = 'medium', categories, language = 'español' } = options

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const prompt = `
Genera un rosco completo para el juego Pasapalabra con el nombre "${name}".

Requisitos:
- Crear una pregunta para cada letra del alfabeto (A-Z)
- Cada respuesta debe comenzar con su letra correspondiente
- Dificultad: ${difficulty}
- Idioma: ${language}
${categories ? `- Categorías preferidas: ${categories.join(', ')}` : ''}

Las definiciones deben ser claras y precisas, como en el programa de televisión.
Las respuestas deben ser palabras o conceptos únicos.
Incluye una descripción del rosco.

Formato de respuesta JSON:
{
  "name": "${name}",
  "description": "descripción del rosco",
  "questions": [
    {
      "letter": "A",
      "definition": "definición clara y concisa",
      "answer": "respuesta correcta",
      "category": "categoría opcional"
    },
    ...
  ]
}
`

  try {
    const response = await ai.generate({
      prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 3000,
      },
    })

    const content = response.text()
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta')
    }

    const parsed = JSON.parse(jsonMatch[0])
    const validated = RoscoSchema.parse(parsed)

    // Ensure we have all 26 letters
    const missingLetters = alphabet.filter(
      letter => !validated.questions.find(q => q.letter === letter)
    )

    if (missingLetters.length > 0) {
      throw new Error(`Faltan preguntas para las letras: ${missingLetters.join(', ')}`)
    }

    return {
      success: true,
      data: validated,
    }
  } catch (error) {
    console.error('Error generating rosco:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}