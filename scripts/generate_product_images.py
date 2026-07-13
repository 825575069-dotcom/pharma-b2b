#!/usr/bin/env python3
"""Generate medicine-themed product images, video covers, banners, and avatars."""
import os
import math
from PIL import Image, ImageDraw, ImageFont

BASE = '/Users/chenshenghe/WorkBuddy/2026-07-11-23-53-17/pharma-b2b/frontend'

# Try to find a usable font
FONT_PATHS = [
    '/System/Library/Fonts/PingFang.ttc',
    '/System/Library/Fonts/STHeiti Medium.ttc',
    '/System/Library/Fonts/Hiragino Sans GB.ttc',
    '/Library/Fonts/Arial Unicode.ttf',
    '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
]
FONT_PATH = None
for p in FONT_PATHS:
    if os.path.exists(p):
        FONT_PATH = p
        break

def get_font(size):
    if FONT_PATH:
        return ImageFont.truetype(FONT_PATH, size)
    return ImageFont.load_default()

# Color schemes for different medicine categories
CATEGORY_COLORS = {
    '抗生素类': {'bg': (219, 234, 254), 'primary': (37, 99, 235), 'accent': (59, 130, 246)},
    '抗生素': {'bg': (219, 234, 254), 'primary': (37, 99, 235), 'accent': (59, 130, 246)},
    '解热镇痛': {'bg': (209, 250, 229), 'primary': (16, 185, 129), 'accent': (52, 211, 153)},
    '感冒用药': {'bg': (254, 243, 199), 'primary': (245, 158, 11), 'accent': (251, 191, 36)},
    '清热解毒': {'bg': (254, 226, 226), 'primary': (239, 68, 68), 'accent': (248, 113, 113)},
    '心脑血管': {'bg': (224, 231, 255), 'primary': (99, 102, 241), 'accent': (129, 140, 248)},
    '心血管': {'bg': (224, 231, 255), 'primary': (99, 102, 241), 'accent': (129, 140, 248)},
    '降压药': {'bg': (233, 213, 255), 'primary': (168, 85, 247), 'accent': (192, 132, 252)},
    '降糖药': {'bg': (254, 215, 170), 'primary': (234, 88, 12), 'accent': (251, 146, 60)},
    '降脂药': {'bg': (207, 250, 254), 'primary': (6, 182, 212), 'accent': (34, 211, 238)},
    '消化系统': {'bg': (254, 242, 232), 'primary': (249, 115, 22), 'accent': (251, 146, 60)},
    '维生素类': {'bg': (254, 249, 195), 'primary': (234, 179, 8), 'accent': (250, 204, 21)},
    '维生素': {'bg': (254, 249, 195), 'primary': (234, 179, 8), 'accent': (250, 204, 21)},
    '抗过敏': {'bg': (252, 231, 243), 'primary': (236, 72, 153), 'accent': (244, 114, 182)},
    '滋补类': {'bg': (243, 232, 255), 'primary': (168, 85, 247), 'accent': (192, 132, 252)},
    '呼吸系统': {'bg': (254, 226, 226), 'primary': (239, 68, 68), 'accent': (248, 113, 113)},
    '保健品': {'bg': (222, 247, 226), 'primary': (22, 163, 74), 'accent': (34, 197, 94)},
    '医疗器械': {'bg': (241, 245, 249), 'primary': (71, 85, 105), 'accent': (100, 116, 139)},
    '耗材': {'bg': (241, 245, 249), 'primary': (71, 85, 105), 'accent': (100, 116, 139)},
    '肝胆用药': {'bg': (254, 215, 170), 'primary': (234, 88, 12), 'accent': (251, 146, 60)},
    '中药材': {'bg': (254, 249, 195), 'primary': (180, 83, 9), 'accent': (202, 138, 4)},
}

DEFAULT_COLORS = {'bg': (219, 234, 254), 'primary': (37, 99, 235), 'accent': (59, 130, 246)}


def get_colors(category):
    return CATEGORY_COLORS.get(category, DEFAULT_COLORS)


