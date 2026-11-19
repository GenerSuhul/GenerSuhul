"""Illustrated five-part API diagram for Gener Suhul's GitHub profile.

The vector source uses native SVG animations. Animated GIFs are rendered from
the same scene because GitHub's image proxy does not reliably play SVG motion.
No production telemetry or diagrams with invented infrastructure.
"""
import io
import math
from pathlib import Path

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
PORTFOLIO = ROOT / "portfolio"
ASSETS.mkdir(exist_ok=True)
PORTFOLIO.mkdir(exist_ok=True)

W, H = 1200, 790
FRAMES = 48
FRAME_MS = 125

THEMES = {
    "dark": {
        "bg": "#111820", "ink": "#F2F6FA", "muted": "#AFC0D0",
        "soft": "#263746", "card": "#192633", "accent": "#8EAFF1",
        "strong": "#4F7FD4", "teal": "#51CCBB", "fine": "#405467",
        "faint": "#253747", "line": "#8299B6", "inverse": "#111820",
        "highlight": "#C0D2F4", "browser": "#294361", "light": "#F8FAFC",
    },
    "light": {
        "bg": "#F8FAFC", "ink": "#0B2D6B", "muted": "#526C84",
        "soft": "#E9F0F8", "card": "#FFFFFF", "accent": "#2563EB",
        "strong": "#275FCD", "teal": "#14B8A6", "fine": "#AABDD0",
        "faint": "#E0E9F2", "line": "#557CA9", "inverse": "#FFFFFF",
        "highlight": "#739FF1", "browser": "#E0EBFF", "light": "#F8FAFC",
    },
}

def txt(x, y, text, color, size=18, weight=500, anchor=None):
    anchor_attr = f' text-anchor="{anchor}"' if anchor else ""
    return (f'<text x="{x}" y="{y}" fill="{color}" font-family="Inter, Arial, sans-serif"'
            f' font-size="{size}" font-weight="{weight}"{anchor_attr}>{text}</text>')

def gear_points(cx, cy, outer, teeth, angle):
    a = math.radians(angle)
    p = []
    for n in range(teeth):
        start = a + n * math.pi * 2 / teeth
        for k, rad in ((0,outer*0.84),(.18,outer),(.52,outer),(.70,outer*0.84)):
            t = start + k * math.pi * 2 / teeth
            p.append(f'{cx+math.cos(t)*rad:.2f},{cy+math.sin(t)*rad:.2f}')
    return ' '.join(p)

def circle(cx,cy,r,fill,stroke="none",width=1):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>'

def arrow(d, color, width=3, dashed=False, offset=0, motion=False, period="3s"):
    attrs = f'stroke-dasharray="9 12" stroke-dashoffset="{offset:.2f}"' if dashed else ''
    anim = (f'<animate attributeName="stroke-dashoffset" from="0" to="-42" '
            f'dur="{period}" repeatCount="indefinite"/>') if motion and dashed else ''
    return (f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}"'
            f' stroke-linecap="round" stroke-linejoin="round" {attrs}>{anim}</path>')

def icon_computer(c, phase, animate):
    a,b=c["accent"],c["ink"]
    v=[]
    v.append(f'<g stroke="{a}" stroke-width="3.6" stroke-linejoin="round">')
    v.append(f'<rect x="96" y="104" width="245" height="151" rx="10" fill="{c["soft"]}"/>')
    v.append(f'<rect x="108" y="116" width="221" height="127" rx="5" fill="{c["card"]}" stroke="none"/>')
    v.append(f'<rect x="108" y="116" width="221" height="26" rx="4" fill="{a}" stroke="none"/>')
    v.append(f'<path d="M200 256V279M165 281H280" fill="none" stroke="{a}" stroke-width="8" stroke-linecap="round"/>')
    v.append("</g>")
    for i in range(3):
        v.append(circle(120+i*11,129,3,c["inverse"]))
    v.append(f'<rect x="119" y="155" width="81" height="69" rx="4" fill="{c["strong"]}" opacity=".75"/>')
    v.append(f'<rect x="208" y="155" width="104" height="17" rx="3" fill="{c["soft"]}"/>')
    v.append(f'<rect x="208" y="179" width="104" height="17" rx="3" fill="{a}" opacity="{.20+.18*(1+math.sin(phase*2*math.pi))/2:.2f}"/>')
    v.append(f'<rect x="208" y="203" width="80" height="17" rx="3" fill="{c["teal"]}" opacity=".8"/>')
    v.append(f'<rect x="286" y="150" width="75" height="135" rx="9" fill="{c["card"]}" stroke="{a}" stroke-width="3.5"/>')
    v.append(f'<rect x="296" y="163" width="55" height="101" rx="4" fill="{c["soft"]}"/>')
    v.append(f'<rect x="303" y="172" width="41" height="19" rx="3" fill="{a}"/>')
    for y in (199,216,233):
        v.append(f'<rect x="303" y="{y}" width="41" height="9" rx="3" fill="{c["strong"]}" opacity=".68"/>')
    v.append(circle(324,275,3,a))
    return ''.join(v)

