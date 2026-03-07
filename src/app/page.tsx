'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

// Komponen Animasi Background Biner
const BinaryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateSize()
    const biner = '01'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []
    for (let i = 0; i < columns; i++) drops[i] = 1
    const draw = () => {
      ctx.fillStyle = 'rgba(10, 15, 20, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#00ff41'
      ctx.font = fontSize + 'px monospace'
      for (let i = 0; i < drops.length; i++) {
        const text = biner.charAt(Math.floor(Math.random() * biner.length))
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }
    const interval = setInterval(draw, 50)
    window.addEventListener('resize', updateSize)
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', updateSize)
    }
  }, [])
  return <canvas ref={canvasRef} className="fixed inset-0 opacity-15 pointer-events-none z-0" />
}

export default function TodoPage() {
  const [todos, setTodos] = useState<any[]>([])
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('Pribadi') 
  const [filter, setFilter] = useState('Semua') // State untuk Filter
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const categories = [
    { name: 'Pribadi', color: 'text-green-400', border: 'border-green-400/30' },
    { name: 'ITERA', color: 'text-blue-400', border: 'border-blue-400/30' },
    { name: 'Project', color: 'text-purple-400', border: 'border-purple-400/30' }
  ]

  useEffect(() => {
    checkUser()
    fetchTodos()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const fetchTodos = async () => {
    const { data } = await supabase.from('todos').select('*').order('inserted_at', { ascending: false })
    if (data) setTodos(data)
    setLoading(false)
  }

  const addTodo = async () => {
    if (!newTask.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('todos').insert([{ 
        task: newTask, 
        user_id: user?.id,
        category: category 
    }])
    if (!error) {
      setNewTask('')
      fetchTodos()
    } else {
      alert("Error: " + error.message)
    }
  }

  const toggleComplete = async (id: string, is_completed: boolean) => {
    await supabase.from('todos').update({ is_completed: !is_completed }).eq('id', id)
    fetchTodos()
  }

  const deleteTodo = async (id: string) => {
    await supabase.from('todos').delete().eq('id', id)
    fetchTodos()
  }

  // Logika Filter Tugas
  const filteredTodos = todos.filter(todo => 
    filter === 'Semua' ? true : todo.category === filter
  )

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f14] flex items-center justify-center font-mono text-green-400 tracking-widest uppercase">
      Booting_System...
    </div>
  )

  return (
    <main className="min-h-screen bg-[#0a0f14] py-6 md:py-16 px-4 md:px-6 relative overflow-x-hidden">
      <BinaryBackground />
      
      <div className="relative z-10 w-full max-w-full md:max-w-[700px] mx-auto space-y-5 md:space-y-10">
        
        {/* Header Section */}
        <div className="bg-slate-900/80 backdrop-blur-3xl p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl flex justify-between items-center transition-all">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-500/10 rounded-xl border border-green-500/20">
               <span className="text-3xl md:text-4xl filter drop-shadow-[0_0_12px_rgba(0,255,65,0.8)]">🦅</span>
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-white tracking-tighter italic uppercase">RAVEN<span className="text-green-400">LIST</span></h1>
              <p className="text-[9px] md:text-[11px] text-green-400/70 uppercase tracking-[0.5em] font-mono font-bold">Terminal_Root_v.2.8</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-red-400 border border-red-500/40 py-2 md:py-4 px-5 md:px-8 rounded-xl md:rounded-2xl hover:bg-red-500 hover:text-black transition-all"
          >
            DISCONNECT
          </button>
        </div>

        {/* Input & Category Selection */}
        <div className="bg-slate-900/90 backdrop-blur-2xl p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl space-y-6">
          <div className="relative flex items-center">
            <span className="absolute left-5 text-green-500 font-mono text-xl opacity-80 font-black animate-pulse">{'>'}</span>
            <input 
              value={newTask} 
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              className="w-full pl-12 pr-20 py-4 md:py-6 bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] focus:border-green-500/50 outline-none transition-all text-white placeholder:text-slate-500 font-mono text-sm md:text-lg"
              placeholder="Execute_New_Task..."
            />
            <button onClick={addTodo} className="absolute right-3 top-3 bottom-3 bg-green-500 text-black px-6 md:px-10 rounded-xl md:rounded-[1.5rem] font-black text-xs md:text-base hover:bg-green-400 transition-all">ADD_TASK</button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`flex-none px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${category === cat.name ? `${cat.color} ${cat.border} bg-white/10 shadow-[0_0_15px_rgba(0,0,0,0.3)]` : 'text-slate-600 border-transparent hover:text-slate-400'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-4 px-2 overflow-x-auto scrollbar-hide">
          <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest shrink-0">Filter_View:</span>
          {['Semua', 'Pribadi', 'ITERA', 'Project'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all shrink-0 ${
                filter === f 
                ? 'bg-green-500 text-black border-green-500 shadow-[0_0_10px_rgba(0,255,65,0.3)]' 
                : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo List with Animasi */}
        <div className="space-y-4 md:space-y-5">
          {filteredTodos.map((todo) => (
            <div 
              key={todo.id} 
              className="group animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-800/40 backdrop-blur-xl p-5 md:p-7 border border-white/5 rounded-[1.5rem] md:rounded-[2.2rem] hover:border-green-500/40 transition-all shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 md:gap-6 flex-1">
                  <input 
                    type="checkbox" 
                    checked={todo.is_completed} 
                    onChange={() => toggleComplete(todo.id, todo.is_completed)}
                    className="h-7 w-7 md:h-9 md:w-9 rounded-xl border-2 border-white/20 bg-black/40 appearance-none checked:bg-green-500 checked:border-green-500 cursor-pointer transition-all"
                  />
                  <div className="flex flex-col">
                    <span className={`font-mono text-sm md:text-lg transition-all ${todo.is_completed ? 'text-slate-500 line-through italic opacity-60' : 'text-slate-100 font-medium'}`}>{todo.task}</span>
                    <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${todo.category === 'ITERA' ? 'text-blue-400' : todo.category === 'Project' ? 'text-purple-400' : 'text-green-400'}`}>{todo.category || 'Pribadi'}</span>
                  </div>
                </div>
                <button onClick={() => deleteTodo(todo.id)} className="px-3 py-2 text-slate-700 hover:text-red-500 transition-all font-mono text-[10px] md:text-xs uppercase">[terminate]</button>
              </div>
            </div>
          ))}
        </div>

        {/* State Kosong */}
        {filteredTodos.length === 0 && !loading && (
          <div className="text-center py-20 md:py-32 bg-slate-900/40 rounded-[2rem] md:rounded-[4rem] border border-dashed border-white/10">
            <p className="text-green-500/20 text-4xl md:text-6xl mb-4 italic font-black tracking-widest uppercase">IDLE_CMD</p>
            <p className="text-slate-600 font-mono text-[10px] md:text-sm uppercase tracking-[0.5em]">System_Awaiting_Input</p>
          </div>
        )}

        <footer className="pt-10 md:pt-20 text-center">
          <p className="text-[9px] md:text-[11px] text-slate-700 font-black uppercase tracking-[0.7em]">RavenOS // ITERA_INF_SYS // V.2.8.4</p>
        </footer>
      </div>
    </main>
  )
}