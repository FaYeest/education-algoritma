import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  ArrowsRightLeftIcon,
  MagnifyingGlassIcon,
  ListBulletIcon,
  PlayIcon,
  MapPinIcon,
  ArrowPathIcon,
  FlagIcon,
  BoltIcon,
  XCircleIcon
} from '@heroicons/react/24/solid'

export default function GenericStepsList({ 
  steps, 
  animationCompleted, 
  algorithmName = 'Algorithm',
  renderStepContent 
}) {
  
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

  const defaultRenderStep = (step, index, isLastStep) => {
    return (
      <div className="font-bold">
        {step.message || step.description || step.action || `Step ${index + 1}`}
        {step.details && (
          <div className="text-sm opacity-70 mt-1">{step.details}</div>
        )}
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
                  : 'border-brutal-primary bg-brutal-bg dark:bg-brutal-dark'
              }`}
            >
              {/* Step Number */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-black text-lg text-brutal-primary min-w-[60px]">
                    #{index + 1}
                  </span>
                  {isLastStep && (
                    <div className="px-3 py-1 border-2 border-black dark:border-brutal-bg font-black text-xs bg-brutal-success text-white">
                      SELESAI
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Step Content */}
              {renderStepContent ? renderStepContent(step, index, isLastStep) : defaultRenderStep(step, index, isLastStep)}
            </motion.div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 text-center">
        <p className="text-xs font-bold uppercase opacity-70">Total Steps</p>
        <p className="text-3xl font-black text-brutal-primary">{steps.length}</p>
      </div>
    </div>
  )
}
