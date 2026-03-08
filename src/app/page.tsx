'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { BinaryBackground } from '@/components/todo/BinaryBackground'
import { TodoItem } from '@/components/todo/TodoItem'
import { TodoForm } from '@/components/todo/TodoForm'

interface Todo { id: string; task: string; is_completed: boolean; category: string; priority: string;inserted_at: string; }

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => { fetchTodos() }, [])

  const fetchTodos = async () => {
    const { data } = await supabase.from('todos').select('*').order('inserted_at', { ascending: false })
    if (data) setTodos(data as Todo[])
    setLoading(false)
  }

  const handleAdd = async (task: string, category: string, priority: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('todos').insert([{ task, user_id: user?.id, category, priority }])
    fetchTodos()
  }

  const handleToggle = async (id: string, is_completed: boolean) => {
    await supabase.from('todos').update({ is_completed: !is_completed }).eq('id', id)
    fetchTodos()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('todos').delete().eq('id', id)
    fetchTodos()
  }

// Tambahkan logika urutan prioritas
const priorityOrder: Record<string, number> = { 'High': 1, 'Medium': 2, 'Low': 3 };

const filteredTodos = todos
  .filter(t => filter === 'Semua' ? true : t.category === filter)
  .sort((a, b) => {
    // 1. Urutkan berdasarkan prioritas (High > Medium > Low)
    const orderA = priorityOrder[a.priority] || 2;
    const orderB = priorityOrder[b.priority] || 2;
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // 2. Jika prioritas sama, urutkan berdasarkan waktu (terbaru di atas)
    return new Date(b.inserted_at).getTime() - new Date(a.inserted_at).getTime();
  });
  if (loading) return <div className="min-h-screen bg-[#0a0f14] flex items-center justify-center text-green-400 font-mono">BOOTING...</div>

  return (
    <main className="min-h-screen bg-[#0a0f14] py-16 px-4 relative overflow-x-hidden">
      <BinaryBackground />
      <div className="relative z-10 w-full max-w-[700px] mx-auto space-y-10">
        <TodoForm onAdd={handleAdd} onLogout={() => { supabase.auth.signOut(); router.push('/login'); }} />
        
        {/* Filter View Mini */}
        <div className="flex items-center gap-4 px-2">
          {['Semua', 'Pribadi', 'ITERA', 'Project'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase border ${filter === f ? 'bg-green-500 text-black' : 'text-slate-500 border-white/10'}`}>{f}</button>
          ))}
        </div>

        <div className="space-y-5">
          {filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />)}
        </div>
      </div>
    </main>
  )
}