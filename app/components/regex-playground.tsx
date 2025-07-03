
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { CheckCircle, XCircle, Play, Copy, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { validateRegex, findMatches, highlightMatches } from '@/lib/regex-utils'
import { RegexLanguage } from '@/lib/types'

interface RegexPlaygroundProps {
  regex: string
  setRegex: (regex: string) => void
  testText: string
  setTestText: (text: string) => void
  language: RegexLanguage
  setLanguage: (language: RegexLanguage) => void
}

export function RegexPlayground({
  regex,
  setRegex,
  testText,
  setTestText,
  language,
  setLanguage,
}: RegexPlaygroundProps) {
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    unicode: false,
    sticky: false,
    dotAll: false,
  })
  const [isValid, setIsValid] = useState(true)
  const [matches, setMatches] = useState<any[]>([])
  const [highlightedText, setHighlightedText] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const validation = validateRegex(regex, language)
    setIsValid(validation.isValid)
    
    if (validation.isValid && regex && testText) {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag, _]) => {
          switch (flag) {
            case 'global': return 'g'
            case 'ignoreCase': return 'i'
            case 'multiline': return 'm'
            case 'unicode': return 'u'
            case 'sticky': return 'y'
            case 'dotAll': return 's'
            default: return ''
          }
        })
        .join('')
      
      const matchResults = findMatches(regex, testText, flagString)
      setMatches(matchResults)
      setHighlightedText(highlightMatches(testText, matchResults))
    } else {
      setMatches([])
      setHighlightedText(testText)
    }
  }, [regex, testText, flags, language])

  const handleCopy = () => {
    navigator.clipboard.writeText(regex)
    toast({
      title: 'Regex copiada!',
      description: 'Expressão regular copiada para a área de transferência.',
    })
  }

  const handleExport = () => {
    const data = {
      regex,
      testText,
      language,
      flags,
      timestamp: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `regex-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Seletor de Linguagem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Playground de Regex
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['javascript', 'java', 'python'] as RegexLanguage[]).map((lang) => (
              <Button
                key={lang}
                variant={language === lang ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage(lang)}
                className="capitalize"
              >
                {lang}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campo de Regex */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Expressão Regular</span>
            <div className="flex items-center gap-2">
              {isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                placeholder="Digite sua expressão regular..."
                className={`code-font text-lg ${!isValid ? 'border-red-500' : ''}`}
              />
              {!isValid && (
                <p className="text-sm text-red-500 mt-1">
                  Expressão regular inválida
                </p>
              )}
            </div>

            {/* Flags */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="global"
                  checked={flags.global}
                  onCheckedChange={(checked) =>
                    setFlags({ ...flags, global: checked })
                  }
                />
                <Label htmlFor="global" className="text-sm">
                  Global (g)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ignoreCase"
                  checked={flags.ignoreCase}
                  onCheckedChange={(checked) =>
                    setFlags({ ...flags, ignoreCase: checked })
                  }
                />
                <Label htmlFor="ignoreCase" className="text-sm">
                  Ignore Case (i)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="multiline"
                  checked={flags.multiline}
                  onCheckedChange={(checked) =>
                    setFlags({ ...flags, multiline: checked })
                  }
                />
                <Label htmlFor="multiline" className="text-sm">
                  Multiline (m)
                </Label>
              </div>
              {language === 'javascript' && (
                <>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="unicode"
                      checked={flags.unicode}
                      onCheckedChange={(checked) =>
                        setFlags({ ...flags, unicode: checked })
                      }
                    />
                    <Label htmlFor="unicode" className="text-sm">
                      Unicode (u)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sticky"
                      checked={flags.sticky}
                      onCheckedChange={(checked) =>
                        setFlags({ ...flags, sticky: checked })
                      }
                    />
                    <Label htmlFor="sticky" className="text-sm">
                      Sticky (y)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dotAll"
                      checked={flags.dotAll}
                      onCheckedChange={(checked) =>
                        setFlags({ ...flags, dotAll: checked })
                      }
                    />
                    <Label htmlFor="dotAll" className="text-sm">
                      Dot All (s)
                    </Label>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Texto de Teste */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Texto de Teste</span>
            <Badge variant="secondary">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="input">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">Entrada</TabsTrigger>
              <TabsTrigger value="output">Resultado</TabsTrigger>
            </TabsList>
            
            <TabsContent value="input">
              <Textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Digite o texto para testar a regex..."
                className="min-h-[200px] code-font"
              />
            </TabsContent>
            
            <TabsContent value="output">
              <div
                className="min-h-[200px] p-3 rounded-md bg-muted code-font text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Matches */}
      {matches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Matches Encontrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted rounded-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Match {index + 1}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Posição: {match.index}-{match.index + match[0].length}
                    </span>
                  </div>
                  <p className="code-font text-sm bg-background p-2 rounded">
                    {match[0]}
                  </p>
                  {match.length > 1 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-medium">Grupos:</p>
                      {match.slice(1).map((group: string, groupIndex: number) => (
                        <div key={groupIndex} className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            ${groupIndex + 1}
                          </Badge>
                          <span className="code-font text-sm">{group || '(vazio)'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
