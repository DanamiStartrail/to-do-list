'use client'
import { useState, useEffect } from 'react'

export const TodoItem = ({ todo, onToggle, onDelete, onEdit }: any) => {
  const [showDesc, setShowDesc] = useState(false)
  const [, setTick] = useState(0)

  // Force re-render setiap menit untuk update status On Progress
  useEffect(() => {
    const timer = setInterval(() => setTick(prev => prev + 1), 60000)
    return () => clearInterval(timer)
  }, [])

  // --- HELPERS ---
  const formatTimeAgo = (dateStr: string) => {
    const created = new Date(dateStr);
    const now = new Date();
    const diffInSec = Math.floor((now.getTime() - created.getTime()) / 1000);
    if (diffInSec < 60) return 'Just Now';
    if (diffInSec < 3600) return `${Math.floor(diffInSec / 60)}m ago`;
    if (diffInSec < 86400) return `${Math.floor(diffInSec / 3600)}h ago`;
    return created.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const formatStart = (timeStr: string, insertedAt: string) => {
    if (!timeStr) return '';
    const d = new Date(insertedAt);
    const [hours, minutes] = timeStr.split(':');
    const isToday = d.toDateString() === new Date().toDateString();
    return `${isToday ? 'Today' : d.getDate() + ' ' + d.toLocaleString('id-ID', { month: 'short' })}, ${hours}:${minutes}`;
  };

  const formatDL = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const isToday = d.toDateString() === new Date().toDateString();
    const time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    return `${isToday ? 'Today' : d.getDate() + ' ' + d.toLocaleString('id-ID', { month: 'short' })}, ${time}`;
  };

  const isNow = (start: string | null, end: string | null) => {
    if (!start || !end || todo.is_completed) return false;
    const now = new Date().getTime();
    const startDate = new Date(todo.inserted_at); 
    const [sHours, sMinutes] = start.split(':').map(Number);
    startDate.setHours(sHours, sMinutes, 0, 0);
    const endDate = new Date(end).getTime();
    return now >= startDate.getTime() && now <= endDate;
  };

  // --- LOGIC STATES ---
  const active = isNow(todo.start_time, todo.deadline);
  const isOverdue = todo.deadline && !todo.is_completed && new Date(todo.deadline) < new Date();

  // --- STYLES ---
  const pStyle = {
    High: 'border-r-rose-500 shadow-[0_10px_30px_-15px_rgba(244,63,94,0.15)]',
    Medium: 'border-r-emerald-500',
    Low: 'border-r-slate-200'
  }[todo.priority as string] || 'border-r-slate-100';

  const statusStyle = active 
    ? 'border border-emerald-400 bg-emerald-50/30 animate-glow shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
    : isOverdue 
      ? 'border border-rose-200 bg-rose-50/30' 
      : 'border-slate-50 bg-white';

  return (
    <div className={`group px-6 py-5 rounded-[28px] border-r-[6px] flex items-start gap-5 transition-all hover:shadow-xl ${pStyle} ${statusStyle}`}>
      
      {/* 1. Checkbox */}
      <button 
        onClick={() => onToggle(todo.id, todo.is_completed)}
        className={`w-6 h-6 mt-1 rounded-xl border-2 transition-all flex items-center justify-center flex-shrink-0 ${
          todo.is_completed ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-slate-100 bg-slate-50'
        }`}
      >
        {todo.is_completed && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
      </button>

      {/* 2. Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-bold tracking-tight mb-1 transition-colors ${
          todo.is_completed ? 'text-slate-300 line-through' : active ? 'text-emerald-900' : 'text-slate-700'
        }`}>
          {todo.task}
        </h3>
        
        <div className="flex items-center gap-2 flex-wrap">
          {active && (
            <span className="flex items-center gap-1 text-[8px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full tracking-widest animate-bounce">
              ON PROGRESS
            </span>
          )}

          {todo.category && <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">{todo.category}</span>}
          
          <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">• {formatTimeAgo(todo.inserted_at)}</span>

          {/* START INDICATOR */}
          {todo.start_time && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-emerald-100 bg-emerald-50/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-600">
                START: {formatStart(todo.start_time, todo.inserted_at)}
              </span>
            </div>
          )}

          {/* DEADLINE INDICATOR */}
          {todo.deadline && (
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border transition-colors ${
              isOverdue ? 'bg-rose-50 border-rose-200 animate-pulse' : active ? 'bg-emerald-100 border-emerald-200' : 'bg-amber-50 border-amber-100/50'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={isOverdue ? "#e11d48" : active ? "#059669" : "#d97706"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className={`text-[8px] font-black uppercase tracking-tighter ${isOverdue ? 'text-rose-600' : active ? 'text-emerald-700' : 'text-amber-600'}`}>
                {isOverdue ? 'OVERDUE: ' : active ? 'UNTIL: ' : 'DL: '} {formatDL(todo.deadline)}
              </span>
            </div>
          )}
          
          {todo.description && (
            <button onClick={() => setShowDesc(!showDesc)} className={`text-[9px] font-bold transition-all ${showDesc ? 'text-emerald-600' : 'text-emerald-400'}`}>
              • {showDesc ? 'Hide Note' : 'See Note'}
            </button>
          )}
        </div>

        {showDesc && todo.description && (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-[11px] leading-relaxed text-slate-600 whitespace-pre-line font-medium">{todo.description}</p>
          </div>
        )}
      </div>

      {/* 3. Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
        <button 
          onClick={() => onEdit(todo)}
          className="p-2 text-slate-300 hover:text-emerald-500 transition-all"
          title="Edit Task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button 
          onClick={() => onDelete(todo.id)} 
          className="p-2 text-slate-300 hover:text-rose-500 transition-all"
          title="Delete Task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}