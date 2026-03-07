'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else window.location.href = '/' // Pindah ke halaman utama setelah login
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-black">Login To-Do Pribadi</h1>
        <input 
          type="email" placeholder="Email" 
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          onClick={handleLogin}
          className="w-full bg-blue-500 text-black p-2 rounded hover:bg-blue-600"
        >
          Masuk
        </button>
      </div>
    </div>
  )
}