/* EarthSys 115 scrollytelling engine.
 *
 * Reads story/story.json, builds the page, and draws charts from
 * charts/<name>.json (Vega-Lite specs). As each text step reaches the
 * middle of the screen, the sticky chart switches to that step's chart
 * and params. You should not need to edit this file; see README.md.
 */
(function () {
  "use strict";

  var STORY_FILE = "story/story.json";
  var root = document.getElementById("story");
  var specCache = {};
  var liveCharts = []; // {el, chart, params, view} for redraws on theme change

  // ---------- small helpers ----------

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Inline formatting allowed in story text:
  // **bold**, *italic*, ==highlight==, [link text](https://...)
  function inline(s) {
    var h = esc(s);
    h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    h = h.replace(/==([^=]+)==/g, '<mark class="hl">$1</mark>');
    return h;
  }

  // A text field can be one string or a list of paragraphs.
  function paras(x) {
    if (x == null) return "";
    var list = Array.isArray(x) ? x : [x];
    return list.map(function (p) { return "<p>" + inline(p) + "</p>"; }).join("");
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function showError(title, detail) {
    var box = el("div", "error", "<strong>" + esc(title) + "</strong>" + detail);
    root.appendChild(box);
    console.error(title, detail);
  }

  // Turn a JSON parse error into "line X, column Y" so students can find it.
  function jsonError(text, err) {
    var m = /position (\d+)/.exec(err.message);
    var where = "";
    if (m) {
      var pos = +m[1];
      var before = text.slice(0, pos).split("\n");
      where = " near line " + before.length + ", column " + (before[before.length - 1].length + 1);
    }
    return where + ". The browser says: <code>" + esc(err.message) + "</code>. " +
      "Common causes: a missing comma between items, a comma after the last item, or a straight quote inside text (use ’ or \\\" instead).";
  }

  function loadJSON(path) {
    return fetch(path, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("Could not load " + path + " (" + r.status + "). Check the file name and folder.");
      return r.text();
    }).then(function (text) {
      try { return JSON.parse(text); }
      catch (err) {
        var e = new Error("There is a mistake in " + path);
        e.detail = jsonError(text, err);
        throw e;
      }
    });
  }

  // ---------- design tokens -> chart theme ----------

  function token(name) {
    return getComputedStyle(document.documentElement).getPropertyValue("--" + name).trim();
  }

  // Replace any string "token:accent" in a chart spec with the CSS value of --accent.
  function resolveTokens(x) {
    if (typeof x === "string") return x.indexOf("token:") === 0 ? (token(x.slice(6)) || x) : x;
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
    if (!specCache[name]) specCache[name] = loadJSON("charts/" + name + ".json");
    return specCache[name];
  }

  function paramDefaults(spec) {
    var d = {};
    (spec.params || []).forEach(function (p) { if ("value" in p && !p.select) d[p.name] = p.value; });
    return d;
  }

  function draw(box, name, params) {
    return getSpec(name).then(function (raw) {
      var spec = resolveTokens(JSON.parse(JSON.stringify(raw)));
      var known = paramDefaults(spec);
      Object.keys(params || {}).forEach(function (k) {
        if (!(k in known)) throw new Error('A step sets "' + k + '", but charts/' + name + '.json has no param with that name.');
      });
      (spec.params || []).forEach(function (p) {
        if (params && p.name in params) p.value = params[p.name];
      });
      if (spec.width == null) spec.width = "container";
      var narrow = box.clientWidth < 520;
      if (typeof spec.height === "number" && narrow) spec.height = Math.round(Math.min(spec.height * 0.72, window.innerHeight * 0.3));
      if (spec.height == null) spec.height = narrow ? 240 : 340;
      return vegaEmbed(box, spec, { actions: false, renderer: "svg", config: chartTheme() })
        .then(function (res) { return res.view; });
    });
  }

  // Move an existing chart to new params without redrawing it.
  function update(view, name, params) {
    return getSpec(name).then(function (raw) {
      var all = Object.assign({}, paramDefaults(raw), params || {});
      Object.keys(all).forEach(function (k) {
        try { view.signal(k, all[k]); }
        catch (e) { throw new Error('A step sets "' + k + '", but charts/' + name + '.json has no param with that name.'); }
      });
      return view.runAsync();
    });
  }

  function chartError(where, err) {
    showError("A chart could not be drawn (" + where + ")", "<p>" + esc(err.message) + "</p>");
  }

  // ---------- data table under a chart ----------

  function addTable(parent, dataPath) {
    fetch(dataPath).then(function (r) { return r.text(); }).then(function (text) {
      var rows = text.trim().split(/\r?\n/).map(function (l) { return l.split(","); });
      var head = rows.shift();
      var html = "<table><thead><tr>" + head.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") +
        "</tr></thead><tbody>" + rows.map(function (r) {
          return "<tr>" + r.map(function (c, j) {
            var n = Number(c);
            return "<td>" + esc(isFinite(n) && c !== "" && !/year/i.test(head[j]) ? n.toLocaleString("en-US") : c) + "</td>";
          }).join("") + "</tr>";
        }).join("") + "</tbody></table>";
      var d = el("details", "data-table", "<summary>Show the data</summary><div class=\"table-scroll\">" + html + "</div>");
      parent.appendChild(d);
    });
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
    if (meta.title) document.title = meta.title.replace(/[*=]/g, "");
  }

  function buildText(b) {
    var s = el("section", "prose");
    s.innerHTML = (b.heading ? "<h2>" + inline(b.heading) + "</h2>" : "") + paras(b.body);
    root.appendChild(s);
  }

  function chartHead(t, sub) {
    return (t ? '<p class="chart-title">' + inline(t) + "</p>" : "") +
           (sub ? '<p class="chart-subtitle">' + inline(sub) + "</p>" : "");
  }

  function buildFigure(b, i) {
    var f = el("figure", "figure");
    f.innerHTML = chartHead(b.title, b.subtitle);
    var box = el("div", "chart-box");
    f.appendChild(box);
    if (b.note) f.appendChild(el("p", "chart-note", inline(b.note)));
    if (b.caption) f.appendChild(el("figcaption", "caption", inline(b.caption)));
    root.appendChild(f);
    if (b.table) addTable(f, b.table);
    var rec = { box: box, chart: b.chart, params: b.params || {} };
    liveCharts.push(rec);
    draw(box, b.chart, rec.params).then(function (v) { rec.view = v; })
      .catch(function (e) { chartError("block " + (i + 1) + ", chart \"" + b.chart + "\"", e); });
  }

  function buildScrolly(b, i) {
    var sec = el("section", "scrolly");
    var graphic = el("div", "graphic");
    var head = el("div", "chart-head");
    var box = el("div", "chart-box");
    var note = el("p", "chart-note");
    graphic.appendChild(head); graphic.appendChild(box); graphic.appendChild(note);
    var steps = el("div", "steps");
    (b.steps || []).forEach(function (st, k) {
      var s = el("div", "step", paras(st.text));
      s.dataset.index = k;
      steps.appendChild(s);
    });
    sec.appendChild(graphic); sec.appendChild(steps);
    root.appendChild(sec);

    var rec = { box: box, chart: null, params: {}, view: null };
    liveCharts.push(rec);
    var busy = Promise.resolve();

    function stepState(k) {
      var st = b.steps[k] || {};
      return {
        chart: st.chart || b.chart,
        params: st.params || {},
        title: st.title || b.title,
        subtitle: st.subtitle || b.subtitle,
        note: st.note || b.note || ""
      };
    }

    function go(k) {
      var s = stepState(k);
      head.innerHTML = chartHead(s.title, s.subtitle);
      note.innerHTML = inline(s.note);
      busy = busy.then(function () {
        var same = rec.view && rec.chart === s.chart;
        rec.chart = s.chart; rec.params = s.params;
        if (same) return update(rec.view, s.chart, s.params);
        if (rec.view) { rec.view.finalize(); rec.view = null; }
        return draw(box, s.chart, s.params).then(function (v) { rec.view = v; });
      }).catch(function (e) { chartError("scrolly block " + (i + 1) + ", step " + (k + 1), e); });
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
    (b.sections || []).forEach(function (sec) {
      html += "<h2>" + inline(sec.heading || "") + "</h2>";
      if (sec.items) html += "<ul>" + sec.items.map(function (it) { return "<li>" + inline(it) + "</li>"; }).join("") + "</ul>";
      if (sec.body) html += paras(sec.body);
    });
    s.innerHTML = html;
    root.appendChild(s);
  }

  // ---------- redraw on light/dark change ----------

  function redrawAll() {
    liveCharts.forEach(function (rec) {
      if (!rec.chart) return;
      if (rec.view) rec.view.finalize();
      draw(rec.box, rec.chart, rec.params).then(function (v) { rec.view = v; }).catch(function () {});
    });
  }
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) mq.addEventListener("change", redrawAll);
  }
  new MutationObserver(redrawAll).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // ---------- go ----------

  loadJSON(STORY_FILE).then(function (story) {
    root.innerHTML = "";
    buildHero(story.meta || {});
    (story.blocks || []).forEach(function (b, i) {
      if (b.type === "text") buildText(b);
      else if (b.type === "scrolly") buildScrolly(b, i);
      else if (b.type === "chart") buildFigure(b, i);
      else if (b.type === "sources") buildSources(b);
      else showError("Unknown block type \"" + b.type + "\" in block " + (i + 1), "<p>Use text, scrolly, chart or sources.</p>");
    });
  }).catch(function (e) {
    root.innerHTML = "";
    showError(e.message, "<p>" + (e.detail || "") + "</p>");
  });
})();
