import { generateRosco } from './generate-rosco'
import { prisma } from '@/lib/prisma'
import type { GenerateRoscoOptions } from '@/types'

export async function generateAndSaveRosco(options: GenerateRoscoOptions) {
  try {
    // Generate the rosco using AI
    const result = await generateRosco(options)
    
    if (!result.success) {
      return result
    }

    const { name, description, questions } = result.data

    // Save to database
    const savedRosco = await prisma.rosco.create({
      data: {
        name,
        description,
        difficulty: options.difficulty || 'medium',
        questions: {
          create: questions.map((q, index) => ({
            position: index + 1,
            question: {
              create: {
                letter: q.letter,
                definition: q.definition,
                answer: q.answer,
                category: q.category,
                difficulty: options.difficulty || 'medium',
              }
            }
          }))
        }
      },
      include: {
        questions: {
          include: {
            question: true
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    })

    return {
      success: true,
      data: savedRosco,
    }
  } catch (error) {
    console.error('Error generating and saving rosco:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

export async function generateMultipleRoscos(
  roscoConfigs: GenerateRoscoOptions[]
) {
  const results = []
  
  for (const config of roscoConfigs) {
    const result = await generateAndSaveRosco(config)
    results.push(result)
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  return results
}