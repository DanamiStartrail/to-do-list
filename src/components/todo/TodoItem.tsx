interface TodoItemProps {
  todo: any;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => (
  <div className="animate-fade-in-up bg-slate-800/40 backdrop-blur-xl p-5 md:p-7 border border-white/5 rounded-[1.5rem] md:rounded-[2.2rem] hover:border-green-500/40 transition-all shadow-xl">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 md:gap-6 flex-1">
        <input 
          type="checkbox" 
          checked={todo.is_completed} 
          onChange={() => onToggle(todo.id, todo.is_completed)} 
          className="h-7 w-7 rounded-xl border-2 border-white/20 bg-black/40 appearance-none checked:bg-green-500 checked:border-green-500 cursor-pointer transition-all" 
        />
        <div className="flex flex-col">
          <span className={`font-mono text-sm md:text-lg ${todo.is_completed ? 'text-slate-500 line-through opacity-60' : 'text-slate-100'}`}>
            {todo.task}
          </span>
          <div className="flex gap-3 mt-1">
            <span className={`text-[8px] font-bold uppercase tracking-[0.2em] ${todo.category === 'ITERA' ? 'text-blue-400' : todo.category === 'Project' ? 'text-purple-400' : 'text-green-400'}`}>
              {todo.category || 'Pribadi'}
            </span>
            <span className={`text-[8px] font-bold uppercase tracking-[0.2em] px-2 border rounded ${
              todo.priority === 'High' ? 'text-red-400 border-red-400/30' : 
              todo.priority === 'Medium' ? 'text-yellow-400 border-yellow-400/30' : 
              'text-green-400 border-green-400/30'
            }`}>
              {todo.priority || 'Medium'}
            </span>
          </div>
        </div>
      </div>
      <button onClick={() => onDelete(todo.id)} className="text-slate-600 hover:text-red-500 font-mono text-[10px] uppercase">
        [terminate]
      </button>
    </div>
  </div>
)