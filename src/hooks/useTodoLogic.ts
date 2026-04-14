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
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Dapatkan nama hari saat ini (e.g., "Monday", "Tuesday")
  const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const sync = (updated: any[]) => { 
  setTodos(updated); 
  localStorage.setItem('raven_todos', JSON.stringify(updated)); 
};

  // --- FUNGSI RESET DAILY (BARU) ---
  const checkAndResetDaily = useCallback(async (currentTodos: any[]) => {
    const today = new Date().toLocaleDateString('id-ID');
    const lastReset = localStorage.getItem('raven_last_reset');

    // Jika hari ini berbeda dengan hari terakhir reset tersimpan
    if (lastReset !== today) {
      const dailyIds = currentTodos
        .filter(t => t.is_daily && t.is_completed)
        .map(t => t.id);

      if (dailyIds.length > 0) {
        const { error } = await supabase
          .from('todos')
          .update({ is_completed: false })
          .in('id', dailyIds);

        if (!error) {
          localStorage.setItem('raven_last_reset', today);
          return true; // Menandakan ada perubahan
        }
      } else {
        // Tetap simpan tanggal hari ini meskipun tidak ada task harian yang perlu direset
        localStorage.setItem('raven_last_reset', today);
      }
    }
    return false;
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const fetchTodos = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
    
    if (!error && data) {
      // Jalankan pengecekan reset tepat setelah data diambil
      const hasReset = await checkAndResetDaily(data);
      if (hasReset) {
        // Jika ada yang direset, ambil data ulang atau update lokal
        const updatedData = data.map(t => t.is_daily ? { ...t, is_completed: false } : t);
        setTodos(updatedData);
        localStorage.setItem('raven_todos', JSON.stringify(updatedData));
      } else {
        setTodos(data);
        localStorage.setItem('raven_todos', JSON.stringify(data));
      }
    }
  }, [checkAndResetDaily]);

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

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowInstallBtn(false)
    setDeferredPrompt(null)
  }

  // --- UPDATE HANDLEADD (DITAMBAH PARAMETER isDaily) ---
  // Update parameter handleAdd
// Di dalam useTodoLogic.ts, cari fungsi handleAdd dan sesuaikan:
const handleAdd = async (task: string, category: string, priority: string, is_daily: boolean, deadline: string | null, repeat_days: string[], description: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('todos')
    .insert([{ task, category, priority, user_id: user?.id, is_daily, deadline, repeat_days, description }])
    .select()
  
  if (!error && data) sync([data[0], ...todos])
}

  const handleToggle = async (id: string, is_comp: boolean) => {
    if (!(await supabase.from('todos').update({ is_completed: !is_comp }).eq('id', id)).error)
      sync(todos.map(t => t.id === id ? { ...t, is_completed: !is_comp } : t));
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (!error) {
      const updated = todos.filter(t => t.id !== id)
      setTodos(updated)
      localStorage.setItem('raven_todos', JSON.stringify(updated))
    }
  }

  const handlePurge = async () => {
    const completedIds = todos.filter(t => t.is_completed && !t.is_daily).map(t => t.id) // Daily tidak ikut di-purge
    if (completedIds.length === 0 || !confirm(`Purge ${completedIds.length} tasks?`)) return
    const { error } = await supabase.from('todos').delete().in('id', completedIds)
    if (!error) {
      const updated = todos.filter(t => !completedIds.includes(t.id))
      setTodos(updated)
      localStorage.setItem('raven_todos', JSON.stringify(updated))
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('raven_todos')
    localStorage.removeItem('raven_last_reset') // BARU
    router.push('/login')
  }

  const handleUpdateDeadline = async (id: string, newDeadline: string) => {
    const { error } = await supabase
      .from('todos')
      .update({ deadline: newDeadline })
      .eq('id', id);

    if (!error) {
      const updated = todos.map(t => t.id === id ? { ...t, deadline: newDeadline } : t);
      setTodos(updated);
      localStorage.setItem('raven_todos', JSON.stringify(updated));
    }
  };

  const getCategoryProgress = (categoryName: string) => {
    const categoryTodos = todos.filter(t => t.category === categoryName);
    if (categoryTodos.length === 0) return 0;
    
    const completed = categoryTodos.filter(t => t.is_completed).length;
    return Math.round((completed / categoryTodos.length) * 100);
  };
  // Tambahkan di dalam useTodoLogic.ts
  const handleRename = async (id: string, text: string) => {
    if (text.trim() && !(await supabase.from('todos').update({ task: text }).eq('id', id)).error)
      sync(todos.map(t => t.id === id ? { ...t, task: text } : t));
  };

// Jangan lupa return handleRename di bagian bawah hook

  const filteredTodos = todos
  .filter((t) => {
    // 1. Cek apakah tugas ini punya jadwal hari spesifik
    const hasSpecificDays = t.repeat_days && t.repeat_days.length > 0;
    const isScheduledForToday = hasSpecificDays ? t.repeat_days.includes(todayName) : true;

    // 2. Jika filter "Today" aktif, sembunyikan tugas yang tidak dijadwalkan hari ini
    if (filter === 'Today' && !isScheduledForToday) return false;

    // 3. Logika filter kategori yang sudah ada
    if (filter === 'Semua') return true;
    if (filter === 'Today') return true; // (Sudah tersaring di poin 2)
    if (filter === 'Upcoming') {
      const taskDate = t.deadline ? new Date(t.deadline) : null;
      return taskDate && taskDate > new Date();
    }
    return t.category === filter;
  })
    .sort((a, b) => {
      if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1
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
    filter, setFilter, loading, showInstallBtn, currentTime, isModalOpen,
    activeQuote, userName, filteredTodos, stats,isSidebarOpen, getCategoryProgress, setIsSidebarOpen,
    setIsModalOpen,toggleSidebar, toggleModal,handleInstallClick, handleAdd, handleRename,
    handleToggle, handleDelete, handlePurge, handleLogout, handleUpdateDeadline
  }
}