def icon_cloud(c, phase, animate):
    a=c["accent"];teal=c["teal"]
    cloud = [
        f'<circle cx="949" cy="180" r="81" fill="none" stroke="{a}" stroke-width="2.6" opacity=".6"/>',
        f'<ellipse cx="949" cy="180" rx="38" ry="81" fill="none" stroke="{a}" stroke-width="2" opacity=".4"/>',
        f'<path d="M869 181H1030M883 151H1015M883 210H1015" fill="none" stroke="{a}" stroke-width="2" opacity=".4"/>',
        f'<path d="M846 247C834 226 839 199 857 185C858 160 879 145 905 146C924 117 970 116 991 145C1023 142 1045 162 1049 184C1075 191 1084 213 1076 233C1072 247 1058 250 1034 250H873C862 250 853 250 846 247Z" fill="{c["soft"]}" stroke="{a}" stroke-width="3.6" stroke-linejoin="round"/>',
    ]
    for cx,cy,r,n,ang,col in ((941,193,38,10,phase*36,a),(1008,216,24,8,-phase*45,teal)):
        verts=gear_points(cx,cy,r,n,ang)
        gear=f'<polygon points="{verts}" fill="{col}" opacity=".93"/>'
        if animate:
            end=360/n if cx==941 else -360/n
            gear=f'<g>{gear}<animateTransform attributeName="transform" type="rotate" from="0 {cx} {cy}" to="{end} {cx} {cy}" dur="6s" repeatCount="indefinite"/></g>'
        cloud.append(gear)
        cloud.append(circle(cx,cy,r*.40,c["soft"]))
    return ''.join(cloud)

def icon_api(c,phase,animate):
    cx,cy=600,415
    outer=103
    p=gear_points(cx,cy,outer,12,phase*30)
    g=f'<polygon points="{p}" fill="{c["accent"]}"/>'
    if animate:
        g=f'<g>{g}<animateTransform attributeName="transform" type="rotate" from="0 {cx} {cy}" to="30 {cx} {cy}" dur="6s" repeatCount="indefinite"/></g>'
    return (circle(cx,cy,115,c["teal"],width=0).replace(f'fill="{c["teal"]}"', 'fill="none" stroke-dasharray="3 12" opacity=".35"')
         + g + circle(cx,cy,72,c["bg"])
         + circle(cx,cy,63,'none',c["fine"],3)
         + txt(cx,cy+17,"API",c["ink"],55,750,"middle"))

def icon_server(c,phase,animate):
    v=[]
    v.append(f'<rect x="120" y="547" width="215" height="148" rx="9" fill="{c["soft"]}" stroke="{c["accent"]}" stroke-width="3"/>')
    for i in range(3):
        y=559+i*44
        v.append(f'<rect x="133" y="{y}" width="188" height="35" rx="4" fill="{c["card"]}" stroke="{c["fine"]}" stroke-width="1.5"/>')
        v.append(f'<rect x="145" y="{y+12}" width="87" height="8" rx="4" fill="{c["accent"]}" opacity=".65"/>')
        for j in range(3):
            opacity=(.45+.55*(1+math.sin(phase*2*math.pi+i*1.6+j*.8))/2)
            led=c["teal"] if j==0 else c["accent"]
            dot=circle(271+j*15,y+17,4,led).replace('/>',f' opacity="{opacity:.2f}"/>')
            if animate and j==0:
                dot=dot.replace('/>',f'><animate attributeName="opacity" values=".3;1;.3" dur="{1.6+i*.25:.2f}s" repeatCount="indefinite"/></circle>')
            v.append(dot)
    v.append(f'<rect x="292" y="604" width="72" height="102" rx="6" fill="{c["soft"]}" stroke="{c["strong"]}" stroke-width="3"/>')
    for i in range(4):
        v.append(f'<rect x="303" y="{615+i*19}" width="50" height="11" rx="2" fill="{c["strong"]}" opacity="{.5+.1*i:.2f}"/>')
    return ''.join(v)

