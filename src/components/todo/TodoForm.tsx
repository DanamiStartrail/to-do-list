'use client'
import { useState } from 'react'

export const TodoForm = ({ onAdd, onLogout }: { onAdd: (task: string, cat: string, prio: string) => void, onLogout: () => void }) => {
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('Pribadi')
  const [priority, setPriority] = useState('Medium')

  const handleSubmit = () => {
    if (!newTask.trim()) return
    onAdd(newTask, category, priority)
    setNewTask('')
  }

  const priorities = [
    { name: 'Low', color: 'bg-emerald-500' },
    { name: 'Medium', color: 'bg-amber-500' },
    { name: 'High', color: 'bg-rose-500' }
  ]

  return (
    <div className="space-y-12 mb-16">
      {/* Header - Mewah & Simpel */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-3xl font-extralight tracking-[0.6em] text-white/90 uppercase">
            Raven<span className="font-semibold text-emerald-500">.</span>
          </h1>
          <p className="text-[10px] font-medium tracking-[0.4em] text-white/20 mt-2 uppercase">ITERA_INF_SYS_V3</p>
        </div>
        <button 
          onClick={onLogout}
          className="text-[10px] font-bold tracking-widest text-white/30 hover:text-rose-500 transition-colors duration-300 uppercase pb-1 border-b border-white/5"
        >
          Logout
        </button>
      </div>

      {/* Input Section - Super Minimalis dengan Efek Kaca (Glass) */}
      <div className="bg-[#111111] border border-white/[0.03] p-6 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-transparent px-4 py-3 text-white placeholder:text-white/10 outline-none text-xl font-extralight tracking-wide"
            placeholder="Execute New Task_"
          />
          <button 
            onClick={handleSubmit} 
            className="w-full md:w-auto px-10 py-4 bg-white text-black rounded-lg font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-emerald-400 transition-all shrink-0 active:scale-95"
          >
            Execute
          </button>
        </div>

        {/* Selektor Detail - Transparan & Tipis */}
        <div className="flex justify-between items-center gap-4 px-4 pt-6 mt-6 border-t border-white/[0.03]">
          
          {/* Kategori - Teks Saja */}
          <div className="flex gap-6 overflow-x-auto scrollbar-hide py-1">
            {['Pribadi', 'ITERA', 'Project'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-[11px] font-semibold tracking-[0.25em] uppercase transition-all ${
                  category === cat ? 'text-emerald-400' : 'text-white/20 hover:text-white/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Prioritas - Dot Style */}
          <div className="flex items-center gap-6 py-1">
            {priorities.map((p) => (
              <button key={p.name} onClick={() => setPriority(p.name)} className="group/prio">
                <span className={`w-2.5 h-2.5 rounded-full block ${
                  priority === p.name ? `${p.color} ring-4 ring-${p.color.split('-')[1]}-500/10` : 'bg-white/10 group-hover/prio:bg-white/30'
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}