"""Gener Suhul — SVG architecture visual and theme-aware animated GIF fallback.

Design: four technology layers, eleven architectural components, one logical
request/response sequence. The diagram is conceptual, not live telemetry.
SVG retains browser-native animations. GitHub README uses GIF rendered from
the same SVG scene because its image proxy may suppress SVG animation.
"""
import io
from math import sin, pi
from pathlib import Path
from PIL import Image
import cairosvg

W,H=1440,810
FPS=12
FRAMES=72
FRAME_MS=round(1000/FPS)
ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'assets'
ASSETS.mkdir(exist_ok=True)
PORTFOLIO=ROOT/'portfolio'
COLORS={
 'dark':{
  'bg':'#111820','surface':'#18222D','surface2':'#1D2A36','card':'#243341',
  'edge':'#394B5D','edgeSoft':'#273746','title':'#F3F7FB','body':'#C1CEDA',
  'muted':'#8FA2B4','blue':'#8CACF4','teal':'#51CEBF','blue2':'#567EBF',
  'line':'#60788B','lineFade':'#34495D','shadow':'#0E151E','white':'#FFFFFF',
  'green':'#51CEBF','smallBg':'#223448','footer':'#151F2B'
 },
 'light':{
  'bg':'#F8FAFC','surface':'#EDF3F9','surface2':'#F1F5FA','card':'#FFFFFF',
  'edge':'#D4E0ED','edgeSoft':'#E3EAF3','title':'#0B2D6B','body':'#445B73',
  'muted':'#71879B','blue':'#2563EB','teal':'#14B8A6','blue2':'#5684C3',
  'line':'#91A8C0','lineFade':'#D3DFEA','shadow':'#EBF0F6','white':'#FFFFFF',
  'green':'#0D9488','smallBg':'#E5EDF8','footer':'#F0F5FA'
 }
}
AREAS=[
 (41,339,'01','APLICACIONES', 'Interfaz de usuario'),
 (362,660,'02','API Y CONTROL','Servicios de negocio'),
 (683,1004,'03','INTEGRACIÓN','Servicios intermedios'),
 (1027,1399,'04','ERP Y PERSISTENCIA','Sistemas corporativos')
]
# id,x,y,w,h,title,detail,accent,short-code
NODES=[
 ('pwa',57,313,263,109,'PWA / VENTAS EN CAMPO','React · TypeScript · Offline','blue','UI'),
 ('admin',57,487,263,109,'PANEL ADMINISTRATIVO','Cotizaciones · Reportes','blue','WEB'),
 ('api',379,313,263,109,'API DE NEGOCIO','REST · C# / .NET / Node.js','blue','API'),
 ('iam',379,487,263,109,'IDENTIDAD Y ROLES','JWT · Validación · Permisos','blue','IAM'),
 ('audit',379,628,263,97,'AUDITORÍA','Eventos · Errores · Historial','teal','LOG'),
 ('middleware',700,313,286,109,'MIDDLEWARE .NET','Adaptación · Reglas SAP','teal','MID'),
 ('sync',700,487,286,109,'WORKER / SINCRONIZACIÓN','Colas · Reintentos · Estado','teal','JOB'),
 ('staging',700,628,286,97,'POSTGRESQL / STAGING','Datos normalizados · Consultas','teal','DB'),
 ('sl',1044,313,338,109,'SAP SERVICE LAYER','REST interno · Acceso privado','teal','SL'),
 ('sap',1044,487,338,109,'SAP BUSINESS ONE','Documentos · Maestros · Operación','teal','ERP'),
 ('hana',1044,628,338,97,'SAP HANA','Consultas y datos empresariales','teal','HANA'),
]
# Route geometry stays outside card interiors. Important main and support flows.
PATHS={
 'front':('M320 367 H379','main'),
 'front_secondary':('M320 541 H349 V367 H379','secondary'),
 'api_mid':('M642 367 H700','main'),
 'mid_sl':('M986 367 H1044','main'),
 'sl_sap':('M1213 422 V487','main'),
 'sap_hana':('M1213 596 V628','main'),
 'api_auth':('M510 422 V487','support'),
 'auth_audit':('M510 596 V628','support'),
 'mid_sync':('M843 422 V487','support'),
 'sync_stage':('M843 596 V628','support'),
 'audit_stage':('M642 674 H700','support'),
 'queue_sl':('M986 541 H1015 V450 H1032 V413 H1044','secondary'),
 'response':('M1213 313 V293 H509 V313','return'),
}
# A complete, timed request and response. Each phase activates connected cards,
# routes, a timeline segment and a status caption simultaneously.
PHASES=[
 ('SOLICITUD','Interfaz web → API',('pwa','api'),('front',)),
 ('VALIDACIÓN','API → identidad y permisos',('api','iam'),('api_auth','front')),
 ('ADAPTACIÓN','API → middleware .NET',('api','middleware'),('api_mid',)),
 ('CONSULTA ERP','Middleware → Service Layer',('middleware','sl','sap'),('mid_sl','sl_sap')),
 ('PERSISTENCIA','SAP Business One → HANA',('sap','hana'),('sap_hana',)),
 ('RESPUESTA','SAP → API → aplicación',('sl','middleware','api','pwa'),('response','mid_sl','api_mid','front')),
]
def esc(s):
 return str(s).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;')
