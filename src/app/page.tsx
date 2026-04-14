'use client'
import { useTodoLogic } from '@/hooks/useTodoLogic'
import { TodoForm } from '@/components/todo/TodoForm'
import { TodoItem } from '@/components/todo/TodoItem'
import { useState } from 'react'

export default function Home() {
  const {
    filter, setFilter, loading, showInstallBtn, currentTime, 
    activeQuote, userName, filteredTodos, stats, getCategoryProgress,
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
      {/* Background Neon Blur - Diperhalus */}
      <div className="fixed top-[-5%] right-[-5%] w-[400px] h-[400px] bg-emerald-200/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* --- SIDEBAR AREA (COMPACT) --- */}
      <aside className={`bg-white border-r border-slate-100 transition-all duration-500 ease-in-out z-40 ${isSidebarOpen ? 'w-64' : 'w-0 -ml-1'} relative flex flex-col shadow-sm`}>
        <div className={`px-3 py-6 whitespace-nowrap transition-opacity duration-300 flex flex-col h-full ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* Logo Section - Scaled Down */}
          <div className="mb-8">
            <h1 className="text-xl font-black tracking-tighter text-slate-900">Raven<span className="text-emerald-500">.</span></h1>
            <p className="text-[8px] font-black tracking-[0.3em] text-slate-300 uppercase mt-0.5">Management_v3</p>
          </div>

          {/* Quick Action - Slimmer */}
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="w-full flex items-center gap-2.5 bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-slate-900 transition-all shadow-md shadow-emerald-500/10 mb-8 group"
          >
            <div className="bg-white/20 p-1 rounded-md group-hover:rotate-90 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            Add Task
          </button>

          {/* Navigation Groups - Compact Padding */}
          <nav className="space-y-8 overflow-y-auto scrollbar-hide">
            <div className="space-y-0.5">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] ml-3 mb-2">Timeframe</p>
              {[
                { id: 'Semua', label: 'Inbox', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
                { id: 'Today', label: 'Today', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { id: 'Upcoming', label: 'Upcoming', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                    filter === item.id ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              ))}
            </div>

              {/* Group 2: Categories (Clean & Silent Version) */}
              <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3 mb-3">Workspaces</p>
                {['Pribadi', 'ITERA', 'Project'].map((cat) => {
                  const progress = getCategoryProgress(cat);
                  const radius = 7;
                  const circumference = 2 * Math.PI * radius;
                  const offset = circumference - (progress / 100) * circumference;
                  const isActive = filter === cat;

                  return (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                        isActive 
                          ? 'bg-slate-900 text-white shadow-md' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-4 h-4 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90 overflow-visible">
                            {/* Track Ring - Tanpa Animasi */}
                            <circle
                              cx="8"
                              cy="8"
                              r={radius}
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="transparent"
                              className={`${isActive ? 'text-slate-700' : 'text-slate-100'} transition-none`}
                            />
                            {/* Progress Indicator - Animasi hanya pada stroke-dashoffset */}
                            <circle
                              cx="8"
                              cy="8"
                              r={radius}
                              stroke="#10b981"
                              strokeWidth="2"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              strokeLinecap="round"
                              fill="transparent"
                              className="transition-[stroke-dashoffset] duration-500 ease-in-out"
                            />
                          </svg>
                        </div>
                        <span className="transition-none">{cat}</span>
                      </div>
                      
                      {progress > 0 && (
                        <span className={`text-[7px] font-black ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {progress}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Focus Summary Card - Tambahkan di bawah Navigasi Workspaces */}
              <div className="mt-auto mb-6 px-0">
                <div className="bg-slate-50 rounded-[24px] p-4 border border-slate-100/50">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Overall_Progress</p>
                  
                  <div className="flex items-end justify-between mb-2">
                    <h4 className="text-xl font-black text-slate-900 tracking-tighter">
                      {Math.round((stats.done / (stats.pending + stats.done || 1)) * 100)}%
                    </h4>
                    <p className="text-[9px] font-bold text-slate-400 mb-1">{stats.done}/{stats.pending + stats.done} Done</p>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                      style={{ width: `${(stats.done / (stats.pending + stats.done || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-50">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-[9px] font-black tracking-widest text-slate-300 hover:text-rose-500 transition-all uppercase px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA (DENSER) --- */}
      <section className="flex-1 h-screen overflow-y-auto relative py-8 px-4 md:px-10 scroll-smooth">
        <div className="w-full max-w-[800px] mx-auto">
          
          {/* Top Bar - More Compact */}
          <div className="flex justify-between items-center mb-8 px-1">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-emerald-500 transition-all shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-0.5">Status Online</p>
                <h2 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 leading-tight">{getGreeting()}, {userName}</h2>
              </div>
            </div>
            
            <div className="hidden sm:block text-right bg-white px-4 py-2 rounded-2xl border border-slate-50 shadow-sm">
              <p className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-300">Local Time</p>
              <p className="text-lg font-black tracking-tighter text-slate-900 tabular-nums">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
            </div>
          </div>

          {/* Stats Grid - Tighter padding & font */}
          {/* Stats Area Baru - Lebih Compact & Modern */}
          <div className="flex gap-3 mb-8 px-2 overflow-x-auto scrollbar-hide py-1">
            {[
              { label: 'Pending', value: stats.pending, icon: 'M12 8v4l3 3' },
              { label: 'Urgent', value: stats.urgent, color: 'text-rose-600 bg-rose-50 border-rose-100' },
              { label: 'ITERA', value: stats.itera, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
              { label: 'Done', value: stats.done, color: 'text-slate-500 bg-slate-50 border-slate-100' }
            ].map((stat, i) => (
              <div key={i} className={`flex items-center gap-2.5 px-4 py-2 rounded-full border whitespace-nowrap shadow-sm ${stat.color || 'bg-white border-slate-100 text-slate-900'}`}>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{stat.label}</span>
                <span className="text-sm font-black tracking-tighter">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* List Header - Compact */}
          <div className="flex items-center justify-between mb-6 px-4">
            <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
              Focus <span className="text-emerald-500">/</span> <span className="text-slate-900">{filter}</span>
            </h3>
            {stats.done > 0 && (
               <button onClick={handlePurge} className="text-[8px] font-black text-rose-500 hover:bg-rose-50 uppercase tracking-[0.1em] transition-all px-3 py-1.5 rounded-lg border border-rose-100 shadow-sm">
                Purge Done
              </button>
            )}
          </div>

          {/* Todo List Area - Pad out at bottom for mobile nav */}
          <div className="space-y-3 px-1 pb-24">
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
              <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-100 shadow-sm">
                <p className="text-slate-300 text-[8px] font-black tracking-[0.3em] uppercase mb-3">Idle_State</p>
                <h3 className="text-slate-900 font-black text-sm tracking-tight italic px-8 opacity-80 leading-relaxed">"{activeQuote}"</h3>
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

      {/* Floating Action Button (FAB) - Simpler & Smaller */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-slate-900 text-white rounded-xl shadow-xl flex items-center justify-center z-30 md:hidden transition-transform active:scale-90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </main>
  );
}