import type { ReactNode } from 'react'
import { Sidebar, type NavKey } from './Sidebar'

type AppShellProps = {
  active: NavKey
  onNavigate: (key: NavKey) => void
  kicker: string
  title: string
  headerAside?: ReactNode
  children: ReactNode
}

export function AppShell({
  active,
  onNavigate,
  kicker,
  title,
  headerAside,
  children,
}: AppShellProps) {
  return (
    // h-dvh (bukan min-h-dvh) + overflow-hidden: bingkai aplikasi dipatok setinggi
    // viewport dan tidak ikut memanjang. Konten di bawah header yang scroll
    // sendiri (lihat div terakhir), bukan seluruh halaman/document.
    <div className="flex h-dvh overflow-hidden bg-bg">
      <Sidebar active={active} onNavigate={onNavigate} />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-start justify-between gap-6 border-b border-divider px-8 py-5">
          <div>
            <p className="kicker">{kicker}</p>
            <h1 className="mt-1 text-screen">{title}</h1>
          </div>
          {headerAside ? (
            <div className="shrink-0 pt-1 text-kicker text-neutral-600">{headerAside}</div>
          ) : null}
        </header>

        {/* min-h-0 wajib di sini — tanpanya flex child ini menolak mengecil di
            bawah tinggi kontennya sendiri, sehingga overflow-y-auto tidak
            pernah kepakai dan scroll balik lagi ke seluruh halaman. */}
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}
