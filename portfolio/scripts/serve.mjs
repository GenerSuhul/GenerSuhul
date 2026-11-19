import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root=resolve(import.meta.dirname,"..");
const types={".html":"text/html; charset=utf-8",".css":"text/css",".js":"application/javascript",".mjs":"application/javascript",".svg":"image/svg+xml",".png":"image/png",".webp":"image/webp",".pdf":"application/pdf",".xml":"application/xml",".txt":"text/plain"};
http.createServer(async(req,res)=>{
  try{
    let path=resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));
    if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403).end();return;}
    if((await stat(path)).isDirectory())path=resolve(path,"index.html");
    const data=await readFile(path);
    res.writeHead(200,{"Content-Type":types[extname(path)]||"application/octet-stream","Cache-Control":"no-store"}).end(data);
  }catch{res.writeHead(404,{"Content-Type":"text/html"}).end(await readFile(resolve(root,"404.html")));}
}).listen(4175,"127.0.0.1",()=>console.log("Portfolio: http://127.0.0.1:4175"));
