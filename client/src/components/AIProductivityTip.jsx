import { motion } from 'framer-motion'
import { Lightbulb, RefreshCcw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/axios'

export default function AIProductivityTip({ tasks }) {
    const [tip, setTip] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchTip = useCallback(async () => {
        if (!tasks || tasks.length === 0) {
            setTip('Add some tasks to get personalized productivity tips!')
            return
        }
        setLoading(true)
        setError('')
        try {
            const taskSummaries = tasks.slice(0, 10).map((t) => ({
                title: t.title,
                priority: t.priority,
                status: t.status,
                deadline: t.deadline,
            }))
            const res = await api.post('/ai/productivity-tip', { tasks: taskSummaries })
            setTip(res.data.tip || 'No tip available.')
        } catch {
            setError('Could not generate tip. Try again later.')
        } finally {
            setLoading(false)
        }
    }, [tasks])

    useEffect(() => {
        fetchTip()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className='glass p-4'
        >
            <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                    <div className='grid h-9 w-9 place-items-center rounded-2xl border border-yellow-400/30 bg-yellow-400/10'>
                        <Lightbulb className='h-4 w-4 text-yellow-300' />
                    </div>
                    <div>
                        <div className='text-sm font-semibold'>Productivity Tip</div>
                        <div className='text-xs text-white/60'>Powered by Gemini AI</div>
                    </div>
                </div>
                <button
                    className='btn !p-2'
                    onClick={fetchTip}
                    disabled={loading}
                    title='Refresh tip'
                >
                    <RefreshCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className='mt-4'>
                {loading ? (
                    <div className='space-y-2'>
                        <div className='h-3 rounded-full bg-white/10 animate-pulse w-full' />
                        <div className='h-3 rounded-full bg-white/10 animate-pulse w-4/5' />
                        <div className='h-3 rounded-full bg-white/10 animate-pulse w-3/5' />
                    </div>
                ) : error ? (
                    <div className='text-xs text-red-300'>{error}</div>
                ) : (
                    <motion.div
                        key={tip}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='rounded-xl border border-yellow-400/15 bg-yellow-400/5 p-3 text-sm text-white/80 leading-relaxed'
                    >
                        💡 {tip}
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}
