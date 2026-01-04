'use client'
import { useState } from 'react'
import { auth, db } from '@/firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { ROLE_ROUTES } from '@/config/routes-config' 

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState<string | null>(null) 
  const [loading, setLoading] = useState(false) 
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await signInWithEmailAndPassword(auth, email, pass)
      const userDoc = await getDoc(doc(db, "usuarios", res.user.uid))
      
      if (userDoc.exists()) {
        // Obtenemos el rol y lo normalizamos (minúsculas y sin espacios extra)
        const rol = userDoc.data().rol.toLowerCase().trim()
        
        // Buscamos la ruta en nuestro objeto de configuración ROLE_ROUTES
        // Si el rol no existe en el mapa, por defecto lo mandamos a /residente
        const destination = ROLE_ROUTES[rol as keyof typeof ROLE_ROUTES] || '/residente'
        
        router.push(destination)
      } else {
        setError("El usuario no tiene un perfil configurado en el sistema.")
        setLoading(false)
      }
    } catch (err: any) {
      setLoading(false)
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError("Correo o contraseña incorrectos. Por favor, verifica tus datos.")
      } else {
        setError("Error de conexión. Inténtalo de nuevo más tarde.")
      }
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-ito-azul uppercase tracking-tighter text-black">Acceso</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plataforma de Residencias</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded shadow-sm animate-in fade-in slide-in-from-top-1">
              <p className="text-[11px] font-bold text-red-700 leading-tight">
                {error}
              </p>
            </div>
          )}

          <div className="space-y-1 text-black">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Correo Institucional</label>
            <input 
              type="email" 
              placeholder="ejemplo@oaxaca.tecnm.mx" 
              className="w-full text-sm border-slate-200 focus:border-ito-dorado transition-all rounded-lg p-2" 
              onChange={e => setEmail(e.target.value)} 
              required
            />
          </div>

          <div className="space-y-1 text-black">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full text-sm border-slate-200 focus:border-ito-dorado transition-all rounded-lg p-2" 
              onChange={e => setPass(e.target.value)} 
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-ito-azul hover:bg-ito-dorado text-white py-3 mt-4 flex justify-center items-center gap-2 rounded-lg font-bold transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Validando...</span>
              </>
            ) : 'Ingresar al Sistema'}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            ¿Eres alumno y no tienes cuenta?
          </p>
          <button 
            onClick={() => router.push('/registro')}
            className="mt-2 text-ito-azul font-black text-xs uppercase tracking-widest hover:text-ito-dorado transition-colors"
          >
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  )
}