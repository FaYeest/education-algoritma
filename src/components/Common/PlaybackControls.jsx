export default function PlaybackControls({ 
  isPlaying, 
  onPlay, 
  onPause, 
  onReset, 
  onStepForward,
  onStepBackward,
  disabled = false 
}) {
  return (
    <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 flex flex-wrap items-center justify-center gap-3">
      <button
        className="btn-brutal px-4 py-2 bg-brutal-secondary text-black font-black uppercase"
        onClick={onReset}
        disabled={disabled}
        aria-label="Reset"
      >
        ⏮ Reset
      </button>
      
      <button
        className="btn-brutal px-4 py-2 bg-brutal-warning text-black font-black uppercase"
        onClick={onStepBackward}
        disabled={disabled || isPlaying}
        aria-label="Previous step"
      >
        ⏪ Prev
      </button>
      
      <button
        className="btn-brutal px-6 py-3 bg-brutal-primary text-white font-black uppercase text-lg"
        onClick={isPlaying ? onPause : onPlay}
        disabled={disabled}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>
      
      <button
        className="btn-brutal px-4 py-2 bg-brutal-warning text-black font-black uppercase"
        onClick={onStepForward}
        disabled={disabled || isPlaying}
        aria-label="Next step"
      >
        Next ⏩
      </button>
    </div>
  )
}
