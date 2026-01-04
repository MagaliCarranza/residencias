'use client'
import { useState, useEffect } from 'react'
import { db } from '@/firebase/config'
import { collection, getDocs, query, where } from 'firebase/firestore'

export default function BancoProyectos() {
  const [proyectos, setProyectos] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    const fetchProyectos = async () => {
      const q = query(collection(db, "proyectos"), where("estatus", "==", "disponible"))
      const snap = await getDocs(q)
      setProyectos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    fetchProyectos()
  }, [])

  const filtrados = proyectos.filter(p => 
    p.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.empresa.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ito-azul mb-6">Banco de Proyectos Institucional</h1>
      <input 
        type="text" 
        placeholder="Buscar por proyecto o empresa..." 
        className="w-full mb-8 p-3 border rounded-xl shadow-sm"
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="grid md:grid-cols-2 gap-6">
        {filtrados.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-ito-dorado transition">
            <h3 className="font-bold text-ito-azul text-lg">{p.titulo}</h3>
            <p className="text-slate-600 text-sm mb-4">{p.empresa}</p>
            <button className="btn-ito text-xs w-full">Postularme para este Proyecto</button>
          </div>
        ))}
      </div>
    </div>
  )
}