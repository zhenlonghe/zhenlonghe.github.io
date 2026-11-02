---
name: Zhenlong
description: 浅色纸面气质的个人阅读博客
colors:
  paper: "oklch(0.972 0.006 82)"
  paper-dark: "oklch(0.22 0.014 82)"
  surface: "oklch(0.945 0.008 82)"
  surface-high: "oklch(0.925 0.01 82)"
  line: "oklch(0.88 0.01 82)"
  line-strong: "oklch(0.78 0.014 82)"
  ink: "oklch(0.26 0.02 50)"
  ink-muted: "oklch(0.4 0.016 50)"
  ink-faint: "oklch(0.46 0.014 50)"
  ink-on-dark: "oklch(0.9 0.012 82)"
  accent: "oklch(0.38 0.06 248)"
  accent-hot: "oklch(0.32 0.07 248)"
  accent-on-dark: "oklch(0.78 0.055 248)"
typography:
  display:
    fontFamily: "OPPO Sans, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "OPPO Sans, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "OPPO Sans, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
  label:
    fontFamily: "Commit Mono, Cascadia Mono, Consolas, Liberation Mono, monospace"
    fontSize: "0.82rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "0.2rem"
spacing:
  gutter: "clamp(1.15rem, 4vw, 1.75rem)"
  content-gap: "1.25rem"
  measure: "40rem"
  stack: "1rem"
components:
  nav-link:
    textColor: "{colors.ink-muted}"
    typography: "{typography.body}"
    padding: "0"
  nav-link-current:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  listing-link:
    textColor: "{colors.ink}"
    padding: "0.8rem 0"
  copy-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-faint}"
    rounded: "{rounded.sm}"
    size: "1.7rem"
    padding: "0"
---

# Design System: Zhenlong

## Overview

**Creative North Star: "未涂布的纸页"**

这是一个给中文读者夜间或通勤阅读的个人档案。页面像一张未涂布的纸摊在桌上：淡底、近黑墨、一栏正文、几乎没有装饰。气质来自字号、行距和空白，不来自渐变、卡片或图标按钮。

页框（站名、图标导航、底色、标题、代码块）承担身份；阅读栏保持安静。链接用安静的墨蓝，从不用高饱和强调色撑场。

**Key Characteristics:**
- 浅色纸面，不是纯白，也不是奶油底配陶土红；夜间是暖近黑，默认跟随系统
- 一栏排版，量度线页眉、正文共用；没有页脚
- 页眉导航是同一套线性图标（归档、关于、RSS、明暗切换：24 画布、1.6 描边、圆角端点），无边框无底色；标签、社交、上下篇仍是文字，不是胶囊或圆形按钮
- 正文中英文共用自托管 OPPO Sans；缺字落到系统黑体；代码才用等宽

## Colors

纸面略暖偏灰，墨色偏暖近黑。链接是唯一带色相的角色，而且很克制。

### Primary
- **墨蓝** (`oklch(0.38 0.06 248)`): 链接、当前导航、复制成功。悬停再暗一档到 `accent-hot`。面积保持很小。

### Neutral
- **米纸** (`oklch(0.972 0.006 82)`): 页面底。
- **浅一层** (`oklch(0.945 0.008 82)`): 代码块和行内代码底。
- **暖墨** (`oklch(0.26 0.02 50)`): 正文和标题。
- **次墨** (`oklch(0.4 0.016 50)`): 导航默认、引用、次要链接。
- **淡墨** (`oklch(0.46 0.014 50)`): 日期、列表计数。对比仍过 AA。
- **细线** (`oklch(0.88 0.01 82)`): 页眉底边、列表行、代码块描边。

夜间把同一套角色翻成暖近黑纸面：底 `oklch(0.22 0.014 82)`，墨 `oklch(0.9 0.012 82)`，链接略提亮。默认跟随 `prefers-color-scheme`；用户点页眉里的太阳/月亮后写入 `localStorage`，再点回系统当前值就继续跟随。

**The Quiet Link Rule.** 颜色只用来标出可点的东西。不要用强调色做大色块、渐变或悬停底。

## Typography

**Display Font:** OPPO Sans 4.0（缺字落到苹方 / 雅黑 / 思源）
**Body Font:** 同一家族
**Label/Mono Font:** Commit Mono；Apple 上走 `ui-monospace` 拿 SF Mono

