"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import type { ButtonProps } from "@/components/ui/button"
import { useState, type MouseEvent } from "react"

interface RippleButtonProps extends ButtonProps {
  children: React.ReactNode
}

interface Ripple {
  x: number
  y: number
  size: number
  id: number
}

export function RippleButton({ children, onClick, ...props }: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const newRipple: Ripple = {
      x,
      y,
      size,
      id: Date.now(),
    }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 600)

    onClick?.(e)
  }

  return (
    <Button {...props} onClick={handleClick} className={`relative overflow-hidden ${props.className || ""}`}>
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </Button>
  )
}
