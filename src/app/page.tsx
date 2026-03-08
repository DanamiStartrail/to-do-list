'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { BinaryBackground } from '@/components/todo/BinaryBackground'
import { TodoItem } from '@/components/todo/TodoItem'
import { TodoForm } from '@/components/todo/TodoForm'

interface Todo { 
  id: string; 
  task: string; 
  is_completed: boolean; 
  category: string; 
  priority: string; 
  inserted_at: string; 
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const priorityOrder: Record<string, number> = { 'High': 1, 'Medium': 2, 'Low': 3 };

  useEffect(() => {
  checkUser();
  fetchTodos();
  requestNotificationPermission(); // Tambahkan ini
}, []);

  // Fungsi Check User yang sudah diperbaiki
  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Jika tidak ada user dan tidak ada sesi tersimpan, baru tendang ke login
      if (!user) {
        // Cek apakah ada sesi Supabase di localStorage (tanda sudah pernah login)
        const hasSession = Object.keys(localStorage).some(key => key.startsWith('sb-'))
        if (!hasSession) {
          router.push('/login')
        }
      }
    } catch (error) {
      console.log("Offline mode: Menggunakan sesi lokal")
    }
  }

  const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log("Browser ini tidak mendukung notifikasi.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log("Izin notifikasi diberikan!");
    // Nanti kita bisa kirim notifikasi percobaan di sini
    new Notification("RAVEN LIST", {
      body: "Sistem Notifikasi Aktif. Root_Access_Granted.",
      icon: "/icon-192x192.png" // Pastikan icon ini ada di folder public kamu
    });
  }
};

  const fetchTodos = async () => {
    // 1. Ambil data dari LocalStorage dulu (Offline Support)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('raven_todos')
      if (saved) {
        setTodos(JSON.parse(saved))
        setLoading(false)
      }
    }

    // 2. Ambil data segar dari Supabase
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('inserted_at', { ascending: false })

    if (data) {
      const freshData = data as Todo[]
      setTodos(freshData)
      // Simpan ke LocalStorage untuk akses offline berikutnya
      localStorage.setItem('raven_todos', JSON.stringify(freshData))
    }
    setLoading(false)
  }

  const handleAdd = async (task: string, category: string, priority: string) => {
    if (!task.trim()) return

    // --- OPTIMISTIC UPDATE START ---
    const tempId = Math.random().toString(36).substring(7)
    const newTodo: Todo = {
      id: tempId,
      task,
      category,
      priority,
      is_completed: false,
      inserted_at: new Date().toISOString(),
    }

    // Langsung update state agar instan di layar
    const updatedTodos = [newTodo, ...todos]
    setTodos(updatedTodos)
    localStorage.setItem('raven_todos', JSON.stringify(updatedTodos))
    // --- OPTIMISTIC UPDATE END ---

    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('todos').insert([{ 
      task, 
      user_id: user?.id, 
      category, 
      priority 
    }])

    if (error) {
      console.error("Sync Error:", error.message)
      // Jika error, fetch ulang untuk mengembalikan list ke kondisi asli di database
      fetchTodos()
    } else {
      // Jika berhasil, fetch diam-diam untuk sinkronisasi ID asli dari DB
      fetchTodos()
    }
    if (!error && priority === 'High') {
      // Pemicu notifikasi untuk tugas mendesak
      if (Notification.permission === 'granted') {
        new Notification("TUGAS PENTING DITAMBAHKAN", {
          body: `Tugas: ${task} telah masuk ke sistem dengan prioritas tinggi.`,
          icon: "/icon-192x192.png"
        });
      }
    }
  }

  const handleToggle = async (id: string, is_completed: boolean) => {
    // Optimistic Toggle
    const updated = todos.map(t => t.id === id ? { ...t, is_completed: !is_completed } : t)
    setTodos(updated)
    localStorage.setItem('raven_todos', JSON.stringify(updated))

    await supabase.from('todos').update({ is_completed: !is_completed }).eq('id', id)
    fetchTodos()
  }

  const handleDelete = async (id: string) => {
    // Optimistic Delete
    const updated = todos.filter(t => t.id !== id)
    setTodos(updated)
    localStorage.setItem('raven_todos', JSON.stringify(updated))

    await supabase.from('todos').delete().eq('id', id)
    fetchTodos()
  }

  // Logika Filter + Sorting (Prioritas dulu, baru Waktu)
  const filteredTodos = todos
    .filter(t => filter === 'Semua' ? true : t.category === filter)
    .sort((a, b) => {
      const orderA = priorityOrder[a.priority] || 2
      const orderB = priorityOrder[b.priority] || 2
      if (orderA !== orderB) return orderA - orderB
      return new Date(b.inserted_at).getTime() - new Date(a.inserted_at).getTime()
    })

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f14] flex items-center justify-center font-mono text-green-400">
      BOOTING_SYSTEM...
    </div>
  )
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