def elem(tag,attrs='',contents=''):
 return f'<{tag} {attrs}>{contents}</{tag}>'
def text(x,y,value,size,fill,weight=500,spacing=0,other=''):
 return f'<text x="{x}" y="{y}" fill="{fill}" font-family="Inter,Arial,sans-serif" font-size="{size}" font-weight="{weight}" letter-spacing="{spacing}" {other}>{esc(value)}</text>'
def rect(x,y,w,h,fill,stroke='none',radius=12,sw=1):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def icon_path(kind,x,y,color):
 # Small functional line-icons, not generic emoji.
 icons={
  'UI':f'<rect x="{x}" y="{y}" width="24" height="18" rx="3"/><path d="M{x+5} {y+23}h14 M{x+12} {y+18}v5"/>',
  'WEB':f'<rect x="{x}" y="{y}" width="25" height="21" rx="3"/><path d="M{x} {y+7}h25 M{x+5} {y+4}h1 M{x+9} {y+4}h1"/>',
  'API':f'<path d="M{x+7} {y+2}l-7 9 7 9 M{x+20} {y+2}l7 9 -7 9 M{x+17} {y-1}l-7 24"/>',
  'IAM':f'<path d="M{x+12} {y}l11 5v8c0 7-5 11-11 14C{x+6} 24 1 20 1 13V5z"/><path d="M{x+7} {y+13}l4 4 7-8"/>',
  'LOG':f'<rect x="{x}" y="{y}" width="22" height="23" rx="2"/><path d="M{x+5} {y+7}h12 M{x+5} {y+12}h9 M{x+5} {y+17}h11"/>',
  'MID':f'<rect x="{x+7}" y="{y}" width="15" height="24" rx="3"/><path d="M{x} {y+12}h7 M{x+22} {y+12}h7 M{x+3} {y+8}l-4 4 4 4 M{x+26} {y+8}l4 4 -4 4"/>',
  'JOB':f'<path d="M{x+5} {y+5}h18v18H{x+5}z M{x+1} {y+10}h4 M{x+23} {y+10}h4 M{x+10} {y+5}v-4 M{x+18} {y+5}v-4"/><path d="M{x+10} {y+15}l4 4 6-7"/>',
  'DB':f'<ellipse cx="{x+14}" cy="{y+5}" rx="13" ry="5"/><path d="M{x+1} {y+5}v17c0 7 26 7 26 0V5 M{x+1} {y+13}c0 7 26 7 26 0"/>',
  'SL':f'<rect x="{x+1}" y="{y+1}" width="25" height="25" rx="4"/><path d="M{x+6} {y+7}h15 M{x+6} {y+13}h10 M{x+6} {y+19}h13"/>',
  'ERP':f'<rect x="{x}" y="{y+3}" width="27" height="21" rx="3"/><path d="M{x+9} {y+3}v21 M{x+1} {y+10}h25"/>',
  'HANA':f'<ellipse cx="{x+14}" cy="{y+6}" rx="12" ry="5"/><path d="M{x+2} {y+6}v17c0 7 24 7 24 0V6"/>',
 }
 return f'<g stroke="{color}" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">{icons[kind]}</g>'
