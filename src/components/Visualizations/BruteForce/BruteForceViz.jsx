import { useState } from 'react'
import { motion } from 'framer-motion'
import ControlPanel from '../../Common/ControlPanel'
import Sidebar from '../../Layout/Sidebar'
import { generateRandomArray } from '../../../utils/arrayHelpers'
import { useAnimation } from '../../../hooks/useAnimation'
import { useSpeed } from '../../../context/SpeedContext'

export default function BruteForceViz() {
  const [array, setArray] = useState(generateRandomArray(10))
  const [target, setTarget] = useState(50)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [found, setFound] = useState(false)
  const [resultIndex, setResultIndex] = useState(null)
  const [matchedIndex, setMatchedIndex] = useState(null)
  const { isPlaying, play, pause, reset } = useAnimation()
  const { speed, setSpeed } = useSpeed()

  const handlePlay = async () => {
    try {
      const res = await fetch('http://localhost:8000/algorithms/search', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: 'linear', array, target })
      })
      const data = await res.json()
      const steps = data.steps || []
      const result = data.result || { found: false, index: null }
      setResultIndex(result.index)
      if (result.found) setMatchedIndex(result.index)
      play(steps, (step) => {
        setCurrentIndex(step.index)
        setFound(step.found || false)
      }, () => {
        // Reset current pointer; keep matched index highlighted
        setCurrentIndex(-1)
        setFound(false)
      })
    } catch (e) {
      // No local fallback; require backend
      setTimeout(() => {
        setCurrentIndex(-1)
        setFound(false)
      }, 2000)
    }
  }

  const handleReset = () => {
    reset()
    setCurrentIndex(-1)
    setFound(false)
  }

  const handleRandomize = () => {
    setArray(generateRandomArray(array.length))
    handleReset()
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight border-b-3 sm:border-b-4 border-black dark:border-brutal-bg pb-3 sm:pb-4">
        BRUTE FORCE
        <span className="block text-lg sm:text-xl lg:text-2xl mt-2 text-brutal-primary">LINEAR SEARCH</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="flex-1 space-y-4 sm:space-y-6">
          <ControlPanel
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={pause}
            onReset={handleReset}
            onRandomize={handleRandomize}
            speed={speed}
            onSpeedChange={setSpeed}
            arraySize={array.length}
            onArraySizeChange={(size) => {
              setArray(generateRandomArray(size))
              handleReset()
            }}
          />

          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-3 sm:p-4 lg:p-6">
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <label className="text-xs sm:text-sm font-black uppercase tracking-wide">
                  TARGET VALUE
                </label>
                <span className="text-xl sm:text-2xl font-black px-3 sm:px-4 py-1 sm:py-2 bg-brutal-danger text-white border-3 border-black dark:border-brutal-bg shadow-brutal-sm">
                  {target}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full slider-brutal"
              />
            </div>

            <div className="flex gap-1 sm:gap-2 items-end justify-center h-48 sm:h-64 lg:h-80 border-3 border-black dark:border-brutal-bg p-2 sm:p-4 bg-white dark:bg-black overflow-x-auto">
              {array.map((value, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center flex-shrink-0"
                  animate={{
                    scale: currentIndex === index ? 1.1 : 1,
                  }}
                >
                  <div
                    className={`w-6 sm:w-10 lg:w-12 border-2 sm:border-3 border-black dark:border-brutal-bg transition-colors ${
                      currentIndex === index && found
                        ? 'bg-brutal-success'
                        : currentIndex === index
                        ? 'bg-brutal-warning'
                        : 'bg-brutal-secondary'
                    }`}
                    style={{ height: `${value * (window.innerWidth < 640 ? 1.5 : 2.5)}px` }}
                  />
                  <span className="text-[10px] sm:text-xs mt-1 sm:mt-2 font-black">
                    {value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:block">
          <Sidebar complexity={{ time: 'O(n)', space: 'O(1)' }}>
            <p className="text-xs sm:text-sm">
              BRUTE FORCE APPROACH CHECKS EVERY ELEMENT ONE BY ONE UNTIL IT FINDS
              THE TARGET OR REACHES THE END OF THE ARRAY.
            </p>
          </Sidebar>
        </div>
      </div>
    </div>
  )
}
