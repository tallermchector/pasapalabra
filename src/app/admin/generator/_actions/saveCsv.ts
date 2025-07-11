'use server'

import { saveRosco } from './saveRosco'

interface CsvQuestion {
  letter: string
  definition: string
  answer: string
  category?: string
}

export async function saveCsv(
  csvContent: string,
  roscoName: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<{
  success: boolean
  data?: any
  error?: string
}> {
  try {
    // Parse CSV content
    const lines = csvContent.trim().split('\n')
    const questions: CsvQuestion[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Simple CSV parsing (assumes comma-separated values)
      const parts = line.split(',').map(part => part.trim().replace(/^"|"$/g, ''))
      
      if (parts.length < 3) {
        return {
          success: false,
          error: `Línea ${i + 1}: Formato incorrecto. Se esperan al menos 3 columnas: letra, definición, respuesta`,
        }
      }

      const [letter, definition, answer, category] = parts

      if (!letter || !definition || !answer) {
        return {
          success: false,
          error: `Línea ${i + 1}: Faltan datos requeridos`,
        }
      }

      if (letter.length !== 1 || !/[A-Za-z]/.test(letter)) {
        return {
          success: false,
          error: `Línea ${i + 1}: La letra debe ser un solo carácter alfabético`,
        }
      }

      questions.push({
        letter: letter.toUpperCase(),
        definition,
        answer,
        category: category || undefined,
      })
    }

    if (questions.length === 0) {
      return {
        success: false,
        error: 'No se encontraron preguntas válidas en el CSV',
      }
    }

    // Check for duplicate letters
    const letters = questions.map(q => q.letter)
    const duplicates = letters.filter((letter, index) => letters.indexOf(letter) !== index)
    
    if (duplicates.length > 0) {
      return {
        success: false,
        error: `Letras duplicadas encontradas: ${[...new Set(duplicates)].join(', ')}`,
      }
    }

    // Convert to rosco format
    const roscoData = {
      name: roscoName,
      description: `Rosco importado desde CSV con ${questions.length} preguntas`,
      difficulty,
      questions: questions.map((q, index) => ({
        ...q,
        position: letters.indexOf(q.letter) + 1,
      })),
    }

    return await saveRosco(roscoData)
  } catch (error) {
    console.error('Error processing CSV:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error procesando CSV',
    }
  }
}