'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/icons'
import { formatTime } from '@/lib/utils'
import type { GameState, RoscoQuestion } from '@/types'

interface GamePanelProps {
  gameState: GameState
  currentAnswer: string
  onAnswerChange: (value: string) => void
  onSubmit: () => void
  onSkip: () => void
  onPause: () => void
  onReset: () => void
  currentQuestion?: RoscoQuestion
}

export function GamePanel({
  gameState,
  currentAnswer,
  onAnswerChange,
  onSubmit,
  onSkip,
  onPause,
  onReset,
  currentQuestion,
}: GamePanelProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && gameState.isPlaying && !gameState.isPaused) {
      onSubmit()
    }
  }

  const timePercentage = Math.min((gameState.timeElapsed / 600) * 100, 100)
  const isTimeWarning = gameState.timeElapsed > 480 // 8 minutos
  const isTimeCritical = gameState.timeElapsed > 540 // 9 minutos

  return (
    <div className="space-y-4">
      {/* Estadísticas del juego */}
      <Card className="bg-white/90 backdrop-blur-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icons.trophy className="w-5 h-5 text-blue-600" />
            Estadísticas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progreso de tiempo */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Tiempo</span>
              <Badge 
                variant={isTimeCritical ? "destructive" : isTimeWarning ? "default" : "secondary"}
                className="font-mono"
              >
                {formatTime(gameState.timeElapsed)} / 10:00
              </Badge>
            </div>
            <Progress 
              value={timePercentage} 
              className={`h-2 ${isTimeCritical ? 'bg-red-100' : isTimeWarning ? 'bg-yellow-100' : 'bg-gray-100'}`}
            />
            {isTimeWarning && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <Icons.clock className="w-3 h-3" />
                {isTimeCritical ? '¡Tiempo casi agotado!' : 'Queda poco tiempo'}
              </p>
            )}
          </div>

          {/* Puntuación */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Puntuación</span>
            <Badge variant="secondary" className="text-lg font-bold">
              {gameState.score}/26
            </Badge>
          </div>

          {/* Ronda actual */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Ronda</span>
            <Badge variant="outline">{gameState.currentRound}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Pregunta actual */}
      {currentQuestion && gameState.isPlaying && !gameState.isPaused && (
        <Card className="bg-white/90 backdrop-blur-sm border-gray-200 slide-in">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-blue-600">
                Letra {gameState.currentLetter}
              </CardTitle>
              {currentQuestion.question?.category && (
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.question.category}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Definición */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Definición:
              </label>
              <p className="text-base leading-relaxed text-gray-900 bg-gray-50 p-3 rounded-lg border">
                {currentQuestion.question?.definition}
              </p>
            </div>

            {/* Campo de respuesta */}
            <div className="space-y-3">
              <label 
                htmlFor="answer-input"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Icons.target className="w-4 h-4" />
                Tu respuesta:
              </label>
              <Input
                id="answer-input"
                value={currentAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Palabra que empiece por ${gameState.currentLetter}...`}
                className="text-lg h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                autoFocus
                disabled={gameState.isPaused}
                autoComplete="off"
                spellCheck="false"
                aria-describedby="answer-help"
              />
              <p id="answer-help" className="text-xs text-gray-500">
                Presiona Enter para enviar tu respuesta
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2">
              <Button 
                onClick={onSubmit} 
                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700"
                disabled={!currentAnswer.trim() || gameState.isPaused}
              >
                <Icons.target className="w-4 h-4 mr-2" />
                Responder
              </Button>
              <Button 
                onClick={onSkip} 
                variant="outline"
                className="h-11 px-4 border-gray-300 hover:bg-gray-50"
                disabled={gameState.isPaused}
                title="Saltar esta pregunta"
              >
                <Icons.chevronRight className="w-4 h-4" />
                <span className="sr-only">Pasar pregunta</span>
              </Button>
            </div>

            {/* Ayuda contextual */}
            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="flex items-center gap-1 mb-1">
                <Icons.zap className="w-3 h-3" />
                <strong>Consejo:</strong>
              </p>
              <p>
                La respuesta debe comenzar por la letra <strong>{gameState.currentLetter}</strong>. 
                Puedes usar el botón "Pasar" si no conoces la respuesta.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controles del juego (solo en móvil) */}
      <Card className="bg-white/90 backdrop-blur-sm border-gray-200 xl:hidden">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button 
              onClick={onPause} 
              variant="outline" 
              className="flex-1"
              disabled={!gameState.isPlaying}
            >
              {gameState.isPaused ? (
                <>
                  <Icons.play className="w-4 h-4 mr-2" />
                  Continuar
                </>
              ) : (
                <>
                  <Icons.pause className="w-4 h-4 mr-2" />
                  Pausar
                </>
              )}
            </Button>
            <Button 
              onClick={onReset} 
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Icons.home className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estado de pausa */}
      {gameState.isPaused && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <Icons.pause className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800 mb-1">Juego Pausado</h3>
            <p className="text-sm text-yellow-700">
              El tiempo se ha detenido. Presiona "Continuar" cuando estés listo.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}