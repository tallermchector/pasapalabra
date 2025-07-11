import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function calculateScore(correctAnswers: number, totalQuestions: number, timeElapsed: number): number {
  const baseScore = (correctAnswers / totalQuestions) * 1000
  const timeBonus = Math.max(0, 300 - timeElapsed) // Bonus for completing faster
  return Math.round(baseScore + timeBonus)
}

export function getLetterFromPosition(position: number): string {
  return String.fromCharCode(65 + position - 1) // A=1, B=2, etc.
}

export function getPositionFromLetter(letter: string): number {
  return letter.charCodeAt(0) - 64 // A=1, B=2, etc.
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function normalizeAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]/g, '') // Remove special characters
}

export function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer)
}