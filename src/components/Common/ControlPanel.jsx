import Button from './Button'
import Slider from './Slider'

export default function ControlPanel({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onRandomize,
  speed,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  showArraySize = true,
}) {
  return (
    <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide border-b-3 border-black dark:border-brutal-bg pb-2">
        CONTROLS
      </h3>
      
      <div className="flex gap-2 sm:gap-3 flex-wrap">
        <Button
          onClick={isPlaying ? onPause : onPlay}
          variant={isPlaying ? 'danger' : 'success'}
          className="text-xs sm:text-sm px-3 py-2 sm:px-6 sm:py-3"
        >
          {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
        </Button>
        <Button onClick={onReset} variant="secondary" className="text-xs sm:text-sm px-3 py-2 sm:px-6 sm:py-3">
          🔄 RESET
        </Button>
        <Button onClick={onRandomize} variant="primary" className="text-xs sm:text-sm px-3 py-2 sm:px-6 sm:py-3">
          🎲 RANDOM
        </Button>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <Slider
          label="Speed"
          value={speed}
          onChange={onSpeedChange}
          min={1}
          max={10}
          step={1}
        />
        
        {showArraySize && (
          <Slider
            label="Array Size"
            value={arraySize}
            onChange={onArraySizeChange}
            min={5}
            max={15}
            step={1}
          />
        )}
      </div>
    </div>
  )
}
