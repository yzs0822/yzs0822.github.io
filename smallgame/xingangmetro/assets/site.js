(function () {
  "use strict";

  var LK = "metro.lang", AK = "metro.a11y";
  var lang = localStorage.getItem(LK) || "zh-CN";
  var a11y = {};
  try { a11y = JSON.parse(localStorage.getItem(AK) || "{}") || {}; } catch (e) {}

  /* 全站通用英文 */
  var BASE_EN = {
    "a11y.skip": "Skip to main content",
    "top.a11y": "Accessibility",
    "head.hotline": "Service Hotline",
    "nav.home": "Home",
    "nav.lines": "Lines",
    "nav.time": "Timetable",
    "nav.news": "News",
    "nav.lost": "Lost & Found",
    "nav.staff": "Staff Login",
    "foot.org": "Xingang Metro Group Co., Ltd.",
    "foot.addr": "Address: No.1 Track Avenue, Binhai District, Xingang",
    "foot.fine": "© 2024 Xingang Metro Group Co., Ltd. ｜ This site is a fictional puzzle work, unrelated to any real organization, line or event."
  };
  var EN = Object.assign({}, BASE_EN, window.PAGE_I18N || {});

  /* ---------- 无障碍面板 ---------- */
  var PANEL_HTML =
    '<div class="a11y-panel" id="a11yPanel" role="dialog" aria-modal="false" aria-label="无障碍设置" hidden>' +
      '<div class="a11y-head">' +
        '<strong id="a11yTitle">无障碍设置</strong>' +
        '<button type="button" id="a11yClose" aria-label="关闭">×</button>' +
      '</div>' +
      '<div class="a11y-body">' +
        '<fieldset>' +
          '<legend id="a11yFontSize">字体大小</legend>' +
          '<div class="row" role="group">' +
            '<button type="button" data-zoom="1">标准</button>' +
            '<button type="button" data-zoom="1.15">大</button>' +
            '<button type="button" data-zoom="1.3">特大</button>' +
            '<button type="button" data-zoom="1.5">超大</button>' +
          '</div>' +
        '</fieldset>' +
        '<fieldset>' +
          '<legend id="a11yDisplay">显示</legend>' +
          '<label><input type="checkbox" id="optContrast"> 高对比度</label>' +
          '<label><input type="checkbox" id="optUnderline"> 链接下划线</label>' +
          '<label><input type="checkbox" id="optMotion"> 减弱动画</label>' +
        '</fieldset>' +
        '<button type="button" class="reset" id="a11yReset">恢复默认</button>' +
      '</div>' +
    '</div>';

  /* ---------- 简繁转换 ---------- */
  function toTraditional(root, convert) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        var t = p.nodeName;
        if (t === "SCRIPT" || t === "STYLE" || t === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (x) { x.nodeValue = convert(x.nodeValue); });
    root.querySelectorAll("[placeholder],[title],[aria-label],[alt]").forEach(function (el) {
      ["placeholder", "title", "aria-label", "alt"].forEach(function (a) {
        if (el.hasAttribute(a)) el.setAttribute(a, convert(el.getAttribute(a)));
      });
    });
  }

  /* ---------- 快照 ---------- */
  function snapshot() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (el.dataset.zhText == null) el.dataset.zhText = el.textContent;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.dataset.i18nAttr.split("|").forEach(function (pair) {
        var kv = pair.split(":");
        var attr = kv[0];
        if (!attr) return;
        var store = "zhAttr_" + attr;
        if (el.dataset[store] == null) el.dataset[store] = el.getAttribute(attr) || "";
      });
    });
  }

  /* ---------- 语言渲染 ---------- */
  function renderLanguage() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (el.dataset.zhText != null) el.textContent = el.dataset.zhText;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.dataset.i18nAttr.split("|").forEach(function (pair) {
        var kv = pair.split(":");
        var attr = kv[0], store = "zhAttr_" + attr;
        if (el.dataset[store] != null) el.setAttribute(attr, el.dataset[store]);
      });
    });

    if (lang === "en") {
      document.documentElement.lang = "en";
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var k = el.dataset.i18n;
        if (EN[k]) el.textContent = EN[k];
      });
      document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
        el.dataset.i18nAttr.split("|").forEach(function (pair) {
          var kv = pair.split(":");
          var attr = kv[0], key = kv[1];
          if (EN[key]) el.setAttribute(attr, EN[key]);
        });
      });
      if (window.PAGE_TITLE_EN) document.title = window.PAGE_TITLE_EN;
    } else if (lang === "zh-TW" && window.OpenCC) {
      document.documentElement.lang = "zh-Hant";
      var convert = OpenCC.Converter({ from: "cn", to: "tw" });
      toTraditional(document.body, convert);
      document.title = convert(document.title);
    } else {
      document.documentElement.lang = "zh-CN";
    }
    updateLangButtons();
  }

  function updateLangButtons() {
    var bl = document.getElementById("btnLang"), be = document.getElementById("btnEn");
    if (!bl || !be) return;
    if (lang === "zh-TW") { bl.textContent = "简体"; be.textContent = "EN"; }
    else if (lang === "en") { bl.textContent = "繁體"; be.textContent = "中文"; }
    else { bl.textContent = "繁體"; be.textContent = "EN"; }
  }

  function setLang(v) { localStorage.setItem(LK, v); location.reload(); }

  /* ---------- 无障碍 ---------- */
  function applyA11y() {
    document.documentElement.style.zoom = a11y.zoom && a11y.zoom !== 1 ? a11y.zoom : "";
    document.body.classList.toggle("hc", !!a11y.contrast);
    document.body.classList.toggle("underline", !!a11y.underline);
    document.body.classList.toggle("reduce-motion", !!a11y.motion);
    document.querySelectorAll("[data-zoom]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(parseFloat(b.dataset.zoom) === (a11y.zoom || 1)));
    });
    var c = document.getElementById("optContrast"),
        u = document.getElementById("optUnderline"),
        m = document.getElementById("optMotion");
    if (c) c.checked = !!a11y.contrast;
    if (u) u.checked = !!a11y.underline;
    if (m) m.checked = !!a11y.motion;
  }
  function saveA11y() { localStorage.setItem(AK, JSON.stringify(a11y)); }

  function localizeA11yPanel() {
    if (lang === "zh-CN") return;
    var isEn = lang === "en", isTw = lang === "zh-TW";
    var map = {
      a11yTitle: { en: "Accessibility", tw: "無障礙設定" },
      a11yFontSize: { en: "Text size", tw: "字體大小" },
      a11yDisplay: { en: "Display", tw: "顯示" },
      a11yReset: { en: "Reset to default", tw: "恢復預設" }
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = isEn ? map[id].en : (isTw ? map[id].tw : el.textContent);
    });
    var labels = {
      optContrast: ["High contrast", "高對比度"],
      optUnderline: ["Underline links", "連結底線"],
      optMotion: ["Reduce motion", "減弱動畫"]
    };
    Object.keys(labels).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var t = isEn ? labels[id][0] : (isTw ? labels[id][1] : null);
      if (!t) return;
      el.parentNode.childNodes.forEach(function (n) {
        if (n.nodeType === 3 && n.nodeValue.trim()) n.nodeValue = " " + t;
      });
    });
    var z = { "1": ["Standard", "標準"], "1.15": ["Large", "大"], "1.3": ["Extra large", "特大"], "1.5": ["Huge", "超大"] };
    document.querySelectorAll("[data-zoom]").forEach(function (b) {
      var v = z[b.dataset.zoom]; if (!v) return;
      b.textContent = isEn ? v[0] : (isTw ? v[1] : b.textContent);
    });
    var cb = document.getElementById("a11yClose");
    if (cb) cb.setAttribute("aria-label", isEn ? "Close" : "關閉");
  }

  /* ---------- 绑定 ---------- */
  function bind() {
    var btnA11y = document.getElementById("btnA11y");
    var panel = document.getElementById("a11yPanel");
    var closeBtn = document.getElementById("a11yClose");

    if (btnA11y && panel) {
      btnA11y.addEventListener("click", function () {
        var show = panel.hidden;
        panel.hidden = !show;
        btnA11y.setAttribute("aria-expanded", String(show));
        if (show) { var f = panel.querySelector("button, input"); if (f) f.focus(); }
      });
      closeBtn.addEventListener("click", function () {
        panel.hidden = true;
        btnA11y.setAttribute("aria-expanded", "false");
        btnA11y.focus();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !panel.hidden) {
          panel.hidden = true;
          btnA11y.setAttribute("aria-expanded", "false");
          btnA11y.focus();
        }
      });
      panel.querySelectorAll("[data-zoom]").forEach(function (b) {
        b.addEventListener("click", function () {
          a11y.zoom = parseFloat(b.dataset.zoom); saveA11y(); applyA11y();
        });
      });
      var c = document.getElementById("optContrast");
      var u = document.getElementById("optUnderline");
      var m = document.getElementById("optMotion");
      if (c) c.addEventListener("change", function (e) { a11y.contrast = e.target.checked; saveA11y(); applyA11y(); });
      if (u) u.addEventListener("change", function (e) { a11y.underline = e.target.checked; saveA11y(); applyA11y(); });
      if (m) m.addEventListener("change", function (e) { a11y.motion = e.target.checked; saveA11y(); applyA11y(); });
      var r = document.getElementById("a11yReset");
      if (r) r.addEventListener("click", function () { a11y = {}; saveA11y(); applyA11y(); });
    }

    var bl = document.getElementById("btnLang");
    var be = document.getElementById("btnEn");
    if (bl) bl.addEventListener("click", function () { setLang(lang === "zh-TW" ? "zh-CN" : "zh-TW"); });
    if (be) be.addEventListener("click", function () { setLang(lang === "en" ? "zh-CN" : "en"); });
  }

  /* ---------- 启动 ---------- */
  function start() {
    if (!document.getElementById("a11yPanel")) {
      document.body.insertAdjacentHTML("beforeend", PANEL_HTML);
    }
    snapshot();
    renderLanguage();
    applyA11y();
    localizeA11yPanel();
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();