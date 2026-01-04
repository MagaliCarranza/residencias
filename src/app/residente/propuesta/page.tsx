'use client'
import { useState } from 'react'
import { db } from '@/firebase/config'
import { doc, updateDoc } from 'firebase/firestore'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

export default function PropuestaPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [propuesta, setPropuesta] = useState({ titulo: '', empresa: '', asesorExterno: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // VALIDACIÓN DE SEGURIDAD
    if (!user) {
      alert("Sesión expirada. Por favor inicia sesión de nuevo.")
      router.push('/login')
      return
    }

    try {
      const userRef = doc(db, "usuarios", user.uid)
      await updateDoc(userRef, {
        proyectoPropuesto: propuesta,
        faseActual: "Dictamen en Revisión",
        fechaEntregaDictamen: new Date().toISOString()
      })
      alert("Propuesta y Dictamen enviados a revisión académica.")
      router.push('/residente') // Regresar al dashboard después de enviar
    } catch (error) {
      console.error("Error al subir propuesta:", error)
      alert("Hubo un error al enviar la propuesta.")
    }
  }

  // Mientras el contexto de Firebase está cargando el usuario muestra msj
  if (loading) return <div className="p-10 text-center text-ito-azul">Cargando datos del alumno...</div>

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mt-10">
      <h2 className="text-2xl font-bold text-ito-azul mb-2">Dictamen de Anteproyecto</h2>
      <p className="text-slate-500 text-sm mb-6 font-medium italic">
        Lineamiento TecNM: Entrega de propuesta para validación de la Academia.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Nombre del Proyecto</label>
          <input 
            type="text" 
            className="w-full mt-1 border-slate-200" 
            required 
            placeholder="Ej: Sistema de Gestión de Inventarios"
            onChange={e => setPropuesta({...propuesta, titulo: e.target.value})} 
          />
        </div>
        <div>
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Nombre de la Empresa</label>
          <input 
            type="text" 
            className="w-full mt-1 border-slate-200" 
            required 
            placeholder="Ej: Coca-Cola FEMSA / Depto. Sistemas"
            onChange={e => setPropuesta({...propuesta, empresa: e.target.value})} 
          />
        </div>
        <div>
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Asesor Externo (Propuesto)</label>
          <input 
            type="text" 
            className="w-full mt-1 border-slate-200" 
            required 
            placeholder="Nombre del jefe en la empresa"
            onChange={e => setPropuesta({...propuesta, asesorExterno: e.target.value})} 
          />
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
          <span className="text-xl">📄</span>
          <p className="text-[11px] text-amber-800 leading-tight">
            Al dar clic en enviar, el sistema generará el folio de revisión y notificará al Jefe de Departamento Académico para la asignación de revisores.
          </p>
        </div>

        <button className="btn-ito w-full py-3 shadow-lg shadow-blue-900/20">
          Enviar Propuesta y Dictamen
        </button>
      </form>
    </div>
  )
}