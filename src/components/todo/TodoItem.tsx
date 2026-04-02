'use client'

interface TodoItemProps {
  todo: any;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => (
  <div className="group relative bg-[#0d0d0d] border border-white/[0.02] p-5 rounded-xl hover:border-emerald-500/10 transition-all duration-700 shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-none">
    {/* Indikator Prioritas di Samping Kiri (Garis Tipis Vertikal) */}
    <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-r ${todo.priority === 'High' ? 'bg-rose-500' : todo.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />

    <div className="flex items-center justify-between pl-4">
      <div className="flex items-center gap-6">
        {/* Checkbox Lingkaran Tipis Modern */}
        <button 
          onClick={() => onToggle(todo.id, todo.is_completed)}
          className={`w-6 h-6 rounded-full border ${todo.is_completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/10'} transition-all flex items-center justify-center`}
        >
            {todo.is_completed && <span className="text-black text-xs">✓</span>}
        </button>
        
        <div className="flex flex-col">
          <span className={`text-lg font-light tracking-tight transition-all duration-1000 ${todo.is_completed ? 'text-white/10 line-through opacity-50' : 'text-white/90'}`}>
            {todo.task}
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 mt-1 font-medium">
            {todo.category}
          </span>
        </div>
      </div>
      
      {/* Tombol Delete Minimalis */}
      <button 
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-white/10 hover:text-rose-500 transition-all text-[11px] font-medium tracking-wider pb-1"
      >
        DEL
      </button>
    </div>
  </div>
)