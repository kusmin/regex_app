
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, Wand2, Lightbulb, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { RegexLanguage } from '@/lib/types'

interface RegexGeneratorProps {
  onGenerate: (regex: string) => void
  testText: string
  language: RegexLanguage
}

export function RegexGenerator({ onGenerate, testText, language }: RegexGeneratorProps) {
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ regex: string; explanation: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const generateRegex = async () => {
    if (!description.trim()) {
      toast({
        title: 'Descrição necessária',
        description: 'Por favor, descreva o que você deseja encontrar.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate-regex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          sampleText: testText,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar regex')
      }

      const data = await response.json()
      setResult({
        regex: data.regex,
        explanation: data.explanation,
      })
    } catch (err) {
      setError('Erro ao gerar regex. Tente novamente.')
      console.error('Erro na geração:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUseRegex = () => {
    if (result?.regex) {
      onGenerate(result.regex)
      toast({
        title: 'Regex aplicada!',
        description: 'A regex gerada foi aplicada ao playground.',
      })
    }
  }

  const suggestions = [
    'Extrair todos os emails de um texto',
    'Encontrar números de telefone brasileiros',
    'Validar CPF no formato XXX.XXX.XXX-XX',
    'Encontrar URLs que começam com https',
    'Extrair datas no formato DD/MM/YYYY',
    'Encontrar palavras que começam com maiúscula',
    'Validar senhas com pelo menos 8 caracteres',
    'Extrair códigos hexadecimais de cores',
    'Encontrar endereços IP',
    'Validar CEP brasileiro',
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Wand2 className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Gerador IA</h3>
        <Badge variant="outline" className="text-xs">
          {language.toUpperCase()}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Descreva o que você quer encontrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Ex: Encontrar todos os emails em um texto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <Button
            onClick={generateRegex}
            disabled={loading || !description.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Gerar Regex
              </>
            )}
          </Button>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Regex gerada:</span>
                  <Button
                    size="sm"
                    onClick={handleUseRegex}
                    variant="secondary"
                  >
                    Usar Regex
                  </Button>
                </div>
                <code className="text-sm bg-background p-2 rounded code-font block">
                  {result.regex}
                </code>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Explicação:</span>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {result.explanation}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Sugestões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start h-auto p-2 text-left"
                onClick={() => setDescription(suggestion)}
              >
                <span className="text-sm">{suggestion}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
