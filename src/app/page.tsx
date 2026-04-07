'use client'
import { useTodoLogic } from '@/hooks/useTodoLogic'
import { TodoForm } from '@/components/todo/TodoForm'
import { TodoItem } from '@/components/todo/TodoItem'

export default function Home() {
  const {
    filter, setFilter, loading, showInstallBtn, currentTime, 
    activeQuote, userName, filteredTodos, stats,
    handleInstallClick, handleAdd, handleToggle, handleDelete, handlePurge, handleLogout
  } = useTodoLogic();

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] py-16 px-4 relative font-sans overflow-x-hidden">
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-[750px] mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-12 px-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-1">Status Online</p>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900">{getGreeting()}, {userName}</h2>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-1">Local Time</p>
            <p className="text-2xl font-black tracking-tighter text-slate-900">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </p>
          </div>
        </div>

        <TodoForm onAdd={handleAdd} onLogout={handleLogout} />

        {/* Install Button */}
        {showInstallBtn && (
          <div className="mb-8 px-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <button onClick={handleInstallClick} className="w-full bg-emerald-500/10 border border-emerald-500/20 py-5 rounded-[28px] flex items-center justify-center gap-4 group transition-all hover:bg-emerald-500/20">
              <div className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700 leading-none mb-1">System_Update</p>
                <p className="text-sm font-bold text-emerald-900">Add Raven to Home Screen</p>
              </div>
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 px-2">
          {[
            { label: 'Pending', value: stats.pending },
            { label: 'Urgent', value: stats.urgent, color: 'text-rose-500' },
            { label: 'ITERA', value: stats.itera, color: 'text-emerald-600' },
            { label: 'Success', value: stats.done, color: 'text-slate-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-transform hover:scale-[1.02]">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-2">{stat.label}</p>
              <p className={`text-3xl font-black tracking-tighter ${stat.color || 'text-slate-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter & Purge */}
        <div className="flex items-center px-6 mb-10 overflow-x-auto scrollbar-hide py-2">
          <div className="flex items-center gap-8 mr-8 shrink-0">
            <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em]">View_Control</span>
            {['Semua', 'Pribadi', 'ITERA', 'Project'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all pb-1 border-b-2 ${filter === f ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-300 hover:text-slate-500'}`}>
                {f}
              </button>
            ))}
          </div>
          {stats.done > 0 && (
            <button onClick={handlePurge} className="ml-auto text-[9px] font-black text-rose-400 hover:text-rose-600 uppercase tracking-[0.2em] transition-all bg-rose-50/50 px-4 py-2 rounded-full border border-rose-100/50">
              [ Purge_Completed ]
            </button>
          )}
        </div>

        {/* Todo List */}
        <div className="space-y-4 px-2">
          {filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTodos.length === 0 && !loading && (
          <div className="text-center py-28 bg-white rounded-[40px] border border-dashed border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 text-center">
              <p className="text-slate-300 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Protocol_Idle</p>
              <h3 className="text-slate-900 font-black text-xl tracking-tighter italic">"{activeQuote}"</h3>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}