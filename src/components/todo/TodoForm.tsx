'use client'
import { useState } from 'react'

interface TodoFormProps {
  // Update signature agar menerima isDaily (Boolean)
  onAdd: (task: string, category: string, priority: string, isDaily: boolean) => void
  onLogout: () => void
}

export const TodoForm = ({ onAdd, onLogout }: TodoFormProps) => {
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('Pribadi')
  const [priority, setPriority] = useState('Medium')
  const [isDaily, setIsDaily] = useState(false) // State baru untuk Daily

  const categories = ['Pribadi', 'ITERA', 'Project']
  const priorities = [
    { name: 'Low', color: 'bg-emerald-400' },
    { name: 'Medium', color: 'bg-amber-400' },
    { name: 'High', color: 'bg-rose-500' }
  ]

  const handleSubmit = () => {
    if (!newTask.trim()) return
    onAdd(newTask, category, priority, isDaily) // Kirim status isDaily
    setNewTask('')
    setIsDaily(false) // Reset toggle setelah input
  }

  return (
    <div className="w-full mb-12">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10 px-2">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            Raven<span className="text-emerald-500">.</span>
          </h1>
          <p className="text-[10px] font-bold tracking-[0.4em] text-slate-300 uppercase mt-1">
            Task Management System
          </p>
        </div>
        <button 
          onClick={onLogout}
          className="text-[10px] font-black tracking-widest text-slate-400 hover:text-rose-500 transition-all uppercase border-b-2 border-slate-100 pb-1"
        >
          Logout
        </button>
      </div>

      {/* Input Card */}
      <div className="bg-white border border-slate-100 p-2 md:p-3 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all focus-within:shadow-[0_20px_60px_rgba(16,185,129,0.06)]">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <input 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-transparent px-6 py-4 text-slate-800 placeholder:text-slate-300 outline-none text-lg font-medium"
            placeholder="What needs to be done?"
          />
          <button 
            onClick={handleSubmit} 
            className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-[24px] font-bold text-[11px] tracking-widest uppercase hover:bg-emerald-500 transition-all active:scale-95 shrink-0 shadow-lg shadow-slate-900/10"
          >
            Add Task
          </button>
        </div>

        {/* Custom Selectors */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 py-4 border-t border-slate-50 mt-2">
          
          <div className="flex items-center gap-8">
            {/* Category Selector */}
            <div className="flex gap-6 overflow-x-auto scrollbar-hide py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-[11px] font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap ${
                    category === cat ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Daily Toggle (Fitur Baru) */}
            <button 
              onClick={() => setIsDaily(!isDaily)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                isDaily 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                : 'bg-slate-50 border-slate-100 text-slate-400'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isDaily ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <span className="text-[9px] font-black uppercase tracking-widest">Daily_Reset</span>
            </button>
          </div>

          {/* Priority Selector */}
          <div className="flex items-center gap-6 py-1">
            {priorities.map((p) => (
              <button
                key={p.name}
                onClick={() => setPriority(p.name)}
                className="flex items-center gap-2 group"
              >
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  priority === p.name ? `${p.color} ring-4 ring-opacity-20` : 'bg-slate-100 group-hover:bg-slate-200'
                }`} 
                style={priority === p.name ? { boxShadow: `0 0 12px ${p.color.replace('bg-', '')}` } : {}}
                />
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-all ${
                  priority === p.name ? 'text-slate-800' : 'text-slate-300'
                }`}>
                  {p.name}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}