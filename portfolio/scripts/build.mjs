import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { projects } from "../content/projects.mjs";
import { layout, home, caseStudy } from "../src/templates.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const base = "https://dev.kyrosoftgs.com";
const seo = {
  "renova-puntos": ["Sistema de fidelización y puntos | RENOVA Puntos", "Caso de estudio de software de fidelización con puntos, canjes e integración SAP Business One. Desarrollo de Gener Suhul en Guatemala."],
  "renova-sales": ["Aplicación de ventas en campo | RENOVA Sales", "Caso de estudio de ventas en campo con Android, PWA, cotizaciones, inventario y sincronización con SAP Business One."],
  "agri-flow": ["Sistema de logística y seguimiento | AgriFlow", "Caso de estudio de software logístico para envíos, despachos, documentos y seguimiento de operaciones."],
  "asistencia-hikvision": ["Control de asistencia y acceso | Hikvision", "Caso de estudio de sistema de asistencia, dispositivos Hikvision, control de acceso y reportes automatizados."],
  "streamline": ["Integración SAP Business One y Streamline | Middleware", "Caso de estudio de integración empresarial con SAP HANA, Service Layer, middleware .NET y API de datos."],
  "bufete-umg": ["Sistema de expedientes para bufete | Bufete UMG", "Caso de estudio de software jurídico para expedientes, documentos, seguimiento y gestión de un bufete universitario."]
};
await writeFile(root + "index.html", layout({images:projects.flatMap(p=>p.evidence),title:"Gener Suhul | Backend e integraciones empresariales",description:"Portafolio de Gener Alexander Suhul Amador. Backend, Java, .NET, APIs, SAP Business One, AWS y Azure. Casos de estudio de ventas, logística y sistemas empresariales.",path:"/",body:home(projects)}));
for (const project of projects) {
  const directory = root + "casos/" + project.slug;
  await mkdir(directory, {recursive:true});
  await writeFile(directory + "/index.html", layout({title:seo[project.slug][0]+" | Gener Suhul",description:seo[project.slug][1],images:project.evidence,path:"/casos/"+project.slug+"/",body:caseStudy(project)}));
}
const paths=["/",...projects.map(p=>"/casos/"+p.slug+"/")];
await writeFile(root+"sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'+paths.map(path=>'<url><loc>'+base+path+'</loc>'+projects.filter(p=>path==="/"||path.includes(p.slug)).flatMap(p=>p.evidence).map(e=>'<image:image><image:loc>'+base+e.src+'</image:loc></image:image>').join("")+'</url>').join("")+'</urlset>');
await writeFile(root+"robots.txt", "User-agent: *\nAllow: /\nDisallow: /content/\nDisallow: /scripts/\nSitemap: "+base+"/sitemap.xml\n");
await writeFile(root+"404.html",layout({title:"Página no encontrada | Gener Suhul",description:"Vuelve al portafolio de Gener Suhul.",path:"/404.html",body:'<section class="container section"><p class="eyebrow">404</p><h1>Busquemos otro camino.</h1><p>Esta dirección no está disponible.</p><a class="button primary" href="/">Volver al inicio</a></section>'}));
console.log("Portafolio y seis casos generados.");
