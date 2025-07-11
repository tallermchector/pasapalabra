'use client'

import { useState } from 'react'
import { SetupScreen } from './setup-screen'
import { GameScreen } from './game-screen'
import { ResultsScreen } from './results-screen'
import { useGameLogic } from '@/hooks/use-game-logic'
import { useSound } from '@/hooks/use-sound'
import type { Rosco } from '@/types'

interface GameProps {
  roscos: Rosco[]
}

type GamePhase = 'setup' | 'playing' | 'results'

export function Game({ roscos }: GameProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup')
  const [selectedRosco, setSelectedRosco] = useState<Rosco | null>(null)
  const [playerName, setPlayerName] = useState('')

  const { playSound } = useSound(true)

  const handleGameComplete = (score: number, timeElapsed: number) => {
    playSound('gameEnd')
    setGamePhase('results')
  }

  const {
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
  } = useGameLogic({
    questions: selectedRosco?.questions || [],
    onGameComplete: handleGameComplete,
  })

  const handleStartGame = (name: string, roscoId: string) => {
    const rosco = roscos.find(r => r.id === roscoId)
    if (!rosco) return

    setPlayerName(name)
    setSelectedRosco(rosco)
    setGamePhase('playing')
    playSound('gameStart')
    startGame()
  }

  const handleSubmitAnswer = () => {
    const isCorrect = getCurrentQuestion()?.question?.answer?.toLowerCase() === currentAnswer.toLowerCase()
    playSound(isCorrect ? 'correct' : 'incorrect')
    submitAnswer()
  }

  const handleSkipLetter = () => {
    playSound('skip')
    skipLetter()
  }

  const handlePlayAgain = () => {
    resetGame()
    setGamePhase('playing')
    playSound('gameStart')
    startGame()
  }

  const handleBackToMenu = () => {
    resetGame()
    setSelectedRosco(null)
    setPlayerName('')
    setGamePhase('setup')
  }

  if (gamePhase === 'setup') {
    return <SetupScreen roscos={roscos} onStartGame={handleStartGame} />
  }

  if (gamePhase === 'results') {
    return (
      <ResultsScreen
        gameState={gameState}
        letterStates={letterStates}
        playerName={playerName}
        onPlayAgain={handlePlayAgain}
        onBackToMenu={handleBackToMenu}
      />
    )
  }

  return (
    <GameScreen
      gameState={gameState}
      letterStates={letterStates}
      currentAnswer={currentAnswer}
      onAnswerChange={setCurrentAnswer}
      onSubmit={handleSubmitAnswer}
      onSkip={handleSkipLetter}
      onPause={pauseGame}
      onReset={handleBackToMenu}
      currentQuestion={getCurrentQuestion()}
    />
  )
}