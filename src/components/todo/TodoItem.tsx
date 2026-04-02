interface TodoItemProps {
  todo: any;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => (
  <div className="group relative bg-[#0a0a0a] border border-white/5 p-4 rounded-xl hover:border-green-500/30 transition-all duration-500">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Checkbox Lingkaran Minimalis */}
        <button 
          onClick={() => onToggle(todo.id, todo.is_completed)}
          className={`w-5 h-5 rounded-full border ${todo.is_completed ? 'bg-green-500 border-green-500' : 'border-white/20'} transition-all`}
        />
        
        <div className="flex flex-col">
          <span className={`text-sm tracking-tight ${todo.is_completed ? 'text-white/20 line-through' : 'text-white/90'}`}>
            {todo.task}
          </span>
          <div className="flex items-center gap-2 mt-1">
            {/* Dot Priority */}
            <span className={`w-1.5 h-1.5 rounded-full ${todo.priority === 'High' ? 'bg-red-500' : todo.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-mono">
              {todo.category}
            </span>
          </div>
        </div>
      </div>
      
      {/* Tombol Delete yang hanya muncul saat Hover */}
      <button 
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-500 transition-all text-[10px] font-mono"
      >
        DEL
      </button>
    </div>
  </div>
)