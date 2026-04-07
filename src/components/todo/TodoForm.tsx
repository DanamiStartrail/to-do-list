'use client'
import { useState } from 'react'

interface TodoFormProps {
  onAdd: (task: string, category: string, priority: string) => void
  onLogout: () => void
}

export const TodoForm = ({ onAdd, onLogout }: TodoFormProps) => {
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('Pribadi')
  const [priority, setPriority] = useState('Medium')

  const categories = ['Pribadi', 'ITERA', 'Project']
  const priorities = [
    { name: 'Low', color: 'bg-emerald-400' },
    { name: 'Medium', color: 'bg-amber-400' },
    { name: 'High', color: 'bg-rose-500' }
  ]

  const handleSubmit = () => {
    if (!newTask.trim()) return
    onAdd(newTask, category, priority)
    setNewTask('')
  }

  return (
    <div className="w-full mb-12">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10 px-2">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            Raven<span className="text-emerald-500"></span>
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

        {/* Custom Selectors (Category & Priority) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 py-4 border-t border-slate-50 mt-2">
          
          {/* Category Selector */}
          <div className="flex gap-8 overflow-x-auto scrollbar-hide py-1">
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

          {/* Priority Selector (Dot Style) */}
          <div className="flex items-center gap-6 py-1">
            {priorities.map((p) => (
              <button
                key={p.name}
                onClick={() => setPriority(p.name)}
                className="flex items-center gap-2 group"
              >
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  priority === p.name ? `${p.color} ring-4 ring-${p.color.split('-')[1]}-500/10` : 'bg-slate-100 group-hover:bg-slate-200'
                }`} />
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