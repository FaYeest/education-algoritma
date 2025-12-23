import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ListBulletIcon,
  PlayIcon,
  BoltIcon
} from '@heroicons/react/24/solid'

export default function GreedyStepsList({ steps, animationCompleted }) {
  
  if (!animationCompleted) {
    return (
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-8">
        <div className="text-center py-12">
          <PlayIcon className="w-16 h-16 mx-auto text-brutal-primary opacity-50 mb-4" />
          <p className="font-bold uppercase text-lg mb-4">
            Jalankan Greedy Dulu
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
            Jalankan Greedy terlebih dahulu
          </p>
        </div>
      </div>
    )
  }

  const getActionIcon = (action) => {
    switch(action) {
      case 'use':
      case 'take': return <CheckCircleIcon className="w-5 h-5 text-brutal-success" />
      case 'skip': return <XCircleIcon className="w-5 h-5 text-brutal-danger" />
      case 'select': return <BoltIcon className="w-5 h-5 text-brutal-warning" />
      case 'complete': return <CheckCircleIcon className="w-5 h-5 text-brutal-success" />
      default: return <CurrencyDollarIcon className="w-5 h-5 text-brutal-primary" />
    }
  }

  const getActionBadge = (action) => {
    const badges = {
      select: { text: 'SELECT', color: 'bg-brutal-warning text-black' },
      use: { text: 'USE', color: 'bg-brutal-success text-white' },
      take: { text: 'TAKE', color: 'bg-brutal-success text-white' },
      skip: { text: 'SKIP', color: 'bg-brutal-danger text-white' },
      complete: { text: 'COMPLETE', color: 'bg-brutal-success text-white' },
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
          Scroll untuk melihat detail setiap langkah Greedy Algorithm
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
                  : (step.action === 'use' || step.action === 'take')
                  ? 'border-brutal-success bg-brutal-success bg-opacity-10'
                  : step.action === 'skip'
                  ? 'border-brutal-danger bg-brutal-danger bg-opacity-10'
                  : step.action === 'select'
                  ? 'border-brutal-warning bg-brutal-warning bg-opacity-10'
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

              {/* Coin Info */}
              {step.coin !== undefined && (
                <div className="mb-2 p-2 bg-brutal-secondary bg-opacity-20 border-2 border-black dark:border-brutal-bg">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CurrencyDollarIcon className="w-5 h-5 text-brutal-success" />
                    <span>Coin: {step.coin}¢</span>
                    {step.count !== undefined && (
                      <span className="ml-auto text-brutal-primary">
                        Count: {step.count}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Remaining Amount */}
              {step.remaining !== undefined && (
                <div className="text-xs font-bold uppercase opacity-60 mt-2">
                  Remaining: {step.remaining}¢
                </div>
              )}

              {/* Result */}
              {step.result && (
                <div className="mt-2 p-2 bg-brutal-success bg-opacity-20 border-2 border-black dark:border-brutal-bg">
                  <div className="font-bold text-sm">
                    Total Coins Used: {Object.values(step.result).reduce((sum, count) => sum + count, 0)}
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
          <p className="text-xs font-bold uppercase opacity-70">Coins Used</p>
          <p className="text-3xl font-black text-brutal-success">
            {steps.filter(s => s.action === 'use' || s.action === 'take').reduce((sum, s) => sum + (s.count || 1), 0)}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <p className="font-black uppercase text-sm mb-3">Legend:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-warning border-2 border-black"></div>
            <span className="text-xs font-bold">Selecting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-success border-2 border-black"></div>
            <span className="text-xs font-bold">Using</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-danger border-2 border-black"></div>
            <span className="text-xs font-bold">Skipping</span>
          </div>
        </div>
      </div>
    </div>
  )
}
