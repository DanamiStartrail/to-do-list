'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        alert(error.message)
      } else {
        router.push('/')
      }
    } catch (err) {
      alert("Gagal menghubungi server. Periksa koneksi internet.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Soft Ambient Glow - Mewah & Halus */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-200/30 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-100/40 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-[420px] relative z-10">
        {/* Brand Identity */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">
            Raven<span className="text-emerald-500"></span>
          </h1>
          <p className="text-[10px] font-bold tracking-[0.5em] text-slate-400 uppercase">
            Productivity System v3
          </p>
        </div>

        {/* Login Card - Ultra Minimalist */}
        <div className="bg-white p-10 rounded-[40px] shadow-[0_25px_70px_rgba(0,0,0,0.03)] border border-slate-100/50">
          <form onSubmit={handleLogin} className="space-y-7">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Identity
              </label>
              <input 
                type="email"
                placeholder="email@itera.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-transparent px-6 py-4 rounded-2xl text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Access Key
              </label>
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-transparent px-6 py-4 rounded-2xl text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-sm"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-[11px] tracking-[0.3em] uppercase hover:bg-emerald-500 transition-all active:scale-95 shadow-xl shadow-slate-900/10 disabled:opacity-50"
            >
              {loading ? 'Validating...' : 'Initialize Session'}
            </button>
          </form>

          {/* Footer Card */}
          <div className="mt-10 pt-6 border-t border-slate-50 text-center">
            <p className="text-[9px] font-bold text-slate-300 tracking-[0.2em] uppercase">
              Sumatera Institute of Technology
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}