/**
 * 站点脚本。原先这些行为分散在 jQuery 1.7.1、code-line-numbers.js 和几段内联
 * script 里；现在合成一份原生实现，jQuery 就不必再进每一个页面了。
 *
 * 1. 代码高亮 + 复制按钮
 * 2. 标签页的筛选
 * 3. Disqus 按需加载
 * 4. 明暗主题：默认跟系统，点一下记住选择，再点回系统值就继续跟随
 */
(function () {
  'use strict';

  var ICON = {
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 8v4.5M12 16h.01"/></svg>'
  };

  function highlight() {
    if (typeof window.hljs === 'undefined') return;
    // 限定候选语言，自动识别就不会把 lua 猜成别的冷门语法
    window.hljs.configure({
      languages: ['lua', 'javascript', 'bash', 'shell', 'css', 'xml', 'json',
                  'ruby', 'python', 'go', 'rust', 'yaml', 'markdown'],
      ignoreUnescapedHTML: true
    });
    window.hljs.highlightAll();
  }

  function addCopyButtons() {
    if (!navigator.clipboard) return;

    document.querySelectorAll('.prose pre').forEach(function (pre) {
      var code = pre.querySelector('code');
      if (!code || pre.querySelector('.copy-button')) return;

      var button = document.createElement('button');
      var timer;

      // 纯图标按钮：状态只靠图标和颜色表达，文字交给 aria-label / title
      button.type = 'button';
      button.className = 'copy-button';
      button.setAttribute('aria-label', '复制这段代码');
      button.title = '复制';
      button.innerHTML = ICON.copy;

      function settle(state, icon, announce) {
        button.dataset.state = state;
        button.innerHTML = icon;
        button.setAttribute('aria-label', announce);
        button.title = announce;
        clearTimeout(timer);
        timer = setTimeout(function () {
          delete button.dataset.state;
          button.innerHTML = ICON.copy;
          button.setAttribute('aria-label', '复制这段代码');
          button.title = '复制';
        }, 2000);
      }

      button.addEventListener('click', function () {
        navigator.clipboard.writeText(code.textContent).then(function () {
          settle('done', ICON.check, '已复制到剪贴板');
        }, function () {
          settle('failed', ICON.alert, '复制失败，请手动选择');
        });
      });

      pre.appendChild(button);
    });
  }

  // 表格比正文栏宽时让它自己横向滚，不要把整页拖宽。
  // kramdown 不会给 table 套容器，所以这里补一个。
  function wrapTables() {
    document.querySelectorAll('.prose table').forEach(function (table) {
      if (table.parentNode.classList.contains('table-scroll')) return;
      var box = document.createElement('div');
      box.className = 'table-scroll';
      table.parentNode.insertBefore(box, table);
      box.appendChild(table);
    });
  }

  function tagFilter() {
    var cloud = document.querySelector('.tag-cloud');
    if (!cloud) return;

    var buttons = Array.prototype.slice.call(cloud.querySelectorAll('[data-tag]'));
    var items = Array.prototype.slice.call(document.querySelectorAll('.listing-item[data-tags]'));
    var empty = document.querySelector('.listing-empty');

    // animate=true 时留下的行按新顺序错落进入；进页时的初始筛选不用，页面本身在入场
    function apply(tag, animate) {
      var shown = 0;

      buttons.forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.dataset.tag === tag));
      });

      items.forEach(function (item) {
        var match = !tag || item.dataset.tags.split(',').indexOf(tag) !== -1;
        item.hidden = !match;
        item.classList.remove('is-entering');
        if (match) {
          if (animate) item.style.setProperty('--i', shown);
          shown += 1;
        }
      });

      if (animate) {
        // 只换 class 不会重启一个已经播完的 CSS 动画（animation-name 没变）。
        // 先把 animation 清成 none 强制回流，再放开，浏览器才会当成新动画重新播
        items.forEach(function (item) {
          if (!item.hidden) item.style.animation = 'none';
        });
        void document.body.offsetWidth;
        items.forEach(function (item) {
          if (item.hidden) return;
          item.style.animation = '';
          item.classList.add('is-entering');
        });
      }

      if (empty) empty.hidden = shown !== 0;

      // 地址栏跟上，筛选结果可以直接分享出去
      var url = tag ? '#' + encodeURIComponent(tag) : location.pathname;
      history.replaceState(null, '', url);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        // 再点一次同一个标签就是取消筛选
        apply(button.getAttribute('aria-pressed') === 'true' ? '' : button.dataset.tag, true);
      });
    });

    // 文章里的 #标签 链接指向 /tags.html#xxx，进来就该是筛好的状态
    if (location.hash) {
      var wanted = decodeURIComponent(location.hash.slice(1));
      if (buttons.some(function (b) { return b.dataset.tag === wanted; })) apply(wanted);
    }
  }

  function comments() {
    var toggle = document.querySelector('[data-comment-toggle]');
    if (!toggle) return;

    var thread = document.getElementById('disqus_thread');

    toggle.addEventListener('click', function () {
      window.disqus_shortname = toggle.dataset.shortname;
      window.disqus_identifier = toggle.dataset.identifier;

      var script = document.createElement('script');
      script.src = 'https://' + toggle.dataset.shortname + '.disqus.com/embed.js';
      script.async = true;
      document.head.appendChild(script);

      toggle.hidden = true;
      if (thread) thread.setAttribute('aria-busy', 'true');
    }, { once: true });
  }

  function themeToggle() {
    var button = document.querySelector('[data-theme-toggle]');
    if (!button) return;

    var root = document.documentElement;
    var lightMeta = document.querySelector('meta[name="theme-color"]:not([media])');
    var darkMeta = document.querySelector('meta[name="theme-color"][media]');

    function systemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function readStored() {
      try { return localStorage.getItem('theme'); } catch (e) { return null; }
    }

    function writeStored(value) {
      try {
        if (value) localStorage.setItem('theme', value);
        else localStorage.removeItem('theme');
      } catch (e) {}
    }

    // 三态：system 跟随系统（默认，不写存储）、light、dark。点击按此顺序循环。
    var ORDER = ['system', 'light', 'dark'];
    var LABEL = { system: '跟随系统', light: '浅色', dark: '深色' };

    function storedMode() {
      var v = readStored();
      return v === 'light' || v === 'dark' ? v : 'system';
    }

    function apply(mode) {
      var theme = mode === 'system' ? systemTheme() : mode;
      root.dataset.mode = mode;
      root.dataset.theme = theme;
      if (lightMeta) lightMeta.setAttribute('content', theme === 'dark' ? '#2c2924' : '#f8f5f1');
      if (darkMeta) darkMeta.disabled = true;
      var next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
      button.setAttribute('aria-label', '外观：' + LABEL[mode] + '，点按切换为' + LABEL[next]);
      button.title = '外观：' + LABEL[mode];
    }

    apply(storedMode());

    button.addEventListener('click', function () {
      var next = ORDER[(ORDER.indexOf(storedMode()) + 1) % ORDER.length];
      writeStored(next === 'system' ? '' : next);
      apply(next);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (storedMode() === 'system') apply('system');
    });
  }

  function init() {
    highlight();
    addCopyButtons();
    wrapTables();
    tagFilter();
    comments();
    themeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
