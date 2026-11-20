import { processArt } from "./process-art.mjs";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const assetVersion = (file) => createHash("sha256").update(readFileSync(new URL(file, import.meta.url))).digest("hex").slice(0, 12);
const cssVersion = assetVersion("./styles.css");
const themeVersion = assetVersion("./theme.js");
const appVersion = assetVersion("./app.js");
const base = "https://dev.kyrosoftgs.com";
export const escape = (value) => String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const technologyIcons = {
  "AWS": ["aws", "#FF9900"], "Azure": ["azure", "#55BAFF"],
  "SQL Server": ["sqlserver", "#CC2927"], "Oracle Database": ["oracle", "#F80000"],
  "Kubernetes": ["kubernetes", "#719DFF"], "GitHub Actions": ["githubactions", "#78B6FF"],
  "Prometheus": ["prometheus", "#FF885C"], "Grafana": ["grafana", "#FFAE55"],
  "NGINX": ["nginx", "#5BD482"], "Flyway": ["flyway", "#FF7777"],
  "HTML5": ["html5", "#FF8869"], "CSS3": ["css", "#73B7FF"], "Tailwind CSS": ["tailwindcss", "#68DEF0"],
  "React": ["react", "#61DAFB"], "React 19": ["react", "#61DAFB"],
  "Node.js": ["nodedotjs", "#6DAA45"], "TypeScript": ["typescript", "#3178C6"],
  "JavaScript": ["javascript", "#F7DF1E"], "Vite": ["vite", "#BD80FF"],
  "PostgreSQL": ["postgresql", "#669FD1"], "PostgreSQL 18": ["postgresql", "#669FD1"],
  "Supabase": ["supabase", "#3ECF8E"], ".NET": ["dotnet", "#A994FF"],
  "ASP.NET Core 10": ["dotnet", "#A994FF"], "C#": ["csharp", "#512BD4"],
  "SAP B1": ["sap", "#0FA5DA"], "SAP HANA": ["sap", "#0FA5DA"], "SAP Business One": ["sap", "#0FA5DA"],
  "Service Layer": ["sap", "#0FA5DA"], "PWA": ["pwa", "#C7A8FF"],
  "Bootstrap": ["bootstrap", "#B59BFF"], "Capacitor": ["capacitor", "#77B7FF"],
  "Material UI": ["mui", "#69B6FF"], "Next.js": ["nextdotjs", "currentColor"],
  "EF Core": ["dotnet", "#A994FF"], "MySQL": ["mysql", "#71B2D9"],
  "Express": ["express", "currentColor"], "Java": ["openjdk", "currentColor"],
  "Spring Boot": ["springboot", "#8BCB59"], "Angular": ["angular", "#FF6B82"],
  "Docker": ["docker", "#66B9F0"], "Linux": ["linux", "currentColor"],
  "GitHub": ["github", "currentColor"], "Vercel": ["vercel", "currentColor"],
  "PM2": ["pm2", "#78B9FC"], "JWT": ["jsonwebtokens", "currentColor"], "NFC": ["nfc", "currentColor"]
};
const technology = (name) => {
  const icon = technologyIcons[name];
  if (!icon) return '<span class="tech-fallback">'+escape(name)+'</span>';
  const colored = new Set(["aws", "azure", "csharp", "dotnet", "nodedotjs", "openjdk", "springboot", "react", "typescript", "javascript", "html5", "css", "tailwindcss", "vite", "angular", "postgresql", "mysql", "docker", "kubernetes", "githubactions", "nginx", "prometheus", "grafana", "flyway", "supabase", "linux", "bootstrap", "sqlserver", "oracle"]);
  const mark = colored.has(icon[0]) ? '<img class="tech-icon-image tech-icon-'+icon[0]+'" src="/public/tech/'+icon[0]+(icon[0] === "aws" ? '' : '-color')+'.svg" alt="" width="24" height="24" loading="lazy">' : '<span class="tech-icon-mark" style="--icon-url:url(/public/tech/'+icon[0]+'.svg)" aria-hidden="true"></span>';
  return '<span class="tech-icon" style="--icon-color:'+icon[1]+'" title="'+escape(name)+'">'+mark+'<span class="tech-name">'+escape(name)+'</span></span>';
};
const tags = (items) => '<ul class="tags tech-tags" aria-label="Tecnologías utilizadas">'+items.map(item=>'<li>'+technology(item)+'</li>').join("")+'</ul>';
const stackGroups = [
  ["Backend", ["C#", ".NET", "Node.js", "Express", "Java", "Spring Boot", "APIs REST", "JWT"]],
  ["Frontend", ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Vite", "Angular", "PWA"]],
  ["Datos e integración", ["PostgreSQL", "SQL Server", "Oracle Database", "MySQL", "SAP HANA", "SAP Business One", "Service Layer", "Flyway", "NFC"]],
  ["Cloud y entrega", ["AWS", "Azure", "Supabase", "Docker", "Kubernetes", "GitHub Actions", "Linux", "NGINX", "Prometheus", "Grafana", "GitHub", "Vercel", "PM2"]]
];
const list = (items) => '<ul class="checklist">'+items.map(item=>'<li>'+escape(item)+'</li>').join("")+'</ul>';
const icon = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M14 10 4 20l10 10M26 10l10 10-10 10M23 6l-6 28" fill="none" stroke="currentColor" stroke-width="3"/></svg>';
const flowIcons = Object.fromEntries(Object.entries({"sale": "shopping-bag", "reward": "gift", "history": "clock-counter-clockwise", "check": "check-circle", "person": "user-circle", "device": "device-mobile", "sync": "arrows-clockwise", "chart": "chart-bar", "document": "file-text", "warehouse": "warehouse", "truck": "truck", "receive": "tray-arrow-down", "gateway": "broadcast", "database": "database", "server": "hard-drives", "code": "code", "inbox": "tray", "folder": "folder-open", "search": "magnifying-glass", "shield": "shield-check"}).map(([key, name]) => [key, readFileSync(new URL("../public/process-icons/"+name+".svg", import.meta.url), "utf8").replace("<svg ", '<svg aria-hidden="true" focusable="false" ')]));
const flowIconSets = {
  "renova-puntos": ["sale", "reward", "history", "check"],
  "renova-sales": ["person", "device", "sync", "chart"],
  "agri-flow": ["document", "warehouse", "truck", "receive"],
  "asistencia-hikvision": ["device", "gateway", "history", "chart"],
  "streamline": ["database", "server", "database", "code"],
  "bufete-umg": ["inbox", "folder", "search", "shield"]
};
const projectFlows = {
  "renova-puntos": [
    ["Ventas", "Compras registradas", "receipt"], ["Clientes", "Gestión de socios", "person"],
    ["Puntos", "Acumulación y reglas", "points"], ["Movimientos", "Historial trazable", "compare"],
    ["Recompensas", "Opciones de canje", "shop"], ["Integración SAP", "Adaptador empresarial", "gateway"]
  ],
  "renova-sales": [
    ["Vendedores", "Operación en campo", "field"], ["Catálogo", "Productos y existencias", "stock"],
    ["Cotizaciones", "Preparación comercial", "receipt"], ["Sin conexión", "Persistencia local", "phone"],
    ["Sincronización", "Actualización de datos", "data"], ["Supervisión", "Rutas y seguimiento", "chart"]
  ],
  "agri-flow": [
    ["Operaciones", "Envíos y traslados", "operations"], ["Bodega", "Despacho y entradas", "warehouse"],
    ["Documentos SAP", "Archivos vinculados", "folder"], ["Transporte", "Seguimiento de etapas", "truck"],
    ["Recepción", "Registro de entradas", "reception"], ["Reportes", "Análisis operativo", "chart"],
    ["Accesos", "Control por roles", "shield"]
  ],
  "asistencia-hikvision": [
    ["Dispositivos", "Eventos de marcación", "biometric"], ["Gateway", "Recepción de eventos", "gateway"],
    ["Historial", "Sincronización de datos", "data"], ["Consultas", "Revisión por rango", "calendar"],
    ["Ajustes", "Gestión de registros", "document"], ["Reportes", "Preparación programada", "chart"]
  ],
  "streamline": [
    ["Información", "Datos empresariales", "document"], ["Artículos", "Información de productos", "stock"],
    ["Documentos", "Información organizada", "folder"], ["Consulta", "Acceso a información", "api"],
    ["Revisión", "Consistencia de datos", "compare"], ["Análisis", "Información para decisiones", "chart"]
  ],
  "bufete-umg": [
    ["Recepción", "Ingreso de casos", "person"], ["Expedientes", "Gestión jurídica", "folder"],
    ["Documentos", "Archivo digital", "document"], ["Seguimiento", "Cronología procesal", "chart"],
    ["Alumnos", "Asignación de casos", "team"], ["Notificaciones", "Revisiones y avisos", "notification"],
    ["Auditoría", "Roles y trazabilidad", "shield"]
  ]
};
const flowBrands = {
  "renova-puntos": {tech:["React", "SAP B1", "AWS"]},
  "renova-sales": {tech:["React", "SAP HANA", ".NET"]},
  "agri-flow": {tech:["React", "PostgreSQL", "AWS"]},
  "asistencia-hikvision": {tech:["Node.js", "PostgreSQL", "AWS"]},
  "streamline": {tech:["C#", "SAP HANA", "AWS"]},
  "bufete-umg": {tech:["ASP.NET Core 10", "PostgreSQL", "Azure"]}
};
export function flow(project, large=false) {
  const brand = flowBrands[project.slug];
  const steps = projectFlows[project.slug];
  const techLogos = brand.tech.map(name => technology(name)).join("");

  const positions = steps.map((_, i) => {
    const angle = 2 * Math.PI * i / steps.length;
    return { x:50 + 35*Math.sin(angle), y:50 - 39*Math.cos(angle) };
  });
  const branches = positions.map(({x,y}) => `M500 500 Q${500+(x*10-500)*.55} ${500+(y*10-500)*.35} ${x*10} ${y*10}`);
  const paths = branches.join(" ");
  const particles = branches.map((path,i) => '<circle class="orbit-particle" r="9"><animateMotion path="'+path+'" dur="2.8s" begin="'+(i*.3).toFixed(1)+'s" repeatCount="indefinite"/></circle>').join("");
  const readableSteps = steps.map(([title, detail]) => '<li><strong>'+escape(title)+'</strong><span>'+escape(detail)+'</span></li>').join("");
  const readable = large ? '<details class="process-readable"><summary>Ver procesos en texto</summary><ul>'+readableSteps+'</ul></details>' : "";
  const nodes = steps.map(([title, detail, artwork], i) => '<li class="process-card" style="--node-x:'+positions[i].x.toFixed(3)+'%;--node-y:'+positions[i].y.toFixed(3)+'%;--node-delay:'+((i%4)*-.55)+'s"><span class="process-art">'+processArt(artwork)+'</span><span class="process-copy"><strong>'+escape(title)+'</strong><small>'+escape(detail)+'</small></span></li>').join("");
  return '<figure class="flow-map '+(large?'flow-map-large':'flow-map-compact')+'"><figcaption><span>PROCESOS CONECTADOS</span><strong>Así funciona '+escape(project.title)+'</strong><small>Diagrama conceptual</small></figcaption><div class="process-viewport"><div class="process-stage"><svg class="orbit-connections" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path class="orbit-path" d="'+paths+'"/><path class="orbit-pulse" d="'+paths+'"/>'+particles+'</svg><div class="process-hub"><span>PLATAFORMA</span><strong>'+escape(project.title)+'</strong></div><ol class="process-grid">'+nodes+'</ol></div></div>'+readable+'<div class="flow-technologies" aria-label="Tecnologías del proyecto"><span>TECNOLOGÍAS</span><div>'+techLogos+'</div></div></figure>';
}
const capabilityHeadings = {
  "renova-puntos": ["Programa de fidelización", "Puntos y canjes", "Experiencia digital", "Integración empresarial"],
  "renova-sales": ["Información comercial", "Gestión de ventas", "Operación sin conexión", "Trabajo en campo"],
  "agri-flow": ["Operaciones y traslados", "Bodega y despachos", "Documentos conectados", "Control y reportes"],
  "asistencia-hikvision": ["Eventos de asistencia", "Historial centralizado", "Consultas y ajustes", "Reportes automáticos"],
  "streamline": ["Información empresarial", "Datos organizados", "Consulta de información", "Revisión de consistencia"],
  "bufete-umg": ["Gestión de casos", "Seguimiento procesal", "Archivo digital", "Control y auditoría"]
};
function capabilities(project) {
  const icons = flowIconSets[project.slug];
  return '<section class="container section capability-section"><div class="capability-heading"><p class="eyebrow">LA SOLUCIÓN EN ACCIÓN</p><h2>Funcionalidades destacadas</h2><p>Algunas de las capacidades que forman parte de '+escape(project.title)+'.</p></div><div class="capability-grid">'+project.implemented.map((description,i)=>'<article class="capability-card"><span class="capability-icon">'+flowIcons[icons[i]]+'</span><h3>'+escape(capabilityHeadings[project.slug][i])+'</h3><p>'+escape(description)+'</p></article>').join("")+'</div></section>';
}
function visual(project, linkToCase = true) {
  const image = project.evidence[0];
  const content = image
    ? '<img src="'+escape(image.src)+'" alt="'+escape(image.alt)+'" title="'+escape(image.alt)+'" loading="lazy">'
    : flow(project);
  if (!linkToCase) return image ? '<figure class="project-picture">'+content+'</figure>' : content;
  return '<div class="project-picture"><a class="project-image-link" href="/casos/'+escape(project.slug)+'/" aria-label="Ver caso de estudio de '+escape(project.title)+'">'+content+'</a></div>';
}
export function layout({title,description,path,body,images=[]}) {
  const schema={"@context":"https://schema.org","@type":"Person",name:"Gener Alexander Suhul Amador",url:base,jobTitle:"Software Developer",sameAs:["https://github.com/GenerSuhul"]};
  const imageSchemas = images.map(image => ({"@context":"https://schema.org","@type":"ImageObject",contentUrl:base+image.src,name:image.alt,description:image.alt}));
  const socialImage = images.length && path !== "/" ? base+images[0].src : base+"/public/gener-suhul-social-v2.jpg";
  return `<!doctype html><html lang="es-GT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)}</title><meta name="robots" content="${path === "/404.html" ? "noindex, follow" : "index, follow, max-image-preview:large"}"><meta name="description" content="${escape(description)}"><link rel="canonical" href="${base+path}">
<meta name="theme-color" content="#081427"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${base+path}"><meta property="og:image" content="${escape(socialImage)}"><meta property="og:image:alt" content="${escape(path === "/" ? "Osi, avatar de Gener Suhul y su portafolio de software" : images[0]?.alt || title)}"><meta property="og:locale" content="es_GT"><meta property="og:site_name" content="Gener Suhul">${path === "/" ? '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">' : ""}<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${escape(socialImage)}">
<link rel="icon" href="/public/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/src/styles.css?v=${cssVersion}">
<script src="/src/theme.js?v=${themeVersion}"></script><script type="module" src="/src/app.js?v=${appVersion}"></script><script type="application/ld+json">${JSON.stringify([schema,...imageSchemas]).replace(/</g,"\\u003c")}</script></head>
<body><a class="skip" href="#contenido">Saltar al contenido</a><header class="header"><div class="container header-inner"><a class="brand" href="/" aria-label="genersuhul. Inicio">${icon}<span>gener<span class="brand-muted">suhul.</span></span></a><button class="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="navigation">Menú</button><nav id="navigation" aria-label="Navegación principal">${[["Inicio","inicio"],["Sobre mí","sobre-mi"],["Proyectos","proyectos"],["Impacto","impacto"],["Stack","tecnologias"],["Evidencia","evidencia"]].map(([label,id])=>'<a href="/#'+id+'">'+label+'</a>').join("")}</nav><div class="header-actions"><button id="theme" class="theme-toggle" type="button" aria-label="Activar tema claro">Claro</button><a class="header-contact" href="/#contacto">Contacto</a></div></div></header>
<main id="contenido">${body}</main><footer class="footer"><div class="container"><a class="brand" href="/">gener<span class="brand-muted">suhul.</span></a><p>Gener Alexander Suhul Amador<br>Software · Backend · Integraciones</p><div><a href="https://github.com/GenerSuhul">GitHub</a><a href="mailto:generalexandersuhul22@gmail.com">Correo</a><a href="tel:+50246637327">4663-7327</a><a href="https://wa.me/50246637327" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="/public/gener-suhul-cv.pdf" download>Descargar CV</a></div><span>2026 · Guatemala <span class="visit-counter" hidden> · Visitas: <strong data-visit-count></strong></span></span></div></footer>
<button type="button" class="back-to-top" aria-label="Volver al inicio" hidden><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg></button><aside class="whatsapp-widget" aria-label="Contacto por WhatsApp"><div id="whatsapp-panel" class="whatsapp-panel" hidden><div class="whatsapp-head"><div class="whatsapp-person"><img src="/public/avatar-osi-web.webp" alt="" width="48" height="48"><span><strong>Gener Suhul</strong><small>Conversemos por WhatsApp</small></span></div><button type="button" class="whatsapp-close" aria-label="Cerrar contacto de WhatsApp">×</button></div><div class="whatsapp-body"><p>Hola, soy Gener. ¿Tienes un proyecto o una consulta? Cuéntame y conversemos.</p><a href="https://wa.me/50246637327?text=Hola%20Gener%2C%20me%20interesa%20conversar%20sobre%20un%20proyecto." target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 9-18 9 3-9-3-9zm3 9h15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>Abrir conversación</a></div></div><button type="button" class="whatsapp-trigger" aria-label="Abrir contacto de WhatsApp" aria-expanded="false" aria-controls="whatsapp-panel"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 .8C7.8.8 1.1 7.4 1.1 15.6c0 2.6.7 5.1 1.9 7.3L1 31l8.3-2.2A14.8 14.8 0 0 0 16 30.4c8.2 0 14.9-6.6 14.9-14.8C30.9 7.4 24.2.8 16 .8zm0 27.1c-2.2 0-4.4-.6-6.3-1.7l-.5-.3-4.9 1.3 1.3-4.8-.3-.5a12.3 12.3 0 1 1 10.7 6zm6.8-9.2c-.4-.2-2.2-1.1-2.5-1.2-.4-.1-.6-.2-.9.2-.3.4-1 1.2-1.2 1.4-.2.3-.5.3-.9.1-.4-.2-1.6-.6-3-1.8-1.1-1-1.8-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.5-.6c.2-.2.3-.4.4-.6.1-.3 0-.5 0-.7l-1.1-2.6c-.3-.6-.6-.5-.9-.5h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1s1.3 3.5 1.5 3.7c.2.3 2.6 4.1 6.4 5.6.9.4 1.6.6 2.2.7.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.7.3-.8.3-1.5.2-1.7-.1-.2-.4-.3-.8-.5z"/></svg></button></aside><p class="sr-only" role="status" id="status"></p></body></html>`;
}
const heading=(label,title,text="")=>'<div class="section-heading"><p class="eyebrow">'+label+'</p><h2>'+title+'</h2>'+(text?'<p>'+text+'</p>':'')+'</div>';
function contactMenu(projectName = "") {
  const message = projectName ? 'Hola Gener, me interesa conversar sobre un proyecto similar a '+projectName+'.' : 'Hola Gener, me gustaría conversar sobre un proyecto.';
  const subject = projectName ? 'Consulta sobre '+projectName : 'Consulta sobre un proyecto';
  return `<details class="contact-menu"><summary class="button primary">Conversemos <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></summary><div class="contact-menu-panel"><div class="contact-menu-heading"><div><strong>Hablemos de tu proyecto</strong><span>Elige cómo quieres contactarme</span></div><button type="button" class="contact-menu-close" aria-label="Cerrar opciones de contacto">×</button></div><label for="contact-message">Tu mensaje para WhatsApp</label><textarea id="contact-message" maxlength="500" rows="3">${escape(message)}</textarea><a class="contact-option contact-option-whatsapp" data-whatsapp-link href="https://wa.me/50246637327?text=${encodeURIComponent(message)}" target="_blank" rel="noopener noreferrer"><span class="contact-option-icon" aria-hidden="true">${contactIcons.whatsapp}</span><span><strong>Enviar por WhatsApp</strong><small>Continuar conversación</small></span></a><a class="contact-option" href="tel:+50246637327"><span class="contact-option-icon" aria-hidden="true">${contactIcons.phone}</span><span><strong>Llamar</strong><small>+502 4663-7327</small></span></a><a class="contact-option" href="mailto:generalexandersuhul22@gmail.com?subject=${encodeURIComponent(subject)}"><span class="contact-option-icon" aria-hidden="true">${contactIcons.mail}</span><span><strong>Enviar correo</strong><small>generalexandersuhul22@gmail.com</small></span></a></div></details>`;
}
export function home(projects) {
return `<section id="inicio" class="hero container">
<div class="hero-layout"><div class="identity-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="identity-core"><img src="/public/avatar-osi-web.webp" alt="" width="800" height="871" fetchpriority="high"></div><span class="orbit-label label-api">API</span><span class="orbit-label label-data">DATA</span><span class="orbit-label label-sap">SAP</span></div>
<div class="hero-copy"><p class="eyebrow">GENER SUHUL / SOFTWARE ENGINEERING</p><h1>Gener Alexander<br><em>Suhul Amador.</em></h1><p class="hero-name">Software conectado con la operación.</p><p class="hero-role">Software Developer · Backend · Integraciones empresariales</p><p class="hero-description">Desarrollo aplicaciones, APIs e integraciones que conectan datos y procesos. Trabajo desde el levantamiento de requerimientos hasta las pruebas, el despliegue y el soporte.</p><div class="actions"><a class="button primary" href="#proyectos">Ver proyectos</a><a class="button" href="/public/gener-suhul-cv.pdf" download>Descargar CV</a><a class="plain-link" href="https://github.com/GenerSuhul">GitHub</a></div></div></div><div class="hero-baseline"><span>BASE EN PETÉN, GUATEMALA</span><span>DESARROLLO + OPERACIÓN + INTEGRACIÓN</span><a href="#sobre-mi">Conoce mi trabajo</a></div></section>
<section id="sobre-mi" class="section container about">
<p class="eyebrow">SOBRE MÍ</p><h2>Trabajo donde el código<br>se encuentra con <em>el negocio.</em></h2><p class="about-intro">Soy Gener, desarrollador de software con experiencia en backend, integraciones y sistemas empresariales.</p><p>Desde octubre de 2024 trabajo en Agrisystems S.A. Combino desarrollo, operación y soporte IT en proyectos de fidelización, ventas, logística y asistencia. También desarrollo soluciones independientes en KyroSoft GS, incluyendo administración cloud y adaptación de Odoo Community. Mi enfoque está en construir soluciones útiles y mantenibles.</p><div class="expertise"><article><span>${icon}</span><h3>Backend e integración</h3><p>APIs, middleware y conexión con SAP Business One mediante HANA y Service Layer.</p></article><article><span>${icon}</span><h3>Aplicaciones de operación</h3><p>Flujos de ventas, logística y gestión interna con permisos y trazabilidad.</p></article><article><span>${icon}</span><h3>Del desarrollo a la entrega</h3><p>Pruebas, despliegue, diagnóstico y acompañamiento de aplicaciones.</p></article></div></section>
<section id="proyectos" class="section container">
${heading("TRABAJO SELECCIONADO","Proyectos con contexto.<br><em>Decisiones con propósito.</em>","Seis casos de estudio sobre producto, integración y operación. Conoce los sistemas, sus funcionalidades y el valor que aportan a la operación.")}
<div class="project-index" aria-label="Índice de proyectos">${projects.map(p=>'<a href="#'+p.slug+'">'+escape(p.title)+'</a>').join("")}</div>
<div class="featured-projects">${projects.map((p,index)=>'<article class="featured" id="'+p.slug+'"><div class="featured-copy"><span class="project-position" aria-hidden="true">'+String(index+1).padStart(2,"0")+' / 06</span><p class="eyebrow">'+escape(p.category)+'</p><h3><a href="/casos/'+p.slug+'/">'+escape(p.title)+'</a></h3><div class="project-summary"><p>'+escape(p.summary)+'</p></div>'+tags(p.stack.slice(0,5))+'<a class="case-link" href="/casos/'+p.slug+'/">Leer caso de estudio</a></div><div class="featured-visual">'+visual(p)+'</div></article>').join("")}</div></section>
<section id="impacto" class="section impact-section"><div class="container">${heading("IMPACTO EN LA OPERACIÓN","Menos información dispersa.<br><em>Más contexto para trabajar.</em>","Soluciones que conectan información y facilitan el trabajo diario.")}<div class="impact-grid">${[["Centralización","Clientes, documentos, visitas y marcaciones relacionados dentro de su proceso."],["Trazabilidad","Historial y estados para entender qué ocurrió y cómo continuar."],["Continuidad","Colas y sincronización para flujos con conectividad limitada."],["Automatización","Extracción de datos y reportes programados para tareas repetitivas."]].map(([title,text])=>'<article><h3>'+title+'</h3><p>'+text+'</p></article>').join("")}</div></div></section>
<section id="tecnologias" class="section container">${heading("CONOCIMIENTO APLICADO","Las herramientas cambian.<br><em>El criterio conecta.</em>","Experiencia en aplicaciones, despliegue e infraestructura con AWS y Azure, además de las herramientas utilizadas en cada proyecto.")}<div class="stack-grid icon-stack">${stackGroups.map(([title,items])=>'<article><h3>'+title+'</h3>'+tags(items)+'</article>').join("")}</div></section>
<section id="evidencia" class="section container">${heading("PROYECTOS","Conoce los sistemas<br><em>en detalle.</em>","Explora las interfaces y funcionalidades de cada solución.")}
<div class="evidence-grid">${projects.map(p=>'<article><h3>'+escape(p.title)+'</h3>'+visual(p)+'<a class="case-link" href="/casos/'+p.slug+'/">Ver proyecto</a></article>').join("")}</div></section>
<section id="contacto" class="section container contact-section"><p class="eyebrow">CONTACTO</p><h2>Conversemos sobre<br><em>lo que necesitas construir.</em></h2><p>Disponible para colaborar en desarrollo backend, integraciones empresariales y aplicaciones internas con contexto de operación.</p><a class="contact-email" href="mailto:generalexandersuhul22@gmail.com">generalexandersuhul22@gmail.com</a><div class="actions">${contactMenu()}<a class="button" href="https://github.com/GenerSuhul">GitHub</a><a class="button" href="/public/gener-suhul-cv.pdf" download>Descargar CV</a></div></section>`;
}
const contactIcons = {
 whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.4 7.6L3 21l1.7-5A8.5 8.5 0 1 1 20.5 11.7Z"/><path d="M8.4 8.3c.7 3.1 3 5.5 6.2 6.3l1.3-1.3 2 1.1c-.3 1.4-1.3 2-2.7 1.8-3.6-.7-6.7-3.8-7.4-7.4-.2-1.4.4-2.4 1.8-2.7l1.1 2z"/></svg>',
 phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3l1.5 4.8-2.1 1.5a16 16 0 0 0 7.2 7.2l1.5-2.1z"/></svg>',
 mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
};
export function caseStudy(project) {
return `<article class="case-study"><section class="case-hero container"><a class="plain-link case-back" href="/#proyectos">Todos los proyectos</a><div class="case-cover"><div class="case-cover-copy"><div class="case-title-block"><p class="eyebrow">${escape(project.category)}</p><h1>${escape(project.title)}</h1><p class="case-lead">${escape(project.summary)}</p></div><div class="case-meta">${tags(project.stack)}</div></div><div class="case-cover-visual">${visual(project, false)}</div></div></section><section class="container case-intro"><div class="case-intro-copy"><div><h2>El problema</h2><p>${escape(project.problem)}</p></div><div><h2>La solución</h2><p>${escape(project.solution)}</p></div></div></section>
${capabilities(project)}
<section class="container section flow-section"><div class="flow-section-copy"><p class="eyebrow">IMPACTO FUNCIONAL</p><h2>Lo que aporta al proceso</h2><p>${escape(project.impact)}</p></div>${flow(project,true)}</section>
${project.evidence.length ? '<section id="evidencia" class="container section"><p class="eyebrow">EL PROYECTO</p><h2>Conoce el sistema</h2>'+project.evidence.map(e=>'<figure class="evidence-large"><img src="'+escape(e.src)+'" alt="'+escape(e.alt)+'" title="'+escape(e.alt)+'" loading="lazy"></figure>').join("")+'</section>' : ""}
<section class="container section contact-section"><h2>¿Un reto parecido?</h2><p>Podemos conversar sobre el proceso, las integraciones y el alcance técnico.</p><div class="actions">${contactMenu(project.title)}<a class="button" href="/#proyectos">Explorar otros proyectos</a></div></section></article>`;
}
