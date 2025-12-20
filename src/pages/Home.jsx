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
  ArrowTrendingDownIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/solid'

const algorithms = [
  {
    id: 'brute-force',
    name: 'BRUTE FORCE',
    description: 'Coba semua kemungkinan - periksa setiap solusi',
    icon: MagnifyingGlassIcon,
    color: 'bg-brutal-primary'
  },
  {
    id: 'divide-conquer',
    name: 'DIVIDE & CONQUER',
    description: 'Bagi masalah jadi bagian kecil, selesaikan & gabungkan',
    icon: ScissorsIcon,
    color: 'bg-brutal-purple'
  },
  {
    id: 'greedy',
    name: 'GREEDY ALGORITHM',
    description: 'Pilih opsi terbaik di setiap langkah',
    icon: TrophyIcon,
    color: 'bg-brutal-success'
  },
  {
    id: 'sorting',
    name: 'ALGORITMA SORTING',
    description: 'Bubble, Selection, Insertion, Merge, Quick Sort',
    icon: Bars3BottomLeftIcon,
    color: 'bg-brutal-warning'
  },
  {
    id: 'bfs',
    name: 'BFS - PENJELAJAH GELOMBANG',
    description: 'Breadth-First Search - jelajah level per level',
    icon: ArrowsPointingOutIcon,
    color: 'bg-brutal-cyan'
  },
  {
    id: 'dfs',
    name: 'DFS - PENYELAM DALAM',
    description: 'Depth-First Search - menyelam dalam lalu mundur',
    icon: ArrowTrendingDownIcon,
    color: 'bg-brutal-secondary'
  },
  {
    id: 'dp',
    name: 'DYNAMIC PROGRAMMING',
    description: 'Knapsack & LCS dengan tabel DP/memoization',
    icon: Bars3BottomLeftIcon,
    color: 'bg-brutal-success'
  },
  {
    id: 'mst',
    name: 'MINIMUM SPANNING TREE',
    description: 'Kruskal/Prim dengan union-find/frontier',
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
          VISUALISASI<br />ALGORITMA
        </h1>
        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wider border-3 sm:border-4 border-black dark:border-brutal-bg inline-block px-4 py-2 sm:px-6 sm:py-3 bg-brutal-primary text-white shadow-brutal-sm sm:shadow-brutal">
          BELAJAR · KODE · VISUALISASI
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {algorithms.map((algo, index) => (
          <motion.div
            key={algo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
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

      {/* Quiz CTA Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 sm:mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Link to="/quiz">
            <div className="card-brutal bg-gradient-to-r from-brutal-warning to-brutal-primary text-white p-6 sm:p-8 cursor-pointer hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                <AcademicCapIcon className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase mb-1">
                    KUIS KLASIK
                  </h3>
                  <p className="text-sm sm:text-base font-bold uppercase opacity-90">
                    Pertanyaan tetap & terstruktur →
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Link to="/quiz-ai">
            <div className="card-brutal bg-gradient-to-r from-brutal-purple to-brutal-secondary text-white p-6 sm:p-8 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="bg-brutal-warning text-brutal-dark px-3 py-1 text-xs font-black uppercase border-2 border-black">
                  NEW!
                </span>
              </div>
              <div className="flex items-center gap-4">
                <SparklesIcon className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 animate-pulse" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase mb-1 flex items-center gap-2">
                    KUIS AI
                    <SparklesIcon className="w-6 h-6" />
                  </h3>
                  <p className="text-sm sm:text-base font-bold uppercase opacity-90">
                    Pertanyaan baru setiap hari! →
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

    </div>
  )
}
