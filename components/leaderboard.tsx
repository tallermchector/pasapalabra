"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, Clock, Target, TrendingUp } from "lucide-react"
import { getHighScores, getPlayerStats, type HighScore, type GameStats } from "@/lib/storage"

interface LeaderboardProps {
  onClose: () => void
}

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [highScores, setHighScores] = useState<HighScore[]>([])
  const [playerStats, setPlayerStats] = useState<GameStats | null>(null)
  const [activeTab, setActiveTab] = useState<"scores" | "stats">("scores")

  useEffect(() => {
    setHighScores(getHighScores())
    setPlayerStats(getPlayerStats())
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{index + 1}</span>
    }
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-green-600"
    if (accuracy >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Estadísticas y Récords
            </CardTitle>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant={activeTab === "scores" ? "default" : "outline"}
              onClick={() => setActiveTab("scores")}
              className="flex-1"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Mejores Puntuaciones
            </Button>
            <Button
              variant={activeTab === "stats" ? "default" : "outline"}
              onClick={() => setActiveTab("stats")}
              className="flex-1"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Mis Estadísticas
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[60vh]">
          {activeTab === "scores" && (
            <div className="space-y-4">
              {highScores.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>¡Aún no hay puntuaciones registradas!</p>
                  <p className="text-sm">Juega tu primera partida para aparecer en el ranking.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {highScores.map((score, index) => (
                    <Card
                      key={score.id}
                      className={`p-4 ${index < 3 ? "border-2 border-yellow-200 bg-yellow-50" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getRankIcon(index)}
                          <div>
                            <div className="font-semibold text-lg">{score.playerName || "Jugador Anónimo"}</div>
                            <div className="text-sm text-gray-600">{formatDate(score.date)}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              <span className="text-2xl font-bold text-blue-600">{score.score}/26</span>
                              {score.perfectGame && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                  ¡PERFECTO!
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-3 h-3" />
                              {formatTime(score.timeUsed)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "stats" && playerStats && (
            <div className="space-y-6">
              {playerStats.totalGamesPlayed === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>¡Aún no tienes estadísticas!</p>
                  <p className="text-sm">Juega algunas partidas para ver tu progreso.</p>
                </div>
              ) : (
                <>
                  {/* General Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{playerStats.totalGamesPlayed}</div>
                      <div className="text-sm text-gray-600">Partidas Jugadas</div>
                    </Card>

                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{playerStats.bestScore}/26</div>
                      <div className="text-sm text-gray-600">Mejor Puntuación</div>
                    </Card>

                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{playerStats.averageScore.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Promedio</div>
                    </Card>

                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{playerStats.gamesWon}</div>
                      <div className="text-sm text-gray-600">Juegos Perfectos</div>
                    </Card>
                  </div>

                  {/* Accuracy Stats */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Precisión General
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Respuestas Correctas</div>
                        <div className="text-xl font-bold text-green-600">{playerStats.totalCorrectAnswers}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Precisión</div>
                        <div
                          className={`text-xl font-bold ${getAccuracyColor(
                            (playerStats.totalCorrectAnswers / playerStats.totalQuestionsAnswered) * 100,
                          )}`}
                        >
                          {playerStats.totalQuestionsAnswered > 0
                            ? `${((playerStats.totalCorrectAnswers / playerStats.totalQuestionsAnswered) * 100).toFixed(1)}%`
                            : "0%"}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Category Stats */}
                  {Object.keys(playerStats.categoryStats).length > 0 && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Rendimiento por Categoría
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(playerStats.categoryStats)
                          .sort(([, a], [, b]) => b.correct / b.total - a.correct / a.total)
                          .map(([category, stats]) => {
                            const accuracy = (stats.correct / stats.total) * 100
                            return (
                              <div key={category} className="flex items-center justify-between">
                                <span className="font-medium">{category}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">
                                    {stats.correct}/{stats.total}
                                  </span>
                                  <Badge variant="outline" className={getAccuracyColor(accuracy)}>
                                    {accuracy.toFixed(0)}%
                                  </Badge>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </Card>
                  )}

                  {/* Best Time */}
                  {playerStats.bestTime > 0 && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Mejor Tiempo
                      </h3>
                      <div className="text-2xl font-bold text-blue-600">{formatTime(playerStats.bestTime)}</div>
                      <div className="text-sm text-gray-600">
                        Para tu mejor puntuación de {playerStats.bestScore}/26
                      </div>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