def icon_database(c,phase,animate):
    v=[f'<rect x="861" y="575" width="240" height="124" fill="{c["soft"]}" stroke="{c["accent"]}" stroke-width="3"/>']
    v.append(f'<ellipse cx="981" cy="575" rx="120" ry="29" fill="{c["soft"]}" stroke="{c["accent"]}" stroke-width="3.2"/>')
    for i,y in enumerate((615,656,699)):
        v.append(f'<path d="M861 {y}C861 {y+32} 1101 {y+32} 1101 {y}" fill="none" stroke="{c["strong"]}" stroke-width="3.1"/>')
        opacity=.47+.42*(1+math.sin(phase*2*math.pi+i*1.4))/2
        row=f'<rect x="907" y="{y+3}" width="148" height="7" rx="3" fill="{c["teal"]}" opacity="{opacity:.2f}"/>'
        if animate:
            row=row.replace('/>',f'><animate attributeName="opacity" values=".30;.92;.30" dur="{2+i*.32:.2f}s" repeatCount="indefinite"/></rect>')
        v.append(row)
    v.append(f'<path d="M861 575V702M1101 575V702" stroke="{c["accent"]}" stroke-width="3.1"/>')
    return ''.join(v)

def arrows_and_circuits(c,phase,animate):
    v=[]
    # Only peripheral decorative traces, never across text or illustrations.
    tracks=["M0 96H70L120 146","M0 335H83L131 383","M1200 77H1134L1090 121",
            "M1200 358H1120L1088 390","M0 745H78L118 705",
            "M1200 742H1145L1105 702"]
    for p in tracks:
        v.append(f'<path d="{p}" stroke="{c["faint"]}" stroke-width="2" fill="none"/>')
    for x,y in ((70,96),(83,335),(1134,77),(1120,358),(78,745),(1145,742)):
        v.append(circle(x,y,5,c["faint"]))
    # Request and response sit between app and cloud, not over either illustration.
    req,resp = c["accent"],c["teal"]
    v.append(txt(585,159,'Solicitud',c["muted"],15,650,'middle'))
    v.append(arrow("M380 179H817",req,3.4,True,-42*phase,animate))
    v.append(f'<path d="M808 172L822 179L808 186" fill="none" stroke="{req}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>')
    v.append(txt(585,237,'Respuesta',c["muted"],15,650,'middle'))
    v.append(arrow("M817 251H380",resp,3.2,True,42*phase,animate,"4s"))
    v.append(f'<path d="M391 244L377 251L391 258" fill="none" stroke="{resp}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>')
    # Curved routing. Arrows terminate outside icons and labels.
    for d in ("M515 445C460 459 430 532 364 583","M853 585C792 539 766 464 687 442",
              "M987 284C1070 365 1073 473 1033 531"):
        v.append(arrow(d,c["line"],3.0,True,-42*phase,animate))
    v.append(f'<path d="M369 572L361 587L379 584M690 451L680 440L697 441M1024 523L1034 535L1042 520" fill="none" stroke="{c["line"]}" stroke-width="3" stroke-linecap="round"/>')
    # Server-to-database path with a small code glyph in the gap.
    v.append(arrow("M367 656H831",c["teal"],3.0,True,-42*phase,animate,"4s"))
    v.append(f'<path d="M820 650L835 656L820 663" fill="none" stroke="{c["teal"]}" stroke-width="3" stroke-linecap="round"/>')
    v.append(f'<rect x="566" y="627" width="68" height="58" rx="11" fill="{c["bg"]}" stroke="{c["teal"]}" stroke-width="2.5"/>')
    v.append(txt(600,666,'&lt;/&gt;',c["teal"],24,700,'middle'))
    return ''.join(v)

