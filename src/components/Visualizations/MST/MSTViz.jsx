import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GenericStepsList from '../../Common/GenericStepsList'
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  MapIcon,
  CheckCircleIcon,
  BoltIcon,
  InformationCircleIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  SignalIcon,
  HomeModernIcon,
  TrophyIcon,
  LightBulbIcon,
  WifiIcon
} from '@heroicons/react/24/solid'

// City network scenarios
const SCENARIOS = {
  internet: {
    name: 'INTERNET - Pasang Fiber Optik',
    icon: '🌐',
    unit: 'Juta',
    color: 'brutal-primary',
    nodes: [
      { id: 'A', name: 'Jakarta', x: 50, y: 30, icon: '🏙️' },
      { id: 'B', name: 'Bandung', x: 45, y: 50, icon: '🏞️' },
      { id: 'C', name: 'Surabaya', x: 75, y: 40, icon: '🌆' },
      { id: 'D', name: 'Semarang', x: 65, y: 45, icon: '🏘️' },
      { id: 'E', name: 'Yogyakarta', x: 55, y: 60, icon: '🏛️' },
      { id: 'F', name: 'Malang', x: 80, y: 55, icon: '🏔️' },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 8 },
      { from: 'A', to: 'D', weight: 6 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'B', to: 'E', weight: 3 },
      { from: 'C', to: 'D', weight: 3 },
      { from: 'C', to: 'F', weight: 4 },
      { from: 'D', to: 'E', weight: 7 },
      { from: 'E', to: 'F', weight: 6 },
    ]
  },
  power: {
    name: 'LISTRIK - Bangun Jaringan PLN',
    icon: '⚡',
    unit: 'Miliar',
    color: 'brutal-warning',
    nodes: [
      { id: 'A', name: 'Pembangkit A', x: 30, y: 30, icon: '🏭' },
      { id: 'B', name: 'Pembangkit B', x: 70, y: 25, icon: '⚡' },
      { id: 'C', name: 'Kota Utara', x: 50, y: 40, icon: '🏘️' },
      { id: 'D', name: 'Kota Timur', x: 75, y: 55, icon: '🏙️' },
      { id: 'E', name: 'Kota Selatan', x: 50, y: 70, icon: '🏢' },
      { id: 'F', name: 'Kota Barat', x: 25, y: 55, icon: '🏘️' },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 10 },
      { from: 'A', to: 'C', weight: 6 },
      { from: 'A', to: 'F', weight: 5 },
      { from: 'B', to: 'C', weight: 7 },
      { from: 'B', to: 'D', weight: 8 },
      { from: 'C', to: 'D', weight: 4 },
      { from: 'C', to: 'E', weight: 9 },
      { from: 'C', to: 'F', weight: 6 },
      { from: 'D', to: 'E', weight: 5 },
      { from: 'E', to: 'F', weight: 7 },
    ]
  },
  road: {
    name: 'JALAN TOL - Koneksi Antar Kota',
    icon: '🛣️',
    unit: 'Miliar',
    color: 'brutal-secondary',
    nodes: [
      { id: 'A', name: 'Kota A', x: 40, y: 25, icon: '🏙️' },
      { id: 'B', name: 'Kota B', x: 60, y: 25, icon: '🌆' },
      { id: 'C', name: 'Kota C', x: 30, y: 50, icon: '🏘️' },
      { id: 'D', name: 'Kota D', x: 50, y: 50, icon: '🏢' },
      { id: 'E', name: 'Kota E', x: 70, y: 50, icon: '🏙️' },
      { id: 'F', name: 'Kota F', x: 40, y: 75, icon: '🌆' },
      { id: 'G', name: 'Kota G', x: 60, y: 75, icon: '🏘️' },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 7 },
      { from: 'A', to: 'C', weight: 5 },
      { from: 'A', to: 'D', weight: 9 },
      { from: 'B', to: 'D', weight: 8 },
      { from: 'B', to: 'E', weight: 5 },
      { from: 'C', to: 'D', weight: 6 },
      { from: 'C', to: 'F', weight: 7 },
      { from: 'D', to: 'E', weight: 6 },
      { from: 'D', to: 'F', weight: 8 },
      { from: 'D', to: 'G', weight: 9 },
      { from: 'E', to: 'G', weight: 6 },
      { from: 'F', to: 'G', weight: 4 },
    ]
  }
}

