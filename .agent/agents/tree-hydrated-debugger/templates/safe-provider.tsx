
"use client"
import { useEffect, useState } from "react"

export function SafeProvider({ children }) {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  if (!ready) return null
  return children
}
