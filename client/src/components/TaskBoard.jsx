import { AnimatePresence, motion } from 'framer-motion'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import TaskCard from './TaskCard'
import TaskColumn from './TaskColumn'

const columns = [
  { id: 'pending', title: 'Pending' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Completed' },
]

export default function TaskBoard({ tasksByStatus, onDragEnd, onSelectTask, onDeleteTask }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='grid grid-cols-1 gap-4 xl:grid-cols-3'>
        {columns.map((col) => {
          const tasks = tasksByStatus[col.id] || []
          return (
            <TaskColumn key={col.id} droppableId={col.id} title={col.title} count={tasks.length}>
              <AnimatePresence initial={false}>
                {tasks.map((task, index) => (
                  <Draggable key={String(task._id)} draggableId={String(task._id)} index={index}>
                    {(provided) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TaskCard
                          task={task}
                          onClick={() => onSelectTask(task)}
                          onDelete={() => onDeleteTask(task)}
                        />
                      </motion.div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
            </TaskColumn>
          )
        })}
      </div>
    </DragDropContext>
  )
}

