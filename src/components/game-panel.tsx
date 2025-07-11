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
    if (e.key === 'Enter' && gameState.isPlaying) {
      onSubmit()
    }
  }

  return (
    <div className="space-y-6">
      {/* Game Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.settings className="w-5 h-5" />
            Control del Juego
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Button onClick={onReset} variant="outline">
              <Icons.reset className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tiempo:</span>
              <Badge variant={gameState.timeElapsed > 300 ? "destructive" : "default"}>
                {formatTime(gameState.timeElapsed)}
              </Badge>
            </div>
            <Progress value={Math.min((gameState.timeElapsed / 600) * 100, 100)} className="h-2" />
          </div>

          <div className="flex justify-between">
            <span>Puntuación:</span>
            <Badge variant="secondary">{gameState.score}/26</Badge>
          </div>

          <div className="flex justify-between">
            <span>Ronda:</span>
            <Badge>{gameState.currentRound}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      {currentQuestion && gameState.isPlaying && !gameState.isPaused && (
        <Card>
          <CardHeader>
            <CardTitle>Letra {gameState.currentLetter}</CardTitle>
            {currentQuestion.question?.category && (
              <Badge variant="outline">{currentQuestion.question.category}</Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              {currentQuestion.question?.definition}
            </p>

            <div className="space-y-2">
              <Input
                value={currentAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu respuesta..."
                className="text-lg"
                autoFocus
                disabled={gameState.isPaused}
              />

              <div className="flex gap-2">
                <Button 
                  onClick={onSubmit} 
                  className="flex-1"
                  disabled={!currentAnswer.trim() || gameState.isPaused}
                >
                  <Icons.target className="w-4 h-4 mr-2" />
                  Responder
                </Button>
                <Button 
                  onClick={onSkip} 
                  variant="outline"
                  disabled={gameState.isPaused}
                >
                  Pasar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Status */}
      {gameState.isPaused && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Icons.pause className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Juego Pausado</h3>
              <p className="text-muted-foreground">
                Presiona "Continuar" para reanudar el juego
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}