'use client'
import { useState } from 'react'

export const TodoItem = ({ todo, onToggle, onDelete, onRename }: any) => {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(todo.task)
  const [showDesc, setShowDesc] = useState(false)

  // Fungsi Save untuk Rename
  const saveRename = () => {
    setIsEditing(false)
    if (text.trim() && text !== todo.task) {
      onRename(todo.id, text)
    } else {
      setText(todo.task) // Reset jika kosong atau batal
    }
  }

  const priorityConfig: any = {
    High: 'border-r-rose-500 shadow-[0_0_15px_-5px_rgba(244,63,94,0.1)]',
    Medium: 'border-r-emerald-500',
    Low: 'border-r-slate-200'
  };

  return (
    <div className={`group bg-white px-6 py-5 rounded-[28px] border border-slate-50 border-r-[6px] flex items-start gap-5 transition-all hover:shadow-xl ${priorityConfig[todo.priority] || 'border-r-slate-100'}`}>
      {/* Checkbox */}
      <button 
        onClick={() => onToggle(todo.id, todo.is_completed)}
        className={`w-6 h-6 mt-1 rounded-xl border-2 transition-all flex items-center justify-center flex-shrink-0 ${
          todo.is_completed ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-slate-100 bg-slate-50'
        }`}
      >
        {todo.is_completed && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
      </button>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            autoFocus 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            onBlur={saveRename} 
            onKeyDown={(e) => e.key === 'Enter' ? saveRename() : e.key === 'Escape' && (setIsEditing(false), setText(todo.task))}
            className="w-full bg-slate-50 border-none outline-none text-sm font-bold text-slate-900 rounded-lg px-2 py-1 italic"
          />
        ) : (
          <>
            {/* Bagian Judul (Klik untuk Rename) */}
            <h3 
              onClick={() => setIsEditing(true)}
              className={`text-sm font-bold tracking-tight transition-all cursor-text mb-1 ${
                todo.is_completed ? 'text-slate-300 line-through' : 'text-slate-700'
              }`}
            >
              {todo.task}
            </h3>

            {/* Bagian Label & Toggle Deskripsi */}
            <div className="flex items-center gap-2">
              {todo.category && (
                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                  {todo.category}
                </span>
              )}
              
              {todo.description && (
                <button 
                  onClick={() => setShowDesc(!showDesc)}
                  className={`text-[9px] font-bold transition-colors ${showDesc ? 'text-emerald-600' : 'text-emerald-400'}`}
                >
                  • {showDesc ? 'Hide Note' : 'See Note'}
                </button>
              )}
            </div>

            {/* Expandable Description */}
            {showDesc && todo.description && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="text-[11px] leading-relaxed text-slate-600 whitespace-pre-line font-medium">
                  {todo.description}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Button */}
      <button 
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
      </button>
    </div>
  )
}