import { motion } from 'framer-motion'

export default function StatsCard({ title, value, subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className='glass-subtle p-4'
    >
      <div className='text-xs text-white/60'>{title}</div>
      <div className='mt-1 text-2xl font-semibold tracking-tight'>{value}</div>
      {subtitle ? <div className='mt-1 text-sm text-white/65'>{subtitle}</div> : null}
    </motion.div>
  )
}

