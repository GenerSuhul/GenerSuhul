import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { projects } from "../content/projects.mjs";
import { layout, home, caseStudy } from "../src/templates.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const base = "https://dev.kyrosoftgs.com";
const seo = {
  "renova-puntos": ["Software de fidelización de clientes y puntos | RENOVA", "Programa de fidelización de clientes con acumulación de puntos, canjes y recompensas. Desarrollo de software en Petén, Guatemala."],
  "renova-sales": ["Software de ventas en campo | RENOVA Sales", "Aplicación de ventas en campo con cotizaciones, consulta de inventario y sincronización. Proyecto de desarrollo de software en Guatemala."],
  "agri-flow": ["Software de logística, bodega y picking | AgriFlow", "Sistema de logística en Guatemala: envíos, traslados, picking, preparación de pedidos y despachos de bodega. Desarrollo en Petén."],
  "asistencia-hikvision": ["Tiempo y asistencia Hikvision en Guatemala", "Sistema de tiempo y asistencia Hikvision: marcaciones, horarios y reportes automatizados para sucursales. Desarrollo de software en Guatemala."],
  "streamline": ["Integración SAP Business One y Streamline | Middleware", "Caso de estudio de integración de información empresarial para su consulta y análisis."],
  "bufete-umg": ["Sistema de gestión jurídica | Bufete Popular UMG Petén", "Sistema de expedientes entregado al Bufete Popular UMG de Petén, con plan piloto para su implementación en otras sedes de Guatemala."]
};
await writeFile(root + "index.html", layout({images:projects.flatMap(p=>p.evidence.slice(0,1)),title:"Gener Suhul | Desarrollador de software en Guatemala",description:"Gener Suhul, desarrollador de software de Poptún, Petén, Guatemala. Conoce sus proyectos de ventas, logística, asistencia e integraciones SAP.",path:"/",body:home(projects)}));
for (const project of projects) {
  const directory = root + "casos/" + project.slug;
  await mkdir(directory, {recursive:true});
  await writeFile(directory + "/index.html", layout({title:seo[project.slug][0]+" | Gener Suhul",description:seo[project.slug][1],images:project.evidence,path:"/casos/"+project.slug+"/",body:caseStudy(project)}));
}
const paths=["/",...projects.map(p=>"/casos/"+p.slug+"/")];
await writeFile(root+"sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'+paths.map(path=>'<url><loc>'+base+path+'</loc>'+projects.filter(p=>path==="/"||path.includes(p.slug)).flatMap(p=>path==="/"?p.evidence.slice(0,1):p.evidence).map(e=>'<image:image><image:loc>'+base+e.src+'</image:loc></image:image>').join("")+'</url>').join("")+'</urlset>');
await writeFile(root+"robots.txt", "User-agent: *\nAllow: /\nDisallow: /content/\nDisallow: /scripts/\nSitemap: "+base+"/sitemap.xml\n");
await writeFile(root+"404.html",layout({title:"Página no encontrada | Gener Suhul",description:"Vuelve al portafolio de Gener Suhul.",path:"/404.html",body:'<section class="container section"><p class="eyebrow">404</p><h1>Busquemos otro camino.</h1><p>Esta dirección no está disponible.</p><a class="button primary" href="/">Volver al inicio</a></section>'}));
console.log("Portafolio y seis casos generados.");
