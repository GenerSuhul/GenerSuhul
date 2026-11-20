import { createHash } from "node:crypto";

const counterKey = "portfolio:visits:total";
const lua = `local ok=redis.call('SET',KEYS[2],'1','NX','EX',30); if not ok then return {tonumber(redis.call('GET',KEYS[1]) or '0'),0} end; return {redis.call('INCR',KEYS[1]),1}`;
async function redis(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Storage unavailable");
  const response = await fetch(url, { method:"POST", headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"}, body:JSON.stringify(command), signal:AbortSignal.timeout(5000) });
  const payload = await response.json();
  if (!response.ok || payload.error) throw new Error("Storage request failed");
  return payload.result;
}
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (!["GET","POST"].includes(req.method)) { res.setHeader("Allow", "GET, POST"); return res.status(405).json({error:"Método no permitido"}); }
  if (req.method === "POST" && req.headers.origin !== "https://dev.kyrosoftgs.com") return res.status(403).json({error:"Origen no permitido"});
  try {
    if (req.method === "GET") return res.status(200).json({visits:Number(await redis(["GET",counterKey]) || 0)});
    const agent = req.headers["user-agent"] || "";
    if (/bot|crawler|spider|slurp|preview/i.test(agent)) return res.status(204).end();
    const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
    if (!process.env.VISIT_HASH_SECRET) throw new Error("Visit protection unavailable");
    const rateKey = "portfolio:visits:rate:"+createHash("sha256").update(process.env.VISIT_HASH_SECRET+ip).digest("hex");
    const [visits, added] = await redis(["EVAL",lua,2,counterKey,rateKey]);
    if (added && process.env.RESEND_API_KEY && process.env.VISIT_FROM_EMAIL) {
      const result = await fetch("https://api.resend.com/emails", {method:"POST",headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.VISIT_FROM_EMAIL,to:["generalexandersuhul22@gmail.com"],subject:"Nueva visita a tu portafolio",text:`Tu portafolio recibió una visita.\nVisitas registradas: ${visits}\nFecha: ${new Date().toISOString()}\nhttps://dev.kyrosoftgs.com/`}),signal:AbortSignal.timeout(5000)}).catch(()=>null);
      if (!result?.ok) console.error("Visit notification failed");
    }
    return res.status(200).json({visits:Number(visits)});
  } catch { return res.status(503).json({error:"Contador no disponible"}); }
}
