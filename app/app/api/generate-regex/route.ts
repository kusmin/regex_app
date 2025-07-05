//
// import { NextRequest, NextResponse } from 'next/server'
//
// export async function POST(request: NextRequest) {
//   try {
//     const { description, sampleText, language } = await request.json()
//
//     if (!description) {
//       return NextResponse.json({ error: 'Descrição é obrigatória' }, { status: 400 })
//     }
//
//     const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'gpt-4.1-mini',
//         messages: [
//           {
//             role: 'user',
//             content: `Gere uma expressão regular baseada na seguinte descrição:
//
// Descrição: ${description}
// Linguagem: ${language}
// ${sampleText ? `Texto de exemplo: ${sampleText}` : ''}
//
// Por favor, forneça:
// 1. A expressão regular pronta para uso
// 2. Uma breve explicação de como ela funciona
// 3. Flags recomendadas (se aplicável)
// 4. Exemplos de uso
//
// Seja preciso e considere as particularidades da linguagem ${language}.`
//           }
//         ],
//         temperature: 0.3,
//         max_tokens: 800,
//       })
//     })
//
//     if (!response.ok) {
//       throw new Error('Erro na API de geração')
//     }
//
//     const data = await response.json()
//     const result = data.choices?.[0]?.message?.content || 'Não foi possível gerar a regex'
//
//     // Tentar extrair a regex do resultado
//     const regexMatch = result.match(/(?:^|\n)([\/`]?[^\/`\n]+[\/`]?[gimuy]*)/m)
//     const generatedRegex = regexMatch?.[1]?.replace(/[\/`]/g, '') || ''
//
//     return NextResponse.json({
//       regex: generatedRegex,
//       explanation: result
//     })
//   } catch (error) {
//     console.error('Erro ao gerar regex:', error)
//     return NextResponse.json(
//       { error: 'Erro interno do servidor' },
//       { status: 500 }
//     )
//   }
// }
// src/app/api/regex/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

export async function POST(req: NextRequest) {
    try {
        const { description, sampleText, language } = await req.json();
        if (!description)
            return NextResponse.json({ error: 'Descrição é obrigatória' }, { status: 400 });

        const prompt = `
Gere uma expressão regular.

Descrição: ${description}
Linguagem: ${language}
${sampleText ? `Texto de exemplo: ${sampleText}` : ''}

Retorne:
1. Regex
2. Explicação
3. Flags indicadas
4. Exemplos de uso`;

        const gemResp = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.3, maxOutputTokens: 800, thinkingConfig: { thinkingBudget: 0 } }
        });

        const raw = gemResp.text || '';
        const match = raw.match(/(?:^|\n)([\/`]?[^\/`\n]+[\/`]?[gimuy]*)/m);
        const regexOut = match?.[1]?.replace(/[\/`]/g, '') ?? '';

        return NextResponse.json({ regex: regexOut, explanation: raw });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

