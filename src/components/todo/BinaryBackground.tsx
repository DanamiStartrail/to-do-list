'use client'
import { useEffect, useRef } from 'react'

export const BinaryBackground = () => {
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