export default function MSTViz() {
  const [scenario, setScenario] = useState('internet')
  const [config, setConfig] = useState(SCENARIOS.internet)
  const [algorithm, setAlgorithm] = useState('kruskal') // 'kruskal' | 'prim'
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(3)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [mstEdges, setMstEdges] = useState([])
  const [totalCost, setTotalCost] = useState(0)
  const [currentEdge, setCurrentEdge] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  const [visitedNodes, setVisitedNodes] = useState(new Set())
  const [viewMode, setViewMode] = useState('step')
  const [animationCompleted, setAnimationCompleted] = useState(false)

  useEffect(() => {
    setConfig(SCENARIOS[scenario])
    handleReset()
  }, [scenario, algorithm])

  // Kruskal's Algorithm
  const generateKruskalSteps = () => {
    const steps = []
    const edges = [...config.edges].sort((a, b) => a.weight - b.weight)
    const parent = {}
    const rank = {}
    
    // Initialize disjoint set
    config.nodes.forEach(node => {
      parent[node.id] = node.id
      rank[node.id] = 0
    })
    
    const find = (x) => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x])
      }
      return parent[x]
    }
    
    const union = (x, y) => {
      const rootX = find(x)
      const rootY = find(y)
      
      if (rootX === rootY) return false
      
      if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY
      } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX
      } else {
        parent[rootY] = rootX
        rank[rootX]++
      }
      return true
    }
    
    steps.push({
      action: 'init',
      message: `🚀 Mulai Kruskal! Urutkan semua edge dari yang termurah.`,
      edges: [],
      totalCost: 0
    })
    
    const mstEdges = []
    let totalCost = 0
    
    edges.forEach((edge, idx) => {
      steps.push({
        action: 'check',
        edge: edge,
        message: `🔍 Cek edge ${edge.from}-${edge.to} (Rp${edge.weight} ${config.unit})`,
        edges: [...mstEdges],
        totalCost: totalCost
      })
      
      if (union(edge.from, edge.to)) {
        mstEdges.push(edge)
        totalCost += edge.weight
        steps.push({
          action: 'add',
          edge: edge,
          message: `✅ Tambah ${edge.from}-${edge.to}! Tidak bikin cycle. Total: Rp${totalCost} ${config.unit}`,
          edges: [...mstEdges],
          totalCost: totalCost
        })
      } else {
        steps.push({
          action: 'reject',
          edge: edge,
          message: `❌ Tolak ${edge.from}-${edge.to}! Bikin cycle (${edge.from} dan ${edge.to} sudah terhubung)`,
          edges: [...mstEdges],
          totalCost: totalCost
        })
      }
    })
    
    steps.push({
      action: 'complete',
      message: `🎉 MST Selesai! Total biaya: Rp${totalCost} ${config.unit}`,
      edges: [...mstEdges],
      totalCost: totalCost
    })
    
    return steps
  }

  // Prim's Algorithm
  const generatePrimSteps = () => {
    const steps = []
    const visited = new Set()
    const mstEdges = []
    let totalCost = 0
    
    // Start from first node
    const startNode = config.nodes[0].id
    visited.add(startNode)
    
    steps.push({
      action: 'init',
      message: `🚀 Mulai Prim dari ${startNode}! Tambah node terdekat satu per satu.`,
      edges: [],
      totalCost: 0,
      visited: new Set(visited)
    })
    
    while (visited.size < config.nodes.length) {
      let minEdge = null
      let minWeight = Infinity
      
      // Find minimum edge connecting visited to unvisited
      config.edges.forEach(edge => {
        const fromVisited = visited.has(edge.from)
        const toVisited = visited.has(edge.to)
        
        if (fromVisited !== toVisited) {
          if (edge.weight < minWeight) {
            minWeight = edge.weight
            minEdge = edge
          }
        }
      })
      
      if (minEdge) {
        const newNode = visited.has(minEdge.from) ? minEdge.to : minEdge.from
        
        steps.push({
          action: 'check',
          edge: minEdge,
          message: `🔍 Cek edge terdekat: ${minEdge.from}-${minEdge.to} (Rp${minEdge.weight} ${config.unit})`,
          edges: [...mstEdges],
          totalCost: totalCost,
          visited: new Set(visited)
        })
        
        visited.add(newNode)
        mstEdges.push(minEdge)
        totalCost += minEdge.weight
        
        steps.push({
          action: 'add',
          edge: minEdge,
          message: `✅ Tambah ${minEdge.from}-${minEdge.to}! Node ${newNode} terhubung. Total: Rp${totalCost} ${config.unit}`,
          edges: [...mstEdges],
          totalCost: totalCost,
          visited: new Set(visited)
        })
      }
    }
    
    steps.push({
      action: 'complete',
      message: `🎉 MST Selesai! Total biaya: Rp${totalCost} ${config.unit}`,
      edges: [...mstEdges],
      totalCost: totalCost,
      visited: new Set(visited)
    })
    
    return steps
  }

  const handlePlay = () => {
    if (steps.length === 0) {
      const newSteps = algorithm === 'kruskal' ? generateKruskalSteps() : generatePrimSteps()
      setSteps(newSteps)
    }
    setIsPlaying(true)
  }

  const handlePause = () => setIsPlaying(false)

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setSteps([])
    setMstEdges([])
    setTotalCost(0)
    setCurrentEdge(null)
    setIsComplete(false)
    setVisitedNodes(new Set())
    setAnimationCompleted(false)
  }

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const step = steps[currentStep]
        setMstEdges(step.edges)
        setTotalCost(step.totalCost)
        setCurrentEdge(step.edge || null)
        setVisitedNodes(step.visited || new Set())
        
        if (step.action === 'complete') {
          setIsComplete(true)
          setIsPlaying(false)
          setAnimationCompleted(true)
        }
        
        setCurrentStep(currentStep + 1)
      }, 1500 / speed)
      
      return () => clearTimeout(timer)
    }
  }, [isPlaying, currentStep, steps, speed])

  const currentStepData = steps[currentStep] || {}

  const getEdgeColor = (edge) => {
    if (currentEdge && 
        ((currentEdge.from === edge.from && currentEdge.to === edge.to) ||
         (currentEdge.from === edge.to && currentEdge.to === edge.from))) {
      if (currentStepData.action === 'add') return '#10b981' // green
      if (currentStepData.action === 'reject') return '#ef4444' // red
      return '#3b82f6' // blue
    }
    
    const isInMST = mstEdges.some(e => 
      (e.from === edge.from && e.to === edge.to) ||
      (e.from === edge.to && e.to === edge.from)
    )
    
    return isInMST ? '#10b981' : '#d1d5db'
  }

  const getEdgeWidth = (edge) => {
    if (currentEdge && 
        ((currentEdge.from === edge.from && currentEdge.to === edge.to) ||
         (currentEdge.from === edge.to && currentEdge.to === edge.from))) {
      return 4
    }
    
    const isInMST = mstEdges.some(e => 
      (e.from === edge.from && e.to === edge.to) ||
      (e.from === edge.to && e.to === edge.from)
    )
    
    return isInMST ? 3 : 1
  }

  const isNodeVisited = (nodeId) => {
    return visitedNodes.has(nodeId)
  }

  return (
    <div className="min-h-screen bg-brutal-bg dark:bg-black p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className={`card-brutal bg-gradient-to-r from-${config.color} to-brutal-cyan text-white p-6 text-center`}>
        <h2 className="text-2xl sm:text-3xl font-black uppercase flex items-center justify-center gap-3">
          <MapIcon className="w-8 h-8" />
          MST - MINIMUM SPANNING TREE
        </h2>
        <p className="text-sm sm:text-base font-bold uppercase mt-2">
          Bangun Jaringan Termurah dengan MST!
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
          <li>🎯 <strong>Tujuan:</strong> Hubungkan semua kota dengan biaya minimum</li>
          <li>🌳 <strong>MST:</strong> Spanning Tree = Tree yang menghubungkan semua node</li>
          <li>✅ <strong>HIJAU:</strong> Edge masuk MST</li>
          <li>🔴 <strong>MERAH:</strong> Edge ditolak (bikin cycle)</li>
          <li>🔵 <strong>BIRU:</strong> Edge sedang dicek</li>
          <li><strong>Kruskal:</strong> Sort edge, ambil yang murah (greedy!)</li>
          <li><strong>Prim:</strong> Mulai dari 1 node, tambah tetangga terdekat</li>
        </ul>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Scenario & Algorithm Selector */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card-brutal bg-white dark:bg-gray-900 p-4">
              <h3 className="font-black uppercase text-sm mb-3">Pilih Skenario:</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(SCENARIOS).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setScenario(key)}
                    disabled={isPlaying}
                    className={`btn-brutal ${
                      scenario === key
                        ? `bg-${data.color} text-white`
                        : 'bg-brutal-secondary text-black hover:bg-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed text-xs text-left`}
                  >
                    {data.icon} {data.name.split(' - ')[1]}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-brutal bg-white dark:bg-gray-900 p-4">
              <h3 className="font-black uppercase text-sm mb-3">Algoritma:</h3>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setAlgorithm('kruskal')}
                  disabled={isPlaying}
                  className={`btn-brutal ${
                    algorithm === 'kruskal'
                      ? 'bg-brutal-success text-white'
                      : 'bg-brutal-secondary text-black hover:bg-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed text-xs`}
                >
                  KRUSKAL (Greedy)
                </button>
                <button
                  onClick={() => setAlgorithm('prim')}
                  disabled={isPlaying}
                  className={`btn-brutal ${
                    algorithm === 'prim'
                      ? 'bg-brutal-success text-white'
                      : 'bg-brutal-secondary text-black hover:bg-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed text-xs`}
                >
                  PRIM (Grow Tree)
                </button>
              </div>
            </div>
          </div>

          {/* Graph Visualization */}
          <div className="card-brutal bg-white dark:bg-gray-900 p-4">
            <h3 className="font-black uppercase text-sm mb-3">Jaringan Kota:</h3>
            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
              <svg className="absolute inset-0 w-full h-full">
                {/* Draw edges */}
                {config.edges.map((edge, idx) => {
                  const fromNode = config.nodes.find(n => n.id === edge.from)
                  const toNode = config.nodes.find(n => n.id === edge.to)
                  
                  return (
                    <g key={idx}>
                      <motion.line
                        x1={`${fromNode.x}%`}
                        y1={`${fromNode.y}%`}
                        x2={`${toNode.x}%`}
                        y2={`${toNode.y}%`}
                        stroke={getEdgeColor(edge)}
                        strokeWidth={getEdgeWidth(edge)}
                        initial={{ pathLength: 0 }}
                        animate={{ 
                          pathLength: 1,
                          stroke: getEdgeColor(edge),
                          strokeWidth: getEdgeWidth(edge)
                        }}
                        transition={{ duration: 0.5 }}
                      />
                      {/* Edge weight label */}
                      <text
                        x={`${(fromNode.x + toNode.x) / 2}%`}
                        y={`${(fromNode.y + toNode.y) / 2}%`}
                        fill="white"
                        className="text-[10px] font-black"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan className="bg-black px-1">Rp{edge.weight}</tspan>
                      </text>
                    </g>
                  )
                })}
                
                {/* Draw nodes */}
                {config.nodes.map((node, idx) => (
                  <g key={node.id}>
                    <motion.circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r="20"
                      fill={isNodeVisited(node.id) ? '#10b981' : '#3b82f6'}
                      stroke="#000"
                      strokeWidth="3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    />
                    <text
                      x={`${node.x}%`}
                      y={`${node.y}%`}
                      fill="white"
                      className="text-lg font-black"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {node.icon}
                    </text>
                    <text
                      x={`${node.x}%`}
                      y={`${node.y + 8}%`}
                      fill="black"
                      className="text-[10px] font-black dark:fill-white"
                      textAnchor="middle"
                    >
                      {node.name}
                    </text>
                  </g>
                ))}
              </svg>
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
              <GenericStepsList 
                steps={steps} 
                animationCompleted={animationCompleted}
                algorithmName={algorithm === 'kruskal' ? "Kruskal's MST" : "Prim's MST"}
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
                  <span className="text-brutal-success">{currentStep} / {steps.length}</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 border-2 border-black">
                  <motion.div
                    className="h-full bg-brutal-success"
                    initial={{ width: 0 }}
                    animate={{ width: `${steps.length > 0 ? (currentStep / steps.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cost Status */}
          <div className="card-brutal bg-brutal-success text-white p-4">
            <h3 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5" />
              Total Biaya
            </h3>
            <div className="text-center">
              <p className="text-4xl font-black flex items-center justify-center gap-2">
                Rp{totalCost}
              </p>
              <p className="text-sm font-bold mt-1">{config.unit}</p>
            </div>
            <div className="mt-4 space-y-2 text-xs font-bold">
              <div className="flex justify-between">
                <span>Edge Terpilih:</span>
                <span>{mstEdges.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Node Terhubung:</span>
                <span>{visitedNodes.size || config.nodes.length}</span>
              </div>
            </div>
          </div>

          {/* MST Edges */}
          {mstEdges.length > 0 && (
            <div className="card-brutal bg-white dark:bg-gray-900 p-4">
              <h3 className="font-black uppercase text-sm mb-3">Koneksi Terpilih:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {mstEdges.map((edge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center justify-between p-2 bg-brutal-success/20 border-2 border-brutal-success"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-brutal-success" />
                      <span className="font-black text-xs">
                        {edge.from} ↔ {edge.to}
                      </span>
                    </div>
                    <span className="text-xs font-bold">Rp{edge.weight}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="card-brutal bg-brutal-warning text-black p-4">
            <h3 className="font-black uppercase text-sm mb-2 flex items-center gap-2">
              <InformationCircleIcon className="w-5 h-5" />
              Info MST
            </h3>
            <div className="text-xs font-bold space-y-2">
              <p><strong>Kruskal:</strong></p>
              <p>• Sort semua edge by weight</p>
              <p>• Pilih edge termurah</p>
              <p>• Cek cycle dengan Union-Find</p>
              <p className="mt-2"><strong>Prim:</strong></p>
              <p>• Mulai dari 1 node</p>
              <p>• Tambah tetangga terdekat</p>
              <p>• Grow tree step by step</p>
              <p className="text-[10px] opacity-80 mt-2">
                Complexity: O(E log E)
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
              <TrophyIcon className="w-20 h-20 mx-auto mb-4 text-brutal-warning" />
              <h3 className="text-3xl font-black uppercase mb-4">JARINGAN TERBANGUN! {config.icon}</h3>
              <div className="space-y-3 text-lg font-bold">
                <p className="flex items-center justify-center gap-2">
                  Total Biaya: 
                  <span className="text-4xl flex items-center">
                    <CurrencyDollarIcon className="w-8 h-8" />
                    {totalCost}
                  </span>
                </p>
                <p className="text-sm">{config.unit}</p>
                <p>Koneksi: {mstEdges.length} jalur</p>
                <p>Kota Terhubung: {config.nodes.length}</p>
                <p className="text-sm opacity-90 mt-4">
                  {algorithm === 'kruskal' ? '🌳 Kruskal Algorithm' : '🌱 Prim Algorithm'}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="btn-brutal bg-white text-black hover:bg-gray-200 mt-6 w-full"
              >
                Coba Lagi!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
