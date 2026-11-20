import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { projects } from "../content/projects.mjs";
import { layout, home, caseStudy } from "../src/templates.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const base = "https://dev.kyrosoftgs.com";
const seo = {
  "renova-puntos": ["Sistema de fidelización y puntos | RENOVA Puntos", "Caso de estudio de software de fidelización con puntos, canjes e integración SAP Business One. Desarrollo de Gener Suhul en Guatemala."],
  "renova-sales": ["Software de ventas en campo | RENOVA Sales", "Aplicación de ventas en campo con cotizaciones, consulta de inventario y sincronización. Proyecto de desarrollo de software en Guatemala."],
  "agri-flow": ["Sistema de logística y despachos en Guatemala | AgriFlow", "Sistema logístico para seguimiento de envíos, traslados, despachos de bodega y documentos. Proyecto de Gener Suhul en Petén, Guatemala."],
  "asistencia-hikvision": ["Sistema de control de asistencia Hikvision | Guatemala", "Sistema para centralizar marcaciones de dispositivos Hikvision y generar reportes de asistencia. Desarrollo de software en Guatemala."],
  "streamline": ["Integración SAP Business One y Streamline | Middleware", "Caso de estudio de integración de información empresarial para su consulta y análisis."],
  "bufete-umg": ["Sistema de expedientes para bufete | Bufete UMG", "Caso de estudio de software jurídico para expedientes, documentos, seguimiento y gestión de un bufete universitario."]
};
await writeFile(root + "index.html", layout({images:projects.flatMap(p=>p.evidence.slice(0,1)),title:"Gener Suhul | Desarrollador de software en Guatemala",description:"Desarrollo de software, sistemas de ventas, logística y asistencia, integraciones SAP y soluciones cloud. Portafolio de Gener Suhul, Petén, Guatemala.",path:"/",body:home(projects)}));
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
