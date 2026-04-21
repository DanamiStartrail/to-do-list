'use client'
import { useState } from 'react'

export const TodoForm = ({ isOpen, onClose, onAdd }: any) => {
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('Pribadi')
  const [isDaily, setIsDaily] = useState(false)
  const [deadline, setDeadline] = useState('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium');
  const [startTime, setStartTime] = useState("");

  if (!isOpen) return null

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const toggleDay = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  const handleSubmit = () => {
    if (!newTask.trim()) return;

    let finalDeadline = null;
    if (deadline) {
      finalDeadline = new Date(deadline).toISOString(); 
    }

    onAdd(newTask, category, priority, isDaily, finalDeadline, selectedDays, description, startTime);
    
    setNewTask('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white p-6 md:p-8 rounded-[32px] shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">New Task</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-rose-500 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="space-y-5">
          {/* Main Input */}
          <input 
            autoFocus value={newTask} onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-slate-50 border-none px-6 py-4 text-slate-800 placeholder:text-slate-300 outline-none text-lg font-medium rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all"
            placeholder="Ketik tugas barumu..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Workspace</label>
              <div className="flex gap-1.5 flex-wrap">
                {['Pribadi', 'ITERA', 'Project'].map(cat => (
                  <button key={cat} type="button" onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase transition-all ${category === cat ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{cat}</button>
                ))}
              </div>
            </div>

            {/* Quick Settings */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Time & Schedule</label>
              <div className="flex gap-2">
                {/* Input Start Time */}
                <input 
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                  className="flex-1 bg-slate-50 border-none text-[10px] font-bold px-3 py-2 rounded-xl outline-none text-slate-600 cursor-pointer focus:ring-2 focus:ring-emerald-500/20" 
                  placeholder="Start"
                />
                {/* Input Deadline */}
                <input 
                  type="datetime-local" 
                  value={deadline} 
                  onChange={(e) => setDeadline(e.target.value)} 
                  className="flex-2 bg-slate-50 border-none text-[9px] font-black uppercase px-2 rounded-xl outline-none text-slate-600 cursor-pointer focus:ring-2 focus:ring-rose-500/20" 
                />
              </div>
            </div>
          </div> {/* <-- Penutup Grid di sini */}

          {/* Priority Level Selector */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Priority_Rank</label>
            <div className="flex gap-1.5 p-1 bg-slate-50 rounded-[18px] border border-slate-100/50">
              {['Low', 'Medium', 'High'].map((p) => (
                <button 
                  key={p} type="button" onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-[14px] text-[9px] font-black uppercase transition-all duration-200 ${
                    priority === p 
                      ? p === 'High' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' :
                        p === 'Medium' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' :
                        'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Days Selector */}
          <div className={`space-y-2 transition-all duration-300 ${isDaily ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 h-0 overflow-hidden'}`}>
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Repeat On Specific Days</label>
            <div className="flex justify-between gap-1">
              {days.map((day, idx) => (
                <button 
                  key={day} type="button" onClick={() => toggleDay(fullDays[idx])}
                  className={`flex-1 py-2 rounded-lg text-[9px] font-bold transition-all ${selectedDays.includes(fullDays[idx]) ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-transparent'} border`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Description (Optional)</label>
            <textarea 
              value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border-none px-4 py-3 text-slate-700 placeholder:text-slate-300 outline-none text-xs font-medium rounded-xl focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none h-20"
              placeholder="Tambahkan detail tugas atau catatan..."
            />
          </div>

          <button onClick={handleSubmit} className="w-full bg-emerald-500 text-white py-4 rounded-[20px] font-black text-[10px] tracking-[0.2em] uppercase hover:bg-slate-900 transition-all shadow-lg shadow-emerald-500/10">
            Create Task
          </button>
        </div>
      </div>
    </div>
  )
}