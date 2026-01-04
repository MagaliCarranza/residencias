'use client'
import Link from 'next/link'
import { 
  ClipboardDocumentCheckIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="relative h-[500px] flex items-center justify-center text-white overflow-hidden rounded-3xl mt-4">
        <div className="absolute inset-0 bg-[#1e355e] z-0">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#b89032] rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Residencias Profesionales <br />
            <span className="text-[#b89032]">TecNM Campus Oaxaca</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 font-light">
            Plataforma oficial para la gestión, seguimiento y validación del proceso de residencia profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-[#b89032] hover:bg-[#d4ac0d] text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg">
              Iniciar Sesión
            </Link>
            <Link href="/registro" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full font-bold transition-all">
              Registrarme
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1e355e]">¿Cómo funciona el proceso?</h2>
          <div className="h-1 w-20 bg-[#b89032] mx-auto mt-4"></div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <StepCard 
            Icon={ClipboardDocumentCheckIcon}
            title="1. Validación"
            desc="División de Estudios verifica tu 80% de créditos y Servicio Social."
          />
          <StepCard 
            Icon={BuildingOfficeIcon}
            title="2. Selección"
            desc="Eliges un proyecto del Banco de Proyectos o propones uno propio."
          />
          <StepCard 
            Icon={UserGroupIcon}
            title="3. Asignación"
            desc="La Academia te asigna un Asesor Interno para guiar tu proyecto."
          />
          <StepCard 
            Icon={DocumentTextIcon}
            title="4. Dictamen"
            desc="Entrega de reportes y evaluación final para tu liberación."
          />
        </div>
      </section>

      <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:row gap-8 items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#1e355e] mb-2">¿Eres Jefe de Área o Docente?</h3>
          <p className="text-slate-600 max-w-md">
            Accede con tus credenciales institucionales para gestionar validaciones, proyectos y asesorías.
          </p>
        </div>
        <Link href="/login" className="text-[#1e355e] font-bold border-2 border-[#1e355e] px-6 py-2 rounded-lg hover:bg-[#1e355e] hover:text-white transition-all">
          Acceso Administrativo
        </Link>
      </section>
    </div>
  )
}

function StepCard({ Icon, title, desc }: { Icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-center">
      <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-[#1e355e]" />
      </div>
      <h4 className="font-bold text-[#1e355e] mb-2">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}