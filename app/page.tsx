"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react"
import { Leaderboard } from "@/components/leaderboard"
import { PlayerNameDialog } from "@/components/player-name-dialog"
import { getHighScores, addHighScore, updatePlayerStats, getPlayerName } from "@/lib/storage"
import { BarChart3, User } from "lucide-react"

interface Question {
  letter: string
  question: string
  answer: string
  category: string
}

interface LetterState {
  letter: string
  status: "pending" | "correct" | "incorrect" | "passed" | "current"
  question?: Question
}

const QUESTIONS: Question[] = [
  { letter: "A", question: "Animal que vive en el agua y respira por branquias", answer: "atun", category: "Animales" },
  { letter: "B", question: "Deporte que se juega con una pelota naranja", answer: "baloncesto", category: "Deportes" },
  { letter: "C", question: "Capital de España", answer: "madrid", category: "Geografía" },
  { letter: "D", question: "Instrumento musical de percusión", answer: "tambor", category: "Música" },
  { letter: "E", question: "Animal más grande del mundo", answer: "elefante", category: "Animales" },
  { letter: "F", question: "Fruta amarilla alargada", answer: "platano", category: "Frutas" },
  { letter: "G", question: "Felino grande con melena", answer: "leon", category: "Animales" },
  { letter: "H", question: "Órgano que bombea sangre", answer: "corazon", category: "Anatomía" },
  { letter: "I", question: "País en forma de bota", answer: "italia", category: "Geografía" },
  { letter: "J", question: "Deporte que se juega en un jardín", answer: "tenis", category: "Deportes" },
  { letter: "K", question: "Arte marcial japonés", answer: "karate", category: "Deportes" },
  { letter: "L", question: "Satélite natural de la Tierra", answer: "luna", category: "Astronomía" },
  { letter: "M", question: "Planeta rojo del sistema solar", answer: "marte", category: "Astronomía" },
  { letter: "N", question: "Estación del año más fría", answer: "invierno", category: "Naturaleza" },
  { letter: "O", question: "Metal precioso amarillo", answer: "oro", category: "Minerales" },
  { letter: "P", question: "Ave que no puede volar y vive en el hielo", answer: "pinguino", category: "Animales" },
  { letter: "Q", question: "Producto lácteo amarillo", answer: "queso", category: "Alimentos" },
  { letter: "R", question: "Color del fuego", answer: "rojo", category: "Colores" },
  { letter: "S", question: "Estrella del sistema solar", answer: "sol", category: "Astronomía" },
  { letter: "T", question: "Bebida caliente con hojas", answer: "te", category: "Bebidas" },
  { letter: "U", question: "Fruta morada pequeña", answer: "uva", category: "Frutas" },
  { letter: "V", question: "Color de la hierba", answer: "verde", category: "Colores" },
  { letter: "W", question: "Red mundial de información", answer: "web", category: "Tecnología" },
  { letter: "X", question: "Instrumento musical de percusión", answer: "xilofono", category: "Música" },
  { letter: "Y", question: "Embarcación de vela", answer: "yate", category: "Transporte" },
  { letter: "Z", question: "Animal con rayas blancas y negras", answer: "zebra", category: "Animales" },
]

