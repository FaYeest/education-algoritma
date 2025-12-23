import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { generateRandomArray } from '../../../utils/arrayHelpers'
import { useSpeed } from '../../../context/SpeedContext'
import PlaybackControls from '../../Common/PlaybackControls'
import StatsPanel from '../../Common/StatsPanel'
import AllStepsList from '../../Common/AllStepsList'
import { API_BASE_URL } from '../../../config/api'
import { 
  BoltIcon,
  ArrowsUpDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ListBulletIcon,
  PlayIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/solid'

export default function SortingViz() {
  const [array, setArray] = useState(generateRandomArray(15))
  const [algorithm, setAlgorithm] = useState('bubble')
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [comparing, setComparing] = useState([])
  const [swapped, setSwapped] = useState([])
  const [sorted, setSorted] = useState([])
  const [viewMode, setViewMode] = useState('step') // 'step' or 'list'
  const [isLoadingSteps, setIsLoadingSteps] = useState(false)
  const [animationCompleted, setAnimationCompleted] = useState(false) // Track if animation finished
  const { speed, setSpeed, getDelay } = useSpeed()

  const algorithms = {
    bubble: { 
      name: 'Bubble Sort', 
      time: 'O(n²)',
      description: 'Membandingkan pasangan elemen bersebelahan dan menukarnya jika urutannya salah',
      best: 'O(n)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    selection: { 
      name: 'Selection Sort', 
      time: 'O(n²)',
      description: 'Mencari elemen terkecil dan menukarnya dengan elemen di posisi awal',
      best: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    insertion: { 
      name: 'Insertion Sort', 
      time: 'O(n²)',
      description: 'Memasukkan setiap elemen ke posisi yang tepat dalam bagian yang sudah terurut',
      best: 'O(n)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
  }

  const fetchSteps = async () => {
    setIsLoadingSteps(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/algorithms/sorting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, array })
      })
      const data = await res.json()
      setSteps(data.steps || [])
      setCurrentStep(0)
      setComparing([])
      setSwapped([])
      setSorted([])
      return data.steps || []
    } catch (error) {
      console.error('Failed to fetch sorting steps:', error)
      return []
    } finally {
      setIsLoadingSteps(false)
    }
  }

  const handlePlay = async () => {
    if (steps.length === 0) {
      setIsPlaying(true) // Set loading state
      const newSteps = await fetchSteps()
      if (newSteps.length > 0) {
        setIsPlaying(true)
      } else {
        setIsPlaying(false)
      }
    } else {
      setIsPlaying(true)
    }
  }

  const handlePause = () => setIsPlaying(false)

  const handleReset = (keepArray = false) => {
    setIsPlaying(false)
    setCurrentStep(0)
    setSteps([])
    setComparing([])
    setSwapped([])
    setSorted([])
    setAnimationCompleted(false)
    if (!keepArray) {
      setArray(generateRandomArray(array.length))
    }
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
    setIsPlaying(false)
    setCurrentStep(0)
    setSteps([])
    setComparing([])
    setSwapped([])
    setSorted([])
    setAnimationCompleted(false)
  }

  const handleAlgorithmChange = (newAlgo) => {
    setAlgorithm(newAlgo)
    setIsPlaying(false)
    setSteps([])
    setCurrentStep(0)
    setComparing([])
    setSwapped([])
    setSorted([])
    setAnimationCompleted(false)
  }

  const handleArraySizeChange = (newSize) => {
    const size = Number(newSize)
    setIsPlaying(false)
    setCurrentStep(0)
    setSteps([])
    setComparing([])
    setSwapped([])
    setSorted([])
    setAnimationCompleted(false)
    setArray(generateRandomArray(size))
  }

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      if (currentStep < steps.length - 1) {
        const timer = setTimeout(() => {
          setCurrentStep(prev => prev + 1)
        }, getDelay())
        return () => clearTimeout(timer)
      } else {
        // Animation completed - sorting finished
        setIsPlaying(false)
        setAnimationCompleted(true) // Mark animation as completed
        // Mark all as sorted at the end
        setSorted(array.map((_, i) => i))
      }
    }
  }, [isPlaying, currentStep, steps, getDelay, array])

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep]
      setArray(step.array || array)
      setComparing(step.comparing || [])
      setSwapped(step.swapped || [])
      setSorted(step.sorted || [])
    }
  }, [currentStep, steps])

  const currentStepData = steps[currentStep] || {}

  const getStepExplanation = () => {
    if (currentStep === steps.length - 1) {
      return (
        <span className="flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-brutal-success" />
          Sorting selesai! Array sudah terurut dari kecil ke besar.
        </span>
      )
    }
    
    const step = currentStepData
    if (step.swapped && step.swapped.length > 0) {
      return (
        <span className="flex items-center gap-2">
          <ArrowsRightLeftIcon className="w-5 h-5 text-brutal-danger" />
          Menukar elemen di index {step.swapped.join(' dan ')}
        </span>
      )
    }
    if (step.comparing && step.comparing.length > 0) {
      return (
        <span className="flex items-center gap-2">
          <MagnifyingGlassIcon className="w-5 h-5 text-brutal-warning" />
          Membandingkan elemen di index {step.comparing.join(' dan ')}
        </span>
      )
    }
    return 'Klik Play untuk memulai sorting!'
  }

  const getTotalComparisons = () => {
    return steps.filter(s => s.comparing && s.comparing.length > 0).length
  }

  const getTotalSwaps = () => {
    return steps.filter(s => s.swapped && s.swapped.length > 0).length
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          Sorting Algorithms
        </h1>
        <p className="text-lg sm:text-xl font-bold text-brutal-primary mt-2 flex items-center gap-2">
          <ArrowsUpDownIcon className="w-6 h-6" />
          URUTKAN DARI KECIL KE BESAR!
        </p>
        <p className="text-sm sm:text-base font-bold uppercase mt-2 opacity-80">
          {algorithms[algorithm].description}
        </p>
      </div>

      {/* Algorithm Selection */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <label className="font-black uppercase text-sm block mb-3 flex items-center gap-2">
          <ArrowPathIcon className="w-5 h-5 text-brutal-primary" />
          Pilih Algoritma:
        </label>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(algorithms).map((key) => (
            <button
              key={key}
              onClick={() => handleAlgorithmChange(key)}
              className={`btn-brutal px-4 py-2 text-sm font-black uppercase transition-colors ${
                algorithm === key
                  ? 'bg-brutal-primary text-white'
                  : 'bg-white dark:bg-black hover:bg-brutal-secondary'
              }`}
            >
              {algorithms[key].name}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode Toggle */}
      {/* <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <label className="font-black uppercase text-sm block mb-3">
          Mode Tampilan:
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('step')}
            className={`btn-brutal px-6 py-3 text-sm font-black uppercase transition-colors flex items-center gap-2 ${
              viewMode === 'step'
                ? 'bg-brutal-primary text-white'
                : 'bg-white dark:bg-black hover:bg-brutal-secondary'
            }`}
          >
            <PlayIcon className="w-5 h-5" />
            STEP-BY-STEP
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`btn-brutal px-6 py-3 text-sm font-black uppercase transition-colors flex items-center gap-2 ${
              viewMode === 'list'
                ? 'bg-brutal-primary text-white'
                : 'bg-white dark:bg-black hover:bg-brutal-secondary'
            }`}
          >
            <ListBulletIcon className="w-5 h-5" />
            LIHAT SEMUA STEP
          </button>
        </div>
        <p className="text-xs font-bold uppercase mt-2 opacity-70">
          {viewMode === 'step' 
            ? 'Mode animasi step-by-step dengan kontrol playback'
            : 'Lihat semua step sekaligus dalam daftar lengkap'}
        </p>
      </div> */}

      {/* Array Size Control */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <label className="font-black uppercase text-sm block mb-2 flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5 text-brutal-primary" />
          Jumlah Elemen: {array.length}
        </label>
        <input
          type="range"
          min="5"
          max="25"
          value={array.length}
          onChange={(e) => handleArraySizeChange(e.target.value)}
          className="slider-brutal w-full"
        />
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

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Main Visualization */}
          <div className="card-brutal bg-white dark:bg-black p-6 min-h-[400px]">
            <div className="space-y-6">
              {/* Array Visualization */}
              <div className="flex gap-2 items-end justify-center h-72 border-3 border-black dark:border-brutal-bg p-4 bg-brutal-bg dark:bg-gray-900 overflow-x-auto">
                {array.map((value, index) => {
                  const isComparing = comparing.includes(index)
                  const isSwapped = swapped.includes(index)
                  const isSorted = sorted.includes(index)
                  
                  return (
                    <motion.div
                      key={`${index}-${value}`}
                      className="flex flex-col items-center flex-shrink-0"
                      layout
                      transition={{ 
                        type: "spring", 
                        stiffness: 300,
                        damping: 25
                      }}
                      animate={{
                        scale: isSwapped ? 1.15 : isComparing ? 1.1 : 1,
                      }}
                    >
                      {/* Indicator icon */}
                      {isSwapped && (
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="mb-2"
                        >
                          <ArrowsUpDownIcon className="w-5 h-5 text-brutal-danger" />
                        </motion.div>
                      )}
                      
                      {/* Bar */}
                      <div
                        className={`w-8 sm:w-10 border-3 border-black dark:border-brutal-bg transition-colors ${
                          isSorted
                            ? 'bg-brutal-success'
                            : isSwapped
                            ? 'bg-brutal-danger'
                            : isComparing
                            ? 'bg-brutal-warning'
                            : 'bg-brutal-cyan'
                        }`}
                        style={{ height: `${Math.max(value * 2, 20)}px`, minHeight: '20px' }}
                      />
                      
                      {/* Value label */}
                      <span className="text-xs mt-2 font-black dark:text-white">
                        {value}
                      </span>
                      
                      {/* Index label */}
                      <span className="text-[10px] font-bold opacity-50 dark:text-white">
                        [{index}]
                      </span>
                      
                      {/* Checkmark for sorted */}
                      {isSorted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, delay: 0.05 * index }}
                        >
                          <CheckCircleIcon className="w-5 h-5 text-brutal-success mt-1" />
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-3 text-center">
                  <p className="text-xs font-bold uppercase opacity-70">Langkah</p>
                  <p className="text-2xl font-black text-brutal-primary">{currentStep + 1}</p>
                </div>
                <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-3 text-center">
                  <p className="text-xs font-bold uppercase opacity-70">Perbandingan</p>
                  <p className="text-2xl font-black text-brutal-warning">{getTotalComparisons()}</p>
                </div>
                <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-3 text-center">
                  <p className="text-xs font-bold uppercase opacity-70">Pertukaran</p>
                  <p className="text-2xl font-black text-brutal-danger">{getTotalSwaps()}</p>
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
                <ArrowsUpDownIcon className="w-12 h-12 mx-auto" />
                <p className="text-xl font-black uppercase">
                  Klik PLAY untuk Memulai!
                </p>
                <p className="text-sm font-bold opacity-90">
                  {algorithms[algorithm].name} akan mengurutkan array
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
                    <div className={`px-3 py-1 border-3 border-black dark:border-brutal-bg font-black text-sm ${
                      currentStep === steps.length - 1
                        ? 'bg-brutal-success text-white'
                        : swapped.length > 0
                        ? 'bg-brutal-danger text-white'
                        : comparing.length > 0
                        ? 'bg-brutal-warning text-black'
                        : 'bg-brutal-secondary text-black'
                    }`}>
                      {currentStep === steps.length - 1 ? 'SELESAI' : swapped.length > 0 ? 'MENUKAR' : comparing.length > 0 ? 'MEMBANDINGKAN' : 'LEWATI'}
                    </div>
                  </div>
                  
                  <div className="font-bold text-base sm:text-lg leading-relaxed">
                    {getStepExplanation()}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Legend - Only show in step mode */}
          {viewMode === 'step' && steps.length > 0 && (
            <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 mt-4">
              <h3 className="text-sm font-black uppercase mb-3">Penjelasan Warna:</h3>
              <div className="grid grid-cols-2 gap-3 text-sm font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-brutal-cyan border-2 border-black dark:border-brutal-bg"></div>
                  <span>Belum Diproses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-brutal-warning border-2 border-black dark:border-brutal-bg"></div>
                  <span>Sedang Dibandingkan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-brutal-danger border-2 border-black dark:border-brutal-bg"></div>
                  <span>Sedang Ditukar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-brutal-success border-2 border-black dark:border-brutal-bg"></div>
                  <span>Sudah Terurut</span>
                </div>
              </div>
            </div>
          )}

          {/* All Steps List - Only shown in 'list' mode */}
          {viewMode === 'list' && steps.length > 0 && (
            <div className="mt-4">
              <AllStepsList 
                steps={steps} 
                onGenerateSteps={fetchSteps}
                isLoading={isLoadingSteps}
                animationCompleted={animationCompleted}
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-4">
          {/* Stats */}
          <StatsPanel stats={{ 
            'Kompleksitas': algorithms[algorithm].time,
            'Terbaik': algorithms[algorithm].best,
            'Terburuk': algorithms[algorithm].worst,
            'Memori': algorithms[algorithm].space
          }} />
          
          {/* Tentang Algoritma */}
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
            <h3 className="text-sm font-black uppercase tracking-tight mb-2 flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4 text-brutal-primary" />
              Tentang {algorithms[algorithm].name}
            </h3>
            <p className="text-xs font-bold leading-relaxed">
              {algorithms[algorithm].description}
            </p>
          </div>

          {/* Cara Kerja - Dynamic based on algorithm */}
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
            <h3 className="text-sm font-black uppercase tracking-tight mb-2 flex items-center gap-2">
              <ArrowPathIcon className="w-4 h-4 text-brutal-primary" />
              Cara Kerja
            </h3>
            {algorithm === 'bubble' && (
              <ol className="text-xs space-y-2 font-bold">
                <li className="flex gap-2">
                  <span className="text-brutal-warning font-black min-w-[16px]">1.</span>
                  <span>Bandingkan 2 elemen bersebelahan</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brutal-warning font-black min-w-[16px]">2.</span>
                  <span>Tukar jika urutan salah</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brutal-success font-black min-w-[16px]">3.</span>
                  <span>Ulangi sampai tidak ada swap</span>
                </li>
              </ol>
            )}
            {algorithm === 'selection' && (
              <ol className="text-xs space-y-2 font-bold">
                <li className="flex gap-2">
                  <span className="text-brutal-warning font-black min-w-[16px]">1.</span>
                  <span>Cari elemen terkecil</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brutal-warning font-black min-w-[16px]">2.</span>
                  <span>Tukar dengan posisi awal</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brutal-success font-black min-w-[16px]">3.</span>
                  <span>Ulangi untuk sisa array</span>
                </li>
              </ol>
            )}
            {algorithm === 'insertion' && (
              <ol className="text-xs space-y-2 font-bold">
                <li className="flex gap-2">
                  <span className="text-brutal-warning font-black min-w-[16px]">1.</span>
                  <span>Ambil elemen dari kanan</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brutal-warning font-black min-w-[16px]">2.</span>
                  <span>Sisipkan ke posisi yang tepat</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brutal-success font-black min-w-[16px]">3.</span>
                  <span>Ulangi sampai selesai</span>
                </li>
              </ol>
            )}
          </div>

          {/* Pros & Cons */}
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
            <div className="mb-3">
              <h3 className="text-sm font-black uppercase tracking-tight mb-2 text-brutal-success flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                Keuntungan
              </h3>
              <ul className="text-xs space-y-1 font-bold">
                <li className="flex items-center gap-1">
                  <span className="text-brutal-success">✓</span>
                  <span>Mudah dipahami & diimplementasi</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-brutal-success">✓</span>
                  <span>Tidak butuh memori ekstra</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-brutal-success">✓</span>
                  <span>Baik untuk data kecil</span>
                </li>
              </ul>
            </div>

            <div className="border-t-2 border-black dark:border-brutal-bg my-3"></div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-tight mb-2 text-brutal-danger flex items-center gap-2">
                <XCircleIcon className="w-4 h-4" />
                Kekurangan
              </h3>
              <ul className="text-xs space-y-1 font-bold">
                <li className="flex items-center gap-1">
                  <span className="text-brutal-danger">✗</span>
                  <span>Lambat untuk data besar O(n²)</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-brutal-danger">✗</span>
                  <span>Banyak perbandingan berulang</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-brutal-danger">✗</span>
                  <span>Tidak efisien dibanding Merge/Quick</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
