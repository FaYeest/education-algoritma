import { useState, useRef, useCallback } from 'react'
import { useSpeed } from '../context/SpeedContext'

export function useAnimation() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const { getDelay } = useSpeed()
  const timeoutRef = useRef(null)

  const play = useCallback((steps, onStep, onComplete) => {
    setIsPlaying(true)
    let step = 0

    const runStep = () => {
      if (step < steps.length) {
        onStep(steps[step])
        setCurrentStep(step)
        step++
        timeoutRef.current = setTimeout(runStep, getDelay())
      } else {
        setIsPlaying(false)
        if (onComplete) onComplete()
      }
    }

    runStep()
  }, [getDelay])

  const pause = useCallback(() => {
    setIsPlaying(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const reset = useCallback(() => {
    pause()
    setCurrentStep(0)
  }, [pause])

  return { isPlaying, currentStep, play, pause, reset }
}
