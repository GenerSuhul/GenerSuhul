"""Create a restrained, meaningful animated integration flow for GitHub README.

A four-second loop follows an application request through validation,
SAP Business One and the response. No fabricated real-time metrics.
"""
from pathlib import Path
from math import cos, pi
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT, FRAMES, FRAME_MS = 960, 250, 80, 50
OUTPUT = Path(__file__).resolve().parents[1] / "assets"
OUTPUT.mkdir(parents=True, exist_ok=True)

COLORS = {
    "dark": {
        "bg": "#10151B", "text": "#F2F5F8", "muted": "#AFBCC8",
        "line": "#394959", "surface": "#1B2631", "border": "#3B4A59",
        "accent": "#8FB1EE", "primary": "#2563EB", "teal": "#4ECABA",
        "line_on": "#4ECABA",
    },
    "light": {
        "bg": "#F8FAFC", "text": "#0B2D6B", "muted": "#51667F",
        "line": "#CBD6E4", "surface": "#FFFFFF", "border": "#D4DEE9",
        "accent": "#2563EB", "primary": "#2563EB", "teal": "#14B8A6",
        "line_on": "#14B8A6",
    },
}

FONT_DIR = Path("/usr/share/fonts/opentype/inter")
FONTS = {
    "bold": str(FONT_DIR / "InterDisplay-Bold.otf") if (FONT_DIR / "InterDisplay-Bold.otf").exists() else "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "medium": str(FONT_DIR / "InterDisplay-Medium.otf") if (FONT_DIR / "InterDisplay-Medium.otf").exists() else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "regular": str(FONT_DIR / "InterDisplay-Regular.otf") if (FONT_DIR / "InterDisplay-Regular.otf").exists() else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
}

def font(size, weight="regular"):
    return ImageFont.truetype(FONTS[weight], size)

STAGES = (
    ("APP", "01 / Solicitud"),
    ("API", "02 / Validación"),
    ("SAP B1", "03 / Consulta"),
    ("RESP.", "04 / Respuesta"),
)

def frame(theme, index):
    c = COLORS[theme]
    stage = index // (FRAMES // 4)
    phase = (index % (FRAMES // 4)) / (FRAMES // 4)
    im = Image.new("RGB", (WIDTH, HEIGHT), c["bg"])
    d = ImageDraw.Draw(im)

    # Static typographic layer: nothing here blinks or changes position.
    d.rectangle((0, 0, 5, HEIGHT), fill=c["accent"])
    d.line((39, 43, 925, 43), fill=c["line"], width=1)
    d.text((41, 15), "GENER SUHUL  /  DESARROLLO DE SOFTWARE", font=font(12, "bold"), fill=c["accent"])
    d.text((39, 67), "Gener Alexander", font=font(43, "bold"), fill=c["text"])
    d.text((39, 115), "Suhul Amador", font=font(43, "bold"), fill=c["text"])
    d.text((42, 181), "Backend e integraciones empresariales", font=font(17, "medium"), fill=c["text"])
    d.text((42, 213), ".NET  ·  Java  ·  TypeScript  ·  SAP Business One", font=font(12), fill=c["muted"])

    d.rounded_rectangle((560, 64, 930, 222), radius=9, fill=c["surface"], outline=c["border"], width=1)
    d.text((580, 78), "FLUJO DE INTEGRACIÓN", font=font(11, "bold"), fill=c["muted"])

    xs = [580, 664, 748, 832]
    box_w, y0, y1 = 77, 119, 166
    cy = (y0 + y1) / 2

    for i in range(3):
        left = xs[i] + box_w + 1
        right = xs[i + 1] - 1
        d.line((left, cy, right, cy), fill=c["line_on"] if stage > i else c["line"], width=3 if stage > i else 2)
        if stage == i:
            # Exactly one signal moves along the active connection, left to right.
            px = left + (right - left) * phase
            d.ellipse((px - 2.5, cy - 2.5, px + 2.5, cy + 2.5), fill=c["teal"])

    for j, (label, _) in enumerate(STAGES):
        selected = stage == j
        x = xs[j]
        if selected:
            d.rounded_rectangle((x - 3, y0 - 3, x + box_w + 3, y1 + 3), radius=8, outline=c["accent"], width=1)
        d.rounded_rectangle(
            (x, y0, x + box_w, y1), radius=6,
            fill=c["primary"] if selected else c["surface"],
            outline=c["accent"] if selected else c["border"],
            width=2 if selected else 1,
        )
        f = font(12, "bold")
        box = d.textbbox((0, 0), label, font=f)
        d.text((x + (box_w - (box[2] - box[0])) / 2, y0 + 15), label, font=f,
               fill="#FFFFFF" if selected else c["text"])

    d.text((580, 183), STAGES[stage][1], font=font(12, "medium"), fill=c["accent"])
    d.rounded_rectangle((580, 206, 910, 208), radius=1, fill=c["line"])
    end = 580 + (910 - 580) * ((index + 1) / FRAMES)
    d.rounded_rectangle((580, 206, end, 208), radius=1, fill=c["teal"])
    return im

def render(theme):
    frames = [
        frame(theme, i).quantize(colors=96, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
        for i in range(FRAMES)
    ]
    target = OUTPUT / f"profile-{theme}.gif"
    frames[0].save(
        target, save_all=True, append_images=frames[1:], loop=0,
        duration=FRAME_MS, disposal=2, optimize=True
    )
    print(f"{target.name}: {target.stat().st_size} bytes / {FRAMES} frames / 20 fps")

if __name__ == "__main__":
    for name in ("dark", "light"):
        render(name)
