
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface RegexBuilderProps {
  onInsert: (regex: string) => void
  currentRegex: string
}

interface BuilderItem {
  label: string
  pattern: string
  description: string
  needsInput?: boolean
}

interface BuilderCategory {
  title: string
  items: BuilderItem[]
}

export function RegexBuilder({ onInsert, currentRegex }: RegexBuilderProps) {
  const [openCategories, setOpenCategories] = useState<string[]>(['common'])
  const [customInput, setCustomInput] = useState('')
  const { toast } = useToast()

  const categories: BuilderCategory[] = [
    {
      title: 'Tokens Comuns',
      items: [
        { label: 'Qualquer caractere', pattern: '.', description: 'Corresponde a qualquer caractere exceto nova linha' },
        { label: 'Dígito', pattern: '\\d', description: 'Corresponde a qualquer dígito [0-9]' },
        { label: 'Não-dígito', pattern: '\\D', description: 'Corresponde a qualquer não-dígito' },
        { label: 'Palavra', pattern: '\\w', description: 'Corresponde a caracteres de palavra [a-zA-Z0-9_]' },
        { label: 'Não-palavra', pattern: '\\W', description: 'Corresponde a não-caracteres de palavra' },
        { label: 'Espaço', pattern: '\\s', description: 'Corresponde a espaços em branco' },
        { label: 'Não-espaço', pattern: '\\S', description: 'Corresponde a não-espaços em branco' },
        { label: 'Texto literal', pattern: '', description: 'Insira o texto que deseja encontrar exatamente', needsInput: true },
      ],
    },
    {
      title: 'Quantificadores',
      items: [
        { label: 'Zero ou mais', pattern: '*', description: 'Corresponde a zero ou mais ocorrências' },
        { label: 'Um ou mais', pattern: '+', description: 'Corresponde a uma ou mais ocorrências' },
        { label: 'Zero ou um', pattern: '?', description: 'Corresponde a zero ou uma ocorrência' },
        { label: 'Exatamente n', pattern: '{n}', description: 'Corresponde exatamente n vezes', needsInput: true },
        { label: 'n ou mais', pattern: '{n,}', description: 'Corresponde n ou mais vezes', needsInput: true },
        { label: 'Entre n e m', pattern: '{n,m}', description: 'Corresponde entre n e m vezes', needsInput: true },
      ],
    },
    {
      title: 'Grupos e Lookarounds',
      items: [
        { label: 'Grupo de captura', pattern: '()', description: 'Cria um grupo de captura' },
        { label: 'Grupo não-captura', pattern: '(?:)', description: 'Cria um grupo sem captura' },
        { label: 'Lookahead positivo', pattern: '(?=)', description: 'Verifica se é seguido por...' },
        { label: 'Lookahead negativo', pattern: '(?!)', description: 'Verifica se não é seguido por...' },
        { label: 'Lookbehind positivo', pattern: '(?<=)', description: 'Verifica se é precedido por...' },
        { label: 'Lookbehind negativo', pattern: '(?<!)', description: 'Verifica se não é precedido por...' },
      ],
    },
    {
      title: 'Âncoras',
      items: [
        { label: 'Início da string', pattern: '^', description: 'Corresponde ao início da string' },
        { label: 'Fim da string', pattern: '$', description: 'Corresponde ao fim da string' },
        { label: 'Fronteira de palavra', pattern: '\\b', description: 'Corresponde à fronteira de uma palavra' },
        { label: 'Não-fronteira', pattern: '\\B', description: 'Corresponde onde não há fronteira de palavra' },
      ],
    },
    {
      title: 'Classes de Caracteres',
      items: [
        { label: 'Qualquer dos caracteres', pattern: '[]', description: 'Corresponde a qualquer caractere listado', needsInput: true },
        { label: 'Exceto os caracteres', pattern: '[^]', description: 'Corresponde a qualquer caractere exceto os listados', needsInput: true },
        { label: 'Faixa de caracteres', pattern: '[a-z]', description: 'Corresponde a uma faixa de caracteres' },
        { label: 'Letras minúsculas', pattern: '[a-z]', description: 'Corresponde a letras minúsculas' },
        { label: 'Letras maiúsculas', pattern: '[A-Z]', description: 'Corresponde a letras maiúsculas' },
        { label: 'Números', pattern: '[0-9]', description: 'Corresponde a dígitos' },
        { label: 'Alfanumérico', pattern: '[a-zA-Z0-9]', description: 'Corresponde a letras e números' },
      ],
    },
    {
      title: 'Padrões Comuns',
      items: [
        { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: 'Padrão básico para email' },
        { label: 'URL', pattern: 'https?://[\\w\\-\\.]+\\.[a-zA-Z]{2,}[\\w\\-\\._~:/?#\\[\\]@!$&\'()*+,;=]*', description: 'Padrão básico para URL' },
        { label: 'Telefone (BR)', pattern: '\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}', description: 'Padrão para telefone brasileiro' },
        { label: 'CEP', pattern: '\\d{5}-?\\d{3}', description: 'Padrão para CEP brasileiro' },
        { label: 'CPF', pattern: '\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}', description: 'Padrão para CPF brasileiro' },
        { label: 'Data (DD/MM/YYYY)', pattern: '\\d{2}/\\d{2}/\\d{4}', description: 'Padrão para data brasileira' },
        { label: 'Hora (HH:MM)', pattern: '\\d{2}:\\d{2}', description: 'Padrão para hora' },
        { label: 'Número inteiro', pattern: '-?\\d+', description: 'Padrão para número inteiro' },
        { label: 'Número decimal', pattern: '-?\\d+\\.\\d+', description: 'Padrão para número decimal' },
      ],
    },
  ]

  const toggleCategory = (category: string) => {
    setOpenCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleInsert = (item: BuilderItem) => {
    if (item.needsInput && !customInput.trim()) {
      toast({
        title: 'Entrada necessária',
        description: 'Por favor, insira um valor para este padrão.',
        variant: 'destructive',
      })
      return
    }

    let pattern = item.pattern
    if (item.needsInput) {
      if (item.pattern === '') {
        // Texto literal - escapar caracteres especiais
        pattern = customInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      } else {
        // Substituir placeholders
        pattern = pattern.replace(/n/g, customInput).replace(/m/g, customInput)
      }
    }

    const newRegex = currentRegex + pattern
    onInsert(newRegex)
    setCustomInput('')
    
    toast({
      title: 'Padrão inserido!',
      description: `"${item.label}" foi adicionado à sua regex.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Builder de Regex</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onInsert('')}
        >
          Limpar
        </Button>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <Collapsible
            key={category.title}
            open={openCategories.includes(category.title.toLowerCase())}
            onOpenChange={() => toggleCategory(category.title.toLowerCase())}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
              >
                <span className="font-medium">{category.title}</span>
                {openCategories.includes(category.title.toLowerCase()) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-2">
              {category.items.map((item, index) => (
                <Card key={index} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.label}</span>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleInsert(item)}
                        className="h-6 px-2"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    
                    {item.pattern && (
                      <code className="text-xs bg-muted p-1 rounded code-font">
                        {item.pattern}
                      </code>
                    )}
                    
                    {item.needsInput && (
                      <div className="space-y-1">
                        <Label className="text-xs">
                          {item.label === 'Texto literal' ? 'Texto:' : 'Valor:'}
                        </Label>
                        <Input
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          placeholder={
                            item.label === 'Texto literal' 
                              ? 'Digite o texto...'
                              : 'Digite o valor...'
                          }
                          className="h-6 text-xs"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}
