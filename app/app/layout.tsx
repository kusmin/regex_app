
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

/* ------------ metadata global ------------ */
export const metadata: Metadata = {
  title: {
    default: 'Regex Forge – Gerador de Regex Inteligente',
    template: '%s | Regex Forge',
  },
  description:
      'Crie, teste e explique expressões regulares em segundos. Suporta JavaScript, Java, Python e mais.',
  keywords: [
    'regex',
    'expressão regular',
    'gerador de regex',
    'regex tester',
    'validador regex',
    'javascript',
    'python',
    'java',
  ],
  robots: { index: true, follow: true },
  authors: [{ name: 'Seu Nome', url: 'https://blog.exemplo.com' }],
  openGraph: {
    type: 'website',
    url: 'https://regexforge.app',
    title: 'Regex Forge – Gerador de Regex Inteligente',
    description:
        'Crie, teste e explique expressões regulares com ajuda de IA Gemini.',
    siteName: 'Regex Forge',
    images: [
      {
        url: 'https://regexforge.app/og.png',
        width: 1200,
        height: 630,
        alt: 'Regex Forge – preview image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@seu_usuario',
    images: ['https://regexforge.app/og.png'],
  },
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  ],
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
