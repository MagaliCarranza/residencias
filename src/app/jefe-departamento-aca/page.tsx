'use client'
import { useEffect, useState } from 'react'
import { db } from '@/firebase/config'
import { collection, getDocs, addDoc, doc, updateDoc, query, where } from 'firebase/firestore'
import { useAuth } from '@/contexts/auth-context' // Importamos seguridad
import { useRouter } from 'next/navigation'

export default function JefeDepartamentoPage() {
  const { userData, loading, isRole } = useAuth()
  const router = useRouter()

  const [proyectos, setProyectos] = useState<any[]>([])
  const [alumnosValidados, setAlumnosValidados] = useState<any[]>([])
  const [nuevoProyecto, setNuevoProyecto] = useState({ titulo: '', empresa: '', carrera: 'Sistemas' })
  const [fetching, setFetching] = useState(true)

  // 1. PROTECCIÓN DE RUTA
  useEffect(() => {
    if (!loading && !isRole('jefe departamento academico')) {
      router.push('/unauthorized')
    }
  }, [loading, userData, router, isRole])

  // 2. CARGA DE DATOS CONDICIONAL
  useEffect(() => {
    const fetchData = async () => {
      if (!isRole('jefe departamento academico')) return

      try {
        // Obtener proyectos actuales
        const projSnap = await getDocs(collection(db, "proyectos"))
        setProyectos(projSnap.docs.map(d => ({ id: d.id, ...d.data() })))

        // Obtener solo alumnos validados por División
        const q = query(collection(db, "usuarios"), where("rol", "==", "residente"))
        const userSnap = await getDocs(q)
        const validados = userSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter((u: any) => u.estatusAcademico?.creditos80 && u.estatusAcademico?.servicioSocial)
        setAlumnosValidados(validados)
      } catch (error) {
        console.error("Error al cargar datos académicos:", error)
      } finally {
        setFetching(false)
      }
    }

    if (!loading && isRole('jefe departamento academico')) {
      fetchData()
    }
  }, [loading, isRole])

  // 3. MANEJO DE ESTADOS DE CARGA (Para que el Header no parpadee)
  if (loading || (fetching && isRole('jefe departamento academico'))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ito-azul"></div>
        <p className="mt-4 text-sm text-slate-500">Cargando gestión académica...</p>
      </div>
    )
  }

  if (!isRole('jefe departamento academico')) return null

  // --- FUNCIONES DE ACCIÓN ---
  const handleCrearProyecto = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "proyectos"), {
        ...nuevoProyecto,
        tipo: 'Banco',
        estatus: 'disponible'
      })
      alert("Proyecto agregado al Banco")
      window.location.reload()
    } catch (err) {
      alert("Error al crear proyecto")
    }
  }

  const asignarAsesor = async (alumnoId: string, nombreAsesor: string) => {
    if (!nombreAsesor) return
    try {
      const userRef = doc(db, "usuarios", alumnoId)
      await updateDoc(userRef, {
        asesorInterno: nombreAsesor,
        faseActual: "Asesor Asignado"
      })
      alert("Asesor asignado correctamente")
      // Actualización local para evitar recarga
      setAlumnosValidados(alumnosValidados.map(a => 
        a.id === alumnoId ? { ...a, asesorInterno: nombreAsesor } : a
      ))
    } catch (err) {
      alert("Error al asignar asesor")
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="border-b pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestión Académica</h1>
          <p className="text-sm text-slate-500 uppercase font-semibold">Jefe de Departamento</p>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* FORMULARIO: ALTA DE PROYECTOS */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-ito-azul">Crear Nuevo Proyecto (Banco)</h2>
          <form onSubmit={handleCrearProyecto} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Título</label>
              <input type="text" placeholder="Nombre del proyecto" className="w-full" 
                onChange={e => setNuevoProyecto({...nuevoProyecto, titulo: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Empresa</label>
              <input type="text" placeholder="Institución receptora" className="w-full" 
                onChange={e => setNuevoProyecto({...nuevoProyecto, empresa: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Carrera Destino</label>
              <select className="w-full" onChange={e => setNuevoProyecto({...nuevoProyecto, carrera: e.target.value})}>
                <option value="Sistemas">Ing. en Sistemas Computacionales</option>
                <option value="Gestion">Ing. en Gestión Empresarial</option>
                <option value="Industrial">Ing. Industrial</option>
              </select>
            </div>
            <button className="w-full btn-ito py-2">Publicar en Banco</button>
          </form>
        </section>

        {/* ASIGNACIÓN DE ASESORES */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-green-700">Asignación de Asesores</h2>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {alumnosValidados.length === 0 && (
              <p className="text-sm italic text-slate-400 p-4 border rounded border-dashed text-center">
                No hay alumnos pendientes de asesoría.
              </p>
            )}
            {alumnosValidados.map(alumno => (
              <div key={alumno.id} className="p-4 border rounded-lg bg-slate-50 flex justify-between items-center hover:bg-white transition-colors">
                <div>
                  <p className="font-bold text-sm text-slate-800">{alumno.nombre}</p>
                  <p className="text-[10px] text-ito-dorado font-bold">{alumno.numeroControl}</p>
                </div>
                <select 
                  className="text-xs border p-2 rounded-lg bg-white"
                  onChange={(e) => asignarAsesor(alumno.id, e.target.value)}
                  defaultValue={alumno.asesorInterno || ""}
                >
                  <option value="" disabled>Seleccionar Asesor...</option>
                  <option value="Ing. Juan López">Ing. Juan López</option>
                  <option value="M.C. Erika Ruiz">M.C. Erika Ruiz</option>
                  <option value="Dr. Carlos Méndez">Dr. Carlos Méndez</option>
                </select>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* TABLA DE PROYECTOS ACTUALES */}
      <section className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-xl font-bold mb-6 flex justify-between items-center">
          <span>Banco de Proyectos Actual</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{proyectos.length} Registros</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {proyectos.map(p => (
            <div key={p.id} className="p-4 border-l-4 border-ito-azul bg-slate-50 rounded shadow-sm hover:shadow-md transition-shadow">
              <p className="font-bold text-sm text-slate-800 h-10 overflow-hidden line-clamp-2">{p.titulo}</p>
              <p className="text-xs text-slate-500 mt-1">{p.empresa}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[9px] uppercase font-bold text-ito-dorado bg-ito-azul/5 px-2 py-1 rounded">{p.carrera}</span>
                <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest">{p.estatus}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}