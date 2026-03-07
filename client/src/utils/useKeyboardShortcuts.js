import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Keyboard shortcut hook.
 * N → onNew()
 * D → navigate('/dashboard')
 * A → navigate('/analytics')
 *
 * Ignored when focus is inside an input / textarea / select / contenteditable.
 */
export function useKeyboardShortcuts({ onNew } = {}) {
    const navigate = useNavigate()

    useEffect(() => {
        function handleKeyDown(e) {
            const tag = document.activeElement?.tagName?.toLowerCase()
            const isEditable =
                tag === 'input' ||
                tag === 'textarea' ||
                tag === 'select' ||
                document.activeElement?.isContentEditable

            if (isEditable) return
            if (e.metaKey || e.ctrlKey || e.altKey) return

            switch (e.key.toLowerCase()) {
                case 'n':
                    e.preventDefault()
                    onNew?.()
                    break
                case 'd':
                    e.preventDefault()
                    navigate('/dashboard')
                    break
                case 'a':
                    e.preventDefault()
                    navigate('/analytics')
                    break
                default:
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [navigate, onNew])
}
