import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'

const PRIORITIES = ['all', 'low', 'medium', 'high']
const STATUSES = ['all', 'pending', 'in-progress', 'done']
const DEADLINES = ['all', 'overdue', 'today', 'upcoming', 'none']

export default function TaskFilters({ filters, onChange }) {
    const hasActiveFilter =
        filters.search ||
        filters.priority !== 'all' ||
        filters.status !== 'all' ||
        filters.deadline !== 'all'

    function reset() {
        onChange({ search: '', priority: 'all', status: 'all', deadline: 'all' })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className='glass-subtle p-3'
        >
            <div className='flex flex-wrap items-center gap-2'>
                {/* Search */}
                <div className='relative flex-1 min-w-[160px]'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none' />
                    <input
                        type='text'
                        className='input pl-9 text-sm h-9 py-0'
                        placeholder='Search tasks…'
                        value={filters.search}
                        onChange={(e) => onChange({ ...filters, search: e.target.value })}
                    />
                    {filters.search && (
                        <button
                            className='absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80'
                            onClick={() => onChange({ ...filters, search: '' })}
                        >
                            <X className='h-3.5 w-3.5' />
                        </button>
                    )}
                </div>

                {/* Priority filter */}
                <div className='flex items-center gap-1'>
                    <SlidersHorizontal className='h-3.5 w-3.5 text-white/50' />
                    <select
                        className='input text-sm h-9 py-0 pr-7 pl-2 w-auto cursor-pointer'
                        value={filters.priority}
                        onChange={(e) => onChange({ ...filters, priority: e.target.value })}
                    >
                        {PRIORITIES.map((p) => (
                            <option key={p} value={p} className='bg-gray-900 capitalize'>
                                {p === 'all' ? 'All Priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status filter */}
                <select
                    className='input text-sm h-9 py-0 pr-7 pl-2 w-auto cursor-pointer'
                    value={filters.status}
                    onChange={(e) => onChange({ ...filters, status: e.target.value })}
                >
                    {STATUSES.map((s) => (
                        <option key={s} value={s} className='bg-gray-900'>
                            {s === 'all' ? 'All Statuses' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>

                {/* Deadline filter */}
                <select
                    className='input text-sm h-9 py-0 pr-7 pl-2 w-auto cursor-pointer'
                    value={filters.deadline}
                    onChange={(e) => onChange({ ...filters, deadline: e.target.value })}
                >
                    {DEADLINES.map((d) => (
                        <option key={d} value={d} className='bg-gray-900 capitalize'>
                            {d === 'all' ? 'All Deadlines' : d.charAt(0).toUpperCase() + d.slice(1)}
                        </option>
                    ))}
                </select>

                {hasActiveFilter && (
                    <button
                        className='btn !py-1.5 !px-3 text-xs text-white/70'
                        onClick={reset}
                    >
                        <X className='h-3 w-3' />
                        Clear
                    </button>
                )}
            </div>
        </motion.div>
    )
}
