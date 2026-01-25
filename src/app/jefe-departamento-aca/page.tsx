'use client'
import { useEffect, useState, useMemo } from 'react'
import { db } from '@/firebase/config'
import { collection, getDocs, addDoc, doc, updateDoc, query, where, deleteDoc } from 'firebase/firestore'
import { useAuth } from '@/contexts/auth-context' 
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ProyectoForm {
  titulo: string;
  empresa: string;
  carrera: string;
  descripcion: string;
  tipo: string;
}
const ModalEdicion = ({ proyecto, setProyecto, onSave, onClose, onDelete }: any) => {
  if (!proyecto) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in duration-200">
        <div className="bg-ito-azul p-4 flex justify-between items-center text-white">
          <h2 className="font-bold">Editar Proyecto</h2>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={onSave} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Título del Proyecto</label>
            <input type="text" className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-ito-azul outline-none" 
              value={proyecto.titulo || ''} 
              onChange={e => setProyecto({...proyecto, titulo: e.target.value})} required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Estatus</label>
              <select className="w-full border rounded-lg p-2 text-sm bg-slate-50" 
                value={proyecto.estatus || 'disponible'} 
                onChange={e => setProyecto({...proyecto, estatus: e.target.value})}>
                <option value="disponible">DISPONIBLE</option>
                <option value="asignado">ASIGNADO</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Carrera</label>
              <select className="w-full border rounded-lg p-2 text-sm bg-slate-50" 
                value={proyecto.carrera || 'Sistemas'} 
                onChange={e => setProyecto({...proyecto, carrera: e.target.value})}>
                <option value="Sistemas Computacionales">Sistemas Computacionales</option>
                <option value="Gestion Empresarial">Gestión Empresarial</option>
                <option value="Civil">Civil</option>
                <option value="Industrial">Industrial</option>
                <option value="Quimica">Química</option>
                <option value="Mecanica">Mecánica</option>
                <option value="Electronica">Electrónica</option>
                <option value="Electrica">Eléctrica</option>
                <option value="Administracion">Administración</option>
                <option value="Contaduria">Contaduría Pública</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Descripción</label>
            <textarea className="w-full border rounded-lg p-2 text-sm h-32 resize-none" 
              value={proyecto.descripcion || ''} 
              onChange={e => setProyecto({...proyecto, descripcion: e.target.value})} />
          </div>

        </form>
      </div>
    </div>
  );
};
const ModalEdicionAsesor = ({ asesor, setAsesor, onSave, onClose, onDelete }: any) => {
  if (!asesor) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in duration-200">
        <div className="bg-ito-azul p-4 flex justify-between items-center text-white">
          <h2 className="font-bold">Editar Asesor Interno</h2>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={onSave} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre Completo</label>
            <input type="text" className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-ito-azul outline-none text-black" 
              value={asesor.nombre || ''} 
              onChange={e => setAsesor({...asesor, nombre: e.target.value})} required />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Correo Institucional</label>
            <input type="email" className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-ito-azul outline-none text-black" 
              value={asesor.email || ''} 
              onChange={e => setAsesor({...asesor, email: e.target.value})} required />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Departamento</label>
            <select className="w-full border rounded-lg p-2 text-sm bg-slate-50 text-black" 
              value={asesor.departamento || ''} 
              onChange={e => setAsesor({...asesor, departamento: e.target.value})}>
              <option value="Sistemas Computacionales">Sistemas Computacionales</option>
              <option value="Gestion Empresarial">Gestión Empresarial</option>
              <option value="Civil">Civil</option>
              <option value="Industrial">Industrial</option>
              <option value="Quimica">Química</option>
              <option value="Mecanica">Mecánica</option>
              <option value="Electronica">Electrónica</option>
              <option value="Electrica">Eléctrica</option>
              <option value="Administracion">Administración</option>
              <option value="Contaduria">Contaduría Pública</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t">
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg transition-colors">Cancelar</button>
              <button type="submit" className="flex-2 bg-ito-azul text-white py-2 px-6 rounded-lg font-bold shadow-lg hover:bg-blue-900 transition-all">Guardar Cambios</button>
            </div>
            <button 
              type="button" 
              onClick={() => onDelete('usuarios', asesor.id)}
              className="mt-2 text-[10px] text-red-400 hover:text-red-600 font-bold uppercase tracking-widest transition-colors"
            >
              Eliminar Permanentemente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default function JefeDepartamentoPage() {
  const { userData, loading, isRole } = useAuth()
  const router = useRouter()

  const [proyectos, setProyectos] = useState<any[]>([])
  const [alumnosValidados, setAlumnosValidados] = useState<any[]>([])
  const [nuevoProyecto, setNuevoProyecto] = useState<ProyectoForm>({ 
    titulo: '', empresa: '', carrera: 'Sistemas', descripcion: '', tipo: '' 
  })
  const [fetching, setFetching] = useState(true)
  const [proyectoAEditar, setProyectoAEditar] = useState<any | null>(null);
  const [tabActiva, setTabActiva] = useState('proyectos'); 
  const [asesoresDisponibles, setAsesoresDisponibles] = useState<any[]>([]);
  const [nuevoAsesor, setNuevoAsesor] = useState({ nombre: '', email: '', departamento: '' });
  const [asesorAEditar, setAsesorAEditar] = useState<any | null>(null);
  // Estados de Filtros
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroOrigen, setFiltroOrigen] = useState('todos')
  const [filtroCarrera, setFiltroCarrera] = useState('todos')
  const [filtroEstatus, setFiltroEstatus] = useState('todos')
  
  // PROTECCIÓN DE RUTA
  useEffect(() => {
    if (!loading && !isRole('jefe departamento academico')) {
      router.push('/')
    }
  }, [loading, userData, router, isRole])

  // CARGA DE DATOS
  const fetchData = async () => {
    if (!isRole('jefe departamento academico')) return
    try {
      // Obtener proyectos actuales
      const projSnap = await getDocs(collection(db, "proyectos"))
      let listaProyectos = projSnap.docs.map(d => ({ id: d.id, ...d.data() }))

      // Con ordenamiento
      listaProyectos.sort((a: any, b: any) => {
        // Convertir los formatos de fecha
        const fechaA = a.fechaCreacion?.seconds ? a.fechaCreacion.seconds * 1000 : new Date(a.fechaCreacion).getTime();
        const fechaB = b.fechaCreacion?.seconds ? b.fechaCreacion.seconds * 1000 : new Date(b.fechaCreacion).getTime();
        
        // Restar B - A para que el número más grande (más reciente) quede al principio
        return fechaB - fechaA;
      });

      // Guardar la lista ya ordenada en el estado
      setProyectos(listaProyectos)

      const q = query(collection(db, "usuarios"), where("rol", "==", "residente"))
      const userSnap = await getDocs(q)
      const validados = userSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((u: any) => u.estatusAcademico?.creditos80 && u.estatusAcademico?.servicioSocial)
      setAlumnosValidados(validados)

      const qAsesores = query(
      collection(db, "usuarios"), 
      where("rol", "==", "asesor interno")
    );
    const asesorSnap = await getDocs(qAsesores);
    const listaAsesores = asesorSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    setAsesoresDisponibles(listaAsesores);
    } catch (error) {
      console.error("Error al cargar datos:", error)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    if (!loading && isRole('jefe departamento academico')) {
      fetchData()
    }
  }, [loading, isRole])
  const formatearFecha = (fecha: any) => {
    if (!fecha) return 'Sin fecha';
    // Si viene de Firebase Timestamp
    const d = fecha.seconds ? new Date(fecha.seconds * 1000) : new Date(fecha);
    return d.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // --- LÓGICA DE FILTRADO ---
  const proyectosFiltrados = useMemo(() => {
    return proyectos.filter(p => {
      const coincideBusqueda = (p.titulo?.toLowerCase() || "").includes(busqueda.toLowerCase()) || 
                               (p.empresa?.toLowerCase() || "").includes(busqueda.toLowerCase());
      const coincideTipo = filtroTipo === 'todos' || p.tipo === filtroTipo;
      const coincideOrigen = filtroOrigen === 'todos' || p.origen === filtroOrigen;
      const coincideCarrera = filtroCarrera === 'todos' || p.carrera === filtroCarrera;
      const coincideEstatus = filtroEstatus === 'todos' || p.estatus === filtroEstatus;

      return coincideBusqueda && coincideTipo && coincideOrigen && coincideCarrera && coincideEstatus;
    });
  }, [proyectos, busqueda, filtroTipo, filtroOrigen, filtroCarrera, filtroEstatus]);
  
  //FUNCION PARA ACTUALIZAR PROYECTO
  const handleUpdateSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proyectoAEditar?.id) return;

    try {
      const ref = doc(db, "proyectos", proyectoAEditar.id);
      await updateDoc(ref, {
        titulo: proyectoAEditar.titulo,
        descripcion: proyectoAEditar.descripcion,
        carrera: proyectoAEditar.carrera,
        estatus: proyectoAEditar.estatus
      });
      alert("Proyecto actualizado correctamente");
      setProyectoAEditar(null);
      fetchData();
    } catch (err) {
      alert("Error al actualizar");
    }
  };

  // --- FUNCIÓN DE ELIMINAR ---
  const handleEliminarCualquiera = async (coleccion: string, id: string) => {
    if (!id) return;
    if (!confirm(`¿Eliminar permanentemente?`)) return;
    try {
      await deleteDoc(doc(db, coleccion, id));
      alert("Eliminado con éxito");
      setProyectoAEditar(null); // Limpia proyecto
      setAsesorAEditar(null);   // Limpia asesor (Asegúrate de tener esta línea)
      fetchData();
    } catch (err) { alert("Error al eliminar"); }
  };

  // Función para guardar los cambios del Asesor
  const handleUpdateAsesor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asesorAEditar?.id) return;
    try {
      const ref = doc(db, "usuarios", asesorAEditar.id);
      await updateDoc(ref, {
        nombre: asesorAEditar.nombre,
        email: asesorAEditar.email,
        departamento: asesorAEditar.departamento
      });
      alert("Asesor actualizado correctamente");
      setAsesorAEditar(null);
      fetchData();
    } catch (err) {
      alert("Error al actualizar asesor");
    }
  };
  
  //FUNCION PARA CREA ASESOR INTERNO
  const handleCrearAsesor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "usuarios"), {
        ...nuevoAsesor,
        rol: 'asesor interno',
        fechaRegistro: new Date().toISOString(),
      });
      alert("Asesor registrado en el sistema");
      setNuevoAsesor({ nombre: '', email: '', departamento: 'Sistemas Computacionales' });
      fetchData(); 
    } catch (err) {
      alert("Error al registrar asesor");
    }
  };
  //ACTUALIZAR ASESOR
  const handleUpdate = async (e: React.FormEvent, coleccion: string, data: any, callback: any) => {
    e.preventDefault();
    try {
      const { id, ...datosSinId } = data;
      await updateDoc(doc(db, coleccion, id), datosSinId);
      alert("Actualizado correctamente");
      callback(null);
      fetchData();
    } catch (err) { alert("Error al actualizar") }
  };
  //ASIGNAR ASESOR INTERNO A RESIDENTE
  const asignarAsesorAAlumno = async (alumnoId: string, asesorId: string) => {
    if (!asesorId) return;
    try {
      const alumnoRef = doc(db, "usuarios", alumnoId);
      await updateDoc(alumnoRef, { 
        asesorInternoId: asesorId,
        asesorAsignado: true 
      });
      alert("Asesor vinculado correctamente.");
      fetchData(); 
    } catch (err) {
      console.error(err);
      alert("Error al vincular el asesor");
    }
  };
  
  const handleCrearProyecto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoProyecto.carrera) return alert("Por favor, selecciona una carrera")
    if (!nuevoProyecto.tipo) return alert("Selecciona un tipo")

    try {
      await addDoc(collection(db, "proyectos"), {
        ...nuevoProyecto,
        origen: 'banco',
        estatus: 'disponible',
        fechaCreacion: new Date()
      })
      alert("Proyecto agregado al Banco")
      setNuevoProyecto({ titulo: '', empresa: '', carrera: '', descripcion: '', tipo: '' })
      fetchData() 
    } catch (err) { alert("Error al crear") }
  }

  

  const exportarPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Proyectos en el Banco ITO OAXACA", 14, 15)
    doc.setFontSize(10)
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 22)

    const tableRows = proyectosFiltrados.map(p => [
      p.titulo,
      p.empresa,
      p.tipo?.toUpperCase() || 'N/A',
      p.origen?.toUpperCase() || 'PROPUESTA',
      p.carrera,
      formatearFecha(p.fechaCreacion), 
      p.estatus?.toUpperCase()
    ]);

    autoTable(doc, {
      head: [['Título del Proyecto', 'Empresa', 'Tipo', 'Origen', 'Carrera','Fecha', 'Estatus']],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [26, 54, 93] }
    })

    doc.save("banco_proyectos_ito.pdf")
  }

  if (loading || (fetching && isRole('jefe departamento academico'))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ito-azul"></div>
        <p className="mt-4 text-sm text-slate-500">Cargando gestión académica...</p>
      </div>
    )
  }


  if (!isRole('jefe departamento academico')) return null

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="border-b pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestión Académica</h1>
          <p className="text-sm text-slate-500 uppercase font-semibold italic">Panel del Jefe de Departamento</p>
        </div>
        <button 
          onClick={exportarPDF}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Relación de Proyectos</span>
        </button>
      </header>
      
     
      <div className="flex gap-8 border-b border-slate-200">
        <button onClick={() => setTabActiva('proyectos')} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${tabActiva === 'proyectos' ? 'border-b-2 border-ito-azul text-ito-azul' : 'text-slate-400'}`}>Proyectos y Alumnos</button>
        <button onClick={() => setTabActiva('asesores')} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${tabActiva === 'asesores' ? 'border-b-2 border-ito-azul text-ito-azul' : 'text-slate-400'}`}>Asesores Internos</button>
      </div>
      {tabActiva === 'proyectos' ? (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="grid lg:grid-cols-3 gap-8"> 
            <section className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-slate-200 h-fit text-black">
              <h2 className="text-xl font-bold mb-4 text-ito-azul">Nuevo Proyecto</h2>
              
              <form onSubmit={handleCrearProyecto} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Título del Proyecto</label>
                  <input 
                    type="text" 
                    placeholder="Nombre del proyecto" 
                    className="w-full text-sm border p-2 rounded focus:ring-2 focus:ring-ito-azul outline-none" 
                    value={nuevoProyecto.titulo} 
                    onChange={e => setNuevoProyecto({...nuevoProyecto, titulo: e.target.value})} 
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Descripción Breve</label>
                  <textarea 
                    placeholder="Detalles de las actividades..." 
                    className="w-full text-sm border p-2 rounded h-24 resize-none focus:ring-2 focus:ring-ito-azul outline-none" 
                    value={nuevoProyecto.descripcion} 
                    onChange={e => setNuevoProyecto({...nuevoProyecto, descripcion: e.target.value})} 
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Empresa u Organización</label>
                  <input 
                    type="text" 
                    placeholder="Nombre de la instancia" 
                    className="w-full text-sm border p-2 rounded focus:ring-2 focus:ring-ito-azul outline-none" 
                    value={nuevoProyecto.empresa} 
                    onChange={e => setNuevoProyecto({...nuevoProyecto, empresa: e.target.value})} 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Carrera</label>
                    <select 
                      className="w-full text-[11px] border p-2 rounded bg-white focus:ring-2 focus:ring-ito-azul outline-none" 
                      value={nuevoProyecto.carrera} 
                      onChange={e => setNuevoProyecto({...nuevoProyecto, carrera: e.target.value})} 
                      required
                    >
                      <option value="">Selecciona...</option>
                      <option value="Sistemas Computacionales">Sistemas</option>
                      <option value="Gestion Empresarial">Gestión</option>
                      <option value="Civil">Civil</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Quimica">Química</option>
                      <option value="Mecanica">Mecánica</option>
                      <option value="Electronica">Electrónica</option>
                      <option value="Electrica">Eléctrica</option>
                      <option value="Administracion">Administración</option>
                      <option value="Contaduria">Contaduría</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo</label>
                    <select 
                      className="w-full text-[11px] border p-2 rounded bg-white focus:ring-2 focus:ring-ito-azul outline-none" 
                      value={nuevoProyecto.tipo} 
                      onChange={e => setNuevoProyecto({...nuevoProyecto, tipo: e.target.value})} 
                      required
                    >
                      <option value="">Tipo...</option>
                      <option value="interno">Interno</option>
                      <option value="externo">Externo</option>
                    </select>
                  </div>
                </div>

                <button className="w-full bg-ito-azul text-white py-2.5 rounded-lg font-bold uppercase text-xs shadow-md hover:bg-blue-900 transition-all mt-2">
                  Publicar en Banco
                </button>
              </form>
            </section>

          </div>

          <section className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-800">Proyectos</h2>
                <span className="bg-ito-azul/10 text-ito-azul px-3 py-1 rounded-full text-xs font-bold">
                  {proyectosFiltrados.length} encontrados
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:flex flex-wrap gap-2 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Buscar título/empresa..." 
                  className="col-span-2 text-sm border p-2 rounded-md md:w-64"
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <select className="text-xs border p-2 rounded-md" onChange={(e) => setFiltroTipo(e.target.value)}>
                  <option value="todos">Cualquier Tipo</option>
                  <option value="interno">Interno</option>
                  <option value="externo">Externo</option>
                </select>
                <select className="text-xs border p-2 rounded-md" onChange={(e) => setFiltroOrigen(e.target.value)}>
                  <option value="todos">Cualquier Origen</option>
                  <option value="banco">Banco</option>
                  <option value="propuesta propia">Propuesta Alumno</option>
                </select>
                <select className="text-xs border p-2 rounded-md" onChange={(e) => setFiltroCarrera(e.target.value)}>
                  <option value="todos">Cualquier Carrera</option>
                  <option value="Sistemas">Sistemas</option>
                  <option value="Gestion">Gestión</option>
                  <option value="Industrial">Industrial</option>
                </select>
                <select className="text-xs border p-2 rounded-md" onChange={(e) => setFiltroEstatus(e.target.value)}>
                  <option value="todos">Cualquier Estatus</option>
                  <option value="disponible">Disponible</option>
                  <option value="asignado">Asignado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {proyectosFiltrados.map(p => (
                <div key={p.id} className="group p-5 border-t-4 border-ito-azul bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 relative">
                  <span className="text-[9px] text-slate-400 font-bold italic">
                    Publicado: {formatearFecha(p.fechaCreacion)}
                  </span>
                  
                  <span className={`absolute -top-3 left-4 text-[9px] font-black px-3 py-1 rounded-full border shadow-sm ${p.origen === 'banco' ? 'bg-blue-600 text-white border-blue-600' : 'bg-amber-400 text-white border-amber-400'}`}>
                    {p.origen?.toUpperCase() || 'BANCO'}
                  </span>

                  {/* GRUPO DE BOTONES */}
                  <div className="absolute top-2 right-2 flex gap-1 z-10">
                    {/* BOTÓN EDITAR */}
                    <button 
                      onClick={() => setProyectoAEditar(p)}
                      className="bg-slate-100 hover:bg-ito-azul hover:text-white p-1.5 rounded-lg border shadow-sm transition-all text-slate-400"
                      title="Editar Proyecto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>

                    {/* BOTÓN ELIMINAR DIRECTO */}
                    <button 
                      onClick={() => handleEliminarCualquiera('proyectos', p.id)}
                      className="bg-slate-100 hover:bg-red-600 hover:text-white p-1.5 rounded-lg border shadow-sm transition-all text-slate-400"
                      title="Eliminar Proyecto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{p.empresa}</p>
                    <h3 className="font-bold text-slate-800 leading-tight h-12 overflow-hidden line-clamp-2 group-hover:text-ito-azul transition-colors">
                      {p.titulo}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-3 mb-4 h-12 italic">
                    {p.descripcion || "Sin descripción disponible..."}
                  </p>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-ito-dorado">{p.carrera}</span>
                      <span className="text-[9px] text-slate-400 uppercase">{p.tipo}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${p.estatus === 'disponible' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>
                      {p.estatus?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      ) : (
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 text-black">
        {/* FILA SUPERIOR: Formulario y Plantilla con proporciones originales */}
        <div className="grid lg:grid-cols-3 gap-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
              <h2 className="text-lg font-bold mb-4 text-ito-azul">Nuevo Asesor Interno</h2>
              
              <form onSubmit={handleCrearAsesor} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre Completo</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Juan Pérez López" 
                    className="w-full text-sm border p-2 rounded focus:ring-2 focus:ring-ito-azul outline-none text-black" 
                    value={nuevoAsesor.nombre} 
                    onChange={e => setNuevoAsesor({...nuevoAsesor, nombre: e.target.value})} 
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correo</label>
                  <input 
                    type="email" 
                    placeholder="correo@gmail.com" 
                    className="w-full text-sm border p-2 rounded focus:ring-2 focus:ring-ito-azul outline-none text-black" 
                    value={nuevoAsesor.email} 
                    onChange={e => setNuevoAsesor({...nuevoAsesor, email: e.target.value})} 
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departamento Académico</label>
                  <select 
                    className="w-full text-sm border p-2 rounded bg-white focus:ring-2 focus:ring-ito-azul outline-none text-black" 
                    value={nuevoAsesor.departamento} 
                    onChange={e => setNuevoAsesor({...nuevoAsesor, departamento: e.target.value})} 
                    required
                  >
                    <option value="">Selecciona un departamento...</option>
                    <option value="Sistemas Computacionales">Sistemas Computacionales</option>
                    <option value="Gestion Empresarial">Gestión Empresarial</option>
                    <option value="Civil">Civil</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Quimica">Química</option>
                    <option value="Mecanica">Mecánica</option>
                    <option value="Electronica">Electrónica</option>
                    <option value="Electrica">Eléctrica</option>
                    <option value="Administracion">Administración</option>
                    <option value="Contaduria">Contaduría Pública</option>
                  </select>
                </div>

                <button className="w-full bg-ito-azul text-white py-2.5 rounded-lg font-bold uppercase text-xs shadow-md hover:bg-blue-900 transition-all mt-2">
                  Registrar Asesor
                </button>
              </form>
            </section>
            <section className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-4">Plantilla de Asesores</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {asesoresDisponibles.map(as => (
                  <div key={as.id} className="p-4 border rounded-xl bg-slate-50 flex items-center justify-between group">
                    <div>
                      <p className="font-bold text-sm text-black">{as.nombre}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{as.departamento || 'Sin Depto.'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setAsesorAEditar(as)}
                        className="text-slate-400 hover:text-ito-azul transition-colors"
                        title="Editar Asesor"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleEliminarCualquiera('usuarios', as.id)} 
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          <section className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 w-full overflow-hidden">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-800">Asignación de Asesores</h2>
                <p className="text-sm text-slate-500">Residentes con 80% créditos y Servicio Social liberado.</p>
              </div>
              <div className="bg-ito-azul/5 px-6 py-3 rounded-xl border border-ito-azul/10 text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Residentes</p>
                <span className="text-3xl font-black text-ito-azul">{alumnosValidados.length}</span>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
                    <th className="pb-4 px-8 w-[35%]">Información del Residente</th>
                    <th className="pb-4 px-8 text-center w-[20%]">Estatus Académico</th>
                    <th className="pb-4 px-8 w-[20%]">Asesor Designado</th>
                    <th className="pb-4 px-8 text-center w-[25%]">Asignación</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnosValidados.map(alumno => (
                    <tr key={alumno.id} className="bg-white hover:bg-slate-50 border-y border-slate-100 shadow-sm transition-all duration-300 group">
                      <td className="py-6 px-8 rounded-l-2xl border-l border-y border-slate-100">
                        <p className="font-black text-slate-800 text-lg uppercase">{alumno.nombre}</p>
                        <p className="text-xs font-bold text-ito-dorado">{alumno.carrera} | {alumno.email}</p>
                      </td>
                      <td className="py-6 px-8 border-y border-slate-100 text-center">
                        <div className="flex justify-center gap-2">
                          <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-2 py-1 rounded border border-blue-100 italic">CRÉDITOS ✓</span>
                          <span className="bg-purple-50 text-purple-700 text-[9px] font-black px-2 py-1 rounded border border-purple-100 italic">SERVICIO ✓</span>
                        </div>
                      </td>
                      <td className="py-6 px-8 border-y border-slate-100">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-md border ${alumno.asesorAsignado ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {alumno.asesorAsignado ? '✓ ASIGNADO' : '● PENDIENTE'}
                        </span>
                        {alumno.asesorAsignado && (
                          <p className="text-sm text-slate-700 font-bold mt-2 uppercase">
                            {asesoresDisponibles.find(a => a.id === alumno.asesorInternoId)?.nombre}
                          </p>
                        )}
                      </td>
                      <td className="py-6 px-8 rounded-r-2xl border-r border-y border-slate-100">
                        <select 
                          className="w-full text-xs font-bold border border-slate-200 rounded-xl p-3 bg-slate-50 focus:ring-4 focus:ring-ito-azul/10 focus:border-ito-azul outline-none"
                          value={alumno.asesorInternoId || ""}
                          onChange={(e) => asignarAsesorAAlumno(alumno.id, e.target.value)}
                        >
                          <option value="">Asignar...-</option>
                          {asesoresDisponibles.map(as => <option key={as.id} value={as.id}>{as.nombre}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          
        </div>
        

      )}
      
      <ModalEdicion proyecto={proyectoAEditar} setProyecto={setProyectoAEditar} onSave={handleUpdateSave} onClose={() => setProyectoAEditar(null)} onDelete={handleEliminarCualquiera} />
      <ModalEdicionAsesor 
      asesor={asesorAEditar} 
      setAsesor={setAsesorAEditar} 
      onSave={handleUpdateAsesor} 
      onClose={() => setAsesorAEditar(null)} 
      onDelete={handleEliminarCualquiera} />
    </div>
  )
}