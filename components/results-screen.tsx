'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  const accuracy = Math.round((correctAnswers / 26) * 100)
  
  const getPerformanceData = () => {
    const percentage = (correctAnswers / 26) * 100
    
    if (percentage === 100) {
      return {
        message: "¡PERFECTO! ¡Rosco completado!",
        icon: Icons.crown,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200"
      }
    }
    if (percentage >= 80) {
      return {
        message: "¡Excelente puntuación!",
        icon: Icons.trophy,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      }
    }
    if (percentage >= 60) {
      return {
        message: "¡Muy bien!",
        icon: Icons.medal,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      }
    }
    if (percentage >= 40) {
      return {
        message: "¡Buen intento!",
        icon: Icons.award,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200"
      }
    }
    return {
      message: "¡Sigue practicando!",
      icon: Icons.star,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    }
  }

  const performance = getPerformanceData()
  const PerformanceIcon = performance.icon

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header de resultados */}
        <Card className={`${performance.bgColor} ${performance.borderColor} border-2 slide-in`}>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <PerformanceIcon className={`w-20 h-20 ${performance.color}`} />
                {correctAnswers === 26 && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                    <Icons.star className="w-5 h-5 text-yellow-800" />
                  </div>
                )}
              </div>
            </div>
            <CardTitle className="heading-primary text-gray-900 mb-2">
              ¡Partida Completada!
            </CardTitle>
            <p className={`text-xl font-semibold ${performance.color}`}>
              {performance.message}
            </p>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-700">
                Hola, {playerName}
              </h3>
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {correctAnswers}/26
              </div>
              <p className="text-lg text-gray-600">respuestas correctas</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">{accuracy}% de precisión</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estadísticas detalladas */}
          <Card className="bg-white/90 backdrop-blur-sm border-gray-200 fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.trophy className="w-5 h-5 text-blue-600" />
                Estadísticas de la Partida
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
                  <div className="text-sm font-medium text-green-700">Correctas</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-3xl font-bold text-red-600">{incorrectAnswers}</div>
                  <div className="text-sm font-medium text-red-700">Incorrectas</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-600">{skippedAnswers}</div>
                  <div className="text-sm font-medium text-yellow-700">Pasadas</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{formatTime(gameState.timeElapsed)}</div>
                  <div className="text-sm font-medium text-blue-700">Tiempo Total</div>
                </div>
              </div>

              {/* Puntuación final */}
              <div className="text-center p-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg">
                <div className="text-sm opacity-90 mb-1">Puntuación Final</div>
                <div className="text-4xl font-bold">{finalScore}</div>
                <div className="text-xs opacity-75 mt-1">
                  Basada en precisión y velocidad
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados por letra */}
          <Card className="bg-white/90 backdrop-blur-sm border-gray-200 fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.target className="w-5 h-5 text-blue-600" />
                Resultados por Letra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-13 gap-1">
                  {letterStates.slice(0, 13).map((letter) => (
                    <div
                      key={letter.letter}
                      className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        transition-all duration-200 hover:scale-110
                        ${letter.status === 'correct' ? 'bg-green-500 text-white' : ''}
                        ${letter.status === 'incorrect' ? 'bg-red-500 text-white' : ''}
                        ${letter.status === 'skipped' ? 'bg-yellow-500 text-white' : ''}
                        ${letter.status === 'pending' ? 'bg-gray-200 text-gray-700' : ''}
                      `}
                      title={`${letter.letter}: ${
                        letter.status === 'correct' ? 'Correcta' :
                        letter.status === 'incorrect' ? 'Incorrecta' :
                        letter.status === 'skipped' ? 'Pasada' : 'No respondida'
                      }`}
                    >
                      {letter.letter}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-13 gap-1">
                  {letterStates.slice(13, 26).map((letter) => (
                    <div
                      key={letter.letter}
                      className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        transition-all duration-200 hover:scale-110
                        ${letter.status === 'correct' ? 'bg-green-500 text-white' : ''}
                        ${letter.status === 'incorrect' ? 'bg-red-500 text-white' : ''}
                        ${letter.status === 'skipped' ? 'bg-yellow-500 text-white' : ''}
                        ${letter.status === 'pending' ? 'bg-gray-200 text-gray-700' : ''}
                      `}
                      title={`${letter.letter}: ${
                        letter.status === 'correct' ? 'Correcta' :
                        letter.status === 'incorrect' ? 'Incorrecta' :
                        letter.status === 'skipped' ? 'Pasada' : 'No respondida'
                      }`}
                    >
                      {letter.letter}
                    </div>
                  ))}
                </div>

                {/* Respuestas incorrectas detalladas */}
                {incorrectAnswers > 0 && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="text-sm font-semibold text-red-800 mb-2">
                      Respuestas incorrectas:
                    </h4>
                    <div className="space-y-1">
                      {letterStates
                        .filter(l => l.status === 'incorrect')
                        .map(letter => (
                          <div key={letter.letter} className="text-xs text-red-700">
                            <strong>{letter.letter}:</strong> {letter.userAnswer} 
                            <span className="text-red-600"> → {letter.answer}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botones de acción */}
        <Card className="bg-white/90 backdrop-blur-sm border-gray-200 fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onPlayAgain} 
                className="flex-1 h-12 text-lg bg-blue-600 hover:bg-blue-700 interactive-element"
              >
                <Icons.reset className="w-5 h-5 mr-2" />
                Jugar de Nuevo
              </Button>
              <Button 
                onClick={onBackToMenu} 
                variant="outline" 
                className="flex-1 h-12 text-lg border-gray-300 hover:bg-gray-50 interactive-element"
              >
                <Icons.home className="w-5 h-5 mr-2" />
                Menú Principal
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                ¡Comparte tu puntuación de {finalScore} puntos con tus amigos!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}