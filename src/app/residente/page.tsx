'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { db, storage } from '@/firebase/config' // exportar storage en  config
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { CheckCircleIcon, ClockIcon, LockClosedIcon, CloudArrowUpIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function ResidentePage() {
  const { userData, loading, isRole } = useAuth()
  const router = useRouter()
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    if (!loading) {
      if (!userData || !['alumno', 'residente'].includes(userData.rol)) {
        router.push('/')
      }
    }
  }, [loading, userData, router])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipoDoc: string) => {
    const file = e.target.files?.[0]
    if (!file || !userData?.uid) return

    setUploading(tipoDoc)
    try {
      //Crear referencia en Storage
      const storageRef = ref(storage, `expedientes/${userData.numeroControl}/${tipoDoc}.pdf`)
      
      // Subir archivo
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      // Actualizar Firestore
      const userRef = doc(db, "usuarios", userData.uid)
      await updateDoc(userRef, {
        [`documentos.${tipoDoc}`]: downloadURL,
        [`estatusAcademico.${tipoDoc}Subido`]: true
      })

      alert("Documento subido con éxito")
    } catch (error) {
      console.error("Error al subir:", error)
      alert("Error al subir el archivo")
    } finally {
      setUploading(null)
    }
  }
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ito-azul"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Cargando tu progreso académico...</p>
      </div>
    )
  }

  if (!['alumno', 'residente'].includes(userData?.rol)) return null
  
  const pasos = [
    {
      id: 1,
      titulo: 'Validación de Requisitos',
      descripcion: 'Sube tu documentación oficial para revisión de División de Estudios Profesionales.',
      estado: userData?.estatusAcademico?.creditos80 && userData?.estatusAcademico?.servicioSocial ? 'completado' : 'en-progreso'
    },
    {
      id: 2,
      titulo: 'Selección de Proyecto',
      descripcion: 'Elección de proyecto del Banco o registro de propuesta propia.',
      estado: userData?.estatusAcademico?.creditos80 && userData?.estatusAcademico?.servicioSocial 
        ? (userData?.proyectoId || userData?.proyectoPropuesto ? 'completado' : 'en-progreso') 
        : 'bloqueado'
    },
    {
      id: 3,
      titulo: 'Asignación de Asesor',
      descripcion: 'El Departamento Académico asigna a tu asesor interno una vez validado el proyecto.',
      estado: userData?.asesorInterno ? 'completado' : (userData?.proyectoId || userData?.proyectoPropuesto ? 'en-progreso' : 'bloqueado')
    }
  ]

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in duration-700">
      <header className="mb-12 text-center">
        <div className="inline-block bg-ito-azul/5 px-4 py-1 rounded-full mb-4">
          <p className="text-[10px] font-bold text-ito-azul uppercase tracking-widest">
            Número de Control: {userData?.numeroControl}
          </p>
        </div>
        <h1 className="text-3xl font-extrabold text-ito-azul">Mi Progreso de Residencia</h1>
        <p className="text-slate-500 mt-2 font-medium">Hola, {userData?.nombre}. Sigue el estado de tu proceso.</p>
      </header>

      <div className="relative">
        {/* Línea vertical de fondo */}
        <div className="absolute left-8 top-0 h-full w-0.5 bg-slate-200 hidden md:block"></div>

        <div className="space-y-12">
          {pasos.map((paso) => (
            <div key={paso.id} className="relative flex items-start group">
              
              <div className={`flex-shrink-0 w-16 h-16 rounded-full border-4 border-white flex items-center justify-center z-10 transition-all duration-500 shadow-sm ${
                paso.estado === 'completado' ? 'bg-green-100' : 
                paso.estado === 'en-progreso' ? 'bg-blue-100 animate-pulse' : 'bg-slate-100'
              }`}>
                {paso.estado === 'completado' && <CheckCircleIcon className="w-8 h-8 text-green-600" />}
                {paso.estado === 'en-progreso' && <ClockIcon className="w-8 h-8 text-ito-azul" />}
                {paso.estado === 'bloqueado' && <LockClosedIcon className="w-7 h-7 text-slate-400" />}
              </div>

              <div className={`ml-6 p-6 rounded-2xl border flex-1 transition-all ${
                paso.estado === 'bloqueado' ? 'bg-slate-50/50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-lg font-bold ${paso.estado === 'bloqueado' ? 'text-slate-400' : 'text-ito-azul'}`}>
                    {paso.id}. {paso.titulo}
                  </h3>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border ${
                    paso.estado === 'completado' ? 'bg-green-50 text-green-700 border-green-200' : 
                    paso.estado === 'en-progreso' ? 'bg-blue-50 text-ito-azul border-blue-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    {paso.estado.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{paso.descripcion}</p>
                {paso.id === 1 && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'servicioSocial', label: 'Servicio Social' },
                        { id: 'actividadesComp', label: 'Act. Complementarias' },
                        { id: 'kardex80', label: 'Kardex (80% Créditos)' }
                      ].map((docItem) => (
                        <div key={docItem.id} className="flex flex-col gap-2">
                          <label className={`relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                            userData?.documentos?.[docItem.id] 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-slate-50 border-slate-200 hover:border-ito-azul'
                          }`}>
                            {/* Indicador de estado */}
                            {uploading === docItem.id ? (
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ito-azul"></div>
                            ) : userData?.documentos?.[docItem.id] ? (
                              <CheckCircleIcon className="w-8 h-8 text-green-600" />
                            ) : (
                              <CloudArrowUpIcon className="w-8 h-8 text-slate-400" />
                            )}
                            
                            <span className="text-[10px] font-black mt-2 text-slate-500 uppercase text-center leading-tight">
                              {docItem.label}
                            </span>

                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".pdf"
                              onChange={(e) => handleFileUpload(e, docItem.id)}
                              disabled={!!uploading}
                            />
                          </label>
                          
                          {userData?.documentos?.[docItem.id] && (
                            <a 
                              href={userData.documentos[docItem.id]} 
                              target="_blank" 
                              className="text-[9px] text-center font-bold text-ito-azul hover:underline uppercase"
                            >
                              Ver documento subido
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-[10px] text-slate-400 italic text-center">
                      Solo se aceptan archivos PDF (Máx. *tamañoMB*)
                    </p>
                  </div>
                )}
                {paso.id === 2 && (
                  <div className="mt-5 space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <Link href="/residente/banco" className="bg-ito-azul text-white px-4 py-2 rounded-lg text-[11px] font-bold uppercase hover:bg-ito-azul/90 transition-all">
                        Explorar Banco
                      </Link>
                      <Link href="/residente/propuesta" className="border-2 border-ito-azul text-ito-azul px-4 py-2 rounded-lg text-[11px] font-bold uppercase hover:bg-ito-azul/5 transition-all">
                        Subir Propuesta
                      </Link>
                    </div>

              
                    <div className="p-4 bg-slate-50 border-l-4 border-ito-dorado rounded-r-xl">
                      <p className="text-[9px] font-black text-ito-dorado uppercase tracking-[0.2em] mb-1">Proyecto Seleccionado</p>
                      <h4 className="text-sm font-bold text-slate-800">Optimización de Redes Neuronales para Clasificación de Datos</h4>
                      <p className="text-xs text-slate-500 font-medium">Empresa: Tech Solutions S.A. de C.V.</p>
                    </div>
                  </div>
                )}
                
                {paso.id === 3 && paso.estado === 'completado' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3">
                    <div className="bg-green-600 p-2 rounded-lg">
                      <CheckCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest leading-none mb-1">Asesor Interno Asignado</p>
                      <p className="text-sm text-green-900 font-black">{userData?.asesorInterno}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}