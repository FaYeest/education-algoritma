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
  PlayIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  XCircleIcon
} from '@heroicons/react/24/solid'

export default function DivideConquerViz() {
  const [array, setArray] = useState(generateRandomArray(8))
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
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
  // Dynamic max value - always relative to largest number in current array
  const maxValue = Math.max(...displayArray, 1)

  console.log('DivideConquer Debug:', { 
    stepsLength: steps.length, 
    displayArray, 
    currentStepData,
    maxValue
  })

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

      {/* Interactive Input Section - REMOVE THIS */}
      {/* Moved to Main Visual */}

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

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Main Visual */}
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-6 min-h-[400px]">
            {/* Interactive Input - Above Visualization */}
            <div className="mb-6 pb-6 border-b-3 border-black dark:border-brutal-bg">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Input Field */}
                <div className="flex-1">
                  <label className="text-xs font-black uppercase opacity-70 block mb-2">
                    Masukkan Array Kustom
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 8, 3, 5, 1, 9, 2"
                    className="w-full px-4 py-2 border-3 border-black dark:border-brutal-bg font-bold text-sm
                               bg-brutal-bg dark:bg-gray-900
                               focus:outline-none focus:ring-2 focus:ring-brutal-primary"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target.value.trim()
                        if (input) {
                          const numbers = input
                            .split(/[,\s]+/)
                            .map(n => parseInt(n.trim()))
                            .filter(n => !isNaN(n) && n >= 1 && n <= 100)
                          
                          if (numbers.length >= 2 && numbers.length <= 20) {
                            setArray(numbers)
                            setSteps([])
                            setCurrentStep(0)
                            setIsPlaying(false)
                            setAnimationCompleted(false)
                            e.target.value = ''
                          } else {
                            alert('Masukkan 2-20 angka antara 1-100!')
                          }
                        }
                      }
                    }}
                  />
                  <p className="text-xs font-bold mt-1 opacity-60">
                    Tekan ENTER • 2-20 angka • Range 1-100
                  </p>
                </div>

                {/* Preset Buttons */}
                <div className="sm:w-auto">
                  <label className="text-xs font-black uppercase opacity-70 block mb-2">
                    Preset Cepat
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setArray([5, 2, 8, 1, 9])
                        handleReset()
                      }}
                      className="btn-brutal px-3 py-1 bg-brutal-bg dark:bg-gray-900 font-black text-xs"
                      title="Array kecil 5 elemen"
                    >
                      Kecil
                    </button>
                    <button
                      onClick={() => {
                        setArray([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
                        handleReset()
                      }}
                      className="btn-brutal px-3 py-1 bg-brutal-danger text-white font-black text-xs"
                      title="Worst case - descending"
                    >
                      Terburuk
                    </button>
                    <button
                      onClick={() => {
                        setArray([1, 2, 3, 4, 5, 6, 7, 8])
                        handleReset()
                      }}
                      className="btn-brutal px-3 py-1 bg-brutal-success text-white font-black text-xs"
                      title="Best case - already sorted"
                    >
                      Terbaik
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Array Display - Compact */}
              <div className="mt-3 p-2 bg-brutal-primary bg-opacity-10 border-2 border-brutal-primary inline-block">
                <span className="text-xs font-black uppercase text-brutal-primary mr-2">Array:</span>
                <span className="font-black text-sm">[{array.join(', ')}]</span>
                <span className="text-xs font-bold opacity-60 ml-2">({array.length} elemen)</span>
              </div>
            </div>

            {/* Visualization */}
            <div className="flex items-end justify-center gap-2 h-80">
              {displayArray.map((value, index) => {
                const heightPercentage = (value / maxValue) * 100
                
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
                      style={{ 
                        height: `${heightPercentage}%`,
                        minHeight: '40px'
                      }}
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
            <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-6 mt-4 space-y-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-3 pb-4 border-b-3 border-black dark:border-brutal-bg">
                <span className="font-black uppercase text-sm whitespace-nowrap">Mode:</span>
                <div className="flex gap-2 flex-1">
                  <button
                    onClick={() => setViewMode('step')}
                    className={`btn-brutal px-3 py-2 font-black uppercase text-xs flex-1 transition-all flex items-center justify-center gap-2 ${
                      viewMode === 'step'
                        ? 'bg-brutal-primary text-white'
                        : 'bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ViewColumnsIcon className="w-4 h-4" />
                    Step
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`btn-brutal px-3 py-2 font-black uppercase text-xs flex-1 transition-all flex items-center justify-center gap-2 ${
                      viewMode === 'list'
                        ? 'bg-brutal-primary text-white'
                        : 'bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ListBulletIcon className="w-4 h-4" />
                    List
                  </button>
                </div>
              </div>

              {/* Step Content - only show in step mode */}
              {viewMode === 'step' && (
                <>
                  <div className="flex items-center justify-between">
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
                </>
              )}
            </div>
          )}

          {/* All Steps List - Only shown in 'list' mode */}
          {viewMode === 'list' && steps.length > 0 && (
            <div className="mt-4">
              <GenericStepsList 
                steps={steps} 
                animationCompleted={animationCompleted}
                algorithmName="Merge Sort (Divide & Conquer)"
              />
            </div>
          )}
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
        <div className="lg:col-span-1 space-y-4">
          {/* Stats */}
          <StatsPanel stats={{ 
            'kecepatan': 'O(n log n)',
            'memori': 'O(n)',
            'terbaik': 'O(n log n)',
            'terburuk': 'O(n log n)'
          }} />
          
          {/* Cara Kerja */}
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
            <h3 className="text-sm font-black uppercase tracking-tight mb-2 flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4 text-brutal-primary" />
              Cara Kerja
            </h3>
            <ol className="text-xs space-y-2 font-bold">
              <li className="flex gap-2">
                <span className="text-brutal-warning font-black min-w-[16px]">1.</span>
                <span>Pecah array jadi 2 bagian</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-warning font-black min-w-[16px]">2.</span>
                <span>Pecah lagi sampai 1 elemen</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-cyan font-black min-w-[16px]">3.</span>
                <span>Gabungkan sambil urutkan</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brutal-success font-black min-w-[16px]">4.</span>
                <span>Ulangi sampai semua gabung</span>
              </li>
            </ol>
          </div>

          {/* Pros & Cons Combined */}
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
            {/* Keuntungan */}
            <div className="mb-3">
              <h3 className="text-sm font-black uppercase tracking-tight mb-2 text-brutal-success flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                Keuntungan
              </h3>
              <ul className="text-xs space-y-1 font-bold">
                <li className="flex items-center gap-1">
                  <span className="text-brutal-success">✓</span>
                  <span>Cepat O(n log n)</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-brutal-success">✓</span>
                  <span>Stabil (urutan relatif tetap)</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-brutal-success">✓</span>
                  <span>Cocok untuk data besar</span>
                </li>
              </ul>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-black dark:border-brutal-bg my-3"></div>

            {/* Kekurangan */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight mb-2 text-brutal-danger flex items-center gap-2">
                <XCircleIcon className="w-4 h-4" />
                Kekurangan
              </h3>
              <ul className="text-xs space-y-1 font-bold">
                <li className="flex items-center gap-1">
                  <span className="text-brutal-danger">✗</span>
                  <span>Butuh memori ekstra O(n)</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-brutal-danger">✗</span>
                  <span>Lebih kompleks dari Bubble Sort</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-brutal-danger">✗</span>
                  <span>Tidak in-place sorting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
