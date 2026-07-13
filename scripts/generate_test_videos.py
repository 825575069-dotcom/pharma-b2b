#!/usr/bin/env python3
"""Generate test MP4 videos for the pharma B2B platform using product images."""
import os
import math
import numpy as np
import imageio
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

BASE = '/Users/chenshenghe/WorkBuddy/2026-07-11-23-53-17/pharma-b2b/frontend'

# Font
FONT_PATHS = [
    '/System/Library/Fonts/PingFang.ttc',
    '/System/Library/Fonts/STHeiti Medium.ttc',
    '/System/Library/Fonts/Hiragino Sans GB.ttc',
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


def make_frame(base_img, W, H, t, duration, title, category, colors):
    """Create a single video frame at time t."""
    frame = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    d = ImageDraw.Draw(frame)
    
    primary = colors.get('primary', (37, 99, 235))
    bg = colors.get('bg', (219, 234, 254))
    accent = colors.get('accent', (59, 130, 246))
    
    # Gradient background
    for y in range(H):
        ratio = y / H
        r = int(bg[0] * (1 - ratio * 0.15))
        g = int(bg[1] * (1 - ratio * 0.15))
        b = int(bg[2] * (1 - ratio * 0.15))
        d.line([(0, y), (W, y)], fill=(r, g, b, 255))
    
    # Ken Burns effect on product image
    progress = t / duration
    scale = 1.0 + 0.1 * progress  # slight zoom in
    iw, ih = base_img.size
    new_w = int(iw * scale)
    new_h = int(ih * scale)
    scaled = base_img.resize((new_w, new_h), Image.LANCZOS)
    
    # Center the image
    paste_x = (W - new_w) // 2
    paste_y = (H - new_h) // 2 - 40  # shift up for text space
    frame.paste(scaled, (paste_x, paste_y), scaled if scaled.mode == 'RGBA' else None)
    
    # Fade in (first 0.5s) and fade out (last 0.5s)
    fade_duration = 0.5
    alpha = 1.0
    if t < fade_duration:
        alpha = t / fade_duration
    elif t > duration - fade_duration:
        alpha = (duration - t) / fade_duration
    
    if alpha < 1.0:
        overlay = Image.new('RGBA', (W, H), (255, 255, 255, int((1 - alpha) * 255)))
        frame = Image.alpha_composite(frame, overlay)
    
    d = ImageDraw.Draw(frame)
    
    # Bottom gradient bar for text
    bar_height = 120
    for y in range(bar_height):
        ratio = y / bar_height
        alpha_val = int(200 * ratio)
        d.line([(0, H - bar_height + y), (W, H - bar_height + y)], 
               fill=(0, 0, 0, alpha_val))
    
    # Category tag
    font_tag = get_font(18)
    tag_pad = 10
    tag_bbox = d.textbbox((0, 0), category, font=font_tag)
    tag_w = tag_bbox[2] - tag_bbox[0]
    d.rounded_rectangle(
        [30, H - 90, 30 + tag_w + tag_pad * 2, H - 90 + 30],
        radius=6, fill=primary
    )
    d.text((30 + tag_pad, H - 86), category, fill=(255, 255, 255), font=font_tag)
    
    # Title (wrap if needed)
    font_title = get_font(26)
    lines = []
    current = ''
    for ch in title:
        test = current + ch
        bbox = d.textbbox((0, 0), test, font=font_title)
        if bbox[2] - bbox[0] > W - 60 and current:
            lines.append(current)
            current = ch
        else:
            current = test
    if current:
        lines.append(current)
    
    y_start = H - 55
    for i, line in enumerate(lines[:2]):
        d.text((30, y_start + i * 30), line, fill=(255, 255, 255), font=font_title)
    
    # Progress bar at bottom
    bar_y = H - 6
    bar_progress = int(W * progress)
    d.rectangle([0, bar_y, W, H], fill=(200, 200, 200))
    d.rectangle([0, bar_y, bar_progress, H], fill=primary)
    
    # Top bar
    d.rectangle([0, 0, W, 5], fill=primary)
    
    # Convert to RGB for video
    return np.array(frame.convert('RGB'))


def generate_video(output_path, base_img, title, category, colors, duration=8, fps=24):
    """Generate a single MP4 video."""
    W, H = 640, 360  # 16:9
    total_frames = int(duration * fps)
    
    frames = []
    for i in range(total_frames):
        t = i / fps
        frame = make_frame(base_img, W, H, t, duration, title, category, colors)
        frames.append(frame)
    
    # Write video
    writer = imageio.get_writer(output_path, fps=fps, codec='libx264', 
                                 output_params=['-pix_fmt', 'yuv420p', '-crf', '28'])
    for frame in frames:
        writer.append_data(frame)
    writer.close()
    
    return output_path


# Category colors
CATEGORY_COLORS = {
    '用药科普': {'bg': (219, 234, 254), 'primary': (37, 99, 235), 'accent': (59, 130, 246)},
    '季节养生': {'bg': (254, 243, 199), 'primary': (245, 158, 11), 'accent': (251, 191, 36)},
    '慢病管理': {'bg': (224, 231, 255), 'primary': (99, 102, 241), 'accent': (129, 140, 248)},
    '药品对比': {'bg': (254, 226, 226), 'primary': (239, 68, 68), 'accent': (248, 113, 113)},
    '营养保健': {'bg': (254, 249, 195), 'primary': (234, 179, 8), 'accent': (250, 204, 21)},
    '日常保健': {'bg': (222, 247, 226), 'primary': (22, 163, 74), 'accent': (34, 197, 94)},
    '抗过敏专题': {'bg': (252, 231, 243), 'primary': (236, 72, 153), 'accent': (244, 114, 182)},
    '中医中药': {'bg': (243, 232, 255), 'primary': (168, 85, 247), 'accent': (192, 132, 252)},
    '消化健康': {'bg': (254, 215, 170), 'primary': (234, 88, 12), 'accent': (251, 146, 60)},
    '消化系统': {'bg': (254, 215, 170), 'primary': (234, 88, 12), 'accent': (251, 146, 60)},
    '清热解毒': {'bg': (254, 226, 226), 'primary': (239, 68, 68), 'accent': (248, 113, 113)},
    '用药指导': {'bg': (219, 234, 254), 'primary': (37, 99, 235), 'accent': (59, 130, 246)},
    '药品科普': {'bg': (209, 250, 229), 'primary': (16, 185, 129), 'accent': (52, 211, 153)},
    '健康养生': {'bg': (222, 247, 226), 'primary': (22, 163, 74), 'accent': (34, 197, 94)},
    '产品介绍': {'bg': (224, 231, 255), 'primary': (99, 102, 241), 'accent': (129, 140, 248)},
    '疾病预防': {'bg': (254, 243, 199), 'primary': (245, 158, 11), 'accent': (251, 191, 36)},
}

DEFAULT_COLORS = {'bg': (219, 234, 254), 'primary': (37, 99, 235), 'accent': (59, 130, 246)}


def get_colors(category):
    return CATEGORY_COLORS.get(category, DEFAULT_COLORS)


# Mobile/Mall videos (12)
MOBILE_VIDEOS = [
    ('V001', '阿莫西林用药科普：正确使用抗生素', '用药科普', 'P0001'),
    ('V002', '板蓝根颗粒季节性用药指南', '季节养生', 'P0007'),
    ('V003', '复方丹参滴丸：心脑血管患者的常备药', '慢病管理', 'P0003'),
    ('V004', '连花清瘟胶囊 vs 蓝芩口服液', '药品对比', 'P0004'),
    ('V005', '维生素C的正确补充方式', '营养保健', 'P0006'),
    ('V006', '健胃消食片：饭后一片消化无忧', '日常保健', 'P0008'),
    ('V007', '氯雷他定片：过敏季的守护者', '抗过敏专题', 'P0009'),
    ('V008', '六味地黄丸：滋阴补肾经典名方', '中医中药', 'P0012'),
    ('V009', '蒙脱石散：腹泻用药全攻略', '消化健康', 'P0014'),
    ('V010', '奥美拉唑：胃病患者的长期用药管理', '消化系统', 'P0022'),
    ('V011', '钙尔奇D：科学补钙全攻略', '营养保健', 'P0010'),
    ('V012', '蒲地蓝消炎口服液：天然抗生素', '清热解毒', 'P0020'),
]

# Sales/Admin videos (12) - different content
SALES_VIDEOS = [
    ('V001', '阿莫西林用药指南', '用药指导', 'P001'),
    ('V002', '高血压日常用药注意事项', '药品科普', 'P010'),
    ('V003', '维生素C的正确补充方式', '健康养生', 'P016'),
    ('V004', '板蓝根颗粒四季妙用', '产品介绍', 'P003'),
    ('V005', '奥美拉唑用药常见误区', '用药指导', 'P011'),
    ('V006', '夏季肠胃病预防全攻略', '疾病预防', 'P012'),
    ('V007', '六味地黄丸功效详解', '产品介绍', 'P007'),
    ('V008', '鱼油软胶囊选购指南', '产品介绍', 'P016'),
    ('V009', '阿托伐他汀与心血管健康', '药品科普', 'P006'),
    ('V010', '金银花露夏季清热妙用', '健康养生', 'P003'),
    ('V011', '头孢类抗生素安全用药', '用药指导', 'P017'),
    ('V012', '医用口罩正确佩戴方法', '健康养生', 'P017'),
]


def main():
    # Generate videos for mobile/mall
    for project in ['mobile', 'mall']:
        video_dir = f'{BASE}/{project}/src/static/videos'
        os.makedirs(video_dir, exist_ok=True)
        
        for vid, title, category, product_id in MOBILE_VIDEOS:
            output_path = f'{video_dir}/{vid}.mp4'
            
            # Load product image as base
            img_path = f'{BASE}/{project}/src/static/images/products/{product_id}.png'
            if os.path.exists(img_path):
                base_img = Image.open(img_path).convert('RGBA')
            else:
                # Fallback: create a simple colored image
                colors = get_colors(category)
                base_img = Image.new('RGBA', (400, 400), colors['bg'])
            
            colors = get_colors(category)
            print(f'Generating {project}/{vid}.mp4 - {title}')
            generate_video(output_path, base_img, title, category, colors, duration=8, fps=24)
    
    # Generate videos for sales/admin
    for project in ['sales', 'admin']:
        video_dir = f'{BASE}/{project}/src/static/videos'
        os.makedirs(video_dir, exist_ok=True)
        
        for vid, title, category, product_id in SALES_VIDEOS:
            output_path = f'{video_dir}/{vid}.mp4'
            
            img_path = f'{BASE}/{project}/src/static/images/products/{product_id}.png'
            if os.path.exists(img_path):
                base_img = Image.open(img_path).convert('RGBA')
            else:
                colors = get_colors(category)
                base_img = Image.new('RGBA', (400, 400), colors['bg'])
            
            colors = get_colors(category)
            print(f'Generating {project}/{vid}.mp4 - {title}')
            generate_video(output_path, base_img, title, category, colors, duration=8, fps=24)
    
    print('\nAll test videos generated successfully!')
    print(f'Total: {len(MOBILE_VIDEOS) * 2 + len(SALES_VIDEOS) * 2} videos (4 projects)')
    
    # Print file sizes
    for project in ['mobile', 'sales', 'mall', 'admin']:
        video_dir = f'{BASE}/{project}/src/static/videos'
        if os.path.exists(video_dir):
            files = [f for f in os.listdir(video_dir) if f.endswith('.mp4')]
            total_size = sum(os.path.getsize(os.path.join(video_dir, f)) for f in files)
            print(f'  {project}: {len(files)} videos, {total_size / 1024 / 1024:.1f} MB total')


if __name__ == '__main__':
    main()
