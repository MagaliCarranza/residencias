'use client'
import { useEffect, useState } from 'react'
import { db } from '@/firebase/config'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { useAuth } from '@/contexts/auth-context' 
import { useRouter } from 'next/navigation'

export default function JefeDivisionPage() {
  // Nota: isRole usará el string que definamos abajo para ser consistente
  const { userData, loading, isRole } = useAuth()
  const router = useRouter()
  
  const [alumnos, setAlumnos] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  const ROL_AUTORIZADO = 'jefe division de estudios'

  useEffect(() => {
    if (!loading && !isRole(ROL_AUTORIZADO)) {
      router.push('/unauthorized')
    }
  }, [loading, userData, router, isRole])

  // 2. CARGA DE DATOS
  useEffect(() => {
    const fetchAlumnos = async () => {
      if (!isRole(ROL_AUTORIZADO)) return

      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"))
        const docs = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((u: any) => u.rol === 'residente')
        setAlumnos(docs)
      } catch (error) {
        console.error("Error al cargar alumnos:", error)
      } finally {
        setFetching(false)
      }
    }

    if (!loading && isRole(ROL_AUTORIZADO)) {
      fetchAlumnos()
    }
  }, [loading, isRole])

  if (loading || (fetching && isRole(ROL_AUTORIZADO))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ito-dorado"></div>
        <p className="mt-4 text-sm text-slate-500 font-bold uppercase tracking-widest">
          Sincronizando División de Estudios...
        </p>
      </div>
    )
  }

  if (!isRole(ROL_AUTORIZADO)) return null

  const toggleValidacion = async (id: string, campo: string, valorActual: boolean) => {
    try {
      const userRef = doc(db, "usuarios", id)
      await updateDoc(userRef, {
        [`estatusAcademico.${campo}`]: !valorActual
      })

      setAlumnos(alumnos.map(a => 
        a.id === id 
          ? { ...a, estatusAcademico: { ...a.estatusAcademico, [campo]: !valorActual } } 
          : a
      ))
    } catch (error) {
      alert("Error al actualizar el estatus del alumno")
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b-4 border-ito-dorado pb-4 text-black">
        <div>
          <h1 className="text-3xl font-black text-ito-azul uppercase tracking-tighter">División de Estudios</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
            Validación de Requisitos Académicos (80% Créditos y Servicio)
          </p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Candidatos a Residencia</p>
          <p className="text-xl font-black text-ito-azul text-right leading-none">{alumnos.length}</p>
        </div>
      </header>

      <div className="overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-black">
          <thead>
            <tr className="bg-ito-azul text-white font-black uppercase text-[11px] tracking-widest">
              <th className="p-5">Nombre del Alumno</th>
              <th className="p-5 text-center">No. Control</th>
              <th className="p-5 text-center">Créditos (80%)</th>
              <th className="p-5 text-center">Servicio Social</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {alumnos.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-slate-400 italic font-medium">
                  No se encontraron residentes registrados para validación.
                </td>
              </tr>
            )}
            {alumnos.map((alumno) => (
              <tr key={alumno.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="p-5 font-bold text-slate-700">{alumno.nombre}</td>
                <td className="p-5 font-mono text-sm text-ito-dorado font-black text-center">{alumno.numeroControl}</td>
                
                <td className="p-5 text-center">
                  <button 
                    onClick={() => toggleValidacion(alumno.id, 'creditos80', alumno.estatusAcademico?.creditos80)}
                    className={`min-w-[110px] px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      alumno.estatusAcademico?.creditos80 
                        ? 'bg-green-600 text-white shadow-md' 
                        : 'bg-slate-200 text-slate-500 hover:bg-red-100 hover:text-red-700'
                    }`}
                  >
                    {alumno.estatusAcademico?.creditos80 ? 'Validado' : 'Pendiente'}
                  </button>
                </td>

                <td className="p-5 text-center">
                  <button 
                    onClick={() => toggleValidacion(alumno.id, 'servicioSocial', alumno.estatusAcademico?.servicioSocial)}
                    className={`min-w-[110px] px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      alumno.estatusAcademico?.servicioSocial 
                        ? 'bg-green-600 text-white shadow-md' 
                        : 'bg-slate-200 text-slate-500 hover:bg-red-100 hover:text-red-700'
                    }`}
                  >
                    {alumno.estatusAcademico?.servicioSocial ? 'Validado' : 'Pendiente'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-800 p-5 rounded-2xl flex items-center gap-4 text-white shadow-lg">
        <div className="bg-ito-dorado p-2 rounded-lg">
           <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <p className="text-[11px] font-medium leading-relaxed uppercase tracking-wide opacity-90">
          Nota: Las validaciones realizadas aquí habilitan el módulo de selección de proyectos para el residente en tiempo real.
        </p>
      </div>
    </div>
  )
}