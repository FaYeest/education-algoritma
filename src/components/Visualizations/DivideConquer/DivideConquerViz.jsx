import { useState } from 'react'
import { motion } from 'framer-motion'
import ControlPanel from '../../Common/ControlPanel'
import Sidebar from '../../Layout/Sidebar'

export default function DivideConquerViz() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Divide & Conquer - Merge Sort
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
          />

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Divide & Conquer visualization - Coming soon
            </div>
          </div>
        </div>

        <Sidebar complexity={{ time: 'O(n log n)', space: 'O(n)' }}>
          <p>
            Divide & Conquer splits the problem into smaller subproblems,
            solves them recursively, and combines the results.
          </p>
        </Sidebar>
      </div>
    </div>
  )
}
