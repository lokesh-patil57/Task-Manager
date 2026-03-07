import Spinner from './Spinner'

export default function LoadingButton({ isLoading, text, loadingText, onClick, ...rest }) {
  const { type = 'button', className = '', disabled, ...other } = rest

  return (
    <button
      type={type}
      onClick={isLoading ? undefined : onClick}
      disabled={isLoading || disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors ${className}`}
      {...other}
    >
      {isLoading ? <Spinner /> : null}
      <span>{isLoading ? loadingText || text : text}</span>
    </button>
  )
}

