import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSpeed } from '../context/SpeedContext'
import SpeedControl from '../components/Common/SpeedControl'
import { 
  MagnifyingGlassIcon,
  ScissorsIcon,
  TrophyIcon,
  Bars3BottomLeftIcon,
  ArrowsPointingOutIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/solid'

const algorithms = [
  {
    id: 'brute-force',
    name: 'BRUTE FORCE',
    description: 'Try everything approach - check every possibility',
    icon: MagnifyingGlassIcon,
    color: 'bg-brutal-primary'
  },
  {
    id: 'divide-conquer',
    name: 'DIVIDE & CONQUER',
    description: 'Split problem into smaller parts, solve and combine',
    icon: ScissorsIcon,
    color: 'bg-brutal-purple'
  },
  {
    id: 'greedy',
    name: 'GREEDY ALGORITHM',
    description: 'Pick the best choice at each step',
    icon: TrophyIcon,
    color: 'bg-brutal-success'
  },
  {
    id: 'sorting',
    name: 'SORTING ALGORITHMS',
    description: 'Bubble, Selection, Insertion, Merge, Quick Sort',
    icon: Bars3BottomLeftIcon,
    color: 'bg-brutal-warning'
  },
  {
    id: 'bfs',
    name: 'BFS - WAVE EXPLORER',
    description: 'Breadth-First Search - explore level by level',
    icon: ArrowsPointingOutIcon,
    color: 'bg-brutal-cyan'
  },
  {
    id: 'dfs',
    name: 'DFS - DEEP DIVER',
    description: 'Depth-First Search - go deep then backtrack',
    icon: ArrowTrendingDownIcon,
    color: 'bg-brutal-secondary'
  },
  {
    id: 'dp',
    name: 'DYNAMIC PROGRAMMING',
    description: 'Knapsack & LCS with DP table/memoization',
    icon: Bars3BottomLeftIcon,
    color: 'bg-brutal-success'
  },
  {
    id: 'mst',
    name: 'MINIMUM SPANNING TREE',
    description: 'Kruskal/Prim with union-find/frontier',
    icon: Bars3BottomLeftIcon,
    color: 'bg-brutal-warning'
  },
]

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12 lg:mb-16"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-4 sm:mb-6 leading-tight">
          ALGORITHM<br />VISUALIZER
        </h1>
        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wider border-3 sm:border-4 border-black dark:border-brutal-bg inline-block px-4 py-2 sm:px-6 sm:py-3 bg-brutal-primary text-white shadow-brutal-sm sm:shadow-brutal">
          LEARN · CODE · VISUALIZE
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {algorithms.map((algo, index) => (
          <motion.div
            key={algo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/algorithm/${algo.id}`}>
              <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 sm:p-6 cursor-pointer group">
                <div className={`${algo.color} w-16 h-16 sm:w-20 sm:h-20 border-3 border-black dark:border-brutal-bg flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition-transform`}>
                  <algo.icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black uppercase tracking-tight mb-2 sm:mb-3 group-hover:text-brutal-primary transition-colors">
                  {algo.name}
                </h3>
                <p className="font-medium text-xs sm:text-sm uppercase tracking-wide opacity-80">
                  {algo.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

    </div>
  )
}