def picture(theme='dark',progress=0.0,animated=False):
 c=COLORS[theme]
 phase=min(5,int(progress*6))
 current=PHASES[phase]
 css=f"""
 <style>
  svg{{background:{c['bg']}}}
  .route{{fill:none;stroke-linecap:round;stroke-linejoin:round}}
  .step{{transition:opacity .3s}}
  .animated-route{{stroke-dasharray:10 10;animation:trace 2s linear infinite}}
  .active-ring{{animation:softPulse 2.3s ease-in-out infinite}}
  .indicator{{animation:blink 2.3s ease-in-out infinite}}
  @keyframes trace {{to{{stroke-dashoffset:-100}}}}
  @keyframes softPulse{{0%,100%{{opacity:.45}}50%{{opacity:1}}}}
  @keyframes blink{{0%,100%{{opacity:.45}}50%{{opacity:1}}}}
  @media (prefers-reduced-motion:reduce){{.animated-route,.active-ring,.indicator{{animation:none}}}}
 </style>"""
 parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="Arquitectura de integración empresarial: aplicaciones, API, middleware y SAP Business One">',css]
 parts += [rect(0,0,W,H,c['bg'],radius=0)]
 # Upper editorial header, reference-data label, and animated progress rail.
 parts += [rect(0,0,7,H,c['blue'],radius=0)]
 parts += [text(43,35,'GENER SUHUL  /  INGENIERÍA DE SOFTWARE',14,c['blue'],750,1.2)]
 parts += [text(43,99,'Integraciones empresariales',43,c['title'],750,-1)]
 parts += [text(45,137,'Aplicaciones  /  Servicios y seguridad  /  Middleware  /  SAP Business One',17,c['body'],500)]
 parts += [rect(1044,35,350,83,c['surface'],c['edge'],10,1)]
 parts += [text(1060,60,'SECUENCIA DE UNA SOLICITUD',12,c['muted'],650,1)]
 parts += [text(1060,88,current[0],24,c['title'],750)]
 parts += [text(1060,108,current[1],12,c['body'],500)]
 parts += [f'<line x1="43" y1="161" x2="1397" y2="161" stroke="{c["edge"]}" stroke-width="1"/>']
 # Four architectural zones.
 for x,right,num,title,desc in AREAS:
  parts += [rect(x,180,right-x,553,c['surface'],c['edge'],14)]
  parts += [rect(x+14,197,39,29,c['smallBg'],radius=7)]
  parts += [text(x+22,217,num,13,c['blue'],700)]
  parts += [text(x+63,217,title,16,c['title'],750,.5)]
  parts += [text(x+16,249,desc,14,c['muted'],500)]
  parts += [f'<line x1="{x+16}" y1="266" x2="{right-16}" y2="266" stroke="{c["edge"]}" stroke-width="1"/>']
 # Wires and connections are behind the nodes, do not cross titles.
 for name,(d,kind) in PATHS.items():
  col=c['line'] if kind in ('main','return') else c['lineFade']
  dash='stroke-dasharray="6 7"' if kind=='return' else ''
  sw=2 if kind in ('main','return') else 1.6
  parts += [f'<path d="{d}" class="route" stroke="{col}" stroke-width="{sw}" {dash} />']
 # Route badges.
 badges=[(334,350,'HTTPS'),(655,351,'REST'),(990,351,'SL')]
 for x,y,label in badges:
  parts += [rect(x-5,y-10,36 if label!='HTTPS' else 45,17,c['bg'],radius=4),text(x,y+2,label,10,c['muted'],700)]
 # Cards: each uses the same consistent rhythm, spacing and genuine functional icon.
 for ident,x,y,w,h,title,desc,accent,short in NODES:
  tint=c[accent];selected=ident in current[2]
  stroke=tint if selected else c['edge']
  parts += [rect(x+2,y+4,w,h,c['shadow'],radius=11)]
  parts += [rect(x,y,w,h,c['card'],stroke,11,2 if selected else 1)]
  parts += [rect(x,y+15,4,h-30,tint, radius=1)]
  parts += [icon_path(short,x+16,y+23,tint)]
  parts += [text(x+54,y+39,title,17,c['title'],720,-.1)]
  parts += [text(x+54,y+69,desc,13,c['body'],450)]
  parts += [f'<circle cx="{x+w-19}" cy="{y+20}" r="4" fill="{c["green"] if selected else c["edge"]}"/>']
  if selected:
   parts += [rect(x+8,y+7,w-16,h-14,'none',tint,9,1)]
 # Stage timeline intentionally changes several elements (step, nodes, routes, label, progress).
 parts += [rect(43,750,1355,48,c['footer'],c['edge'],8)]
 steptext=['01 SOLICITUD','02 SEGURIDAD','03 MIDDLEWARE','04 SAP','05 HANA','06 RESPUESTA']
 for i,label in enumerate(steptext):
  x=63+i*224
  parts += [f'<circle cx="{x}" cy="773" r="5" fill="{c["teal"] if i<=phase else c["lineFade"]}"/>']
  parts += [text(x+15,779,label,13,c['title'] if i==phase else c['muted'],720 if i==phase else 500)]
 # Active path overlay. For animated SVG, individual paths and active card accents alternate
 # through a coordinated 6s cycle; for GIF, each frame's phase is rendered explicitly.
 for name in current[3]:
  d=PATHS[name][0]
  parts += [f'<path d="{d}" class="route {"animated-route" if animated else ""}" stroke="{c["teal"]}" stroke-width="4" opacity=".92"/>']
 # Progress advances with each frame (not only a traveling dot).
 parts += [rect(43,739,1355,3,c['edgeSoft'],radius=1)]
 parts += [rect(43,739,int(1355*(progress%1)),3,c['teal'],radius=1)]
 parts += ['</svg>']
 return ''.join(parts)
