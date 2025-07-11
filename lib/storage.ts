export interface GameStats {
  totalGamesPlayed: number
  totalCorrectAnswers: number
  totalQuestionsAnswered: number
  bestScore: number
  bestTime: number
  averageScore: number
  gamesWon: number // Perfect games (26/26)
  streakRecord: number
  categoryStats: Record<string, { correct: number; total: number }>
}

export interface HighScore {
  id: string
  playerName: string
  score: number
  timeUsed: number
  date: string
  perfectGame: boolean
}

const STORAGE_KEYS = {
  HIGH_SCORES: "pasapalabra_high_scores",
  PLAYER_STATS: "pasapalabra_player_stats",
  PLAYER_NAME: "pasapalabra_player_name",
}

export const getHighScores = (): HighScore[] => {
  if (typeof window === "undefined") return []

  try {
    const scores = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES)
    return scores ? JSON.parse(scores) : []
  } catch {
    return []
  }
}

export const addHighScore = (score: HighScore): void => {
  if (typeof window === "undefined") return

  try {
    const scores = getHighScores()
    scores.push(score)

    // Sort by score (desc), then by time used (asc)
    scores.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score
      return a.timeUsed - b.timeUsed
    })

    // Keep only top 10 scores
    const topScores = scores.slice(0, 10)
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(topScores))
  } catch (error) {
    console.error("Error saving high score:", error)
  }
}

export const getPlayerStats = (): GameStats => {
  if (typeof window === "undefined") {
    return {
      totalGamesPlayed: 0,
      totalCorrectAnswers: 0,
      totalQuestionsAnswered: 0,
      bestScore: 0,
      bestTime: 0,
      averageScore: 0,
      gamesWon: 0,
      streakRecord: 0,
      categoryStats: {},
    }
  }

  try {
    const stats = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS)
    return stats
      ? JSON.parse(stats)
      : {
          totalGamesPlayed: 0,
          totalCorrectAnswers: 0,
          totalQuestionsAnswered: 0,
          bestScore: 0,
          bestTime: 0,
          averageScore: 0,
          gamesWon: 0,
          streakRecord: 0,
          categoryStats: {},
        }
  } catch {
    return {
      totalGamesPlayed: 0,
      totalCorrectAnswers: 0,
      totalQuestionsAnswered: 0,
      bestScore: 0,
      bestTime: 0,
      averageScore: 0,
      gamesWon: 0,
      streakRecord: 0,
      categoryStats: {},
    }
  }
}

export const updatePlayerStats = (gameResult: {
  score: number
  timeUsed: number
  questionsAnswered: number
  categoryResults: Record<string, { correct: boolean }>
}): void => {
  if (typeof window === "undefined") return

  try {
    const stats = getPlayerStats()

    stats.totalGamesPlayed += 1
    stats.totalCorrectAnswers += gameResult.score
    stats.totalQuestionsAnswered += gameResult.questionsAnswered
    stats.bestScore = Math.max(stats.bestScore, gameResult.score)

    if (
      gameResult.score > stats.bestScore ||
      (gameResult.score === stats.bestScore && gameResult.timeUsed < stats.bestTime)
    ) {
      stats.bestTime = gameResult.timeUsed
    }

    stats.averageScore = stats.totalCorrectAnswers / stats.totalGamesPlayed

    if (gameResult.score === 26) {
      stats.gamesWon += 1
    }

    // Update category stats
    Object.entries(gameResult.categoryResults).forEach(([category, result]) => {
      if (!stats.categoryStats[category]) {
        stats.categoryStats[category] = { correct: 0, total: 0 }
      }
      stats.categoryStats[category].total += 1
      if (result.correct) {
        stats.categoryStats[category].correct += 1
      }
    })

    localStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(stats))
  } catch (error) {
    console.error("Error updating player stats:", error)
  }
}

export const getPlayerName = (): string => {
  if (typeof window === "undefined") return ""

  try {
    return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || ""
  } catch {
    return ""
  }
}

export const setPlayerName = (name: string): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name)
  } catch (error) {
    console.error("Error saving player name:", error)
  }
}

export const clearAllData = (): void => {
  if (typeof window === "undefined") return

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error("Error clearing data:", error)
  }
}
