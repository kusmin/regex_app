
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ExamplesModal } from '@/components/examples-modal'
import { HistoryPopover } from '@/components/history-popover'
import { History, BookOpen, Copy, Github } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function Header() {
  const [showExamples, setShowExamples] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const { toast } = useToast()

  const handleExport = () => {
    const regexData = localStorage.getItem('current-regex-data')
    if (regexData) {
      navigator.clipboard.writeText(regexData)
      toast({
        title: 'Dados exportados!',
        description: 'Configuração copiada para a área de transferência.',
      })
    } else {
      toast({
        title: 'Nenhum dado encontrado',
        description: 'Não há dados para exportar.',
        variant: 'destructive',
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Regex Forge</h1>
                <p className="text-xs text-muted-foreground">Gerador de Regex Inteligente</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExamples(true)}
              className="hidden sm:flex"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Exemplos
            </Button>
            
            <HistoryPopover>
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                Histórico
              </Button>
            </HistoryPopover>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="hidden sm:flex"
            >
              <Copy className="w-4 h-4 mr-2" />
              Exportar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex"
            >
              <a
                href="https://github.com/kusmin"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <ExamplesModal
        open={showExamples}
        onOpenChange={setShowExamples}
      />
    </header>
  )
}
