import { mkdir, writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { projects } from "../content/projects.mjs";
import { layout, home, caseStudy } from "../src/templates.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const base = "https://gener-suhul-portfolio.vercel.app";
await writeFile(root + "index.html", layout({title:"Gener Suhul | Backend e integraciones empresariales",description:"Portafolio de Gener Alexander Suhul Amador. Backend, SAP Business One, APIs y aplicaciones empresariales. Casos de estudio con evidencia y alcance verificado.",path:"/",body:home(projects)}));
for (const project of projects) {
  const directory = root + "casos/" + project.slug;
  await mkdir(directory, {recursive:true});
  await writeFile(directory + "/index.html", layout({title:project.title+" | Caso de estudio de Gener Suhul",description:project.summary,path:"/casos/"+project.slug+"/",body:caseStudy(project)}));
}
const paths=["/",...projects.map(p=>"/casos/"+p.slug+"/")];
await writeFile(root+"sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'+paths.map(path=>'<url><loc>'+base+path+'</loc>'+projects.filter(p=>path==="/"||path.includes(p.slug)).flatMap(p=>p.evidence).map(e=>'<image:image><image:loc>'+base+e.src+'</image:loc></image:image>').join("")+'</url>').join("")+'</urlset>');
await writeFile(root+"robots.txt", "User-agent: *\nAllow: /\nDisallow: /content/\nDisallow: /scripts/\nDisallow: /src/\nSitemap: "+base+"/sitemap.xml\n");
await writeFile(root+"404.html",layout({title:"Página no encontrada | Gener Suhul",description:"Vuelve al portafolio de Gener Suhul.",path:"/404.html",body:'<section class="container section"><p class="eyebrow">404</p><h1>Busquemos otro camino.</h1><p>Esta dirección no está disponible.</p><a class="button primary" href="/">Volver al inicio</a></section>'}));
console.log("Portafolio y seis casos generados.");
