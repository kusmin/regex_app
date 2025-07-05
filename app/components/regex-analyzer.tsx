'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Brain, AlertCircle } from 'lucide-react'
import { RegexLanguage } from '@/lib/types'

interface RegexAnalyzerProps {
  regex: string
  language: RegexLanguage
}

/**  ▼  ajuste os números conforme a sua política  ▼  */
const CALLS_PER_MIN = 5          // máximo de chamadas por minuto
const WINDOW_MS      = 60_000    // 1 min em ms

/** Recupera o histórico salvo em localStorage (ou um array vazio) */
function getSavedHistory(): number[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('regexCalls') || '[]')
  } catch {
    return []
  }
}

export function RegexAnalyzer({ regex, language }: RegexAnalyzerProps) {
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info,  setInfo]  = useState<string | null>(null)

  /** timestamps das últimas chamadas */
  const callHist = useRef<number[]>(getSavedHistory())

  /*  Sempre que regex ou idioma mudar: limpa estado de UI  */
  useEffect(() => {
    setAnalysis('')
    setError(null)
    setInfo(null)
  }, [regex, language])

  /** Remove timestamps fora da janela deslizante */
  const pruneHistory = () => {
    const now = Date.now()
    callHist.current = callHist.current.filter(ts => now - ts < WINDOW_MS)
  }

  /** Chama a API apenas quando o usuário clica no botão  */
  const handleAnalyze = async () => {
    if (!regex.trim()) return
    pruneHistory()

    if (callHist.current.length >= CALLS_PER_MIN) {
      setInfo('Limite de análises por minuto atingido. Aguarde alguns segundos.')
      return
    }

    setLoading(true)
    setError(null)
    setInfo(null)

    try {
      const response = await fetch('/api/analyze-regex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regex, language })
      })

      if (!response.ok) throw new Error('Erro ao analisar regex')

      const data = await response.json()
      setAnalysis(data.explanation)

      /** salva timestamp e persiste */
      callHist.current.push(Date.now())
      localStorage.setItem('regexCalls', JSON.stringify(callHist.current))
    } catch (err) {
      console.error('Erro na análise:', err)
      setError('Erro ao analisar a regex. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  /** Quebra o texto da explicação em blocos formatados */
  const formatAnalysis = (text: string) => {
    const sections = text.split(/\n\s*\n/)
    return sections.map((section, index) => {
      // lista numerada
      if (/^\d+\./.test(section)) {
        const lines = section.split('\n')
        return (
            <div key={index} className="space-y-2">
              {lines.map((line, idx) => (
                  <div key={idx} className="text-sm">
                    {/^\d+\./.test(line) ? (
                        <p className="font-medium text-primary">{line}</p>
                    ) : (
                        <p className="ml-4 text-muted-foreground">{line}</p>
                    )}
                  </div>
              ))}
            </div>
        )
      }

      // títulos tipo "Visão Geral:"
      if (/^[A-Z][^.]*:$/.test(section)) {
        return (
            <h4 key={index} className="font-semibold text-lg mb-2">
              {section}
            </h4>
        )
      }

      // parágrafo normal
      return (
          <p key={index} className="text-sm leading-relaxed mb-4">
            {section}
          </p>
      )
    })
  }

  return (
      <div className="space-y-4">
        {/* Cabeçalho + botão de análise */}
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Análise de Regex</h3>
          <Badge variant="outline" className="text-xs">
            {language.toUpperCase()}
          </Badge>

          <Button
              onClick={handleAnalyze}
              size="sm"
              disabled={loading || !regex.trim()}
              className="ml-auto"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Analisar
          </Button>
        </div>

        {info && !error && (
            <p className="text-sm text-muted-foreground">{info}</p>
        )}

        {/* Mensagem inicial */}
        {!regex.trim() && (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Digite uma regex para ver a análise</p>
            </div>
        )}

        {/* Loading spinner */}
        {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Analisando regex...</span>
            </div>
        )}

        {/* Alerta de erro */}
        {error && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAnalyze}
                  className="ml-auto"
              >
                Tentar novamente
              </Button>
            </div>
        )}

        {/* Resultado da análise */}
        {analysis && !loading && !error && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Explicação Detalhada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">{formatAnalysis(analysis)}</div>
              </CardContent>
            </Card>
        )}

        {/* Bloco de informações técnicas */}
        {regex.trim() && !loading && !error && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações Técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Regex:</span>
                    <code className="ml-2 text-sm bg-muted px-2 py-1 rounded code-font">
                      {regex}
                    </code>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Linguagem:</span>
                    <Badge variant="secondary" className="ml-2">
                      {language.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Comprimento:</span>
                    <span className="ml-2 text-sm">{regex.length} caracteres</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Grupos de captura:</span>
                    <span className="ml-2 text-sm">
                  {(regex.match(/\([^?]/g) || []).length} grupos
                </span>
                  </div>
                </div>
              </CardContent>
            </Card>
        )}
      </div>
  )
}