正文中英文共用 OPPO Sans。字号节奏参考窄栏中文阅读页：正文 17px、行高 1.8、栏宽 40rem（每行约 37 字），标题按约 1.2 倍递进，不用展示级大标题。字号在 `:root` 里以 `--text-*` 定义。正文和标题用比例数字，等宽数字只留给日期列表。日期写法：文章页 `May 6, 2026`（正文字体），列表 `May 06, 2025` / 归档 `May 06`（等宽、补零对齐）。

### Hierarchy
- **Display** (600, 1.5rem / 窄屏 1.375rem, 1.3): 文章标题、页面标题。
- **Headline**: 正文 h2 1.3125rem（窄屏 1.25rem）、h3 1.125rem、h4 1.0625rem 次墨，均 600。上方留白 2–2.4em，下方 0.6em，标题贴住它统领的段落。
- **Body** (400, 1.0625rem, 1.8): 散文。段距 0.9em，不用首行缩进。
- **Label** (等宽, 0.82rem): 日期和计数。等宽数字，不要全大写、不要宽字距。

**The One Family Rule.** 站名、正文、标题都用 OPPO Sans。等宽只给代码、日期、计数。

## Layout

单一量度线：`width: min(100% - gutter * 2, 40rem)`，水平居中。页眉左站名（1.75rem / 窄屏 1.5rem，全站最大的字），右侧四枚图标：归档、关于、RSS、外观切换（最右）。外观三态循环：跟随系统（默认，半实心圆）→ 浅色（太阳）→ 深色（月亮），选择存 localStorage，跟随系统时不存。子页面用 front matter 的 `parent` 归到父项（如 Studio 归到关于）。当前页在图标下方画一道 1px 短线。正文从上往下排，没有页脚。

归档按年分组，年份标签 sticky 贴顶，底就是纸面色，不用毛玻璃。窄屏列表把日期换到标题上方。触控目标在导航和标签筛选上至少约 44px 高。

## Elevation & Depth

没有阴影。层次靠纸面 / 浅一层底 / 1px 细线，以及字重和墨色深浅。

**The Flat Paper Rule.** 不要投影、不要玻璃、不要悬停渐变。

## Shapes

默认直角。只有代码块、行内代码和复制按钮用 0.2rem 小圆角，让代码块从纸面轻轻抬起，而不是变成卡片。

标签、导航、上下篇、留言按钮都没有盒子。选中态用下划线，不用填色胶囊。

## Components

### Navigation
文字链，默认次墨，当前页暖墨加下划线。不要图标圈。顺序：归档、标签、关于、RSS，末尾一枚无边框的太阳/月亮按钮切换明暗。

### Theme toggle
线框图标，没有底、没有圆圈。浅色显示月亮，深色显示太阳。默认跟随系统。

### Listing
日期一列、标题一列；窄屏改为上下叠。悬停只改标题颜色。不要行背景，不要位移。

### Tags
正文大小的文字。筛选选中：暖墨 + 下划线 + 稍重。列表里的标签是更小一号的次墨字。

### Code
浅一层底 + 细线。复制按钮是右上角的小方图标，常驻可见。语法高亮从纸面令牌里长出来，保持低饱和。

### Post navigation
上一篇 / 下一篇两列文字，顶部分隔线。下一篇右对齐。不要卡片。

### Comments
「留言」就是一条带下划线的文字按钮，按需加载 Disqus。

## Do's and Don'ts

### Do:
- **Do** 让读者进页就能读正文。页眉只留站名、四个字、一枚主题按钮。
- **Do** 用段距、行高和量度线表达「书」，而不是用衬线 webfont 或纸纹贴图。
- **Do** 给所有正文和元信息留出至少 AA 的对比；淡墨也不能掉下去。
- **Do** 尊重 `prefers-reduced-motion`。换页可以淡入淡出，不要进站画线或列表错落入场。

### Don't:
- **Don't** 回到暗色紫底、径向渐变、圆形描边按钮或胶囊标签。
- **Don't** 用奶油底 + 衬线大标题 + 陶土红那套默认「文艺博客」配方。
- **Don't** 把列表项、上下篇、引用做成卡片。
- **Don't** 给站名或页脚加全大写宽字距。
- **Don't** 给中文标题设以 `ch` 为单位的窄宽度。
