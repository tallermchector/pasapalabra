import { ai } from '../genkit'
import { z } from 'zod'
import type { GenerateQuestionOptions } from '@/types'

const QuestionSchema = z.object({
  letter: z.string(),
  definition: z.string(),
  answer: z.string(),
  category: z.string().optional(),
})

export async function generateSingleQuestion(options: GenerateQuestionOptions) {
  const { letter, category, difficulty = 'medium', language = 'español' } = options

  const prompt = `
Genera una pregunta para el juego Pasapalabra/Rosco para la letra "${letter}".

Requisitos:
- La respuesta debe comenzar con la letra "${letter}"
- Dificultad: ${difficulty}
- Idioma: ${language}
${category ? `- Categoría: ${category}` : ''}

La definición debe ser clara y precisa, como en el programa de televisión.
La respuesta debe ser una sola palabra o concepto.

Formato de respuesta JSON:
{
  "letter": "${letter}",
  "definition": "definición clara y concisa",
  "answer": "respuesta correcta",
  "category": "categoría opcional"
}

Ejemplos:
- Para "A": {"letter": "A", "definition": "Mamífero marino de gran tamaño", "answer": "atún", "category": "animales"}
- Para "B": {"letter": "B", "definition": "Deporte que se juega con una pelota naranja", "answer": "baloncesto", "category": "deportes"}
`

  try {
    const response = await ai.generate({
      prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    })

    const content = response.text()
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta')
    }

    const parsed = JSON.parse(jsonMatch[0])
    const validated = QuestionSchema.parse(parsed)

    return {
      success: true,
      data: validated,
    }
  } catch (error) {
    console.error('Error generating question:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}