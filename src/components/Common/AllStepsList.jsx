import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  ArrowsRightLeftIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  ListBulletIcon,
  ArrowPathIcon,
  PlayIcon
} from '@heroicons/react/24/solid'

export default function AllStepsList({ steps, onGenerateSteps, isLoading, animationCompleted }) {
  const getTotalComparisons = () => {
    return steps.filter(s => s.comparing && s.comparing.length > 0).length
  }

  const getTotalSwaps = () => {
    return steps.filter(s => s.swapped && s.swapped.length > 0).length
  }

  // Show message if animation hasn't completed yet
  if (!animationCompleted) {
    return (
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-8">
        <div className="text-center py-12">
          <PlayIcon className="w-16 h-16 mx-auto text-brutal-primary opacity-50 mb-4" />
          <p className="font-bold uppercase text-lg mb-4">
            Jalankan Sorting Dulu
          </p>
          <p className="text-sm font-bold uppercase opacity-70 mb-6">
            Klik Play di mode "Step-by-Step" untuk menjalankan sorting. Setelah selesai, semua langkah akan tersedia di sini.
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
          <ArrowsUpDownIcon className="w-16 h-16 mx-auto text-brutal-primary opacity-50 mb-4" />
          <p className="font-bold uppercase text-lg mb-4">
            Belum ada langkah yang tersedia
          </p>
          <p className="text-sm font-bold uppercase opacity-70 mb-6">
            Klik tombol Play untuk generate dan melihat semua langkah sorting
          </p>
          <button
            onClick={onGenerateSteps}
            disabled={isLoading}
            className="btn-brutal px-6 py-3 bg-brutal-primary text-white font-black uppercase disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="w-5 h-5 inline-block mr-2 animate-spin" />
                GENERATING...
              </>
            ) : (
              <>
                <ListBulletIcon className="w-5 h-5 inline-block mr-2" />
                GENERATE STEPS
              </>
            )}
          </button>
        </div>
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
          Scroll untuk melihat detail setiap langkah sorting
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
        {steps.map((step, index) => {
          const isLastStep = index === steps.length - 1
          const hasSwap = step.swapped && step.swapped.length > 0
          const hasCompare = step.comparing && step.comparing.length > 0

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(index * 0.02, 1) }}
              className={`card-brutal p-4 border-l-4 hover:shadow-lg transition-shadow ${
                isLastStep
                  ? 'border-brutal-success bg-brutal-success bg-opacity-10'
                  : hasSwap
                  ? 'border-brutal-danger bg-brutal-danger bg-opacity-10'
                  : hasCompare
                  ? 'border-brutal-warning bg-brutal-warning bg-opacity-10'
                  : 'border-brutal-secondary bg-brutal-bg dark:bg-brutal-dark'
              }`}
            >
              {/* Step Number and Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-black text-lg text-brutal-primary min-w-[60px]">
                    #{index + 1}
                  </span>
                  <div className={`px-3 py-1 border-2 border-black dark:border-brutal-bg font-black text-xs ${
                    isLastStep
                      ? 'bg-brutal-success text-white'
                      : hasSwap
                      ? 'bg-brutal-danger text-white'
                      : hasCompare
                      ? 'bg-brutal-warning text-black'
                      : 'bg-brutal-secondary text-black'
                  }`}>
                    {isLastStep ? 'SELESAI' : hasSwap ? 'SWAP' : hasCompare ? 'COMPARE' : 'IDLE'}
                  </div>
                </div>
              </div>

              {/* Step Description */}
              <div className="mb-3">
                {isLastStep ? (
                  <span className="flex items-center gap-2 font-bold text-brutal-success">
                    <CheckCircleIcon className="w-5 h-5" />
                    Sorting selesai! Array sudah terurut.
                  </span>
                ) : hasSwap ? (
                  <span className="flex items-center gap-2 font-bold">
                    <ArrowsRightLeftIcon className="w-5 h-5 text-brutal-danger" />
                    Menukar elemen di index {step.swapped.join(' dan ')}
                  </span>
                ) : hasCompare ? (
                  <span className="flex items-center gap-2 font-bold">
                    <MagnifyingGlassIcon className="w-5 h-5 text-brutal-warning" />
                    Membandingkan elemen di index {step.comparing.join(' dan ')}
                  </span>
                ) : (
                  <span className="font-bold opacity-70">Step {index + 1}</span>
                )}
              </div>

              {/* Mini Array Visualization */}
              <div className="flex gap-1 flex-wrap">
                {(step.array || []).map((value, idx) => {
                  const isComparing = step.comparing?.includes(idx)
                  const isSwapping = step.swapped?.includes(idx)
                  const isSorted = step.sorted?.includes(idx)

                  return (
                    <div
                      key={idx}
                      className={`px-2 py-1 border-2 border-black dark:border-brutal-bg font-black text-xs min-w-[40px] text-center transition-colors ${
                        isSorted
                          ? 'bg-brutal-success text-white'
                          : isSwapping
                          ? 'bg-brutal-danger text-white'
                          : isComparing
                          ? 'bg-brutal-warning text-black'
                          : 'bg-brutal-primary text-white'
                      }`}
                    >
                      {value}
                    </div>
                  )
                })}
              </div>

              {/* Array State Info */}
              <div className="mt-2 text-xs font-bold uppercase opacity-60">
                Array: [{(step.array || []).join(', ')}]
              </div>
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
          <p className="text-xs font-bold uppercase opacity-70">Comparisons</p>
          <p className="text-3xl font-black text-brutal-warning">{getTotalComparisons()}</p>
        </div>
        <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 text-center">
          <p className="text-xs font-bold uppercase opacity-70">Swaps</p>
          <p className="text-3xl font-black text-brutal-danger">{getTotalSwaps()}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
        <p className="font-black uppercase text-sm mb-3">Legend:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-warning border-2 border-black"></div>
            <span className="text-xs font-bold">Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-danger border-2 border-black"></div>
            <span className="text-xs font-bold">Swapping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-success border-2 border-black"></div>
            <span className="text-xs font-bold">Sorted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brutal-primary border-2 border-black"></div>
            <span className="text-xs font-bold">Unsorted</span>
          </div>
        </div>
      </div>
    </div>
  )
}
