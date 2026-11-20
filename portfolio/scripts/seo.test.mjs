import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { projects } from '../content/projects.mjs';
const base='https://dev.kyrosoftgs.com';
test('SEO pages have unique metadata, canonical URLs, structured data and sitemap coverage',async()=>{
 const urls=['/',...projects.map(p=>'/casos/'+p.slug+'/')];
 const sitemap=await readFile(new URL('../sitemap.xml',import.meta.url),'utf8');
 const robots=await readFile(new URL('../robots.txt',import.meta.url),'utf8');
 const titles=new Set();
 for(const path of urls){const file=path==='/'?'../index.html':'..'+path+'index.html';const html=await readFile(new URL(file,import.meta.url),'utf8');
  const title=html.match(/<title>([^<]+)<\/title>/)?.[1];assert(title);assert(!titles.has(title));titles.add(title);
  assert(html.includes('<link rel="canonical" href="'+base+path+'">'));assert(html.includes('name="description"'));assert(html.includes('index, follow'));assert(sitemap.includes('<loc>'+base+path+'</loc>'));
  const json=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);assert(json);assert.doesNotThrow(()=>JSON.parse(json[1]));
 }
 assert(robots.includes('Sitemap: '+base+'/sitemap.xml'));assert(!sitemap.includes('/404.html'));
});
