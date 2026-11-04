(() => {
  "use strict";

  // Chinese lives in the HTML; English is swapped in from here.
  const EN = {
    "skip": "Skip to content",
    "hero.title": "Press red. Tapir handles the rest.",
    "cta": "Coming to the Mac App Store",
    "gh": "Download on GitHub",
    "store.note": "Not in the App Store yet. Once it is, this button opens it; for now, download from GitHub.",
    "island.label": "Tapir recording bar",
    "rec.label": "Try recording",
    "src.label": "Capture source",
    "src.display": "Display", "src.window": "Window", "src.area": "Area", "src.device": "Device",
    "cap.display": "The whole display, with camera, microphone and system audio if you want them.",
    "cap.window": "Just one window. Notifications and the rest of your desktop stay out of the shot.",
    "cap.area": "Draw a box and record only the part you're explaining.",
    "cap.device": "Plug in an iPhone or iPad with a cable and record its screen.",
    "t2.slate": "EDIT",
    "t2.title": "Editing you don't have to learn.",
    "t2.p": "Split, trim, reorder and change speed; anything you cut can be restored. Switch between thumbnails and waveform, and clips snap to their edges.",
    "t2.alt": "Tapir editor: canvas preview, background settings and a multi-track timeline",
    "keys.label": "Keyboard shortcuts",
    "k.s": "Split at the playhead", "k.b": "Blade tool", "k.qw": "Delete before / after the playhead",
    "k.jkl": "Reverse · pause · play", "k.m": "Drop a marker while recording, jump back to it while editing",
    "t3.slate": "CAMERA",
    "t3.title": "Camera moves that feel natural.",
    "t3.p": "The camera follows your cursor in and out, or holds a focus point you set. Screen 3D adds tilt, perspective and focus blur. Every zoom is a clip on the timeline: drag it to change its timing and curve.",
    "t3.a": "Follows the cursor", "t3.b": "Manual focus", "t3.c": "Screen 3D", "t3.d": "Opening animations",
    "t3.alt": "Tapir camera motion panel: zoom focus, zoom curve and zoom clips on the timeline",
    "t4.slate": "FRAME",
    "t4.title": "A frame that looks finished.",
    "t4.p": "Aspect ratio, crop, padding, corners, shadow, backgrounds and device frames, plus stickers, blur and spotlight. Save a look as a scene preset and apply it in one click.",
    "t4.alt": "A screen recording: a coastal photo",
    "kn.bg": "Background", "kn.wall": "Wallpaper", "kn.ink": "Graphite", "kn.blue": "Blue",
    "kn.pad": "Padding", "kn.radius": "Corners", "kn.s": "S", "kn.m": "M", "kn.l": "L", "kn.none": "None",
    "t4.aside": "Cursor and camera get the same care: cursor styles, click effects and hide-when-idle; camera position, shape and entrance.",
    "t5.slate": "EXPORT",
    "t5.title": "Export, and the project is still there.",
    "t5.fmt": "FORMAT", "t5.res": "RESOLUTION", "t5.fps": "FRAME RATE", "t5.src": "Source",
    "t5.p": "Preview and export share one renderer, so what you see is what you export. After exporting, open the project any time and keep editing.",
    "t6.slate": "LOCAL",
    "t6.title": "What you record stays on your Mac.",
    "t6.p": "No account, no upload, no ads, analytics SDKs or tracking. Projects, media and pointer data live in project files on your Mac; delete a project and they go with it.",
    "end.slate": "THAT'S A WRAP",
    "end.title": "Record the next one with Tapir.",
    "req.os": "macOS 14 or later", "req.oss": "Open source · MIT",
    "foot.issue": "Report an issue", "foot.privacy": "Privacy",
  };

  const html = document.documentElement;
  const nodes = [...document.querySelectorAll("[data-i18n]")];
  const zh = new Map(nodes.map((n) => [n, n.textContent]));
  const ariaNodes = [...document.querySelectorAll("[data-i18n-aria]")];
  const zhAria = new Map(ariaNodes.map((n) => [n, n.getAttribute("aria-label")]));
  const altNodes = [...document.querySelectorAll("[data-i18n-alt]")];
  const zhAlt = new Map(altNodes.map((n) => [n, n.alt]));
  const zhTitle = document.title;
  let lang = "zh";

  const t = (key, fallback) => (lang === "en" ? EN[key] ?? fallback : fallback);

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (_) { /* private mode: language just isn't remembered */ }
  }
  function read(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }

  function applyLang(next) {
    lang = next;
    html.lang = lang === "en" ? "en" : "zh-Hans";
    nodes.forEach((n) => { n.textContent = lang === "en" ? EN[n.dataset.i18n] ?? zh.get(n) : zh.get(n); });
    ariaNodes.forEach((n) => n.setAttribute("aria-label", t(n.dataset.i18nAria, zhAria.get(n))));
    altNodes.forEach((n) => { n.alt = t(n.dataset.i18nAlt, zhAlt.get(n)); });
    document.title = lang === "en" ? "Tapir · Screen recording and light editing for Mac" : zhTitle;
    document.querySelectorAll(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    updateCaption();
  }

  document.querySelectorAll(".lang button").forEach((b) =>
    b.addEventListener("click", () => { applyLang(b.dataset.lang); store("tapir.lang", b.dataset.lang); }));

  // ---------- capture source: the viewfinder reframes ----------
  const hero = document.getElementById("take-01");
  const srcBtn = hero.querySelector(".source-btn");
  const srcList = hero.querySelector(".source-list");
  const options = [...srcList.querySelectorAll("li")];
  const caption = hero.querySelector(".source-caption");
  const zhCaps = {
    display: "录整块屏幕。摄像头、麦克风和系统声音可以一起录。",
    window: "只录一个窗口，通知和桌面上的其他东西都不会入镜。",
    area: "框一块区域，只录你要讲的那部分。",
    device: "用数据线连上 iPhone 或 iPad，直接录它的屏幕。",
  };
  const zhNames = { display: "显示器", window: "窗口", area: "区域", device: "设备" };
  let active = 0;
  options.forEach((o) => { o.id = "src-" + o.dataset.value; });

  function updateCaption() {
    const src = hero.dataset.source;
    caption.textContent = t("cap." + src, zhCaps[src]);
    const name = srcBtn.querySelector(".src-name");
    name.dataset.i18n = "src." + src;
    name.textContent = t("src." + src, zhNames[src]);
  }

  function setSource(value) {
    hero.dataset.source = value;
    srcBtn.querySelector(".src-ico use").setAttribute("href", "#ico-" + value);
    options.forEach((o) => o.setAttribute("aria-selected", String(o.dataset.value === value)));
    updateCaption();
  }

  function openList() {
    srcList.hidden = false;
    srcBtn.setAttribute("aria-expanded", "true");
    active = options.findIndex((o) => o.getAttribute("aria-selected") === "true");
    highlight();
    srcList.tabIndex = -1;
    srcList.focus();
  }
  function closeList(refocus) {
    srcList.hidden = true;
    srcBtn.setAttribute("aria-expanded", "false");
    if (refocus) srcBtn.focus();
  }
  function highlight() {
    options.forEach((o, i) => o.classList.toggle("is-active", i === active));
    srcList.setAttribute("aria-activedescendant", options[active].id);
  }

  srcBtn.addEventListener("click", () => (srcList.hidden ? openList() : closeList(true)));
  options.forEach((o, i) => {
    o.addEventListener("click", () => { setSource(o.dataset.value); closeList(true); });
    o.addEventListener("mouseenter", () => { active = i; highlight(); });
  });
  srcList.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { active = (active + 1) % options.length; highlight(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { active = (active + options.length - 1) % options.length; highlight(); e.preventDefault(); }
    else if (e.key === "Enter" || e.key === " ") { setSource(options[active].dataset.value); closeList(true); e.preventDefault(); }
    else if (e.key === "Escape" || e.key === "Tab") { closeList(e.key === "Escape"); }
  });
  document.addEventListener("click", (e) => { if (!srcList.hidden && !hero.querySelector(".source").contains(e.target)) closeList(false); });

  // Scrolling over the capsule steps through sources, as in the app.
  let wheelTravel = 0;
  srcBtn.addEventListener("wheel", (e) => {
    e.preventDefault();
    wheelTravel += e.deltaY;
    if (Math.abs(wheelTravel) < 40) return;
    const order = options.map((o) => o.dataset.value);
    const i = order.indexOf(hero.dataset.source);
    setSource(order[(i + (wheelTravel > 0 ? 1 : order.length - 1)) % order.length]);
    wheelTravel = 0;
  }, { passive: false });

  // ---------- the record key: the take's timecode runs ----------
  const rec = hero.querySelector(".rec");
  const tc = document.getElementById("hero-tc");
  let frames = 12 * 30, timer = null;
  const fmt = (f) => {
    const s = Math.floor(f / 30);
    return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((v) => String(v).padStart(2, "0")).join(":");
  };
  rec.addEventListener("click", () => {
    const on = rec.getAttribute("aria-pressed") !== "true";
    rec.setAttribute("aria-pressed", String(on));
    hero.classList.toggle("is-rec", on);
    clearInterval(timer);
    if (on) timer = setInterval(() => { frames += 30; tc.textContent = fmt(frames); }, 1000);
  });

  // ---------- not in the store yet ----------
  document.querySelectorAll("[data-store]").forEach((b) => b.addEventListener("click", () => {
    const note = document.getElementById(b.getAttribute("aria-describedby"));
    note.hidden = false;
  }));

  // ---------- TAKE 04 knobs ----------
  const stage = document.querySelector(".stage");
  document.querySelectorAll(".seg").forEach((seg) => {
    seg.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      stage.dataset[seg.dataset.target] = b.dataset.v;
    });
  });

  // ?lang=en / ?lang=zh links straight to a language; then a saved choice; then the browser.
  const param = new URLSearchParams(location.search).get("lang");
  const saved = read("tapir.lang");
  const pick = [param, saved].find((v) => v === "zh" || v === "en");
  applyLang(pick || (/^zh/i.test(navigator.language || "") ? "zh" : "en"));
})();
