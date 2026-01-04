'use client'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { CheckCircleIcon, ClockIcon, LockClosedIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function ResidentePage() {
  const { userData, loading, isRole } = useAuth()
  const router = useRouter()

  // 1. SEGURIDAD: Redirigir si no es un alumno/residente logueado
  useEffect(() => {
    if (!loading && !isRole('residente')) {
      router.push('/unauthorized')
    }
  }, [loading, userData, router, isRole])

  // 2. ESTADO DE CARGA: Mientras se recupera el perfil de Firestore
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ito-azul"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Cargando tu progreso académico...</p>
      </div>
    )
  }

  if (!isRole('residente')) return null

  // Lógica de pasos basada en los campos reales de tu Firestore
  const pasos = [
    {
      id: 1,
      titulo: 'Validación de Requisitos',
      descripcion: 'Revisión de 80% créditos y Servicio Social por División de Estudios.',
      estado: userData?.estatusAcademico?.creditos80 && userData?.estatusAcademico?.servicioSocial ? 'completado' : 'en-progreso'
    },
    {
      id: 2,
      titulo: 'Selección de Proyecto',
      descripcion: 'Elección de proyecto del Banco o registro de propuesta propia.',
      estado: userData?.estatusAcademico?.creditos80 && userData?.estatusAcademico?.servicioSocial 
        ? (userData?.proyectoId || userData?.proyectoPropuesto ? 'completado' : 'en-progreso') 
        : 'bloqueado'
    },
    {
      id: 3,
      titulo: 'Asignación de Asesor',
      descripcion: 'El Departamento Académico asigna a tu asesor interno una vez validado el proyecto.',
      estado: userData?.asesorInterno ? 'completado' : (userData?.proyectoId || userData?.proyectoPropuesto ? 'en-progreso' : 'bloqueado')
    }
  ]

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in duration-700">
      <header className="mb-12 text-center">
        <div className="inline-block bg-ito-azul/5 px-4 py-1 rounded-full mb-4">
          <p className="text-[10px] font-bold text-ito-azul uppercase tracking-widest">
            Número de Control: {userData?.numeroControl}
          </p>
        </div>
        <h1 className="text-3xl font-extrabold text-ito-azul">Mi Progreso de Residencia</h1>
        <p className="text-slate-500 mt-2 font-medium">Hola, {userData?.nombre}. Sigue el estado de tu proceso.</p>
      </header>

      <div className="relative">
        {/* Línea vertical de fondo */}
        <div className="absolute left-8 top-0 h-full w-0.5 bg-slate-200 hidden md:block"></div>

        <div className="space-y-12">
          {pasos.map((paso) => (
            <div key={paso.id} className="relative flex items-start group">
              
              <div className={`flex-shrink-0 w-16 h-16 rounded-full border-4 border-white flex items-center justify-center z-10 transition-all duration-500 shadow-sm ${
                paso.estado === 'completado' ? 'bg-green-100' : 
                paso.estado === 'en-progreso' ? 'bg-blue-100 animate-pulse' : 'bg-slate-100'
              }`}>
                {paso.estado === 'completado' && <CheckCircleIcon className="w-8 h-8 text-green-600" />}
                {paso.estado === 'en-progreso' && <ClockIcon className="w-8 h-8 text-ito-azul" />}
                {paso.estado === 'bloqueado' && <LockClosedIcon className="w-7 h-7 text-slate-400" />}
              </div>

              {/* Contenido del Paso */}
              <div className={`ml-6 p-6 rounded-2xl border flex-1 transition-all ${
                paso.estado === 'bloqueado' ? 'bg-slate-50/50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-lg font-bold ${paso.estado === 'bloqueado' ? 'text-slate-400' : 'text-ito-azul'}`}>
                    {paso.id}. {paso.titulo}
                  </h3>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border ${
                    paso.estado === 'completado' ? 'bg-green-50 text-green-700 border-green-200' : 
                    paso.estado === 'en-progreso' ? 'bg-blue-50 text-ito-azul border-blue-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    {paso.estado.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{paso.descripcion}</p>

                {/* Botones de acción dinámicos */}
                {paso.id === 2 && paso.estado === 'en-progreso' && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href="/residente/banco" className="btn-ito text-[11px] uppercase tracking-wider">
                      Explorar Banco
                    </Link>
                    <Link href="/residente/propuesta" className="border-2 border-ito-azul text-ito-azul font-bold px-4 py-2 rounded-lg text-[11px] uppercase tracking-wider hover:bg-ito-azul hover:text-white transition-all">
                      Subir Propuesta Propia
                    </Link>
                  </div>
                )}
                
                {paso.id === 3 && paso.estado === 'completado' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3">
                    <div className="bg-green-600 p-2 rounded-lg">
                      <CheckCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest leading-none mb-1">Asesor Interno Asignado</p>
                      <p className="text-sm text-green-900 font-black">{userData?.asesorInterno}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}