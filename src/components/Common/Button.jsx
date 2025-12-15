export default function Button({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
  const variants = {
    primary: 'bg-brutal-primary hover:bg-brutal-danger',
    secondary: 'bg-brutal-dark dark:bg-brutal-bg text-brutal-bg dark:text-brutal-dark',
    success: 'bg-brutal-success',
    danger: 'bg-brutal-danger',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-brutal px-6 py-3 text-white shadow-brutal disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
