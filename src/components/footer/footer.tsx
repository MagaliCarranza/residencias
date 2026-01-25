"use client"

import { Twitter, Facebook, Mail, Phone, MapPin, Globe } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#1e355e] text-white mt-auto border-t-4 border-[#b89032]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/*Logo e Identidad */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              {/* Asegúrate de tener esta imagen en public/logos/ItoLogo.png */}
              <div className="bg-white p-1 rounded-full">
                <Image
                  src="/logos/ItoLogo.png" 
                  alt="Logo ITO"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">Instituto Tecnológico de Oaxaca</h3>
                <p className="text-[10px] text-[#b89032] font-bold uppercase tracking-wider">TECNOLÓGICO NACIONAL DE MÉXICO</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed italic">
              "Tecnología propia, e independencia económica de México"
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-[#b89032] uppercase">Residencias</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Lineamientos TecNM</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Banco de Proyectos</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Calendario de Entrega</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-[#b89032] uppercase">Contacto</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#b89032] shrink-0" />
                <span className="text-gray-300">Av. Ing. Víctor Bravo Ahuja No. 125, Oaxaca.</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#b89032]" />
                <span className="text-gray-300">(951) 501-5016</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#b89032]" />
                <span className="text-gray-300">residencias@oaxaca.tecnm.mx</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-[#b89032] uppercase">Síguenos</h4>
            <div className="flex space-x-3 mb-6">
              <a href="#" className="p-2 border border-gray-500 rounded-full hover:bg-[#b89032] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-gray-500 rounded-full hover:bg-[#b89032] transition-all">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
            <a href="https://www.oaxaca.tecnm.mx/" target="_blank" className="flex items-center gap-2 text-xs text-gray-300 hover:text-white">
              <Globe className="w-4 h-4 text-[#b89032]" />
              <span>oaxaca.tecnm.mx</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col md:row justify-between items-center text-[10px] text-gray-400">
          <p>© {new Date().getFullYear()} Instituto Tecnológico de Oaxaca. Plataforma de Residencias Profesionales.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
             <span>Aviso de Privacidad</span>
             <span>Términos</span>
          </div>
        </div>
      </div>
    </footer>
  )
}