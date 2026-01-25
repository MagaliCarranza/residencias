export default function BancoProyectos() {
  const proyectosEjemplo = [
    { id: 1, titulo: "Sistema de Control de Inventarios IoT", empresa: "Logística Global", area: "Sistemas" },
    { id: 2, titulo: "Desarrollo de App Móvil para Gestión Médica", empresa: "Hospital Civil", area: "Informática" },
    { id: 3, titulo: "Análisis de Datos con Python y PowerBI", empresa: "Financiera del Norte", area: "Sistemas" },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-black text-ito-azul uppercase tracking-tighter mb-2">Banco de Proyectos</h1>
      <p className="text-slate-500 text-sm mb-8 font-medium italic">Proyectos disponibles para el periodo actual.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {proyectosEjemplo.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-ito-dorado transition-all">
            <div className="flex justify-between mb-4">
              <span className="bg-blue-100 text-ito-azul text-[9px] font-black px-2 py-1 rounded-md uppercase">{p.area}</span>
              <span className="text-green-600 text-[9px] font-black uppercase tracking-widest">Disponible</span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{p.titulo}</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">{p.empresa}</p>
            <button className="w-full py-3 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl group-hover:bg-ito-azul transition-colors">
              Postularme al Proyecto
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}