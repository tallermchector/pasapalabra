'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/icons'
import { formatTime, calculateScore } from '@/lib/utils'
import type { GameState, LetterState } from '@/types'

interface ResultsScreenProps {
  gameState: GameState
  letterStates: LetterState[]
  playerName: string
  onPlayAgain: () => void
  onBackToMenu: () => void
}

export function ResultsScreen({
  gameState,
  letterStates,
  playerName,
  onPlayAgain,
  onBackToMenu,
}: ResultsScreenProps) {
  const correctAnswers = letterStates.filter(l => l.status === 'correct').length
  const incorrectAnswers = letterStates.filter(l => l.status === 'incorrect').length
  const skippedAnswers = letterStates.filter(l => l.status === 'skipped').length
  const finalScore = calculateScore(correctAnswers, 26, gameState.timeElapsed)
  
  const getPerformanceMessage = () => {
    const percentage = (correctAnswers / 26) * 100
    
    if (percentage === 100) return "¡PERFECTO! ¡Rosco completado!"
    if (percentage >= 80) return "¡Excelente puntuación!"
    if (percentage >= 60) return "¡Muy bien!"
    if (percentage >= 40) return "¡Buen intento!"
    return "¡Sigue practicando!"
  }

  const getPerformanceIcon = () => {
    const percentage = (correctAnswers / 26) * 100
    
    if (percentage === 100) return Icons.crown
    if (percentage >= 80) return Icons.trophy
    if (percentage >= 60) return Icons.medal
    if (percentage >= 40) return Icons.award
    return Icons.star
  }

  const PerformanceIcon = getPerformanceIcon()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <PerformanceIcon className="w-16 h-16 text-yellow-500" />
          </div>
          <CardTitle className="text-3xl font-bold">¡Juego Terminado!</CardTitle>
          <p className="text-xl text-muted-foreground">
            {getPerformanceMessage()}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Player Info */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">{playerName}</h3>
            <div className="text-4xl font-bold text-primary mb-2">
              {correctAnswers}/26
            </div>
            <p className="text-muted-foreground">respuestas correctas</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-green-700">Correctas</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
              <div className="text-sm text-red-700">Incorrectas</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{skippedAnswers}</div>
              <div className="text-sm text-yellow-700">Pasadas</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{formatTime(gameState.timeElapsed)}</div>
              <div className="text-sm text-blue-700">Tiempo</div>
            </div>
          </div>

          {/* Final Score */}
          <div className="text-center p-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg">
            <div className="text-sm opacity-90 mb-1">Puntuación Final</div>
            <div className="text-4xl font-bold">{finalScore}</div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-2">
            <h4 className="font-semibold mb-3">Resultados detallados:</h4>
            <div className="grid grid-cols-6 md:grid-cols-13 gap-1">
              {letterStates.map((letter) => (
                <div
                  key={letter.letter}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${letter.status === 'correct' ? 'bg-green-500 text-white' : ''}
                    ${letter.status === 'incorrect' ? 'bg-red-500 text-white' : ''}
                    ${letter.status === 'skipped' ? 'bg-yellow-500 text-white' : ''}
                    ${letter.status === 'pending' ? 'bg-gray-200 text-gray-700' : ''}
                  `}
                  title={`${letter.letter}: ${letter.status}`}
                >
                  {letter.letter}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={onPlayAgain} className="flex-1">
              <Icons.reset className="w-4 h-4 mr-2" />
              Jugar de Nuevo
            </Button>
            <Button onClick={onBackToMenu} variant="outline" className="flex-1">
              <Icons.home className="w-4 h-4 mr-2" />
              Menú Principal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}