'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Rosco } from '@/types'

interface SaveRoscoData {
  name: string
  description?: string
  difficulty: 'easy' | 'medium' | 'hard'
  questions: Array<{
    letter: string
    definition: string
    answer: string
    category?: string
    position: number
  }>
}

export async function saveRosco(data: SaveRoscoData): Promise<{
  success: boolean
  data?: Rosco
  error?: string
}> {
  try {
    const rosco = await prisma.rosco.create({
      data: {
        name: data.name,
        description: data.description,
        difficulty: data.difficulty,
        questions: {
          create: data.questions.map((q) => ({
            position: q.position,
            question: {
              create: {
                letter: q.letter.toUpperCase(),
                definition: q.definition,
                answer: q.answer.toLowerCase(),
                category: q.category,
                difficulty: data.difficulty,
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

    revalidatePath('/admin/generator')
    revalidatePath('/')

    return {
      success: true,
      data: rosco as Rosco,
    }
  } catch (error) {
    console.error('Error saving rosco:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}