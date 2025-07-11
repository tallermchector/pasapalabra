"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { getPlayerName, setPlayerName } from "@/lib/storage"

interface PlayerNameDialogProps {
  onSave: (name: string) => void
  onSkip: () => void
}

export function PlayerNameDialog({ onSave, onSkip }: PlayerNameDialogProps) {
  const [name, setName] = useState("")
  const [currentName, setCurrentName] = useState("")

  useEffect(() => {
    const savedName = getPlayerName()
    setCurrentName(savedName)
    setName(savedName)
  }, [])

  const handleSave = () => {
    const trimmedName = name.trim()
    if (trimmedName) {
      setPlayerName(trimmedName)
      onSave(trimmedName)
    } else {
      onSkip()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {currentName ? "Cambiar Nombre" : "¿Cómo te llamas?"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              {currentName
                ? "Puedes cambiar tu nombre para el ranking"
                : "Tu nombre aparecerá en el ranking de mejores puntuaciones"}
            </p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu nombre..."
              maxLength={20}
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              {currentName ? "Cambiar" : "Guardar"}
            </Button>
            <Button onClick={onSkip} variant="outline">
              {currentName ? "Cancelar" : "Saltar"}
            </Button>
          </div>

          {currentName && <p className="text-xs text-gray-500 text-center">Nombre actual: {currentName}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
