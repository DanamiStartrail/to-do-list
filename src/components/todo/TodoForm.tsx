'use client'
import { useState } from 'react'

interface TodoFormProps {
  onAdd: (task: string, category: string, priority: string, isDaily: boolean, deadline: string | null) => void
  onLogout: () => void
}

export const TodoForm = ({ onAdd, onLogout }: TodoFormProps) => {
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('Pribadi')
  const [priority, setPriority] = useState('Medium')
  const [isDaily, setIsDaily] = useState(false)
  const [deadline, setDeadline] = useState('')

  const categories = ['Pribadi', 'ITERA', 'Project']
  const priorities = [
    { name: 'Low', color: 'bg-emerald-400' },
    { name: 'Medium', color: 'bg-amber-400' },
    { name: 'High', color: 'bg-rose-500' }
  ]

  const handleSubmit = () => {
    if (!newTask.trim()) return
    onAdd(newTask, category, priority, isDaily, deadline || null)
    setNewTask('')
    setIsDaily(false)
    setDeadline('')
  }

  return (
    <div className="w-full mb-12">
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

      <div className="bg-white border border-slate-100 p-2 md:p-3 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all focus-within:shadow-[0_20px_60px_rgba(16,185,129,0.06)]">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <input 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-transparent px-6 py-4 text-slate-800 placeholder:text-slate-300 outline-none text-lg font-medium"
            placeholder="Apa rencana besok?"
          />
          <button 
            onClick={handleSubmit} 
            className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-[24px] font-bold text-[11px] tracking-widest uppercase hover:bg-emerald-500 transition-all active:scale-95 shrink-0 shadow-lg shadow-slate-900/10"
          >
            Add Task
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 py-4 border-t border-slate-50 mt-2">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-4 border-r border-slate-100 pr-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-[11px] font-black tracking-[0.2em] uppercase transition-all ${
                    category === cat ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsDaily(!isDaily)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                  isDaily ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isDaily ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest">Daily</span>
              </button>

              <input 
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="text-[9px] font-black uppercase bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-slate-500 outline-none focus:border-emerald-500 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 py-1">
            {priorities.map((p) => (
              <button
                key={p.name}
                onClick={() => setPriority(p.name)}
                className="flex items-center gap-2 group"
              >
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  priority === p.name ? p.color : 'bg-slate-100'
                }`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
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