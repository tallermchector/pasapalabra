'use client'

import { RoscoRing } from './rosco-ring'
import { GamePanel } from './game-panel'
import { GameHeader } from './game-header'
import { GameLegend } from './game-legend'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header fijo con información del juego */}
      <GameHeader 
        gameState={gameState}
        onPause={onPause}
        onReset={onReset}
      />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
            {/* Panel de control - Sidebar en desktop, top en mobile */}
            <aside className="xl:col-span-4 order-2 xl:order-1">
              <div className="sticky top-24">
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
            </aside>

            {/* Área principal del rosco */}
            <section className="xl:col-span-8 order-1 xl:order-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
                <div className="space-y-6">
                  {/* Indicador de progreso visual */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span>Progreso:</span>
                      <span className="font-semibold">
                        {letterStates.filter(l => l.status === 'correct').length}/26
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(letterStates.filter(l => l.status === 'correct').length / 26) * 100}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Rosco principal */}
                  <div className="flex justify-center">
                    <RoscoRing letters={letterStates} />
                  </div>

                  {/* Estado del juego */}
                  {gameState.isPaused && (
                    <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Icons.pause className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        Juego Pausado
                      </h3>
                      <p className="text-yellow-700">
                        Presiona "Continuar" para reanudar la partida
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Leyenda mejorada */}
          <div className="mt-8">
            <GameLegend />
          </div>
        </div>
      </main>
    </div>
  )
}