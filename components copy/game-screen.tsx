'use client'

import { RoscoRing } from './rosco-ring'
import { GamePanel } from './game-panel'
import type { GameState, LetterState, RoscoQuestion } from '@/types'

interface GameScreenProps {
  gameState: GameState
  letterStates: LetterState[]
  currentAnswer: string
  onAnswerChange: (value: string) => void
  onSubmit: () => void
  onSkip: () => void
  onPause: () => void
  onReset: () => void
  currentQuestion?: RoscoQuestion
}

export function GameScreen({
  gameState,
  letterStates,
  currentAnswer,
  onAnswerChange,
  onSubmit,
  onSkip,
  onPause,
  onReset,
  currentQuestion,
}: GameScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Controls */}
          <div className="lg:col-span-1">
            <GamePanel
              gameState={gameState}
              currentAnswer={currentAnswer}
              onAnswerChange={onAnswerChange}
              onSubmit={onSubmit}
              onSkip={onSkip}
              onPause={onPause}
              onReset={onReset}
              currentQuestion={currentQuestion}
            />
          </div>

          {/* Rosco Ring */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <RoscoRing letters={letterStates} />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex flex-wrap gap-4 justify-center text-sm text-white">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span>Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>Correcta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>Incorrecta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span>Pasada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-200"></div>
              <span>Pendiente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}