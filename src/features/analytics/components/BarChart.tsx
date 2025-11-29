type BarChartProps = {
  points: { label: string; value: number }[]
}

export const BarChart = ({ points }: BarChartProps) => {
  const max = Math.max(...points.map((p) => p.value), 1)
  return (
    <div className="flex items-end gap-3">
      {points.map((point) => (
        <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-lg bg-gradient-to-t from-indigo-500 via-red-500 to-black-400"
            style={{ height: `${(point.value / max) * 160}px` }}
          />
          <span className="text-xs text-slate-300">{point.label}</span>
        </div>
      ))}
    </div>
  )
}
