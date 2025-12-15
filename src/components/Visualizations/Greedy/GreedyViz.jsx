import { useState } from 'react'
import { motion } from 'framer-motion'
import ControlPanel from '../../Common/ControlPanel'
import Sidebar from '../../Layout/Sidebar'

export default function GreedyViz() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Greedy Algorithm - Coin Change
      </h1>

      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <ControlPanel
            isPlaying={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onReset={() => {}}
            onRandomize={() => {}}
            speed={5}
            onSpeedChange={() => {}}
            arraySize={10}
            onArraySizeChange={() => {}}
            showArraySize={false}
          />

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Greedy Algorithm visualization - Coming soon
            </div>
          </div>
        </div>

        <Sidebar complexity={{ time: 'O(n)', space: 'O(1)' }}>
          <p>
            Greedy Algorithm makes the locally optimal choice at each step,
            hoping to find a global optimum.
          </p>
        </Sidebar>
      </div>
    </div>
  )
}
