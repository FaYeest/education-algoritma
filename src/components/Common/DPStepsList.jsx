import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  ListBulletIcon,
  PlayIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ScaleIcon
} from '@heroicons/react/24/solid'

export default function DPStepsList({ steps, animationCompleted }) {
  
  if (!animationCompleted) {
    return (
      <div className="card-brutal bg-brutal-bg dark:bg-gray-900 p-8">
        <div className="text-center py-12">
          <PlayIcon className="w-16 h-16 mx-auto text-brutal-primary opacity-50 mb-4" />
          <p className="font-bold uppercase text-lg mb-4">
            Jalankan Knapsack Dulu
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
            Jalankan Knapsack terlebih dahulu
          </p>
        </div>
      </div>
    )
  }

  const getActionIcon = (action) => {
    switch(action) {
      case 'init': return <ShoppingBagIcon className="w-5 h-5 text-brutal-primary" />
      case 'include': return <CheckCircleIcon className="w-5 h-5 text-brutal-success" />
      case 'exclude': return <XCircleIcon className="w-5 h-5 text-brutal-danger" />
      case 'skip': return <XCircleIcon className="w-5 h-5 text-brutal-warning" />
      case 'backtrack': return <CurrencyDollarIcon className="w-5 h-5 text-brutal-success" />
      case 'complete': return <CheckCircleIcon className="w-5 h-5 text-brutal-success" />
      default: return <ScaleIcon className="w-5 h-5 text-brutal-secondary" />
    }
  }

  const getActionBadge = (action) => {
    const badges = {
      init: { text: 'INIT', color: 'bg-brutal-primary text-white' },
      check: { text: 'CHECK', color: 'bg-brutal-cyan text-black' },
      include: { text: 'AMBIL', color: 'bg-brutal-success text-white' },
      exclude: { text: 'LEWATI', color: 'bg-brutal-warning text-black' },
      skip: { text: 'SKIP', color: 'bg-brutal-danger text-white' },
      backtrack: { text: 'BACKTRACK', color: 'bg-brutal-success text-white' },
      complete: { text: 'SELESAI', color: 'bg-brutal-success text-white' },
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
          Scroll untuk melihat detail setiap langkah Dynamic Programming
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
                isLastStep || step.action === 'complete'
                  ? 'border-brutal-success bg-brutal-success bg-opacity-10'
                  : step.action === 'include'
                  ? 'border-brutal-success bg-brutal-success bg-opacity-10'
                  : step.action === 'exclude'
                  ? 'border-brutal-warning bg-brutal-warning bg-opacity-10'
                  : step.action === 'skip'
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
                <span>{step.message || `Step ${index + 1}`}</span>
              </div>

              {/* Item Info */}
              {step.item && (
                <div className="mb-2 p-2 bg-brutal-secondary bg-opacity-20 border-2 border-black dark:border-brutal-bg">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span className="text-2xl">{step.item.icon}</span>
                    <span>{step.item.name}</span>
                    <span className="ml-auto text-brutal-primary">
                      Berat: {step.item.weight}kg | Nilai: ${step.item.value}
                    </span>
                  </div>
                </div>
              )}

              {/* Decision Info */}
              {step.decision && (
                <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase">
                  <div className="p-2 bg-brutal-success bg-opacity-20 border-2 border-black dark:border-brutal-bg">
                    Include: ${step.decision.include}
                  </div>
                  <div className="p-2 bg-brutal-danger bg-opacity-20 border-2 border-black dark:border-brutal-bg">
                    Exclude: ${step.decision.exclude}
                  </div>
                </div>
              )}

              {/* Cell Info */}
              {step.cell && (
                <div className="text-xs font-bold uppercase opacity-60 mt-2">
                  Cell: [{step.cell.i}, {step.cell.j}]
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 text-center">
          <p className="text-xs font-bold uppercase opacity-70">Total Steps</p>
          <p className="text-3xl font-black text-brutal-primary">{steps.length}</p>
        </div>
        <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 text-center">
          <p className="text-xs font-bold uppercase opacity-70">Items Included</p>
          <p className="text-3xl font-black text-brutal-success">
            {steps.filter(s => s.action === 'include').length}
          </p>
        </div>
        <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 text-center">
          <p className="text-xs font-bold uppercase opacity-70">Items Skipped</p>
          <p className="text-3xl font-black text-brutal-danger">
            {steps.filter(s => s.action === 'exclude' || s.action === 'skip').length}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <p className="font-black uppercase text-sm mb-3">Legend:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-success border-2 border-black"></div>
            <span className="text-xs font-bold">Include</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-warning border-2 border-black"></div>
            <span className="text-xs font-bold">Exclude</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-danger border-2 border-black"></div>
            <span className="text-xs font-bold">Skip</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-primary border-2 border-black"></div>
            <span className="text-xs font-bold">Checking</span>
          </div>
        </div>
      </div>
    </div>
  )
}
