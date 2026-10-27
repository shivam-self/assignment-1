import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data = [
  { name: 'Jan', total: 24 },
  { name: 'Feb', total: 38 },
  { name: 'Mar', total: 42 },
  { name: 'Apr', total: 55 },
  { name: 'May', total: 48 },
  { name: 'Jun', total: 62 },
  { name: 'Jul', total: 70 },
  { name: 'Aug', total: 65 },
  { name: 'Sep', total: 78 },
  { name: 'Oct', total: 95 },
  { name: 'Nov', total: 88 },
  { name: 'Dec', total: 104 },
]

export function Overview() {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          direction='ltr'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
