
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Brain, AlertCircle } from 'lucide-react'
import { RegexLanguage } from '@/lib/types'

interface RegexAnalyzerProps {
  regex: string
  language: RegexLanguage
}

export function RegexAnalyzer({ regex, language }: RegexAnalyzerProps) {
  const [analysis, setAnalysis] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (regex.trim()) {
      analyzeRegex()
    } else {
      setAnalysis('')
      setError(null)
    }
  }, [regex, language])

  const analyzeRegex = async () => {
    if (!regex.trim()) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/analyze-regex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          regex,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao analisar regex')
      }

      const data = await response.json()
      setAnalysis(data.explanation)
    } catch (err) {
      setError('Erro ao analisar a regex. Tente novamente.')
      console.error('Erro na análise:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatAnalysis = (text: string) => {
    // Dividir o texto em seções
    const sections = text.split(/\n\s*\n/)
    
    return sections.map((section, index) => {
      // Verificar se é uma lista numerada
      if (section.match(/^\d+\./)) {
        const lines = section.split('\n')
        return (
          <div key={index} className="space-y-2">
            {lines.map((line, lineIndex) => (
              <div key={lineIndex} className="text-sm">
                {line.match(/^\d+\./) ? (
                  <p className="font-medium text-primary">{line}</p>
                ) : (
                  <p className="ml-4 text-muted-foreground">{line}</p>
                )}
              </div>
            ))}
          </div>
        )
      }
      
      // Verificar se é um título
      if (section.match(/^[A-Z][^.]*:$/)) {
        return (
          <h4 key={index} className="font-semibold text-lg mb-2">
            {section}
          </h4>
        )
      }
      
      // Parágrafo normal
      return (
        <p key={index} className="text-sm leading-relaxed mb-4">
          {section}
        </p>
      )
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Análise de Regex</h3>
        <Badge variant="outline" className="text-xs">
          {language.toUpperCase()}
        </Badge>
      </div>

      {!regex.trim() && (
        <div className="text-center py-8 text-muted-foreground">
          <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Digite uma regex para ver a análise</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Analisando regex...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={analyzeRegex}
            className="ml-auto"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {analysis && !loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Explicação Detalhada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formatAnalysis(analysis)}
            </div>
          </CardContent>
        </Card>
      )}

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
