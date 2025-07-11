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

  const getStatusColor = (status: LetterState['status']) => {
    switch (status) {
      case 'current':
        return 'bg-blue-500 text-white border-blue-600 scale-110'
      case 'correct':
        return 'bg-green-500 text-white border-green-600'
      case 'incorrect':
        return 'bg-red-500 text-white border-red-600'
      case 'skipped':
        return 'bg-yellow-500 text-white border-yellow-600'
      default:
        return 'bg-gray-200 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className={cn("relative w-full aspect-square max-w-md mx-auto", className)}>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold text-primary mb-2">
            {letters.find(l => l.status === 'current')?.letter || 'R'}
          </div>
          <div className="text-sm text-muted-foreground">
            ROSCO
          </div>
        </div>
      </div>

      {/* Letter circle */}
      <div className="relative w-full h-full">
        {letters.map((letter, index) => {
          const { x, y } = getLetterPosition(index)
          return (
            <div
              key={letter.letter}
              className={cn(
                "absolute w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                getStatusColor(letter.status)
              )}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
            >
              {letter.letter}
            </div>
          )
        })}
      </div>
    </div>
  )
}