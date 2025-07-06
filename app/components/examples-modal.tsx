
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Play } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ExamplesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Example {
  name: string
  regex: string
  description: string
  testText: string
  matches: string[]
  language: string
}

export function ExamplesModal({ open, onOpenChange }: ExamplesModalProps) {
  const [selectedExample, setSelectedExample] = useState<Example | null>(null)
  const { toast } = useToast()

  const examples: Example[] = [
    {
      name: 'Validação de Email',
      regex: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      description: 'Valida endereços de email básicos',
      testText: 'Contatos: joao@exemplo.com, maria.silva@teste.com.br, admin@site.co',
      matches: ['joao@exemplo.com', 'maria.silva@teste.com.br', 'admin@site.co'],
      language: 'javascript',
    },
    {
      name: 'CPF Brasileiro',
      regex: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}',
      description: 'Encontra CPFs no formato XXX.XXX.XXX-XX',
      testText: 'CPFs: 123.456.789-10, 987.654.321-00, 111.222.333-44',
      matches: ['123.456.789-10', '987.654.321-00', '111.222.333-44'],
      language: 'javascript',
    },
    {
      name: 'CEP Brasileiro',
      regex: '\\d{5}-\\d{3}',
      description: 'Encontra CEPs no formato XXXXX-XXX',
      testText: 'CEPs: 01234-567, 12345-678, 98765-432',
      matches: ['01234-567', '12345-678', '98765-432'],
      language: 'javascript',
    },
    {
      name: 'Telefone Brasileiro',
      regex: '\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}',
      description: 'Encontra telefones brasileiros em vários formatos',
      testText: 'Telefones: (11) 99999-9999, 21 98888-8888, 11999887766',
      matches: ['(11) 99999-9999', '21 98888-8888', '11999887766'],
      language: 'javascript',
    },
    {
      name: 'URL/Link',
      regex: 'https?://[\\w\\-\\.]+\\.[a-zA-Z]{2,}[\\w\\-\\._~:/?#\\[\\]@!$&\'()*+,;=]*',
      description: 'Encontra URLs HTTP e HTTPS',
      testText: 'Links: https://exemplo.com, http://teste.com.br/pagina, https://site.org/path?param=value',
      matches: ['https://exemplo.com', 'http://teste.com.br/pagina', 'https://site.org/path?param=value'],
      language: 'javascript',
    },
    {
      name: 'Data DD/MM/YYYY',
      regex: '\\d{2}/\\d{2}/\\d{4}',
      description: 'Encontra datas no formato brasileiro',
      testText: 'Datas: 25/12/2023, 01/01/2024, 15/08/2025',
      matches: ['25/12/2023', '01/01/2024', '15/08/2025'],
      language: 'javascript',
    },
    {
      name: 'Hora HH:MM',
      regex: '\\d{2}:\\d{2}',
      description: 'Encontra horários no formato HH:MM',
      testText: 'Horários: 14:30, 09:15, 23:59',
      matches: ['14:30', '09:15', '23:59'],
      language: 'javascript',
    },
    {
      name: 'Cor Hexadecimal',
      regex: '#[A-Fa-f0-9]{6}',
      description: 'Encontra códigos de cores hexadecimais',
      testText: 'Cores: #FF5733, #3498DB, #E74C3C, #2ECC71',
      matches: ['#FF5733', '#3498DB', '#E74C3C', '#2ECC71'],
      language: 'javascript',
    },
    {
      name: 'Endereço IP',
      regex: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b',
      description: 'Encontra endereços IP',
      testText: 'IPs: 192.168.1.1, 10.0.0.1, 172.16.0.1',
      matches: ['192.168.1.1', '10.0.0.1', '172.16.0.1'],
      language: 'javascript',
    },
    {
      name: 'Número Decimal',
      regex: '-?\\d+\\.\\d+',
      description: 'Encontra números decimais (positivos e negativos)',
      testText: 'Números: 3.14, -2.5, 0.75, -10.25',
      matches: ['3.14', '-2.5', '0.75', '-10.25'],
      language: 'javascript',
    },
    {
      name: 'Hashtag',
      regex: '#[a-zA-Z0-9_]+',
      description: 'Encontra hashtags em texto',
      testText: 'Post: Adorei o #evento de hoje! #tecnologia #programação #regex',
      matches: ['#evento', '#tecnologia', '#programação', '#regex'],
      language: 'javascript',
    },
    {
      name: 'Menção (@username)',
      regex: '@[a-zA-Z0-9_]+',
      description: 'Encontra menções de usuários',
      testText: 'Menções: @joao_silva, @maria123, @admin_site',
      matches: ['@joao_silva', '@maria123', '@admin_site'],
      language: 'javascript',
    },

  {
    name: 'Link Markdown',
        regex: '\\\\[([^\\\\]]+)\\\\]\\\\(([^)]+)\\\\)',
      description: 'Captura o texto e a URL em links formato Markdown',
      testText: 'Veja [meu site](https://exemplo.com) e o [repo](http://github.com/user/proj).',
      matches: ['[meu site](https://exemplo.com)', '[repo](http://github.com/user/proj)'],
      language: 'javascript',
  },
  {
    name: 'HTML Tag',
        regex: '<\\\\/?[A-Za-z][A-Za-z0-9-]*(\\\\s+[A-Za-z_:.-]+(=([\"\\\'][^\"\\\']*[\"\\\']|[^\\s>]+))?)*\\\\s*\\\\/?',
      description: 'Captura tags HTML genéricas com atributos simples',
      testText: '<div class=\"box\">Olá</div> <img src=\"img.png\" alt=\"img\"/>',
      matches: ['<div class=\"box\">', '</div>', '<img src=\"img.png\" alt=\"img\"/>'],
      language: 'javascript',
  },
  {
    name: 'Par chave-valor JSON',
        regex: '\"([^\"]+)\"\\\\s*:\\\\s*\"([^\"]*)\"',
      description: 'Encontra pares chave/valor em objetos JSON simples',
      testText: '{\"nome\":\"João\",\"idade\":\"30\",\"cidade\":\"BH\"}',
      matches: ['\"nome\":\"João\"', '\"idade\":\"30\"', '\"cidade\":\"BH\"'],
      language: 'javascript',
  },
  {
    name: 'Número Romano (I-M)',
        regex: '\\\\bM{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})\\\\b',
      description: 'Reconhece números romanos válidos de I até MMMMCMXCIX',
      testText: 'Números: IV, XIV, XLII, MMXXV, invalid: IC, XM',
      matches: ['IV', 'XIV', 'XLII', 'MMXXV'],
      language: 'javascript',
  },
  {
    name: 'Cor Hex 3 ou 6 dígitos',
        regex: '#(?:[A-Fa-f0-9]{3}){1,2}\\b',
      description: 'Aceita cores tipo #FFF ou #1A2B3C',
      testText: 'Cores: #abc, #ABCDEF, #123, texto #GGG inválido',
      matches: ['#abc', '#ABCDEF', '#123'],
      language: 'javascript',
  },
  {
    name: 'Palavras duplicadas',
        regex: '\\\\b(\\\\w+)\\\\s+\\\\1\\\\b',
      description: 'Detecta repetições imediatas de palavras (case-insensitive)',
      testText: 'Este texto contém contém duplicatas.',
      matches: ['contém contém'],
      language: 'javascript',
  },
    {
      name: 'Senha forte (mín. 8, maiúscula, minúscula, número, símbolo)',
      regex: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-\\=\\[\\]{};\\\'":\\\\|,.<>\\/?]).{8,}',
      description: 'Valida senhas fortes com pelo menos 8 caracteres e diversidade de conjuntos',
      testText: 'Senhas: Abcdef1!, fraco123, Forte#2025, aA1!',
      matches: ['Abcdef1!', 'Forte#2025'],
      language: 'javascript',
    }

  ]

  const handleCopyRegex = (regex: string) => {
    navigator.clipboard.writeText(regex)
    toast({
      title: 'Regex copiada!',
      description: 'Expressão regular copiada para a área de transferência.',
    })
  }

  const handleUseExample = (example: Example) => {
    // Salvar o exemplo no localStorage para uso
    localStorage.setItem('current-regex-data', JSON.stringify({
      regex: example.regex,
      testText: example.testText,
      language: example.language,
      timestamp: new Date().toISOString(),
    }))
    
    toast({
      title: 'Exemplo carregado!',
      description: `"${example.name}" foi carregado no playground.`,
    })
    
    // Fechar modal
    onOpenChange(false)
    
    // Recarregar página para aplicar o exemplo
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exemplos de Regex</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="grid gap-4">
              {examples.map((example, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{example.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {example.language}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyRegex(example.regex)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleUseExample(example)}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Usar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {example.description}
                    </p>
                    <code className="text-xs bg-muted p-2 rounded code-font block">
                      {example.regex}
                    </code>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {!selectedExample ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Selecione um exemplo da lista para ver os detalhes
                </p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedExample.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Regex:</h4>
                    <code className="text-sm bg-muted p-2 rounded code-font block">
                      {selectedExample.regex}
                    </code>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Descrição:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedExample.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Texto de teste:</h4>
                    <p className="text-sm bg-muted p-2 rounded">
                      {selectedExample.testText}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Matches esperados:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedExample.matches.map((match, index) => (
                        <Badge key={index} variant="secondary">
                          {match}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
