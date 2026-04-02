'use client'
import { useState } from 'react'

export const TodoForm = ({ onAdd, onLogout }: { onAdd: (task: string, cat: string, prio: string) => void, onLogout: () => void }) => {
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('Pribadi')
  const [priority, setPriority] = useState('Medium')

  const categories = ['Pribadi', 'ITERA', 'Project']
  const priorities = [
    { name: 'Low', color: 'bg-emerald-500' },
    { name: 'Medium', color: 'bg-amber-500' },
    { name: 'High', color: 'bg-rose-500' }
  ]

  const handleSubmit = () => {
    if (!newTask.trim()) return
    onAdd(newTask, category, priority)
    setNewTask('')
  }

  return (
    <div className="space-y-8">
      {/* Header Minimalis */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-2xl font-light tracking-[0.4em] text-white/90 uppercase">
            Raven<span className="font-black text-emerald-500 text-3xl">.</span>
          </h1>
          <p className="text-[9px] font-mono tracking-[0.3em] text-white/30 mt-1 uppercase">System_Protocol_v2</p>
        </div>
        <button 
          onClick={onLogout}
          className="text-[10px] font-bold tracking-widest text-white/20 hover:text-rose-500 transition-colors duration-500 uppercase pb-1 border-b border-white/5 hover:border-rose-500/50"
        >
          Logout
        </button>
      </div>

      {/* Input Section - Gaya Underline Glass */}
      <div className="relative group">
        {/* Glow Effect di Belakang Input */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
        
        <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 p-2 rounded-2xl">
          <div className="flex items-center">
            <input 
              value={newTask} 
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full bg-transparent px-6 py-5 text-white placeholder:text-white/10 outline-none text-lg font-light tracking-wide transition-all"
              placeholder="What's next?"
            />
            <button 
              onClick={handleSubmit} 
              className="px-8 py-4 bg-white text-black rounded-xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-emerald-400 transition-all active:scale-95 shrink-0 mr-2"
            >
              Execute
            </button>
          </div>

          {/* Selector Kategori & Prioritas yang Sangat Simpel */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-white/5 mt-2">
            
            {/* Kategori - Teks saja */}
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${
                    category === cat ? 'text-emerald-400' : 'text-white/20 hover:text-white/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Prioritas - Dot Style */}
            <div className="flex items-center gap-5">
              {priorities.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setPriority(p.name)}
                  className="flex items-center gap-2 group/prio"
                >
                  <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    priority === p.name ? `${p.color} ring-4 ring-${p.color.split('-')[1]}-500/20` : 'bg-white/10 group-hover/prio:bg-white/30'
                  }`} />
                  <span className={`text-[9px] font-bold uppercase tracking-widest transition-all ${
                    priority === p.name ? 'text-white/80' : 'text-white/10'
                  }`}>
                    {p.name}
                  </span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}