import { createContext, useContext } from 'react'

interface ShellContextValue {
  openMenu: () => void
  openProfile: () => void
  requestReset: () => void
}

export const ShellContext = createContext<ShellContextValue | null>(null)

export function useShell(): ShellContextValue {
  const ctx = useContext(ShellContext)
  if (!ctx) throw new Error('useShell must be used inside <AppShell>')
  return ctx
}
