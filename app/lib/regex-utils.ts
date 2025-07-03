
import { RegexLanguage } from './types'

export interface RegexValidation {
  isValid: boolean
  error?: string
}

export function validateRegex(regex: string, language: RegexLanguage): RegexValidation {
  if (!regex.trim()) {
    return { isValid: true }
  }

  try {
    // Validação básica usando JavaScript RegExp
    new RegExp(regex)
    return { isValid: true }
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Regex inválida' 
    }
  }
}

export function findMatches(regex: string, text: string, flags: string = 'g'): any[] {
  if (!regex.trim() || !text.trim()) {
    return []
  }

  try {
    const regexObj = new RegExp(regex, flags)
    const matches: any[] = []
    let match

    if (flags.includes('g')) {
      while ((match = regexObj.exec(text)) !== null) {
        matches.push(match)
        // Evitar loop infinito em matches vazios
        if (match.index === regexObj.lastIndex) {
          regexObj.lastIndex++
        }
      }
    } else {
      match = regexObj.exec(text)
      if (match) {
        matches.push(match)
      }
    }

    return matches
  } catch (error) {
    return []
  }
}

export function highlightMatches(text: string, matches: any[]): string {
  if (!matches || matches.length === 0) {
    return escapeHtml(text)
  }

  let result = ''
  let lastIndex = 0

  // Ordenar matches por índice para processamento sequencial
  const sortedMatches = [...matches].sort((a, b) => a.index - b.index)

  for (const match of sortedMatches) {
    // Adicionar texto antes do match
    result += escapeHtml(text.slice(lastIndex, match.index))
    
    // Adicionar match destacado
    const matchText = match[0]
    result += `<span class="regex-match">${escapeHtml(matchText)}</span>`
    
    // Adicionar grupos capturados
    if (match.length > 1) {
      let groupIndex = 1
      let groupStart = match.index
      
      for (let i = 1; i < match.length; i++) {
        if (match[i] !== undefined) {
          const groupText = match[i]
          const groupClass = `regex-group-${Math.min(groupIndex, 4)}`
          // Substituir o texto do grupo dentro do match
          result = result.replace(
            escapeHtml(groupText),
            `<span class="${groupClass}">${escapeHtml(groupText)}</span>`
          )
          groupIndex++
        }
      }
    }
    
    lastIndex = match.index + matchText.length
  }

  // Adicionar texto restante
  result += escapeHtml(text.slice(lastIndex))

  return result
}

export function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export function getRegexFlags(language: RegexLanguage): string[] {
  switch (language) {
    case 'javascript':
      return ['g', 'i', 'm', 's', 'u', 'y']
    case 'java':
      return ['i', 'm', 's', 'u', 'x']
    case 'python':
      return ['i', 'm', 's', 'x']
    default:
      return ['g', 'i', 'm']
  }
}

export function getLanguageSpecificRegex(regex: string, language: RegexLanguage): string {
  switch (language) {
    case 'javascript':
      return regex
    case 'java':
      // Java usa diferentes sintaxes para algumas construções
      return regex
        .replace(/\\d/g, '\\\\d')
        .replace(/\\w/g, '\\\\w')
        .replace(/\\s/g, '\\\\s')
    case 'python':
      // Python tem sintaxe similar ao JavaScript
      return regex
    default:
      return regex
  }
}

export function formatRegexForLanguage(regex: string, language: RegexLanguage, flags: string = ''): string {
  switch (language) {
    case 'javascript':
      return `/${regex}/${flags}`
    case 'java':
      return `Pattern.compile("${regex}"${flags ? `, Pattern.${flags.toUpperCase()}` : ''})`
    case 'python':
      return `re.compile(r"${regex}"${flags ? `, re.${flags.toUpperCase()}` : ''})`
    default:
      return regex
  }
}

export function getCommonPatterns(): Array<{ name: string; pattern: string; description: string }> {
  return [
    {
      name: 'Email',
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      description: 'Valida endereços de email básicos'
    },
    {
      name: 'URL',
      pattern: 'https?://[\\w\\-\\.]+\\.[a-zA-Z]{2,}[\\w\\-\\._~:/?#\\[\\]@!$&\'()*+,;=]*',
      description: 'Encontra URLs HTTP e HTTPS'
    },
    {
      name: 'CPF',
      pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}',
      description: 'CPF no formato XXX.XXX.XXX-XX'
    },
    {
      name: 'CEP',
      pattern: '\\d{5}-\\d{3}',
      description: 'CEP no formato XXXXX-XXX'
    },
    {
      name: 'Telefone (BR)',
      pattern: '\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}',
      description: 'Telefone brasileiro em vários formatos'
    },
    {
      name: 'Data DD/MM/YYYY',
      pattern: '\\d{2}/\\d{2}/\\d{4}',
      description: 'Data no formato brasileiro'
    },
    {
      name: 'Hora HH:MM',
      pattern: '\\d{2}:\\d{2}',
      description: 'Hora no formato 24h'
    },
    {
      name: 'Número inteiro',
      pattern: '-?\\d+',
      description: 'Números inteiros positivos e negativos'
    },
    {
      name: 'Número decimal',
      pattern: '-?\\d+\\.\\d+',
      description: 'Números decimais'
    },
    {
      name: 'Cor hexadecimal',
      pattern: '#[A-Fa-f0-9]{6}',
      description: 'Códigos de cores em hexadecimal'
    },
    {
      name: 'IP Address',
      pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b',
      description: 'Endereços IP'
    },
    {
      name: 'Hashtag',
      pattern: '#[a-zA-Z0-9_]+',
      description: 'Hashtags em redes sociais'
    },
    {
      name: 'Menção (@username)',
      pattern: '@[a-zA-Z0-9_]+',
      description: 'Menções de usuários'
    },
  ]
}
