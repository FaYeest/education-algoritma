import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSpeed } from '../../../context/SpeedContext'
import { generateRandomArray } from '../../../utils/arrayHelpers'
import PlaybackControls from '../../Common/PlaybackControls'
import StatsPanel from '../../Common/StatsPanel'
import GenericStepsList from '../../Common/GenericStepsList'
import { API_BASE_URL } from '../../../config/api'
import { 
  BoltIcon, 
  ChartBarIcon, 
  ArrowsRightLeftIcon,
  ArrowDownIcon,
  ScissorsIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  PlayIcon
} from '@heroicons/react/24/solid'

export default function DivideConquerViz() {
  const [array, setArray] = useState(generateRandomArray(8))
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTree, setShowTree] = useState(false)
  const [viewMode, setViewMode] = useState('step')
  const [isLoadingSteps, setIsLoadingSteps] = useState(false)
  const [animationCompleted, setAnimationCompleted] = useState(false)
  const { speed, setSpeed, getDelay } = useSpeed()

  const fetchSteps = async () => {
    setIsLoadingSteps(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/algorithms/divide-conquer/merge-sort`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array })
      })
      const data = await res.json()
      setSteps(data.steps || [])
      setCurrentStep(0)
      setAnimationCompleted(false)
      return data.steps || []
    } catch (error) {
      console.error('Failed to fetch merge sort steps:', error)
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
    setArray(generateRandomArray(8))
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

  const currentStepData = steps[currentStep] || { action: 'idle', array, message: 'Tekan Play untuk mulai!' }

  const getBarColor = (index) => {
    const step = currentStepData
    if (!step || !step.action) return 'bg-brutal-secondary'
    
    if (step.action === 'divide') {
      if (index >= step.left && index <= step.mid) return 'bg-brutal-warning'
      if (index > step.mid && index <= step.right) return 'bg-brutal-cyan'
    }
    
    if (step.action === 'merge_compare' || step.action === 'merge_remaining') {
      if (index === step.placing) return 'bg-brutal-success'
      if (step.comparing?.includes(index)) return 'bg-brutal-warning'
    }
    
    if (step.action === 'merge_complete') {
      if (index >= step.left && index <= step.right) return 'bg-brutal-success'
    }
    
    if (step.action === 'complete') return 'bg-brutal-success'
    
    return 'bg-brutal-secondary'
  }

  const displayArray = currentStepData.array || array
  const maxValue = Math.max(...displayArray, 1)

  const getStepTitle = () => {
    const action = currentStepData.action
    if (action === 'divide') return (
      <span className="flex items-center gap-2">
        <ScissorsIcon className="w-5 h-5" />
        MEMECAH
      </span>
    )
    if (action === 'merge_start') return (
      <span className="flex items-center gap-2">
        <ArrowPathIcon className="w-5 h-5" />
        MULAI GABUNG
      </span>
    )
    if (action === 'merge_compare') return (
      <span className="flex items-center gap-2">
        <MagnifyingGlassIcon className="w-5 h-5" />
        MEMBANDINGKAN
      </span>
    )
    if (action === 'merge_remaining') return (
      <span className="flex items-center gap-2">
        <PlusCircleIcon className="w-5 h-5" />
        MENAMBAH SISA
      </span>
    )
    if (action === 'merge_complete') return (
      <span className="flex items-center gap-2">
        <CheckCircleIcon className="w-5 h-5" />
        SELESAI GABUNG
      </span>
    )
    if (action === 'complete') return (
      <span className="flex items-center gap-2">
        <CheckCircleIcon className="w-5 h-5" />
        SORTING SELESAI!
      </span>
    )
    return (
      <span className="flex items-center gap-2">
        <PlayIcon className="w-5 h-5" />
        SIAP MULAI
      </span>
    )
  }

  const getStepExplanation = () => {
    const action = currentStepData.action
    if (action === 'divide') {
      return 'Memecah array menjadi 2 bagian: KIRI (kuning) dan KANAN (biru)'
    }
    if (action === 'merge_start') {
      return 'Siap menggabungkan 2 bagian yang sudah terurut'
    }
    if (action === 'merge_compare') {
      return 'Bandingkan kedua angka, pilih yang lebih kecil untuk diletakkan'
    }
    if (action === 'merge_remaining') {
      return 'Tambahkan sisa angka yang belum terpakai'
    }
    if (action === 'merge_complete') {
      return 'Bagian ini sudah terurut dengan benar!'
    }
    if (action === 'complete') {
      return 'Semua angka sudah terurut dari kecil ke besar!'
    }
    return 'Klik tombol Play untuk melihat cara kerja Merge Sort!'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          Divide & Conquer
        </h1>
        <p className="text-lg sm:text-xl font-bold text-brutal-primary mt-2 flex items-center gap-2">
          <ChartBarIcon className="w-6 h-6" />
          PECAH LALU GABUNGKAN!
        </p>
        <p className="text-sm sm:text-base font-bold uppercase mt-2 opacity-80">
          Bagi masalah jadi kecil-kecil, selesaikan, lalu gabungkan!
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            setArray(generateRandomArray(8))
            setSteps([])
            setCurrentStep(0)
            setIsPlaying(false)
          }}
          className="btn-brutal px-4 py-2 bg-brutal-warning text-black font-black uppercase flex items-center gap-2"
        >
          <ArrowsRightLeftIcon className="w-5 h-5" />
          Acak Angka
        </button>
        <button
          onClick={() => setShowTree(!showTree)}
          className="btn-brutal px-4 py-2 bg-brutal-cyan text-black font-black uppercase flex items-center gap-2"
        >
          {showTree ? <ChartBarIcon className="w-5 h-5" /> : <ChartBarIcon className="w-5 h-5" />}
          {showTree ? 'Lihat Bar' : 'Lihat Pohon'}
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
        <p className="text-xs font-bold uppercase mt-2 opacity-70">
          Delay: {Math.round(getDelay())}ms per step
        </p>
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
          {/* Main Visual */}
          <div className="card-brutal bg-white dark:bg-black p-6 min-h-[400px]">
            <AnimatePresence mode="wait">
              {!showTree ? (
                <motion.div
                  key="bar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end justify-center gap-2 h-80"
                >
                  {displayArray.map((value, index) => {
                    const height = (value / maxValue) * 100
                    return (
                      <motion.div
                        key={`${index}-${value}`}
                        className="flex flex-col items-center flex-1 max-w-[60px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <motion.div
                          className={`w-full border-3 border-black dark:border-brutal-bg ${getBarColor(index)} transition-colors relative`}
                          style={{ height: `${height}%`, minHeight: '30px' }}
                          animate={{
                            scale: currentStepData.placing === index ? 1.15 : 1,
                          }}
                          transition={{ duration: 0.3, type: "spring" }}
                        >
                          {currentStepData.placing === index && (
                            <motion.div
                              className="absolute -top-8 left-1/2 -translate-x-1/2"
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                            >
                              <ArrowDownIcon className="w-6 h-6 text-brutal-success" />
                            </motion.div>
                          )}
                        </motion.div>
                        <span className="text-sm sm:text-base font-black mt-2">{value}</span>
                      </motion.div>
                    )
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="tree"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-80 flex items-center justify-center"
                >
                  <div className="text-center">
                    <ChartBarIcon className="w-24 h-24 mx-auto mb-4 text-brutal-primary" />
                    <p className="font-black text-xl uppercase">Visualisasi Pohon</p>
                    <p className="font-bold text-sm mt-2 opacity-80">Coming Soon!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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

          {/* Step Info - Lebih User Friendly */}
          {steps.length === 0 ? (
            <div className="card-brutal bg-brutal-primary text-white p-6 mt-4 text-center">
              <div className="space-y-3">
                <ScissorsIcon className="w-12 h-12 mx-auto" />
                <p className="text-xl font-black uppercase">
                  Klik PLAY untuk Memulai!
                </p>
                <p className="text-sm font-bold opacity-90">
                  Merge Sort akan memecah lalu menggabungkan
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
                  currentStepData.action === 'divide' ? 'bg-brutal-warning text-black' :
                  currentStepData.action?.startsWith('merge') ? 'bg-brutal-cyan text-black' :
                  currentStepData.action === 'complete' ? 'bg-brutal-success text-white' :
                  'bg-brutal-secondary text-black'
                }`}>
                  {getStepTitle()}
                </div>
              </div>
              
              <div className="font-bold text-base sm:text-lg leading-relaxed">
                {getStepExplanation()}
              </div>

              {/* Show LEFT and RIGHT with visual boxes */}
              {currentStepData.left_part && currentStepData.right_part && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <motion.div 
                    className="p-4 border-3 border-black dark:border-brutal-bg bg-brutal-warning"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <p className="text-xs font-black mb-2 flex items-center gap-2">
                      <ArrowsRightLeftIcon className="w-4 h-4" />
                      KIRI
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {currentStepData.left_part.map((num, i) => (
                        <span key={i} className="px-3 py-1 bg-white border-2 border-black font-black text-lg">
                          {num}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div 
                    className="p-4 border-3 border-black dark:border-brutal-bg bg-brutal-cyan"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <p className="text-xs font-black mb-2 flex items-center gap-2">
                      <ArrowsRightLeftIcon className="w-4 h-4" />
                      KANAN
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {currentStepData.right_part.map((num, i) => (
                        <span key={i} className="px-3 py-1 bg-white border-2 border-black font-black text-lg">
                          {num}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* All Steps List - Only shown in 'list' mode */}
          {viewMode === 'list' && (
            <div className="mt-4">
              <GenericStepsList 
                steps={steps} 
                animationCompleted={animationCompleted}
                algorithmName="Merge Sort"
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <StatsPanel stats={{ 
            'kecepatan': 'O(n log n)',
            'memori': 'O(n)',
            'cocok untuk': 'Array besar'
          }} />
          
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 mt-4">
            <h3 className="text-base font-black uppercase tracking-tight mb-3">📚 Cara Kerja</h3>
            <ol className="text-sm space-y-3 font-bold">
              <li className="flex gap-2">
                <span className="text-brutal-warning">1.</span>
                <span>Pecah array jadi 2 bagian terus sampai tinggal 1 angka</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-cyan">2.</span>
                <span>Gabungkan 2 bagian sambil mengurutkan</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-success">3.</span>
                <span>Ulangi sampai semua bagian tergabung!</span>
              </li>
            </ol>
          </div>

          <div className="card-brutal bg-brutal-warning dark:bg-brutal-dark p-4 mt-4">
            <h3 className="text-base font-black uppercase tracking-tight mb-2">💡 Tips</h3>
            <p className="text-sm font-bold leading-relaxed">
              Perhatikan warna bar! <span className="text-brutal-warning bg-black px-1">Kuning</span> = kiri, 
              <span className="text-brutal-cyan bg-black px-1 mx-1">Biru</span> = kanan, 
              <span className="text-brutal-success bg-black px-1">Hijau</span> = sudah terurut!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
