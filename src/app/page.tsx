'use client'
import { useTodoLogic } from '@/hooks/useTodoLogic'
import { TodoForm } from '@/components/todo/TodoForm'
import { TodoItem } from '@/components/todo/TodoItem'
import { useState } from 'react'

export default function Home() {
  const {
    filter, setFilter, loading, showInstallBtn, currentTime, 
    activeQuote, userName, filteredTodos, stats,
    handleInstallClick, handleAdd, handleToggle, handleDelete, handlePurge, handleLogout,
    handleUpdateDeadline
  } = useTodoLogic();

  // State baru untuk kontrol UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex relative font-sans overflow-hidden">
      {/* Background Neon Blur */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* --- SIDEBAR AREA (KONSEP) --- */}
      <aside className={`bg-white border-r border-slate-100 transition-all duration-500 ease-in-out z-40 ${isSidebarOpen ? 'w-72' : 'w-0 -ml-1'} relative flex flex-col`}>
        <div className={`p-8 whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mb-12">
            <h1 className="text-2xl font-black tracking-tighter text-slate-900">Raven<span className="text-emerald-500">.</span></h1>
            <p className="text-[9px] font-black tracking-[0.3em] text-slate-300 uppercase mt-1">Management_v3</p>
          </div>

          <nav className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-2 mb-4">Navigation</p>
              <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center gap-3 bg-emerald-500 text-white px-4 py-3 rounded-2xl font-bold text-[11px] tracking-widest uppercase hover:bg-slate-900 transition-all shadow-lg shadow-emerald-500/20 mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add New Task
              </button>

              {['Semua', 'Pribadi', 'ITERA', 'Project'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all ${
                    filter === f ? 'bg-slate-50 text-emerald-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${filter === f ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  {f}
                </button>
              ))}
            </div>
          </nav>

          <div className="mt-auto pt-12">
            <button onClick={handleLogout} className="text-[10px] font-black tracking-widest text-slate-300 hover:text-rose-500 transition-all uppercase px-4">
              Logout_Session
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <section className="flex-1 h-screen overflow-y-auto relative py-16 px-4 md:px-12">
        <div className="w-full max-w-[850px] mx-auto">
          
          {/* Top Bar (Greeting & Toggle) */}
          <div className="flex justify-between items-start mb-12 px-2">
            <div className="flex items-start gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 mt-1 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-1">Status_Online</p>
                <h2 className="text-4xl font-black tracking-tighter text-slate-900">{getGreeting()}, {userName}</h2>
              </div>
            </div>
            
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-1">Local_Time</p>
              <p className="text-2xl font-black tracking-tighter text-slate-900">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
            </div>
          </div>

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

          {/* Purge Button (Floating Style) */}
          {stats.done > 0 && (
            <div className="flex justify-end mb-6 px-2">
               <button onClick={handlePurge} className="text-[9px] font-black text-rose-400 hover:text-rose-600 uppercase tracking-[0.2em] transition-all bg-rose-50/50 px-6 py-3 rounded-2xl border border-rose-100/50 shadow-sm">
                Clean Up Completed
              </button>
            </div>
          )}

          {/* Todo List Area */}
          <div className="space-y-4 px-2 pb-20">
            {filteredTodos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggle={handleToggle} 
                onDelete={handleDelete} 
                onUpdateDeadline={handleUpdateDeadline}
              />
            ))}

            {filteredTodos.length === 0 && !loading && (
              <div className="text-center py-28 bg-white rounded-[40px] border border-dashed border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 text-center">
                  <p className="text-slate-300 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Protocol_Idle</p>
                  <h3 className="text-slate-900 font-black text-xl tracking-tighter italic px-6">"{activeQuote}"</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- MODAL AREA --- */}
      <TodoForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAdd} 
      />

      {/* Mobile Quick Add (Optional) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center z-30 md:hidden animate-in fade-in zoom-in duration-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </main>
  )
}