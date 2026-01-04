'use client'
import { useState } from 'react'
import { db } from '@/firebase/config'
import { doc, updateDoc } from 'firebase/firestore'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
export default function PropuestaPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Marca de agua decorativa para la maqueta */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-ito-azul/5 rounded-full"></div>
        
        <header className="mb-8">
          <h2 className="text-2xl font-black text-ito-azul uppercase tracking-tight">Dictamen de Anteproyecto</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Formato para Residencia Profesional</p>
        </header>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre del Proyecto</label>
              <input type="text" className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-ito-azul outline-none transition-all" placeholder="Ej. Implementación de un ERP..." />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Empresa</label>
              <input type="text" className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none" placeholder="Nombre de la institución" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Asesor Externo</label>
              <input type="text" className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none" placeholder="Ing. Encargado" />
            </div>
          </div>

          <div className="p-4 bg-ito-azul/5 rounded-2xl border border-ito-azul/10">
            <h4 className="text-[10px] font-black text-ito-azul uppercase mb-2">Resumen del Dictamen</h4>
            <textarea className="w-full bg-transparent border-none text-sm text-slate-600 outline-none resize-none" rows={3} placeholder="Describe brevemente los objetivos del proyecto..."></textarea>
          </div>

          <button className="w-full py-4 bg-ito-azul text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-lg hover:translate-y-[-2px] transition-all">
            Enviar a Revisión Académica
          </button>
        </div>
      </div>
    </div>
  )
}