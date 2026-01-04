'use client'
import { useRouter } from "next/navigation"
import Image from "next/image"

export function HeaderPrincipal() {
  const router = useRouter()

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-ito-dorado shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => router.push("/")}>
            <div className="flex gap-2 bg-white p-1 rounded-lg">
              <Image src="/logos/logotecNM.png" alt="TecNM" width={35} height={35} />
              <Image src="/logos/ItoLogo.png" alt="ITO" width={35} height={35} />
            </div>
            <div className="flex flex-col border-l pl-4 border-slate-200">
              <h1 className="text-sm font-bold text-ito-azul leading-tight">TecNM Campus Oaxaca</h1>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Excelencia Académica</p>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}