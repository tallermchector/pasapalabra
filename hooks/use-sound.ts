'use client'

import { useCallback, useRef } from 'react'

interface SoundEffects {
  correct: string
  incorrect: string
  skip: string
  gameStart: string
  gameEnd: string
  tick: string
}

const defaultSounds: SoundEffects = {
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  skip: '/sounds/skip.mp3',
  gameStart: '/sounds/game-start.mp3',
  gameEnd: '/sounds/game-end.mp3',
  tick: '/sounds/tick.mp3',
}

export function useSound(enabled: boolean = true) {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})

  const preloadSounds = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return

    Object.entries(defaultSounds).forEach(([key, src]) => {
      if (!audioRefs.current[key]) {
        const audio = new Audio(src)
        audio.preload = 'auto'
        audio.volume = 0.5
        audioRefs.current[key] = audio
      }
    })
  }, [enabled])

  const playSound = useCallback((soundName: keyof SoundEffects) => {
    if (!enabled || typeof window === 'undefined') return

    const audio = audioRefs.current[soundName]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(console.error)
    }
  }, [enabled])

  const setVolume = useCallback((volume: number) => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = Math.max(0, Math.min(1, volume))
    })
  }, [])

  return {
    playSound,
    setVolume,
    preloadSounds,
  }
}