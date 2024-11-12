'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'

export default function EmailConfirmation() {
  const [countdown, setCountdown] = useState(5)
  const navigate = useNavigate();
  useEffect(() => {
    
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer)
          navigate("/index")
          console.log('Redirecting to main page...')
        }
        return prevCount - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Email Confirmado</h1>
        <p className="text-lg mb-4">Redirigiendote a página principal</p>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-gray-600">en {countdown} segundos...</span>
        </div>
      </div>
    </div>
  )
}