export default function PasapalabraGame() {
  const [gameState, setGameState] = useState<"waiting" | "playing" | "paused" | "finished">("waiting")
  const [letters, setLetters] = useState<LetterState[]>([])
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(150) // 2.5 minutes
  const [score, setScore] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [round, setRound] = useState(1)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [playerName, setPlayerName] = useState("")
  const [gameResults, setGameResults] = useState<Record<string, { correct: boolean }>>({})

  // Initialize letters
  useEffect(() => {
    const initialLetters: LetterState[] = QUESTIONS.map((q, index) => ({
      letter: q.letter,
      status: index === 0 ? "current" : "pending",
      question: q,
    }))
    setLetters(initialLetters)
  }, [])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === "playing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("finished")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState, timeLeft])

  // Load player name on component mount
  useEffect(() => {
    const savedName = getPlayerName()
    setPlayerName(savedName)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const startGame = () => {
    setGameState("playing")
    setCurrentLetterIndex(0)
    setScore(0)
    setTimeLeft(150)
    setRound(1)
    setCurrentAnswer("")

    const resetLetters = letters.map((letter, index) => ({
      ...letter,
      status: index === 0 ? "current" : ("pending" as const),
    }))
    setLetters(resetLetters)
  }

  const pauseGame = () => {
    setGameState(gameState === "playing" ? "paused" : "playing")
  }

  const resetGame = () => {
    setGameState("waiting")
    setCurrentLetterIndex(0)
    setScore(0)
    setTimeLeft(150)
    setRound(1)
    setCurrentAnswer("")

    const resetLetters = letters.map((letter, index) => ({
      ...letter,
      status: index === 0 ? "current" : ("pending" as const),
    }))
    setLetters(resetLetters)
  }

  const submitAnswer = () => {
    if (!currentAnswer.trim()) return

    const currentLetter = letters[currentLetterIndex]
    const isCorrect = currentAnswer.toLowerCase().trim() === currentLetter.question?.answer.toLowerCase()

    // Track results for statistics
    if (currentLetter.question) {
      setGameResults((prev) => ({
        ...prev,
        [currentLetter.question!.category]: { correct: isCorrect },
      }))
    }

    const updatedLetters = letters.map((letter, index) => {
      if (index === currentLetterIndex) {
        return {
          ...letter,
          status: isCorrect ? "correct" : ("incorrect" as const),
        }
      }
      return letter
    })

    setLetters(updatedLetters)

    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    setCurrentAnswer("")
    setTimeout(moveToNextLetter, 500)
  }

  const moveToNextLetter = useCallback(() => {
    const pendingLetters = letters.filter((l) => l.status === "pending")
    if (pendingLetters.length === 0) {
      // Game finished - save results
      const timeUsed = 150 - timeLeft
      const questionsAnswered = letters.filter((l) => l.status !== "pending").length

      // Update player statistics
      updatePlayerStats({
        score,
        timeUsed,
        questionsAnswered,
        categoryResults: gameResults,
      })

      // Add to high scores if score is good enough or if it's a new personal best
      const currentScores = getHighScores()
      const shouldAddScore = currentScores.length < 10 || score > Math.min(...currentScores.map((s) => s.score))

      if (shouldAddScore) {
        const newScore = {
          id: Date.now().toString(),
          playerName: playerName || "Jugador Anónimo",
          score,
          timeUsed,
          date: new Date().toISOString(),
          perfectGame: score === 26,
        }
        addHighScore(newScore)
      }

      setGameState("finished")
      return
    }

    const nextPendingIndex = letters.findIndex((l) => l.status === "pending")
    setCurrentLetterIndex(nextPendingIndex)

    const updatedLetters = letters.map((letter, index) => ({
      ...letter,
      status: index === nextPendingIndex ? "current" : letter.status,
    }))
    setLetters(updatedLetters)
  }, [letters, timeLeft, score, gameResults, playerName])

  const passQuestion = () => {
    const updatedLetters = letters.map((letter, index) => {
      if (index === currentLetterIndex) {
        return {
          ...letter,
          status: "passed" as const,
        }
      }
      return letter
    })

    setLetters(updatedLetters)
    setCurrentAnswer("")
    moveToNextLetter()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && gameState === "playing") {
      submitAnswer()
    }
  }

  const getLetterPosition = (index: number) => {
    const angle = (index * 360) / 26 - 90 // Start from top
    const radius = 140
    const x = Math.cos((angle * Math.PI) / 180) * radius
    const y = Math.sin((angle * Math.PI) / 180) * radius
    return { x, y }
  }

  const getStatusColor = (status: LetterState["status"]) => {
    switch (status) {
      case "current":
        return "bg-blue-500 text-white border-blue-600"
      case "correct":
        return "bg-green-500 text-white border-green-600"
      case "incorrect":
        return "bg-red-500 text-white border-red-600"
      case "passed":
        return "bg-yellow-500 text-white border-yellow-600"
      default:
        return "bg-gray-200 text-gray-700 border-gray-300"
    }
  }

  const currentQuestion = letters[currentLetterIndex]?.question

  const openLeaderboard = () => {
    setShowLeaderboard(true)
  }

  const openNameDialog = () => {
    setShowNameDialog(true)
  }

  const handleNameSave = (name: string) => {
    setPlayerName(name)
    setShowNameDialog(false)
  }

  const handleNameSkip = () => {
    setShowNameDialog(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">PASAPALABRA</h1>
          <p className="text-xl text-blue-200">El juego de palabras más emocionante</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Control del Juego
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {gameState === "waiting" && (
                    <Button onClick={startGame} className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar
                    </Button>
                  )}
                  {(gameState === "playing" || gameState === "paused") && (
                    <Button onClick={pauseGame} variant="outline" className="flex-1 bg-transparent">
                      <Pause className="w-4 h-4 mr-2" />
                      {gameState === "playing" ? "Pausar" : "Continuar"}
                    </Button>
                  )}
                  <Button onClick={resetGame} variant="outline">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={openLeaderboard} variant="outline" className="flex-1 bg-transparent">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ranking
                  </Button>
                  <Button onClick={openNameDialog} variant="outline" className="flex-1 bg-transparent">
                    <User className="w-4 h-4 mr-2" />
                    {playerName ? playerName.slice(0, 8) + (playerName.length > 8 ? "..." : "") : "Nombre"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tiempo:</span>
                    <Badge variant={timeLeft < 30 ? "destructive" : "default"}>{formatTime(timeLeft)}</Badge>
                  </div>
                  <Progress value={(timeLeft / 150) * 100} className="h-2" />
                </div>

                <div className="flex justify-between">
                  <span>Puntuación:</span>
                  <Badge variant="secondary">{score}/26</Badge>
                </div>

                <div className="flex justify-between">
                  <span>Ronda:</span>
                  <Badge>{round}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Question Card */}
            {currentQuestion && gameState === "playing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Letra {currentQuestion.letter}</CardTitle>
                  <Badge variant="outline">{currentQuestion.category}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">{currentQuestion.question}</p>

                  <div className="space-y-2">
                    <Input
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu respuesta..."
                      className="text-lg"
                      autoFocus
                    />

                    <div className="flex gap-2">
                      <Button onClick={submitAnswer} className="flex-1">
                        Responder
                      </Button>
                      <Button onClick={passQuestion} variant="outline">
                        Pasar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Circular Game Board */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">
                      {letters[currentLetterIndex]?.letter || "A"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {gameState === "waiting" && "Presiona Iniciar"}
                      {gameState === "playing" && "En juego"}
                      {gameState === "paused" && "Pausado"}
                      {gameState === "finished" && "Juego terminado"}
                    </div>
                  </div>
                </div>

                {/* Letter Circle */}
                <div className="relative w-full h-full">
                  {letters.map((letter, index) => {
                    const { x, y } = getLetterPosition(index)
                    return (
                      <div
                        key={letter.letter}
                        className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${getStatusColor(letter.status)}`}
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: `translate(-50%, -50%) ${letter.status === "current" ? "scale(1.2)" : "scale(1)"}`,
                        }}
                      >
                        {letter.letter}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Game Over Screen */}
              {gameState === "finished" && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                  <Card className="p-6 text-center">
                    <CardHeader>
                      <CardTitle className="text-2xl">¡Juego Terminado!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-4xl font-bold text-blue-600">{score}/26</div>
                      <p className="text-lg">
                        {score === 26
                          ? "¡Perfecto! ¡Rosco completado!"
                          : score >= 20
                            ? "¡Excelente puntuación!"
                            : score >= 15
                              ? "¡Muy bien!"
                              : score >= 10
                                ? "¡Buen intento!"
                                : "¡Sigue practicando!"}
                      </p>
                      <Button onClick={resetGame} className="w-full">
                        Jugar de Nuevo
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Legend */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span>Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Correcta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Incorrecta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>Pasada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                <span>Pendiente</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}

        {showNameDialog && <PlayerNameDialog onSave={handleNameSave} onSkip={handleNameSkip} />}
      </div>
    </div>
  )
}
