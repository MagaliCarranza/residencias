'use client'
import { useAuth } from '@/contexts/auth-context'
import { HeaderPrincipal } from './headers/HeaderPrincipal'
import { HeaderLogueado } from './headers/HeaderLogueado'
import { usePathname } from 'next/navigation'

export const Navbar = () => {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  const rutasPublicas = ['/', '/login', '/registro']
  const esRutaPublica = rutasPublicas.includes(pathname)

  if (loading) {
    return <div className="h-20 bg-white border-b animate-pulse" />
  }

  
  if (!user || esRutaPublica) {
    return <HeaderPrincipal />
  }

  return <HeaderLogueado />
}