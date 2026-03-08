'use client'
import { useState } from 'react'

export const TodoForm = ({ onAdd, onLogout }: { onAdd: (task: string, cat: string, prio: string) => void, onLogout: () => void }) => {
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('Pribadi')
  const [priority, setPriority] = useState('Medium')

  const categories = [
    { name: 'Pribadi', color: 'text-green-400', border: 'border-green-400/30' },
    { name: 'ITERA', color: 'text-blue-400', border: 'border-blue-400/30' },
    { name: 'Project', color: 'text-purple-400', border: 'border-purple-400/30' }
  ]

  const handleSubmit = () => {
    if (!newTask.trim()) return
    onAdd(newTask, category, priority)
    setNewTask('')
  }

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="bg-slate-900/80 backdrop-blur-3xl p-6 md:p-10 rounded-[2rem] border border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(0,255,65,0.8)]">🦅</span>
          <h1 className="text-xl md:text-3xl font-black text-white italic uppercase">RAVEN<span className="text-green-400">LIST</span></h1>
        </div>
        <button onClick={onLogout} className="text-[9px] font-black uppercase text-red-400 border border-red-500/40 py-2 px-5 rounded-xl hover:bg-red-500 hover:text-black transition-all">DISCONNECT</button>
      </div>

      {/* Input Section */}
      <div className="bg-slate-900/90 backdrop-blur-2xl p-4 md:p-8 rounded-[2rem] border border-white/10 space-y-6">
        <div className="relative flex items-center">
          <input 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full pl-12 pr-20 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white font-mono"
            placeholder="Execute_New_Task..."
          />
          <button onClick={handleSubmit} className="absolute right-3 top-3 bottom-3 bg-green-500 text-black px-6 rounded-xl font-black text-xs">ADD_TASK</button>
        </div>
        
        {/* Chips Kategori & Prioritas (Pindahkan kode chips ke sini) */}
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button key={cat.name} onClick={() => setCategory(cat.name)} className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase transition-all ${category === cat.name ? `${cat.color} ${cat.border} bg-white/10` : 'text-slate-600 border-transparent'}`}>{cat.name}</button>
              ))}
            </div>
            <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map((p) => (
                  <button key={p} onClick={() => setPriority(p)} className={`px-4 py-1.5 rounded-lg border text-[9px] font-bold uppercase transition-all ${priority === p ? 'border-green-500 text-green-400' : 'text-slate-600 border-white/5'}`}>{p}</button>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}