def svg_animated(theme):
 # Multiple synchronized visual changes: six phase panels, route highlights, status label,
 # card rings and progress track, using SMIL as graceful browser-native enhancement.
 c=COLORS[theme]
 base=picture(theme,0,False)
 base=base.replace('</svg>','')
 # Hide static label in this dynamic version by overlaying matching background
 # with stage labels that animate opacity at staggered intervals.
 phases=[]
 for idx,p in enumerate(PHASES):
  start=idx
  phases.append(f'<g opacity="0"><rect x="1055" y="63" width="325" height="47" fill="{c["surface"]}"/>'
    + text(1060,88,p[0],24,c['title'],750)
    + text(1060,108,p[1],12,c['body'],500)
    + f'<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.88;1" dur="1s" begin="{start}s;phase{idx}.end+5s" repeatCount="indefinite" id="phase{idx}"/></g>')
  for key in p[3]:
   d=PATHS[key][0]
   phases.append(f'<path d="{d}" class="route" fill="none" stroke="{c["teal"]}" stroke-width="4" stroke-linecap="round" opacity="0">'
      f'<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.85;1" dur="1s" begin="{start}s" repeatCount="indefinite" />'
      f'<animate attributeName="stroke-dashoffset" from="80" to="0" dur="1s" begin="{start}s" repeatCount="indefinite" />'
      '</path>')
  for id in p[2]:
   item=next(n for n in NODES if n[0]==id)
   _,x,y,w,h,*rest=item
   phases.append(f'<rect x="{x+8}" y="{y+7}" width="{w-16}" height="{h-14}" rx="9" fill="none" stroke="{c["teal"]}" stroke-width="2" opacity="0">'
      f'<animate attributeName="opacity" values="0;.85;.85;0" keyTimes="0;.08;.88;1" dur="1s" begin="{start}s" repeatCount="indefinite"/></rect>')
 return base+''.join(phases)+'</svg>'
def render(theme):
 from PIL import Image
 frames=[]
 for i in range(FRAMES):
  progress=(i+0.01)/FRAMES
  xml=picture(theme,progress,False)
  png=cairosvg.svg2png(bytestring=xml.encode(),output_width=1056,output_height=594)
  im=Image.open(io.BytesIO(png)).convert('RGB')
  frames.append(im.quantize(colors=80,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE))
 target=ASSETS/f'profile-{theme}.gif'
 frames[0].save(target,save_all=True,append_images=frames[1:],loop=0,duration=FRAME_MS,disposal=2,optimize=True)
 print(f'{target} {target.stat().st_size} bytes, {FRAMES} frames')
 (ASSETS/f'architecture-{theme}.svg').write_text(svg_animated(theme),encoding='utf-8')
 # The website exposes the actual animated SVG, while README uses the GIF fallback.
 (PORTFOLIO/f'architecture-{theme}.svg').write_text(svg_animated(theme),encoding='utf-8')
 print(f'SVG architecture-{theme}.svg done')
if __name__=='__main__':
 for theme in ('dark','light'):
  render(theme)
