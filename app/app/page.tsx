
import { Header } from '@/components/header'
import { RegexWorkspace } from '@/components/regex-workspace'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <RegexWorkspace />
      </main>
    </div>
  )
}
