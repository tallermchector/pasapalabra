'use client'

import { Card, CardContent } from '@/components/ui/card'

export function GameLegend() {
  const legendItems = [
    { color: 'bg-blue-500', label: 'Letra actual', description: 'La letra que estás respondiendo ahora' },
    { color: 'bg-green-500', label: 'Correcta', description: 'Respuesta acertada' },
    { color: 'bg-red-500', label: 'Incorrecta', description: 'Respuesta fallida' },
    { color: 'bg-yellow-500', label: 'Pasada', description: 'Letra que decidiste saltar' },
    { color: 'bg-gray-200', label: 'Pendiente', description: 'Aún no respondida' },
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 justify-center">
          {legendItems.map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 group"
              role="img"
              aria-label={`${item.label}: ${item.description}`}
            >
              <div 
                className={`w-4 h-4 rounded-full ${item.color} transition-transform group-hover:scale-110`}
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
              <span className="hidden sm:inline text-xs text-gray-500">
                - {item.description}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}