
'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RegexPlayground } from '@/components/regex-playground'
import { RegexBuilder } from '@/components/regex-builder'
import { RegexCheatsheet } from '@/components/regex-cheatsheet'
import { RegexAnalyzer } from '@/components/regex-analyzer'
import { RegexGenerator } from '@/components/regex-generator'
import { Card, CardContent } from '@/components/ui/card'
import { useRegex } from '@/hooks/use-regex'

export function RegexWorkspace() {
  const [activeTab, setActiveTab] = useState('playground')
  const { regex, setRegex, testText, setTestText, language, setLanguage } = useRegex()

  return (
    <div className="space-y-6">
      {/* Mobile Tabs */}
      <div className="block lg:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="playground">Playground</TabsTrigger>
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="analyze">Análise</TabsTrigger>
            <TabsTrigger value="generate">Gerar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="playground" className="mt-4">
            <RegexPlayground
              regex={regex}
              setRegex={setRegex}
              testText={testText}
              setTestText={setTestText}
              language={language}
              setLanguage={setLanguage}
            />
          </TabsContent>
          
          <TabsContent value="builder" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <RegexBuilder onInsert={setRegex} currentRegex={regex} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analyze" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <RegexAnalyzer regex={regex} language={language} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="generate" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <RegexGenerator
                  onGenerate={setRegex}
                  testText={testText}
                  language={language}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
        {/* Coluna Esquerda - Ferramentas */}
        <div className="col-span-3 space-y-6">
          <Tabs defaultValue="builder">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="cheatsheet">Cheatsheet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <RegexBuilder onInsert={setRegex} currentRegex={regex} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cheatsheet" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <RegexCheatsheet onInsert={setRegex} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Coluna Central - Playground */}
        <div className="col-span-6">
          <RegexPlayground
            regex={regex}
            setRegex={setRegex}
            testText={testText}
            setTestText={setTestText}
            language={language}
            setLanguage={setLanguage}
          />
        </div>

        {/* Coluna Direita - Análise e Resultados */}
        <div className="col-span-3 space-y-6">
          <Tabs defaultValue="analyze">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analyze">Análise</TabsTrigger>
              <TabsTrigger value="generate">Gerar IA</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analyze" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <RegexAnalyzer regex={regex} language={language} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="generate" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <RegexGenerator
                    onGenerate={setRegex}
                    testText={testText}
                    language={language}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
