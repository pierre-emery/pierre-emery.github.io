/* Shared helpers for the map (index.html) and the river (itinerary.html). */
(function () {
  "use strict";
  const U = {};

  /* seeded PRNG */
  U.mulberry32 = function (a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };
  U.gauss = function (rand) { let u = 0; while (u === 0) u = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand()); };

  /* 2D gradient (Perlin) noise with a seeded permutation */
  U.makeNoise = function (rand) {
    const perm = [...Array(256).keys()];
    for (let i = 255; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
    const p = new Uint8Array(512); for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
    const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
    const grad = (h, x, y) => { switch (h & 7) { case 0: return x + y; case 1: return -x + y; case 2: return x - y; case 3: return -x - y; case 4: return x; case 5: return -x; case 6: return y; default: return -y; } };
    return (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, X = xi & 255, Y = yi & 255;
      const u = fade(xf), v = fade(yf);
      const n00 = grad(p[p[X] + Y], xf, yf), n10 = grad(p[p[X + 1] + Y], xf - 1, yf);
      const n01 = grad(p[p[X] + Y + 1], xf, yf - 1), n11 = grad(p[p[X + 1] + Y + 1], xf - 1, yf - 1);
      const a = n00 + (n10 - n00) * u, b = n01 + (n11 - n01) * u;
      return a + (b - a) * v;
    };
  };
  U.fbm = function (noise, x, y, o) { let a = 0.5, f = 1, s = 0; for (let i = 0; i < o; i++) { s += a * noise(x * f, y * f); a *= 0.5; f *= 2.03; } return s; };

  U.esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  U.hexRgb = function (c) { c = c.replace("#", ""); if (c.length === 3) c = c.split("").map(x => x + x).join(""); const n = parseInt(c, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  U.css = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim();

  /* Marching squares: adds the contour segments of level L to the current path.
     F = { h: Float32Array, nx, ny, cell } — grid point (i,j) sits at (i*cell, j*cell). */
  U.traceLevel = function (ctx, F, L) {
    const { h, nx, ny, cell } = F;
    for (let j = 0; j < ny - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        const a = h[j * nx + i], b = h[j * nx + i + 1], c = h[(j + 1) * nx + i + 1], d = h[(j + 1) * nx + i];
        const cs = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
        if (cs === 0 || cs === 15) continue;
        const tx = (i + (L - a) / (b - a)) * cell, ty = j * cell;
        const rx = (i + 1) * cell, ry = (j + (L - b) / (c - b)) * cell;
        const bx = (i + (L - d) / (c - d)) * cell, by = (j + 1) * cell;
        const lx = i * cell, ly = (j + (L - a) / (d - a)) * cell;
        switch (cs) {
          case 1: case 14: ctx.moveTo(lx, ly); ctx.lineTo(bx, by); break;
          case 2: case 13: ctx.moveTo(bx, by); ctx.lineTo(rx, ry); break;
          case 3: case 12: ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); break;
          case 4: case 11: ctx.moveTo(tx, ty); ctx.lineTo(rx, ry); break;
          case 6: case 9: ctx.moveTo(tx, ty); ctx.lineTo(bx, by); break;
          case 7: case 8: ctx.moveTo(lx, ly); ctx.lineTo(tx, ty); break;
          case 5: ctx.moveTo(tx, ty); ctx.lineTo(rx, ry); ctx.moveTo(lx, ly); ctx.lineTo(bx, by); break;
          case 10: ctx.moveTo(lx, ly); ctx.lineTo(tx, ty); ctx.moveTo(bx, by); ctx.lineTo(rx, ry); break;
        }
      }
    }
  };

  /* dates: "YYYY-MM" */
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  U.MONTHS = MONTHS;
  U.fmtYM = s => { const [y, m] = s.split("-").map(Number); return m ? `${MONTHS[m - 1]} ${y}` : `${y}`; };
  U.range = e => `${U.fmtYM(e.start)} – ${e.end ? U.fmtYM(e.end) + (e.expected ? " (expected)" : "") : "present"}`;
  U.shortRange = e => { const a = e.start.slice(0, 4), b = e.end ? e.end.slice(0, 4) : "now"; return a === b ? a : `${a}–${b}`; };

  /* ---------- light / dark theme ----------
     data-theme on <html> overrides the system setting; the choice is remembered across pages. */
  U.isDark = () => {
    const t = document.documentElement.dataset.theme;
    return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  };
  U.setTheme = t => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch (e) {}
    document.querySelectorAll(".theme").forEach(b => b.setAttribute("aria-checked", String(t === "dark")));
    dispatchEvent(new Event("themechange"));
  };
  // fires on the toggle AND when the system setting changes while no choice is stored
  U.onTheme = fn => {
    addEventListener("themechange", fn);
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (!document.documentElement.dataset.theme) fn(); });
  };

  /* ---------- shared top bar: theme switch on the left, pages + profile icons on the right ---------- */
  U.bar = function (el, current) {
    const S = window.SITE, find = re => (S.links.find(l => re.test(l.label)) || {}).href;
    const gh = find(/github/i), li = find(/linkedin/i);
    const cur = p => p === current ? ' aria-current="page"' : "";
    el.innerHTML = `
      <button class="theme" role="switch" aria-checked="${U.isDark()}" aria-label="Dark mode">
        <span class="sun" aria-hidden="true">☀</span><span class="knob" aria-hidden="true"></span><span class="moon" aria-hidden="true">☾</span>
      </button>
      <nav class="pages" aria-label="Pages">
        <a href="index.html"${cur("about")}>About</a><a href="itinerary.html"${cur("itinerary")}>Itinerary</a>
        ${gh ? `<a class="ico" href="${U.esc(gh)}" target="_blank" rel="noopener" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>` : ""}
        ${li ? `<a class="ico" href="${U.esc(li)}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>` : ""}
      </nav>`;
    el.querySelector(".theme").addEventListener("click", () => U.setTheme(U.isDark() ? "light" : "dark"));
    if (!document.getElementById("bar-css")) {
      const s = document.createElement("style"); s.id = "bar-css";
      s.textContent = `
        .theme{position:relative;display:inline-flex;align-items:center;justify-content:space-between;width:56px;height:28px;padding:0 7px;
          border:1px solid var(--line);border-radius:14px;background:var(--panel);cursor:pointer;color:var(--muted);font-size:13px;line-height:1}
        .theme .knob{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:var(--ink);transition:transform .25s cubic-bezier(.2,.7,.2,1)}
        .theme[aria-checked="true"] .knob{transform:translateX(28px)}
        .theme:hover,.theme:focus-visible{border-color:var(--ink);outline:none}
        .pages{display:flex;align-items:center;gap:20px;font-family:var(--font);font-size:14.5px}
        .pages a{color:var(--muted);text-decoration:none;padding-bottom:2px;border-bottom:1.5px solid transparent}
        .pages a:hover{color:var(--ink)}
        .pages a[aria-current]{color:var(--ink);border-bottom-color:var(--trail)}
        .pages a.ico{font-size:17px;padding:0;border:0;line-height:1}
        .pages a.ico:first-of-type{margin-left:4px}
        @media (max-width:640px){ .pages{gap:13px;font-size:12px} .pages a.ico{font-size:16px} }`;
      document.head.appendChild(s);
    }
  };

  window.U = U;
})();