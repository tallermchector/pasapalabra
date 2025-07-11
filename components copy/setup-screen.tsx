'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Icons } from '@/components/icons'
import type { Rosco } from '@/types'

interface SetupScreenProps {
  roscos: Rosco[]
  onStartGame: (playerName: string, roscoId: string) => void
}

export function SetupScreen({ roscos, onStartGame }: SetupScreenProps) {
  const [playerName, setPlayerName] = useState('')
  const [selectedRosco, setSelectedRosco] = useState('')

  const handleStart = () => {
    if (playerName.trim() && selectedRosco) {
      onStartGame(playerName.trim(), selectedRosco)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Icons.crown className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Rosco</CardTitle>
          <p className="text-muted-foreground">
            El juego de palabras más emocionante
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="playerName">Nombre del jugador</Label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Introduce tu nombre"
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rosco">Selecciona un Rosco</Label>
            <Select value={selectedRosco} onValueChange={setSelectedRosco}>
              <SelectTrigger>
                <SelectValue placeholder="Elige un rosco para jugar" />
              </SelectTrigger>
              <SelectContent>
                {roscos.map((rosco) => (
                  <SelectItem key={rosco.id} value={rosco.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{rosco.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {rosco.difficulty}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRosco && (
            <div className="p-4 bg-muted rounded-lg">
              {(() => {
                const rosco = roscos.find(r => r.id === selectedRosco)
                return rosco ? (
                  <div>
                    <h4 className="font-semibold mb-2">{rosco.name}</h4>
                    {rosco.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {rosco.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <Icons.star className="w-4 h-4" />
                      <span className="text-sm">Dificultad: {rosco.difficulty}</span>
                    </div>
                  </div>
                ) : null
              })()}
            </div>
          )}

          <Button 
            onClick={handleStart}
            className="w-full text-lg py-6"
            disabled={!playerName.trim() || !selectedRosco}
          >
            <Icons.play className="w-5 h-5 mr-2" />
            Comenzar Juego
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>¡Responde todas las letras del alfabeto!</p>
            <p>Tiempo límite: 10 minutos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}