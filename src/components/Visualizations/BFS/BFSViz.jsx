import { useState } from 'react'
import { motion } from 'framer-motion'
import ControlPanel from '../../Common/ControlPanel'
import Sidebar from '../../Layout/Sidebar'
import { useSpeed } from '../../../context/SpeedContext'

export default function BFSViz() {
  const [isPlaying, setIsPlaying] = useState(false)
  const { speed, setSpeed } = useSpeed()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        BFS - Wave Explorer
      </h1>

      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <ControlPanel
            isPlaying={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onReset={() => {}}
            onRandomize={() => {}}
            speed={speed}
            onSpeedChange={setSpeed}
            arraySize={10}
            onArraySizeChange={() => {}}
            showArraySize={false}
          />

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">
              BFS Graph visualization - Coming soon
            </div>
          </div>
        </div>

        <Sidebar complexity={{ time: 'O(V + E)', space: 'O(V)' }}>
          <p>
            Breadth-First Search explores all neighbors at the current depth
            before moving to nodes at the next depth level.
          </p>
        </Sidebar>
      </div>
    </div>
  )
}
