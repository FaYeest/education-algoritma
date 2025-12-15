export default function StatsPanel({ stats }) {
  return (
    <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
      <h3 className="text-lg font-black uppercase tracking-tight mb-3">Statistics</h3>
      <div className="space-y-2">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="font-bold uppercase text-sm">{key}:</span>
            <span className="font-black text-brutal-primary">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
