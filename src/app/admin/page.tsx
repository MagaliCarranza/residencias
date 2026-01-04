'use client'
import { useEffect, useState } from 'react'
import { db } from '@/firebase/config'
import { collection, getDocs, addDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'


export default function AdminPage() {
  
  const { userData, loading, isRole } = useAuth()
  const router = useRouter()
  
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [periodos, setPeriodos] = useState<any[]>([])
  const [proyectos, setProyectos] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  // Estados para formularios
  const [nuevoPeriodo, setNuevoPeriodo] = useState('')
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', rol: 'residente', carrera: 'Sistemas' })

  useEffect(() => {
    if (!loading && !isRole('admin')) {
      router.push('/')
    }
  }, [loading, userData, router, isRole])

  useEffect(() => {
    const fetchData = async () => {
      if (!isRole('admin')) return
      try {
        const userSnap = await getDocs(collection(db, "usuarios"))
        setUsuarios(userSnap.docs.map(d => ({ id: d.id, ...d.data() })))

        const perSnap = await getDocs(query(collection(db, "periodos"), orderBy("nombre", "desc")))
        setPeriodos(perSnap.docs.map(d => ({ id: d.id, ...d.data() })))

        const projSnap = await getDocs(collection(db, "proyectos"))
        setProyectos(projSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (error) {
        console.error("Error en carga administrativa:", error)
      } finally {
        setFetching(false)
      }
    }
    if (!loading && isRole('admin')) fetchData()
  }, [loading, isRole])

  if (loading || (fetching && isRole('admin'))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ito-azul"></div>
        <p className="mt-4 text-slate-600 font-medium tracking-tight">Cargando consola administrativa...</p>
      </div>
    )
  }

  if (!isRole('admin')) return null

  // --- FUNCIONES ADMINISTRATIVAS ---

  const handleCrearPeriodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoPeriodo) return
    try {
      await addDoc(collection(db, "periodos"), {
        nombre: nuevoPeriodo,
        activo: false
      })
      alert("Periodo creado con éxito")
      setNuevoPeriodo('')
      window.location.reload()
    } catch (error) {
      alert("Error al crear periodo")
    }
  }

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "usuarios"), {
        ...nuevoUsuario,
        estatusAcademico: { creditos80: false, servicioSocial: false }
      })
      alert("Registro administrativo creado con éxito")
      window.location.reload()
    } catch (error) {
      alert("Error al crear usuario")
    }
  }

  const togglePeriodo = async (id: string, estadoActual: boolean) => {
    const perRef = doc(db, "periodos", id)
    await updateDoc(perRef, { activo: !estadoActual })
    setPeriodos(periodos.map(p => p.id === id ? { ...p, activo: !estadoActual } : p))
  }

  const descargarReporte = () => {
    // Simulación de generación de reporte CSV/Excel
    const residentes = usuarios.filter(u => u.rol === 'residente')
    const headers = "Nombre,Email,NoControl,Creditos,ServicioSocial,Asesor\n"
    const rows = residentes.map(u => 
      `${u.nombre},${u.email},${u.numeroControl},${u.estatusAcademico?.creditos80 ? 'SI' : 'NO'},${u.estatusAcademico?.servicioSocial ? 'SI' : 'NO'},${u.asesorInterno || 'PENDIENTE'}`
    ).join("\n")
    
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', `reporte_residencias_${new Date().toLocaleDateString()}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 text-slate-800">
      {/* HEADER INSTITUCIONAL */}
      <div className="flex justify-between items-end border-b-4 border-ito-dorado pb-4">
        <div>
          <h1 className="text-3xl font-black text-ito-azul uppercase tracking-tighter">Panel de Control</h1>
          <p className="text-sm font-bold text-slate-500 uppercase">Administración General de Residencias</p>
        </div>
        <button 
          onClick={descargarReporte}
          className="bg-green-700 text-white px-6 py-2 rounded-lg font-bold text-xs hover:bg-green-800 transition uppercase tracking-widest shadow-md"
        >
          Generar Reporte de Alumnos CSV
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: CONFIGURACIONES */}
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-black mb-4 text-ito-azul uppercase tracking-widest">Ciclos Escolares</h2>
            <form onSubmit={handleCrearPeriodo} className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={nuevoPeriodo}
                placeholder="Nombre del periodo" 
                className="flex-1 text-xs border-slate-200"
                onChange={e => setNuevoPeriodo(e.target.value)}
              />
              <button className="bg-ito-azul text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-ito-dorado transition">Añadir</button>
            </form>
            <div className="space-y-2">
              {periodos.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 text-black">
                  <span className="text-xs font-bold">{p.nombre}</span>
                  <button 
                    onClick={() => togglePeriodo(p.id, p.activo)}
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${p.activo ? 'bg-green-600 text-white' : 'bg-slate-300 text-slate-600'}`}
                  >
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-black mb-4 text-ito-azul uppercase tracking-widest">Alta de Personal</h2>
            <form onSubmit={handleCrearUsuario} className="space-y-3">
              <input type="text" placeholder="Nombre completo" className="w-full text-xs" 
                onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})} required />
              <input type="email" placeholder="Correo" className="w-full text-xs" 
                onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})} required />
              <select className="w-full text-xs text-black" onChange={e => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}>
                <option value="residente">Residente</option>
                <option value="jefe-division">Jefe de División</option>
                <option value="jefe-departamento">Jefe de Departamento</option>
              </select>
              <button className="w-full bg-slate-800 text-white py-2 rounded-lg text-xs font-bold hover:bg-ito-azul transition uppercase tracking-widest">Registrar Usuario</button>
            </form>
          </section>
        </div>

        {/* COLUMNA DERECHA: MONITOREO */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-sm font-black text-ito-azul uppercase tracking-widest">Directorio General</h2>
              <span className="text-[10px] font-bold text-slate-400">{usuarios.length} Usuarios</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-tighter border-b">
                  <tr>
                    <th className="p-4">Nombre</th>
                    <th className="p-4 text-center">Rol</th>
                    <th className="p-4 text-center">Estado Académico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-black">
                  {usuarios.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold">{u.nombre}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                          u.rol === 'admin' ? 'bg-purple-100 text-purple-700' :
                          u.rol === 'jefe-division' ? 'bg-amber-100 text-amber-700' :
                          u.rol === 'residente' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100'
                        }`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.rol === 'residente' ? (
                          <div className="flex justify-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-slate-200" style={{backgroundColor: u.estatusAcademico?.creditos80 ? '#22c55e' : '#cbd5e1'}} title="Créditos"></div>
                            <div className="h-2 w-2 rounded-full bg-slate-200" style={{backgroundColor: u.estatusAcademico?.servicioSocial ? '#22c55e' : '#cbd5e1'}} title="Servicio"></div>
                            <div className="h-2 w-2 rounded-full bg-slate-200" style={{backgroundColor: u.asesorInterno ? '#22c55e' : '#cbd5e1'}} title="Asesor"></div>
                          </div>
                        ) : <p className="text-center text-slate-300">---</p>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-black mb-4 text-ito-azul uppercase tracking-widest">Proyectos en el Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {proyectos.map(p => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-black">
                  <div>
                    <p className="text-xs font-bold">{p.titulo}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{p.empresa}</p>
                  </div>
                  <span className="text-[9px] font-black text-ito-dorado bg-white px-2 py-1 rounded-md border border-slate-200 uppercase">{p.carrera}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}