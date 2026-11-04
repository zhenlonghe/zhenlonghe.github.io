#!/usr/bin/env python3
"""把 tools/fonts-src 里的原档切成站点用的 woff2 子集，写到 media/fonts。

  oppo-sans.woff2        OPPO Sans 4.0 变量字体，wght 400–700。中文、英文、数字共用。
                         字集来自当前站点文稿 + 拉丁/标点兜底，约 200 KB。
                         新文章若出现未见过的汉字，会暂时落到 --sans 的系统黑体；
                         重跑本脚本就会收进子集。Tapir 落地页 tapir/ 的文字也收在内，
                         改了落地页文案同样要重跑。
  commit-mono.woff2      Commit Mono 400
  commit-mono-bold.woff2 Commit Mono 700
                         代码块的兜底；Apple 设备走 ui-monospace 拿到 SF Mono

OPPO Sans 原档约 22 MB，不进版本库。缺档时从开放平台拉官方 zip。
授权见 tools/fonts-src/LICENSE-OPPOSans.txt：可嵌入使用，不得把字体当独立文件再分发。

依赖：uvx --from 'fonttools==4.64.0' --with brotli python3 tools/build_fonts.py
  或  pip install "fonttools[woff]" brotli && python3 tools/build_fonts.py
"""

import glob
import os
import sys
import zipfile
from urllib.request import Request, urlopen

try:
    from fontTools import subset
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
except ImportError:
    sys.exit("缺少依赖：uvx --from 'fonttools==4.64.0' --with brotli python3 tools/build_fonts.py")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'tools/fonts-src')
OUT = os.path.join(ROOT, 'media/fonts')

OPPO_TTF = 'OPPO Sans 4.0.ttf'
OPPO_ZIP = (
    'https://openfs.oppomobile.com/open/oop/202410/18/'
    '62d51f494591f1a9040d83b597745911.zip'
)

# Google Fonts 的 latin 子集（不含 latin-ext），再加站内会用到的箭头。
# 尚未在文稿里出现的英文/数字也先收进来，避免标题里一个 Zhenlong 去拼系统字体
LATIN = (
    'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,'
    'U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD,'
    'U+3000-303F,U+FF00-FFEF'
)


def ensure_oppo():
    path = os.path.join(SRC, OPPO_TTF)
    if os.path.isfile(path) and os.path.getsize(path) > 1_000_000:
        return path

    os.makedirs(SRC, exist_ok=True)
    print('Downloading OPPO Sans 4.0 …')
    req = Request(OPPO_ZIP, headers={
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://open.oppomobile.com/',
    })
    zip_path = os.path.join(SRC, 'OPPO_Sans_4.0.zip')
    with urlopen(req) as resp, open(zip_path, 'wb') as fh:
        fh.write(resp.read())
    with zipfile.ZipFile(zip_path) as zf:
        for name in zf.namelist():
            if name.endswith('.ttf'):
                with zf.open(name) as src, open(path, 'wb') as dst:
                    dst.write(src.read())
            elif name.endswith('License Notice.txt'):
                license_path = os.path.join(SRC, 'LICENSE-OPPOSans.txt')
                if not os.path.isfile(license_path):
                    with zf.open(name) as src, open(license_path, 'wb') as dst:
                        dst.write(src.read())
    os.remove(zip_path)
    if not os.path.isfile(path):
        sys.exit('官方 zip 里没有 TTF')
    print(f'{OPPO_TTF:26} {os.path.getsize(path) / 1024 / 1024:6.1f} MB  (source)')
    return path


def site_text():
    chunks = []
    patterns = [
        os.path.join(ROOT, '_posts', '**', '*.md'),
        os.path.join(ROOT, '_layouts', '**', '*.html'),
        os.path.join(ROOT, '_includes', '**', '*.html'),
        os.path.join(ROOT, '*.markdown'),
        os.path.join(ROOT, '_config.yml'),
        # Tapir 落地页（/tapir/）是静态页，同样用这份字体
        os.path.join(ROOT, 'tapir', 'index.html'),
        os.path.join(ROOT, 'tapir', 'assets', '*.js'),
    ]
    for pattern in patterns:
        for path in glob.glob(pattern, recursive=True):
            with open(path, encoding='utf-8') as fh:
                chunks.append(fh.read())
    return ''.join(chunks)


def build_oppo(src):
    font = TTFont(src, recalcTimestamp=False)
    font = instancer.instantiateVariableFont(font, {'wght': (400, 700)})
    tmp = os.path.join(OUT, '.instanced.ttf')
    font.save(tmp)
    font = TTFont(tmp, recalcTimestamp=False)
    os.remove(tmp)

    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features += ['tnum', 'lnum', 'locl', 'ccmp']
    options.notdef_outline = True
    options.desubroutinize = True
    options.ignore_missing_unicodes = True

    subsetter = subset.Subsetter(options)
    unicodes = set(subset.parse_unicodes(LATIN))
    unicodes.update(ord(ch) for ch in site_text())
    subsetter.populate(unicodes=sorted(unicodes))
    subsetter.subset(font)

    font.flavor = 'woff2'
    path = os.path.join(OUT, 'oppo-sans.woff2')
    font.save(path)
    print(f'{"oppo-sans.woff2":26} {os.path.getsize(path) / 1024:6.1f} KB')


def build_mono(src, dst):
    font = TTFont(os.path.join(SRC, src), recalcTimestamp=False)
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features += ['tnum', 'lnum', 'zero']
    options.notdef_outline = True
    options.desubroutinize = True

    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=sorted(subset.parse_unicodes(LATIN)))
    subsetter.subset(font)

    font.flavor = 'woff2'
    path = os.path.join(OUT, dst)
    font.save(path)
    print(f'{dst:26} {os.path.getsize(path) / 1024:6.1f} KB')


def main():
    os.makedirs(OUT, exist_ok=True)
    build_oppo(ensure_oppo())
    build_mono('CommitMono-400-Regular.otf', 'commit-mono.woff2')
    build_mono('CommitMono-700-Regular.otf', 'commit-mono-bold.woff2')
    stale = os.path.join(OUT, 'archivo.woff2')
    if os.path.isfile(stale):
        os.remove(stale)
        print('removed                  archivo.woff2')


if __name__ == '__main__':
    main()
