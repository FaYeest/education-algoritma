import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GenericStepsList from '../../Common/GenericStepsList'
import PlaybackControls from '../../Common/PlaybackControls'
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
  WifiIcon,
  ViewColumnsIcon,
  ListBulletIcon
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
  },
  custom: {
    name: 'CUSTOM - CUSTOM',
    icon: '🎨',
    unit: 'Unit',
    color: 'brutal-success',
    nodes: [],
    edges: []
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
  
  // Custom graph builder states
  const [isEditMode, setIsEditMode] = useState(false)
  const [editTool, setEditTool] = useState('node') // 'node', 'edge', 'delete'
  const [selectedNode, setSelectedNode] = useState(null)
  const [tempEdge, setTempEdge] = useState(null)
  const [nodeCounter, setNodeCounter] = useState(0)
  
  // Weight input modal states
  const [showWeightModal, setShowWeightModal] = useState(false)
  const [weightInput, setWeightInput] = useState('5')
  const [pendingEdge, setPendingEdge] = useState(null)
  const [modalMode, setModalMode] = useState('create') // 'create' or 'edit'

  useEffect(() => {
    setConfig(SCENARIOS[scenario])
    setIsEditMode(scenario === 'custom')
    if (scenario !== 'custom') {
      setSelectedNode(null)
      setTempEdge(null)
    }
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

    const getNodeName = (nodeId) => {
      const node = config.nodes.find(n => n.id === nodeId)
      return node ? node.name : nodeId
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
      const fromName = getNodeName(edge.from)
      const toName = getNodeName(edge.to)
      
      steps.push({
        action: 'check',
        edge: edge,
        message: `🔍 Cek edge ${fromName}-${toName} (Rp${edge.weight} ${config.unit})`,
        edges: [...mstEdges],
        totalCost: totalCost
      })
      
      if (union(edge.from, edge.to)) {
        mstEdges.push(edge)
        totalCost += edge.weight
        steps.push({
          action: 'add',
          edge: edge,
          message: `✅ Tambah ${fromName}-${toName}! Tidak bikin cycle. Total: Rp${totalCost} ${config.unit}`,
          edges: [...mstEdges],
          totalCost: totalCost
        })
      } else {
        steps.push({
          action: 'reject',
          edge: edge,
          message: `❌ Tolak ${fromName}-${toName}! Bikin cycle (${fromName} dan ${toName} sudah terhubung)`,
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

    const getNodeName = (nodeId) => {
      const node = config.nodes.find(n => n.id === nodeId)
      return node ? node.name : nodeId
    }
    
    // Start from first node
    const startNode = config.nodes[0].id
    const startNodeName = getNodeName(startNode)
    visited.add(startNode)
    
    steps.push({
      action: 'init',
      message: `🚀 Mulai Prim dari ${startNodeName}! Tambah node terdekat satu per satu.`,
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
        const fromName = getNodeName(minEdge.from)
        const toName = getNodeName(minEdge.to)
        const newNodeName = getNodeName(newNode)
        
        steps.push({
          action: 'check',
          edge: minEdge,
          message: `🔍 Cek edge terdekat: ${fromName}-${toName} (Rp${minEdge.weight} ${config.unit})`,
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
          message: `✅ Tambah ${fromName}-${toName}! Node ${newNodeName} terhubung. Total: Rp${totalCost} ${config.unit}`,
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

  const handleStepForward = () => {
    if (currentStep < steps.length) {
      const step = steps[currentStep]
      setMstEdges(step.edges)
      setTotalCost(step.totalCost)
      setCurrentEdge(step.edge || null)
      setVisitedNodes(step.visited || new Set())
      
      if (step.action === 'complete') {
        setIsComplete(true)
        setAnimationCompleted(true)
      }
      
      setCurrentStep(currentStep + 1)
    }
  }

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      
      if (prevStep > 0) {
        const step = steps[prevStep - 1]
        setMstEdges(step.edges)
        setTotalCost(step.totalCost)
        setCurrentEdge(step.edge || null)
        setVisitedNodes(step.visited || new Set())
      } else {
        setMstEdges([])
        setTotalCost(0)
        setCurrentEdge(null)
        setVisitedNodes(new Set())
      }
      
      setIsComplete(false)
      setAnimationCompleted(false)
    }
  }

  // Custom graph builder functions
  const handleCanvasClick = (e) => {
    if (!isEditMode || isPlaying) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    if (editTool === 'node') {
      // Add new node
      const newNode = {
        id: String.fromCharCode(65 + nodeCounter), // A, B, C, ...
        name: `Node ${String.fromCharCode(65 + nodeCounter)}`,
        x: x,
        y: y,
        icon: '🔵'
      }
      
      setConfig({
        ...config,
        nodes: [...config.nodes, newNode]
      })
      setNodeCounter(nodeCounter + 1)
    }
  }

  const handleNodeClick = (nodeId, e) => {
    if (!isEditMode || isPlaying) return
    e.stopPropagation()
    
    if (editTool === 'edge') {
      if (!selectedNode) {
        // Select first node
        setSelectedNode(nodeId)
      } else if (selectedNode !== nodeId) {
        // Open modal to create edge between selected node and clicked node
        setPendingEdge({
          from: selectedNode,
          to: nodeId,
          weight: 5
        })
        setWeightInput('5')
        setModalMode('create')
        setShowWeightModal(true)
      } else {
        // Clicked same node, cancel
        setSelectedNode(null)
      }
    } else if (editTool === 'delete') {
      // Delete node and all connected edges
      setConfig({
        ...config,
        nodes: config.nodes.filter(n => n.id !== nodeId),
        edges: config.edges.filter(e => e.from !== nodeId && e.to !== nodeId)
      })
    } else if (editTool === 'node') {
      // Edit node name - keep using prompt for simplicity
      const node = config.nodes.find(n => n.id === nodeId)
      const newName = prompt(`Ubah nama node ${nodeId}:`, node.name)
      if (newName) {
        setConfig({
          ...config,
          nodes: config.nodes.map(n => 
            n.id === nodeId ? { ...n, name: newName } : n
          )
        })
      }
    }
  }

  const handleEdgeClick = (edge, e) => {
    if (!isEditMode || isPlaying) return
    e.stopPropagation()
    
    if (editTool === 'delete') {
      // Delete edge
      setConfig({
        ...config,
        edges: config.edges.filter(e => 
          !(e.from === edge.from && e.to === edge.to) &&
          !(e.from === edge.to && e.to === edge.from)
        )
      })
    } else if (editTool === 'edge') {
      // Open modal to edit edge weight
      setPendingEdge(edge)
      setWeightInput(String(edge.weight))
      setModalMode('edit')
      setShowWeightModal(true)
    }
  }

  const handleWeightSubmit = () => {
    const weight = parseInt(weightInput)
    if (isNaN(weight) || weight <= 0) {
      alert('Weight harus berupa angka positif!')
      return
    }

    if (modalMode === 'create') {
      // Create new edge
      const newEdge = {
        from: pendingEdge.from,
        to: pendingEdge.to,
        weight: weight
      }
      setConfig({
        ...config,
        edges: [...config.edges, newEdge]
      })
      setSelectedNode(null)
    } else if (modalMode === 'edit') {
      // Edit existing edge
      setConfig({
        ...config,
        edges: config.edges.map(e =>
          (e.from === pendingEdge.from && e.to === pendingEdge.to) ||
          (e.from === pendingEdge.to && e.to === pendingEdge.from)
            ? { ...e, weight: weight }
            : e
        )
      })
    }

    // Close modal
    setShowWeightModal(false)
    setPendingEdge(null)
    setWeightInput('5')
  }

  const handleWeightCancel = () => {
    setShowWeightModal(false)
    setPendingEdge(null)
    setWeightInput('5')
    if (modalMode === 'create') {
      setSelectedNode(null)
    }
  }

  const handleClearGraph = () => {
    setConfig({
      ...config,
      nodes: [],
      edges: []
    })
    setNodeCounter(0)
    setSelectedNode(null)
    handleReset()
  }

  const handleAddSampleNodes = () => {
    const sampleNodes = [
      { id: 'A', name: 'Node A', x: 30, y: 30, icon: '🔵' },
      { id: 'B', name: 'Node B', x: 70, y: 30, icon: '🔵' },
      { id: 'C', name: 'Node C', x: 30, y: 70, icon: '🔵' },
      { id: 'D', name: 'Node D', x: 70, y: 70, icon: '🔵' },
    ]
    setConfig({
      ...config,
      nodes: sampleNodes,
      edges: []
    })
    setNodeCounter(4)
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

  const getNodeName = (nodeId) => {
    const node = config.nodes.find(n => n.id === nodeId)
    return node ? node.name : nodeId
  }

  return (
    <div className="min-h-screen bg-brutal-bg dark:bg-black p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="card-brutal bg-gradient-to-r from-brutal-warning to-brutal-secondary text-white p-6 text-center">
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
            <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
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

            <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
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

          {/* Custom Graph Builder Controls */}
          {isEditMode && (
            <div className="card-brutal bg-green-600 text-white p-4">
              <h3 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5" />
                Mode: Buat Graph Sendiri
              </h3>
              
              <div className="space-y-3">
                {/* Tool Selection */}
                <div>
                  <label className="font-black uppercase text-xs block mb-2">Pilih Tool:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => { setEditTool('node'); setSelectedNode(null); }}
                      className={`btn-brutal px-3 py-2 text-xs font-black uppercase transition-all ${
                        editTool === 'node' 
                          ? 'bg-blue-500 text-white border-4 border-white shadow-lg' 
                          : 'bg-blue-500 text-white opacity-60 hover:opacity-100'
                      }`}
                    >
                      🔵 Node
                    </button>
                    <button
                      onClick={() => setEditTool('edge')}
                      className={`btn-brutal px-3 py-2 text-xs font-black uppercase transition-all ${
                        editTool === 'edge' 
                          ? 'bg-purple-500 text-white border-4 border-white shadow-lg' 
                          : 'bg-purple-500 text-white opacity-60 hover:opacity-100'
                      }`}
                    >
                      ➡️ Edge
                    </button>
                    <button
                      onClick={() => { setEditTool('delete'); setSelectedNode(null); }}
                      className={`btn-brutal px-3 py-2 text-xs font-black uppercase transition-all ${
                        editTool === 'delete' 
                          ? 'bg-red-500 text-white border-4 border-white shadow-lg' 
                          : 'bg-red-500 text-white opacity-60 hover:opacity-100'
                      }`}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Helper Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleClearGraph}
                    className="btn-brutal px-3 py-2 bg-red-500 text-white font-black uppercase text-xs hover:bg-red-600 transition-colors"
                  >
                    🗑️ Clear All
                  </button>
                  <button
                    onClick={handleAddSampleNodes}
                    className="btn-brutal px-3 py-2 bg-blue-500 text-white font-black uppercase text-xs hover:bg-blue-600 transition-colors"
                  >
                    ➕ Sample Nodes
                  </button>
                </div>

                {selectedNode && (
                  <div className="bg-white bg-opacity-20 border-2 border-white p-2 rounded text-center">
                    <p className="text-xs font-black">
                      Node terpilih: <span className="text-yellow-300">{selectedNode}</span>
                    </p>
                    <p className="text-[10px] font-bold">Klik node lain untuk buat edge</p>
                  </div>
                )}

                <div className="bg-white bg-opacity-20 border-2 border-white p-3 rounded">
                  <p className="text-xs font-black mb-2">💡 CARA PAKAI:</p>
                  <ul className="text-xs font-bold space-y-1 list-disc list-inside">
                    <li><span className="text-blue-300">Node</span>: Klik canvas untuk tambah node</li>
                    <li><span className="text-purple-300">Edge</span>: Klik 2 node untuk buat edge</li>
                    <li><span className="text-red-300">Delete</span>: Klik node/edge untuk hapus</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Graph Visualization */}
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
            {isEditMode && (
              <div className="mb-3 text-center">
                <p className="font-black text-sm uppercase">
                  Tool Aktif: 
                  <span className={`ml-2 px-3 py-1 rounded ${
                    editTool === 'node' ? 'bg-blue-500 text-white' :
                    editTool === 'edge' ? 'bg-purple-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {editTool === 'node' ? '🔵 NODE' :
                     editTool === 'edge' ? '➡️ EDGE' :
                     '🗑️ DELETE'}
                  </span>
                </p>
                <p className="text-xs mt-1 opacity-70">
                  Nodes: {config.nodes.length} | Edges: {config.edges.length}
                </p>
              </div>
            )}
            <h3 className="font-black uppercase text-sm mb-3">
              {isEditMode ? 'Canvas Graph:' : 'Jaringan Kota:'}
            </h3>
            <div 
              className="relative w-full bg-white dark:bg-gray-800 rounded border-4 border-black dark:border-white" 
              style={{ paddingBottom: '75%' }}
              onClick={handleCanvasClick}
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Draw edges */}
                {config.edges.map((edge, idx) => {
                  const fromNode = config.nodes.find(n => n.id === edge.from)
                  const toNode = config.nodes.find(n => n.id === edge.to)
                  
                  if (!fromNode || !toNode) return null
                  
                  return (
                    <g 
                      key={idx}
                      className={isEditMode ? 'pointer-events-auto cursor-pointer' : ''}
                      onClick={(e) => handleEdgeClick(edge, e)}
                    >
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
                        fill="black"
                        className="text-[10px] font-black dark:fill-white pointer-events-none"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan className="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">
                          {isEditMode ? edge.weight : `Rp${edge.weight}`}
                        </tspan>
                      </text>
                    </g>
                  )
                })}
                
                {/* Draw nodes */}
                {config.nodes.map((node, idx) => (
                  <g 
                    key={node.id}
                    className={isEditMode ? 'pointer-events-auto cursor-pointer' : ''}
                    onClick={(e) => handleNodeClick(node.id, e)}
                  >
                    <motion.circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r="20"
                      fill={
                        selectedNode === node.id 
                          ? '#f59e0b' 
                          : isNodeVisited(node.id) 
                          ? '#10b981' 
                          : '#3b82f6'
                      }
                      stroke={selectedNode === node.id ? '#fff' : '#000'}
                      strokeWidth={selectedNode === node.id ? '4' : '3'}
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: selectedNode === node.id ? 1.2 : 1
                      }}
                      transition={{ delay: idx * 0.1 }}
                    />
                    <text
                      x={`${node.x}%`}
                      y={`${node.y}%`}
                      fill="white"
                      className="text-lg font-black pointer-events-none"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {node.icon}
                    </text>
                    <text
                      x={`${node.x}%`}
                      y={`${node.y + 8}%`}
                      fill="black"
                      className="text-[10px] font-black dark:fill-white pointer-events-none"
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
          <PlaybackControls
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            disabled={isComplete}
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
          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
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
                        {getNodeName(edge.from)} ↔ {getNodeName(edge.to)}
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

      {/* Weight Input Modal */}
      <AnimatePresence>
        {showWeightModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={handleWeightCancel}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="card-brutal bg-brutal-bg dark:bg-gray-900 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-black uppercase mb-4 text-center">
                {modalMode === 'create' ? '➕ Buat Edge' : '✏️ Edit Weight'}
              </h3>
              
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="px-4 py-2 bg-blue-500 text-white rounded font-black text-lg">
                    {pendingEdge?.from}
                  </div>
                  <span className="text-2xl font-black">→</span>
                  <div className="px-4 py-2 bg-blue-500 text-white rounded font-black text-lg">
                    {pendingEdge?.to}
                  </div>
                </div>
                
                <label className="block font-black uppercase text-sm mb-2">
                  Weight / Bobot:
                </label>
                <input
                  type="number"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleWeightSubmit()
                    }
                  }}
                  className="w-full px-4 py-3 border-3 border-black dark:border-white font-black text-lg text-center rounded focus:outline-none focus:ring-4 focus:ring-brutal-primary"
                  placeholder="Masukkan weight..."
                  min="1"
                  autoFocus
                />
                <p className="text-xs font-bold mt-2 opacity-70 text-center">
                  💡 Tekan Enter untuk submit
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleWeightCancel}
                  className="flex-1 btn-brutal px-6 py-3 bg-brutal-secondary text-black font-black uppercase hover:bg-gray-300 transition-colors"
                >
                  ❌ Batal
                </button>
                <button
                  onClick={handleWeightSubmit}
                  className="flex-1 btn-brutal px-6 py-3 bg-brutal-success text-white font-black uppercase hover:bg-green-600 transition-colors"
                >
                  ✅ {modalMode === 'create' ? 'Buat' : 'Simpan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
