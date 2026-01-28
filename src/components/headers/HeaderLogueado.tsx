'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, LogOut, User2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { signOut } from "firebase/auth"
import { auth } from "@/firebase/config"

export function HeaderLogueado() {
  const { user, userData, isRole } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
  }

  const getPanelTitle = () => {
    if (isRole("admin")) return "Panel Administrador"
    if (isRole("jefe division de estudios")) return "Panel División de Estudios Profesionales"
    if (isRole("jefe departamento academico")) return "Panel Departamento Académico"
    if (isRole("residente")) return "Panel de Residente"
    if (isRole("alumno")) return "Panel de Alumno"
    if (isRole("asesor interno")) return "Panel de Asesor Interno"
    return "Panel de Usuario"
  }

  return (
    <header className="bg-white text-gray-800 shadow-md border-b-2 border-ito-dorado sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => alert("Menú lateral próximamente")} // Aquí SideMenu 
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-ito-azul">
                Gestión de Residencias Profesionales
              </h1>
              <div className="flex items-center">
                <User2 className="h-3 w-3 mr-1 text-gray-600" />
                <p className="text-[10px] text-gray-500 font-medium">{userData?.nombre || user?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right hidden md:block">
              <h2 className="text-[11px] font-bold text-black uppercase">
                Instituto Tecnológico de Oaxaca
              </h2>
              <p className="text-[10px] text-ito-dorado font-extrabold">{getPanelTitle()}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}