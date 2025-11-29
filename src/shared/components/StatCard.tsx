type StatCardProps = {
  label: string
  value: string | number
  helper?: string
  trend?: string
}

export const StatCard = ({ label, value, helper, trend }: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-red-600/30 bg-gradient-to-br from-red-900/30 via-black to-black p-4 shadow shadow-red-900/20">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
        {helper && <span>{helper}</span>}
        {trend && <span className="text-emerald-300">{trend}</span>}
      </div>
    </div>
  )
}
