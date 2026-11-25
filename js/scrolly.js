/* EarthSys 115 scrollytelling engine.
 *
 * Reads story.md, builds the page, and draws charts from
 * 4-analysis/charts/<name>.json (Vega-Lite specs). As each text step
 * reaches the middle of the screen, the sticky chart switches to that
 * step's chart and settings. You should not need to edit this file;
 * see README.md.
 *
 * Every path here is relative, so the story works from any folder
 * (for example https://example.org/teaching/2027/my-story/).
 */
(function () {
  "use strict";

  var STORY_FILE = "story.md";
  var CHART_DIR = "4-analysis/charts/";
  var root = document.getElementById("story");
  var specCache = {};
  var liveCharts = []; // {box, chart, params, view, after} for redraws

  // ---------- small helpers ----------

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Inline formatting allowed in story text:
  //   **bold**  *italic*  `code`  [link text](https://...)
  //   ==words==        words in the accent color
  //   ==pos:words==    words in the color of the token named "pos"
  function inline(s) {
    var h = esc(s);
    h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
    h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    h = h.replace(/==([a-z][a-z0-9-]*):([^=]+)==/g, '<mark class="hl" style="color:var(--$1-text, var(--$1))">$2</mark>');
    h = h.replace(/==([^=]+)==/g, '<mark class="hl">$1</mark>');
    return h;
  }

  function paras(list) {
    return (list || []).map(function (p) { return "<p>" + inline(p) + "</p>"; }).join("");
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function showError(title, detail) {
    var box = el("div", "error", "<strong>" + esc(title) + "</strong>" + (detail || ""));
    root.appendChild(box);
    console.error(title, detail);
  }

  function StoryError(line, msg) {
    var e = new Error("story.md, line " + line + ": " + msg);
    e.isStory = true;
    return e;
  }

  function loadText(path) {
    return fetch(path, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("Could not load " + path + " (error " + r.status + "). Check the file name and folder.");
      return r.text();
    });
  }

  function loadJSON(path) {
    return loadText(path).then(function (text) {
      try { return JSON.parse(text); }
      catch (err) {
        throw new Error("There is a mistake in " + path + ". The browser says: " + err.message +
          ". Common causes: a missing comma between items, or a comma after the last item in a list.");
      }
    });
  }

  // ---------- reading story.md ----------

  function value(v) {
    v = v.trim();
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    if (v === "true" || v === "yes") return true;
    if (v === "false" || v === "no") return false;
    return v;
  }

  // Lines such as "chart: fire-map" at the top of a block, up to the first blank line.
  var SETTING = /^([a-z][a-z0-9_]*):\s*(.*)$/;

  // "pos = Benefits exceed costs | neg = Costs exceed benefits"
  function parseLegend(s) {
    if (!s) return null;
    return String(s).split("|").map(function (part) {
      var i = part.indexOf("=");
      return i < 0 ? null : { token: part.slice(0, i).trim(), label: part.slice(i + 1).trim() };
    }).filter(Boolean);
  }

  var RESERVED = { chart: 1, title: 1, subtitle: 1, note: 1, legend: 1, table: 1 };

  function splitSettings(settings) {
    var out = { params: {} };
    Object.keys(settings).forEach(function (k) {
      if (RESERVED[k]) out[k] = k === "legend" ? parseLegend(settings[k]) : String(settings[k]);
      else out.params[k] = settings[k];
    });
    return out;
  }

  // Turn a run of lines into paragraphs (blank line = new paragraph).
  function toParas(lines) {
    var out = [], cur = [];
    lines.forEach(function (l) {
      if (l.trim() === "") { if (cur.length) out.push(cur.join(" ")); cur = []; }
      else cur.push(l.trim());
    });
    if (cur.length) out.push(cur.join(" "));
    return out;
  }

  // Read settings lines, then return the remaining lines as text.
  function readBody(lines) {
    var settings = {}, i = 0;
    while (i < lines.length && lines[i].trim() === "") i++;
    while (i < lines.length) {
      var m = SETTING.exec(lines[i].trim());
      if (!m) break;
      settings[m[1]] = value(m[2]);
      i++;
    }
    return { settings: settings, text: lines.slice(i) };
  }

  function parseStory(src) {
    var lines = src.replace(/\r\n?/g, "\n").split("\n");
    var meta = {}, blocks = [], i = 0, n = lines.length;

    // Strip <!-- comments -->, keeping line numbers intact.
    var inComment = false;
    lines = lines.map(function (l) {
      if (inComment) { if (l.indexOf("-->") >= 0) inComment = false; return ""; }
      if (/^\s*<!--/.test(l)) { if (l.indexOf("-->") < 0) inComment = true; return ""; }
      return l;
    });

    // Front matter: title, dek, byline... between two lines of ---
    while (i < n && lines[i].trim() === "") i++;
    if (i < n && lines[i].trim() === "---") {
      var start = i + 1; i++;
      while (i < n && lines[i].trim() !== "---") {
        var m = SETTING.exec(lines[i].trim());
        if (m) meta[m[1]] = m[2].trim();
        else if (lines[i].trim() !== "") throw StoryError(i + 1, "in the top section, each line should look like \"title: Your headline\".");
        i++;
      }
      if (i >= n) throw StoryError(start, "the top section starts with --- but never ends. Add a line with only --- after the byline and date.");
      i++;
    }

    var textBuf = [], textHead = null;
    function flushText() {
      var p = toParas(textBuf);
      if (p.length || textHead) blocks.push({ type: "text", heading: textHead, body: p });
      textBuf = []; textHead = null;
    }

    while (i < n) {
      var line = lines[i], t = line.trim();
      var open = /^:::\s*([a-z]+)\s*$/.exec(t);
      if (open) {
        flushText();
        var kind = open[1], startLine = i + 1, inner = [], innerStart = i + 2;
        i++;
        while (i < n && lines[i].trim() !== ":::") {
          if (/^:::\s*[a-z]+\s*$/.test(lines[i].trim()))
            throw StoryError(startLine, "the \":::" + kind + "\" block is not closed. Put a line with only ::: at the end of it (before line " + (i + 1) + ").");
          inner.push(lines[i]); i++;
        }
        if (i >= n) throw StoryError(startLine, "the \":::" + kind + "\" block is not closed. Put a line with only ::: at the end of it.");
        i++; // skip closing :::
        if (kind === "scrolly") blocks.push(parseScrolly(inner, innerStart, startLine));
        else if (kind === "chart") blocks.push(parseChart(inner, startLine));
        else if (kind === "sources") blocks.push(parseSources(inner));
        else throw StoryError(startLine, "\":::" + kind + "\" is not a block type. Use :::scrolly, :::chart or :::sources.");
        continue;
      }
      if (t === ":::") throw StoryError(i + 1, "this ::: closes a block, but no block is open. Delete it, or add the opening line (for example :::scrolly).");
      if (/^::step\b/.test(t)) throw StoryError(i + 1, "\"::step\" only works inside a :::scrolly block.");
      var h = /^##\s+(.*)$/.exec(t);
      if (h) { flushText(); textHead = h[1]; i++; continue; }
      textBuf.push(line); i++;
    }
    flushText();
    return { meta: meta, blocks: blocks };
  }

  function parseScrolly(inner, firstLine, startLine) {
    var chunks = [[]], chunkLines = [firstLine];
    inner.forEach(function (l, k) {
      if (/^::step\s*$/.test(l.trim())) { chunks.push([]); chunkLines.push(firstLine + k); }
      else chunks[chunks.length - 1].push(l);
    });
    var head = splitSettings(readBody(chunks[0]).settings);
    if (!head.chart) throw StoryError(startLine, "this :::scrolly block needs a line like \"chart: name-of-chart\" right under it.");
    if (chunks.length < 2) throw StoryError(startLine, "this :::scrolly block has no steps. Start each step with a line that says ::step");
    var steps = chunks.slice(1).map(function (c, k) {
      var b = readBody(c), s = splitSettings(b.settings);
      s.text = toParas(b.text);
      if (!s.text.length) throw StoryError(chunkLines[k + 1], "this step has no text. Leave a blank line after its settings, then write the text.");
      return s;
    });
    head.type = "scrolly"; head.steps = steps;
    return head;
  }

  function parseChart(inner, startLine) {
    var b = readBody(inner), s = splitSettings(b.settings);
    if (!s.chart) throw StoryError(startLine, "this :::chart block needs a line like \"chart: name-of-chart\" right under it.");
    s.type = "chart"; s.caption = toParas(b.text);
    return s;
  }

  function parseSources(inner) {
    var sections = [], cur = null, buf = [];
    function flush() { if (cur && buf.length) { toParas(buf).forEach(function (p) { cur.parts.push({ p: p }); }); } buf = []; }
    inner.forEach(function (l) {
      var t = l.trim(), h = /^#{2,4}\s+(.*)$/.exec(t), li = /^[-*]\s+(.*)$/.exec(t);
      if (h) { flush(); cur = { heading: h[1], parts: [] }; sections.push(cur); return; }
      if (!cur) { cur = { heading: "", parts: [] }; sections.push(cur); }
      if (li) { flush(); cur.parts.push({ li: li[1] }); return; }
      buf.push(l);
    });
    flush();
    return { type: "sources", sections: sections };
  }

  // ---------- design tokens -> chart theme ----------

  function token(name) {
    return getComputedStyle(document.documentElement).getPropertyValue("--" + name).trim();
  }

  // Replace "token:accent" anywhere in a chart spec with the CSS value of --accent.
  function resolveTokens(x) {
    if (typeof x === "string") {
      return x.replace(/token:([a-z][a-z0-9-]*)/g, function (m, name) { return token(name) || m; });
    }
    if (Array.isArray(x)) return x.map(resolveTokens);
    if (x && typeof x === "object") {
      var out = {};
      for (var k in x) out[k] = resolveTokens(x[k]);
      return out;
    }
    return x;
  }

  function chartTheme() {
    var font = token("font-data") || "sans-serif";
    return {
      background: null,
      font: font,
      view: { stroke: null },
      padding: { left: 2, right: 8, top: 8, bottom: 2 },
      axis: {
        domainColor: token("rule"), tickColor: token("rule"), gridColor: token("grid"),
        labelColor: token("muted"), titleColor: token("ink-2"),
        labelFont: font, titleFont: font, labelFontSize: 12, titleFontSize: 12,
        titleFontWeight: 400, labelPadding: 4, tickSize: 4
      },
      axisX: { grid: false },
      axisY: { domain: false, ticks: false, gridDash: [2, 2] },
      legend: { labelColor: token("ink-2"), titleColor: token("ink-2"), labelFont: font, titleFont: font, labelFontSize: 12 },
      text: { font: font, fontSize: 12, color: token("ink"), stroke: token("surface"), strokeWidth: 4, strokeJoin: "round" },
      line: { strokeWidth: 2 },
      bar: { cornerRadiusEnd: 2 }
    };
  }

  // ---------- drawing charts ----------

  function getSpec(name) {
    if (!specCache[name]) specCache[name] = loadJSON(CHART_DIR + name + ".json");
    return specCache[name];
  }

  function paramDefaults(spec) {
    var d = {};
    (spec.params || []).forEach(function (p) { if ("value" in p && !p.select) d[p.name] = p.value; });
    return d;
  }

  function unknownParam(k, name, known) {
    var list = Object.keys(known);
    return new Error('A step sets "' + k + '", but ' + CHART_DIR + name + '.json has no setting with that name. ' +
      (list.length ? "It understands: " + list.join(", ") + "." : "That chart has no settings."));
  }

  function draw(box, name, params) {
    return getSpec(name).then(function (raw) {
      var meta = raw.usermeta || {};
      var spec = resolveTokens(JSON.parse(JSON.stringify(raw)));
      var known = paramDefaults(spec);
      Object.keys(params || {}).forEach(function (k) { if (!(k in known)) throw unknownParam(k, name, known); });
      (spec.params || []).forEach(function (p) { if (params && p.name in params) p.value = params[p.name]; });

      var narrow = window.innerWidth <= 760;
      var avail = box.clientWidth;
      box.style.maxWidth = "";
      if (meta.aspect) {
        // Fixed shape (maps): height = width x aspect, shrunk to fit the screen.
        var maxH = window.innerHeight * (narrow ? 0.4 : 0.7);
        var w = avail, h = w * meta.aspect;
        if (h > maxH) { h = maxH; w = h / meta.aspect; }
        spec.width = Math.floor(w); spec.height = Math.floor(h);
        spec.autosize = { type: "none" };
        spec.padding = 0;
        box.style.maxWidth = Math.floor(w) + "px";
      } else {
        if (spec.width == null) spec.width = "container";
        if (typeof spec.height === "number" && narrow)
          spec.height = Math.round(Math.min(spec.height * 0.72, window.innerHeight * 0.3));
        if (spec.height == null) spec.height = narrow ? 240 : 340;
      }
      var cfg = chartTheme();
      if (meta.aspect) cfg.padding = 0;
      return vegaEmbed(box, spec, { actions: false, renderer: meta.renderer || "svg", config: cfg })
        .then(function (res) { return res.view; });
    });
  }

  // Move an existing chart to new settings without redrawing it.
  function update(view, name, params) {
    return getSpec(name).then(function (raw) {
      var known = paramDefaults(raw);
      Object.keys(params || {}).forEach(function (k) { if (!(k in known)) throw unknownParam(k, name, known); });
      var all = Object.assign({}, known, params || {});
      Object.keys(all).forEach(function (k) { view.signal(k, all[k]); });
      return view.runAsync();
    });
  }

  // Chart problems are shown where the chart would have been.
  function chartError(where, err, box) {
    var html = "<strong>A chart could not be drawn (" + esc(where) + ")</strong><p>" + esc(err.message) + "</p>";
    console.error(where, err);
    if (box) box.innerHTML = '<div class="error">' + html + "</div>";
    else root.appendChild(el("div", "error", html));
  }

  // ---------- data table under a chart ----------

  function addTable(parent, dataPath) {
    loadText(dataPath).then(function (text) {
      var rows = text.trim().split(/\r?\n/).map(function (l) { return l.split(","); });
      var head = rows.shift();
      var html = "<table><thead><tr>" + head.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") +
        "</tr></thead><tbody>" + rows.map(function (r) {
          return "<tr>" + r.map(function (c, j) {
            var num = c !== "" && isFinite(Number(c)) && !/year/i.test(head[j]);
            return "<td" + (num ? "" : ' class="txt"') + ">" + esc(num ? Number(c).toLocaleString("en-US") : c) + "</td>";
          }).join("") + "</tr>";
        }).join("") + "</tbody></table>";
      parent.appendChild(el("details", "data-table",
        "<summary>Show the data</summary><div class=\"table-scroll\">" + html + "</div>"));
    }).catch(function (e) { chartError("table " + dataPath, e); });
  }

  // ---------- building blocks ----------

  function buildHero(meta) {
    var h = el("header", "hero");
    h.innerHTML =
      (meta.kicker ? '<p class="kicker">' + inline(meta.kicker) + "</p>" : "") +
      "<h1>" + inline(meta.title || "Untitled story") + "</h1>" +
      (meta.dek ? '<p class="dek">' + inline(meta.dek) + "</p>" : "") +
      (meta.byline ? '<p class="byline">' + inline(meta.byline) + (meta.date ? " · " + esc(meta.date) : "") + "</p>" : "");
    root.appendChild(h);
    if (meta.title) document.title = meta.title.replace(/[*=`]/g, "");
  }

  function buildText(b) {
    var s = el("section", "prose");
    s.innerHTML = (b.heading ? "<h2>" + inline(b.heading) + "</h2>" : "") + paras(b.body);
    root.appendChild(s);
  }

  function chartHead(t, sub, legend) {
    var lg = "";
    if (legend && legend.length) {
      lg = '<ul class="legend">' + legend.map(function (it) {
        return '<li><span class="swatch" style="background:var(--' + esc(it.token) + ')"></span>' + inline(it.label) + "</li>";
      }).join("") + "</ul>";
    }
    return (t ? '<p class="chart-title">' + inline(t) + "</p>" : "") +
           (sub ? '<p class="chart-subtitle">' + inline(sub) + "</p>" : "") + lg;
  }

  function buildFigure(b, i) {
    var f = el("figure", "figure");
    f.innerHTML = chartHead(b.title, b.subtitle, b.legend);
    var box = el("div", "chart-box");
    f.appendChild(box);
    if (b.note) f.appendChild(el("p", "chart-note", inline(b.note)));
    if (b.caption && b.caption.length) f.appendChild(el("figcaption", "caption", paras(b.caption)));
    root.appendChild(f);
    if (b.table) addTable(f, b.table);
    var rec = { box: box, chart: b.chart, params: b.params || {} };
    liveCharts.push(rec);
    draw(box, b.chart, rec.params).then(function (v) { rec.view = v; })
      .catch(function (e) { chartError("chart \"" + b.chart + "\"", e, box); });
  }

  function buildScrolly(b, i) {
    var sec = el("section", "scrolly");
    var graphic = el("div", "graphic");
    var head = el("div", "chart-head");
    var box = el("div", "chart-box");
    var note = el("p", "chart-note");
    graphic.appendChild(head); graphic.appendChild(box); graphic.appendChild(note);
    var steps = el("div", "steps");
    b.steps.forEach(function (st, k) {
      var s = el("div", "step", paras(st.text));
      s.dataset.index = k;
      steps.appendChild(s);
    });
    sec.appendChild(graphic); sec.appendChild(steps);
    root.appendChild(sec);

    // Keep the sticky chart centered on tall screens and fully visible on short ones.
    function place() {
      if (window.innerWidth <= 760) { graphic.style.top = ""; return; }
      graphic.style.top = Math.max(12, Math.round((window.innerHeight - graphic.offsetHeight) / 2)) + "px";
    }

    var rec = { box: box, chart: null, params: {}, view: null, after: place };
    liveCharts.push(rec);
    var busy = Promise.resolve();

    function stepState(k) {
      var st = b.steps[k] || {};
      return {
        chart: st.chart || b.chart,
        params: st.params || {},
        title: st.title || b.title,
        subtitle: st.subtitle || b.subtitle,
        note: st.note || b.note || "",
        legend: st.legend || b.legend
      };
    }

    function go(k) {
      var s = stepState(k);
      head.innerHTML = chartHead(s.title, s.subtitle, s.legend);
      note.innerHTML = inline(s.note);
      busy = busy.then(function () {
        var same = rec.view && rec.chart === s.chart;
        rec.chart = s.chart; rec.params = s.params;
        if (same) return update(rec.view, s.chart, s.params);
        if (rec.view) { rec.view.finalize(); rec.view = null; }
        return draw(box, s.chart, s.params).then(function (v) { rec.view = v; });
      }).then(place).catch(function (e) {
        if (rec.view) { rec.view.finalize(); rec.view = null; }
        rec.chart = null;
        chartError("step " + (k + 1) + " of the section that uses \"" + b.chart + "\"", e, box);
      });
    }

    var stepEls = steps.querySelectorAll(".step");
    var current = -1;
    function activate(k) {
      if (k === current) return;
      current = k;
      stepEls.forEach(function (s, j) { s.classList.toggle("is-active", j === k); });
      go(k);
    }
    activate(0); // draw the first state right away so the page is complete at rest

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) activate(+en.target.dataset.index); });
    }, {
      // A step takes over when it crosses the middle of the screen
      // (lower on phones, where the chart fills the top half).
      rootMargin: window.matchMedia("(max-width: 760px)").matches ? "-68% 0px -30% 0px" : "-48% 0px -48% 0px"
    });
    stepEls.forEach(function (s) { io.observe(s); });
  }

  function buildSources(b) {
    var s = el("footer", "sources");
    var html = "";
    b.sections.forEach(function (sec) {
      if (sec.heading) html += "<h2>" + inline(sec.heading) + "</h2>";
      var open = false;
      sec.parts.forEach(function (part) {
        if (part.li != null) { if (!open) { html += "<ul>"; open = true; } html += "<li>" + inline(part.li) + "</li>"; }
        else { if (open) { html += "</ul>"; open = false; } html += "<p>" + inline(part.p) + "</p>"; }
      });
      if (open) html += "</ul>";
    });
    s.innerHTML = html;
    root.appendChild(s);
  }

  // ---------- redraw on light/dark change and on resize ----------

  function redrawAll() {
    liveCharts.forEach(function (rec) {
      if (!rec.chart) return;
      if (rec.view) rec.view.finalize();
      draw(rec.box, rec.chart, rec.params).then(function (v) { rec.view = v; if (rec.after) rec.after(); }).catch(function () {});
    });
  }
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) mq.addEventListener("change", redrawAll);
  }
  new MutationObserver(redrawAll).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  var lastW = window.innerWidth, timer = null;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastW) return; // ignore phone address-bar show/hide
    lastW = window.innerWidth;
    clearTimeout(timer); timer = setTimeout(redrawAll, 200);
  });

  // ---------- go ----------

  loadText(STORY_FILE).then(function (src) {
    var story = parseStory(src);
    root.innerHTML = "";
    buildHero(story.meta);
    story.blocks.forEach(function (b, i) {
      if (b.type === "text") buildText(b);
      else if (b.type === "scrolly") buildScrolly(b, i);
      else if (b.type === "chart") buildFigure(b, i);
      else if (b.type === "sources") buildSources(b);
    });
  }).catch(function (e) {
    root.innerHTML = "";
    showError(e.isStory ? "There is a mistake in your story" : "The story could not be loaded", "<p>" + esc(e.message) + "</p>");
  });
})();
