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
      
      {/* --- SIDEBAR AREA --- */}
      <aside className={`bg-white border-r border-slate-100 transition-all duration-500 ease-in-out z-40 ${isSidebarOpen ? 'w-72' : 'w-0 -ml-1'} relative flex flex-col`}>
        <div className={`p-8 whitespace-nowrap transition-opacity duration-300 flex flex-col h-full ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* Logo Section */}
          <div className="mb-12">
            <h1 className="text-2xl font-black tracking-tighter text-slate-900">Raven<span className="text-emerald-500">.</span></h1>
            <p className="text-[9px] font-black tracking-[0.3em] text-slate-300 uppercase mt-1">Management_v3</p>
          </div>

          {/* Quick Action */}
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="w-full flex items-center gap-3 bg-emerald-500 text-white px-4 py-3.5 rounded-2xl font-bold text-[11px] tracking-widest uppercase hover:bg-slate-900 transition-all shadow-lg shadow-emerald-500/20 mb-10 group"
          >
            <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            Add New Task
          </button>

          {/* Navigation Groups */}
          <nav className="space-y-10 overflow-y-auto scrollbar-hide">
            
            {/* Group 1: Timeframes */}
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] ml-4 mb-3">Timeframe</p>
              {[
                { id: 'Semua', label: 'Inbox', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
                { id: 'Today', label: 'Today', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { id: 'Upcoming', label: 'Upcoming', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                    filter === item.id ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Group 2: Categories */}
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] ml-4 mb-3">Workspaces</p>
              {['Pribadi', 'ITERA', 'Project'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                    filter === cat ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${filter === cat ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                  {cat}
                </button>
              ))}
            </div>
          </nav>

          {/* Bottom Sidebar */}
          <div className="mt-auto pt-8 border-t border-slate-50">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-[10px] font-black tracking-widest text-slate-300 hover:text-rose-500 transition-all uppercase px-4 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout_Session
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <section className="flex-1 h-screen overflow-y-auto relative py-12 px-4 md:px-12 scroll-smooth">
        <div className="w-full max-w-[850px] mx-auto">
          
          {/* Top Bar Header */}
          <div className="flex justify-between items-center mb-12 px-2">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-500 transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-1 leading-none">Status_Online</p>
                <h2 className="text-3xl font-black tracking-tighter text-slate-900">{getGreeting()}, {userName}</h2>
              </div>
            </div>
            
            <div className="hidden md:block text-right bg-white px-5 py-3 rounded-[24px] border border-slate-50 shadow-sm">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300 mb-1">Local_Time</p>
              <p className="text-xl font-black tracking-tighter text-slate-900 tabular-nums">
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
              <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-all hover:translate-y-[-4px]">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300 mb-2">{stat.label}</p>
                <p className={`text-3xl font-black tracking-tighter ${stat.color || 'text-slate-900'}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* List Header & Purge */}
          <div className="flex items-center justify-between mb-8 px-6">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">
              Active_Focus <span className="text-emerald-500">/</span> {filter}
            </h3>
            {stats.done > 0 && (
               <button onClick={handlePurge} className="text-[9px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-[0.2em] transition-all bg-rose-50 px-5 py-2.5 rounded-xl border border-rose-100 shadow-sm active:scale-95">
                [ Purge_Complete ]
              </button>
            )}
          </div>

          {/* Todo List Content */}
          <div className="space-y-4 px-2 pb-32">
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
                <div className="relative z-10 text-center px-8">
                  <p className="text-slate-300 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Protocol_Idle</p>
                  <h3 className="text-slate-900 font-black text-xl tracking-tighter italic leading-snug">"{activeQuote}"</h3>
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

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center z-30 md:hidden transition-transform active:scale-90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </main>
  );
}