def draw_medicine_icon(d, cx, cy, size, color):
    """Draw a simple medicine icon (pill capsule or cross)."""
    s = size
    # Draw a rounded cross (medical symbol)
    w = s // 6
    # Vertical bar
    d.rounded_rectangle(
        [cx - w, cy - s//2, cx + w, cy + s//2],
        radius=w, fill=color
    )
    # Horizontal bar
    d.rounded_rectangle(
        [cx - s//2, cy - w, cx + s//2, cy + w],
        radius=w, fill=color
    )


def draw_pill(d, cx, cy, size, color1, color2):
    """Draw a pill capsule."""
    s = size
    r = s // 4
    # Left half (color1)
    d.rounded_rectangle(
        [cx - s//2, cy - r, cx, cy + r],
        radius=r, fill=color1
    )
    # Right half (color2)
    d.rounded_rectangle(
        [cx, cy - r, cx + s//2, cy + r],
        radius=r, fill=color2
    )


def draw_medicine_box(d, cx, cy, w, h, color, accent):
    """Draw a medicine box shape."""
    # Main box
    d.rounded_rectangle(
        [cx - w//2, cy - h//2, cx + w//2, cy + h//2],
        radius=max(4, w // 20), fill=color, outline=accent, width=2
    )
    # Top stripe
    d.rounded_rectangle(
        [cx - w//2, cy - h//2, cx + w//2, cy - h//2 + h//6],
        radius=max(4, w // 20), fill=accent
    )


def draw_medicine_bottle(d, cx, cy, w, h, color, accent):
    """Draw a medicine bottle shape."""
    # Cap
    cap_h = h // 5
    d.rounded_rectangle(
        [cx - w//3, cy - h//2, cx + w//3, cy - h//2 + cap_h],
        radius=4, fill=accent
    )
    # Neck
    d.rectangle(
        [cx - w//4, cy - h//2 + cap_h, cx + w//4, cy - h//2 + cap_h + 6],
        fill=accent
    )
    # Body
    d.rounded_rectangle(
        [cx - w//2, cy - h//2 + cap_h + 6, cx + w//2, cy + h//2],
        radius=max(4, w // 15), fill=color, outline=accent, width=2
    )


def generate_product_image(product_id, name, spec, manufacturer, category, output_dir):
    """Generate a medicine product image."""
    W, H = 400, 400
    colors = get_colors(category)
    
    img = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    d = ImageDraw.Draw(img)
    
    # Background gradient effect using color blocks
    bg = colors['bg']
    # Top half lighter, bottom half slightly darker
    for y in range(H):
        ratio = y / H
        r = int(bg[0] * (1 - ratio * 0.1))
        g = int(bg[1] * (1 - ratio * 0.1))
        b = int(bg[2] * (1 - ratio * 0.1))
        d.line([(0, y), (W, y)], fill=(r, g, b, 255))
    
    primary = colors['primary']
    accent = colors['accent']
    
    # Draw medicine box/bottle in center
    box_w, box_h = 200, 160
    bx, by = W // 2, H // 2 - 30
    
    # Decide shape based on category
    if '口服液' in name or '露' in name:
        draw_medicine_bottle(d, bx, by, box_w, box_h, (255, 255, 255), primary)
    elif '颗粒' in name:
        draw_medicine_box(d, bx, by, box_w, box_h, (255, 255, 255), primary)
    elif '丸' in name:
        draw_medicine_bottle(d, bx, by, box_w, box_h, (255, 255, 255), primary)
    elif '片' in name and '分散片' not in name:
        draw_medicine_bottle(d, bx, by, box_w, box_h, (255, 255, 255), primary)
    else:
        draw_medicine_box(d, bx, by, box_w, box_h, (255, 255, 255), primary)
    
    # Draw a medicine cross icon on the box
    draw_medicine_icon(d, bx, by - 10, 50, accent)
    
    # Draw pills decoration
    draw_pill(d, bx - 60, by + 50, 30, primary, (255, 255, 255))
    draw_pill(d, bx + 60, by + 50, 30, (255, 255, 255), primary)
    
    # Product name
    font_name = get_font(28)
    # Truncate long names
    short_name = name
    if len(short_name) > 10:
        short_name = short_name[:9] + '...'
    
    bbox = d.textbbox((0, 0), short_name, font=font_name)
    text_w = bbox[2] - bbox[0]
    d.text((W//2 - text_w//2, H - 85), short_name, fill=primary, font=font_name)
    
    # Spec
    font_spec = get_font(18)
    short_spec = spec
    if len(short_spec) > 18:
        short_spec = short_spec[:17] + '...'
    bbox2 = d.textbbox((0, 0), short_spec, font=font_spec)
    text_w2 = bbox2[2] - bbox2[0]
    d.text((W//2 - text_w2//2, H - 50), short_spec, fill=accent, font=font_spec)
    
    # Manufacturer at bottom
    font_mfr = get_font(14)
    short_mfr = manufacturer
    if len(short_mfr) > 16:
        short_mfr = short_mfr[:15] + '...'
    bbox3 = d.textbbox((0, 0), short_mfr, font=font_mfr)
    text_w3 = bbox3[2] - bbox3[0]
    d.text((W//2 - text_w3//2, H - 25), short_mfr, fill=(107, 114, 128), font=font_mfr)
    
    # Top bar with category
    d.rectangle([0, 0, W, 6], fill=primary)
    
    # Category tag
    font_tag = get_font(13)
    tag_text = category
    if len(tag_text) > 6:
        tag_text = tag_text[:5] + '..'
    tag_bbox = d.textbbox((0, 0), tag_text, font=font_tag)
    tag_w = tag_bbox[2] - tag_bbox[0]
    tag_pad = 8
    tag_x = 12
    tag_y = 16
    d.rounded_rectangle(
        [tag_x, tag_y, tag_x + tag_w + tag_pad * 2, tag_y + 24],
        radius=4, fill=primary
    )
    d.text((tag_x + tag_pad, tag_y + 4), tag_text, fill=(255, 255, 255), font=font_tag)
    
    # Save
    filename = f'{product_id}.png'
    filepath = os.path.join(output_dir, filename)
    img.save(filepath)
    return filename


def generate_video_cover(video_id, title, category, output_dir):
    """Generate a video cover image."""
    W, H = 400, 300
    colors = get_colors(category)
    
    img = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    d = ImageDraw.Draw(img)
    
    bg = colors['bg']
    primary = colors['primary']
    accent = colors['accent']
    
    # Gradient background
    for y in range(H):
        ratio = y / H
        r = int(bg[0] * (1 - ratio * 0.15))
        g = int(bg[1] * (1 - ratio * 0.15))
        b = int(bg[2] * (1 - ratio * 0.15))
        d.line([(0, y), (W, y)], fill=(r, g, b, 255))
    
    # Decorative pills/circles in corners
    for i, (dx, dy, sz) in enumerate([(50, 50, 40), (340, 40, 30), (60, 250, 35), (330, 240, 45)]):
        c1 = primary if i % 2 == 0 else accent
        c2 = accent if i % 2 == 0 else primary
        draw_pill(d, dx, dy, sz, c1, c2)
    
    # Medicine cross in center top
    draw_medicine_icon(d, W//2, 80, 60, primary)
    
    # Category tag
    font_tag = get_font(14)
    tag_bbox = d.textbbox((0, 0), category, font=font_tag)
    tag_w = tag_bbox[2] - tag_bbox[0]
    tag_pad = 10
    tag_x = W//2 - (tag_w + tag_pad * 2) // 2
    tag_y = 130
    d.rounded_rectangle(
        [tag_x, tag_y, tag_x + tag_w + tag_pad * 2, tag_y + 28],
        radius=6, fill=primary
    )
    d.text((tag_x + tag_pad, tag_y + 5), category, fill=(255, 255, 255), font=font_tag)
    
    # Title (wrapped)
    font_title = get_font(20)
    lines = []
    current = ''
    for ch in title:
        test = current + ch
        bbox = d.textbbox((0, 0), test, font=font_title)
        if bbox[2] - bbox[0] > W - 40 and current:
            lines.append(current)
            current = ch
        else:
            current = test
    if current:
        lines.append(current)
    
    y_start = 175
    for i, line in enumerate(lines[:3]):
        bbox = d.textbbox((0, 0), line, font=font_title)
        tw = bbox[2] - bbox[0]
        d.text((W//2 - tw//2, y_start + i * 28), line, fill=primary, font=font_title)
    
    # Play button circle at bottom right
    pcx, pcy = W - 50, H - 40
    d.ellipse([pcx - 20, pcy - 20, pcx + 20, pcy + 20], fill=primary)
    # Triangle play icon
    d.polygon([(pcx - 7, pcy - 10), (pcx - 7, pcy + 10), (pcx + 10, pcy)], fill=(255, 255, 255))
    
    # Top bar
    d.rectangle([0, 0, W, 5], fill=primary)
    
    filename = f'{video_id}.png'
    filepath = os.path.join(output_dir, filename)
    img.save(filepath)
    return filename


def generate_banner(banner_id, title, desc, gradient_colors, output_dir):
    """Generate a banner image."""
    W, H = 750, 300
    c1, c2 = gradient_colors
    
    img = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    d = ImageDraw.Draw(img)
    
    # Gradient background
    for x in range(W):
        ratio = x / W
        r = int(c1[0] + (c2[0] - c1[0]) * ratio)
        g = int(c1[1] + (c2[1] - c1[1]) * ratio)
        b = int(c1[2] + (c2[2] - c1[2]) * ratio)
        d.line([(x, 0), (x, H)], fill=(r, g, b, 255))
    
    # Decorative circles
    for cx, cy, r, alpha in [(600, 80, 60, 30), (680, 200, 80, 20), (550, 250, 40, 25)]:
        overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        od.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255, alpha))
        img = Image.alpha_composite(img, overlay)
    
    d = ImageDraw.Draw(img)
    
    # Medicine icon
    draw_medicine_icon(d, 100, 90, 50, (255, 255, 255))
    
    # Title
    font_title = get_font(36)
    d.text((50, 140), title, fill=(255, 255, 255), font=font_title)
    
    # Description
    font_desc = get_font(22)
    d.text((50, 200), desc, fill=(255, 255, 255, 220), font=font_desc)
    
    # Decorative pills at bottom right
    draw_pill(d, 620, 80, 40, (255, 255, 255), (255, 255, 255, 150))
    draw_pill(d, 670, 150, 50, (255, 255, 255, 200), (255, 255, 255))
    
    filename = f'banner{banner_id}.png'
    filepath = os.path.join(output_dir, filename)
    img.save(filepath)
    return filename


def generate_avatar(name, output_dir, seed=0):
    """Generate a simple avatar with initials."""
    W, H = 120, 120
    colors_list = [
        ((37, 99, 235), (59, 130, 246)),
        ((16, 185, 129), (52, 211, 153)),
        ((245, 158, 11), (251, 191, 36)),
        ((239, 68, 68), (248, 113, 113)),
        ((99, 102, 241), (129, 140, 248)),
        ((168, 85, 247), (192, 132, 252)),
        ((6, 182, 212), (34, 211, 238)),
        ((236, 72, 153), (244, 114, 182)),
    ]
    c1, c2 = colors_list[seed % len(colors_list)]
    
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    
    # Circle background
    d.ellipse([0, 0, W, H], fill=c1)
    
    # Initials
    font = get_font(42)
    initials = name[:1] if name else '?'
    bbox = d.textbbox((0, 0), initials, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    d.text((W//2 - tw//2, H//2 - th//2 - 4), initials, fill=(255, 255, 255), font=font)
    
    filename = f'avatar_{name}.png'
    filepath = os.path.join(output_dir, filename)
    img.save(filepath)
    return filename


def generate_points_product(product_id, name, output_dir, seed=0):
    """Generate a points exchange product image."""
    W, H = 300, 300
    colors_list = [
        ((37, 99, 235), (219, 234, 254)),
        ((16, 185, 129), (209, 250, 229)),
        ((245, 158, 11), (254, 243, 199)),
        ((239, 68, 68), (254, 226, 226)),
        ((99, 102, 241), (224, 231, 255)),
        ((168, 85, 247), (243, 232, 255)),
    ]
    primary, bg = colors_list[seed % len(colors_list)]
    
    img = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    d = ImageDraw.Draw(img)
    
    # Background
    for y in range(H):
        ratio = y / H
        r = int(bg[0] * (1 - ratio * 0.1))
        g = int(bg[1] * (1 - ratio * 0.1))
        b = int(bg[2] * (1 - ratio * 0.1))
        d.line([(0, y), (W, y)], fill=(r, g, b, 255))
    
    # Draw gift box shape
    cx, cy = W//2, H//2 - 20
    box_w, box_h = 140, 120
    d.rounded_rectangle(
        [cx - box_w//2, cy - box_h//2, cx + box_w//2, cy + box_h//2],
        radius=8, fill=(255, 255, 255), outline=primary, width=3
    )
    # Ribbon vertical
    d.rectangle([cx - 8, cy - box_h//2, cx + 8, cy + box_h//2], fill=primary)
    # Ribbon horizontal
    d.rectangle([cx - box_w//2, cy - 8, cx + box_w//2, cy + 8], fill=primary)
    # Bow
    d.ellipse([cx - 30, cy - box_h//2 - 25, cx - 5, cy - box_h//2], fill=primary)
    d.ellipse([cx + 5, cy - box_h//2 - 25, cx + 30, cy - box_h//2], fill=primary)
    
    # Name
    font = get_font(20)
    short_name = name
    if len(short_name) > 10:
        short_name = short_name[:9] + '...'
    bbox = d.textbbox((0, 0), short_name, font=font)
    tw = bbox[2] - bbox[0]
    d.text((W//2 - tw//2, H - 50), short_name, fill=primary, font=font)
    
    # Top bar
    d.rectangle([0, 0, W, 5], fill=primary)
    
    filename = f'{product_id}.png'
    filepath = os.path.join(output_dir, filename)
    img.save(filepath)
    return filename


# Product data (matching mobile mockProducts.js)
MOBILE_PRODUCTS = [
    (1, '阿莫西林胶囊', '0.25g*24粒/盒', '华北制药', '抗生素类'),
    (2, '布洛芬缓释胶囊', '0.3g*20粒/盒', '中美史克', '解热镇痛'),
    (3, '复方丹参滴丸', '27mg*150丸/瓶', '天士力', '心脑血管'),
    (4, '连花清瘟胶囊', '0.35g*24粒/盒', '以岭药业', '清热解毒'),
    (5, '蓝芩口服液', '10ml*12支/盒', '扬子江药业', '清热解毒'),
    (6, '维生素C片', '0.1g*100片/瓶', '华东医药', '维生素类'),
    (7, '板蓝根颗粒', '10g*20袋/包', '白云山', '清热解毒'),
    (8, '健胃消食片', '0.8g*36片/盒', '江中药业', '消化系统'),
    (9, '氯雷他定片', '10mg*6片/盒', '拜耳', '抗过敏'),
    (10, '钙尔奇D片', '600mg*30片/瓶', '惠氏', '维生素类'),
    (11, '感冒灵颗粒', '10g*9袋/盒', '华润三九', '感冒用药'),
    (12, '六味地黄丸', '0.2g*200丸/瓶', '宛西制药', '滋补类'),
    (13, '头孢克肟分散片', '0.1g*6片/盒', '白云山', '抗生素类'),
    (14, '蒙脱石散', '3g*15袋/盒', '博福-益普生', '消化系统'),
    (15, '硝酸甘油片', '0.5mg*100片/瓶', '北京益民', '心脑血管'),
    (16, '阿托伐他汀钙片', '20mg*7片/盒', '辉瑞', '心脑血管'),
    (17, '葡萄糖酸钙口服液', '10ml*12支/盒', '哈药三精', '维生素类'),
    (18, '金银花露', '500ml/瓶', '午时药业', '清热解毒'),
    (19, '护肝片', '0.35g*100片/瓶', '葵花药业', '肝胆用药'),
    (20, '蒲地蓝消炎口服液', '10ml*12支/盒', '济川药业', '清热解毒'),
    (21, '盐酸氨溴索口服液', '100ml/瓶', '勃林格殷格翰', '呼吸系统'),
    (22, '奥美拉唑肠溶胶囊', '20mg*14粒/盒', '阿斯利康', '消化系统'),
]

# Sales products (different naming/IDs)
SALES_PRODUCTS = [
    ('P001', '阿莫西林胶囊', '0.25g*50粒', '石药集团', '抗生素'),
    ('P002', '布洛芬缓释胶囊', '0.3g*24粒', '中美史克', '解热镇痛'),
    ('P003', '板蓝根颗粒', '10g*20袋', '白云山药业', '感冒用药'),
    ('P004', '盐酸二甲双胍片', '0.5g*48片', '施贵宝', '降糖药'),
    ('P005', '格列美脲片', '2mg*30片', '赛诺菲', '降糖药'),
    ('P006', '阿托伐他汀钙片', '20mg*14片', '辉瑞', '降脂药'),
    ('P007', '复方丹参滴丸', '27mg*150丸', '天士力', '心血管'),
    ('P008', '速效救心丸', '40mg*120丸', '中新药业', '心血管'),
    ('P009', '氯吡格雷片', '75mg*7片', '赛诺菲', '心血管'),
    ('P010', '厄贝沙坦片', '0.15g*7片', '赛诺菲', '降压药'),
    ('P011', '奥美拉唑肠溶胶囊', '20mg*14粒', '阿斯利康', '消化系统'),
    ('P012', '铝碳酸镁咀嚼片', '0.5g*20片', '拜耳', '消化系统'),
    ('P013', '硝苯地平缓释片', '20mg*30片', '拜耳', '降压药'),
    ('P014', '感冒灵颗粒', '10g*9袋', '三九药业', '感冒用药'),
    ('P015', '抗病毒口服液', '10ml*12支', '香雪制药', '感冒用药'),
    ('P016', '维生素C片', '0.1g*100片', '华北制药', '维生素'),
    ('P017', '头孢克洛胶囊', '0.25g*12粒', '礼来', '抗生素'),
    ('P018', '罗红霉素片', '0.15g*6片', '辉瑞', '抗生素'),
]

# Video data (matching mobile mockVideos.js)
MOBILE_VIDEOS = [
    (1, '阿莫西林用药科普', '用药科普'),
    (2, '板蓝根季节性用药指南', '季节养生'),
    (3, '复方丹参滴丸常备药', '慢病管理'),
    (4, '连花清瘟vs蓝芩口服液', '药品对比'),
    (5, '维生素C正确补充方式', '营养保健'),
    (6, '健胃消食片消化无忧', '日常保健'),
    (7, '氯雷他定过敏季守护', '抗过敏专题'),
    (8, '六味地黄丸经典名方', '中医中药'),
    (9, '蒙脱石散腹泻用药攻略', '消化健康'),
    (10, '奥美拉唑长期用药管理', '消化系统'),
    (11, '钙尔奇D科学补钙攻略', '营养保健'),
    (12, '蒲地蓝消炎口服液', '清热解毒'),
]

# Sales videos
SALES_VIDEOS = [
    (1, '阿莫西林用药指南', '用药指导'),
    (2, '高血压日常用药注意', '药品科普'),
    (3, '维生素C正确补充', '健康养生'),
    (4, '板蓝根颗粒四季妙用', '产品介绍'),
    (5, '奥美拉唑用药误区', '用药指导'),
    (6, '夏季肠胃病预防', '疾病预防'),
    (7, '六味地黄丸功效详解', '产品介绍'),
    (8, '鱼油软胶囊选购指南', '产品介绍'),
    (9, '阿托伐他汀心血管', '药品科普'),
    (10, '金银花露夏季清热', '健康养生'),
    (11, '头孢类抗生素安全用药', '用药指导'),
    (12, '医用口罩正确佩戴', '健康养生'),
]

# Points products (admin/mockActivities.js pointsProducts)
POINTS_PRODUCTS = [
    ('PP001', '电子体温计'),
    ('PP002', '血压计'),
    ('PP003', '维生素C片'),
    ('PP004', '医用外科口罩'),
    ('PP005', '便携药盒'),
    ('PP006', '血糖仪'),
    ('PP007', '按摩梳'),
    ('PP008', '养生茶礼盒'),
]

# Avatars
AVATARS = ['王大力', '李晓红', '赵德柱', '陈思琪', '刘文博', '孙美玲', '周建华', '吴秀芳']

BANNERS = [
    (1, '夏季清热解毒专区', '满200减30，全场最低价', ((37, 99, 235), (59, 130, 246))),
    (2, '心脑血管特惠周', '全场8.5折，品质保障', ((16, 185, 129), (52, 211, 153))),
    (3, '抗生素限时秒杀', '每日10点开抢，限量5盒', ((239, 68, 68), (248, 113, 113))),
]


def main():
    for project in ['mobile', 'sales', 'mall', 'admin']:
        img_dir = f'{BASE}/{project}/src/static/images/products'
        video_dir = f'{BASE}/{project}/src/static/images/videos'
        banner_dir = f'{BASE}/{project}/src/static/images/banners'
        avatar_dir = f'{BASE}/{project}/src/static/images/avatars'
        points_dir = f'{BASE}/{project}/src/static/images/points'
        
        for d in [img_dir, video_dir, banner_dir, avatar_dir, points_dir]:
            os.makedirs(d, exist_ok=True)
    
    # Generate mobile/mall products (P0001-P0022)
    for project in ['mobile', 'mall']:
        img_dir = f'{BASE}/{project}/src/static/images/products'
        for pid, name, spec, mfr, cat in MOBILE_PRODUCTS:
            product_id = f'P{String(pid)}' if False else f'P{pid:04d}'
            generate_product_image(product_id, name, spec, mfr, cat, img_dir)
    
    # Generate sales/admin products (P001-P018)
    for project in ['sales', 'admin']:
        img_dir = f'{BASE}/{project}/src/static/images/products'
        for pid, name, spec, mfr, cat in SALES_PRODUCTS:
            generate_product_image(pid, name, spec, mfr, cat, img_dir)
    
    # Generate video covers for mobile/mall
    for project in ['mobile', 'mall']:
        video_dir = f'{BASE}/{project}/src/static/images/videos'
        for vid, title, cat in MOBILE_VIDEOS:
            video_id = f'V{vid:03d}'
            generate_video_cover(video_id, title, cat, video_dir)
    
    # Generate video covers for sales/admin
    for project in ['sales', 'admin']:
        video_dir = f'{BASE}/{project}/src/static/images/videos'
        for vid, title, cat in SALES_VIDEOS:
            video_id = f'V{vid:03d}'
            generate_video_cover(video_id, title, cat, video_dir)
    
    # Generate banners
    for project in ['mobile', 'sales', 'mall', 'admin']:
        banner_dir = f'{BASE}/{project}/src/static/images/banners'
        for bid, title, desc, colors in BANNERS:
            generate_banner(bid, title, desc, colors, banner_dir)
    
    # Generate avatars
    for project in ['mobile', 'sales', 'mall', 'admin']:
        avatar_dir = f'{BASE}/{project}/src/static/images/avatars'
        for i, name in enumerate(AVATARS):
            generate_avatar(name, avatar_dir, seed=i)
        # Default user avatar
        generate_avatar('用户', avatar_dir, seed=99)
        generate_avatar('张明', avatar_dir, seed=10)
    
    # Generate points products
    for project in ['mobile', 'admin']:
        points_dir = f'{BASE}/{project}/src/static/images/points'
        for i, (pid, name) in enumerate(POINTS_PRODUCTS):
            generate_points_product(pid, name, points_dir, seed=i)
    
    print("All images generated successfully!")
    print(f"Products: {len(MOBILE_PRODUCTS)} mobile/mall + {len(SALES_PRODUCTS)} sales/admin")
    print(f"Videos: {len(MOBILE_VIDEOS)} mobile/mall + {len(SALES_VIDEOS)} sales/admin")
    print(f"Banners: {len(BANNERS)}")
    print(f"Avatars: {len(AVATARS) + 2}")
    print(f"Points products: {len(POINTS_PRODUCTS)}")


def String(n):
    return str(n)


if __name__ == '__main__':
    main()
