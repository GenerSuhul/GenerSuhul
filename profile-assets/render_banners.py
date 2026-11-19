"""Gener Suhul profile — locally rendered animated GIFs for both GitHub themes."""
from pathlib import Path
from math import pi,sin
from PIL import Image,ImageDraw,ImageFont

W,H,FRAMES=960,260,24
OUT=Path(__file__).resolve().parents[1]/'assets'
OUT.mkdir(exist_ok=True)
THEMES={
 'dark':dict(bg='#10151B',text='#F8FAFC',secondary='#B4C1CE',line='#3C4D5F',card='#19222B',card_edge='#425365',accent='#88ADEF',teal='#4ECABA',button='#315D9D'),
 'light':dict(bg='#F8FAFC',text='#0B2D6B',secondary='#52657B',line='#D5DFEA',card='#FFFFFF',card_edge='#CAD6E3',accent='#2563EB',teal='#14B8A6',button='#2563EB')
}
def fonts():
    paths=[
      ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'),
      ('C:/Windows/Fonts/arialbd.ttf','C:/Windows/Fonts/arial.ttf')]
    for bold,regular in paths:
        if Path(bold).exists() and Path(regular).exists():
            return lambda n,b=False:ImageFont.truetype(bold if b else regular,n)
    return lambda n,b=False:ImageFont.load_default()
font=fonts()

def put(d,xy,text,fill,size,bold=False):
    d.text(xy,text,font=font(size,bold),fill=fill)

def node(d,xy,w,title,c,selected=False):
    x,y=xy
    d.rounded_rectangle((x,y,x+w,y+42),radius=7,fill=c['button'] if selected else c['card'],outline=c['accent'] if selected else c['card_edge'],width=2 if selected else 1)
    bb=d.textbbox((0,0),title,font=font(13,True))
    d.text((x+(w-(bb[2]-bb[0]))//2,y+12),title,fill='#FFFFFF' if selected else c['text'],font=font(13,True))

def frame(theme,tick):
    c=THEMES[theme]
    im=Image.new('RGB',(W,H),c['bg']);d=ImageDraw.Draw(im)
    d.rectangle((0,0,5,H),fill=c['accent'])
    d.line((38,43,922,43),fill=c['line'],width=1)
    put(d,(42,18),'GENER SUHUL  /  SOFTWARE ENGINEERING',c['accent'],11,True)
    put(d,(39,70),'Gener Alexander',c['text'],39,True)
    put(d,(39,118),'Suhul Amador',c['text'],39,True)
    put(d,(42,177),'Desarrollo backend e integraciones',c['text'],17,True)
    put(d,(42,205),'.NET  /  Java  /  TypeScript  /  SAP Business One',c['secondary'],12)
    d.line((42,240,565,240),fill=c['line'],width=1)
    d.line((42,240,130,240),fill=c['teal'],width=3)
    d.rounded_rectangle((584,58,920,239),radius=12,fill=c['card'],outline=c['card_edge'],width=1)
    put(d,(600,72),'SISTEMAS / INTEGRACIÓN',c['secondary'],10,True)
    d.line((705,164,728,164),fill=c['line'],width=2)
    d.line((806,164,814,164,814,133,827,133),fill=c['line'],width=2,joint='curve')
    d.line((806,164,814,164,814,202,827,202),fill=c['line'],width=2,joint='curve')
    node(d,(611,143),94,'CLIENTE',c)
    node(d,(728,143),78,'API',c,True)
    node(d,(827,112),83,'SAP B1',c)
    node(d,(827,181),83,'SQL',c)
    cycle=tick/FRAMES
    x=704+24*cycle
    d.ellipse((x-3,161,x+3,167),fill=c['teal'])
    for x,y,color in [(814,164-31*cycle,c['accent']),(814,164+38*((cycle+.38)%1),c['teal'])]:
        d.ellipse((x-3,y-3,x+3,y+3),fill=color)
    d.ellipse((893,76,901,84),fill=c['teal'] if sin(tick*2*pi/FRAMES)>.0 else c['secondary'])
    return im

def render(theme):
    frames=[frame(theme,i).quantize(colors=96,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE) for i in range(FRAMES)]
    target=OUT/f'profile-{theme}.gif'
    frames[0].save(target,save_all=True,append_images=frames[1:],loop=0,duration=100,disposal=2,optimize=True)
    print(f'{target}: {target.stat().st_size} bytes, {FRAMES} frames')
if __name__=='__main__':
    for theme in ('dark','light'):
        render(theme)
