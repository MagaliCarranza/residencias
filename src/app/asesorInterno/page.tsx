'use client'
import { useEffect, useState } from 'react'
import { db } from '@/firebase/config'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  ClipboardDocumentCheckIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline'

export default function AsesorInternoPage() {
  const { userData, loading, isRole } = useAuth()
  const router = useRouter()
  const [residentes, setResidentes] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!isRole('asesor interno')) {
        router.push('/')
      }
    }
  }, [loading, userData, isRole])

  useEffect(() => {
    const fetchResidentesAsignados = async () => {
      if (!userData?.uid) return
      try {
        const q = query(
          collection(db, "usuarios"), 
          where("rol", "==", "residente"),
          where("asesorInternoId", "==", userData.uid)
        )
        const querySnapshot = await getDocs(q)
        const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setResidentes(lista)
      } catch (error) {
        console.error("Error al cargar residentes:", error)
      } finally {
        setFetching(false)
      }
    }

    if (userData?.uid) fetchResidentesAsignados()
  }, [userData])

  if (loading || fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ito-azul"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Cargando lista de residentes...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-in fade-in duration-700 space-y-8">
    
      <header className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-ito-azul/10 p-3 rounded-2xl">
            <AcademicCapIcon className="w-10 h-10 text-ito-azul" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Panel de Asesor Interno</h1>
            <p className="text-slate-500 font-medium">Bienvenido, Prof. {userData?.nombre}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-center bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumnos Asignados</p>
            <span className="text-2xl font-black text-ito-azul">{residentes.length}</span>
          </div>
        </div>
      </header>

      {/* SECCIÓN DE RESIDENTES */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <UserGroupIcon className="w-6 h-6 text-slate-400" />
          <h2 className="text-xl font-bold text-slate-700">Mis Residentes</h2>
        </div>

        {residentes.length > 0 ? (
          <div className="grid gap-4">
            {residentes.map((residente) => (
              <div 
                key={residente.id} 
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-ito-azul/30 hover:shadow-md transition-all group flex flex-col md:flex-row justify-between items-center gap-4 text-black"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 group-hover:bg-ito-azul group-hover:text-white transition-colors">
                    {residente.nombre.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{residente.nombre}</h3>
                    <p className="text-xs text-slate-500">{residente.numeroControl} • {residente.carrera}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  {/* Badge de Estatus del Alumno */}
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Estatus del Proceso</span>
                    <span className="bg-green-50 text-green-700 text-[10px] font-black px-3 py-1 rounded-full border border-green-100">
                      EN RESIDENCIA
                    </span>
                  </div>

                  {/* Botón de Acción */}
                  <button className="flex items-center gap-2 bg-slate-50 hover:bg-ito-azul hover:text-white text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-100">
                    <ClipboardDocumentCheckIcon className="w-4 h-4" />
                    Ver Expediente
                    <ChevronRightIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white py-16 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-4">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <UserGroupIcon className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No tienes residentes asignados</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Cuando el Jefe de Departamento te asigne alumnos, aparecerán en este listado para su seguimiento.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}