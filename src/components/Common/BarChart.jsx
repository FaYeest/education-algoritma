import { motion } from 'framer-motion'

export default function BarChart({ array, comparing = [], swapping = [], sorted = [] }) {
  const maxValue = Math.max(...array)
  
  return (
    <div className="flex items-end justify-center gap-2 h-80 p-6 card-brutal bg-white dark:bg-black">
      {array.map((value, index) => {
        const isComparing = comparing.includes(index)
        const isSwapping = swapping.includes(index)
        const isSorted = sorted.includes(index)
        
        let bgColor = 'bg-brutal-secondary'
        if (isComparing) bgColor = 'bg-brutal-warning'
        if (isSwapping) bgColor = 'bg-brutal-primary'
        if (isSorted) bgColor = 'bg-brutal-success'
        
        const height = (value / maxValue) * 100
        
        return (
          <motion.div
            key={`${index}-${value}`}
            className="flex flex-col items-center flex-1 max-w-[60px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <motion.div
              className={`w-full border-3 border-black dark:border-brutal-bg ${bgColor} transition-colors`}
              style={{ height: `${height}%` }}
              animate={{
                scale: isComparing ? 1.1 : 1,
                y: isComparing ? -10 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
            <span className="text-xs sm:text-sm font-black mt-2">{value}</span>
          </motion.div>
        )
      })}
    </div>
  )
}
