'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && playerName.trim() && selectedRosco) {
      handleStart()
    }
  }

  const selectedRoscoData = roscos.find(r => r.id === selectedRosco)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header mejorado */}
        <div className="text-center space-y-4 slide-in">
          <div className="flex justify-center">
            <div className="relative">
              <Icons.crown className="w-20 h-20 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Icons.star className="w-4 h-4 text-yellow-800" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="heading-primary text-gray-900">Rosco</h1>
            <p className="body-large text-gray-600 max-w-sm mx-auto">
              Demuestra tu conocimiento respondiendo todas las letras del alfabeto
            </p>
          </div>
        </div>

        {/* Formulario principal */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm slide-in">
          <CardHeader className="text-center pb-4">
            <CardTitle className="heading-secondary text-gray-900">
              Configurar Partida
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Campo de nombre con mejor UX */}
            <div className="space-y-3">
              <Label 
                htmlFor="playerName" 
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Icons.user className="w-4 h-4" />
                Nombre del jugador
              </Label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Introduce tu nombre"
                className="text-lg h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                maxLength={20}
                autoComplete="name"
                autoFocus
                aria-describedby="name-help"
              />
              <p id="name-help" className="text-xs text-gray-500">
                Tu nombre aparecerá en los resultados
              </p>
            </div>

            {/* Selector de rosco mejorado */}
            <div className="space-y-3">
              <Label 
                htmlFor="rosco" 
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Icons.target className="w-4 h-4" />
                Selecciona un Rosco
              </Label>
              <Select value={selectedRosco} onValueChange={setSelectedRosco}>
                <SelectTrigger 
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  aria-describedby="rosco-help"
                >
                  <SelectValue placeholder="Elige un rosco para jugar" />
                </SelectTrigger>
                <SelectContent>
                  {roscos.map((rosco) => (
                    <SelectItem key={rosco.id} value={rosco.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{rosco.name}</span>
                        <Badge 
                          variant={
                            rosco.difficulty === 'easy' ? 'secondary' :
                            rosco.difficulty === 'medium' ? 'default' : 'destructive'
                          }
                          className="ml-2 text-xs"
                        >
                          {rosco.difficulty === 'easy' ? 'Fácil' :
                           rosco.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p id="rosco-help" className="text-xs text-gray-500">
                Cada rosco tiene 26 preguntas, una por cada letra del alfabeto
              </p>
            </div>

            {/* Vista previa del rosco seleccionado */}
            {selectedRoscoData && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 fade-in">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-gray-900">{selectedRoscoData.name}</h4>
                    <Badge 
                      variant={
                        selectedRoscoData.difficulty === 'easy' ? 'secondary' :
                        selectedRoscoData.difficulty === 'medium' ? 'default' : 'destructive'
                      }
                    >
                      {selectedRoscoData.difficulty === 'easy' ? 'Fácil' :
                       selectedRoscoData.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                    </Badge>
                  </div>
                  
                  {selectedRoscoData.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedRoscoData.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Icons.target className="w-4 h-4" />
                      <span>26 preguntas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icons.clock className="w-4 h-4" />
                      <span>10 min máximo</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de inicio mejorado */}
            <Button 
              onClick={handleStart}
              className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 interactive-element"
              disabled={!playerName.trim() || !selectedRosco}
              aria-describedby="start-help"
            >
              <Icons.play className="w-5 h-5 mr-2" />
              Comenzar Partida
            </Button>
            
            {(!playerName.trim() || !selectedRosco) && (
              <p id="start-help" className="text-xs text-gray-500 text-center">
                Completa todos los campos para comenzar
              </p>
            )}
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="text-center space-y-3 fade-in">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                <Icons.trophy className="w-4 h-4" />
                <span className="font-medium">Objetivo</span>
              </div>
              <p className="text-gray-600">Responder todas las letras correctamente</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                <Icons.clock className="w-4 h-4" />
                <span className="font-medium">Tiempo</span>
              </div>
              <p className="text-gray-600">Máximo 10 minutos por partida</p>
            </div>
          </div>
          
          <p className="text-xs text-gray-500">
            Puedes pausar el juego en cualquier momento
          </p>
        </div>
      </div>
    </div>
  )
}