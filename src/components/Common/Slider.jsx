export default function Slider({ label, value, onChange, min = 0, max = 100, step = 1 }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold uppercase tracking-wide">
          {label}
        </label>
        <span className="text-lg font-black px-3 py-1 bg-black dark:bg-brutal-bg text-white dark:text-brutal-dark border-2 border-black dark:border-brutal-bg">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full slider-brutal cursor-pointer"
      />
    </div>
  )
}
