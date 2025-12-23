import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PathfindingStepsList from '../../Common/PathfindingStepsList'
import PlaybackControls from '../../Common/PlaybackControls'
import {
  BoltIcon,
  InformationCircleIcon,
  SparklesIcon,
  FlagIcon,
  UserIcon,
  FireIcon,
  StarIcon,
  CheckCircleIcon,
  ViewColumnsIcon,
  ListBulletIcon
} from '@heroicons/react/24/solid'

// Maze presets
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
  },
  compareA: {
    name: 'COMPARE A - Cabang Dalam',
    size: 7,
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    start: { row: 1, col: 1 },
    goal: { row: 1, col: 5 }
  },
  compareB: {
    name: 'COMPARE B - Jebakan Koridor',
    size: 9,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    start: { row: 1, col: 1 },
    goal: { row: 7, col: 7 }
  },
  custom: {
    name: 'CUSTOM - Buat Sendiri',
    size: 9,
    grid: Array(9).fill(0).map(() => Array(9).fill(0)),
    start: { row: 1, col: 1 },
    goal: { row: 7, col: 7 }
  }
}

export default function PathfindingViz() {
  const [algorithm, setAlgorithm] = useState('bfs')
  const [difficulty, setDifficulty] = useState('easy')
  const [maze, setMaze] = useState(MAZES.easy)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(3)
  const [visited, setVisited] = useState(new Set())
  const [queue, setQueue] = useState([])
  const [stack, setStack] = useState([])
  const [currentPos, setCurrentPos] = useState(null)
  const [path, setPath] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [totalCells, setTotalCells] = useState(0)
  const [viewMode, setViewMode] = useState('step')
  const [animationCompleted, setAnimationCompleted] = useState(false)
  
  // Custom maze builder states
  const [isEditMode, setIsEditMode] = useState(false)
  const [editTool, setEditTool] = useState('wall') // 'wall', 'start', 'goal'
  const [isDrawing, setIsDrawing] = useState(false)

  const posToString = (pos) => `${pos.row},${pos.col}`

  const generateBFSSteps = () => {
    const steps = []
    const visited = new Set()
    const queue = []
    
    const startStr = posToString(maze.start)
    visited.add(startStr)
    queue.push({ pos: maze.start, path: [maze.start] })
    
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

      for (const dir of directions) {
        const newPos = {
          row: pos.row + dir.row,
          col: pos.col + dir.col
        }
        const newPosStr = posToString(newPos)

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

  const generateDFSSteps = () => {
    const steps = []
    const visited = new Set()
    const stack = []
    
    const startStr = posToString(maze.start)
    visited.add(startStr)
    stack.push({ pos: maze.start, path: [maze.start] })
    
    steps.push({
      action: 'start',
      current: maze.start,
      visited: new Set(visited),
      stack: [...stack],
      path: [],
      message: 'Mulai dari posisi START!'
    })

    const directions = [
      { row: -1, col: 0, name: 'ATAS' },
      { row: 1, col: 0, name: 'BAWAH' },
      { row: 0, col: -1, name: 'KIRI' },
      { row: 0, col: 1, name: 'KANAN' }
    ]

    while (stack.length > 0) {
      const { pos, path } = stack.pop()
      
      steps.push({
        action: 'visit',
        current: pos,
        visited: new Set(visited),
        stack: [...stack],
        path: [...path],
        message: `Mengunjungi sel (${pos.row}, ${pos.col})`
      })

      if (pos.row === maze.goal.row && pos.col === maze.goal.col) {
        steps.push({
          action: 'found',
          current: pos,
          visited: new Set(visited),
          stack: [],
          path: [...path],
          message: `GOAL DITEMUKAN! Path length: ${path.length}`
        })
        break
      }

      for (const dir of directions) {
        const newPos = {
          row: pos.row + dir.row,
          col: pos.col + dir.col
        }
        const newPosStr = posToString(newPos)

        if (
          newPos.row >= 0 &&
          newPos.row < maze.size &&
          newPos.col >= 0 &&
          newPos.col < maze.size &&
          maze.grid[newPos.row][newPos.col] === 0 &&
          !visited.has(newPosStr)
        ) {
          visited.add(newPosStr)
          stack.push({ pos: newPos, path: [...path, newPos] })
          
          steps.push({
            action: 'explore',
            current: pos,
            exploring: newPos,
            visited: new Set(visited),
            stack: [...stack],
            path: [...path],
            message: `Cek arah ${dir.name} → Tambah ke stack!`
          })
        }
      }
    }

    return steps
  }

  const handlePlay = () => {
    if (steps.length === 0) {
      const newSteps = algorithm === 'bfs' ? generateBFSSteps() : generateDFSSteps()
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
    setStack([])
    setCurrentPos(null)
    setPath([])
    setIsComplete(false)
    setScore(0)
    setTotalCells(0)
    setAnimationCompleted(false)
  }

  const handleStepForward = () => {
    if (currentStep < steps.length) {
      const step = steps[currentStep]
      setVisited(step.visited)
      if (algorithm === 'bfs') {
        setQueue(step.queue || [])
      } else {
        setStack(step.stack || [])
      }
      setCurrentPos(step.current)
      setPath(step.path)
      
      if (step.action === 'found') {
        setIsComplete(true)
        setAnimationCompleted(true)
        const efficiency = Math.round((step.path.length / totalCells) * 100)
        setScore(efficiency)
      }
      
      setCurrentStep(currentStep + 1)
    }
  }

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      
      if (prevStep >= 0 && steps[prevStep]) {
        const step = steps[prevStep]
        setVisited(step.visited)
        if (algorithm === 'bfs') {
          setQueue(step.queue || [])
        } else {
          setStack(step.stack || [])
        }
        setCurrentPos(step.current)
        setPath(step.path)
      } else {
        setVisited(new Set())
        setQueue([])
        setStack([])
        setCurrentPos(null)
        setPath([])
      }
      
      setIsComplete(false)
      setAnimationCompleted(false)
    }
  }

  const handleAlgorithmChange = (newAlgorithm) => {
    setAlgorithm(newAlgorithm)
    handleReset()
  }

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty)
    setMaze(MAZES[newDifficulty])
    setIsEditMode(newDifficulty === 'custom')
    handleReset()
  }

  // Custom maze builder functions
  const handleCellClick = (row, col) => {
    if (!isEditMode || isPlaying) return
    
    const newMaze = { ...maze }
    const newGrid = newMaze.grid.map(r => [...r])
    
    if (editTool === 'start') {
      newMaze.start = { row, col }
      // Make sure start is not a wall
      newGrid[row][col] = 0
    } else if (editTool === 'goal') {
      newMaze.goal = { row, col }
      // Make sure goal is not a wall
      newGrid[row][col] = 0
    } else if (editTool === 'wall') {
      // Don't allow wall on start or goal
      if ((row === maze.start.row && col === maze.start.col) ||
          (row === maze.goal.row && col === maze.goal.col)) {
        return
      }
      // Toggle wall
      newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1
    } else if (editTool === 'path') {
      // Don't allow path on start or goal
      if ((row === maze.start.row && col === maze.start.col) ||
          (row === maze.goal.row && col === maze.goal.col)) {
        return
      }
      newGrid[row][col] = 0
    }
    
    newMaze.grid = newGrid
    setMaze(newMaze)
  }

  const handleCellMouseEnter = (row, col) => {
    if (!isEditMode || !isDrawing || isPlaying) return
    
    // Only allow drawing walls and paths when dragging
    if (editTool === 'wall' || editTool === 'path') {
      const newMaze = { ...maze }
      const newGrid = newMaze.grid.map(r => [...r])
      
      // Don't allow on start or goal
      if ((row === maze.start.row && col === maze.start.col) ||
          (row === maze.goal.row && col === maze.goal.col)) {
        return
      }
      
      if (editTool === 'wall') {
        newGrid[row][col] = 1
      } else {
        newGrid[row][col] = 0
      }
      
      newMaze.grid = newGrid
      setMaze(newMaze)
    }
  }

  const handleClearMaze = () => {
    const newMaze = {
      ...maze,
      grid: Array(maze.size).fill(0).map(() => Array(maze.size).fill(0)),
      start: { row: 1, col: 1 },
      goal: { row: maze.size - 2, col: maze.size - 2 }
    }
    setMaze(newMaze)
    handleReset()
  }

  const handleFillBorder = () => {
    const newMaze = { ...maze }
    const newGrid = newMaze.grid.map(r => [...r])
    const size = maze.size
    
    // Fill top and bottom borders
    for (let col = 0; col < size; col++) {
      newGrid[0][col] = 1
      newGrid[size - 1][col] = 1
    }
    
    // Fill left and right borders
    for (let row = 0; row < size; row++) {
      newGrid[row][0] = 1
      newGrid[row][size - 1] = 1
    }
    
    newMaze.grid = newGrid
    setMaze(newMaze)
  }

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const step = steps[currentStep]
        setVisited(step.visited)
        if (algorithm === 'bfs') {
          setQueue(step.queue || [])
        } else {
          setStack(step.stack || [])
        }
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
  }, [isPlaying, currentStep, steps, speed, algorithm, totalCells])

  const currentStepData = currentStep > 0 && steps[currentStep - 1] ? steps[currentStep - 1] : {}

  const getCellColor = (row, col) => {
    const cell = maze.grid[row][col]
    
    // Wall - Dark gray/black
    if (cell === 1) return 'bg-gray-800 dark:bg-gray-900 border-gray-700'
    
    // Start position - Cyan
    if (row === maze.start.row && col === maze.start.col) {
      return 'bg-brutal-cyan border-4 border-white shadow-lg'
    }
    
    // Goal position - Yellow
    if (row === maze.goal.row && col === maze.goal.col) {
      return 'bg-yellow-400 border-4 border-white shadow-lg'
    }
    
    // Current position during algorithm - Purple with pulse
    if (currentPos && row === currentPos.row && col === currentPos.col) {
      return 'bg-purple-500 animate-pulse border-white'
    }
    
    // Final path - Green
    const isInPath = path.some(p => p.row === row && p.col === col)
    if (isInPath && isComplete) {
      return 'bg-green-500 border-green-600'
    }
    
    // Visited cells - Light blue
    const posStr = posToString({ row, col })
    if (visited.has(posStr)) {
      return 'bg-blue-200 dark:bg-blue-900 border-blue-300'
    }
    
    // Empty path - White/Light
    return 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
  }

  const getCellIcon = (row, col) => {
    if (row === maze.start.row && col === maze.start.col) {
      return <UserIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
    }
    if (row === maze.goal.row && col === maze.goal.col) {
      return <FlagIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
    }
    if (currentPos && row === currentPos.row && col === currentPos.col) {
      return <FireIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white animate-bounce" />
    }
    const isInPath = path.some(p => p.row === row && p.col === col)
    if (isInPath && isComplete) {
      return <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          Graph Pathfinding
        </h1>
        <p className="text-lg sm:text-xl font-bold text-brutal-primary mt-2 flex items-center gap-2">
          <SparklesIcon className="w-6 h-6" />
          TEMUKAN JALAN TERPENDEK!
        </p>
      </div>

      {/* Algorithm Selection */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <label className="font-black uppercase text-sm block mb-3">
          Pilih Algoritma:
        </label>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleAlgorithmChange('bfs')}
            className={`btn-brutal px-6 py-3 text-sm font-black uppercase transition-colors ${
              algorithm === 'bfs'
                ? 'bg-brutal-primary text-white'
                : 'bg-white dark:bg-black hover:bg-brutal-secondary'
            }`}
          >
            BFS (Breadth-First)
          </button>
          <button
            onClick={() => handleAlgorithmChange('dfs')}
            className={`btn-brutal px-6 py-3 text-sm font-black uppercase transition-colors ${
              algorithm === 'dfs'
                ? 'bg-brutal-primary text-white'
                : 'bg-brutal-bg dark:bg-brutal-dark hover:bg-brutal-secondary'
            }`}
          >
            DFS (Depth-First)
          </button>
        </div>
        <p className="text-xs font-bold mt-2 opacity-70">
          {algorithm === 'bfs' 
            ? 'BFS menggunakan QUEUE - Cek semua tetangga terdekat dulu'
            : 'DFS menggunakan STACK - Cek satu jalur sampai ujung dulu'}
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Difficulty Selection */}
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
            <label className="font-black uppercase text-sm mb-3 block">
              Pilih Tingkat Kesulitan:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {Object.keys(MAZES).map((key) => {
                const mazeData = MAZES[key]
                return (
                  <button
                    key={key}
                    onClick={() => handleDifficultyChange(key)}
                    disabled={isPlaying}
                    className={`btn-brutal ${
                      difficulty === key
                        ? 'bg-brutal-primary text-white'
                        : 'bg-brutal-secondary text-black hover:bg-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm`}
                  >
                    {mazeData.name.split(' - ')[0]}
                  </button>
                )
              })}
            </div>
            <p className="text-xs font-bold mt-2 opacity-70">
              Level: {MAZES[difficulty].name}
            </p>
          </div>

          {/* Custom Maze Builder Controls */}
          {isEditMode && (
            <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark text-black p-4">
              <h3 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5" />
                Mode: Buat Labirin Sendiri
              </h3>
              
              <div className="space-y-3">
                {/* Tool Selection */}
                <div>
                  <label className="font-black uppercase text-xs block mb-2">Pilih Tool:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => setEditTool('start')}
                      className={`btn-brutal px-3 py-2 text-xs font-black uppercase transition-all ${
                        editTool === 'start' 
                          ? 'bg-brutal-cyan text-white border-4 border-white shadow-lg' 
                          : 'bg-brutal-cyan text-white opacity-60 hover:opacity-100'
                      }`}
                    >
                      🎯 Start
                    </button>
                    <button
                      onClick={() => setEditTool('goal')}
                      className={`btn-brutal px-3 py-2 text-xs font-black uppercase transition-all ${
                        editTool === 'goal' 
                          ? 'bg-yellow-400 text-black border-4 border-white shadow-lg' 
                          : 'bg-yellow-400 text-black opacity-60 hover:opacity-100'
                      }`}
                    >
                      🏁 Goal
                    </button>
                    <button
                      onClick={() => setEditTool('wall')}
                      className={`btn-brutal px-3 py-2 text-xs font-black uppercase transition-all ${
                        editTool === 'wall' 
                          ? 'bg-gray-800 text-white border-4 border-white shadow-lg' 
                          : 'bg-gray-800 text-white opacity-60 hover:opacity-100'
                      }`}
                    >
                      🧱 Wall
                    </button>
                    <button
                      onClick={() => setEditTool('path')}
                      className={`btn-brutal px-3 py-2 text-xs font-black uppercase transition-all ${
                        editTool === 'path' 
                          ? 'bg-white text-black border-4 border-brutal-primary shadow-lg' 
                          : 'bg-white text-black opacity-60 hover:opacity-100'
                      }`}
                    >
                      ⬜ Path
                    </button>
                  </div>
                </div>

                {/* Helper Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleClearMaze}
                    className="btn-brutal px-4 py-2 bg-brutal-secondary text-black font-black uppercase text-xs flex-1 hover:bg-red-400 transition-colors"
                  >
                    🗑️ Clear All
                  </button>
                  <button
                    onClick={handleFillBorder}
                    className="btn-brutal px-4 py-2 bg-gray-800 text-white font-black uppercase text-xs flex-1 hover:bg-gray-700 transition-colors"
                  >
                    ⬛ Fill Border
                  </button>
                </div>

                <div className="bg-white border-3 border-black p-3 rounded">
                  <p className="text-xs font-black mb-2">💡 CARA PAKAI:</p>
                  <ul className="text-xs font-bold space-y-1 list-disc list-inside">
                    <li><span className="text-brutal-cyan">Start/Goal</span>: Klik sekali pada grid</li>
                    <li><span className="text-gray-800">Wall/Path</span>: Klik & drag untuk menggambar</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Maze Grid */}
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 sm:p-6">
            {isEditMode && (
              <div className="mb-3 text-center">
                <p className="font-black text-sm uppercase">
                  Tool Aktif: 
                  <span className={`ml-2 px-3 py-1 rounded ${
                    editTool === 'start' ? 'bg-brutal-cyan text-white' :
                    editTool === 'goal' ? 'bg-yellow-400 text-black' :
                    editTool === 'wall' ? 'bg-gray-800 text-white' :
                    'bg-white text-black border-2 border-black'
                  }`}>
                    {editTool === 'start' ? '🎯 START' :
                     editTool === 'goal' ? '🏁 GOAL' :
                     editTool === 'wall' ? '🧱 WALL' :
                     '⬜ PATH'}
                  </span>
                </p>
              </div>
            )}
            <div 
              className="bg-brutal-bg dark:bg-brutal-dark grid gap-1 sm:gap-2 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${maze.size}, minmax(0, 1fr))`,
                maxWidth: `${maze.size * 60}px`
              }}
              onMouseLeave={() => setIsDrawing(false)}
            >
              {maze.grid.map((row, rowIdx) =>
                row.map((cell, colIdx) => (
                  <motion.div
                    key={`${rowIdx}-${colIdx}`}
                    className={`aspect-square border-2 flex items-center justify-center transition-all duration-200 ${
                      isEditMode ? 'cursor-pointer hover:scale-110 hover:shadow-lg' : ''
                    } ${getCellColor(rowIdx, colIdx)}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (rowIdx + colIdx) * 0.02 }}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    onMouseDown={() => setIsDrawing(true)}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseEnter={() => handleCellMouseEnter(rowIdx, colIdx)}
                  >
                    {getCellIcon(rowIdx, colIdx)}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Controls */}
          <PlaybackControls
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            disabled={false}
          />

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
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b-3 border-black dark:border-brutal-bg">
              <span className="font-black uppercase text-sm whitespace-nowrap">Mode Tampilan:</span>
              <div className="flex gap-2 flex-1">
                <button
                  onClick={() => setViewMode('step')}
                  className={`btn-brutal px-3 py-2 font-black uppercase text-xs flex-1 transition-all flex items-center justify-center gap-2 ${
                    viewMode === 'step'
                      ? 'bg-brutal-primary text-white'
                      : 'bg-brutal-bg dark:bg-brutal-dark text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
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
                      : 'bg-brutal-bg dark:bg-brutal-dark text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ListBulletIcon className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Current Action */}
          {currentStepData.message && viewMode === 'step' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-brutal bg-brutal-primary text-white p-4"
            >
              <p className="font-black text-sm sm:text-base">{currentStepData.message}</p>
            </motion.div>
          )}
  
          {/* All Steps List */}
          {viewMode === 'list' && (
            <div className="mt-4">
              <PathfindingStepsList 
                steps={steps} 
                animationCompleted={animationCompleted}
                algorithmName={algorithm === 'bfs' ? 'BFS' : 'DFS'}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Current Stats */}
          {steps.length > 0 && (
            <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
              <h3 className="text-sm font-black uppercase mb-3 flex items-center gap-2">
                <InformationCircleIcon className="w-5 h-5 text-brutal-primary" />
                Status
              </h3>
              <div className="space-y-3 text-sm font-bold">
                <div>
                  <span className="opacity-70">Langkah:</span>
                  <p className="text-2xl font-black text-brutal-primary">{currentStep} / {steps.length}</p>
                </div>
                <div>
                  <span className="opacity-70">Sel Dikunjungi:</span>
                  <p className="text-2xl font-black text-brutal-warning">{visited.size}</p>
                </div>
                {algorithm === 'bfs' ? (
                  <div>
                    <span className="opacity-70">Queue Size:</span>
                    <p className="text-2xl font-black text-brutal-cyan">{queue.length}</p>
                  </div>
                ) : (
                  <div>
                    <span className="opacity-70">Stack Size:</span>
                    <p className="text-2xl font-black text-brutal-cyan">{stack.length}</p>
                  </div>
                )}
                {isComplete && (
                  <div>
                    <span className="opacity-70">Path Length:</span>
                    <p className="text-2xl font-black text-brutal-success">{path.length}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Algorithm Info */}
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
            <h3 className="text-sm font-black uppercase mb-2 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-brutal-primary" />
              Tentang {algorithm === 'bfs' ? 'BFS' : 'DFS'}
            </h3>
            <p className="text-xs font-bold leading-relaxed">
              {algorithm === 'bfs' 
                ? 'Breadth-First Search menggunakan queue (FIFO) untuk menjelajah semua node di level yang sama sebelum ke level berikutnya. Menjamin jalur terpendek!'
                : 'Depth-First Search menggunakan stack (LIFO) untuk menjelajah sedalam mungkin di satu cabang sebelum backtrack. Lebih hemat memori!'}
            </p>
          </div>

          {/* Legend */}
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
            <h3 className="text-sm font-black uppercase mb-3">Penjelasan Warna:</h3>
            <div className="space-y-2 text-xs font-bold">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brutal-cyan border-2 border-white shadow"></div>
                <span>🎯 Start (Titik Mulai)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-400 border-2 border-white shadow"></div>
                <span>🏁 Goal (Tujuan)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white border-2 border-gray-300"></div>
                <span>⬜ Jalan (Path)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-800 border-2 border-gray-700"></div>
                <span>🧱 Tembok (Wall)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500 border-2 border-black"></div>
                <span>📍 Posisi Saat Ini</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-200 border-2 border-blue-300"></div>
                <span>👣 Sudah Dikunjungi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 border-2 border-green-600"></div>
                <span>✅ Jalur Solusi</span>
              </div>
            </div>
          </div>

          {/* Completion Message */}
          {isComplete && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card-brutal bg-brutal-success text-white p-4 text-center"
            >
              <CheckCircleIcon className="w-12 h-12 mx-auto mb-2" />
              <p className="font-black text-lg">SELESAI!</p>
              <p className="text-sm font-bold mt-2">
                Jalur ditemukan dengan {path.length} langkah
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
