
'use client'

import { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Clock, Copy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface HistoryItem {
  id: string
  regex: string
  testText: string
  language: string
  timestamp: string
}

interface HistoryPopoverProps {
  children: React.ReactNode
}

export function HistoryPopover({ children }: HistoryPopoverProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('regex-history')
      if (saved) {
        const parsed = JSON.parse(saved)
        setHistory(parsed.slice(0, 10)) // Limitar a 10 itens
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }

  const saveToHistory = (regex: string, testText: string, language: string) => {
    if (!regex.trim()) return

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      regex,
      testText,
      language,
      timestamp: new Date().toISOString(),
    }

    const updatedHistory = [newItem, ...history.filter(item => item.regex !== regex)]
      .slice(0, 10)

    setHistory(updatedHistory)
    localStorage.setItem('regex-history', JSON.stringify(updatedHistory))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('regex-history')
    toast({
      title: 'Histórico limpo',
      description: 'Todas as entradas do histórico foram removidas.',
    })
  }

  const removeItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem('regex-history', JSON.stringify(updatedHistory))
    toast({
      title: 'Item removido',
      description: 'Item removido do histórico.',
    })
  }

  const useHistoryItem = (item: HistoryItem) => {
    localStorage.setItem('current-regex-data', JSON.stringify({
      regex: item.regex,
      testText: item.testText,
      language: item.language,
      timestamp: new Date().toISOString(),
    }))
    
    toast({
      title: 'Regex carregada!',
      description: 'Regex do histórico foi carregada no playground.',
    })
    
    // Recarregar página para aplicar
    window.location.reload()
  }

  const copyRegex = (regex: string) => {
    navigator.clipboard.writeText(regex)
    toast({
      title: 'Regex copiada!',
      description: 'Expressão regular copiada para a área de transferência.',
    })
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Agora há pouco'
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Histórico</h4>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma regex no histórico</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.map((item) => (
                <Card key={item.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {item.language.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyRegex(item.regex)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <code className="text-xs bg-muted p-2 rounded code-font block truncate">
                      {item.regex}
                    </code>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(item.timestamp)}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => useHistoryItem(item)}
                        className="h-6 px-2 text-xs"
                      >
                        Usar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
