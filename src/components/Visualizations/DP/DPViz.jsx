import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DPStepsList from '../../Common/DPStepsList'
import PlaybackControls from '../../Common/PlaybackControls'
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  BoltIcon,
  InformationCircleIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  StarIcon,
  LightBulbIcon,
  TrophyIcon,
  ViewColumnsIcon,
  ListBulletIcon
} from '@heroicons/react/24/solid'

// Item presets for different scenarios
const SCENARIOS = {
  traveling: {
    name: 'TRAVELING - Nyusun Tas',
    capacity: 10,
    type: 'knapsack',
    items: [
      { id: 1, name: 'Laptop', weight: 4, value: 500, icon: '💻' },
      { id: 2, name: 'Kamera', weight: 3, value: 400, icon: '📷' },
      { id: 3, name: 'Buku', weight: 2, value: 150, icon: '📚' },
      { id: 4, name: 'Pakaian', weight: 5, value: 100, icon: '👕' },
      { id: 5, name: 'Snack', weight: 1, value: 50, icon: '🍪' },
    ]
  },
  treasure: {
    name: 'TREASURE HUNT - Cari Harta',
    capacity: 15,
    type: 'knapsack',
    items: [
      { id: 1, name: 'Emas', weight: 8, value: 1000, icon: '💰' },
      { id: 2, name: 'Berlian', weight: 3, value: 800, icon: '💎' },
      { id: 3, name: 'Mutiara', weight: 2, value: 400, icon: '📿' },
      { id: 4, name: 'Perak', weight: 5, value: 300, icon: '🪙' },
      { id: 5, name: 'Ruby', weight: 4, value: 600, icon: '💍' },
      { id: 6, name: 'Kristal', weight: 3, value: 250, icon: '🔮' },
    ]
  },
  shopping: {
    name: 'SHOPPING - Belanja Hemat',
    capacity: 8,
    type: 'knapsack',
    items: [
      { id: 1, name: 'Smartphone', weight: 2, value: 400, icon: '📱' },
      { id: 2, name: 'Headphone', weight: 1, value: 150, icon: '🎧' },
      { id: 3, name: 'Sepatu', weight: 3, value: 200, icon: '👟' },
      { id: 4, name: 'Jam', weight: 1, value: 300, icon: '⌚' },
      { id: 5, name: 'Tas', weight: 2, value: 180, icon: '🎒' },
    ]
  },
  dungeon: {
    name: 'DUNGEON - Cari Jalur Terbaik',
    type: 'grid',
    size: 6,
    grid: [
      [3, 2, 1, 4, 2, 5],
      [1, 4, 3, 2, 5, 1],
      [2, 1, 5, 3, 1, 4],
      [4, 3, 2, 1, 4, 2],
      [1, 2, 4, 3, 2, 3],
      [3, 1, 2, 5, 1, 10]
    ],
    icons: {
      start: '🧙',
      end: '👑',
      coin: '💰',
      path: '🔥'
    }
  }
}

