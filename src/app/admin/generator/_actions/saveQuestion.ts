'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Question } from '@/types'

interface SaveQuestionData {
  letter: string
  definition: string
  answer: string
  category?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export async function saveQuestion(data: SaveQuestionData): Promise<{
  success: boolean
  data?: Question
  error?: string
}> {
  try {
    const question = await prisma.question.create({
      data: {
        letter: data.letter.toUpperCase(),
        definition: data.definition,
        answer: data.answer.toLowerCase(),
        category: data.category,
        difficulty: data.difficulty,
      },
    })

    revalidatePath('/admin/generator')

    return {
      success: true,
      data: question as Question,
    }
  } catch (error) {
    console.error('Error saving question:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}