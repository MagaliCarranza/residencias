'use client'
import { useState } from 'react'
import { auth, db } from '@/firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

export default function RegistroPage() {
  const [formData, setFormData] = useState({ 
    nombre: '', control: '', carrera: '', email: '', pass: '', confirmPass: '' 
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validaciones básicas
    if (formData.pass !== formData.confirmPass) {
      setError("Las contraseñas no coinciden.")
      return
    }
    if (formData.pass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    setLoading(true)

    try {
      // 1. Crear usuario en Auth
      const res = await createUserWithEmailAndPassword(auth, formData.email, formData.pass)

      // 2. Crear perfil en Firestore
      await setDoc(doc(db, "usuarios", res.user.uid), {
        nombre: formData.nombre,
        numeroControl: formData.control,
        carrera: formData.carrera,
        rol: 'residente',
        email: formData.email,
        estatusAcademico: { 
          creditos80: false, 
          servicioSocial: false 
        },
        fechaRegistro: new Date().toISOString()
      })

      router.push('/residente')
    } catch (err: any) {
      setLoading(false)
      if (err.code === 'auth/email-already-in-use') {
        setError("Este correo ya está registrado en la plataforma.")
      } else if (err.code === 'auth/invalid-email') {
        setError("El formato del correo electrónico no es válido.")
      } else {
        setError("Ocurrió un error al crear la cuenta. Inténtalo de nuevo.")
      }
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-ito-azul uppercase tracking-tighter">Registro de Alumno</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Residencias</p>
        </div>

        <form onSubmit={handleRegistro} className="space-y-5">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded animate-in fade-in">
              <p className="text-[11px] font-bold text-red-700 leading-tight">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Nombre Completo</label>
              <input 
                type="text" 
                placeholder="Nombre Apellidos"
                className="w-full text-sm border-slate-200" 
                onChange={e => setFormData({...formData, nombre: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Número de Control</label>
              <input 
                type="text" 
                placeholder="8 dígitos"
                className="w-full text-sm border-slate-200" 
                onChange={e => setFormData({...formData, control: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="space-y-1 text-black">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Carrera</label>
            <select 
              className="w-full text-sm border-slate-200 bg-white" 
              onChange={e => setFormData({...formData, carrera: e.target.value})} 
              required
            >
              <option value="">Selecciona tu programa académico</option>
              <option value="Ing. en Sistemas Computacionales">Ing. en Sistemas Computacionales</option>
              <option value="Ing. en Gestión Empresarial">Ing. en Gestión Empresarial</option>
              <option value="Ing. Industrial">Ing. Industrial</option>
              <option value="Ing. Química">Ing. Química</option>
              <option value="Ing. Química">Ing. Mecánica</option>
              <option value="Ing. Química">Ing. Electrónica</option>
              <option value="Ing. Química">Ing. Eléctrica</option>
            </select>
          </div>

          <div className="space-y-1 text-black">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Correo Institucional</label>
            <input 
              type="email" 
              placeholder="alumno@oaxaca.tecnm.mx"
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
                placeholder="••••••••"
                className="w-full text-sm border-slate-200" 
                onChange={e => setFormData({...formData, pass: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Confirmar Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full text-sm border-slate-200" 
                onChange={e => setFormData({...formData, confirmPass: e.target.value})} 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full btn-ito py-3 mt-4 font-black uppercase tracking-widest text-xs flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Registrando...</span>
              </>
            ) : 'Crear Cuenta'}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">¿Ya tienes una cuenta registrada?</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-2 text-ito-azul font-black text-xs uppercase tracking-widest hover:text-ito-dorado transition-colors"
          >
            Inicia Sesión Aquí
          </button>
        </div>
      </div>
    </div>
  )
}