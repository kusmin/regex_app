
'use client'

import { useState, useEffect } from 'react'
import { RegexHistory } from '@/lib/types'

export function useHistory() {
  const [history, setHistory] = useState<RegexHistory[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('regex-history')
      if (saved) {
        const parsed = JSON.parse(saved)
        setHistory(parsed)
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
      setHistory([])
    }
  }

  const addToHistory = (item: Omit<RegexHistory, 'id' | 'timestamp'>) => {
    const newItem: RegexHistory = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    const updatedHistory = [newItem, ...history.filter(h => h.regex !== item.regex)]
      .slice(0, 10) // Limitar a 10 itens

    setHistory(updatedHistory)
    localStorage.setItem('regex-history', JSON.stringify(updatedHistory))
  }

  const removeFromHistory = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem('regex-history', JSON.stringify(updatedHistory))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('regex-history')
  }

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    loadHistory,
  }
}
