import os
from PIL import Image, ImageDraw

# WeChat-style icon generator: 2px rounded stroke, monochrome outline icons

def draw_rounded_line(draw, xy, fill, width=4, cap_radius=2):
    x1, y1, x2, y2 = xy
    draw.line((x1, y1, x2, y2), fill=fill, width=width)
    # round caps
    r = width // 2
    draw.ellipse([x1-r, y1-r, x1+r, y1+r], fill=fill)
    draw.ellipse([x2-r, y2-r, x2+r, y2+r], fill=fill)

def make_home(size=81, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(4, s // 18)
    # house body
    d.polygon([
        (s*0.5, s*0.18), (s*0.15, s*0.45), (s*0.85, s*0.45)
    ], outline=color, width=w)
    # roof is already formed by polygon; add a small chimney maybe skip for simplicity
    # door
    d.rectangle([s*0.42, s*0.62, s*0.58, s*0.82], outline=color, width=w)
    # base
    d.line([(s*0.15, s*0.82), (s*0.85, s*0.82)], fill=color, width=w)
    return img

def make_category(size=81, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(4, s // 18)
    pad = s*0.18
    gap = s*0.06
    rect = s*0.28
    for i in range(2):
        for j in range(2):
            x1 = pad + j*(rect+gap)
            y1 = pad + i*(rect+gap)
            d.rounded_rectangle([x1, y1, x1+rect, y1+rect], radius=4, outline=color, width=w)
    return img

def make_video(size=81, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(4, s // 18)
    # rounded rectangle
    d.rounded_rectangle([s*0.12, s*0.25, s*0.75, s*0.75], radius=6, outline=color, width=w)
    # play triangle
    d.polygon([
        (s*0.42, s*0.38), (s*0.42, s*0.62), (s*0.62, s*0.50)
    ], fill=color)
    # small antenna/dot
    d.ellipse([s*0.78, s*0.30, s*0.88, s*0.40], outline=color, width=w)
    return img

def make_cart(size=81, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(4, s // 18)
    # handle
    d.arc([s*0.25, s*0.20, s*0.45, s*0.45], start=180, end=360, fill=color, width=w)
    # basket body
    d.rounded_rectangle([s*0.18, s*0.42, s*0.72, s*0.70], radius=6, outline=color, width=w)
    # wheels
    d.ellipse([s*0.28, s*0.72, s*0.38, s*0.82], outline=color, width=w)
    d.ellipse([s*0.52, s*0.72, s*0.62, s*0.82], outline=color, width=w)
    return img

def make_mine(size=81, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(4, s // 18)
    # head
    d.ellipse([s*0.32, s*0.18, s*0.68, s*0.48], outline=color, width=w)
    # shoulders
    d.arc([s*0.15, s*0.55, s*0.85, s*0.95], start=0, end=180, fill=color, width=w)
    return img

def make_customer(size=81, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(4, s // 18)
    # two people silhouettes (WeChat contacts style)
    # first person
    d.ellipse([s*0.25, s*0.20, s*0.55, s*0.50], outline=color, width=w)
    d.arc([s*0.10, s*0.55, s*0.70, s*0.95], start=0, end=180, fill=color, width=w)
    # second person behind
    d.ellipse([s*0.48, s*0.15, s*0.78, s*0.45], outline=color, width=w)
    d.arc([s*0.38, s*0.50, s*0.95, s*0.90], start=0, end=130, fill=color, width=w)
    return img

def make_marketing(size=81, color=(156, 163, 175)):
    # megaphone / broadcast
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(4, s // 18)
    # megaphone body triangle
    d.polygon([
        (s*0.22, s*0.35), (s*0.22, s*0.65), (s*0.65, s*0.75), (s*0.65, s*0.25)
    ], outline=color, width=w)
    # handle
    d.arc([s*0.15, s*0.55, s*0.40, s*0.85], start=90, end=180, fill=color, width=w)
    # sound waves
    d.arc([s*0.62, s*0.30, s*0.80, s*0.70], start=270, end=90, fill=color, width=w)
    d.arc([s*0.72, s*0.25, s*0.90, s*0.75], start=270, end=90, fill=color, width=w)
    return img

def make_performance(size=81, color=(156, 163, 175)):
    # chart/bar
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(4, s // 18)
    # three bars
    bar_w = s*0.14
    d.rounded_rectangle([s*0.18, s*0.55, s*0.18+bar_w, s*0.78], radius=3, outline=color, width=w)
    d.rounded_rectangle([s*0.43, s*0.38, s*0.43+bar_w, s*0.78], radius=3, outline=color, width=w)
    d.rounded_rectangle([s*0.68, s*0.22, s*0.68+bar_w, s*0.78], radius=3, outline=color, width=w)
    return img

def make_search(size=48, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 16)
    # circle
    d.ellipse([s*0.18, s*0.18, s*0.62, s*0.62], outline=color, width=w)
    # handle
    d.line([(s*0.58, s*0.58), (s*0.82, s*0.82)], fill=color, width=w)
    return img

def make_msg(size=48, color=(156, 163, 175)):
    # bell outline
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 16)
    # bell body
    d.arc([s*0.20, s*0.15, s*0.80, s*0.65], start=180, end=360, fill=color, width=w)
    d.line([(s*0.20, s*0.40), (s*0.15, s*0.70)], fill=color, width=w)
    d.line([(s*0.80, s*0.40), (s*0.85, s*0.70)], fill=color, width=w)
    d.line([(s*0.15, s*0.70), (s*0.85, s*0.70)], fill=color, width=w)
    # clapper
    d.ellipse([s*0.42, s*0.72, s*0.58, s*0.88], outline=color, width=w)
    return img

def make_play(size=48, color=(255,255,255)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    d.polygon([
        (s*0.32, s*0.22), (s*0.32, s*0.78), (s*0.78, s*0.50)
    ], fill=color)
    return img

def make_check(size=40, color=(255,255,255)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.line([(s*0.20, s*0.50), (s*0.40, s*0.70)], fill=color, width=w)
    d.line([(s*0.40, s*0.70), (s*0.80, s*0.30)], fill=color, width=w)
    return img

def make_star(size=40, color=(245, 158, 11)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    cx, cy = s/2, s/2
    r_outer, r_inner = s*0.42, s*0.18
    points = []
    for i in range(10):
        r = r_outer if i % 2 == 0 else r_inner
        a = i * 36 - 90
        import math
        x = cx + r * math.cos(math.radians(a))
        y = cy + r * math.sin(math.radians(a))
        points.append((x, y))
    d.polygon(points, outline=color, width=3)
    return img

def make_heart(size=40, color=(239, 68, 68)):
    # simple heart outline
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    # two top circles + bottom point
    d.arc([s*0.15, s*0.18, s*0.50, s*0.55], start=180, end=360, fill=color, width=w)
    d.arc([s*0.50, s*0.18, s*0.85, s*0.55], start=180, end=360, fill=color, width=w)
    d.polygon([(s*0.15, s*0.45), (s*0.50, s*0.90), (s*0.85, s*0.45)], fill=color)
    return img

def make_pill(size=40, color=(37, 99, 235)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.rounded_rectangle([s*0.15, s*0.30, s*0.85, s*0.70], radius=10, outline=color, width=w)
    d.line([(s*0.50, s*0.30), (s*0.50, s*0.70)], fill=color, width=w)
    return img

def make_thermometer(size=40, color=(239, 68, 68)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.rounded_rectangle([s*0.38, s*0.12, s*0.62, s*0.72], radius=8, outline=color, width=w)
    d.ellipse([s*0.32, s*0.68, s*0.68, s*0.92], outline=color, width=w)
    return img

def make_leaf(size=40, color=(16, 185, 129)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.ellipse([s*0.25, s*0.15, s*0.75, s*0.65], outline=color, width=w)
    d.line([(s*0.50, s*0.65), (s*0.50, s*0.88)], fill=color, width=w)
    return img

def make_stomach(size=40, color=(139, 92, 246)):
    # pill/capsule-like
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.rounded_rectangle([s*0.25, s*0.15, s*0.75, s*0.85], radius=12, outline=color, width=w)
    return img

def make_orange(size=40, color=(245, 158, 11)):
    # orange circle with small leaf
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.ellipse([s*0.18, s*0.22, s*0.82, s*0.86], outline=color, width=w)
    d.line([(s*0.50, s*0.22), (s*0.50, s*0.08)], fill=color, width=w)
    return img

def make_teapot(size=40, color=(120, 113, 108)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.ellipse([s*0.25, s*0.35, s*0.75, s*0.85], outline=color, width=w)
    d.arc([s*0.65, s*0.30, s*0.90, s*0.55], start=270, end=90, fill=color, width=w)
    d.ellipse([s*0.35, s*0.15, s*0.65, s*0.45], outline=color, width=w)
    return img

def make_gift(size=40, color=(236, 72, 153)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.rectangle([s*0.20, s*0.45, s*0.80, s*0.80], outline=color, width=w)
    d.line([(s*0.50, s*0.45), (s*0.50, s*0.80)], fill=color, width=w)
    d.line([(s*0.20, s*0.62), (s*0.80, s*0.62)], fill=color, width=w)
    d.line([(s*0.35, s*0.20), (s*0.35, s*0.45)], fill=color, width=w)
    d.line([(s*0.65, s*0.20), (s*0.65, s*0.45)], fill=color, width=w)
    d.arc([s*0.30, s*0.10, s*0.45, s*0.30], start=0, end=180, fill=color, width=w)
    d.arc([s*0.55, s*0.10, s*0.70, s*0.30], start=0, end=180, fill=color, width=w)
    return img

def make_chart(size=40, color=(16, 185, 129)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    # line chart
    d.line([(s*0.15, s*0.78), (s*0.85, s*0.78)], fill=color, width=w)
    d.line([(s*0.15, s*0.78), (s*0.15, s*0.15)], fill=color, width=w)
    d.line([(s*0.22, s*0.60), (s*0.45, s*0.40), (s*0.68, s*0.55), (s*0.85, s*0.25)], fill=color, width=w)
    return img

def make_location(size=40, color=(14, 165, 233)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.ellipse([s*0.25, s*0.15, s*0.75, s*0.55], outline=color, width=w)
    d.polygon([(s*0.50, s*0.45), (s*0.25, s*0.85), (s*0.75, s*0.85)], fill=color)
    return img

def make_box(size=40, color=(245, 158, 11)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.rounded_rectangle([s*0.15, s*0.30, s*0.85, s*0.80], radius=4, outline=color, width=w)
    d.line([(s*0.15, s*0.45), (s*0.85, s*0.45)], fill=color, width=w)
    return img

def make_people(size=40, color=(59, 130, 246)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.ellipse([s*0.30, s*0.12, s*0.70, s*0.45], outline=color, width=w)
    d.arc([s*0.15, s*0.45, s*0.85, s*0.92], start=0, end=180, fill=color, width=w)
    return img

def make_money(size=40, color=(245, 158, 11)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.rounded_rectangle([s*0.12, s*0.25, s*0.88, s*0.75], radius=6, outline=color, width=w)
    d.ellipse([s*0.42, s*0.42, s*0.58, s*0.58], outline=color, width=w)
    return img

def make_bell(size=40, color=(239, 68, 68)):
    return make_msg(size, color)

def make_setting(size=40, color=(75, 85, 99)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    cx, cy = s/2, s/2
    import math
    for i in range(6):
        a = math.radians(i*60)
        x1 = cx + s*0.15 * math.cos(a)
        y1 = cy + s*0.15 * math.sin(a)
        x2 = cx + s*0.35 * math.cos(a)
        y2 = cy + s*0.35 * math.sin(a)
        d.line([(x1, y1), (x2, y2)], fill=color, width=w)
    d.ellipse([s*0.42, s*0.42, s*0.58, s*0.58], outline=color, width=w)
    return img

def make_plus(size=40, color=(255,255,255)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(4, s // 10)
    d.line([(s*0.50, s*0.20), (s*0.50, s*0.80)], fill=color, width=w)
    d.line([(s*0.20, s*0.50), (s*0.80, s*0.50)], fill=color, width=w)
    return img

def make_minus(size=40, color=(255,255,255)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(4, s // 10)
    d.line([(s*0.20, s*0.50), (s*0.80, s*0.50)], fill=color, width=w)
    return img

def make_arrow_right(size=40, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.line([(s*0.20, s*0.50), (s*0.70, s*0.50)], fill=color, width=w)
    d.line([(s*0.55, s*0.30), (s*0.75, s*0.50), (s*0.55, s*0.70)], fill=color, width=w)
    return img

def make_back(size=40, color=(255,255,255)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.line([(s*0.55, s*0.25), (s*0.25, s*0.50), (s*0.55, s*0.75)], fill=color, width=w)
    return img

def make_share(size=40, color=(255,255,255)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    # box
    d.rounded_rectangle([s*0.20, s*0.35, s*0.70, s*0.75], radius=4, outline=color, width=w)
    # arrow up
    d.line([(s*0.45, s*0.55), (s*0.45, s*0.15)], fill=color, width=w)
    d.line([(s*0.35, s*0.25), (s*0.45, s*0.15), (s*0.55, s*0.25)], fill=color, width=w)
    return img

def make_service(size=40, color=(75, 85, 99)):
    # headset / customer service
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.arc([s*0.20, s*0.20, s*0.80, s*0.60], start=180, end=360, fill=color, width=w)
    d.line([(s*0.20, s*0.40), (s*0.20, s*0.55)], fill=color, width=w)
    d.line([(s*0.80, s*0.40), (s*0.80, s*0.55)], fill=color, width=w)
    d.line([(s*0.50, s*0.55), (s*0.50, s*0.72)], fill=color, width=w)
    d.arc([s*0.35, s*0.65, s*0.65, s*0.85], start=0, end=180, fill=color, width=w)
    return img

def make_pause(size=40, color=(255,255,255)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(4, s // 10)
    d.line([(s*0.35, s*0.25), (s*0.35, s*0.75)], fill=color, width=w)
    d.line([(s*0.65, s*0.25), (s*0.65, s*0.75)], fill=color, width=w)
    return img

def make_fire(size=40, color=(239, 68, 68)):
    # simple flame
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.polygon([
        (s*0.50, s*0.10), (s*0.75, s*0.50), (s*0.62, s*0.45), (s*0.68, s*0.70),
        (s*0.50, s*0.90), (s*0.32, s*0.70), (s*0.38, s*0.45), (s*0.25, s*0.50)
    ], outline=color, width=w)
    return img

def make_trash(size=40, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.rectangle([s*0.28, s*0.20, s*0.72, s*0.28], outline=color, width=w)
    d.rounded_rectangle([s*0.25, s*0.28, s*0.75, s*0.75], radius=4, outline=color, width=w)
    d.line([(s*0.38, s*0.38), (s*0.38, s*0.65)], fill=color, width=w)
    d.line([(s*0.50, s*0.38), (s*0.50, s*0.65)], fill=color, width=w)
    d.line([(s*0.62, s*0.38), (s*0.62, s*0.65)], fill=color, width=w)
    return img

def make_truck(size=40, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    # cargo box
    d.rounded_rectangle([s*0.15, s*0.25, s*0.65, s*0.55], radius=4, outline=color, width=w)
    # truck cabin
    d.rounded_rectangle([s*0.62, s*0.35, s*0.85, s*0.55], radius=4, outline=color, width=w)
    # wheels
    d.ellipse([s*0.25, s*0.50, s*0.38, s*0.68], outline=color, width=w)
    d.ellipse([s*0.65, s*0.50, s*0.78, s*0.68], outline=color, width=w)
    return img

def make_clipboard(size=40, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.rounded_rectangle([s*0.22, s*0.18, s*0.78, s*0.82], radius=4, outline=color, width=w)
    d.line([(s*0.35, s*0.32), (s*0.65, s*0.32)], fill=color, width=w)
    d.line([(s*0.35, s*0.45), (s*0.65, s*0.45)], fill=color, width=w)
    d.line([(s*0.35, s*0.58), (s*0.55, s*0.58)], fill=color, width=w)
    return img

def make_bank(size=40, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    # roof triangle
    d.polygon([(s*0.15, s*0.45), (s*0.50, s*0.15), (s*0.85, s*0.45)], outline=color, width=w)
    # pillars
    d.line([(s*0.30, s*0.45), (s*0.30, s*0.78)], fill=color, width=w)
    d.line([(s*0.50, s*0.45), (s*0.50, s*0.78)], fill=color, width=w)
    d.line([(s*0.70, s*0.45), (s*0.70, s*0.78)], fill=color, width=w)
    d.line([(s*0.15, s*0.78), (s*0.85, s*0.78)], fill=color, width=w)
    return img

def make_calendar(size=40, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.rounded_rectangle([s*0.15, s*0.20, s*0.85, s*0.80], radius=4, outline=color, width=w)
    d.line([(s*0.15, s*0.35), (s*0.85, s*0.35)], fill=color, width=w)
    d.line([(s*0.30, s*0.12), (s*0.30, s*0.20)], fill=color, width=w)
    d.line([(s*0.70, s*0.12), (s*0.70, s*0.20)], fill=color, width=w)
    return img

def make_phone(size=40, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.rounded_rectangle([s*0.30, s*0.12, s*0.70, s*0.88], radius=6, outline=color, width=w)
    d.line([(s*0.38, s*0.75), (s*0.62, s*0.75)], fill=color, width=w)
    return img

def make_warning(size=40, color=(245, 158, 11)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    # triangle with rounded corners approx
    d.polygon([
        (s*0.50, s*0.15), (s*0.15, s*0.80), (s*0.85, s*0.80)
    ], outline=color, width=w)
    d.line([(s*0.50, s*0.35), (s*0.50, s*0.58)], fill=color, width=w)
    d.ellipse([s*0.46, s*0.65, s*0.54, s*0.73], fill=color)
    return img

def make_clock(size=40, color=(156, 163, 175)):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size
    w = max(3, s // 12)
    d.ellipse([s*0.15, s*0.15, s*0.85, s*0.85], outline=color, width=w)
    d.line([(s*0.50, s*0.28), (s*0.50, s*0.52)], fill=color, width=w)
    d.line([(s*0.50, s*0.52), (s*0.68, s*0.60)], fill=color, width=w)
    return img

# Generate all icons
base = '/Users/chenshenghe/WorkBuddy/2026-07-11-23-53-17/pharma-b2b/frontend'

def gen_tabbar_icons(prefix, funcs, active_color=(37, 99, 235), inactive_color=(156, 163, 175)):
    for name, fn in funcs.items():
        out_dir = f'{base}/{prefix}/src/static/tabbar'
        os.makedirs(out_dir, exist_ok=True)
        fn(81, inactive_color).save(f'{out_dir}/{name}.png')
        fn(81, active_color).save(f'{out_dir}/{name}-active.png')

def gen_icons(prefix, funcs, color=(156, 163, 175)):
    out_dir = f'{base}/{prefix}/src/static/icons'
    os.makedirs(out_dir, exist_ok=True)
    for name, fn in funcs.items():
        fn(48, color).save(f'{out_dir}/{name}.png')

if __name__ == '__main__':
    # tabbar icons for mobile
    gen_tabbar_icons('mobile', {
        'home': make_home,
        'category': make_category,
        'video': make_video,
        'cart': make_cart,
        'mine': make_mine,
    })
    # tabbar icons for sales
    gen_tabbar_icons('sales', {
        'home': make_home,
        'customer': make_customer,
        'marketing': make_marketing,
        'performance': make_performance,
        'mine': make_mine,
    })
    # common icons for mobile
    gen_icons('mobile', {
        'search': make_search,
        'msg': make_msg,
        'play': make_play,
        'check': make_check,
        'star': make_star,
        'heart': make_heart,
        'pill': make_pill,
        'thermometer': make_thermometer,
        'leaf': make_leaf,
        'stomach': make_stomach,
        'orange': make_orange,
        'teapot': make_teapot,
        'gift': make_gift,
        'chart': make_chart,
        'location': make_location,
        'box': make_box,
        'people': make_people,
        'money': make_money,
        'bell': make_bell,
        'setting': make_setting,
        'plus': make_plus,
        'minus': make_minus,
        'arrow': make_arrow_right,
        'cart': make_cart,
        'video': make_video,
        'back': make_back,
        'share': make_share,
        'service': make_service,
        'pause': make_pause,
        'fire': make_fire,
        'trash': make_trash,
        'truck': make_truck,
        'clipboard': make_clipboard,
        'bank': make_bank,
        'calendar': make_calendar,
        'phone': make_phone,
        'warning': make_warning,
        'clock': make_clock,
    })
    # common icons for sales
    gen_icons('sales', {
        'search': make_search,
        'msg': make_msg,
        'play': make_play,
        'check': make_check,
        'star': make_star,
        'heart': make_heart,
        'gift': make_gift,
        'chart': make_chart,
        'box': make_box,
        'people': make_people,
        'money': make_money,
        'bell': make_bell,
        'setting': make_setting,
        'plus': make_plus,
        'minus': make_minus,
        'arrow': make_arrow_right,
        'cart': make_cart,
        'video': make_video,
        'back': make_back,
        'share': make_share,
        'service': make_service,
        'pause': make_pause,
        'fire': make_fire,
        'trash': make_trash,
        'truck': make_truck,
        'clipboard': make_clipboard,
        'bank': make_bank,
        'calendar': make_calendar,
        'phone': make_phone,
        'warning': make_warning,
        'clock': make_clock,
        'customer': make_customer,
        'marketing': make_marketing,
        'performance': make_performance,
    })
    print('Icons generated successfully')

    # White icons for dark/blue backgrounds
    for prefix in ['mobile', 'sales']:
        out_dir = f'{base}/{prefix}/src/static/icons'
        make_search(32, (255,255,255)).save(f'{out_dir}/search-white.png')
        make_msg(32, (255,255,255)).save(f'{out_dir}/msg-white.png')
        make_arrow_right(32, (255,255,255)).save(f'{out_dir}/arrow-white.png')
    print('White icons generated successfully')
