export interface Question {
  id: string
  letter: string
  definition: string
  answer: string
  category?: string
  difficulty: 'easy' | 'medium' | 'hard'
  createdAt: Date
  updatedAt: Date
}

export interface Rosco {
  id: string
  name: string
  description?: string
  difficulty: 'easy' | 'medium' | 'hard'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  questions?: RoscoQuestion[]
}

export interface RoscoQuestion {
  id: string
  roscoId: string
  questionId: string
  position: number
  question?: Question
}

export interface GameResult {
  id: string
  playerName: string
  roscoId: string
  score: number
  timeElapsed: number
  completedAt: Date
  rosco?: Rosco
}

export interface GameState {
  currentLetter: string
  currentPosition: number
  score: number
  timeElapsed: number
  isPlaying: boolean
  isPaused: boolean
  answers: Record<string, string>
  correctAnswers: Record<string, boolean>
  skippedLetters: string[]
  currentRound: number
}

export interface LetterState {
  letter: string
  status: 'pending' | 'current' | 'correct' | 'incorrect' | 'skipped'
  answer?: string
  userAnswer?: string
}

export interface GenerateQuestionOptions {
  letter: string
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  language?: string
}

export interface GenerateRoscoOptions {
  name: string
  difficulty?: 'easy' | 'medium' | 'hard'
  categories?: string[]
  language?: string
}

export interface AdminOptions {
  categories: string[]
  difficulties: string[]
  languages: string[]
}