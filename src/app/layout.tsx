// src/app/layout.tsx
import { AuthProvider } from '@/contexts/auth-context'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/footer/footer'
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {/* 2. Agregamos flex y flex-col para que el footer siempre se vaya al fondo */}
      <body className="bg-ito-gris min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />   
          {/* 3. flex-grow hace que el contenido ocupe el espacio disponible */}
          <main className="flex-grow">
            {children}
          </main>
          <Footer /> {/* 4. Componente con mayúscula */}
        </AuthProvider>
      </body>
    </html>
  )
}