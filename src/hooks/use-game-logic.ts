'use client'

import { useState, useEffect, useCallback } from 'react'
import type { GameState, LetterState, RoscoQuestion } from '@/types'
import { isAnswerCorrect, getLetterFromPosition } from '@/lib/utils'

interface UseGameLogicProps {
  questions: RoscoQuestion[]
  onGameComplete: (score: number, timeElapsed: number) => void
}

export function useGameLogic({ questions, onGameComplete }: UseGameLogicProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentLetter: 'A',
    currentPosition: 1,
    score: 0,
    timeElapsed: 0,
    isPlaying: false,
    isPaused: false,
    answers: {},
    correctAnswers: {},
    skippedLetters: [],
    currentRound: 1,
  })

  const [letterStates, setLetterStates] = useState<LetterState[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')

  // Initialize letter states
  useEffect(() => {
    const states = questions.map((q, index) => ({
      letter: q.question?.letter || getLetterFromPosition(q.position),
      status: index === 0 ? 'current' as const : 'pending' as const,
      answer: q.question?.answer,
    }))
    setLetterStates(states)
  }, [questions])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (gameState.isPlaying && !gameState.isPaused) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        }))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameState.isPlaying, gameState.isPaused])

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
    }))
  }, [])

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }))
  }, [])

  const resetGame = useCallback(() => {
    setGameState({
      currentLetter: 'A',
      currentPosition: 1,
      score: 0,
      timeElapsed: 0,
      isPlaying: false,
      isPaused: false,
      answers: {},
      correctAnswers: {},
      skippedLetters: [],
      currentRound: 1,
    })
    setCurrentAnswer('')
    
    const states = questions.map((q, index) => ({
      letter: q.question?.letter || getLetterFromPosition(q.position),
      status: index === 0 ? 'current' as const : 'pending' as const,
      answer: q.question?.answer,
    }))
    setLetterStates(states)
  }, [questions])

  const moveToNextLetter = useCallback(() => {
    const pendingLetters = letterStates.filter(l => l.status === 'pending')
    
    if (pendingLetters.length === 0) {
      // Game complete
      setGameState(prev => ({ ...prev, isPlaying: false }))
      onGameComplete(gameState.score, gameState.timeElapsed)
      return
    }

    // Find next pending letter
    const nextIndex = letterStates.findIndex(l => l.status === 'pending')
    const nextLetter = letterStates[nextIndex]

    setGameState(prev => ({
      ...prev,
      currentLetter: nextLetter.letter,
      currentPosition: nextIndex + 1,
    }))

    setLetterStates(prev => prev.map((state, index) => ({
      ...state,
      status: index === nextIndex ? 'current' : state.status,
    })))
  }, [letterStates, gameState.score, gameState.timeElapsed, onGameComplete])

  const submitAnswer = useCallback(() => {
    if (!currentAnswer.trim()) return

    const currentQuestion = questions[gameState.currentPosition - 1]
    const correctAnswer = currentQuestion?.question?.answer || ''
    const isCorrect = isAnswerCorrect(currentAnswer, correctAnswer)

    setGameState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [gameState.currentLetter]: currentAnswer,
      },
      correctAnswers: {
        ...prev.correctAnswers,
        [gameState.currentLetter]: isCorrect,
      },
      score: isCorrect ? prev.score + 1 : prev.score,
    }))

    setLetterStates(prev => prev.map(state => 
      state.letter === gameState.currentLetter
        ? { 
            ...state, 
            status: isCorrect ? 'correct' : 'incorrect',
            userAnswer: currentAnswer,
          }
        : state
    ))

    setCurrentAnswer('')
    setTimeout(moveToNextLetter, 500)
  }, [currentAnswer, gameState.currentLetter, gameState.currentPosition, questions, moveToNextLetter])

  const skipLetter = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      skippedLetters: [...prev.skippedLetters, gameState.currentLetter],
    }))

    setLetterStates(prev => prev.map(state => 
      state.letter === gameState.currentLetter
        ? { ...state, status: 'skipped' }
        : state
    ))

    moveToNextLetter()
  }, [gameState.currentLetter, moveToNextLetter])

  const getCurrentQuestion = useCallback(() => {
    return questions[gameState.currentPosition - 1]
  }, [questions, gameState.currentPosition])

  return {
    gameState,
    letterStates,
    currentAnswer,
    setCurrentAnswer,
    startGame,
    pauseGame,
    resetGame,
    submitAnswer,
    skipLetter,
    getCurrentQuestion,
  }
}