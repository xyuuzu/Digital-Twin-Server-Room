import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ChartProps {
  data: { time: string; avgTemp: number }[]
}

export default function TemperatureChart({ data }: ChartProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Average Temperature (Last 10 Updates)</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="avgTemp" stroke="#f87171" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
