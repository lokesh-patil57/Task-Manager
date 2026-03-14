import { UserCircle, Mail, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-white/60 mt-1">Your account details</p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/20 bg-white/10">
            <UserCircle className="h-8 w-8 text-indigo-300" />
          </div>
          <div>
            <div className="text-lg font-semibold">{user?.name || 'TaskFlow User'}</div>
            <div className="flex items-center gap-1.5 text-sm text-white/60">
              <Mail className="h-3.5 w-3.5" />
              {user?.email || '—'}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-white/50 mb-1">Account ID</div>
            <div className="font-mono text-xs text-white/70 break-all">{user?.id || '—'}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-start gap-2">
            <Calendar className="h-4 w-4 text-white/40 mt-0.5 shrink-0" />
            <div>
              <div className="text-white/50 mb-0.5">Member since</div>
              <div className="text-white/70">2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
