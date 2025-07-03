
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { regex, language } = await request.json()

    if (!regex) {
      return NextResponse.json({ error: 'Regex é obrigatório' }, { status: 400 })
    }

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: `Analise esta expressão regular e explique detalhadamente cada componente:

Regex: ${regex}
Linguagem: ${language}

Por favor, forneça uma explicação clara e didática, explicando:
1. O que a regex faz de forma geral
2. Cada parte da regex individualmente
3. Como ela funciona passo a passo
4. Casos de uso comuns
5. Possíveis melhorias ou alternativas

Seja didático e use exemplos práticos quando possível.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      })
    })

    if (!response.ok) {
      throw new Error('Erro na API de análise')
    }

    const data = await response.json()
    const explanation = data.choices?.[0]?.message?.content || 'Não foi possível analisar a regex'

    return NextResponse.json({ explanation })
  } catch (error) {
    console.error('Erro ao analisar regex:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
