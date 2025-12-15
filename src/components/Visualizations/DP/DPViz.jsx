import { useState } from 'react'
import { motion } from 'framer-motion'
import ControlPanel from '../../Common/ControlPanel'
import Sidebar from '../../Layout/Sidebar'

export default function DPViz() {
  const [mode, setMode] = useState('knapsack') // 'knapsack' | 'lcs'
  const [table, setTable] = useState([])
  const [highlight, setHighlight] = useState({ i: -1, j: -1 })
  const [explanation, setExplanation] = useState('')

  const buildKnapsack = () => {
    // placeholder: build a small DP table 4x6
    const rows = 5, cols = 7
    const t = Array.from({ length: rows }, () => Array(cols).fill(0))
    const steps = []
    for (let i = 1; i < rows; i++) {
      for (let w = 1; w < cols; w++) {
        steps.push({ i, j: w, val: (i * w) % 10 })
      }
    }
    return { t, steps }
  }

  const buildLCS = () => {
    const rows = 6, cols = 6
    const t = Array.from({ length: rows }, () => Array(cols).fill(0))
    const steps = []
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        steps.push({ i, j, val: (i === j ? 1 : 0) })
      }
    }
    return { t, steps }
  }

  const handlePlay = async () => {
    setExplanation('')
    try {
      if (mode === 'knapsack') {
        const res = await fetch('http://localhost:8000/algorithms/dp/knapsack', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ capacity: 7, items: [ { weight: 3, value: 4 }, { weight: 4, value: 5 }, { weight: 2, value: 3 } ] })
        })
        const data = await res.json()
        setTable(data.table || [])
        setExplanation('Knapsack: tabel dari backend terisi, kombinasi barang optimal dihitung.')
      } else {
        const res = await fetch('http://localhost:8000/algorithms/dp/lcs', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ a: 'ABCBDAB', b: 'BDCABA' })
        })
        const data = await res.json()
        setTable(data.table || [])
        setExplanation(`LCS: hasil dari backend, subsekuens: ${data.lcs || ''}`)
      }
    } catch (e) {
      setExplanation('Gagal memanggil API DP. Pastikan backend berjalan.')
    }
  }

  const handleReset = () => {
    setTable([])
    setHighlight({ i: -1, j: -1 })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight border-b-3 sm:border-b-4 border-black dark:border-brutal-bg pb-3 sm:pb-4">
        DYNAMIC PROGRAMMING
        <span className="block text-lg sm:text-xl lg:text-2xl mt-2 text-brutal-primary">OPTIMAL SUBSTRUCTURE LAB</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['knapsack', 'lcs'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`btn-brutal px-4 py-2 font-black shadow-brutal-sm ${mode === m ? 'bg-brutal-primary text-white' : 'bg-brutal-bg dark:bg-brutal-dark'}`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          <ControlPanel
            isPlaying={false}
            onPlay={handlePlay}
            onPause={() => {}}
            onReset={handleReset}
            onRandomize={() => {}}
            speed={5}
            onSpeedChange={() => {}}
            arraySize={0}
            onArraySizeChange={() => {}}
          />

          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 overflow-auto">
            <div className="inline-block border-3 border-black dark:border-brutal-bg">
              {table.length ? (
                <div className="grid" style={{ gridTemplateColumns: `repeat(${table[0].length}, minmax(40px, 1fr))` }}>
                  {table.map((row, i) =>
                    row.map((val, j) => (
                      <motion.div key={`${i}-${j}`} className={`p-2 text-center border-2 border-black dark:border-brutal-bg ${highlight.i === i && highlight.j === j ? 'bg-brutal-warning' : 'bg-white dark:bg-black'}`}>
                        <span className="text-xs sm:text-sm font-black">{val}</span>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <div className="p-6 text-sm font-black opacity-70">PRESS PLAY TO FILL DP TABLE</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:block">
          <Sidebar complexity={{ time: 'O(n*m)', space: 'O(n*m)' }}>
            <p className="text-xs sm:text-sm uppercase">
              DP MEMOIZES SUBPROBLEMS; TABLE SHOWS TRANSITIONS AND RECONSTRUCTION.
            </p>
            {explanation && (
              <div className="mt-3 p-3 border-3 border-black dark:border-brutal-bg bg-white dark:bg-black shadow-brutal-sm">
                <p className="text-xs sm:text-sm font-black uppercase">HASIL</p>
                <p className="text-xs sm:text-sm">{explanation}</p>
              </div>
            )}
          </Sidebar>
        </div>
      </div>
    </div>
  )
}