def scene(theme,phase,animated=False):
    c=THEMES[theme]
    parts=[
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="Arquitectura de integración: aplicación, nube, API, servidor y base de datos">',
        f'<rect width="{W}" height="{H}" fill="{c["bg"]}"/>',
        f'<rect x="0" y="0" width="6" height="{H}" fill="{c["accent"]}"/>',
        txt(50,40,"GENER SUHUL  /  INTEGRACIONES",c["accent"],13,750),
        f'<path d="M50 57H1150" stroke="{c["faint"]}" stroke-width="1.5"/>',
        arrows_and_circuits(c,phase,animated),
        icon_computer(c,phase,animated),
        icon_cloud(c,phase,animated),
        icon_api(c,phase,animated),
        icon_server(c,phase,animated),
        icon_database(c,phase,animated),
        txt(230,311,"Aplicación",c["ink"],25,700,"middle"),
        txt(230,339,"Web · PWA · Ventas",c["muted"],15,500,"middle"),
        txt(960,311,"Servicios en la nube",c["ink"],25,700,"middle"),
        txt(960,339,"Servicios privados · Integración",c["muted"],15,500,"middle"),
        txt(600,550,"Integración mediante API",c["ink"],24,700,"middle"),
        txt(236,744,"Servidor / Middleware",c["ink"],24,700,"middle"),
        txt(236,770,".NET · Java · Node.js",c["muted"],15,500,"middle"),
        txt(978,744,"Bases de datos",c["ink"],24,700,"middle"),
        txt(978,770,"PostgreSQL · SAP HANA",c["muted"],15,500,"middle"),
        '</svg>',
    ]
    return ''.join(parts)

