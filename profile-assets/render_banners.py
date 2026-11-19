"""Animated enterprise integration diagram for the GitHub profile README.
The displayed flow is conceptual, not real-time production telemetry.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W,H=1280,700
FRAMES=100
DURATION=65
OUT=Path(__file__).resolve().parents[1]/'assets'
OUT.mkdir(parents=True,exist_ok=True)
FONTS={
  'regular':'/usr/share/fonts/opentype/inter/Inter-Regular.otf',
  'medium':'/usr/share/fonts/opentype/inter/Inter-Medium.otf',
  'semibold':'/usr/share/fonts/opentype/inter/Inter-SemiBold.otf',
  'bold':'/usr/share/fonts/opentype/inter/Inter-Bold.otf',
}
_font={}
def ft(sz,kind='regular'):
    k=(sz,kind)
    if k not in _font:
        path=Path(FONTS[kind])
        if not path.exists():
            fallback='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if kind in ('bold','semibold') else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
            path=Path(fallback)
        _font[k]=ImageFont.truetype(str(path),sz)
    return _font[k]
THEMES={
 'dark':{
    'bg':'#10151B','title':'#F0F4F8','body':'#B8C6D3','muted':'#8899AA',
    'lane':'#151E27','lane2':'#18222C','edge':'#344250','line':'#566C7C',
    'node':'#202C37','nodeedge':'#445766','accent':'#8FB1EE',
    'teal':'#4ECABA','bright':'#EFF7FF','stage':'#263A4C',
    'main':'#5F8BBA','shadow':'#0E1419','running':'#4ECABA',
  },
 'light':{
    'bg':'#F8FAFC','title':'#0B2D6B','body':'#495E74','muted':'#71839B',
    'lane':'#EDF2F8','lane2':'#F0F5FA','edge':'#D4DFEA','line':'#9AABC1',
    'node':'#FFFFFF','nodeedge':'#C5D4E5','accent':'#2563EB',
    'teal':'#14B8A6','bright':'#0B2D6B','stage':'#E4EDF8',
    'main':'#597DAE','shadow':'#E8EEF6','running':'#0D9488',
  }
}
COLUMNS=[
 (36,315,'01','APLICACIONES'),(343,627,'02','SERVICIOS'),
 (655,940,'03','INTEGRACIÓN'),(968,1244,'04','ERP Y DATOS')
]
NODES={
 'pwa':(55,220,296,306,'PWA / CAMPO','React · TypeScript · Offline','app'),
 'admin':(55,382,296,468,'PANEL ADMIN','Cotizaciones · Seguimiento','app'),
 'api':(362,220,609,306,'API DE APLICACIÓN','REST · Validaciones','services'),
 'auth':(362,382,609,468,'IDENTIDAD Y ROLES','JWT · Autorizaciones','services'),
 'audit':(362,543,609,629,'AUDITORÍA','Eventos · Errores · Historial','services'),
 'worker':(674,220,921,306,'MIDDLEWARE .NET','Reglas · Adaptación SAP','integration'),
 'sync':(674,382,921,468,'SINCRONIZACIÓN','Reintentos · Control de cambios','integration'),
 'stage':(674,543,921,629,'POSTGRESQL','Staging · Consultas','integration'),
 'sl':(986,220,1224,306,'SERVICE LAYER','REST interno · Red privada','erp'),
 'sap':(986,382,1224,468,'SAP BUSINESS ONE','Documentos · Maestros','erp'),
 'hana':(986,543,1224,629,'SAP HANA','Datos empresariales','erp'),
}
PATHS={
 'pwa_api':[(296,263),(362,263)],
 'admin_api':[(296,424),(329,424),(329,263),(362,263)],
 'api_worker':[(609,263),(674,263)],
 'worker_sl':[(921,263),(986,263)],
 'sl_sap':[(1105,306),(1105,382)],
 'sap_hana':[(1105,468),(1105,543)],
 'api_auth':[(485,306),(485,382)],
 'auth_audit':[(485,468),(485,543)],
 'worker_sync':[(798,306),(798,382)],
 'sync_stage':[(798,468),(798,543)],
 'sync_sl':[(921,424),(954,424),(954,263),(986,263)],
 'audit_stage':[(609,586),(674,586)],
}
# One packet travels the documented sequence, including return paths.
FLOW=[
 ('pwa_api',1,'01 / Solicitud desde PWA'),
 ('api_worker',1,'02 / Validaciones de API'),
 ('worker_sl',1,'03 / Adaptador SAP'),
 ('sl_sap',1,'04 / Petición al ERP'),
 ('sap_hana',1,'05 / Lectura de datos'),
 ('sap_hana',-1,'06 / Resultado de la consulta'),
 ('sl_sap',-1,'07 / Respuesta del ERP'),
 ('worker_sl',-1,'08 / Normalización'),
 ('api_worker',-1,'09 / Respuesta de API'),
 ('pwa_api',-1,'10 / Datos para la aplicación'),
]
def write(draw,xy,txt,color,size=16,weight='regular'):
    draw.text(xy,txt,font=ft(size,weight),fill=color)
def poly_point(points,t):
    segments=[]
    total=0
    for a,b in zip(points,points[1:]):
        length=abs(b[0]-a[0])+abs(b[1]-a[1])
        segments.append((a,b,length))
        total+=length
    at=t*total
    for a,b,length in segments:
        if at<=length or (a,b,length)==segments[-1]:
            fraction=max(0,min(1,at/max(1,length)))
            return a[0]+(b[0]-a[0])*fraction,a[1]+(b[1]-a[1])*fraction
        at-=length
    return points[-1]
def trace(draw,pts,color,width=2):
    draw.line(pts,fill=color,width=width,joint='curve')
def background(c):
    im=Image.new('RGB',(W,H),c['bg'])
    d=ImageDraw.Draw(im)
    d.rectangle((0,0,6,H),fill=c['accent'])
    write(d,(38,22),'GENER ALEXANDER SUHUL AMADOR',c['accent'],15,'bold')
    write(d,(39,56),'Arquitectura de integración empresarial',c['title'],36,'bold')
    write(d,(41,108),'Aplicaciones web  /  Servicios privados  /  SAP Business One  /  Datos',c['body'],16,'medium')
    d.line((40,146,1241,146),fill=c['edge'],width=2)
    for i,(left,right,n,label) in enumerate(COLUMNS):
        fill=c['lane'] if i%2==0 else c['lane2']
        d.rounded_rectangle((left,158,right,651),radius=13,fill=fill,outline=c['edge'],width=2)
        d.rounded_rectangle((left+12,173,left+48,199),radius=5,fill=c['stage'])
        write(d,(left+22,178),n,c['accent'],13,'bold')
        write(d,(left+58,179),label,c['title'],15,'bold')
        d.line((left+18,210,right-18,210),fill=c['edge'],width=1)
    for id,pts in PATHS.items():
        trace(d,pts,c['line'],2)
        a,b=pts[-2],pts[-1]
        ex,ey=b
        if b[0]>a[0]:arrow=[(ex-8,ey-5),(ex,ey),(ex-8,ey+5)]
        elif b[0]<a[0]:arrow=[(ex+8,ey-5),(ex,ey),(ex+8,ey+5)]
        elif b[1]>a[1]:arrow=[(ex-5,ey-8),(ex,ey),(ex+5,ey-8)]
        else:arrow=[(ex-5,ey+8),(ex,ey),(ex+5,ey+8)]
        trace(d,arrow,c['line'],2)
    for key,(x0,y0,x1,y1,title,desc,group) in NODES.items():
        d.rounded_rectangle((x0+1,y0+3,x1+1,y1+3),radius=8,fill=c['shadow'])
        d.rounded_rectangle((x0,y0,x1,y1),radius=8,fill=c['node'],outline=c['nodeedge'],width=2)
        d.rectangle((x0,y0+14,x0+4,y1-14),fill=c['teal'] if group in ('integration','erp') else c['accent'])
        write(d,(x0+17,y0+16),title,c['title'],18,'bold')
        write(d,(x0+17,y0+48),desc,c['body'],13,'regular')
    write(d,(112,335),'HTTPS',c['muted'],12,'medium')
    write(d,(424,335),'JWT / ROLES',c['muted'],12,'medium')
    write(d,(733,335),'REST PRIVADO',c['muted'],12,'medium')
    d.line((40,673,1240,673),fill=c['edge'],width=1)
    write(d,(42,678),'ESQUEMA DE REFERENCIA · FLUJO DE SOLICITUD Y RESPUESTA',c['muted'],12,'medium')
    return im
def render_frame(base,c,i):
    im=base.copy()
    d=ImageDraw.Draw(im)
    per=FRAMES//len(FLOW)
    phase=min(len(FLOW)-1,i//per)
    fraction=(i%per)/(per-1)
    name,direction,label=FLOW[phase]
    points=PATHS[name]
    if direction<0:points=list(reversed(points))
    x,y=poly_point(points,fraction)
    d.line(points,fill=c['main'],width=4,joint='curve')
    d.ellipse((x-10,y-10,x+10,y+10),fill=c['lane'],outline=c['teal'],width=2)
    d.ellipse((x-4,y-4,x+4,y+4),fill=c['teal'])
    d.rounded_rectangle((895,95,1238,131),radius=6,fill=c['stage'])
    write(d,(908,104),label,c['title'],13,'semibold')
    for j in range(len(FLOW)):
        x0=900+j*32
        d.rounded_rectangle((x0,139,x0+25,142),radius=1,fill=c['teal'] if j<=phase else c['line'])
    return im
def render(theme):
    c=THEMES[theme]
    base=background(c)
    palette=base.quantize(colors=128,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
    frames=[]
    for i in range(FRAMES):
        frames.append(render_frame(base,c,i).quantize(palette=palette,dither=Image.Dither.NONE))
    target=OUT/f'profile-{theme}.gif'
    # disposal=1 plus shared palette permits GitHub-friendly delta-frame compression.
    frames[0].save(target,save_all=True,append_images=frames[1:],loop=0,duration=DURATION,disposal=1,optimize=True)
    print(f'{target}: {target.stat().st_size} bytes, {FRAMES} frames')
if __name__=='__main__':
    for name in ('dark','light'):
        render(name)
