import os
import re
import shutil

base = '/Users/chenshenghe/WorkBuddy/2026-07-11-23-53-17/pharma-b2b/frontend'

# emoji -> wx-icon name (size will be set by context where possible)
emoji_map = {
    '🔍': 'search-white',
    '🔔': 'msg-white',
    '▶': 'play',
    '▼': 'arrow',
    '💊': 'pill',
    '🌡️': 'thermometer',
    '❤️': 'heart',
    '🌿': 'leaf',
    '🫁': 'stomach',
    '🍊': 'orange',
    '🤧': 'pill',
    '🫖': 'teapot',
    '✓': 'check',
    '✅': 'check',
    '⭐': 'star',
    '☆': 'star',
    '🛒': 'cart',
    '💰': 'money',
    '📦': 'box',
    '👥': 'people',
    '💳': 'money',
    '🎁': 'gift',
    '📊': 'chart',
    '📍': 'location',
    '🎬': 'video',
    '❤': 'heart',
    '‹': 'back',
    '↗': 'share',
    '⏸': 'pause',
    '🔥': 'fire',
    '💬': 'service',
    '🗑': 'trash',
    '➕': 'plus',
    '➖': 'minus',
    '📝': 'setting',
    '🏠': 'home',
    '👤': 'mine',
    '📈': 'chart',
    '🏢': 'box',
    '📱': 'phone',
    '📞': 'phone',
    '🎉': 'gift',
    '📺': 'video',
    '🚚': 'truck',
    '📢': 'bell',
    '📭': 'msg',
    '📋': 'clipboard',
    '🏦': 'bank',
    '📅': 'calendar',
    '💚': 'money',
    '📩': 'msg',
}

# Size hints by context (key is substring context around the emoji)
size_hints = {
    'search-icon': 32,
    'msg-icon': 36,
    'play-icon': 40,
    'play-text': 28,
    'video-play-icon': 64,
    'video-views': 20,
    'meta-item': 20,
    'r-views': 20,
    'meta-text': 20,
    'collapse-arrow': 24,
    'bb-icon': 36,
    'empty-icon': 120,
    'check-icon': 24,
    'quick-icon': 40,
    'func-icon': 44,
    'tab-icon': 36,
    'back-icon': 36,
    'share-icon': 32,
    'reward-emoji': 80,
    'empty-icon': 120,
    'func-icon': 44,
    'tab-icon': 36,
}

def infer_size(text, pos):
    # look at surrounding context within 60 chars
    start = max(0, pos - 60)
    end = min(len(text), pos + 60)
    ctx = text[start:end]
    for key, size in size_hints.items():
        if key in ctx:
            return size
    return 24

def replace_emoji_in_vue(path, prefix):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    for emoji, name in emoji_map.items():
        idx = 0
        while True:
            idx = content.find(emoji, idx)
            if idx == -1:
                break
            size = infer_size(content, idx)
            # If replacing inside a <text> tag, we need to replace the whole text content with a wx-icon
            replacement = f'<wx-icon name="{name}" size="{size}" />'
            content = content[:idx] + replacement + content[idx + len(emoji):]
            idx += len(replacement)

    # Fix the categories data: convert icon: '...' to icon: 'name' for quick grid categories
    # But since we replaced emojis, the data is now broken. We need to handle it specially.
    # We'll do a post-processing: find category objects and assign proper icon names based on category name.
    if 'pages/index/index.vue' in path and prefix == 'mobile':
        content = re.sub(
            r"(name: '抗生素类'[^}]*?)icon: '[^']*'",
            r"\1icon: 'pill'",
            content
        )
        content = re.sub(
            r"(name: '解热镇痛'[^}]*?)icon: '[^']*'",
            r"\1icon: 'thermometer'",
            content
        )
        content = re.sub(
            r"(name: '心脑血管'[^}]*?)icon: '[^']*'",
            r"\1icon: 'heart'",
            content
        )
        content = re.sub(
            r"(name: '清热解毒'[^}]*?)icon: '[^']*'",
            r"\1icon: 'leaf'",
            content
        )
        content = re.sub(
            r"(name: '消化系统'[^}]*?)icon: '[^']*'",
            r"\1icon: 'stomach'",
            content
        )
        content = re.sub(
            r"(name: '维生素类'[^}]*?)icon: '[^']*'",
            r"\1icon: 'orange'",
            content
        )
        content = re.sub(
            r"(name: '感冒用药'[^}]*?)icon: '[^']*'",
            r"\1icon: 'pill'",
            content
        )
        content = re.sub(
            r"(name: '滋补类'[^}]*?)icon: '[^']*'",
            r"\1icon: 'teapot'",
            content
        )
        # quick-icon-text should be replaced with wx-icon usage
        content = content.replace(
            '<text class="quick-icon-text">{{ cat.icon }}</text>',
            '<wx-icon :name="cat.icon" size="40" />'
        )

    # Convert status dot from colored bullet to a CSS circle if still exists (not emoji, but let's handle)
    # Also handle the <text class="status-dot">...</text> to be a colored view
    content = re.sub(
        r'<text class="status-dot"[^>]*>●</text>',
        r'<view class="status-dot" :style="{ background: product.stock > 0 ? \'#10B981\' : \'#EF4444\' }"></view>',
        content
    )
    content = re.sub(
        r'\.status-dot \{[^}]*\}',
        '.status-dot { width: 16rpx; height: 16rpx; border-radius: 50%; margin-right: 6rpx; }',
        content
    )

    # Add wx-icon imports if needed? easycom handles it, so no import needed.

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def process_project(prefix):
    src_dir = os.path.join(base, prefix, 'src')
    changed = []
    for root, dirs, files in os.walk(src_dir):
        for fn in files:
            if fn.endswith('.vue'):
                path = os.path.join(root, fn)
                if replace_emoji_in_vue(path, prefix):
                    changed.append(path)
    return changed

if __name__ == '__main__':
    for prefix in ['mobile', 'sales']:
        changed = process_project(prefix)
        print(f'[{prefix}] changed {len(changed)} files')
        for c in changed:
            print('  -', c)
