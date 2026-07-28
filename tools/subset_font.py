#!/usr/bin/env python3
"""把 media/fonts/FZJuZXFJF.TTF 切成按需加载的 woff2 子集。

FZJuZXFJF.TTF（方正聚珍新仿简繁）收了 10305 个字，6.6 MB。整份发给读者，等于
每次访问都要先下 6.6 MB 才看到正文的字形。

切法配合 CSS 的 unicode-range，让浏览器只取当前页面真正命中的那一份：

  zh-core   站内现有全部文字用到的字 + 标点 + 拉丁字母，约 248 KB
  zh-cjk-a  U+4E00–7FFF 里 core 没收的字，兜底
  zh-cjk-b  U+3400–4DBF / U+8000–9FFF / U+F900–FAFF 里 core 没收的字，兜底

三档的码位互不相交，所以常规访问只会下 zh-core；兜底档要等页面上出现 core
之外的字才会被请求，跟声明顺序、加载先后都无关（细节见 main() 里的注释）。

写出两个文件：
  media/css/style.css           —— core 的 @font-face，在 FONT-SUBSETS 标记之间
  media/css/fonts-fallback.css  —— 两档兜底，由 layout 异步加载

发新文章后重跑一次（`rake fonts`），新字就并入 core，兜底档继续闲着。

依赖：pip install "fonttools[woff]" brotli
用法：python3 tools/subset_font.py     （在仓库根目录跑）
"""

import glob
import os
import sys

try:
    from fontTools.ttLib import TTFont
    from fontTools import subset
except ImportError:
    sys.exit('缺少依赖：pip install "fonttools[woff]" brotli')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'media/fonts/FZJuZXFJF.TTF')
OUT = os.path.join(ROOT, 'media/fonts')

# 正文之外仍需保证覆盖的码位：ASCII、Latin-1、通用标点、CJK 标点、全角、竖排标点
BASE = (
    set(range(0x20, 0x7F))
    | set(range(0xA0, 0x100))
    | set(range(0x2000, 0x2070))
    | set(range(0x3000, 0x3040))
    | set(range(0xFF00, 0xFF61))
    | set(range(0xFE10, 0xFE20))
    | {0x00D7, 0x2190, 0x2192, 0x25CF, 0x2713}
)

# 兜底档的分段。区段写死，unicode-range 才能短到可以直接写进 CSS。
FALLBACKS = [
    ('zh-cjk-a.woff2', [(0x4E00, 0x7FFF)]),
    ('zh-cjk-b.woff2', [(0x3400, 0x4DBF), (0x8000, 0x9FFF), (0xF900, 0xFAFF)]),
]

# 会出现在页面上的中文不止文章正文：布局、导航标题、按钮文案（"复制""已复制"）
# 都要算进来，漏一个字就会让浏览器为它去下 1.5 MB 的兜底档。
CONTENT_GLOBS = ['_posts/*.md', '_posts/*.markdown', '*.markdown',
                 '_layouts/*.html', '_includes/**/*.html', '_config.yml',
                 'media/js/*.js']


def corpus_codepoints():
    """站内所有会被排版的文本里出现过的字符。"""
    chars = set()
    for pattern in CONTENT_GLOBS:
        for path in glob.glob(os.path.join(ROOT, pattern), recursive=True):
            if os.path.isfile(path):
                with open(path, encoding='utf-8', errors='ignore') as handle:
                    chars |= set(handle.read())
    return {ord(c) for c in chars if ord(c) > 0x1F}


def css_ranges(codes):
    """把码位集合压成 CSS unicode-range 语法。"""
    spans, start, prev = [], None, None
    for code in sorted(codes):
        if start is None:
            start = prev = code
        elif code == prev + 1:
            prev = code
        else:
            spans.append((start, prev))
            start = prev = code
    if start is not None:
        spans.append((start, prev))
    return ','.join('U+%X' % a if a == b else 'U+%X-%X' % (a, b) for a, b in spans)


def build(codes, filename):
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']
    options.hinting = True
    options.notdef_outline = True
    font = subset.load_font(SRC, options)
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=codes)
    subsetter.subset(font)
    path = os.path.join(OUT, filename)
    subset.save_font(font, path, options)
    font.close()
    return path


FACE = '''@font-face {
  font-family: "zh-font";
  src: url("../fonts/%s") format("woff2");
  font-display: swap;
  /* %d 字 */
  unicode-range: %s;
}'''


FALLBACK_HEADER = '''@charset "UTF-8";

/* 由 tools/subset_font.py 生成，别手改。

   兜底字体档，只有页面里出现 zh-core 之外的字时才会被请求。
   单独成文件、并在 <head> 里异步加载：这两段 unicode-range 精确到每个码位，
   展开有二十多 KB，不该挡在首屏渲染前面。 */

'''


def write_css(core_block, fallback_blocks):
    """把生成的 @font-face 直接写回样式文件。

    手工粘贴迟早会忘：子集和 CSS 里的 unicode-range 一旦对不上，浏览器就会
    为了一个字白下一兆多的兜底档。所以让脚本自己改。
    """
    path = os.path.join(ROOT, 'media/css/style.css')
    with open(path, encoding='utf-8') as handle:
        css = handle.read()

    start, end = '/* FONT-SUBSETS:START */', '/* FONT-SUBSETS:END */'
    head, _, rest = css.partition(start)
    _, _, tail = rest.partition(end)
    if rest and tail:
        with open(path, 'w', encoding='utf-8') as handle:
            handle.write('%s%s\n%s\n%s%s' % (head, start, FACE % core_block, end, tail))
        print('已更新 media/css/style.css 的 @font-face。')
    else:
        print('警告：style.css 里找不到 %s / %s 标记，跳过写入。' % (start, end))

    path = os.path.join(ROOT, 'media/css/fonts-fallback.css')
    with open(path, 'w', encoding='utf-8') as handle:
        handle.write(FALLBACK_HEADER + '\n\n'.join(FACE % b for b in fallback_blocks) + '\n')
    print('已写入 media/css/fonts-fallback.css。')


def main():
    with TTFont(SRC, lazy=True) as font:
        available = set(font.getBestCmap())

    core = (corpus_codepoints() | BASE) & available
    fallback_blocks = []

    # 三档的码位互不相交，这一点很要紧：
    #
    # 1. 不相交，浏览器就只会为某个码位下唯一那一档，跟 @font-face 的声明顺序、
    #    文件加载先后都无关。（重叠时的规则是"后声明的胜出"，一旦把 core 和兜底档
    #    拆进两个文件、又异步加载其中一个，这个先后就不再可控。）
    # 2. unicode-range 得贴着字库实际收了哪些字写，不能图省事写整段区间。
    #    浏览器按声明的区间决定要不要下载，不看文件里真有没有那个字形：区间写宽了，
    #    遇到一个字库本来就没收的字（比如"赵孟頫"的頫），会白下一兆多，
    #    然后照样回落到系统字体。
    for filename, spans in FALLBACKS:
        codes = {c for c in available
                 if any(lo <= c <= hi for lo, hi in spans)} - core
        if not codes:
            continue
        size = os.path.getsize(build(codes, filename)) / 1024
        print('%-16s %5d 字  %7.0f KB' % (filename, len(codes), size))
        fallback_blocks.append((filename, len(codes), css_ranges(codes)))

    size = os.path.getsize(build(core, 'zh-core.woff2')) / 1024
    print('%-16s %5d 字  %7.0f KB' % ('zh-core.woff2', len(core), size))
    core_block = ('zh-core.woff2', len(core), css_ranges(core))

    write_css(core_block, fallback_blocks)


if __name__ == '__main__':
    main()
