'use client'
import { BarChart3, Flame, CalendarClock, Lightbulb, Brain, Settings } from 'lucide-react'

const tabs = [
  { key: 'Dashboard', icon: BarChart3 },
  { key: 'Trend Tracker', icon: Flame },
  { key: 'Schedule', icon: CalendarClock },
  { key: 'Idea', icon: Lightbulb },
  { key: 'Intelligence', icon: Brain },
  { key: 'Settings', icon: Settings },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl glass p-3 flex justify-between">
      {tabs.map(({ key, icon: Icon }) => (
        <button key={key} className="flex flex-col items-center text-xs hover:text-cyan-300 transition">
          <Icon size={18} />
          <span>{key}</span>
        </button>
      ))}
    </nav>
  )
}
