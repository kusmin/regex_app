
export type RegexLanguage = 'javascript' | 'java' | 'python'

export interface RegexMatch {
  match: string
  index: number
  groups: string[]
}

export interface RegexAnalysis {
  isValid: boolean
  error?: string
  matches: RegexMatch[]
  explanation?: string
}

export interface RegexHistory {
  id: string
  regex: string
  testText: string
  language: RegexLanguage
  timestamp: string
}

export interface RegexExample {
  name: string
  regex: string
  description: string
  testText: string
  language: RegexLanguage
  category: string
}

export interface BuilderToken {
  label: string
  pattern: string
  description: string
  category: string
  needsInput?: boolean
}

export interface CheatsheetItem {
  pattern: string
  name: string
  description: string
  example: string
  category: string
}