export default function DPViz() {
  const [scenario, setScenario] = useState('traveling')
  const [config, setConfig] = useState(SCENARIOS.traveling)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(3)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [dpTable, setDpTable] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [currentCell, setCurrentCell] = useState({ i: -1, j: -1 })
  const [isComplete, setIsComplete] = useState(false)
  const [totalValue, setTotalValue] = useState(0)
  const [totalWeight, setTotalWeight] = useState(0)
  const [viewMode, setViewMode] = useState('step')
  const [animationCompleted, setAnimationCompleted] = useState(false)
  const [path, setPath] = useState([])

  useEffect(() => {
    setConfig(SCENARIOS[scenario])
    handleReset()
  }, [scenario])

  const generateDPSteps = () => {
    const items = config.items
    const capacity = config.capacity
    const n = items.length
    const steps = []
    
    // Initialize DP table
    const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0))
    
    steps.push({
      action: 'init',
      table: dp.map(row => [...row]),
      cell: { i: 0, j: 0 },
      message: 'Inisialisasi tabel DP! Baris = Item, Kolom = Kapasitas'
    })

    // Fill DP table
    for (let i = 1; i <= n; i++) {
      const item = items[i - 1]
      
      for (let w = 0; w <= capacity; w++) {
        steps.push({
          action: 'check',
          table: dp.map(row => [...row]),
          cell: { i, j: w },
          item: item,
          message: `Cek ${item.name} (Berat: ${item.weight}kg, Nilai: $${item.value}) untuk kapasitas ${w}kg`
        })

        if (item.weight > w) {
          // Can't include item
          dp[i][w] = dp[i - 1][w]
          steps.push({
            action: 'skip',
            table: dp.map(row => [...row]),
            cell: { i, j: w },
            item: item,
            message: `❌ Terlalu berat! ${item.name} (${item.weight}kg) > kapasitas (${w}kg). Ambil nilai sebelumnya.`
          })
        } else {
          // Choose max: include or exclude
          const exclude = dp[i - 1][w]
          const include = dp[i - 1][w - item.weight] + item.value
          
          if (include > exclude) {
            dp[i][w] = include
            steps.push({
              action: 'include',
              table: dp.map(row => [...row]),
              cell: { i, j: w },
              item: item,
              decision: { include, exclude },
              message: `✅ Ambil ${item.name}! Nilai jadi $${include} (lebih baik dari $${exclude})`
            })
          } else {
            dp[i][w] = exclude
            steps.push({
              action: 'exclude',
              table: dp.map(row => [...row]),
              cell: { i, j: w },
              item: item,
              decision: { include, exclude },
              message: `➖ Lewati ${item.name}. Nilai $${exclude} sudah optimal (include: $${include})`
            })
          }
        }
      }
    }

    // Backtrack to find selected items
    const selected = []
    let w = capacity
    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selected.push(items[i - 1])
        w -= items[i - 1].weight
        
        steps.push({
          action: 'backtrack',
          table: dp.map(row => [...row]),
          cell: { i, j: w },
          item: items[i - 1],
          selected: [...selected],
          message: `🔙 Backtrack: ${items[i - 1].name} masuk tas!`
        })
      }
    }

    steps.push({
      action: 'complete',
      table: dp.map(row => [...row]),
      cell: { i: n, j: capacity },
      selected: selected,
      totalValue: dp[n][capacity],
      totalWeight: selected.reduce((sum, item) => sum + item.weight, 0),
      message: `🎉 SELESAI! Total nilai: $${dp[n][capacity]}`
    })

    return { steps, finalTable: dp, selected }
  }

  const generateDungeonSteps = () => {
    const grid = config.grid
    const n = grid.length
    const m = grid[0].length
    const steps = []
    
    // Initialize DP table for max coins
    const dp = Array(n).fill(0).map(() => Array(m).fill(0))
    dp[0][0] = grid[0][0]
    
    steps.push({
      action: 'init',
      table: dp.map(row => [...row]),
      cell: { i: 0, j: 0 },
      path: [],
      message: `🧙 Mulai dari posisi (0,0)! Koin: ${grid[0][0]} 💰`
    })

    // Fill first row - only can go right
    for (let j = 1; j < m; j++) {
      dp[0][j] = dp[0][j-1] + grid[0][j]
      steps.push({
        action: 'fill_row',
        table: dp.map(row => [...row]),
        cell: { i: 0, j },
        path: [],
        message: `➡️ Gerak ke kanan (0,${j}). Total koin: ${dp[0][j]} 💰`
      })
    }

    // Fill first column - only can go down
    for (let i = 1; i < n; i++) {
      dp[i][0] = dp[i-1][0] + grid[i][0]
      steps.push({
        action: 'fill_col',
        table: dp.map(row => [...row]),
        cell: { i, j: 0 },
        path: [],
        message: `⬇️ Gerak ke bawah (${i},0). Total koin: ${dp[i][0]} 💰`
      })
    }

    // Fill rest of table
    for (let i = 1; i < n; i++) {
      for (let j = 1; j < m; j++) {
        const fromTop = dp[i-1][j]
        const fromLeft = dp[i][j-1]
        const maxPrev = Math.max(fromTop, fromLeft)
        dp[i][j] = maxPrev + grid[i][j]
        
        const direction = fromTop > fromLeft ? '⬇️ dari atas' : '➡️ dari kiri'
        
        steps.push({
          action: 'compute',
          table: dp.map(row => [...row]),
          cell: { i, j },
          path: [],
          comparison: { fromTop, fromLeft },
          message: `🔍 Posisi (${i},${j}): Max(${fromTop}, ${fromLeft}) + ${grid[i][j]} = ${dp[i][j]} 💰 ${direction}`
        })
      }
    }

    // Backtrack to find path
    const path = []
    let i = n - 1
    let j = m - 1
    path.push({ i, j })

    while (i > 0 || j > 0) {
      if (i === 0) {
        j--
      } else if (j === 0) {
        i--
      } else if (dp[i-1][j] > dp[i][j-1]) {
        i--
      } else {
        j--
      }
      path.unshift({ i, j })
      
      steps.push({
        action: 'backtrack',
        table: dp.map(row => [...row]),
        cell: { i, j },
        path: [...path],
        message: `🔙 Backtrack: Jalur terbaik melalui (${i},${j})`
      })
    }

    steps.push({
      action: 'complete',
      table: dp.map(row => [...row]),
      cell: { i: n-1, j: m-1 },
      path: [...path],
      totalValue: dp[n-1][m-1],
      message: `🎉 SELESAI! 👑 Total koin terkumpul: ${dp[n-1][m-1]} 💰`
    })

    return { steps, finalTable: dp, path, totalValue: dp[n-1][m-1] }
  }

  const handlePlay = () => {
    if (steps.length === 0) {
      if (config.type === 'grid') {
        const { steps: newSteps } = generateDungeonSteps()
        setSteps(newSteps)
      } else {
        const { steps: newSteps } = generateDPSteps()
        setSteps(newSteps)
      }
    }
    setIsPlaying(true)
  }

  const handlePause = () => setIsPlaying(false)

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setSteps([])
    setDpTable([])
    setSelectedItems([])
    setCurrentCell({ i: -1, j: -1 })
    setIsComplete(false)
    setTotalValue(0)
    setTotalWeight(0)
    setAnimationCompleted(false)
    setPath([])
  }

  const handleStepForward = () => {
    if (currentStep < steps.length) {
      const step = steps[currentStep]
      setDpTable(step.table)
      setCurrentCell(step.cell)
      
      if (step.action === 'backtrack' || step.action === 'complete') {
        setSelectedItems(step.selected || [])
      }
      
      if (step.action === 'complete') {
        setIsComplete(true)
        setAnimationCompleted(true)
        setTotalValue(step.totalValue)
        setTotalWeight(step.totalWeight)
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
        setDpTable(step.table)
        setCurrentCell(step.cell)
        
        if (step.action === 'backtrack' || step.action === 'complete') {
          setSelectedItems(step.selected || [])
        }
      } else {
        setDpTable([])
        setCurrentCell({ i: -1, j: -1 })
        setSelectedItems([])
      }
      
      setIsComplete(false)
      setAnimationCompleted(false)
    }
  }

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const step = steps[currentStep]
        setDpTable(step.table)
        setCurrentCell(step.cell)
        setPath(step.path || [])
        
        if (step.action === 'backtrack' || step.action === 'complete') {
          setSelectedItems(step.selected || [])
          setPath(step.path || [])
        }
        
        if (step.action === 'complete') {
          setIsComplete(true)
          setIsPlaying(false)
          setAnimationCompleted(true)
          setTotalValue(step.totalValue)
          setTotalWeight(step.totalWeight)
        }
        
        setCurrentStep(currentStep + 1)
      }, 1200 / speed)
      
      return () => clearTimeout(timer)
    }
  }, [isPlaying, currentStep, steps, speed])

  const currentStepData = steps[currentStep] || {}

  const getCellColor = (i, j, value) => {
    if (i === currentCell.i && j === currentCell.j) {
      if (currentStepData.action === 'include') return 'bg-brutal-success text-white animate-pulse'
      if (currentStepData.action === 'exclude') return 'bg-brutal-warning text-black'
      if (currentStepData.action === 'skip') return 'bg-brutal-danger text-white'
      return 'bg-brutal-primary text-white animate-pulse'
    }
    
    if (value > 0) return 'bg-brutal-cyan/30 text-black dark:text-white'
    return 'bg-white dark:bg-gray-800 text-black dark:text-white'
  }

  return (
    <div className="min-h-screen bg-brutal-bg dark:bg-black p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="card-brutal bg-gradient-to-r from-brutal-success to-brutal-warning text-white p-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-black uppercase flex items-center justify-center gap-3">
          <ShoppingBagIcon className="w-8 h-8" />
          DYNAMIC PROGRAMMING - KNAPSACK
        </h2>
        <p className="text-sm sm:text-base font-bold uppercase mt-2">
          Optimasi Isi Tas dengan Memoization!
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
        {config.type === 'knapsack' ? (
          <ul className="text-xs font-bold space-y-1">
            <li>🎯 <strong>Tujuan:</strong> Maksimalkan nilai barang dalam tas dengan kapasitas terbatas</li>
            <li>📊 <strong>Tabel DP:</strong> Baris = Item, Kolom = Kapasitas (kg)</li>
            <li>✅ <strong>HIJAU:</strong> Item dimasukkan tas (include)</li>
            <li>⚠️ <strong>KUNING:</strong> Item dilewati (exclude)</li>
            <li>❌ <strong>MERAH:</strong> Terlalu berat (skip)</li>
            <li>🔙 <strong>Backtrack:</strong> Cari item mana aja yang optimal!</li>
          </ul>
        ) : (
          <ul className="text-xs font-bold space-y-1">
            <li>🧙 <strong>Tujuan:</strong> Cari jalur dari START ke GOAL dengan koin maksimal!</li>
            <li>📊 <strong>Tabel DP:</strong> dp[i][j] = max koin sampai posisi (i,j)</li>
            <li>➡️ <strong>Gerak:</strong> Hanya bisa ke KANAN atau ke BAWAH</li>
            <li>💰 <strong>Formula:</strong> dp[i][j] = max(dari atas, dari kiri) + koin[i][j]</li>
            <li>🔥 <strong>HIJAU:</strong> Jalur optimal yang dipilih</li>
            <li>👑 <strong>Goal:</strong> Kumpulkan koin sebanyak mungkin!</li>
          </ul>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Scenario Selector */}
          <div className="card-brutal bg-brutal-bg dark:bg-gray-900 p-4">
            <h3 className="font-black uppercase text-sm mb-3">Pilih Skenario:</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(SCENARIOS).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setScenario(key)}
                  disabled={isPlaying}
                  className={`btn-brutal ${
                    scenario === key
                      ? 'bg-brutal-success text-white'
                      : 'bg-brutal-secondary text-black hover:bg-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm`}
                >
                  {data.name.split(' - ')[0]}
                </button>
              ))}
            </div>
            <p className="text-xs font-bold mt-2 opacity-70">
              Skenario: {config.name}
            </p>
            {config.type === 'knapsack' && (
              <p className="text-xs font-bold mt-1 flex items-center gap-2">
                <ScaleIcon className="w-4 h-4 text-brutal-primary" />
                Kapasitas Tas: {config.capacity}kg
              </p>
            )}
            {config.type === 'grid' && (
              <p className="text-xs font-bold mt-1">
                🧙 Start → 👑 Goal | Kumpulkan 💰 maksimal!
              </p>
            )}
          </div>

          {/* Dungeon Grid Visualization */}
          {config.type === 'grid' && (
            <div className="card-brutal bg-black p-4">
              <h3 className="font-black uppercase text-sm mb-3 text-white">Dungeon Maze:</h3>
              <div className="grid gap-1" style={{
                gridTemplateColumns: `repeat(${config.size}, 1fr)`,
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                {config.grid.map((row, i) => 
                  row.map((coins, j) => {
                    const isStart = i === 0 && j === 0
                    const isEnd = i === config.size - 1 && j === config.size - 1
                    const isCurrent = currentCell.i === i && currentCell.j === j
                    const isInPath = path.some(p => p.i === i && p.j === j)
                    const cellValue = dpTable[i]?.[j] || 0
                    
                    return (
                      <motion.div
                        key={`${i}-${j}`}
                        className={`aspect-square border-2 border-gray-700 flex flex-col items-center justify-center text-xs font-black transition-all ${
                          isCurrent
                            ? 'bg-brutal-primary text-white scale-110 z-10'
                            : isInPath
                            ? 'bg-brutal-success text-white'
                            : isStart
                            ? 'bg-brutal-cyan text-white'
                            : isEnd
                            ? 'bg-brutal-warning text-black'
                            : 'bg-gray-800 text-white'
                        }`}
                        animate={{
                          scale: isCurrent ? 1.1 : 1
                        }}
                      >
                        <span className="text-2xl">
                          {isStart ? config.icons.start : isEnd ? config.icons.end : isInPath ? config.icons.path : config.icons.coin}
                        </span>
                        <span className="text-[10px] mt-1">{coins}</span>
                        {cellValue > 0 && (
                          <span className="text-[8px] font-black text-brutal-warning">{cellValue}</span>
                        )}
                      </motion.div>
                    )
                  })
                )}
              </div>
            </div>
          )}

          {/* Items Display - Only for knapsack */}
          {config.type === 'knapsack' && (
            <div className="card-brutal bg-brutal-bg dark:bg-gray-900 p-4">
              <h3 className="font-black uppercase text-sm mb-3">Barang Tersedia:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {config.items.map((item) => {
                const isSelected = selectedItems.some(s => s.id === item.id)
                const isCurrent = currentStepData.item?.id === item.id
                
                return (
                  <motion.div
                    key={item.id}
                    className={`card-brutal p-3 transition-all ${
                      isSelected
                        ? 'bg-brutal-success text-white scale-105'
                        : isCurrent
                        ? 'bg-brutal-primary text-white scale-105'
                        : 'bg-brutal-bg dark:bg-gray-800'
                    }`}
                    animate={{
                      scale: isCurrent ? 1.05 : isSelected ? 1.02 : 1
                    }}
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="font-black text-xs mb-1">{item.name}</p>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span>⚖️ {item.weight}kg</span>
                      <span className="text-brutal-warning">💰${item.value}</span>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2"
                      >
                        <CheckCircleIcon className="w-5 h-5 mx-auto" />
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
          )}

          {/* DP Table */}
          <div className="card-brutal bg-brutal-bg dark:bg-gray-900 p-4">
            <h3 className="font-black uppercase text-sm mb-3">Tabel Dynamic Programming:</h3>
            {dpTable.length > 0 ? (
              <div className="overflow-x-auto">
                {config.type === 'knapsack' ? (
                  <table className="w-full text-xs font-black border-collapse">
                    <thead>
                      <tr>
                        <th className="border-2 border-black dark:border-white p-1 bg-brutal-secondary">Item</th>
                        {Array.from({ length: config.capacity + 1 }, (_, i) => (
                          <th key={i} className="border-2 border-black dark:border-white p-1 bg-brutal-secondary">
                            {i}kg
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dpTable.map((row, i) => (
                        <tr key={i}>
                          <td className="border-2 border-black dark:border-white p-1 bg-brutal-secondary text-center">
                            {i === 0 ? '∅' : config.items[i - 1]?.icon}
                          </td>
                            {row.map((value, j) => (
                              <td
                                key={j}
                                className={`border-2 border-black dark:border-white p-1 text-center transition-all ${getCellColor(
                                  i,
                                  j,
                                  value
                                )}`}
                              >
                                ${value}
                              </td>
                            ))}
                          </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-xs font-black border-collapse">
                    <thead>
                      <tr>
                        <th className="border-2 border-black dark:border-white p-1 bg-brutal-secondary">Pos</th>
                        {Array.from({ length: config.size }, (_, j) => (
                          <th key={j} className="border-2 border-black dark:border-white p-1 bg-brutal-secondary">
                            Col {j}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dpTable.map((row, i) => (
                        <tr key={i}>
                          <td className="border-2 border-black dark:border-white p-1 bg-brutal-secondary text-center">
                            Row {i}
                          </td>
                          {row.map((value, j) => (
                            <td
                              key={j}
                              className={`border-2 border-black dark:border-white p-1 text-center transition-all ${getCellColor(
                                i,
                                j,
                                value
                              )}`}
                            >
                              💰{value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-sm font-bold opacity-50">
                Tabel akan muncul saat simulasi dimulai
              </div>
            )}
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

          {/* View Mode Toggle */}
          <div className="card-brutal bg-brutal-bg dark:bg-gray-900 p-4 mt-4">
            <div className="flex items-center gap-3">
              <span className="font-black uppercase text-sm">Mode Tampilan:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('step')}
                  className={`btn-brutal px-4 py-2 font-black uppercase text-sm ${
                    viewMode === 'step'
                      ? 'bg-brutal-primary text-white'
                      : 'bg-brutal-bg dark:bg-gray-900 text-black dark:text-white'
                  }`}
                >
                  Step-by-Step
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`btn-brutal px-4 py-2 font-black uppercase text-sm ${
                    viewMode === 'list'
                      ? 'bg-brutal-primary text-white'
                      : 'bg-brutal-bg dark:bg-gray-900 text-black dark:text-white'
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
              <DPStepsList 
                steps={steps} 
                animationCompleted={animationCompleted}
              />
            </div>
          )}
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          {/* Progress */}
          <div className="card-brutal bg-brutal-bg dark:bg-gray-900 p-4">
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

          {/* Current Status */}
          <div className="card-brutal bg-brutal-success text-white p-4">
            <h3 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
              <ShoppingBagIcon className="w-5 h-5" />
              Status Tas
            </h3>
            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between">
                <span>Item Terpilih:</span>
                <span>{selectedItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Berat:</span>
                <span>{selectedItems.reduce((sum, item) => sum + item.weight, 0)}kg / {config.capacity}kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Nilai:</span>
                <span className="text-lg flex items-center gap-1">
                  <CurrencyDollarIcon className="w-4 h-4" />
                  {selectedItems.reduce((sum, item) => sum + item.value, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Selected Items */}
          {selectedItems.length > 0 && (
            <div className="card-brutal bg-white dark:bg-gray-900 p-4">
              <h3 className="font-black uppercase text-sm mb-3">Barang di Tas:</h3>
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-2 p-2 bg-brutal-cyan/20 border-2 border-brutal-cyan"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-black text-xs">{item.name}</p>
                      <p className="text-[10px] font-bold">{item.weight}kg • ${item.value}</p>
                    </div>
                    <CheckCircleIcon className="w-4 h-4 text-brutal-success" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="card-brutal bg-brutal-warning text-black p-4">
            <h3 className="font-black uppercase text-sm mb-2 flex items-center gap-2">
              <InformationCircleIcon className="w-5 h-5" />
              Info DP
            </h3>
            <div className="text-xs font-bold space-y-2">
              <p>✓ Simpan subproblem (Memoization)</p>
              <p>✓ Hindari perhitungan berulang</p>
              <p>✓ Optimal substructure</p>
              <p>✓ Build solution bottom-up</p>
              <p className="text-[10px] opacity-80 mt-2">
                Complexity: O(n × W)
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
              <h3 className="text-3xl font-black uppercase mb-4">SOLUSI OPTIMAL! 🎉</h3>
              <div className="space-y-3 text-lg font-bold">
                <p className="flex items-center justify-center gap-2">
                  Total Nilai: 
                  <span className="text-4xl flex items-center">
                    <CurrencyDollarIcon className="w-8 h-8" />
                    {totalValue}
                  </span>
                </p>
                <p>Berat Total: {totalWeight}kg / {config.capacity}kg</p>
                <p>Item: {selectedItems.length} barang</p>
                <div className="flex gap-1 justify-center mt-4 flex-wrap">
                  {selectedItems.map(item => (
                    <span key={item.id} className="text-3xl">{item.icon}</span>
                  ))}
                </div>
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
