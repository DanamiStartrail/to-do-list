'use client'

interface TodoItemProps {
  todo: any;
  onToggle: (id: string, is_completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  // Logika format waktu tetap menggunakan versi kamu yang lebih aman
  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return '---';
    const now = new Date();
    const formattedDate = dateString.includes(' ') ? dateString.replace(' ', 'T') : dateString;
    const past = new Date(formattedDate);
    if (isNaN(past.getTime())) return 'Inv. Date';

    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)}h ago`;
    return past.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  // Logika pembantu untuk status Deadline
  const getDeadlineStatus = (deadlineStr: string | null) => {
    if (!deadlineStr) return null;
    const target = new Date(deadlineStr);
    const now = new Date();
    
    const diffInMs = target.getTime() - now.getTime();
    const diffInHrs = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHrs / 24);

    // Jika sudah lewat (Overdue)
    if (diffInMs < 0) return { label: 'Overdue', color: 'text-rose-500 bg-rose-50 border-rose-100' };

    // Jika kurang dari 24 jam (Tampilkan Jam)
    if (diffInHrs < 24) {
      if (diffInHrs < 1) {
        const mins = Math.floor(diffInMs / 60000);
        return { label: `${mins}m left`, color: 'text-rose-600 bg-rose-50 border-rose-200 animate-pulse' };
      }
      return { label: `${diffInHrs}h left`, color: 'text-amber-500 bg-amber-50 border-amber-100' };
    }

    // Jika lebih dari 1 hari
    return { label: `${diffInDays}d left`, color: 'text-slate-400 bg-slate-50 border-slate-100' };
  };

  const deadline = getDeadlineStatus(todo.deadline);

  return (
    <div className={`group flex items-center gap-4 p-6 bg-white rounded-[28px] border border-slate-100 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] ${todo.is_completed ? 'opacity-60 bg-slate-50/50' : ''}`}>
      {/* Checkbox */}
      <button 
        onClick={() => onToggle(todo.id, todo.is_completed)}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
          todo.is_completed 
          ? 'bg-emerald-500 border-emerald-500 text-white' 
          : 'border-slate-200 hover:border-emerald-400'
        }`}
      >
        {todo.is_completed && (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        )}
      </button>

      {/* Task Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className={`text-sm font-bold tracking-tight truncate ${todo.is_completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
            {todo.task}
          </h3>
          
          {/* Label Daily */}
          {todo.is_daily && (
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-tighter rounded-md border border-emerald-100">
              Daily
            </span>
          )}

          {/* Label Deadline (Updated: Akan menampilkan "...h left" jika < 24 jam) */}
          {deadline && !todo.is_completed && (
            <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter rounded-md border ${deadline.color}`}>
              {deadline.label}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{todo.category}</p>
          
          {/* Tampilkan Jam Deadline Spesifik (TAMBAHKAN DI SINI) */}
          {todo.deadline && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-200"></span>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                Due: {new Date(todo.deadline).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
            </>
          )}

          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {formatRelativeTime(todo.inserted_at)}
          </p>
          
          {/* Indikator Prioritas */}
          {todo.priority === 'High' && (
            <>
              <span className="w-1 h-1 rounded-full bg-rose-200"></span>
              <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Urgent</p>
            </>
          )}
        </div>
      </div>

      {/* Action: Delete */}
      <button 
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
      </button>
    </div>
  );
};