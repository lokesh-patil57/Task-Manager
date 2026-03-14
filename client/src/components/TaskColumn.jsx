import { Droppable } from '@hello-pangea/dnd'
import { motion } from 'framer-motion'
import { memo } from 'react'

function TaskColumn({ droppableId, title, count, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className='glass p-4'
    >
      <div className='mb-3 flex items-center justify-between'>
        <div className='text-sm font-semibold'>{title}</div>
        <div className='badge bg-white/5 border-white/10 text-white/70'>{count}</div>
      </div>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-55 space-y-3 rounded-xl border border-dashed p-2 ${
              snapshot.isDraggingOver ? 'border-indigo-400/50 bg-indigo-500/10' : 'border-white/10'
            }`}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </motion.div>
  )
}

export default memo(TaskColumn)

