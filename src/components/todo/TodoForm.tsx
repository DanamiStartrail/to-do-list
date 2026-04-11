'use client'
import { useState } from 'react'

interface TodoFormProps {
  isOpen: boolean; // State untuk kontrol buka/tutup
  onClose: () => void; // Fungsi untuk menutup modal
  onAdd: (task: string, category: string, priority: string, isDaily: boolean, deadline: string | null) => void;
}

export const TodoForm = ({ isOpen, onClose, onAdd }: TodoFormProps) => {
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('Pribadi')
  const [priority, setPriority] = useState('Medium')
  const [isDaily, setIsDaily] = useState(false)
  const [deadline, setDeadline] = useState('')

  if (!isOpen) return null; // Jika tidak open, jangan render apa-apa

  const handleSubmit = () => {
    if (!newTask.trim()) return
    onAdd(newTask, category, priority, isDaily, deadline || null)
    setNewTask('')
    setIsDaily(false)
    setDeadline('')
    onClose(); // Tutup modal setelah berhasil nambah
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop (Latar belakang gelap blur) */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose} // Klik luar untuk tutup
      />

      {/* Box Modal (Isi Form) */}
      <div className="relative w-full max-w-xl bg-white border border-slate-100 p-6 md:p-8 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in duration-300">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">New Task</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-rose-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="space-y-6">
          <input 
            autoFocus
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-slate-50 border-none px-6 py-5 text-slate-800 placeholder:text-slate-300 outline-none text-xl font-medium rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all"
            placeholder="Apa tugas barumu?"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Category</label>
              <div className="flex gap-2 flex-wrap">
                {['Pribadi', 'ITERA', 'Project'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      category === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Settings</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsDaily(!isDaily)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border transition-all ${
                    isDaily ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white border-slate-100 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">Daily</span>
                </button>
                <input 
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-black uppercase px-3 rounded-xl outline-none focus:border-emerald-500 transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            className="w-full bg-emerald-500 text-white py-5 rounded-[24px] font-black text-xs tracking-[0.3em] uppercase hover:bg-slate-900 transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/10 mt-4"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  )
}