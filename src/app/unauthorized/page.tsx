export default function Unauthorized() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <span className="text-8xl mb-4">🚫</span>
      <h1 className="text-4xl font-bold text-ito-azul">Acceso Restringido</h1>
      <p className="text-slate-500 mt-2 max-w-md">
        Lo sentimos, no tienes los permisos necesarios para acceder a esta sección de la plataforma de Residencias Profesionales.
      </p>
      <a href="/" className="mt-6 text-ito-dorado font-bold hover:underline">
        Volver al inicio
      </a>
    </div>
  )
}