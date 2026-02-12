'use client'
import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { BottomNav } from '../components/BottomNav'
import { ThemeToggle } from '../components/ThemeToggle'

const series = [
  { day: 'Mon', views: 1900 },
  { day: 'Tue', views: 2600 },
  { day: 'Wed', views: 3200 },
  { day: 'Thu', views: 3000 },
  { day: 'Fri', views: 4200 },
]

export default function Page() {
  return (
    <main className="min-h-screen p-5 pb-28">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Creator Intelligence</h1>
        <ThemeToggle />
      </div>
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-5 mb-4">
        <h2 className="text-lg mb-3">Dashboard — YouTube</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Followers 120k', 'Views 2.4M', 'ER 6.2%', 'Growth +12%'].map((m) => <div key={m} className="bg-white/10 rounded-xl p-3">{m}</div>)}
        </div>
        <div className="h-40 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}><Tooltip /><Line type="monotone" dataKey="views" stroke="#22d3ee" strokeWidth={3} /></LineChart>
          </ResponsiveContainer>
        </div>
      </motion.section>
      <section className="grid md:grid-cols-2 gap-4">
        <div className="glass p-4"><h3 className="font-medium mb-2">Trend Tracker</h3><p>Real-time momentum, volume, velocity by country and platform.</p></div>
        <div className="glass p-4"><h3 className="font-medium mb-2">Idea Copilot</h3><p>AI hooks, captions, scripts, and hashtags from live trend + performance context.</p></div>
        <div className="glass p-4"><h3 className="font-medium mb-2">Schedule</h3><p>Calendar, composer, viral probability score, and multi-platform publishing queue.</p></div>
        <div className="glass p-4"><h3 className="font-medium mb-2">Intelligence</h3><p>7/30-day forecasts, heatmap posting windows, competitor strategy engine.</p></div>
      </section>
      <BottomNav />
    </main>
  )
}
