import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSpeed } from '../../../context/SpeedContext'
import PlaybackControls from '../../Common/PlaybackControls'
import StatsPanel from '../../Common/StatsPanel'
import GreedyStepsList from '../../Common/GreedyStepsList'
import { API_BASE_URL } from '../../../config/api'
import { 
  BoltIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  PlusCircleIcon
} from '@heroicons/react/24/solid'

export default function GreedyViz() {
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [viewMode, setViewMode] = useState('step') // 'step' or 'list'
  const [isLoadingSteps, setIsLoadingSteps] = useState(false)
  const [animationCompleted, setAnimationCompleted] = useState(false)
  const { speed, setSpeed, getDelay } = useSpeed()

  // Coin Change State
  const [amount, setAmount] = useState(63)
  const [coinResult, setCoinResult] = useState({})
  
  // Dynamic coin denominations based on amount
  const getOptimalCoins = (targetAmount) => {
    if (targetAmount <= 10) return [5, 2, 1]
    if (targetAmount <= 25) return [10, 5, 2, 1]
    if (targetAmount <= 50) return [25, 10, 5, 1]
    if (targetAmount <= 75) return [50, 25, 10, 5, 1]
    return [100, 50, 25, 10, 5, 1] // For amounts > 75
  }
  
  const [coins, setCoins] = useState(getOptimalCoins(63))

  // Update coins when amount changes
  useEffect(() => {
    const newCoins = getOptimalCoins(amount)
    if (JSON.stringify(newCoins) !== JSON.stringify(coins)) {
      setCoins(newCoins)
      setSteps([])
      setCurrentStep(0)
      setCoinResult({})
    }
  }, [amount])

  const fetchSteps = async () => {
    setIsLoadingSteps(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/algorithms/greedy/coin-change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coins, amount })
      })
      const data = await res.json()
      setSteps(data.steps || [])
      setCoinResult(data.result || {})
      setCurrentStep(0)
      setAnimationCompleted(false)
      return data.steps || []
    } catch (error) {
      console.error('Failed to fetch greedy steps:', error)
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
    setCoinResult({})
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
      }
    }
  }, [isPlaying, currentStep, steps, getDelay])

  const currentStepData = steps[currentStep] || { action: 'idle' }

  const getStepTitle = () => {
    if (currentStepData.action === 'use' || currentStepData.action === 'take') return (
      <span className="flex items-center gap-2">
        <CheckCircleIcon className="w-5 h-5" />
        AMBIL KOIN
      </span>
    )
    if (currentStepData.action === 'skip') return (
      <span className="flex items-center gap-2">
        <XCircleIcon className="w-5 h-5" />
        LEWATI
      </span>
    )
    if (currentStepData.action === 'select') return (
      <span className="flex items-center gap-2">
        <BoltIcon className="w-5 h-5" />
        MEMILIH KOIN
      </span>
    )
    return 'SIAP MULAI'
  }

  const getStepExplanation = () => {
    if (currentStepData.action === 'select') {
      return `Memeriksa koin ${currentStepData.coin}¢. Sisa yang perlu dibayar: ${currentStepData.remaining}¢`
    }
    if (currentStepData.action === 'use' || currentStepData.action === 'take') {
      return (
        <span className="flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-brutal-success" />
          Ambil {currentStepData.count} koin {currentStepData.coin}¢. Sisa: {currentStepData.remaining}¢
        </span>
      )
    }
    if (currentStepData.action === 'skip') {
      return (
        <span className="flex items-center gap-2">
          <XCircleIcon className="w-5 h-5 text-brutal-danger" />
          Koin {currentStepData.coin}¢ terlalu besar, lewati!
        </span>
      )
    }
    return 'Klik Play untuk melihat algoritma Greedy beraksi!'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          Greedy Algorithm
        </h1>
        <p className="text-lg sm:text-xl font-bold text-brutal-success mt-2 flex items-center gap-2">
          <CurrencyDollarIcon className="w-6 h-6" />
          COIN CHANGE PROBLEM
        </p>
        <p className="text-sm sm:text-base font-bold uppercase mt-2 opacity-80">
          Ambil koin terbesar dulu! Paling menguntungkan sekarang!
        </p>
      </div>

      {/* Amount Input */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <label className="font-black uppercase text-sm block mb-2 flex items-center gap-2">
          <CurrencyDollarIcon className="w-5 h-5 text-brutal-primary" />
          Jumlah Uang: {amount}¢
        </label>
        <input
          type="range"
          min="1"
          max="200"
          value={amount}
          onChange={(e) => {
            setAmount(Number(e.target.value))
            setSteps([])
            setCurrentStep(0)
          }}
          className="slider-brutal w-full"
        />
        <p className="text-xs font-bold uppercase mt-2 opacity-70">
          Koin otomatis: {coins.join('¢, ')}¢
        </p>
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
              {/* Coin Visualization */}
              <div className="text-center">
                <p className="text-4xl font-black mb-2">Target: {amount}¢</p>
                <p className="text-sm font-bold uppercase opacity-70">
                  Koin tersedia: {coins.join('¢, ')}¢
                </p>
              </div>

              {/* Coin Stacks */}
              <div className={`grid gap-4 mt-8 ${
                coins.length <= 4 ? 'grid-cols-4' : 
                coins.length === 5 ? 'grid-cols-5' : 
                'grid-cols-6'
              }`}>
                {coins.map((coin) => {
                  const count = coinResult[String(coin)] || 0
                  const isActive = currentStepData.coin === coin
                  
                  return (
                    <motion.div
                      key={coin}
                      className={`p-3 border-3 border-black dark:border-brutal-bg ${
                        isActive && (currentStepData.action === 'use' || currentStepData.action === 'take')
                          ? 'bg-brutal-success scale-110'
                          : isActive && currentStepData.action === 'select'
                          ? 'bg-brutal-warning scale-105'
                          : isActive && currentStepData.action === 'skip'
                          ? 'bg-brutal-danger'
                          : count > 0
                          ? 'bg-brutal-cyan'
                          : 'bg-brutal-secondary'
                      } transition-all`}
                      animate={{
                        scale: isActive ? 1.05 : 1,
                      }}
                    >
                      <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-black mb-2">{coin}¢</p>
                        <div className="flex flex-wrap justify-center gap-1 min-h-[60px]">
                          {Array.from({ length: Math.min(count, 10) }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brutal-warning border-2 border-black flex items-center justify-center text-[8px] sm:text-xs font-black"
                              initial={{ scale: 0, y: -20 }}
                              animate={{ scale: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              {coin}
                            </motion.div>
                          ))}
                          {count > 10 && (
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black text-white border-2 border-black flex items-center justify-center text-[8px] sm:text-xs font-black">
                              +{count - 10}
                            </div>
                          )}
                        </div>
                        <p className="font-black text-base sm:text-lg mt-2">× {count}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>Sisa: {currentStepData.remaining ?? amount}¢</span>
                  <span>Total Koin: {Object.values(coinResult).reduce((a, b) => a + b, 0)}</span>
                </div>
                <div className="h-8 bg-brutal-bg border-3 border-black dark:border-brutal-bg overflow-hidden">
                  <motion.div
                    className="h-full bg-brutal-success"
                    initial={{ width: '0%' }}
                    animate={{
                      width: `${((amount - (currentStepData.remaining ?? amount)) / amount) * 100}%`
                    }}
                  />
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
                <CurrencyDollarIcon className="w-12 h-12 mx-auto" />
                <p className="text-xl font-black uppercase">
                  Klik PLAY untuk Memulai!
                </p>
                <p className="text-sm font-bold opacity-90">
                  Algoritma Greedy akan mencari kombinasi koin terbaik
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
                  currentStepData.action === 'use' || currentStepData.action === 'take'
                    ? 'bg-brutal-success text-white'
                    : currentStepData.action === 'select'
                    ? 'bg-brutal-warning text-black'
                    : currentStepData.action === 'skip'
                    ? 'bg-brutal-danger text-white'
                    : 'bg-brutal-secondary text-black'
                }`}>
                  {getStepTitle()}
                </div>
              </div>
              
              <p className="font-bold text-base sm:text-lg leading-relaxed">
                {getStepExplanation()}
              </p>
            </div>
          )}

          {/* All Steps List - Only shown in 'list' mode */}
          {viewMode === 'list' && (
            <div className="mt-4">
              <GreedyStepsList 
                steps={steps} 
                animationCompleted={animationCompleted}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <StatsPanel stats={{ 
            'kecepatan': 'O(n)',
            'memori': 'O(1)',
            'optimal?': '❌ Tidak selalu'
          }} />
          
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 mt-4">
            <h3 className="text-base font-black uppercase tracking-tight mb-3 flex items-center gap-2">
              <PlusCircleIcon className="w-5 h-5 text-brutal-primary" />
              Cara Kerja
            </h3>
            <ol className="text-sm space-y-3 font-bold">
              <li className="flex gap-2">
                <span className="text-brutal-warning">1.</span>
                <span>Urutkan koin dari terbesar ke terkecil</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-warning">2.</span>
                <span>Ambil koin terbesar yang bisa dipakai</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-warning">3.</span>
                <span>Ulangi sampai sisa = 0</span>
              </li>
            </ol>
          </div>

          <div className="card-brutal bg-brutal-danger dark:bg-brutal-dark p-4 mt-4">
            <h3 className="text-base font-black uppercase tracking-tight mb-2 text-white flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5" />
              Peringatan!
            </h3>
            <p className="text-sm font-bold leading-relaxed text-white">
              Greedy tidak selalu optimal! Contoh: koin [1, 3, 4] dengan target 6¢
            </p>
            <div className="mt-3 space-y-1 text-xs font-bold">
              <p className="bg-white text-black p-2 border-2 border-black flex items-center gap-2">
                <XCircleIcon className="w-4 h-4 text-brutal-danger" />
                Greedy: 4¢ + 1¢ + 1¢ = <strong>3 koin</strong>
              </p>
              <p className="bg-brutal-success text-white p-2 border-2 border-black flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                Optimal: 3¢ + 3¢ = <strong>2 koin</strong>
              </p>
            </div>
          </div>

          <div className="card-brutal bg-brutal-success dark:bg-brutal-dark p-4 mt-4">
            <h3 className="text-base font-black uppercase tracking-tight mb-2 text-white flex items-center gap-2">
              <LightBulbIcon className="w-5 h-5" />
              Kapan Greedy OK?
            </h3>
            <p className="text-sm font-bold leading-relaxed text-white">
              Greedy bekerja optimal untuk sistem koin standar (seperti Rupiah: 1, 2, 5, 10, 20, 50, 100)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
