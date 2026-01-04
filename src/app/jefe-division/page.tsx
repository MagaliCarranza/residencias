'use client'
import { useEffect, useState } from 'react'
import { db } from '@/firebase/config'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { useAuth } from '@/contexts/auth-context' 
import { useRouter } from 'next/navigation'
// Importaciones para PDF
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function JefeDivisionPage() {
  const { userData, loading, isRole } = useAuth()
  const router = useRouter()
  
  const [alumnos, setAlumnos] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  const ROL_AUTORIZADO = 'jefe division de estudios'

  useEffect(() => {
    if (!loading && !isRole(ROL_AUTORIZADO)) {
      router.push('/')
    }
  }, [loading, userData, router, isRole])

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
    if (!loading && isRole(ROL_AUTORIZADO)) { fetchAlumnos() }
  }, [loading, isRole])

  // --- LÓGICA DE AGRUPACIÓN Y CONTEO ---
  const alumnosPorCarrera = alumnos.reduce((acc: any, alumno) => {
    const carrera = alumno.carrera || 'Sin Carrera'
    if (!acc[carrera]) acc[carrera] = []
    acc[carrera].push(alumno)
    return acc
  }, {})

  const generarPDF = () => {
    const doc = new jsPDF()
    const alumnosAprobados = alumnos.filter(a => 
      a.estatusAcademico?.creditos80 && a.estatusAcademico?.servicioSocial
    )

    doc.setFontSize(18)
    doc.text('Lista de Candidatos Aprobados a Residencia', 14, 20)
    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 28)

    autoTable(doc, {
      startY: 35,
      head: [['Nombre', 'No. Control', 'Carrera']],
      body: alumnosAprobados.map(a => [a.nombre, a.numeroControl, a.carrera || 'N/A']),
      headStyles: { fillColor: [28, 53, 94] } // Color ito-azul aproximado
    })

    doc.save('candidatos_aprobados.pdf')
  }

  const toggleValidacion = async (id: string, campo: string, valorActual: boolean) => {
    try {
      const userRef = doc(db, "usuarios", id)
      await updateDoc(userRef, { [`estatusAcademico.${campo}`]: !valorActual })
      setAlumnos(alumnos.map(a => 
        a.id === id ? { ...a, estatusAcademico: { ...a.estatusAcademico, [campo]: !valorActual } } : a
      ))
    } catch (error) { alert("Error al actualizar") }
  }

  if (loading || (fetching && isRole(ROL_AUTORIZADO))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ito-dorado"></div>
        <p className="mt-4 text-sm text-slate-500 font-bold uppercase tracking-widest">Sincronizando...</p>
      </div>
    )
  }

  if (!isRole(ROL_AUTORIZADO)) return null

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b-4 border-ito-dorado pb-4 text-black">
        <div>
          <h1 className="text-3xl font-black text-ito-azul uppercase tracking-tighter">División de Estudios</h1>
          <div className="flex gap-4 mt-2">
            <button 
              onClick={generarPDF}
              className="bg-red-600 hover:bg-red-700 text-white text-[10px] px-4 py-2 rounded-lg font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6V4.414L14.586 8H11z" /></svg>
              Descargar PDF Aprobados
            </button>
          </div>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Residentes</p>
          <p className="text-xl font-black text-ito-azul leading-none">{alumnos.length}</p>
        </div>
      </header>

      {/* RENDERIZADO POR CARRERA */}
      {Object.keys(alumnosPorCarrera).map((carrera) => {
        const totalAprobados = alumnosPorCarrera[carrera].filter((a: any) => 
          a.estatusAcademico?.creditos80 && a.estatusAcademico?.servicioSocial
        ).length;

        return (
          <section key={carrera} className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-black text-ito-azul uppercase tracking-tight italic">{carrera}</h2>
              <span className="bg-ito-dorado/10 text-ito-dorado text-[10px] font-black px-3 py-1 rounded-full border border-ito-dorado/20">
                {totalAprobados} APROBADOS / {alumnosPorCarrera[carrera].length} TOTAL
              </span>
            </div>
            
            <div className="overflow-hidden bg-white rounded-2xl shadow-lg border border-slate-200">
              <table className="w-full text-left border-collapse text-black">
                <thead>
                  <tr className="bg-ito-azul text-white font-black uppercase text-[10px] tracking-widest">
                    <th className="p-4">Nombre</th>
                    <th className="p-4 text-center">No. Control</th>
                    <th className="p-4 text-center">Créditos Suficientes</th>
                    <th className="p-4 text-center">Servicio Social</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alumnosPorCarrera[carrera].map((alumno: any) => (
                    <tr key={alumno.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-4 font-bold text-slate-700 text-sm">{alumno.nombre}</td>
                      <td className="p-4 font-mono text-xs text-ito-dorado font-black text-center">{alumno.numeroControl}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => toggleValidacion(alumno.id, 'creditos80', alumno.estatusAcademico?.creditos80)}
                          className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                            alumno.estatusAcademico?.creditos80 ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {alumno.estatusAcademico?.creditos80 ? 'APROBADO' : 'APROBAR'}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => toggleValidacion(alumno.id, 'servicioSocial', alumno.estatusAcademico?.servicioSocial)}
                          className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                            alumno.estatusAcademico?.servicioSocial ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {alumno.estatusAcademico?.servicioSocial ? 'APROBADO' : 'APROBAR'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}
    </div>
  )
}