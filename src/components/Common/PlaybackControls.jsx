import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid"

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
      
      {/* Reset */}
      <button
        className="btn-brutal px-4 py-2 bg-brutal-secondary text-black font-black uppercase flex items-center gap-2"
        onClick={onReset}
        disabled={disabled}
        aria-label="Reset"
      >
        <ArrowPathIcon className="w-5 h-5" />
        Reset
      </button>

      {/* Step Backward */}
      <button
        className="btn-brutal px-4 py-2 bg-brutal-warning text-black font-black uppercase flex items-center gap-2"
        onClick={onStepBackward}
        disabled={disabled || isPlaying}
        aria-label="Previous step"
      >
        <ChevronLeftIcon className="w-5 h-5" />
        Prev
      </button>

      {/* Play / Pause */}
      <button
        className="btn-brutal px-6 py-3 bg-brutal-primary text-white font-black uppercase text-lg flex items-center gap-3"
        onClick={isPlaying ? onPause : onPlay}
        disabled={disabled}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <>
            <PauseIcon className="w-6 h-6" />
            Pause
          </>
        ) : (
          <>
            <PlayIcon className="w-6 h-6" />
            Play
          </>
        )}
      </button>

      {/* Step Forward */}
      <button
        className="btn-brutal px-4 py-2 bg-brutal-warning text-black font-black uppercase flex items-center gap-2"
        onClick={onStepForward}
        disabled={disabled || isPlaying}
        aria-label="Next step"
      >
        Next
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  )
}
