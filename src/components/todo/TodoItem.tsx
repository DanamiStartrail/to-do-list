'use client'

interface TodoItemProps {
  todo: any;
  onToggle: (id: string, is_completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
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
        <h3 className={`text-sm font-bold tracking-tight truncate ${todo.is_completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
          {todo.task}
        </h3>
        <div className="flex items-center gap-3">
          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{todo.category}</p>
          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {formatRelativeTime(todo.inserted_at)}
          </p>
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