"use client"

import { useState, useEffect } from "react"
import { Switch } from "./switch"
import { Label } from "./label"
import { setCookie, getCookie } from 'cookies-next'

export function InferenceToggle() {
  const [isLocal, setIsLocal] = useState(false)
  
  useEffect(() => {
    // Check if local inference is enabled in cookies
    const storedValue = getCookie('useLocalInference')
    if (storedValue) {
      setIsLocal(storedValue === "true")
    }
  }, [])
  
  const handleToggle = (checked: boolean) => {
    setIsLocal(checked)
    // Set cookie with 30 day expiry
    setCookie('useLocalInference', checked.toString(), { maxAge: 60 * 60 * 24 * 30 })
    
    // Reload the page to apply the change
    window.location.reload()
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="inference-toggle"
        checked={isLocal}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="inference-toggle" className="text-sm">
        {isLocal ? "Using Local Inference" : "Using Groq API"}
      </Label>
    </div>
  )
} 