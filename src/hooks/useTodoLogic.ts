'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false) // Fix Hydration
  const router = useRouter();
  const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'Work' | 'Break'>('Work');
  const [userId, setUserId] = useState<string | null>(null);
  
  // Helper Sync
  const sync = useCallback((updated: any[]) => { 
    setTodos(updated); 
    localStorage.setItem('raven_todos', JSON.stringify(updated));
  }, []);

  // Helper untuk putar suara
  const playPomoSound = (file: string) => {
    const audio = new Audio(`/${file}`);
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play blocked"));
  };

  // --- FUNGSI RESET DAILY (SINKRON DENGAN DATABASE) ---
  const checkAndResetDaily = useCallback(async (currentTodos: any[]) => {
    const today = new Date().toLocaleDateString('id-ID');
    const lastReset = localStorage.getItem('raven_last_reset');

    if (lastReset !== today) {
      const dailyIds = currentTodos
        .filter(t => t.is_daily && t.is_completed)
        .map(t => t.id);

      if (dailyIds.length > 0) {
        const { error } = await supabase.from('todos').update({ is_completed: false }).in('id', dailyIds);
        if (!error) {
          localStorage.setItem('raven_last_reset', today);
          return true;
        }
      } else {
        localStorage.setItem('raven_last_reset', today);
      }
    }
    return false;
  }, []);

  const togglePomodoro = () => {
    const nextState = !isPomodoroRunning;
    setIsPomodoroRunning(nextState);
    if (nextState === true) {
      playPomoSound('start-sound.wav'); 
    }
  };

  const fetchTodos = useCallback(async (userId: string) => {
    const { data, error } = await supabase.from('todos').select('*').eq('user_id', userId)
    if (!error && data) {
      const hasReset = await checkAndResetDaily(data);
      const finalData = hasReset ? data.map(t => t.is_daily ? { ...t, is_completed: false } : t) : data;
      setTodos(finalData);
      localStorage.setItem('raven_todos', JSON.stringify(finalData));
    }
  }, [checkAndResetDaily]);

  const archiveWeeklyTask = async () => {
    if (!userId) return; 

    const completedTasks = todos.filter(t => t.is_completed);
    if (completedTasks.length === 0) return alert("Belum ada task yang selesai untuk diarsip.");

    const report = {
      user_id: userId,
      total_done: completedTasks.length,
      Kuliah_count: completedTasks.filter(t => t.category === 'ITERA').length, // Diupdate ke ITERA
      Pribadi_count: completedTasks.filter(t => t.category === 'Pribadi').length,
      Work_count: completedTasks.filter(t => t.category === 'Project').length, // Diupdate ke Project
      week_range: `Minggu ke-${Math.ceil(new Date().getDate() / 7)} ${new Date().toLocaleString('id-ID', { month: 'long' })}`
    };

    const { error: insertError } = await supabase
      .from('weekly_reports')
      .insert([report]);

    if (insertError) {
      console.error("Gagal simpan laporan:", insertError.message);
      return alert("Gagal membuat laporan mingguan.");
    }

    const { error: deleteError } = await supabase
      .from('todos')
      .delete()
      .eq('user_id', userId)       
      .eq('is_completed', true)
      .eq('is_daily', false); // Proteksi agar Daily Task tidak terhapus saat arsip

    if (deleteError) {
      console.error("Gagal hapus data:", deleteError.message);
      return alert("Laporan tersimpan, tapi data lama gagal dihapus.");
    }
    alert("Laporan berhasil dibuat dan database telah dibersihkan!");
    await fetchTodos(userId); 
  };

  // App Initialization & Time Logic
  useEffect(() => {
    setMounted(true);
    const initApp = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return; }
      setUserId(user.id)
      setUserName("Danta")
      await fetchTodos(user.id)
      setLoading(false)
    }
    initApp()

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault(); setDeferredPrompt(e); setShowInstallBtn(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      clearInterval(timer)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [router, fetchTodos])

  useEffect(() => {
    let interval: any;
    if (isPomodoroRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsPomodoroRunning(false);
      
      if (pomodoroMode === 'Work') {
        playPomoSound('start-sound.wav');
        setPomodoroMode('Break');
        setPomodoroTime(5 * 60);
      } else {
        playPomoSound('stop-sound.wav');
        setPomodoroMode('Work');
        setPomodoroTime(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isPomodoroRunning, pomodoroTime, pomodoroMode]);

  const formatPomoTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (todos.length === 0) {
      setActiveQuote(TECH_QUOTES[Math.floor(Math.random() * TECH_QUOTES.length)])
    }
  }, [todos.length])

  // Actions
  const handleAdd = async (task: string, category: string, priority: string, is_daily: boolean, deadline: string | null, repeat_days: string[], description: string, start_time: string | null) => {
    const { data: { user } } = await supabase.auth.getUser()
    const finalDeadline = deadline ? new Date(deadline).toISOString() : null;
    
    const { data, error } = await supabase.from('todos').insert([{ 
      task, category, priority, user_id: user?.id, is_daily, deadline: finalDeadline, start_time, repeat_days, description 
    }]).select()
    if (!error && data) sync([data[0], ...todos])
  }

  const handleToggle = useCallback(async (id: string, is_comp: boolean) => {
    const updated = todos.map(t => t.id === id ? { ...t, is_completed: !is_comp } : t);
    setTodos(updated);
    localStorage.setItem('raven_todos', JSON.stringify(updated));

    const { error } = await supabase.from('todos').update({ is_completed: !is_comp }).eq('id', id);
    if (error && userId) fetchTodos(userId); 
  }, [todos, userId, fetchTodos]);

  const handleRename = useCallback(async (id: string, text: string) => {
    if (text.trim() && !(await supabase.from('todos').update({ task: text }).eq('id', id)).error) {
      const updated = todos.map(t => t.id === id ? { ...t, task: text } : t);
      sync(updated);
    }
  }, [todos, sync]);

  const handleDelete = async (id: string) => {
    if (!(await supabase.from('todos').delete().eq('id', id)).error)
      sync(todos.filter(t => t.id !== id));
  }

  // --- FIX: HANDLEUPDATE DISINKRONKAN DENGAN PAGE.TSX ---
  const handleUpdate = async (id: string, task: string, category: string, priority: string, is_daily: boolean, deadline: string | null, repeat_days: string[], description: string, start_time: string | null) => {
    const finalDeadline = deadline ? new Date(deadline).toISOString() : null;
    const { error } = await supabase
      .from('todos')
      .update({
        task, category, priority, is_daily,
        deadline: finalDeadline,
        start_time, repeat_days, description
      })
      .eq('id', id);

    if (!error) {
      const updated = todos.map(t => t.id === id ? { ...t, task, category, priority, is_daily, deadline: finalDeadline, start_time, repeat_days, description } : t);
      sync(updated);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    router.push('/login');
  }

  const getCategoryProgress = (categoryName: string) => {
    const catTodos = todos.filter(t => t.category === categoryName);
    return catTodos.length ? Math.round((catTodos.filter(t => t.is_completed).length / catTodos.length) * 100) : 0;
  };

  const filteredTodos = useMemo(() => {
    const checkActive = (t: any) => {
      if (!t.start_time || !t.deadline || t.is_completed) return false;
      const now = new Date();
      const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
      const [sh, sm] = t.start_time.split(':').map(Number);
      const startTotalMinutes = sh * 60 + sm;
      const d = new Date(t.deadline);
      const endTotalMinutes = d.getHours() * 60 + d.getMinutes();
      return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
    };

    const priorityWeight: any = { High: 3, Medium: 2, Low: 1 };

    return todos
      .filter((t) => {
        const isScheduledToday = t.repeat_days?.length > 0 ? t.repeat_days.includes(todayName) : true;
        if (filter === 'Today' && !isScheduledToday) return false;
        if (filter === 'Semua' || filter === 'Today') return true;
        if (filter === 'Upcoming') return t.deadline && new Date(t.deadline) > new Date();
        return t.category === filter;
      })
      .sort((a, b) => {
        if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
        if (!a.is_completed) {
          const now = new Date().getTime();
          const aOverdue = a.deadline && new Date(a.deadline).getTime() < now;
          const bOverdue = b.deadline && new Date(b.deadline).getTime() < now;
          const aActive = checkActive(a);
          const bActive = checkActive(b);

          if (aOverdue && !bOverdue) return -1;
          if (!aOverdue && bOverdue) return 1;
          if (aActive && !bActive) return -1;
          if (!aActive && bActive) return 1;
          if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
            return priorityWeight[b.priority] - priorityWeight[a.priority];
          }
        }
        return new Date(b.inserted_at).getTime() - new Date(a.inserted_at).getTime();
      });
  }, [todos, filter, todayName]);

  const stats = useMemo(() => {
    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    const checkActive = (t: any) => {
      if (!t.start_time || !t.deadline || t.is_completed) return false;
      const [sh, sm] = t.start_time.split(':').map(Number);
      const startTotalMinutes = sh * 60 + sm;
      const d = new Date(t.deadline);
      const endTotalMinutes = d.getHours() * 60 + d.getMinutes();
      return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
    };

    return {
      pending: todos.filter(t => !t.is_completed).length,
      urgent: todos.filter(t => t.priority === 'High' && !t.is_completed).length,
      ITERA: todos.filter(t => t.category === 'ITERA' && !t.is_completed).length,
      done: todos.filter(t => t.is_completed).length,
      overdue: todos.filter(t => t.deadline && !t.is_completed && new Date(t.deadline).getTime() < now.getTime()).length,
      onProgress: todos.filter(t => checkActive(t)).length 
    };
  }, [todos]);

  return {
    filter, setFilter, loading, showInstallBtn, currentTime, isModalOpen, mounted,
    activeQuote, userName, filteredTodos, stats, isSidebarOpen, getCategoryProgress,
    setIsSidebarOpen, setIsModalOpen, handleInstallClick: async () => {}, 
    handleAdd, handleRename, handleToggle, handleDelete, handleLogout, pomodoroTime, isPomodoroRunning, pomodoroMode, 
    togglePomodoro, setPomodoroTime, setPomodoroMode, formatPomoTime, archiveWeeklyTask, handleUpdate
  }
}