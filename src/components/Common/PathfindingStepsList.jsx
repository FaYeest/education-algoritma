import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  MapPinIcon,
  FlagIcon,
  ListBulletIcon,
  PlayIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid'

export default function PathfindingStepsList({ steps, animationCompleted, algorithmName = 'BFS' }) {
  
  if (!animationCompleted) {
    return (
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-8">
        <div className="text-center py-12">
          <PlayIcon className="w-16 h-16 mx-auto text-brutal-primary opacity-50 mb-4" />
          <p className="font-bold uppercase text-lg mb-4">
            Jalankan {algorithmName} Dulu
          </p>
          <p className="text-sm font-bold uppercase opacity-70 mb-6">
            Klik Play di mode "Step-by-Step" untuk menjalankan algoritma. Setelah selesai, semua langkah akan tersedia di sini.
          </p>
          <div className="text-xs font-bold uppercase opacity-60 bg-brutal-warning text-black px-4 py-2 inline-block border-2 border-black">
            💡 Tip: Animasi harus selesai dulu
          </div>
        </div>
      </div>
    )
  }

  if (steps.length === 0) {
    return (
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-8">
        <div className="text-center py-12">
          <ListBulletIcon className="w-16 h-16 mx-auto text-brutal-primary opacity-50 mb-4" />
          <p className="font-bold uppercase text-lg mb-4">
            Belum ada langkah yang tersedia
          </p>
          <p className="text-sm font-bold uppercase opacity-70">
            Jalankan {algorithmName} terlebih dahulu
          </p>
        </div>
      </div>
    )
  }

  const getActionIcon = (action) => {
    switch(action) {
      case 'start': return <MapPinIcon className="w-5 h-5 text-brutal-success" />
      case 'visit': return <MagnifyingGlassIcon className="w-5 h-5 text-brutal-warning" />
      case 'found': return <FlagIcon className="w-5 h-5 text-brutal-success" />
      case 'backtrack': return <ArrowPathIcon className="w-5 h-5 text-brutal-danger" />
      case 'explore': return <MagnifyingGlassIcon className="w-5 h-5 text-brutal-primary" />
      default: return <CheckCircleIcon className="w-5 h-5 text-brutal-secondary" />
    }
  }

  const getActionBadge = (action) => {
    const badges = {
      start: { text: 'START', color: 'bg-brutal-success text-white' },
      visit: { text: 'VISIT', color: 'bg-brutal-warning text-black' },
      explore: { text: 'EXPLORE', color: 'bg-brutal-primary text-white' },
      found: { text: 'FOUND', color: 'bg-brutal-success text-white' },
      backtrack: { text: 'BACKTRACK', color: 'bg-brutal-danger text-white' },
      enqueue: { text: 'ENQUEUE', color: 'bg-brutal-cyan text-black' },
      dequeue: { text: 'DEQUEUE', color: 'bg-brutal-warning text-black' },
      push: { text: 'PUSH', color: 'bg-brutal-cyan text-black' },
      pop: { text: 'POP', color: 'bg-brutal-danger text-white' },
    }
    const badge = badges[action] || { text: action.toUpperCase(), color: 'bg-brutal-secondary text-black' }
    return (
      <div className={`px-3 py-1 border-2 border-black dark:border-brutal-bg font-black text-xs ${badge.color}`}>
        {badge.text}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <h3 className="text-xl font-black uppercase flex items-center gap-2">
          <ListBulletIcon className="w-6 h-6 text-brutal-primary" />
          Semua Langkah ({steps.length} steps)
        </h3>
        <p className="text-sm font-bold uppercase opacity-70 mt-2">
          Scroll untuk melihat detail setiap langkah {algorithmName}
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
        {steps.map((step, index) => {
          const isLastStep = index === steps.length - 1

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(index * 0.02, 1) }}
              className={`card-brutal p-4 border-l-4 hover:shadow-lg transition-shadow ${
                isLastStep
                  ? 'border-brutal-success bg-brutal-success bg-opacity-10'
                  : step.action === 'found'
                  ? 'border-brutal-success bg-brutal-success bg-opacity-10'
                  : step.action === 'visit' || step.action === 'explore'
                  ? 'border-brutal-warning bg-brutal-warning bg-opacity-10'
                  : step.action === 'backtrack'
                  ? 'border-brutal-danger bg-brutal-danger bg-opacity-10'
                  : 'border-brutal-primary bg-brutal-bg dark:bg-brutal-dark'
              }`}
            >
              {/* Step Number and Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-black text-lg text-brutal-primary min-w-[60px]">
                    #{index + 1}
                  </span>
                  {getActionBadge(step.action)}
                </div>
              </div>

              {/* Step Description */}
              <div className="mb-3 font-bold flex items-center gap-2">
                {getActionIcon(step.action)}
                <span>{step.message || step.description || `Step ${index + 1}`}</span>
              </div>

              {/* Additional Info */}
              {step.current && (
                <div className="text-xs font-bold uppercase opacity-60 mb-1">
                  Current Position: ({step.current.row}, {step.current.col})
                </div>
              )}

              {step.visited && (
                <div className="text-xs font-bold uppercase opacity-60 mb-1">
                  Visited Cells: {step.visited.size || Array.from(step.visited).length}
                </div>
              )}

              {step.queue && step.queue.length > 0 && (
                <div className="text-xs font-bold uppercase opacity-60 mb-1">
                  Queue Size: {step.queue.length}
                </div>
              )}

              {step.stack && step.stack.length > 0 && (
                <div className="text-xs font-bold uppercase opacity-60 mb-1">
                  Stack Size: {step.stack.length}
                </div>
              )}

              {step.path && step.path.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs font-bold uppercase opacity-70 mb-1">Path Length: {step.path.length}</div>
                  <div className="flex gap-1 flex-wrap">
                    {step.path.map((pos, idx) => (
                      <div
                        key={idx}
                        className="px-2 py-1 bg-brutal-success text-white border-2 border-black dark:border-brutal-bg font-black text-xs"
                      >
                        ({pos.row},{pos.col})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 text-center">
          <p className="text-xs font-bold uppercase opacity-70">Total Steps</p>
          <p className="text-3xl font-black text-brutal-primary">{steps.length}</p>
        </div>
        <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 text-center">
          <p className="text-xs font-bold uppercase opacity-70">Cells Explored</p>
          <p className="text-3xl font-black text-brutal-warning">
            {steps[steps.length - 1]?.visited?.size || steps.filter(s => s.action === 'visit' || s.action === 'explore').length}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <p className="font-black uppercase text-sm mb-3">Legend:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-warning border-2 border-black"></div>
            <span className="text-xs font-bold">Exploring</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-success border-2 border-black"></div>
            <span className="text-xs font-bold">Path/Goal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-danger border-2 border-black"></div>
            <span className="text-xs font-bold">Backtrack</span>
          </div>
        </div>
      </div>
    </div>
  )
}
