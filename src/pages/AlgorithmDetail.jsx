import { useParams } from 'react-router-dom'
import SortingViz from '../components/Visualizations/Sorting/SortingViz'
import BruteForceViz from '../components/Visualizations/BruteForce/BruteForceViz'
import DivideConquerViz from '../components/Visualizations/DivideConquer/DivideConquerViz'
import GreedyViz from '../components/Visualizations/Greedy/GreedyViz'
import PathfindingViz from '../components/Visualizations/Pathfinding/PathfindingViz'
import DPViz from '../components/Visualizations/DP/DPViz'
import MSTViz from '../components/Visualizations/MST/MSTViz'

const visualizations = {
  'brute-force': BruteForceViz,
  'divide-conquer': DivideConquerViz,
  'greedy': GreedyViz,
  'sorting': SortingViz,
  'bfs': PathfindingViz,
  'dfs': PathfindingViz,
  'dp': DPViz,
  'mst': MSTViz,
}

export default function AlgorithmDetail() {
  const { id } = useParams()
  const VisualizationComponent = visualizations[id]

  if (!VisualizationComponent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Algorithm not found
        </h1>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <VisualizationComponent />
    </div>
  )
}
