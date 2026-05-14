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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white p-6 md:p-8 rounded-lg shadow-xl border border-stone-200">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-stone-900">
            {initialData ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-800 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="space-y-6">
          <input 
            autoFocus value={newTask} onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-transparent border-b-2 border-stone-200 py-2 text-stone-800 placeholder:text-stone-400 outline-none text-xl focus:border-stone-800 transition-colors"
            placeholder="What needs to be done?"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Projectspace</label>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat: string) => (
                  <button key={cat} type="button" onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-md text-xs transition-all ${category === cat ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Priority</label>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map((p) => (
                  <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-1.5 rounded-md text-xs border transition-all ${priority === p ? 'bg-stone-100 border-stone-800 text-stone-900 font-medium' : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-stone-200 p-4 rounded-md space-y-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="dailyCheck" checked={isDaily} onChange={e => setIsDaily(e.target.checked)} className="w-4 h-4 rounded-[3px] border-stone-300 text-stone-800 focus:ring-stone-800" />
              <label htmlFor="dailyCheck" className="text-sm text-stone-700 cursor-pointer">Set as Daily Routine</label>
            </div>

            <div className={`space-y-3 transition-all ${isDaily ? 'block' : 'hidden'}`}>
              <div className="flex justify-between gap-1">
                {days.map((day, idx) => (
                  <button key={day} type="button" onClick={() => toggleDay(fullDays[idx])} className={`flex-1 py-1.5 rounded text-xs transition-all border ${selectedDays.includes(fullDays[idx]) ? 'bg-stone-200 text-stone-800 border-stone-300' : 'bg-white text-stone-400 border-stone-200'}`}>
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-stone-500">Start Time</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-white border border-stone-200 text-sm px-2 py-1.5 rounded-md outline-none text-stone-700" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-stone-500">Deadline</label>
                <input type={isDaily ? "time" : "datetime-local"} value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full bg-white border border-stone-200 text-sm px-2 py-1.5 rounded-md outline-none text-stone-700" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Note</label>
            <textarea 
              value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-stone-800 placeholder:text-stone-400 outline-none text-sm rounded-md h-20 resize-none focus:border-stone-400 transition-colors"
              placeholder="Add extra details..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
             <button onClick={onClose} className="px-4 py-2 text-sm text-stone-500 hover:text-stone-800 font-medium transition-colors">Cancel</button>
             <button onClick={handleSubmit} className="px-6 py-2 bg-stone-800 text-white rounded-md text-sm font-medium hover:bg-stone-900 transition-colors">
               {initialData ? 'Save' : 'Create'}
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}