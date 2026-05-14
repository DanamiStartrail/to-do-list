'use client'
import { useState, useEffect } from 'react'

export const TodoItem = ({ todo, onToggle, onDelete, onEdit }: any) => {
  const [showDesc, setShowDesc] = useState(false)
  const [, setTick] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setTick(prev => prev + 1), 60000)
    return () => clearInterval(timer)
  }, [])

  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const diffInSec = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (diffInSec < 60) return 'Just Now';
    if (diffInSec < 3600) return `${Math.floor(diffInSec / 60)}m ago`;
    if (diffInSec < 86400) return `${Math.floor(diffInSec / 3600)}h ago`;
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const formatStart = (timeStr: string) => {
    if (!timeStr) return '';
    if (timeStr.includes('T')) {
       const d = new Date(timeStr);
       return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    }
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  };

  const formatDL = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    if (todo.is_daily) return time;
    const isToday = d.toDateString() === new Date().toDateString();
    return `${isToday ? 'Today' : d.getDate() + ' ' + d.toLocaleString('en-GB', { month: 'short' })}, ${time}`;
  };

  const extractTime = (timeStr: string) => {
    if (timeStr.includes('T')) {
       const d = new Date(timeStr);
       return [d.getHours(), d.getMinutes()];
    }
    return timeStr.split(':').map(Number);
  };

  const isNow = (start: string | null, end: string | null) => {
    if (!start || !end || todo.is_completed) return false;
    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
    const [sHours, sMinutes] = extractTime(start);
    const startTotalMinutes = sHours * 60 + sMinutes;
    const endDate = new Date(end);
    const endTotalMinutes = endDate.getHours() * 60 + endDate.getMinutes();
    return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
  };

  const checkOverdue = () => {
    if (!todo.deadline || todo.is_completed) return false;
    const now = new Date();
    const deadlineDate = new Date(todo.deadline);
    if (todo.is_daily) {
      return (now.getHours() * 60 + now.getMinutes()) > (deadlineDate.getHours() * 60 + deadlineDate.getMinutes());
    }
    return now > deadlineDate;
  };

  const active = isNow(todo.start_time, todo.deadline);
  const isOverdue = checkOverdue();

  const priorityColor = {
    High: 'bg-rose-500',
    Medium: 'bg-amber-500',
    Low: 'bg-stone-300'
  }[todo.priority as string] || 'bg-stone-200';

  return (
    <div className="group flex items-start gap-4 py-4 border-b border-stone-200 hover:bg-stone-100/50 transition-colors px-2">
      
      <button 
        onClick={() => onToggle(todo.id, todo.is_completed)}
        className={`w-4 h-4 mt-1 rounded-[3px] border flex items-center justify-center flex-shrink-0 transition-colors ${
          todo.is_completed ? 'bg-stone-400 border-stone-400' : isOverdue ? 'border-rose-400 bg-rose-50' : 'border-stone-300 bg-white hover:border-stone-500'
        }`}
      >
        {todo.is_completed && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
      </button>

      <div className="flex-1 min-w-0">
        
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onEdit(todo)}>
            <div className={`w-1.5 h-1.5 rounded-full ${priorityColor}`} title={`Priority: ${todo.priority}`} />
            
            <h3 className={`text-[15px] leading-tight ${todo.is_completed ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
              {todo.task}
            </h3>
            
            {active && (
              <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded ml-1">
                On Progress
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); onEdit(todo); }} className="text-stone-400 hover:text-stone-800 text-xs">Edit</button>
            <span className="text-stone-300">|</span>
            <button onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }} className="text-stone-400 hover:text-rose-500 text-xs">Delete</button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-1.5 text-xs text-stone-500">
          
          {todo.category && <span>{todo.category}</span>}
          
          {(todo.start_time || todo.deadline) && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-rose-500 font-medium' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>
                {todo.start_time ? formatStart(todo.start_time) + ' - ' : ''}
                {todo.deadline ? formatDL(todo.deadline) : ''}
              </span>
            </div>
          )}

          {todo.is_daily && (
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.44l5.36 5.36"/></svg>
              Daily
            </span>
          )}

          {todo.description && (
            <button onClick={() => setShowDesc(!showDesc)} className="text-stone-400 hover:text-stone-700 underline underline-offset-2 decoration-stone-200">
              {showDesc ? 'Hide Note' : 'Note'}
            </button>
          )}

          <span className="ml-auto text-[10px] text-stone-400">{formatTimeAgo(todo.inserted_at)}</span>
        </div>

        {showDesc && todo.description && (
          <div className="mt-3 pl-3 border-l-2 border-stone-200 py-0.5">
            <p className="text-sm text-stone-600 whitespace-pre-line">{todo.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}