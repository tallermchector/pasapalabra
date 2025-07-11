'use server'

import type { AdminOptions } from '@/types'

export async function getOptions(): Promise<AdminOptions> {
  // In a real app, these could come from a database or configuration
  return {
    categories: [
      'Animales',
      'Deportes',
      'Geografía',
      'Historia',
      'Ciencia',
      'Arte',
      'Música',
      'Literatura',
      'Cine',
      'Tecnología',
      'Comida',
      'Naturaleza',
      'Medicina',
      'Arquitectura',
      'Filosofía',
    ],
    difficulties: ['easy', 'medium', 'hard'],
    languages: ['español', 'english', 'français', 'deutsch'],
  }
}