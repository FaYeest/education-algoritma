import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PathfindingStepsList from '../../Common/PathfindingStepsList'
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  MapIcon,
  CheckCircleIcon,
  BoltIcon,
  InformationCircleIcon,
  SparklesIcon,
  FlagIcon,
  UserIcon,
  FireIcon,
  StarIcon,
  LightBulbIcon
} from '@heroicons/react/24/solid'

// Maze presets - Easy, Medium, Hard
const MAZES = {
  easy: {
    name: 'MUDAH - Jalan Lurus',
    size: 5,
    grid: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ],
    start: { row: 1, col: 1 },
    goal: { row: 3, col: 3 }
  },
  medium: {
    name: 'SEDANG - Labirin',
    size: 7,
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    start: { row: 1, col: 1 },
    goal: { row: 5, col: 5 }
  },
  hard: {
    name: 'SULIT - Maze Rumit',
    size: 9,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    start: { row: 1, col: 1 },
    goal: { row: 7, col: 7 }
  }
}

export default function BFSViz() {
  const [difficulty, setDifficulty] = useState('easy')
  const [maze, setMaze] = useState(MAZES.easy)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(5)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [visited, setVisited] = useState(new Set())
  const [queue, setQueue] = useState([])
  const [currentPos, setCurrentPos] = useState(null)
  const [path, setPath] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [totalCells, setTotalCells] = useState(0)
  const [viewMode, setViewMode] = useState('step')
  const [animationCompleted, setAnimationCompleted] = useState(false)

  useEffect(() => {
    setMaze(MAZES[difficulty])
    handleReset()
  }, [difficulty])

  const generateBFSSteps = () => {
    const steps = []
    const visited = new Set()
    const queue = [{ pos: maze.start, path: [maze.start] }]
    const posToString = (pos) => `${pos.row},${pos.col}`
    
    visited.add(posToString(maze.start))
    
    steps.push({
      action: 'start',
      current: maze.start,
      visited: new Set(visited),
      queue: [...queue],
      path: [],
      message: 'Mulai dari posisi START!'
    })

    const directions = [
      { row: -1, col: 0, name: 'ATAS' },
      { row: 1, col: 0, name: 'BAWAH' },
      { row: 0, col: -1, name: 'KIRI' },
      { row: 0, col: 1, name: 'KANAN' }
    ]

    while (queue.length > 0) {
      const { pos, path } = queue.shift()
      
      steps.push({
        action: 'visit',
        current: pos,
        visited: new Set(visited),
        queue: [...queue],
        path: [...path],
        message: `Mengunjungi sel (${pos.row}, ${pos.col})`
      })

      // Check if goal reached
      if (pos.row === maze.goal.row && pos.col === maze.goal.col) {
        steps.push({
          action: 'found',
          current: pos,
          visited: new Set(visited),
          queue: [],
          path: [...path],
          message: `GOAL DITEMUKAN! Path length: ${path.length}`
        })
        break
      }

      // Explore neighbors
      for (const dir of directions) {
        const newPos = {
          row: pos.row + dir.row,
          col: pos.col + dir.col
        }
        const newPosStr = posToString(newPos)

        // Check bounds and walls
        if (
          newPos.row >= 0 &&
          newPos.row < maze.size &&
          newPos.col >= 0 &&
          newPos.col < maze.size &&
          maze.grid[newPos.row][newPos.col] === 0 &&
          !visited.has(newPosStr)
        ) {
          visited.add(newPosStr)
          queue.push({ pos: newPos, path: [...path, newPos] })
          
          steps.push({
            action: 'explore',
            current: pos,
            exploring: newPos,
            visited: new Set(visited),
            queue: [...queue],
            path: [...path],
            message: `Cek arah ${dir.name} → Tambah ke queue!`
          })
        }
      }
    }

    return steps
  }

  const handlePlay = () => {
    if (steps.length === 0) {
      const newSteps = generateBFSSteps()
      setSteps(newSteps)
      setTotalCells(newSteps.filter(s => s.action === 'visit').length)
    }
    setIsPlaying(true)
  }

  const handlePause = () => setIsPlaying(false)

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setSteps([])
    setVisited(new Set())
    setQueue([])
    setCurrentPos(null)
    setPath([])
    setIsComplete(false)
    setScore(0)
    setTotalCells(0)
    setAnimationCompleted(false)
  }

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const step = steps[currentStep]
        setVisited(step.visited)
        setQueue(step.queue)
        setCurrentPos(step.current)
        setPath(step.path)
        
        if (step.action === 'found') {
          setIsComplete(true)
          setIsPlaying(false)
          setAnimationCompleted(true)
          const efficiency = Math.round((step.path.length / totalCells) * 100)
          setScore(efficiency)
        }
        
        setCurrentStep(currentStep + 1)
      }, 1000 / speed)
      
      return () => clearTimeout(timer)
    }
  }, [isPlaying, currentStep, steps, speed])

  const currentStepData = steps[currentStep] || {}

  const getCellColor = (row, col) => {
    const cell = maze.grid[row][col]
    
    // Wall
    if (cell === 1) return 'bg-black dark:bg-gray-900'
    
    // Start
    if (row === maze.start.row && col === maze.start.col) {
      return 'bg-brutal-cyan border-4 border-white'
    }
    
    // Goal
    if (row === maze.goal.row && col === maze.goal.col) {
      return 'bg-brutal-warning border-4 border-white'
    }
    
    // Current position
    if (currentPos && row === currentPos.row && col === currentPos.col) {
      return 'bg-brutal-primary animate-pulse'
    }
    
    // Final path
    if (isComplete && path.some(p => p.row === row && p.col === col)) {
      return 'bg-brutal-success'
    }
    
    // In queue
    if (queue.some(q => q.pos.row === row && q.pos.col === col)) {
      return 'bg-brutal-cyan/50'
    }
    
    // Visited
    const posStr = `${row},${col}`
    if (visited.has(posStr)) {
      return 'bg-brutal-secondary/50'
    }
    
    // Empty
    return 'bg-white dark:bg-gray-800'
  }

  const getCellIcon = (row, col) => {
    if (row === maze.start.row && col === maze.start.col) {
      return <UserIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
    }
    if (row === maze.goal.row && col === maze.goal.col) {
      return <FlagIcon className="w-4 h-4 sm:w-6 sm:h-6 text-black" />
    }
    if (currentPos && row === currentPos.row && col === currentPos.col) {
      return <FireIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
    }
    return null
  }

  return (
    <div className="min-h-screen bg-brutal-bg dark:bg-black p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="card-brutal bg-gradient-to-r from-brutal-primary to-brutal-cyan text-white p-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-black uppercase flex items-center justify-center gap-3">
          <MapIcon className="w-8 h-8" />
          BFS MAZE SOLVER
        </h2>
        <p className="text-sm sm:text-base font-bold uppercase mt-2">
          Temukan Jalan Tercepat dengan Breadth-First Search!
        </p>
      </div>

      {/* Tutorial Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-brutal bg-brutal-warning text-black p-4"
      >
        <h3 className="font-black uppercase text-sm mb-2 flex items-center gap-2">
          <LightBulbIcon className="w-5 h-5" />
          Cara Main:
        </h3>
        <ul className="text-xs font-bold space-y-1">
          <li>🟦 <strong>BIRU</strong> = Posisi START</li>
          <li>🟨 <strong>KUNING</strong> = GOAL (Tujuan)</li>
          <li>⬛ <strong>HITAM</strong> = Tembok (Tidak bisa lewat)</li>
          <li>🔵 <strong>BIRU MUDA</strong> = Dalam Queue (Menunggu)</li>
          <li>🟩 <strong>HIJAU</strong> = Path terpendek yang ditemukan!</li>
        </ul>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Difficulty Selector */}
          <div className="card-brutal bg-white dark:bg-gray-900 p-4">
            <h3 className="font-black uppercase text-sm mb-3">Pilih Level Kesulitan:</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(MAZES).map(([key, mazeData]) => (
                <button
                  key={key}
                  onClick={() => {
                    setDifficulty(key)
                  }}
                  disabled={isPlaying}
                  className={`btn-brutal ${
                    difficulty === key
                      ? 'bg-brutal-primary text-white'
                      : 'bg-brutal-secondary text-black hover:bg-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm`}
                >
                  {mazeData.name.split(' - ')[0]}
                </button>
              ))}
            </div>
            <p className="text-xs font-bold mt-2 opacity-70">
              Level: {MAZES[difficulty].name}
            </p>
          </div>

          {/* Maze Grid */}
          <div className="card-brutal bg-black p-4 sm:p-6">
            <div 
              className="grid gap-1 sm:gap-2 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${maze.size}, minmax(0, 1fr))`,
                maxWidth: `${maze.size * 60}px`
              }}
            >
              {maze.grid.map((row, rowIdx) =>
                row.map((cell, colIdx) => (
                  <motion.div
                    key={`${rowIdx}-${colIdx}`}
                    className={`aspect-square border-2 border-gray-700 flex items-center justify-center transition-all duration-300 ${getCellColor(
                      rowIdx,
                      colIdx
                    )}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (rowIdx + colIdx) * 0.02 }}
                  >
                    {getCellIcon(rowIdx, colIdx)}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="card-brutal bg-white dark:bg-gray-900 p-4 space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePlay}
                disabled={isPlaying || isComplete}
                className="btn-brutal bg-brutal-success text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <PlayIcon className="w-5 h-5" />
                MULAI
              </button>
              <button
                onClick={handlePause}
                disabled={!isPlaying}
                className="btn-brutal bg-brutal-warning text-black hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <PauseIcon className="w-5 h-5" />
                PAUSE
              </button>
              <button
                onClick={handleReset}
                className="btn-brutal bg-brutal-danger text-white hover:bg-red-600 flex items-center gap-2"
              >
                <ArrowPathIcon className="w-5 h-5" />
                RESET
              </button>
            </div>

            {/* Speed Control */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-black uppercase text-xs">
                <BoltIcon className="w-4 h-4 text-brutal-warning" />
                Kecepatan: {speed}x
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="slider-brutal w-full"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="card-brutal bg-white dark:bg-black p-4 mt-4">
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

          {/* Current Action */}
          {currentStepData.message && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-brutal bg-brutal-primary text-white p-4"
            >
              <p className="font-black text-sm sm:text-base">{currentStepData.message}</p>
            </motion.div>
          )}

          {/* All Steps List - Only shown in 'list' mode */}
          {viewMode === 'list' && (
            <div className="mt-4">
              <PathfindingStepsList 
                steps={steps} 
                animationCompleted={animationCompleted}
                algorithmName="BFS"
              />
            </div>
          )}
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          {/* Progress */}
          <div className="card-brutal bg-white dark:bg-gray-900 p-4">
            <h3 className="font-black uppercase text-sm mb-3">Progress:</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Langkah</span>
                  <span className="text-brutal-primary">{currentStep} / {steps.length}</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 border-2 border-black">
                  <motion.div
                    className="h-full bg-brutal-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${steps.length > 0 ? (currentStep / steps.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Queue */}
          <div className="card-brutal bg-brutal-cyan text-white p-4">
            <h3 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              Queue: {queue.length}
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {queue.length === 0 ? (
                <p className="text-xs opacity-80">Kosong</p>
              ) : (
                queue.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="bg-white/20 px-2 py-1 text-xs font-bold rounded">
                    ({item.pos.row}, {item.pos.col})
                  </div>
                ))
              )}
              {queue.length > 5 && (
                <p className="text-xs opacity-80">+{queue.length - 5} lainnya...</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="card-brutal bg-white dark:bg-gray-900 p-4">
            <h3 className="font-black uppercase text-sm mb-3">Statistik:</h3>
            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between">
                <span>Sel Dikunjungi:</span>
                <span className="text-brutal-primary">{visited.size}</span>
              </div>
              <div className="flex justify-between">
                <span>Panjang Path:</span>
                <span className="text-brutal-success">{path.length}</span>
              </div>
              {isComplete && (
                <div className="flex justify-between">
                  <span>Efisiensi:</span>
                  <span className="text-brutal-warning">{score}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="card-brutal bg-brutal-warning text-black p-4">
            <h3 className="font-black uppercase text-sm mb-2 flex items-center gap-2">
              <InformationCircleIcon className="w-5 h-5" />
              Info BFS
            </h3>
            <div className="text-xs font-bold space-y-2">
              <p>✓ Menjamin path terpendek</p>
              <p>✓ Explore level per level</p>
              <p>✓ Menggunakan Queue (FIFO)</p>
              <p className="text-[10px] opacity-80 mt-2">
                Complexity: O(V + E)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Modal */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setIsComplete(false)}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="card-brutal bg-brutal-success text-white p-8 max-w-md text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <CheckCircleIcon className="w-20 h-20 mx-auto mb-4" />
              <h3 className="text-3xl font-black uppercase mb-4">GOAL TERCAPAI! 🎉</h3>
              <div className="space-y-3 text-lg font-bold">
                <p>Path Length: <span className="text-4xl">{path.length}</span></p>
                <p>Sel Dikunjungi: {visited.size}</p>
                <p>Efisiensi: {score}%</p>
                <div className="flex gap-2 justify-center mt-4">
                  {[...Array(Math.ceil(score / 20))].map((_, i) => (
                    <StarIcon key={i} className="w-8 h-8 text-brutal-warning" />
                  ))}
                </div>
              </div>
              <button
                onClick={handleReset}
                className="btn-brutal bg-white text-black hover:bg-gray-200 mt-6 w-full"
              >
                Main Lagi!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
