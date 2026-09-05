#!/usr/bin/env python3
"""把 tools/fonts-src 里的原档切成站点用的拉丁 woff2 子集，写到 media/fonts。

中文不再发字体文件：Mac/iOS 用苹方、Windows 用雅黑、Android/Linux 用思源黑体，
都在读者系统里，见 style.css 的 --sans。只有拉丁部分自托管：

  archivo.woff2          Archivo 变量字体，wght 400–700、wdth 钉在 104，标题和正文的英文/数字
  commit-mono.woff2      Commit Mono 400
  commit-mono-bold.woff2 Commit Mono 700
                         代码块的兜底；Apple 设备走 ui-monospace 拿到 SF Mono

字符集只保留拉丁、常用标点、箭头等（见 UNICODES），Archivo 约 29 KB、Commit Mono 各约 15 KB。
换字体版本时把新原档放进 tools/fonts-src 重跑即可。

依赖：uvx --from 'fonttools==4.64.0' --with brotli python3 tools/build_fonts.py
  或  pip install "fonttools[woff]" brotli && python3 tools/build_fonts.py
"""

import os
import sys

try:
    from fontTools import subset
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
except ImportError:
    sys.exit("缺少依赖：uvx --from 'fonttools==4.64.0' --with brotli python3 tools/build_fonts.py")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'tools/fonts-src')
OUT = os.path.join(ROOT, 'media/fonts')

# Google Fonts 的 latin 子集（不含 latin-ext），再加站内会用到的箭头。
# 中文站里的英文就是英文，带变音符的西欧字词交给系统字体兜底
UNICODES = (
    'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,'
    'U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD'
)


# 这些标点在中文里应该是全角形态（“”——……），从 Archivo 里剔掉，让苹方/雅黑接手
CJK_PUNCT = 'U+2013-2014,U+2018-201D,U+2026'


def build(src, dst, axes=None, exclude=''):
    # recalcTimestamp=False：否则每次保存都把 head.modified 改成当前时间，
    # 产物进了版本库，同样的输入应当得到同样的字节
    font = TTFont(os.path.join(SRC, src), recalcTimestamp=False)
    if axes:
        # 变量字体先裁轴范围，文件能小一半；保留轴本身，CSS 还能用 font-stretch。
        # 裁完先落盘再重开：instancer 返回的对象里 glyf 是惰性表，直接喂给 subsetter 会 KeyError
        font = instancer.instantiateVariableFont(font, axes)
        tmp = os.path.join(OUT, '.instanced.ttf')
        font.save(tmp)
        font = TTFont(tmp, recalcTimestamp=False)
        os.remove(tmp)

    options = subset.Options()
    options.flavor = 'woff2'
    # 不用 '*'：那会把所有 ss01… 替代字形一并拉进闭包，文件翻十倍。
    # 默认集已含 kern/liga/calt 等；补上表格数字给日期和计数用
    options.layout_features += ['tnum', 'lnum', 'zero']
    options.notdef_outline = True
    options.desubroutinize = True

    subsetter = subset.Subsetter(options)
    unicodes = set(subset.parse_unicodes(UNICODES)) - set(subset.parse_unicodes(exclude))
    subsetter.populate(unicodes=sorted(unicodes))
    subsetter.subset(font)

    # options.flavor 只作用于 subset.save()；这里直接 font.save，得自己把 flavor 设上，
    # 否则写出来的是裸 TTF/OTF，浏览器靠嗅探也能用，但体积没压缩
    font.flavor = 'woff2'
    path = os.path.join(OUT, dst)
    font.save(path)
    print(f'{dst:26} {os.path.getsize(path) / 1024:6.1f} KB')


def main():
    os.makedirs(OUT, exist_ok=True)
    # 宽度轴钉在 104：比默认略宽一点，Styrene 那种敦实感；只留字重轴，文件减半
    build('Archivo[wdth,wght].ttf', 'archivo.woff2',
          axes={'wght': (400, 700), 'wdth': 104}, exclude=CJK_PUNCT)
    # 斜体不发，注释用合成斜体够了
    build('CommitMono-400-Regular.otf', 'commit-mono.woff2')
    build('CommitMono-700-Regular.otf', 'commit-mono-bold.woff2')


if __name__ == '__main__':
    main()
