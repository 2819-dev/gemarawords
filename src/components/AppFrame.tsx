import type { ReactNode } from 'react'

type AppFrameProps = {
  children: ReactNode
}

export function AppFrame({ children }: AppFrameProps) {
  return (
    <div className="app-shell">
      <div className="sefer-spine" aria-hidden="true" />
      <div className="app-main">{children}</div>
    </div>
  )
}
