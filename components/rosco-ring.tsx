'use client'

import { cn } from '@/lib/utils'
import type { LetterState } from '@/types'

interface RoscoRingProps {
  letters: LetterState[]
  className?: string
}

export function RoscoRing({ letters, className }: RoscoRingProps) {
  const getLetterPosition = (index: number) => {
    const angle = (index * 360) / 26 - 90 // Start from top
    const radius = 140
    const x = Math.cos((angle * Math.PI) / 180) * radius
    const y = Math.sin((angle * Math.PI) / 180) * radius
    return { x, y }
  }

  const getStatusClasses = (status: LetterState['status']) => {
    const baseClasses = 'rosco-letter transition-all duration-300 ease-in-out'
    
    switch (status) {
      case 'current':
        return `${baseClasses} rosco-letter-current letter-current`
      case 'correct':
        return `${baseClasses} rosco-letter-correct`
      case 'incorrect':
        return `${baseClasses} rosco-letter-incorrect`
      case 'skipped':
        return `${baseClasses} rosco-letter-skipped`
      default:
        return `${baseClasses} rosco-letter-pending`
    }
  }

  const currentLetter = letters.find(l => l.status === 'current')
  const correctCount = letters.filter(l => l.status === 'correct').length

  return (
    <div className={cn("relative w-full aspect-square max-w-lg mx-auto", className)}>
      {/* Centro del rosco con información mejorada */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-6xl md:text-7xl font-bold text-blue-600 mb-2">
            {currentLetter?.letter || 'R'}
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-gray-700">
              ROSCO
            </div>
            <div className="text-sm text-gray-500">
              {correctCount}/26 correctas
            </div>
          </div>
        </div>
      </div>

      {/* Círculo de progreso de fondo */}
      <div className="absolute inset-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgb(229 231 235)"
            strokeWidth="2"
            className="opacity-30"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgb(37 99 235)"
            strokeWidth="2"
            strokeDasharray={`${(correctCount / 26) * 283} 283`}
            className="transition-all duration-500 ease-out"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Letras del rosco */}
      <div className="relative w-full h-full" role="img" aria-label="Rosco de letras">
        {letters.map((letter, index) => {
          const { x, y } = getLetterPosition(index)
          return (
            <button
              key={letter.letter}
              className={getStatusClasses(letter.status)}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              aria-label={`Letra ${letter.letter}: ${
                letter.status === 'current' ? 'actual' :
                letter.status === 'correct' ? 'correcta' :
                letter.status === 'incorrect' ? 'incorrecta' :
                letter.status === 'skipped' ? 'pasada' : 'pendiente'
              }`}
              tabIndex={letter.status === 'current' ? 0 : -1}
              disabled
            >
              {letter.letter}
            </button>
          )
        })}
      </div>

      {/* Indicadores de accesibilidad */}
      <div className="sr-only">
        Rosco con 26 letras. Letra actual: {currentLetter?.letter}. 
        Progreso: {correctCount} de 26 letras completadas correctamente.
      </div>
    </div>
  )
}