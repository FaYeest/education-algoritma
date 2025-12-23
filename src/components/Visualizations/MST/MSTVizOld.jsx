import { useState } from 'react'
import { motion } from 'framer-motion'
import ControlPanel from '../../Common/ControlPanel'
import Sidebar from '../../Layout/Sidebar'

const initialNodes = [
  { id: 'A', x: 60, y: 80 },
  { id: 'B', x: 220, y: 120 },
  { id: 'C', x: 140, y: 220 },
]
const initialEdges = [
  { u: 'A', v: 'B', w: 4 },
  { u: 'A', v: 'C', w: 3 },
  { u: 'B', v: 'C', w: 2 },
]

export default function MSTViz() {
  const [algo, setAlgo] = useState('kruskal') // 'kruskal' | 'prim'
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)
  const [used, setUsed] = useState([])
  const [rejected, setRejected] = useState([])
  const [explanation, setExplanation] = useState('')

  const handlePlay = async () => {
    setExplanation('')
    try {
      const res = await fetch(\${API_BASE_URL}/api/algorithms/mst', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: algo, nodes: nodes.map(n=>n.id), edges })
      })
      const data = await res.json()
      setUsed(data.used || [])
      setRejected(data.rejected || [])
      const total = (data.totalWeight || 0)
      setExplanation(`${algo.toUpperCase()} dari backend: total bobot ${total}.`)
    } catch (e) {
      setExplanation('Gagal memanggil API MST. Pastikan backend berjalan.')
    }
  }

  const handleReset = () => {
    setUsed([])
    setRejected([])
  }

  const getPos = (id) => nodes.find((n) => n.id === id)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight border-b-3 sm:border-b-4 border-black dark:border-brutal-bg pb-3 sm:pb-4">
        MINIMUM SPANNING TREE
        <span className="block text-lg sm:text-xl lg:text-2xl mt-2 text-brutal-primary">NETWORK BUILDER</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['kruskal', 'prim'].map((a) => (
              <button
                key={a}
                onClick={() => setAlgo(a)}
                className={`btn-brutal px-4 py-2 font-black shadow-brutal-sm ${algo === a ? 'bg-brutal-primary text-white' : 'bg-brutal-bg dark:bg-brutal-dark'}`}
              >
                {a.toUpperCase()}
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

          <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
            <svg className="w-full h-80 border-3 border-black dark:border-brutal-bg bg-white dark:bg-black">
              {edges.map((e, idx) => {
                const pu = getPos(e.u), pv = getPos(e.v)
                const state = used.some((x) => x.u === e.u && x.v === e.v && x.w === e.w)
                  ? 'used'
                  : rejected.some((x) => x.u === e.u && x.v === e.v && x.w === e.w)
                  ? 'rejected'
                  : 'idle'
                const color = state === 'used' ? '#00F5A0' : state === 'rejected' ? '#FF006E' : '#000000'
                return (
                  <g key={idx}>
                    <line x1={pu.x} y1={pu.y} x2={pv.x} y2={pv.y} stroke={color} strokeWidth="3" />
                    <text x={(pu.x + pv.x) / 2} y={(pu.y + pv.y) / 2 - 6} fill={color} fontWeight="900" fontSize="12">{e.w}</text>
                  </g>
                )
              })}
              {nodes.map((n) => (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r="16" fill="#00D9FF" stroke="#000" strokeWidth="3" />
                  <text x={n.x} y={n.y + 5} fill="#000" fontWeight="900" fontSize="12" textAnchor="middle">{n.id}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="lg:block">
          <Sidebar complexity={{ time: 'O(E log E)', space: 'O(E+V)' }}>
            <p className="text-xs sm:text-sm uppercase">KRUSKAL USES UNION-FIND; PRIM USES A MIN FRONTIER FROM A START NODE.</p>
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


