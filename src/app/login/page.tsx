'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

// Komponen Background Biner Hijau Neon
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

  return <canvas ref={canvasRef} className="fixed inset-0 opacity-20 pointer-events-none z-0" />
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0f14] p-4 md:p-8 relative overflow-hidden">
      <BinaryBackground />
      
      {/* Glow Ambient Lebih Terang untuk Desktop */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-500/10 blur-[150px] rounded-full pointer-events-none hidden md:block"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none hidden md:block"></div>
      
      <div className="relative w-full max-w-[480px] z-10 my-auto">
        {/* Border Glow Paksa Hijau */}
        <div className="absolute -inset-1 bg-gradient-to-b from-green-500/20 to-transparent rounded-[3rem] blur-2xl opacity-30"></div>
        
        <div className="relative bg-slate-900/80 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
          
          <div className="text-center mb-10">
            {/* Ikon Raven */}
            <div className="inline-flex p-5 rounded-3xl bg-green-500/10 border border-green-500/20 mb-6 shadow-[0_0_30px_rgba(0,255,65,0.2)]">
              <span className="text-5xl filter drop-shadow-[0_0_12px_rgba(0,255,65,0.8)]">🦅</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2 italic">
              RAVEN<span className="text-green-400">LIST</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="h-[1px] w-6 bg-green-500/30"></span>
              <p className="text-green-500/60 text-[10px] uppercase tracking-[0.4em] font-mono font-bold">Authentication_Required</p>
              <span className="h-[1px] w-6 bg-green-500/30"></span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 md:space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-green-400/70 uppercase tracking-[0.2em] ml-1">Identity Protocol</label>
              <input 
                type="email" 
                required
                placeholder="USER@ITERA.AC.ID" 
                className="w-full p-4 md:p-5 bg-white/5 border border-white/10 rounded-2xl focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 outline-none transition-all text-white placeholder:text-white/5 font-mono text-sm"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-green-400/70 uppercase tracking-[0.2em] ml-1">Access Token</label>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                className="w-full p-4 md:p-5 bg-white/5 border border-white/10 rounded-2xl focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 outline-none transition-all text-white placeholder:text-white/5 font-mono text-sm"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="relative w-full group overflow-hidden bg-green-500 text-black p-4 md:p-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:bg-green-400 hover:shadow-[0_0_40px_rgba(0,255,65,0.5)] active:scale-[0.98] disabled:opacity-50"
            >
              <span className="relative z-10">{loading ? 'Decrypting...' : 'Initialize_Session'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-[9px] text-slate-700 font-bold tracking-[0.3em] uppercase">
              Sumatera Institute of Technology // Root Access
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}