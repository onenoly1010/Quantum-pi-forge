import type { Metadata } from 'next'
import './globals.css'

async function getVersionData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/version.json`, {
      next: { revalidate: 0 }
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (e) {
    // Fallback if version file not available
  }
  return {
    commit: 'dev-local',
    build_time: new Date().toISOString(),
    system: 'OINIO Quantum Pi Forge'
  }
}

export const metadata: Metadata = {
  title: 'Quantum Pi Forge',
  description: 'Sovereign AI Governance and DeFi Protocol',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const version = await getVersionData()

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-black text-white">
        <main className="flex-1">
          {children}
        </main>
        <footer style={{
          fontSize: "12px",
          opacity: 0.6,
          padding: "12px",
          textAlign: "center",
          borderTop: "1px solid #222"
        }}>
          <div className="flex flex-col items-center gap-1">
            <div>OINIO Quantum Pi Forge</div>
            <div className="flex items-center gap-4">
              <span>Commit: <code className="text-emerald-400">{version.commit?.slice(0, 7)}</code></span>
              <span>Build: <code>{version.build_time}</code></span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
