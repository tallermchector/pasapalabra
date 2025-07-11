'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/icons'
import { formatTime } from '@/lib/utils'
import type { GameState } from '@/types'

interface GameHeaderProps {
  gameState: GameState
  onPause: () => void
  onReset: () => void
}

export function GameHeader({ gameState, onPause, onReset }: GameHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <Icons.crown className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Rosco</h1>
              <p className="text-xs text-gray-500">Letra {gameState.currentLetter}</p>
            </div>
          </div>

          {/* Información del juego */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Icons.target className="w-4 h-4 text-gray-500" />
              <Badge variant="secondary" className="font-mono">
                {gameState.score}/26
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Icons.clock className="w-4 h-4 text-gray-500" />
              <Badge 
                variant={gameState.timeElapsed > 480 ? "destructive" : "default"}
                className="font-mono"
              >
                {formatTime(gameState.timeElapsed)}
              </Badge>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onPause}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
              disabled={!gameState.isPlaying}
            >
              {gameState.isPaused ? (
                <>
                  <Icons.play className="w-4 h-4 mr-1" />
                  Continuar
                </>
              ) : (
                <>
                  <Icons.pause className="w-4 h-4 mr-1" />
                  Pausar
                </>
              )}
            </Button>
            
            <Button
              onClick={onReset}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Icons.home className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>

        {/* Información móvil */}
        <div className="sm:hidden mt-3 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Icons.target className="w-4 h-4 text-gray-500" />
            <Badge variant="secondary" className="font-mono">
              {gameState.score}/26
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Icons.clock className="w-4 h-4 text-gray-500" />
            <Badge 
              variant={gameState.timeElapsed > 480 ? "destructive" : "default"}
              className="font-mono"
            >
              {formatTime(gameState.timeElapsed)}
            </Badge>
          </div>
          
          <Button
            onClick={onPause}
            variant="outline"
            size="sm"
            disabled={!gameState.isPlaying}
          >
            {gameState.isPaused ? (
              <Icons.play className="w-4 h-4" />
            ) : (
              <Icons.pause className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}