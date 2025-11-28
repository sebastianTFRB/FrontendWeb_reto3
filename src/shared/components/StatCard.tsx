type StatCardProps = {
  label: string
  value: string | number
  helper?: string
  trend?: string
}

export const StatCard = ({ label, value, helper, trend }: StatCardProps) => {
  return (
    <div className="glass rounded-2xl border-white/10 bg-gradient-to-br from-pink-500/10 via-slate-900 to-slate-950 p-4 shadow shadow-pink-500/10">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
        {helper && <span>{helper}</span>}
        {trend && <span className="text-emerald-300">{trend}</span>}
      </div>
    </div>
  )
}
