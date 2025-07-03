
'use client'

import { useState, useEffect } from 'react'
import { RegexLanguage } from '@/lib/types'

export function useRegex() {
  const [regex, setRegex] = useState('')
  const [testText, setTestText] = useState('')
  const [language, setLanguage] = useState<RegexLanguage>('javascript')

  useEffect(() => {
    // Carregar dados salvos do localStorage
    const savedData = localStorage.getItem('current-regex-data')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setRegex(parsed.regex || '')
        setTestText(parsed.testText || '')
        setLanguage(parsed.language || 'javascript')
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error)
      }
    } else {
      // Dados padrão para demonstração
      setRegex('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b')
      setTestText('Contatos: joao@exemplo.com, maria.silva@teste.com.br, contato@empresa.co')
    }
  }, [])

  useEffect(() => {
    // Salvar dados no localStorage quando mudarem
    const dataToSave = {
      regex,
      testText,
      language,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('current-regex-data', JSON.stringify(dataToSave))
  }, [regex, testText, language])

  const saveToHistory = () => {
    if (!regex.trim()) return

    const historyItem = {
      id: Date.now().toString(),
      regex,
      testText,
      language,
      timestamp: new Date().toISOString(),
    }

    const existingHistory = JSON.parse(localStorage.getItem('regex-history') || '[]')
    const newHistory = [historyItem, ...existingHistory.filter((item: any) => item.regex !== regex)]
      .slice(0, 10) // Limitar a 10 itens

    localStorage.setItem('regex-history', JSON.stringify(newHistory))
  }

  const updateRegex = (newRegex: string) => {
    setRegex(newRegex)
    if (newRegex.trim()) {
      saveToHistory()
    }
  }

  return {
    regex,
    setRegex: updateRegex,
    testText,
    setTestText,
    language,
    setLanguage,
    saveToHistory,
  }
}
