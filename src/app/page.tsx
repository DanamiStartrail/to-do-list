'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { TodoForm } from '@/components/todo/TodoForm'
import { TodoItem } from '@/components/todo/TodoItem'

export default function Home() {
  const [todos, setTodos] = useState<any[]>([])
  const [filter, setFilter] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallBtn, setShowInstallBtn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const router = useRouter()

  // 1. Time & Greeting Logic
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  // 2. Proteksi Sesi & Cek User
  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        const hasSession = Object.keys(localStorage).some(key => key.startsWith('sb-'))
        if (!hasSession) router.push('/login')
      }
    } catch (error) {
      console.log("Offline Mode: Menggunakan sesi lokal")
    }
  }

  // 3. Fetch Data
  const fetchTodos = async () => {
    const saved = localStorage.getItem('raven_todos')
    if (saved) {
      setTodos(JSON.parse(saved))
      setLoading(false)
    }

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setTodos(data)
      localStorage.setItem('raven_todos', JSON.stringify(data))
    }
    setLoading(false)
  }

  // 4. Lifecycle Hooks
  useEffect(() => {
    checkUser()
    fetchTodos()

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallBtn(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowInstallBtn(false)
    setDeferredPrompt(null)
  }

  // 5. Handlers
  const handleAdd = async (task: string, category: string, priority: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('todos')
      .insert([{ task, category, priority, user_id: user.id }])
      .select()

    if (!error && data) {
      const updated = [data[0], ...todos]
      setTodos(updated)
      localStorage.setItem('raven_todos', JSON.stringify(updated))
    }
  }

  const handleToggle = async (id: string, is_completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ is_completed: !is_completed })
      .eq('id', id)

    if (!error) {
      const updated = todos.map(t => t.id === id ? { ...t, is_completed: !is_completed } : t)
      setTodos(updated)
      localStorage.setItem('raven_todos', JSON.stringify(updated))
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (!error) {
      const updated = todos.filter(t => t.id !== id)
      setTodos(updated)
      localStorage.setItem('raven_todos', JSON.stringify(updated))
    }
  }

  // 6. Filter & Stats Logic
  const filteredTodos = todos.filter(t => filter === 'Semua' ? true : t.category === filter)

  const stats = {
    pending: todos.filter(t => !t.is_completed).length,
    urgent: todos.filter(t => t.priority === 'High' && !t.is_completed).length,
    itera: todos.filter(t => t.category === 'ITERA' && !t.is_completed).length,
    done: todos.filter(t => t.is_completed).length
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-16 px-4 relative font-sans overflow-x-hidden">
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-[750px] mx-auto">
        
        {/* Dynamic Header Section */}
        <div className="flex justify-between items-end mb-12 px-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-1">Status_Online</p>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900">{getGreeting()}, Danta</h2>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-1">Local_Time</p>
            <p className="text-2xl font-black tracking-tighter text-slate-900">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </p>
          </div>
        </div>

        {/* Form Input Section */}
        <TodoForm 
          onAdd={handleAdd} 
          onLogout={() => { supabase.auth.signOut(); router.push('/login'); }} 
        />

        {/* PWA Install Banner */}
        {showInstallBtn && (
          <div className="mb-8 px-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <button 
              onClick={handleInstallClick}
              className="w-full bg-emerald-500/10 border border-emerald-500/20 py-5 rounded-[28px] flex items-center justify-center gap-4 group transition-all hover:bg-emerald-500/20"
            >
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

        {/* Smart Statistics Grid */}
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

        {/* Filter View Controller */}
        <div className="flex items-center gap-8 px-6 mb-10 overflow-x-auto scrollbar-hide py-2">
          <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em] shrink-0">View_Control</span>
          {['Semua', 'Pribadi', 'ITERA', 'Project'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all pb-1 border-b-2 ${
                filter === f ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-300 hover:text-slate-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Render Todo List */}
        <div className="space-y-4 px-2">
          {filteredTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onToggle={handleToggle} 
              onDelete={handleDelete} 
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredTodos.length === 0 && !loading && (
          <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <p className="text-slate-300 text-sm font-medium tracking-[0.2em] uppercase">No active protocols found</p>
          </div>
        )}
      </div>
    </main>
  )
}