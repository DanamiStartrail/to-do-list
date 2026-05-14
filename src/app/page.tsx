'use client'
import { useState } from 'react'
import { useTodoLogic } from '@/hooks/useTodoLogic'
import { TodoForm } from '@/components/todo/TodoForm'
import { TodoItem } from '@/components/todo/TodoItem'

export default function Home() {
  const {
    filter, setFilter, loading, activeQuote, userName, filteredTodos, stats, 
    getCategoryProgress, handleAdd, handleToggle, handleDelete, handleLogout,
    isModalOpen, setIsModalOpen, isSidebarOpen, setIsSidebarOpen, pomodoroTime, isPomodoroRunning, pomodoroMode, 
    togglePomodoro, setPomodoroTime, setPomodoroMode, formatPomoTime, archiveWeeklyTask, handleUpdate
  } = useTodoLogic();

  const [editingTodo, setEditingTodo] = useState<any>(null);

  return (
    <main className="min-h-screen bg-stone-50 flex relative font-sans text-stone-800">
      
      {/* --- SIDEBAR MINIMALIS --- */}
      <aside className={`
          bg-stone-100/80 border-r border-stone-200 transition-all duration-300 z-50 flex flex-col
          fixed inset-y-0 left-0 
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full border-r-0'}
          md:relative md:translate-x-0 
          ${isSidebarOpen ? 'md:w-64' : 'md:w-0 border-r-0'}
        `}>
        <div className={`px-5 py-8 flex flex-col h-full overflow-hidden ${isSidebarOpen ? 'opacity-100 w-64' : 'opacity-0 md:opacity-0 w-0'}`}>          
          
          {/* Profil User & Tombol Close */}
          <div className="mb-8 flex items-center justify-between">
             <div className="flex items-center gap-2.5 cursor-pointer hover:bg-stone-200/50 p-1.5 -ml-1.5 rounded-md transition-colors">
                <div className="w-7 h-7 rounded-full bg-stone-200 overflow-hidden flex-shrink-0 border border-stone-300">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-semibold text-stone-800">{userName}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-400">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
             </div>
             
             <div className="flex items-center gap-1">
               <button className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-200/50 rounded-md transition-colors hidden md:block" title="Notifications">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
               </button>
               <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-200/50 rounded-md transition-colors" title="Close Sidebar">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>
             </div>
          </div>

          {/* Tombol Add Task Datar */}
          <button onClick={() => { setEditingTodo(null); setIsModalOpen(true); }} className="w-full flex items-center justify-center gap-2 bg-stone-800 text-white px-4 py-2 rounded-md font-medium text-xs hover:bg-stone-900 transition-colors mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Task
          </button>

          <nav className="space-y-8 overflow-y-auto scrollbar-hide flex-1 pr-2">
            
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">Timeframe</p>
              {[
                { id: 'Semua', label: 'Inbox' },
                { id: 'Today', label: 'Today' },
                { id: 'Upcoming', label: 'Upcoming' },
              ].map((item) => (
                <button key={item.id} onClick={() => setFilter(item.id)} className={`w-full flex items-center px-3 py-1.5 rounded text-sm transition-colors ${filter === item.id ? 'bg-white shadow-sm border border-stone-200 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-200/50'}`}>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">Projects</p>
              {['Pribadi', 'ITERA', 'Project'].map((cat) => {
                const prog = getCategoryProgress(cat);
                const isActive = filter === cat;
                return (
                  <button key={cat} onClick={() => setFilter(cat)} className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-sm transition-colors ${isActive ? 'bg-white shadow-sm border border-stone-200 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-200/50'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400 font-mono text-xs">#</span> {cat}
                    </div>
                    {prog > 0 && <span className={`text-[10px] ${isActive ? 'text-stone-500' : 'text-stone-400'}`}>{prog}%</span>}
                  </button>
                );
              })}
            </div>

            {/* Pomodoro Flat Panel */}
            <div className="border-t border-stone-200 pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Focus Timer</p>
                <div className={`w-1.5 h-1.5 rounded-full ${isPomodoroRunning ? 'bg-rose-500 animate-pulse' : 'bg-stone-300'}`} />
              </div>
              <div className="flex items-center justify-between bg-white border border-stone-200 rounded-md p-3">
                <h4 className="text-xl font-mono text-stone-800 tracking-tight">
                  {formatPomoTime(pomodoroTime)}
                </h4>
                <div className="flex gap-1">
                  <button onClick={togglePomodoro} className="p-1.5 rounded hover:bg-stone-100 text-stone-600 transition-colors">
                    {isPomodoroRunning ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>}
                  </button>
                  {!isPomodoroRunning && (
                    <button onClick={() => setPomodoroTime(pomodoroMode === 'Work' ? 25 * 60 : 5 * 60)} className="p-1.5 rounded hover:bg-stone-100 text-stone-400 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Flat */}
            <div className="border-t border-stone-200 pt-6">
              <div className="flex items-end justify-between mb-2">
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Completion</p>
                <span className="text-[10px] font-medium text-stone-500">{stats.done}/{stats.pending + stats.done}</span>
              </div>
              <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-stone-800 transition-all duration-700" style={{ width: `${(stats.done / (stats.pending + stats.done || 1)) * 100}%` }} />
              </div>
            </div>

            {/* Archive Flat */}
            <div className="border-t border-stone-200 pt-6">
               <div className="flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">Maintenance</p>
                    <p className="text-xs text-stone-600">{stats.done} Tasks Ready</p>
                 </div>
                 <button onClick={archiveWeeklyTask} disabled={stats.done === 0} className={`p-2 rounded transition-colors ${stats.done > 0 ? 'bg-stone-800 text-white hover:bg-stone-900' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                 </button>
               </div>
            </div>

          </nav>

          <button onClick={handleLogout} className="mt-8 flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-stone-800 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>

      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-stone-900/10 z-40 md:hidden" />}

      {/* --- CONTENT UTAMA --- */}
      <section className="flex-1 h-screen overflow-y-auto relative">
        
        {/* Tombol Open Sidebar (Absolute Top Left) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="absolute top-6 left-6 p-1.5 rounded text-stone-500 hover:bg-stone-200 transition-colors z-30" 
            title="Open Sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        )}

        <div className="w-full max-w-[760px] mx-auto py-10 px-6 md:px-16 pt-20 sm:pt-16">

          <div className="mb-6 flex justify-between items-center border-b border-stone-200 pb-2">
            <h3 className="text-2xl font-semibold text-stone-900 capitalize">{filter === 'Semua' ? 'Inbox' : filter}</h3>
          </div>

          {/* Todo List Mapping */}
          <div className="pb-24">
            {loading ? <p className="text-sm text-stone-400">Loading tasks...</p> : filteredTodos.length === 0 ? (
              <div className="py-16 text-center border-stone-100">
                <p className="text-sm text-stone-500 italic">"{activeQuote}"</p>
              </div>
            ) : (
              <div className="border-stone-200">
                {filteredTodos.map(todo => (
                  <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                    onToggle={handleToggle} 
                    onDelete={handleDelete} 
                    onEdit={(t: any) => { setEditingTodo(t); setIsModalOpen(true); }} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <TodoForm 
        isOpen={isModalOpen || !!editingTodo} 
        onClose={() => { setIsModalOpen(false); setEditingTodo(null); }} 
        onAdd={(task: string, cat: string, prio: string, daily: boolean, dl: string, days: string[], desc: string, start: string) => {
          if (editingTodo) handleUpdate(editingTodo.id, task, cat, prio, daily, dl, days, desc, start);
          else handleAdd(task, cat, prio, daily, dl, days, desc, start);
          setEditingTodo(null);
          setIsModalOpen(false);
        }}
        initialData={editingTodo}
      />
      
      <button onClick={() => { setEditingTodo(null); setIsModalOpen(true); }} className="fixed bottom-6 right-6 w-12 h-12 bg-stone-800 text-white rounded-full shadow-lg flex items-center justify-center z-30 md:hidden">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </main>
  );
}