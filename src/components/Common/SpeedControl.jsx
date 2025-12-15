import { useSpeed } from '../../context/SpeedContext'

export default function SpeedControl() {
  const { speed, setSpeed } = useSpeed()
  return (
    <div>
      <label id="speed-label" className="font-black uppercase tracking-wide">Speed (1–20): {speed}</label>
      <input
        className="slider-brutal w-full mt-3"
        type="range"
        min="1"
        max="20"
        step="1"
        value={speed}
        onChange={e => setSpeed(Number(e.target.value))}
        aria-valuemin={1}
        aria-valuemax={20}
        aria-valuenow={speed}
      />
    </div>
  )
}