def compact_scene(theme, phase):
    """Low-height header for GitHub: information first, illustration second."""
    c = THEMES[theme]
    bg, ink, mute, accent, teal = c["bg"], c["ink"], c["muted"], c["accent"], c["teal"]
    card, stroke, soft = c["card"], c["fine"], c["soft"]
    t = phase * 2 * math.pi
    active = int(phase * 4) % 4
    x0, y0 = 914, 168
    teeth = gear_points(x0, y0, 43, 10, phase * 36)
    parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="330" viewBox="0 0 1200 330">',
        f'<rect width="1200" height="330" fill="{bg}"/>',
        f'<rect width="5" height="330" fill="{accent}"/>',
        f'<path d="M42 49H594" stroke="{c["faint"]}" stroke-width="1.4"/>',
        txt(43,35,"GENER SUHUL / DESARROLLO DE SOFTWARE",accent,12,750),
        txt(42,112,"Gener Alexander",ink,45,750),
        txt(42,164,"Suhul Amador",ink,45,750),
        txt(45,211,"Backend e integraciones empresariales",ink,19,650),
        txt(45,250,".NET   ·   Java   ·   TypeScript   ·   SAP B1",mute,15,500),
        f'<path d="M44 293H570" stroke="{c["faint"]}" stroke-width="2"/>',
        f'<path d="M44 293H152" stroke="{teal}" stroke-width="3.5"/>',
        # Vertical separator and quiet composition panel.
        f'<path d="M650 38V297" stroke="{c["faint"]}" stroke-width="1.4"/>',
        # Connection traces stay behind the icons and away from labels.
        f'<path d="M800 104C840 108 866 132 884 148" fill="none" stroke="{stroke}" stroke-width="2.5"/>',
        f'<path d="M1034 107C987 111 966 134 946 146" fill="none" stroke="{stroke}" stroke-width="2.5"/>',
        f'<path d="M797 252C839 246 853 212 881 190" fill="none" stroke="{stroke}" stroke-width="2.5"/>',
        f'<path d="M1037 253C985 247 970 214 948 191" fill="none" stroke="{stroke}" stroke-width="2.5"/>',
    ]
    # A short, progressing highlight follows each route in order.
    routes = [
        ("M800 104C840 108 866 132 884 148", (840,115)),
        ("M1034 107C987 111 966 134 946 146", (990,119)),
        ("M948 191C970 214 985 247 1037 253", (988,229)),
        ("M881 190C853 212 839 246 797 252", (843,229)),
    ]
    for i,(path,spot) in enumerate(routes):
        if active == i:
            parts.append(f'<path d="{path}" fill="none" stroke="{teal}" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="18 8" opacity=".85"/>')
            radius = 3.5 + 1.5 * (1 + math.sin(t*2))/2
            parts.append(circle(spot[0],spot[1],radius,teal))
    # Computer with phone.
    parts += [
        f'<rect x="724" y="55" width="104" height="65" rx="6" fill="{soft}" stroke="{accent}" stroke-width="2.8"/>',
        f'<rect x="733" y="63" width="86" height="48" rx="3" fill="{card}"/>',
        f'<rect x="733" y="63" width="86" height="9" rx="2" fill="{accent}" opacity=".9"/>',
        f'<rect x="739" y="79" width="37" height="26" rx="2" fill="{c["strong"]}" opacity=".75"/>',
        f'<rect x="782" y="79" width="30" height="7" rx="2" fill="{teal}" opacity=".8"/>',
        f'<rect x="782" y="91" width="27" height="6" rx="2" fill="{stroke}" opacity=".7"/>',
        f'<path d="M768 120v9m-23 1h46" stroke="{accent}" stroke-width="3" stroke-linecap="round"/>',
        f'<rect x="809" y="83" width="29" height="52" rx="5" fill="{card}" stroke="{accent}" stroke-width="2.3"/>',
        f'<rect x="814" y="91" width="19" height="31" rx="2" fill="{soft}"/>',
        f'<rect x="816" y="95" width="15" height="8" rx="1.5" fill="{teal}"/>',
        txt(775,149,"APP",mute,12,750,"middle"),
    ]
    # Cloud and two small gears.
    parts += [
        f'<path d="M1006 109c-9-14-3-29 11-34 4-16 24-24 39-14 16-13 42-5 45 17 22 1 31 26 14 41z" fill="{soft}" stroke="{accent}" stroke-width="2.8" stroke-linejoin="round"/>',
        f'<circle cx="1062" cy="88" r="18" fill="none" stroke="{accent}" stroke-width="2.5"/>',
        f'<path d="M1044 88h36m-18-18c-9 11-9 27 0 36m0-36c9 11 9 27 0 36" fill="none" stroke="{accent}" stroke-width="1.4" opacity=".6"/>',
        f'<polygon points="{gear_points(1074,92,12,7,phase*44)}" fill="{teal}"/>',
        circle(1074,92,4,soft),
        txt(1061,149,"CLOUD",mute,12,750,"middle"),
    ]
    # Main API mechanism. A rotating gear is visibly part of the system.
    parts += [
        f'<circle cx="{x0}" cy="{y0}" r="58" fill="none" stroke="{teal}" stroke-width="1.8" stroke-dasharray="3 10" opacity=".65"/>',
        f'<polygon points="{teeth}" fill="{accent}"/>',
        circle(x0,y0,29,bg),
        txt(x0,y0+8,"API",ink,21,750,"middle"),
    ]
    # Server racks with status LEDs.
    parts += [
        f'<rect x="727" y="236" width="109" height="58" rx="5" fill="{soft}" stroke="{accent}" stroke-width="2.5"/>',
    ]
    for i in range(3):
        y=241+i*17
        parts.extend([
            f'<rect x="734" y="{y}" width="95" height="13" rx="2.3" fill="{card}" stroke="{stroke}" stroke-width=".7"/>',
            f'<rect x="742" y="{y+4}" width="45" height="5" rx="2" fill="{accent}" opacity=".65"/>',
            circle(817,y+7,3,teal if (i+active)%2==0 else stroke),
        ])
    parts += [txt(781,313,"SERVIDOR",mute,12,750,"middle")]
    # Database cylinder with segmented disks.
    parts += [
        f'<rect x="1010" y="247" width="103" height="40" fill="{soft}"/>',
        f'<path d="M1010 249V285Q1061 305 1113 285V249" fill="{soft}" stroke="{accent}" stroke-width="2.5"/>',
        f'<ellipse cx="1062" cy="249" rx="52" ry="14" fill="{card}" stroke="{accent}" stroke-width="2.5"/>',
        f'<path d="M1010 266Q1062 286 1113 266M1010 284Q1062 304 1113 284" fill="none" stroke="{accent}" stroke-width="1.8"/>',
        txt(1062,313,"DATOS",mute,12,750,"middle"),
        '</svg>',
    ]
    return ''.join(parts)

def render(theme):
    # Keep full-size SVG illustration for the web portfolio.
    animated_svg = scene(theme, 0, True)
    (ASSETS / f'overview-{theme}.svg').write_text(animated_svg, encoding='utf-8')
    (PORTFOLIO / f'overview-{theme}.svg').write_text(animated_svg, encoding='utf-8')
    # Compact animated GIF only for GitHub's first-screen banner.
    frames = []
    for i in range(FRAMES):
        svg = compact_scene(theme, i / FRAMES)
        png = cairosvg.svg2png(bytestring=svg.encode(), output_width=960, output_height=264)
        im = Image.open(io.BytesIO(png)).convert('RGB')
        frames.append(im)
    pal = frames[0].quantize(colors=96, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    frames = [fr.quantize(palette=pal, dither=Image.Dither.NONE) for fr in frames]
    dest = ASSETS / f'profile-{theme}.gif'
    frames[0].save(dest, save_all=True, append_images=frames[1:], loop=0,
                   duration=FRAME_MS, disposal=1, optimize=True)
    print(f'{dest.name}: {dest.stat().st_size} bytes, 960x264, {FRAMES} frames')

if __name__=="__main__":
    for theme in ("dark","light"):
        render(theme)
