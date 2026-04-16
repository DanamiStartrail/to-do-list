'use client'
import { useState } from 'react'

export const TodoItem = ({ todo, onToggle, onDelete, onRename }: any) => {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(todo.task)
  const [showDesc, setShowDesc] = useState(false)

  // --- HELPER TIME AGO ---
  const formatTimeAgo = (dateStr: string) => {
    const created = new Date(dateStr);
    const now = new Date();
    const diffInSec = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSec < 60) return 'Just Now';
    if (diffInSec < 3600) return `${Math.floor(diffInSec / 60)}m ago`;
    if (diffInSec < 86400) return `${Math.floor(diffInSec / 3600)}h ago`;
    
    // Jika lewat 24 jam, tampilkan tanggal (14 Apr)
    return created.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const saveRename = () => {
    setIsEditing(false)
    if (text.trim() && text !== todo.task) onRename(todo.id, text)
    else setText(todo.task)
  }

  // Di TodoItem.tsx, bagian pStyle
  const pStyle = {
    High: 'border-r-rose-500 shadow-[0_10px_30px_-15px_rgba(244,63,94,0.15)]',
    Medium: 'border-r-emerald-500',
    Low: 'border-r-slate-200'
  }[todo.priority as string] || 'border-r-slate-100';

  // Di dalam TodoItem.tsx, sebelum bagian return

    const isOverdue = todo.deadline && !todo.is_completed && new Date(todo.deadline) < new Date();

    const formatDL = (dateStr: string) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const day = d.getDate();
      const month = d.toLocaleString('id-ID', { month: 'short' });
      
      const isToday = d.toDateString() === new Date().toDateString();
      return `${isToday ? 'Today' : day + ' ' + month}, ${hours}:${minutes}`;
    };

    const overdueStyle = isOverdue ? 'border border-rose-200 bg-rose-50/30' : 'border-slate-50 bg-white';
  
  return (
    <div className={`group px-6 py-5 rounded-[28px] border-r-[6px] flex items-start gap-5 transition-all hover:shadow-xl ${pStyle} ${overdueStyle}`}>      
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
        {isEditing ? (
          <input
            autoFocus value={text} onChange={(e) => setText(e.target.value)}
            onBlur={saveRename} onKeyDown={(e) => e.key === 'Enter' ? saveRename() : e.key === 'Escape' && (setIsEditing(false), setText(todo.task))}
            className="w-full bg-slate-50 border-none outline-none text-sm font-bold text-slate-900 rounded-lg px-2 py-1 italic"
          />
        ) : (
          <>
            <h3 onClick={() => setIsEditing(true)} className={`text-sm font-bold tracking-tight cursor-text mb-1 ${todo.is_completed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>{todo.task}</h3>
            
            <div className="flex items-center gap-2 flex-wrap">
              {todo.category && <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">{todo.category}</span>}
              
              {/* TIMESTAMP REVISED */}
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">
                • {formatTimeAgo(todo.inserted_at)}
              </span>

              {/* Cari bagian Deadline Pill di TodoItem.tsx */}
                {todo.deadline && (
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border transition-colors ${
                    isOverdue 
                      ? 'bg-rose-50 border-rose-200 animate-pulse' // Merah & Berkedip kalau telat
                      : 'bg-amber-50 border-amber-100/50'
                  }`}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="8" 
                      height="8" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke={isOverdue ? "#e11d48" : "#d97706"} 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span className={`text-[8px] font-black uppercase tracking-tighter ${
                      isOverdue ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      {isOverdue ? 'OVERDUE: ' : 'DL: '} {formatDL(todo.deadline)}
                    </span>
                  </div>
                )}
              
              {todo.description && <button onClick={() => setShowDesc(!showDesc)} className={`text-[9px] font-bold transition-all ${showDesc ? 'text-emerald-600' : 'text-emerald-400'}`}>• {showDesc ? 'Hide Note' : 'See Note'}</button>}
            </div>

            {showDesc && todo.description && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="text-[11px] leading-relaxed text-slate-600 whitespace-pre-line font-medium">{todo.description}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 3. Action */}
      <button onClick={() => onDelete(todo.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
      </button>
    </div>
  )
}