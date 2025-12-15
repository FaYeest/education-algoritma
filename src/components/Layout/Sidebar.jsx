export default function Sidebar({ children, complexity }) {
  return (
    <aside className="w-full lg:w-80 card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide border-b-3 border-black dark:border-brutal-bg pb-2 mb-3 sm:mb-4">
            COMPLEXITY
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="border-3 border-black dark:border-brutal-bg p-2 sm:p-3 bg-brutal-warning">
              <span className="font-black uppercase text-[10px] sm:text-xs">TIME:</span>
              <p className="text-xl sm:text-2xl font-black mt-1">{complexity?.time || 'N/A'}</p>
            </div>
            <div className="border-3 border-black dark:border-brutal-bg p-2 sm:p-3 bg-brutal-secondary">
              <span className="font-black uppercase text-[10px] sm:text-xs">SPACE:</span>
              <p className="text-xl sm:text-2xl font-black mt-1">{complexity?.space || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide border-b-3 border-black dark:border-brutal-bg pb-2 mb-3 sm:mb-4">
            INFO
          </h3>
          <div className="text-xs sm:text-sm font-medium leading-relaxed border-3 border-black dark:border-brutal-bg p-3 sm:p-4 bg-white dark:bg-black">
            {children}
          </div>
        </div>
      </div>
    </aside>
  )
}
