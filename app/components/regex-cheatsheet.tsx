
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, BookOpen } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface RegexCheatsheetProps {
  onInsert: (regex: string) => void
}

interface CheatsheetItem {
  pattern: string
  name: string
  description: string
  example: string
  category: string
}

export function RegexCheatsheet({ onInsert }: RegexCheatsheetProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { toast } = useToast()

  const cheatsheetItems: CheatsheetItem[] = [
    // Caracteres básicos
    { pattern: '.', name: 'Qualquer caractere', description: 'Corresponde a qualquer caractere exceto nova linha', example: 'a.c → abc, a1c, a@c', category: 'basic' },
    { pattern: '\\d', name: 'Dígito', description: 'Corresponde a qualquer dígito [0-9]', example: '\\d+ → 123, 4567', category: 'basic' },
    { pattern: '\\D', name: 'Não-dígito', description: 'Corresponde a qualquer não-dígito', example: '\\D+ → abc, @#$', category: 'basic' },
    { pattern: '\\w', name: 'Caractere de palavra', description: 'Corresponde a [a-zA-Z0-9_]', example: '\\w+ → hello, test_123', category: 'basic' },
    { pattern: '\\W', name: 'Não-palavra', description: 'Corresponde a qualquer não-caractere de palavra', example: '\\W+ → @#$, !!!', category: 'basic' },
    { pattern: '\\s', name: 'Espaço em branco', description: 'Corresponde a espaços, tabs, quebras de linha', example: '\\s+ → espaços, tabs', category: 'basic' },
    { pattern: '\\S', name: 'Não-espaço', description: 'Corresponde a qualquer não-espaço em branco', example: '\\S+ → texto, 123', category: 'basic' },
    
    // Quantificadores
    { pattern: '*', name: 'Zero ou mais', description: 'Corresponde a zero ou mais ocorrências', example: 'a* → , a, aa, aaa', category: 'quantifiers' },
    { pattern: '+', name: 'Um ou mais', description: 'Corresponde a uma ou mais ocorrências', example: 'a+ → a, aa, aaa', category: 'quantifiers' },
    { pattern: '?', name: 'Zero ou um', description: 'Corresponde a zero ou uma ocorrência', example: 'a? → , a', category: 'quantifiers' },
    { pattern: '{n}', name: 'Exatamente n', description: 'Corresponde exatamente n vezes', example: 'a{3} → aaa', category: 'quantifiers' },
    { pattern: '{n,}', name: 'n ou mais', description: 'Corresponde n ou mais vezes', example: 'a{2,} → aa, aaa, aaaa', category: 'quantifiers' },
    { pattern: '{n,m}', name: 'Entre n e m', description: 'Corresponde entre n e m vezes', example: 'a{2,4} → aa, aaa, aaaa', category: 'quantifiers' },
    
    // Âncoras
    { pattern: '^', name: 'Início da string', description: 'Corresponde ao início da string/linha', example: '^Hello → Hello world', category: 'anchors' },
    { pattern: '$', name: 'Fim da string', description: 'Corresponde ao fim da string/linha', example: 'world$ → Hello world', category: 'anchors' },
    { pattern: '\\b', name: 'Fronteira de palavra', description: 'Corresponde à fronteira de uma palavra', example: '\\bcat\\b → cat, not category', category: 'anchors' },
    { pattern: '\\B', name: 'Não-fronteira', description: 'Corresponde onde não há fronteira de palavra', example: '\\Bcat\\B → locate, not cat', category: 'anchors' },
    
    // Classes de caracteres
    { pattern: '[abc]', name: 'Classe de caracteres', description: 'Corresponde a qualquer caractere listado', example: '[abc] → a, b, c', category: 'classes' },
    { pattern: '[^abc]', name: 'Classe negativa', description: 'Corresponde a qualquer caractere não listado', example: '[^abc] → d, e, f, 1, 2', category: 'classes' },
    { pattern: '[a-z]', name: 'Faixa de caracteres', description: 'Corresponde a uma faixa de caracteres', example: '[a-z] → a, b, c, ..., z', category: 'classes' },
    { pattern: '[A-Z]', name: 'Maiúsculas', description: 'Corresponde a letras maiúsculas', example: '[A-Z] → A, B, C, ..., Z', category: 'classes' },
    { pattern: '[0-9]', name: 'Dígitos', description: 'Corresponde a dígitos', example: '[0-9] → 0, 1, 2, ..., 9', category: 'classes' },
    
    // Grupos
    { pattern: '()', name: 'Grupo de captura', description: 'Cria um grupo de captura', example: '(abc) → captura abc', category: 'groups' },
    { pattern: '(?:)', name: 'Grupo não-captura', description: 'Cria um grupo sem captura', example: '(?:abc) → agrupa sem capturar', category: 'groups' },
    { pattern: '(?=)', name: 'Lookahead positivo', description: 'Verifica se é seguido por...', example: 'a(?=b) → a seguido por b', category: 'groups' },
    { pattern: '(?!)', name: 'Lookahead negativo', description: 'Verifica se não é seguido por...', example: 'a(?!b) → a não seguido por b', category: 'groups' },
    
    // Padrões comuns
    { pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', name: 'Email', description: 'Padrão básico para email', example: 'user@example.com', category: 'patterns' },
    { pattern: 'https?://[\\w\\-\\.]+\\.[a-zA-Z]{2,}[\\w\\-\\._~:/?#\\[\\]@!$&\'()*+,;=]*', name: 'URL', description: 'Padrão básico para URL', example: 'https://example.com', category: 'patterns' },
    { pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}', name: 'CPF', description: 'Padrão para CPF brasileiro', example: '123.456.789-10', category: 'patterns' },
    { pattern: '\\d{5}-\\d{3}', name: 'CEP', description: 'Padrão para CEP brasileiro', example: '12345-678', category: 'patterns' },
    { pattern: '\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}', name: 'Telefone (BR)', description: 'Padrão para telefone brasileiro', example: '(11) 99999-9999', category: 'patterns' },
    { pattern: '\\d{2}/\\d{2}/\\d{4}', name: 'Data (DD/MM/YYYY)', description: 'Padrão para data brasileira', example: '25/12/2023', category: 'patterns' },
    { pattern: '\\d{2}:\\d{2}', name: 'Hora (HH:MM)', description: 'Padrão para hora', example: '14:30', category: 'patterns' },
    { pattern: '#[A-Fa-f0-9]{6}', name: 'Cor hexadecimal', description: 'Padrão para cor hexadecimal', example: '#FF5733', category: 'patterns' },
    { pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b', name: 'IP Address', description: 'Padrão para endereço IP', example: '192.168.1.1', category: 'patterns' },
  ]

  const categories = [
    { id: 'all', name: 'Todos', count: cheatsheetItems.length },
    { id: 'basic', name: 'Básico', count: cheatsheetItems.filter(item => item.category === 'basic').length },
    { id: 'quantifiers', name: 'Quantificadores', count: cheatsheetItems.filter(item => item.category === 'quantifiers').length },
    { id: 'anchors', name: 'Âncoras', count: cheatsheetItems.filter(item => item.category === 'anchors').length },
    { id: 'classes', name: 'Classes', count: cheatsheetItems.filter(item => item.category === 'classes').length },
    { id: 'groups', name: 'Grupos', count: cheatsheetItems.filter(item => item.category === 'groups').length },
    { id: 'patterns', name: 'Padrões', count: cheatsheetItems.filter(item => item.category === 'patterns').length },
  ]

  const filteredItems = cheatsheetItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.pattern.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleInsert = (item: CheatsheetItem) => {
    onInsert(item.pattern)
    toast({
      title: 'Padrão inserido!',
      description: `"${item.name}" foi adicionado à sua regex.`,
    })
  }

  const handleTest = (item: CheatsheetItem) => {
    onInsert(item.pattern)
    toast({
      title: 'Padrão testado!',
      description: `"${item.name}" foi inserido para teste.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Cheatsheet</h3>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar padrões..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categorias */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="h-8 text-xs"
          >
            {category.name}
            <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Lista de itens */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredItems.map((item, index) => (
          <Card key={index} className="p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{item.name}</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleTest(item)}
                    className="h-6 px-2 text-xs"
                  >
                    Testar
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleInsert(item)}
                    className="h-6 px-2"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
              
              <div className="space-y-1">
                <code className="text-xs bg-muted p-1 rounded code-font block">
                  {item.pattern}
                </code>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Exemplo:</span> {item.example}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-2" />
          <p>Nenhum padrão encontrado</p>
        </div>
      )}
    </div>
  )
}
