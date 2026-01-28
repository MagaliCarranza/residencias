'use client'
import { useEffect, useState } from 'react'
import { db } from '@/firebase/config'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { useAuth } from '@/contexts/auth-context' 
import { useRouter } from 'next/navigation'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface AlumnoResidente {
  id: string;
  nombre: string;
  numeroControl: string;
  carrera: string;
  asesorAsignado: boolean; 
  asesorInternoId?: string; 
  estatusAcademico?: {
    creditos80: boolean;
    servicioSocial: boolean;
    complementarias: boolean;
  };
}

export default function JefeDivisionPage() {
  const { userData, loading, isRole } = useAuth()
  const router = useRouter()
  
  const [alumnos, setAlumnos] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  const ROL_AUTORIZADO = 'jefe division de estudios'

  const estaAprobadoTotal = (a: any) => 
    a.estatusAcademico?.creditos80 === true && 
    a.estatusAcademico?.servicioSocial === true && 
    a.estatusAcademico?.complementarias === true;

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

  
  const alumnosPorCarrera = alumnos.reduce((acc: any, alumno) => {
    const carrera = alumno.carrera || 'Sin Carrera'
    if (!acc[carrera]) acc[carrera] = []
    acc[carrera].push(alumno)
    return acc
  }, {})

  const generarPDF = async () => {
    let fechaReal = new Date().toLocaleDateString(); 
    try {

    const response = await fetch('https://worldtimeapi.org/api/timezone/America/Mexico_City');
    const data = await response.json();
      fechaReal = new Date(data.datetime).toLocaleDateString('es-MX');
    } catch (error) {
      console.error("No se pudo obtener la fecha real, usando fecha local como respaldo.");
    }
    const doc = new jsPDF()
    const totalGeneralAprobados = alumnos.filter(estaAprobadoTotal).length;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text('Reporte de Candidatos Aprobados', 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha Oficial: ${fechaReal}`, 14, 28);
    
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL GENERAL DE ALUMNOS APROBADOS: ${totalGeneralAprobados}`, 14, 35);
    doc.line(14, 37, 200, 37);

    let finalY = 45;

    Object.keys(alumnosPorCarrera).forEach((carrera) => {
      const aprobadosCarrera = alumnosPorCarrera[carrera].filter(estaAprobadoTotal);

      if (aprobadosCarrera.length > 0) {
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(28, 53, 94); 
        
        const textoCarrera = `${carrera.toUpperCase()} (${aprobadosCarrera.length} Aprobados)`;
        doc.text(textoCarrera, 14, finalY + 5);
        
        autoTable(doc, {
          startY: finalY + 10,
          head: [['Nombre', 'No. Control', 'Estatus Asesor']], 
          body: aprobadosCarrera.map((a: AlumnoResidente) => [
            a.nombre, 
            a.numeroControl, 
            a.asesorAsignado ? 'ASIGNADO' : 'PENDIENTE' 
          ]),
          headStyles: { fillColor: [28, 53, 94] },
          theme: 'striped',
          margin: { left: 14 }
        });

        finalY = (doc as any).lastAutoTable.finalY + 15;

        if (finalY > 250) {
          doc.addPage();
          finalY = 20;
        }
      }
    });

    doc.save(`aprobados_residencia_ito_${new Date().getTime()}.pdf`);
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
          <h1 className="text-3xl font-black text-ito-azul uppercase tracking-tighter">División de Estudios Profesionales</h1>
          <div className="flex gap-4 mt-2">
            <button 
              onClick={generarPDF}
              className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] px-4 py-2 rounded-lg font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6V4.414L14.586 8H11z" />
              </svg>
              Aprobados
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
        const totalAprobados = alumnosPorCarrera[carrera].filter(estaAprobadoTotal).length;

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
                    <th className="p-4">Información Residente</th>
                    <th className="p-4">Estatus Asesor</th>
                    <th className="p-4 text-center">80% de Créditos</th>
                    <th className="p-4 text-center">Servicio Social</th>
                    <th className="p-4 text-center">Act. Complementarias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alumnosPorCarrera[carrera].map((alumno: any) => (
                    <tr key={alumno.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-700 text-sm">{alumno.nombre}</p>
                        <p className="text-[10px] text-ito-dorado font-black font-mono">{alumno.numeroControl}</p>
                      </td>
                      
                      <td className="p-4">
                        {alumno.asesorAsignado ? (
                          <div className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 w-fit">
                            ASIGNADO
                          </div>
                        ) : (
                          <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200 w-fit">
                            PENDIENTE
                          </div>
                        )}
                      </td>

                      {/* Botones de Validación Dinámicos */}
                      {['creditos80', 'servicioSocial', 'complementarias'].map((campo) => (
                        <td key={campo} className="p-4 text-center">
                          <button 
                            onClick={() => toggleValidacion(alumno.id, campo, alumno.estatusAcademico?.[campo])}
                            className={`w-28 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${
                              alumno.estatusAcademico?.[campo] 
                                ? 'bg-green-600 text-white shadow-sm' 
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {alumno.estatusAcademico?.[campo] ? 'APROBADO' : 'APROBAR'}
                          </button>
                        </td>
                      ))}
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