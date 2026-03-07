export default function Spinner({ className = '' }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-2 border-t-white ${className}`}
      aria-hidden='true'
    />
  )
}

