/**
 * Evidence is deliberately separate from implementation and production status.
 * Public content excludes private endpoints, business records and credentials.
 * @typedef {{src:string, alt:string, caption:string}} Evidence
 * @typedef {{slug:string,title:string,category:string,summary:string,problem:string,solution:string,
 * stack:string[],implemented:string[],pending:string[],production:string,status:string,
 * impact:string,flow:string[],source:string,sourceLabel:string,evidence:Evidence[]}} Project
 */
/** @type {Project[]} */
export const projects = [
  {
    slug: "renova-puntos", title: "RENOVA Puntos", category: "FIDELIZACIÓN / INTEGRACIÓN EMPRESARIAL",
    summary: "Del programa de puntos a un proceso conectado con la operación comercial.",
    problem: "La acumulación, el canje y las reversiones necesitan compartir reglas, historial y controles entre las sucursales.",
    solution: "Una plataforma de fidelización con administración web, experiencia móvil y un adaptador de integración con SAP Business One.",
    stack: ["React", "TypeScript", "Vite", "PostgreSQL", "Supabase", ".NET", "SAP B1", "PWA", "AWS"],
    implemented: ["Gestión de clientes, reglas, niveles y recompensas.", "Acumulación, canje y trazabilidad de movimientos.", "Tarjetas digitales y endpoints de identificación NFC.", "Adaptador SAP, conciliación y control de reversiones."],
    pending: ["Aceptación de la conexión con el Add-on SAP y de operaciones contables reales.", "Validación integral de los flujos NFC en los dispositivos de destino."],
    production: "El registro de release del 10 de noviembre de 2026 documenta web y API desplegadas en AWS y verificaciones HTTPS. El acceso público se volvió a comprobar el 19 de noviembre. El release deja la contabilización SAP sin activar.",
    status: "Release documentado", impact: "Centraliza las reglas y el historial del programa. Permite seguir el origen y la reversión de cada movimiento sin depender de registros dispersos.",
    flow: ["Venta", "Reglas de puntos", "Historial", "Canje"],
    source: "", sourceLabel: "Repositorio privado · revisión de código y registro de release",
    evidence: [{src:"/public/evidence/renova-puntos/captura-proporcionada.png",alt:"Panel de fidelización de RENOVA Puntos.",caption:"Captura del panel proporcionada por Gener Suhul. La imagen muestra información de una fecha específica."},{src:"/public/evidence/renova-puntos/acceso-publico.png",alt:"Acceso público real de RENOVA Puntos, programa de fidelización.",caption:"Captura del acceso público de puntos.renovagt.com · 19 nov 2026. Acredita la pantalla de acceso disponible. Los flujos autenticados se describen con su evidencia técnica."}]
  },
  {
    slug: "renova-sales", title: "RENOVA Sales", category: "FUERZA DE VENTAS / WEB + ANDROID",
    summary: "La información comercial acompaña al vendedor, también fuera de la oficina.",
    problem: "En campo, consultar existencias, preparar cotizaciones y retomar el trabajo después de perder la conexión requiere un flujo consistente.",
    solution: "Una aplicación web/PWA y Android conectada a un backend comercial, con un puente .NET para SAP y sincronización de la operación de campo.",
    stack: ["React 19", "TypeScript", "Vite", "Bootstrap", "Capacitor", "Supabase", ".NET", "SAP HANA"],
    implemented: ["Catálogo, existencias por bodega y preparación de cotizaciones.", "Conversión comercial y solicitudes de aprobación.", "Persistencia offline y sincronización posterior.", "Rutas, geocercas y seguimiento para vendedor y supervisor."],
    pending: ["Aceptación del primer alta comercial con la taxonomía real de geocercas.", "Validaciones comerciales específicas de impresión y edición nativa.", "Push remoto con la aplicación detenida, fuera del alcance comprobado."],
    production: "Los registros de octubre de 2026 documentan despliegues en Vercel y verificaciones de APK instalada. El 19 de noviembre se verificó visualmente el acceso de Vercel. El dominio sales.renovagt.com no resolvió desde este entorno.",
    status: "Web y APK documentadas", impact: "Reúne consulta de stock, cotización y seguimiento en el flujo del vendedor. La persistencia local permite continuar tareas definidas y sincronizarlas al recuperar conexión.",
    flow: ["Vendedor", "Cola local", "Sincronización", "Supervisor"],
    source: "", sourceLabel: "Repositorio privado · código, pruebas y registro de release",
    evidence: [{src:"/public/evidence/renova-sales/acceso-publico.png",alt:"Pantalla real de acceso de RENOVA Sales para colaboradores.",caption:"Captura del acceso público de renova-sales.vercel.app · 19 nov 2026. Verificación visual del acceso, sin ejecutar operaciones comerciales."}]
  },
  {
    slug: "agri-flow", title: "AgriFlow", category: "LOGÍSTICA / TRAZABILIDAD OPERATIVA",
    summary: "Una misma historia para cada envío, traslado y entrega.",
    problem: "La operación logística necesita relacionar documentos, responsables, etapas y tiempos para comprender dónde está cada envío.",
    solution: "Una plataforma de seguimiento con vistas de operación, piloto y bodega, documentos vinculados y análisis de tiempos.",
    stack: ["React", "TypeScript", "Vite", "PostgreSQL", "Supabase", "PWA", ".NET", "AWS"],
    implemented: ["Creación y seguimiento de operaciones y traslados.", "Despacho de bodega y registro de entradas.", "Documentos SAP, archivos y consulta de PDF.", "Reportes, análisis operativo y control por roles."],
    pending: ["Aceptación visual por administrador, piloto y bodega en el entorno AWS.", "Reconciliación final de operaciones y archivos antes del corte.", "Aceptación de la integración SAP y entrega efectiva de correo."],
    production: "El informe de AWS del 6 de noviembre de 2026 verifica restauración, acceso y servicios desplegados. El informe corresponde a un ensayo de recuperación y despliegue.",
    status: "Ensayo AWS documentado", impact: "Relaciona documentos y etapas de un envío para consultar su recorrido y analizar tiempos con información estructurada.",
    flow: ["Documento", "Bodega", "Traslado", "Recepción"],
    source: "", sourceLabel: "Repositorio privado · código y estado de ensayo AWS",
    evidence: [{src:"/public/evidence/agri-flow/captura-proporcionada.png",alt:"Panel de control logístico de AgriFlow.",caption:"Captura del panel de logística proporcionada por Gener Suhul."}]
  },
  {
    slug: "asistencia-hikvision", title: "Asistencia Hikvision", category: "INTEGRACIÓN / AUTOMATIZACIÓN",
    summary: "De dispositivos independientes a una asistencia centralizada.",
    problem: "Revisar registros por dispositivo y preparar reportes de cada sucursal fragmenta el seguimiento administrativo.",
    solution: "Un gateway recibe eventos y sincroniza históricos. La aplicación organiza marcaciones, consultas y reportes programados para la supervisión.",
    stack: ["Node.js", "TypeScript", "React", "Material UI", "PostgreSQL", "Hikvision", "DeviceGateway", "AWS"],
    implemented: ["Recepción de callbacks y procesamiento de eventos.", "Sincronización histórica y recuperación de datos.", "Consultas por rango, llegadas tardías y ajustes manuales.", "Programación de reportes con trazabilidad y protección contra duplicados."],
    pending: ["Aceptación continua de las reglas de asistencia de cada sucursal.", "Seguimiento de entregas de correo y de dispositivos fuera de línea."],
    production: "El informe de reparación del 9 de noviembre de 2026 registra despliegue completado en AWS, página HTTPS y ejecución del programador de reportes. Distingue mensajes aceptados por el proveedor de entrega final.",
    status: "Operación documentada", impact: "Centraliza la consulta de eventos y automatiza la preparación de reportes. La recuperación y el historial facilitan revisar diferencias sin ir dispositivo por dispositivo.",
    flow: ["Dispositivo", "Gateway", "Historial", "Reportes"],
    source: "", sourceLabel: "Repositorio privado · gateway, scheduler y registro de verificación",
    evidence: [{src:"/public/evidence/asistencia-hikvision/captura-proporcionada.png",alt:"Panel de asistencia y dispositivos Hikvision.",caption:"Captura del panel de asistencia proporcionada por Gener Suhul."}]
  },
  {
    slug: "streamline", title: "Streamline + SAP", category: "MIDDLEWARE / INTEGRACIÓN DE DATOS",
    summary: "Datos empresariales preparados para una integración consistente.",
    problem: "Los datos de SAP y el contrato requerido por Streamline necesitan alinearse en estructura, validaciones y disponibilidad.",
    solution: "Un Worker .NET extrae información de lectura, la transforma y mantiene staging. Una Custom API expone el contrato para Streamline.",
    stack: ["C#", ".NET", "SAP HANA", "Service Layer", "PostgreSQL", "Supabase", "Windows Service", "AWS"],
    implemented: ["Worker y API separados por responsabilidades.", "Lectura SAP, snapshots de staging y validadores de esquema.", "Endpoints de artículos, transacciones y documentos.", "Comparación de paridad con plantilla Excel y reportes de diferencias."],
    pending: ["Aceptación end-to-end con el consumidor Streamline.", "Creación de órdenes de compra, traslado y fabricación, que devuelve 501 en fase 1."],
    production: "La solución utiliza AWS según la información del proyecto. El repositorio describe su arquitectura y una Custom API. Esta revisión no aporta una prueba independiente de aceptación productiva de todo el flujo.",
    status: "Fase 1 · lectura", impact: "Hace explícito el contrato de datos y permite revisar diferencias antes del consumo. El staging separa la extracción del ERP de la consulta externa.",
    flow: ["SAP", "Worker", "Staging", "Custom API"],
    source: "", sourceLabel: "Repositorio privado · README y código de Worker/API revisados",
    evidence: []
  },
  {
    slug: "bufete-umg", title: "Bufete UMG", category: "GESTIÓN JURÍDICA / PROYECTO ACADÉMICO",
    summary: "El expediente como eje del seguimiento jurídico y académico.",
    problem: "La recepción, los documentos y las actividades del caso deben conservar una relación clara y un acceso acorde a la responsabilidad de cada usuario.",
    solution: "Una plataforma interna por capas que organiza expedientes, documentos y práctica de alumnos, con permisos y auditoría.",
    stack: ["ASP.NET Core 10", "C#", "Next.js", "React 19", "PostgreSQL 18", "EF Core", "S3 / MinIO", "Azure"],
    implemented: ["Recepción, expedientes y asignación de casos a alumnos.", "Cronología procesal, revisiones y notificaciones.", "Documentos versionados y digitalización multipágina.", "Búsqueda, reportes, roles y auditoría."],
    pending: ["Confirmación del estado de despliegue y aceptación institucional.", "Configuración, despliegue y aceptación institucional en destino."],
    production: "La aplicación se despliega en Azure según la información del proyecto. El repositorio contiene código, pruebas y guías; la aceptación institucional requiere confirmación.",
    status: "Código público · estado por confirmar", impact: "Organiza el seguimiento del expediente, conserva la autoría de acciones y conecta los documentos con la actividad académica y jurídica.",
    flow: ["Recepción", "Expediente", "Seguimiento", "Auditoría"],
    source: "https://github.com/GenerSuhul/buefete-umg", sourceLabel: "Repositorio público · arquitectura y código disponibles",
    evidence: [{src:"/public/evidence/bufete-umg/captura-proporcionada.png",alt:"Resumen operativo de Bufete Popular UMG.",caption:"Captura del panel del Bufete Popular UMG proporcionada por Gener Suhul."}]
  }
];
