import { useState } from 'react'
import { motion } from 'framer-motion'
import ControlPanel from '../../Common/ControlPanel'
import Sidebar from '../../Layout/Sidebar'
import { bubbleSort, selectionSort, insertionSort } from '../../../utils/sortingAlgorithms'
import { generateRandomArray } from '../../../utils/arrayHelpers'
import { useAnimation } from '../../../hooks/useAnimation'
import { useSpeed } from '../../../context/SpeedContext'

export default function SortingViz() {
  const [array, setArray] = useState(generateRandomArray(15))
  const [algorithm, setAlgorithm] = useState('bubble')
  const [comparing, setComparing] = useState([])
  const { isPlaying, play, pause, reset } = useAnimation()
  const { speed, setSpeed } = useSpeed()

  const algorithms = {
    bubble: { fn: bubbleSort, name: 'Bubble Sort', time: 'O(n²)' },
    selection: { fn: selectionSort, name: 'Selection Sort', time: 'O(n²)' },
    insertion: { fn: insertionSort, name: 'Insertion Sort', time: 'O(n²)' },
  }

  const handlePlay = async () => {
    try {
      const res = await fetch('http://localhost:8000/algorithms/sorting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, array })
      })
      const data = await res.json()
      const steps = data.steps || []
      play(steps, (step) => {
        setArray(step.array)
        setComparing(step.indices || [])
      }, () => {
        setComparing([])
      })
    } catch (e) {
      setExplanation('Gagal memanggil API sorting. Pastikan backend berjalan.')
    }
  }

  const handleReset = () => {
    reset()
    setArray(generateRandomArray(array.length))
    setComparing([])
  }

  const handleRandomize = () => {
    setArray(generateRandomArray(array.length))
    setComparing([])
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight border-b-3 sm:border-b-4 border-black dark:border-brutal-bg pb-3 sm:pb-4">
        SORTING ALGORITHMS
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="flex-1 space-y-4 sm:space-y-6">
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {Object.keys(algorithms).map((key) => (
              <button
                key={key}
                onClick={() => setAlgorithm(key)}
                className={`btn-brutal px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-xs sm:text-sm font-black shadow-brutal-sm ${
                  algorithm === key
                    ? 'bg-brutal-primary text-white'
                    : 'bg-brutal-bg dark:bg-brutal-dark border-black dark:border-brutal-bg'
                }`}
              >
                {algorithms[key].name}
              </button>
            ))}
          </div>

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
              reset()
            }}
          />

          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-3 sm:p-4 lg:p-6">
            <div className="flex gap-1 sm:gap-2 items-end justify-center h-56 sm:h-72 lg:h-96 border-3 border-black dark:border-brutal-bg p-2 sm:p-4 bg-white dark:bg-black overflow-x-auto">
              {array.map((value, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center flex-shrink-0"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-5 sm:w-6 lg:w-8 border-2 sm:border-3 border-black dark:border-brutal-bg transition-colors ${
                      comparing.includes(index)
                        ? 'bg-brutal-danger'
                        : 'bg-brutal-cyan'
                    }`}
                    style={{ height: `${value * (window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4)}px` }}
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
          <Sidebar complexity={{ time: algorithms[algorithm].time, space: 'O(1)' }}>
            <p className="uppercase text-xs sm:text-sm">
              {algorithms[algorithm].name} COMPARES AND SWAPS ADJACENT ELEMENTS
              TO SORT THE ARRAY.
            </p>
          </Sidebar>
        </div>
      </div>
    </div>
  )
}
