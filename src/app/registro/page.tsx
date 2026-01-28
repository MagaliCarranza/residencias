'use client'
import { useState } from 'react'
import { auth, db } from '@/firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
// 1. Importamos serverTimestamp
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

export default function RegistroPage() {
  const [formData, setFormData] = useState({ 
    nombre: '', 
    control: '', 
    carrera: '', 
    email: '', 
    pass: '', 
    confirmPass: '',
    rol: 'alumno' 
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.pass !== formData.confirmPass) {
      setError("Las contraseñas no coinciden.")
      return
    }
    
    setLoading(true)

    try {
      const res = await createUserWithEmailAndPassword(auth, formData.email, formData.pass)

      // 2. Creamos el objeto con serverTimestamp()
      const userProfile: any = {
        nombre: formData.nombre,
        rol: formData.rol,
        email: formData.email,
        fechaRegistro: serverTimestamp() // Genera la fecha oficial del servidor
      }

      if (formData.rol === 'alumno') {
        userProfile.numeroControl = formData.control
        userProfile.carrera = formData.carrera
        userProfile.estatusAcademico = { creditos80: false, servicioSocial: false }
      } else {
        userProfile.departamento = formData.carrera 
      }

      await setDoc(doc(db, "usuarios", res.user.uid), userProfile)

      router.push(formData.rol === 'alumno' ? '/residente' : '/asesorInterno')
      
    } catch (err: any) {
      setLoading(false)
      console.error(err)
      setError("Error al crear la cuenta. Inténtalo de nuevo.")
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-ito-azul uppercase tracking-tighter">
            Registro de {formData.rol === 'alumno' ? 'Alumno' : 'Asesor Interno'}
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Plataforma de Residencias</p>
        </div>

        {/* Selector de Rol */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => setFormData({...formData, rol: 'alumno'})}
            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${formData.rol === 'alumno' ? 'bg-white shadow-sm text-ito-azul' : 'text-slate-500'}`}
          >Alumno</button>
          <button 
            type="button"
            onClick={() => setFormData({...formData, rol: 'asesor interno'})}
            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${formData.rol === 'asesor interno' ? 'bg-white shadow-sm text-ito-azul' : 'text-slate-500'}`}
          >Asesor Interno</button>
        </div>

        <form onSubmit={handleRegistro} className="space-y-5">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <p className="text-[11px] font-bold text-red-700 leading-tight">{error}</p>
            </div>
          )}

          <div className={`grid grid-cols-1 ${formData.rol === 'alumno' ? 'md:grid-cols-2' : ''} gap-4 text-black`}>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Nombre Completo</label>
              <input 
                type="text" 
                className="w-full text-sm border-slate-200" 
                onChange={e => setFormData({...formData, nombre: e.target.value})} 
                required 
              />
            </div>
            
            {formData.rol === 'alumno' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Número de Control</label>
                <input 
                  type="text" 
                  className="w-full text-sm border-slate-200" 
                  onChange={e => setFormData({...formData, control: e.target.value})} 
                  required 
                />
              </div>
            )}
          </div>

          <div className="space-y-1 text-black">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
              {formData.rol === 'alumno' ? 'Carrera' : 'Departamento Adscrito'}
            </label>
            <select 
              className="w-full text-sm border-slate-200 bg-white" 
              onChange={e => setFormData({...formData, carrera: e.target.value})} 
              required
            >
              <option value="">Selecciona...</option>
              <option value="Sistemas Computacionales">Sistemas Computacionales</option>
              <option value="Gestion Empresarial">Gestión Empresarial</option>
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

          <div className="space-y-1 text-black">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Correo</label>
            <input 
              type="email" 
              className="w-full text-sm border-slate-200" 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Contraseña</label>
              <input 
                type="password" 
                className="w-full text-sm border-slate-200" 
                onChange={e => setFormData({...formData, pass: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Confirmar</label>
              <input 
                type="password" 
                className="w-full text-sm border-slate-200" 
                onChange={e => setFormData({...formData, confirmPass: e.target.value})} 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-ito-azul hover:bg-ito-dorado text-white py-3 mt-4 font-black uppercase tracking-widest text-xs flex justify-center items-center gap-2 rounded-lg transition-all"
          >
            {loading ? 'Procesando...' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}