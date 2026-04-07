'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

const TECH_QUOTES = [
  "Done is better than perfect.",
  "Push your code, then drink your coffee.",
  "Root access granted. Ready for next task?",
  "Standardize the process, then automate.",
  "Your potential is infinite, your time is not.",
  "Fix the cause, not the symptom.",
  "Commit often, perfect later."
]

export const useTodoLogic = () => {
  const [todos, setTodos] = useState<any[]>([])
  const [filter, setFilter] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallBtn, setShowInstallBtn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeQuote, setActiveQuote] = useState("")
  const [userName, setUserName] = useState("User")
  const router = useRouter()
  const [isDark, setIsDark] = useState(false);

  const fetchTodos = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
    
    if (!error && data) {
      setTodos(data)
      localStorage.setItem('raven_todos', JSON.stringify(data))
    }
  }, [])

  useEffect(() => {
    const initApp = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserName("Danta")
      await fetchTodos(user.id)
      setLoading(false)
    }
    initApp()

    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallBtn(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      clearInterval(timer)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [router, fetchTodos])

  useEffect(() => {
    if (todos.length === 0) {
      setActiveQuote(TECH_QUOTES[Math.floor(Math.random() * TECH_QUOTES.length)])
    }
  }, [todos.length])

  useEffect(() => {
    // Cek tema saat pertama kali load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

// Jangan lupa masukkan isDark dan toggleDarkMode ke dalam return { ... }
  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowInstallBtn(false)
    setDeferredPrompt(null)
  }

  const handleAdd = async (task: string, category: string, priority: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error("User session not found");
    return
  }

  // JANGAN masukkan inserted_at secara manual di sini jika database sudah punya default value
  const { data, error } = await supabase
    .from('todos')
    .insert([{ 
      task, 
      category, 
      priority, 
      user_id: user.id 
    }])
    .select() // Mengambil data yang baru saja dibuat (termasuk inserted_at dari server)

  if (error) {
    console.error("Insert Error:", error.message);
    return;
  }

  if (data && data[0]) {
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

  const handlePurge = async () => {
    const completedIds = todos.filter(t => t.is_completed).map(t => t.id)
    if (completedIds.length === 0 || !confirm(`Purge ${completedIds.length} tasks?`)) return
    const { error } = await supabase.from('todos').delete().in('id', completedIds)
    if (!error) {
      const updated = todos.filter(t => !t.is_completed)
      setTodos(updated)
      localStorage.setItem('raven_todos', JSON.stringify(updated))
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('raven_todos')
    router.push('/login')
  }

  // Cari bagian sort di useTodoLogic.ts
  const filteredTodos = todos
    .filter(t => filter === 'Semua' ? true : t.category === filter)
    .sort((a, b) => {
      if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1
      
      // GANTI created_at MENJADI inserted_at
      const dateA = a.inserted_at ? new Date(a.inserted_at).getTime() : 0
      const dateB = b.inserted_at ? new Date(b.inserted_at).getTime() : 0
      return dateB - dateA
    })

  const stats = {
    pending: todos.filter(t => !t.is_completed).length,
    urgent: todos.filter(t => t.priority === 'High' && !t.is_completed).length,
    itera: todos.filter(t => t.category === 'ITERA' && !t.is_completed).length,
    done: todos.filter(t => t.is_completed).length
  }

  return {
    filter, setFilter, loading, showInstallBtn, currentTime, 
    activeQuote, userName, filteredTodos, stats, isDark, toggleDarkMode,
    handleInstallClick, handleAdd, handleToggle, handleDelete, handlePurge, handleLogout
  }
}