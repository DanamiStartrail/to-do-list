'use client'
import { useState, useEffect } from 'react'

export const TodoForm = ({ isOpen, onClose, onAdd, initialData = null, categories = [] }: any) => {
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('Pribadi')
  const [isDaily, setIsDaily] = useState(false)
  const [deadline, setDeadline] = useState('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium');
  const [startTime, setStartTime] = useState("");

  const getLocalDatetime = (isoString: string) => {
    const d = new Date(isoString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  useEffect(() => {
    if (initialData && isOpen) {
      setNewTask(initialData.task || '');
      setCategory(initialData.category || 'Pribadi');
      setIsDaily(initialData.is_daily || false);
      if (initialData.deadline) {
        if (initialData.is_daily) {
          const d = new Date(initialData.deadline);
          const pad = (n: number) => n.toString().padStart(2, '0');
          setDeadline(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
        } else {
          setDeadline(getLocalDatetime(initialData.deadline));
        }
      } else {
        setDeadline('');
      }
      setSelectedDays(initialData.repeat_days || []);
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'Medium');
      if (initialData.start_time) {
        if (initialData.start_time.includes('T')) {
          const d = new Date(initialData.start_time);
          const pad = (n: number) => n.toString().padStart(2, '0');
          setStartTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
        } else {
          setStartTime(initialData.start_time);
        }
      } else {
        setStartTime('');
      }
    } else if (!initialData && isOpen) {
      setNewTask(''); setCategory('Pribadi'); setIsDaily(false); setDeadline('');
      setSelectedDays([]); setDescription(''); setPriority('Medium'); setStartTime('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const toggleDay = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  const handleSubmit = () => {
    if (!newTask.trim()) return;
    onAdd(newTask, category, priority, isDaily, deadline, selectedDays, description, startTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 sm:items-start sm:pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[2px]" onClick={onClose} />

      {/* Form Container (Ala Todoist) */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-stone-200 flex flex-col overflow-hidden animate-fade-in-up">
        
        {/* Area Input Teks (Tanpa Border) */}
        <div className="p-4 sm:p-5">
          <input 
            autoFocus value={newTask} onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full text-lg font-semibold text-stone-900 placeholder:text-stone-400 outline-none border-none bg-transparent mb-2 p-0"
            placeholder="Task name"
          />
          
          <textarea 
            value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm text-stone-600 placeholder:text-stone-400 outline-none border-none bg-transparent resize-none p-0"
            placeholder="Description"
            rows={2}
          />

          {/* Area Options (Kategori, Priority) */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            
            {/* Dropdown Category Minimalis */}
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="text-xs font-medium text-stone-600 bg-white border border-stone-200 rounded py-1 px-2 outline-none cursor-pointer hover:bg-stone-50"
            >
              {categories.map((cat: string) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Pill Priority */}
            <div className="flex bg-stone-100 p-0.5 rounded">
              {['Low', 'Medium', 'High'].map((p) => (
                <button 
                  key={p} type="button" onClick={() => setPriority(p)} 
                  className={`px-3 py-1 rounded-sm text-[10px] font-semibold uppercase transition-all ${priority === p ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Area Time & Routine (Ringkas) */}
          <div className="mt-4 bg-stone-50/50 border border-stone-200 rounded-lg p-3">
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input type="checkbox" checked={isDaily} onChange={e => setIsDaily(e.target.checked)} className="w-3.5 h-3.5 rounded-sm border-stone-300 text-stone-800 focus:ring-stone-800" />
              <span className="text-xs font-medium text-stone-700">Daily Routine</span>
            </label>

            {isDaily && (
              <div className="flex justify-between gap-1 mb-3">
                {days.map((day, idx) => (
                  <button key={day} type="button" onClick={() => toggleDay(fullDays[idx])} className={`flex-1 py-1 rounded text-[10px] font-medium transition-all border ${selectedDays.includes(fullDays[idx]) ? 'bg-stone-200 text-stone-800 border-stone-300' : 'bg-white text-stone-400 border-stone-200'}`}>
                    {day}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] text-stone-500 block mb-1">Start Time</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-white border border-stone-200 text-xs px-2 py-1.5 rounded outline-none text-stone-700" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-stone-500 block mb-1">Deadline</label>
                <input type={isDaily ? "time" : "datetime-local"} value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full bg-white border border-stone-200 text-xs px-2 py-1.5 rounded outline-none text-stone-700" />
              </div>
            </div>
          </div>

        </div>

        {/* Footer Area (Cancel / Submit) */}
        <div className="flex justify-between items-center bg-stone-50 border-t border-stone-100 p-3 px-4 sm:px-5">
           
           <div className="flex items-center gap-2">
             <span className="text-xs text-stone-400">Projectspace:</span>
             <span className="text-xs font-medium text-stone-600">{category}</span>
           </div>

           <div className="flex gap-2">
             <button onClick={onClose} className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-200/50 rounded transition-colors font-medium">Cancel</button>
             <button onClick={handleSubmit} disabled={!newTask.trim()} className="px-4 py-1.5 bg-[#DC4C3E] hover:bg-[#C53727] text-white rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
               {initialData ? 'Save' : 'Add task'}
             </button>
           </div>
        </div>

      </div>
    </div>
  )
}