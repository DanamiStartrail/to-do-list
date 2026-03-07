'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function TodoPage() {
  const [todos, setTodos] = useState<any[]>([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchTodos()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login') // Tendang ke login kalau belum masuk
    }
  }

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('inserted_at', { ascending: false })
    
    if (data) setTodos(data)
    setLoading(false)
  }

  const addTodo = async () => {
    if (!newTask.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('todos')
      .insert([{ task: newTask, user_id: user?.id }])
    
    if (!error) {
      setNewTask('')
      fetchTodos()
    }
  }

  const toggleComplete = async (id: string, is_completed: boolean) => {
    await supabase.from('todos').update({ is_completed: !is_completed }).eq('id', id)
    fetchTodos()
  }

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (!error) fetchTodos()
  }

  if (loading) return <div className="text-center mt-10">Memuat data...</div>

  return (
    <main className="max-w-md mx-auto p-6 bg-white min-h-screen shadow-lg">
      <h1 className="text-3xl font-extrabold my-6 text-center text-blue-600">My To-Do</h1>
      
      <div className="flex gap-2 mb-8">
        <input 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="Tulis tugas baru..."
        />
        <button onClick={addTodo} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">+</button>
      </div>

      <ul className="space-y-4">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between p-4 bg-gray-50 border rounded-xl hover:shadow-md transition">
            <div className="flex items-center gap-3 overflow-hidden">
              <input 
                type="checkbox" 
                checked={todo.is_completed} 
                onChange={() => toggleComplete(todo.id, todo.is_completed)}
                className="w-5 h-5 cursor-pointer accent-blue-600"
              />
              <span className={`truncate text-black ${todo.is_completed ? 'line-through text-gray-400' : ''}`}>
                {todo.task}
              </span>
            </div>
            <button 
              onClick={() => deleteTodo(todo.id)}
              className="text-red-400 hover:text-red-600 px-2 py-1 text-sm font-medium"
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
      
      {todos.length === 0 && (
        <p className="text-center text-gray-400 mt-10">Belum ada tugas. Semangat!</p>
      )}
    </main>
  )
}