'use client'

interface TodoItemProps {
  todo: any;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => (
  <div className="group bg-white border border-slate-100 p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-500 flex items-center justify-between">
    <div className="flex items-center gap-5">
      {/* Checkbox Lingkaran Elegan */}
      <button 
        onClick={() => onToggle(todo.id, todo.is_completed)}
        className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
          todo.is_completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 hover:border-emerald-400'
        }`}
      >
        {todo.is_completed && <span className="text-white text-[10px]">✓</span>}
      </button>
      
      <div className="flex flex-col">
        <span className={`text-base font-medium tracking-tight transition-all ${
          todo.is_completed ? 'text-slate-300 line-through' : 'text-slate-800'
        }`}>
          {todo.task}
        </span>
        <div className="flex items-center gap-3 mt-1">
          {/* Tag Kategori Minimalis */}
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
            {todo.category}
          </span>
          {/* Indikator Prioritas Kecil */}
          <span className={`w-1.5 h-1.5 rounded-full ${
            todo.priority === 'High' ? 'bg-rose-500' : todo.priority === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400'
          }`} />
        </div>
      </div>
    </div>
    
    <button 
      onClick={() => onDelete(todo.id)}
      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all text-[10px] font-bold tracking-tighter"
    >
      DELETE
    </button>
  </div>
);