'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'

interface AuthContextType {
  user: User | null
  userData: any | null
  loading: boolean
  isRole: (role: string) => boolean 
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isRole: () => false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // normaliza los textos para evitar errores por espacios o mayúsculas
  const isRole = (role: string) => {
    const rolActual = userData?.rol?.toString().toLowerCase().trim();
    const rolBuscado = role.toLowerCase().trim();
    return rolActual === rolBuscado;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const docRef = doc(db, "usuarios", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData({ uid: currentUser.uid, ...docSnap.data() });
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Error al obtener perfil de usuario:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, isRole }}>
      {/* Evitamos parpadeos de contenido: 
         Mientras loading es true, no renderizamos los componentes hijos 
      */}
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-ito-azul rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-ito-azul uppercase tracking-widest">
              TecNM Campus Oaxaca
            </p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)