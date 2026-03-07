import React from 'react'
import { toast } from 'react-toastify'

const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  theme: 'dark',
}

export function undoDeleteToast(onUndo) {
  function UndoMsg({ closeToast }) {
    return React.createElement(
      'div',
      { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 } },
      React.createElement('span', null, 'Task deleted'),
      React.createElement(
        'button',
        {
          onClick: () => { onUndo(); closeToast() },
          style: {
            background: 'rgba(99,102,241,0.9)',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            padding: '4px 12px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
          },
        },
        'Undo'
      )
    )
  }
  toast(UndoMsg, { ...defaultOptions, autoClose: 5000 })
}

export function successToast(message) {
  if (!message) return
  toast.success(message, defaultOptions)
}

export function errorToast(message) {
  if (!message) return
  toast.error(message, defaultOptions)
}

export function infoToast(message) {
  if (!message) return
  toast.info(message, defaultOptions)
}
