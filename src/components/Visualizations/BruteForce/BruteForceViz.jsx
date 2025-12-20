import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateRandomArray } from '../../../utils/arrayHelpers'
import { useSpeed } from '../../../context/SpeedContext'
import PlaybackControls from '../../Common/PlaybackControls'
import StatsPanel from '../../Common/StatsPanel'
import GenericStepsList from '../../Common/GenericStepsList'
import { API_BASE_URL } from '../../../config/api'
import { 
  BoltIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid'

export default function BruteForceViz() {
  const [array, setArray] = useState(generateRandomArray(10))
  const [target, setTarget] = useState(50)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [matchedIndices, setMatchedIndices] = useState([])
  const [viewMode, setViewMode] = useState('step')
  const [isLoadingSteps, setIsLoadingSteps] = useState(false)
  const [animationCompleted, setAnimationCompleted] = useState(false)
  const { speed, setSpeed, getDelay } = useSpeed()

  const fetchSteps = async () => {
    setIsLoadingSteps(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/algorithms/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: 'linear', array, target })
      })
      const data = await res.json()
      setSteps(data.steps || [])
      setCurrentStep(0)
      setMatchedIndices([])
      setAnimationCompleted(false)
      return data.steps || []
    } catch (error) {
      console.error('Failed to fetch bruteforce steps:', error)
      return []
    } finally {
      setIsLoadingSteps(false)
    }
  }

  const handlePlay = async () => {
    if (steps.length === 0) {
      const newSteps = await fetchSteps()
      if (newSteps.length > 0) {
        setIsPlaying(true)
      }
    } else {
      setIsPlaying(true)
    }
  }

  const handlePause = () => setIsPlaying(false)

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setSteps([])
    setMatchedIndices([])
    setAnimationCompleted(false)
  }

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleRandomize = () => {
    setArray(generateRandomArray(array.length))
    handleReset()
  }

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      if (currentStep < steps.length - 1) {
        const timer = setTimeout(() => {
          setCurrentStep(prev => prev + 1)
        }, getDelay())
        return () => clearTimeout(timer)
      } else {
        setIsPlaying(false)
        setAnimationCompleted(true)
        // On completion, get the final step with all found indices
        const finalStep = steps[steps.length - 1]
        if (finalStep && finalStep.final && finalStep.indices) {
          setMatchedIndices(finalStep.indices)
        } else if (finalStep && finalStep.indices) {
          setMatchedIndices(finalStep.indices)
        }
      }
    }
  }, [isPlaying, currentStep, steps, getDelay])

  const currentStepData = steps[currentStep] || {}
  const currentIndex = currentStepData.index ?? -1

  const getStepTitle = () => {
    if (currentStepData.final) {
      const foundCount = matchedIndices.length || (currentStepData.indices || []).length
      if (foundCount > 0) {
        return (
          <span className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            SELESAI - {foundCount} DITEMUKAN
          </span>
        )
      } else {
        return (
          <span className="flex items-center gap-2">
            <XCircleIcon className="w-5 h-5" />
            SELESAI - TIDAK DITEMUKAN
          </span>
        )
      }
    }
    if (currentStepData.found) {
      return (
        <span className="flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5" />
          DITEMUKAN!
        </span>
      )
    }
    if (currentStepData.index !== undefined) {
      return (
        <span className="flex items-center gap-2">
          <MagnifyingGlassIcon className="w-5 h-5" />
          CEK INDEX {currentStepData.index}
        </span>
      )
    }
    return 'SIAP MULAI'
  }

  const getStepExplanation = () => {
    if (currentStepData.found && currentStepData.index !== undefined) {
      return (
        <span className="flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-brutal-success" />
          Target {target} ditemukan di index {currentStepData.index}! Nilai: {array[currentStepData.index]}
        </span>
      )
    }
    if (currentStepData.final) {
      const foundCount = matchedIndices.length
      if (foundCount > 0) {
        return (
          <span className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-brutal-success" />
            Pencarian selesai! Target {target} ditemukan {foundCount} kali di index: {matchedIndices.join(', ')}
          </span>
        )
      } else {
        return (
          <span className="flex items-center gap-2">
            <XCircleIcon className="w-5 h-5 text-brutal-danger" />
            Pencarian selesai! Target {target} tidak ditemukan dalam array.
          </span>
        )
      }
    }
    if (currentStepData.index !== undefined) {
      return (
        <span className="flex items-center gap-2">
          <MagnifyingGlassIcon className="w-5 h-5 text-brutal-primary" />
          Memeriksa index {currentStepData.index}: nilai {array[currentStepData.index]} {
            array[currentStepData.index] === target ? '=' : '≠'
          } {target}
        </span>
      )
    }
    return 'Klik Play untuk mencari target dengan Brute Force!'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          Brute Force Search
        </h1>
        <p className="text-lg sm:text-xl font-bold text-brutal-primary mt-2 flex items-center gap-2">
          <MagnifyingGlassIcon className="w-6 h-6" />
          CEK SATU PER SATU!
        </p>
        <p className="text-sm sm:text-base font-bold uppercase mt-2 opacity-80">
          Pencarian paling sederhana: cek dari awal sampai akhir
        </p>
      </div>

      {/* Target Input */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <label className="font-black uppercase text-sm block mb-2 flex items-center gap-2">
          <MagnifyingGlassIcon className="w-5 h-5 text-brutal-primary" />
          Target: {target}
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={target}
          onChange={(e) => {
            setTarget(Number(e.target.value))
            handleReset()
          }}
          className="slider-brutal w-full"
        />
      </div>

      {/* Array Size Control */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <label className="font-black uppercase text-sm block mb-2 flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5 text-brutal-primary" />
          Jumlah Elemen: {array.length}
        </label>
        <input
          type="range"
          min="5"
          max="20"
          value={array.length}
          onChange={(e) => {
            setArray(generateRandomArray(Number(e.target.value)))
            handleReset()
          }}
          className="slider-brutal w-full"
        />
      </div>

      {/* Randomize Button */}
      <div className="flex gap-3">
        <button
          onClick={handleRandomize}
          className="btn-brutal px-4 py-2 bg-brutal-warning text-black font-black uppercase flex items-center gap-2"
        >
          <ArrowsRightLeftIcon className="w-5 h-5" />
          Acak Array
        </button>
      </div>

      {/* Speed Control */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <div className="flex items-center gap-4">
          <label className="font-black uppercase text-sm whitespace-nowrap flex items-center gap-2">
            <BoltIcon className="w-5 h-5 text-brutal-primary" />
            Kecepatan:
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="slider-brutal flex-1"
          />
          <span className="font-black text-brutal-primary text-lg min-w-[60px] text-center">
            {speed === 1 ? 'Lambat' : speed <= 3 ? 'Sedang' : speed <= 7 ? 'Cepat' : 'Kilat'}
          </span>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <div className="flex items-center gap-3">
          <span className="font-black uppercase text-sm">Mode Tampilan:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('step')}
              className={`btn-brutal px-4 py-2 font-black uppercase text-sm ${
                viewMode === 'step'
                  ? 'bg-brutal-primary text-white'
                  : 'bg-white dark:bg-brutal-dark text-black dark:text-white'
              }`}
            >
              Step-by-Step
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn-brutal px-4 py-2 font-black uppercase text-sm ${
                viewMode === 'list'
                  ? 'bg-brutal-primary text-white'
                  : 'bg-white dark:bg-brutal-dark text-black dark:text-white'
              }`}
            >
              Lihat Semua Step
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Main Visualization */}
          <div className="card-brutal bg-white dark:bg-black p-6 min-h-[400px]">
            <div className="space-y-6">
              {/* Array Visualization */}
              <div className="flex gap-2 items-end justify-center h-64 border-3 border-black dark:border-brutal-bg p-4 bg-brutal-bg dark:bg-gray-900 overflow-x-auto">
                {array.map((value, index) => {
                  const isMatched = matchedIndices.includes(index)
                  const isCurrent = currentIndex === index
                  
                  return (
                    <motion.div
                      key={index}
                      className="flex flex-col items-center flex-shrink-0"
                      animate={{
                        scale: isCurrent ? 1.1 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Search icon above current */}
                      {isCurrent && (
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="mb-2"
                        >
                          <MagnifyingGlassIcon className="w-6 h-6 text-brutal-warning" />
                        </motion.div>
                      )}
                      
                      {/* Bar */}
                      <div
                        className={`w-10 border-3 border-black dark:border-brutal-bg transition-colors ${
                          isMatched
                            ? 'bg-brutal-success'
                            : isCurrent
                            ? 'bg-brutal-warning'
                            : 'bg-brutal-secondary'
                        }`}
                        style={{ height: `${value * 2}px` }}
                      />
                      
                      {/* Value label */}
                      <span className="text-xs mt-2 font-black dark:text-white">
                        {value}
                      </span>
                      
                      {/* Index label */}
                      <span className="text-[10px] font-bold opacity-50 dark:text-white">
                        [{index}]
                      </span>
                      
                      {/* Checkmark for matched */}
                      {isMatched && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
                        >
                          <CheckCircleIcon className="w-6 h-6 text-brutal-success mt-1" />
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-3 text-center">
                  <p className="text-xs font-bold uppercase opacity-70">Total Cek</p>
                  <p className="text-2xl font-black text-brutal-primary">{currentStep + 1}</p>
                </div>
                <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-3 text-center">
                  <p className="text-xs font-bold uppercase opacity-70">Ditemukan</p>
                  <p className="text-2xl font-black text-brutal-success">{matchedIndices.length}</p>
                </div>
                <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-3 text-center">
                  <p className="text-xs font-bold uppercase opacity-70">Progress</p>
                  <p className="text-2xl font-black text-brutal-cyan">
                    {steps.length > 0 ? Math.round(((currentStep + 1) / steps.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4">
            <PlaybackControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
            />
          </div>

          {/* Step Info */}
          {steps.length === 0 ? (
            <div className="card-brutal bg-brutal-primary text-white p-6 mt-4 text-center">
              <div className="space-y-3">
                <MagnifyingGlassIcon className="w-12 h-12 mx-auto" />
                <p className="text-xl font-black uppercase">
                  Klik PLAY untuk Memulai!
                </p>
                <p className="text-sm font-bold opacity-90">
                  Brute Force akan mencari target satu per satu
                </p>
              </div>
            </div>
          ) : (
            <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-6 mt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold uppercase text-sm opacity-70">
                  Langkah {currentStep + 1} dari {steps.length}
                </span>
                <div className={`px-3 py-1 border-3 border-black dark:border-brutal-bg font-black text-lg ${
                  currentStepData.final
                    ? (matchedIndices.length > 0 || (currentStepData.indices || []).length > 0)
                      ? 'bg-brutal-success text-white'
                      : 'bg-brutal-danger text-white'
                    : currentStepData.found
                    ? 'bg-brutal-success text-white'
                    : currentStepData.index !== undefined
                    ? 'bg-brutal-warning text-black'
                    : 'bg-brutal-secondary text-black'
                }`}>
                  {getStepTitle()}
                </div>
              </div>
              
              <div className="font-bold text-base sm:text-lg leading-relaxed">
                {getStepExplanation()}
              </div>
            </div>
          )}

          {/* All Steps List - Only shown in 'list' mode */}
          {viewMode === 'list' && (
            <div className="mt-4">
              <GenericStepsList 
                steps={steps} 
                animationCompleted={animationCompleted}
                algorithmName="String Matching"
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <StatsPanel stats={{ 
            'kecepatan': 'O(n)',
            'memori': 'O(1)',
            'terbaik': 'O(1)',
            'terburuk': 'O(n)'
          }} />
          
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 mt-4">
            <h3 className="text-base font-black uppercase tracking-tight mb-3 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-brutal-primary" />
              Cara Kerja
            </h3>
            <ol className="text-sm space-y-3 font-bold">
              <li className="flex gap-2">
                <span className="text-brutal-warning">1.</span>
                <span>Mulai dari index 0</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-warning">2.</span>
                <span>Bandingkan nilai dengan target</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-warning">3.</span>
                <span>Jika sama, tandai sebagai ditemukan</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-warning">4.</span>
                <span>Lanjut ke index berikutnya</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-warning">5.</span>
                <span>Ulangi sampai akhir array</span>
              </li>
            </ol>
          </div>

          <div className="card-brutal bg-brutal-success dark:bg-brutal-dark p-4 mt-4">
            <h3 className="text-base font-black uppercase tracking-tight mb-2 text-white flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              Keuntungan
            </h3>
            <ul className="text-sm space-y-2 font-bold text-white">
              <li>✓ Paling sederhana</li>
              <li>✓ Tidak perlu data terurut</li>
              <li>✓ Menemukan semua kemunculan</li>
            </ul>
          </div>

          <div className="card-brutal bg-brutal-danger dark:bg-brutal-dark p-4 mt-4">
            <h3 className="text-base font-black uppercase tracking-tight mb-2 text-white flex items-center gap-2">
              <XCircleIcon className="w-5 h-5" />
              Kekurangan
            </h3>
            <ul className="text-sm space-y-2 font-bold text-white">
              <li>✗ Lambat untuk data besar</li>
              <li>✗ Harus cek semua elemen</li>
              <li>✗ Tidak efisien O(n)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
