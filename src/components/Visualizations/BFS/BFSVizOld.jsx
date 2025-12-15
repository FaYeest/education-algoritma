import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  QueueListIcon,
  MapIcon,
  CheckCircleIcon,
  BoltIcon,
  InformationCircleIcon,
  SparklesIcon,
  LightBulbIcon,
  MapPinIcon
} from '@heroicons/react/24/solid'

export default function BFSViz() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(5)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [queue, setQueue] = useState([])
  const [visited, setVisited] = useState([])
  const [currentNode, setCurrentNode] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [currentAction, setCurrentAction] = useState('')
  const [activeEdges, setActiveEdges] = useState([])

  const defaultGraph = {
    nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'B', to: 'E' },
      { from: 'C', to: 'F' },
      { from: 'C', to: 'G' },
    ],
    start: 'A'
  }

  const nodePositions = {
    'A': { x: 50, y: 20 },
    'B': { x: 30, y: 50 },
    'C': { x: 70, y: 50 },
    'D': { x: 15, y: 80 },
    'E': { x: 45, y: 80 },
    'F': { x: 60, y: 80 },
    'G': { x: 85, y: 80 },
  }

  const fetchBFS = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/algorithms/graph/bfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultGraph)
      })
      const data = await response.json()
      setSteps(data.steps)
    } catch (error) {
      console.error('Error fetching BFS:', error)
    }
  }

  useEffect(() => {
    fetchBFS()
  }, [])

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const step = steps[currentStep]
        setQueue(step.queue || [])
        setVisited(step.visited || [])
        setCurrentNode(step.visiting)
        setCurrentStep(currentStep + 1)
        setProgress(Math.round(((currentStep + 1) / steps.length) * 100))

        // Update active edges
        if (step.action === 'enqueue' && step.neighbor) {
          const parent = step.visiting
          const child = step.neighbor
          setActiveEdges(prev => [...prev, `${parent}-${child}`])
        }

        // Set action description in Indonesian
        if (step.action === 'start') {
          setCurrentAction(`🚀 Memulai dari node ${step.visiting}`)
        } else if (step.action === 'enqueue') {
          setCurrentAction(`➕ Menambahkan ${step.neighbor} ke antrian`)
        } else if (step.action === 'visit') {
          setCurrentAction(`👁️ Mengunjungi node ${step.visiting}`)
        }

        if (currentStep + 1 >= steps.length) {
          setIsComplete(true)
          setIsPlaying(false)
        }
      }, 2000 / speed)

      return () => clearTimeout(timer)
    }
  }, [isPlaying, currentStep, steps, speed])

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setQueue([])
    setVisited([])
    setCurrentNode(null)
    setProgress(0)
    setIsComplete(false)
    setCurrentAction('')
    setActiveEdges([])
  }

  const getNodeColor = (node) => {
    if (node === currentNode) return 'bg-brutal-warning border-brutal-warning'
    if (visited.includes(node)) return 'bg-brutal-success border-brutal-success'
    if (queue.includes(node)) return 'bg-brutal-cyan border-brutal-cyan'
    return 'bg-white dark:bg-gray-800 border-black dark:border-white'
  }

  return (
    <div className="min-h-screen bg-brutal-bg dark:bg-black p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="card-brutal bg-brutal-primary text-white p-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-black uppercase flex items-center justify-center gap-3">
          <MapIcon className="w-8 h-8" />
          BFS - BREADTH FIRST SEARCH
        </h2>
        <p className="text-sm sm:text-base font-bold uppercase mt-2 opacity-90">
          Jelajahi Graph Level Demi Level - Seperti Gelombang Air 🌊
        </p>
      </div>

      {/* Current Action Info */}
      <AnimatePresence>
        {currentAction && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card-brutal bg-brutal-warning text-black p-4 text-center"
          >
            <p className="text-lg font-black uppercase flex items-center justify-center gap-2">
              <SparklesIcon className="w-6 h-6" />
              {currentAction}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="card-brutal bg-white dark:bg-black p-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <button
            onClick={() => {
              if (isComplete) {
                handleReset()
                setTimeout(() => setIsPlaying(true), 100)
              } else {
                setIsPlaying(!isPlaying)
              }
            }}
            className="btn-brutal bg-brutal-primary text-white hover:bg-brutal-secondary flex items-center justify-center gap-2"
          >
            {isPlaying ? (
              <>
                <PauseIcon className="w-5 h-5" />
                <span className="font-black uppercase">Jeda</span>
              </>
            ) : (
              <>
                <PlayIcon className="w-5 h-5" />
                <span className="font-black uppercase">{isComplete ? 'Main Lagi' : 'Mulai'}</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="btn-brutal bg-brutal-danger text-white hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span className="font-black uppercase">Reset</span>
          </button>

          <div className="flex items-center gap-3">
            <BoltIcon className="w-5 h-5 text-brutal-primary flex-shrink-0" />
            <div className="flex-1">
              <label className="font-black uppercase text-xs block mb-1">
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
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Graph Visualization */}
          <div className="card-brutal bg-white dark:bg-black p-6 min-h-[500px]">
            <div className="relative w-full h-[400px] border-3 border-black dark:border-brutal-bg bg-brutal-bg dark:bg-gray-900">
              {/* Edges */}
              <svg className="absolute inset-0 w-full h-full">
                {defaultGraph.edges.map((edge, idx) => {
                  const from = nodePositions[edge.from]
                  const to = nodePositions[edge.to]
                  const edgeKey = `${edge.from}-${edge.to}`
                  const isActive = activeEdges.includes(edgeKey)
                  const isVisitedEdge = visited.includes(edge.from) && visited.includes(edge.to)
                  
                  return (
                    <g key={idx}>
                      <motion.line
                        x1={`${from.x}%`}
                        y1={`${from.y}%`}
                        x2={`${to.x}%`}
                        y2={`${to.y}%`}
                        stroke="currentColor"
                        strokeWidth={isActive ? "5" : "3"}
                        className={
                          isActive 
                            ? "text-brutal-warning" 
                            : isVisitedEdge 
                            ? "text-brutal-success opacity-80" 
                            : "text-black dark:text-white opacity-30"
                        }
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ 
                          pathLength: 1, 
                          opacity: isActive ? 1 : isVisitedEdge ? 0.8 : 0.3,
                        }}
                        transition={{ 
                          duration: isActive ? 0.5 : 0.1,
                          ease: "easeInOut"
                        }}
                      />
                      {isActive && (
                        <motion.line
                          x1={`${from.x}%`}
                          y1={`${from.y}%`}
                          x2={`${to.x}%`}
                          y2={`${to.y}%`}
                          stroke="#FACC15"
                          strokeWidth="5"
                          strokeDasharray="8 4"
                          initial={{ strokeDashoffset: 0 }}
                          animate={{ strokeDashoffset: -12 }}
                          transition={{ 
                            duration: 0.8, 
                            repeat: Infinity, 
                            ease: "linear" 
                          }}
                        />
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Nodes */}
              {defaultGraph.nodes.map((node) => {
                const pos = nodePositions[node]
                return (
                  <motion.div
                    key={node}
                    className={`absolute w-16 h-16 rounded-full border-4 flex items-center justify-center font-black text-2xl transition-all duration-300 ${getNodeColor(
                      node
                    )}`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      scale: node === currentNode ? 1.3 : 1,
                    }}
                  >
                    {node}
                    {visited.includes(node) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2"
                      >
                        <CheckCircleIcon className="w-6 h-6 text-brutal-success" />
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-black text-sm uppercase">Progress</span>
                <span className="font-black text-sm text-brutal-primary">{progress}%</span>
              </div>
              <div className="h-4 border-3 border-black dark:border-white bg-white dark:bg-gray-800">
                <motion.div
                  className="h-full bg-brutal-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Queue */}
          <div className="card-brutal bg-brutal-cyan p-4">
            <h3 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
              <QueueListIcon className="w-5 h-5" />
              Queue (Antrian)
            </h3>
            <div className="space-y-2">
              {queue.length === 0 ? (
                <p className="text-xs opacity-60">Kosong</p>
              ) : (
                queue.map((node, idx) => (
                  <motion.div
                    key={`${node}-${idx}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-white dark:bg-black border-2 border-black dark:border-white px-3 py-2 font-black"
                  >
                    {node}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Visited */}
          <div className="card-brutal bg-brutal-success text-white p-4">
            <h3 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              Visited (Dikunjungi)
            </h3>
            <div className="flex flex-wrap gap-2">
              {visited.length === 0 ? (
                <p className="text-xs opacity-80">Belum ada</p>
              ) : (
                visited.map((node) => (
                  <motion.div
                    key={node}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-10 h-10 bg-white text-black border-2 border-black rounded-full flex items-center justify-center font-black"
                  >
                    {node}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Info */}
          <div className="card-brutal bg-white dark:bg-black p-4">
            <h3 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
              <InformationCircleIcon className="w-5 h-5 text-brutal-primary" />
              Informasi
            </h3>
            <div className="space-y-2 text-xs">
              <p>
                <span className="font-black">Node Saat Ini:</span>{' '}
                <span className="text-brutal-primary font-black text-lg">{currentNode || '-'}</span>
              </p>
              <p>
                <span className="font-black">Langkah:</span> {currentStep} / {steps.length}
              </p>
              <p>
                <span className="font-black">Kompleksitas Waktu:</span> O(V + E)
              </p>
              <p>
                <span className="font-black">Kompleksitas Ruang:</span> O(V)
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="card-brutal bg-white dark:bg-black p-4">
            <h3 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
              <InformationCircleIcon className="w-5 h-5 text-brutal-primary" />
              Legenda
            </h3>
            <div className="space-y-2 text-xs font-bold">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brutal-warning border-2 border-black rounded-full" />
                <span>Sedang Dikunjungi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brutal-cyan border-2 border-black rounded-full" />
                <span>Dalam Queue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brutal-success border-2 border-black rounded-full" />
                <span>Sudah Dikunjungi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Message */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card-brutal bg-brutal-success text-white p-6 text-center"
          >
            <CheckCircleIcon className="w-16 h-16 mx-auto mb-3" />
            <p className="text-2xl font-black uppercase flex items-center justify-center gap-2">
              <CheckCircleIcon className="w-8 h-8" />
              Traversal Selesai!
            </p>
            <p className="mt-2 text-sm font-bold opacity-90">
              Urutan Kunjungan: {visited.join(' → ')}
            </p>
            <p className="mt-3 text-xs font-bold opacity-80 flex items-center justify-center gap-2">
              <LightBulbIcon className="w-5 h-5" />
              BFS mengunjungi semua node pada level yang sama sebelum pindah ke level berikutnya
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Educational Info */}
      <div className="card-brutal bg-white dark:bg-black p-6">
        <h3 className="font-black uppercase text-lg mb-4 flex items-center gap-2">
          <InformationCircleIcon className="w-6 h-6 text-brutal-primary" />
          Cara Kerja BFS
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm font-bold">
          <div className="space-y-2">
            <p className="text-brutal-primary uppercase flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              Langkah-Langkah:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Mulai dari node awal, masukkan ke queue</li>
              <li>Tandai node sebagai visited</li>
              <li>Ambil node dari depan queue</li>
              <li>Kunjungi semua tetangga yang belum visited</li>
              <li>Masukkan tetangga ke queue</li>
              <li>Ulangi sampai queue kosong</li>
            </ol>
          </div>
          <div className="space-y-2">
            <p className="text-brutal-primary uppercase flex items-center gap-2">
              <LightBulbIcon className="w-5 h-5" />
              Kegunaan:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Mencari jalur terpendek (unweighted)</li>
              <li>Social network analysis</li>
              <li>Web crawling</li>
              <li>GPS navigation systems</li>
              <li>Network broadcasting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
