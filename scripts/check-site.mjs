#!/usr/bin/env node
// Deterministic site checks for static local-service sites (Astro, Next export, plain HTML).
// Zero dependencies. Reads built HTML (--dist) or a live site (--live); the rules are
// the same either way. Exit code 1 if any block-severity finding remains.
//
//   node scripts/check-site.mjs --dist dist
//   NODE_USE_ENV_PROXY=1 node scripts/check-site.mjs --live https://example.co.uk
//   node scripts/check-site.mjs --dist dist --json > findings.json
//
// Optional config: site-checks.config.json (see CONFIG DEFAULTS below).
// Rule ids are the contract with .claude/skills/site-content/SKILL.md - keep them in sync.

import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------- CLI

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d;
};

const MODE_LIVE = opt("live");
const DIST = opt("dist", "dist");
const CONFIG_PATH = opt("config", "site-checks.config.json");
const SITE_FLAG = opt("site");

// ---------------------------------------------------------------- CONFIG DEFAULTS

const DEFAULTS = {
  siteUrl: null, // https://example.co.uk ; derived from --live or the homepage canonical
  // path regex -> page type. First match wins. Types drive which checks apply.
  pageTypes: [
    { type: "home", match: "^/$" },
    { type: "service", match: "^/services/." },
    { type: "location", match: "^/(locations|areas)/." },
    { type: "post", match: "^/(post|posts|blog)/." },
    { type: "entity", match: "^/entity/." },
  ],
  // Types the site-content skill defines but URLs cannot reveal (bare service slugs, hubs, towns)
  // are mapped in the site's config: e.g. { "type": "town", "match": "^/roofers-[a-z-]+/[a-z0-9-]+/$" }.
  contentTypes: ["service", "service-in-place", "hub", "town", "location", "post", "entity"], // stricter checks
  faqTypes: ["service", "service-in-place", "hub", "town", "location", "post"],
  placeTypes: ["location", "hub", "town"], // pages a service page must not link to in content
  minWords: { home: 1000, service: 1500, "service-in-place": 1000, hub: 2000, town: 1000, location: 1000, post: 800, entity: 300, page: 0 },
  titleLen: [30, 60],
  descLen: [120, 160],
  maxAvgParagraphWords: 25,
  maxParagraphWords: 60,
  minLists: 1,
  // In-prose internal links per type. Service pages are link sinks: 0-2, homepage or proof only.
  minProseLinks: { location: 3, hub: 3, town: 3, post: 3, entity: 3 },
  maxProseLinks: { service: 2 },
  inboundSpread: 5, // flag a place type whose best-linked page has more than this multiple of the median
  citySlug: null, // off by default (skill decision D-A: bare service slugs, place in title and H1); set to enforce -in-<citySlug>
  identityTypePattern: "Contractor|Business|Organization|Store|Service$|Roofer|Plumber|Electrician",
  ignorePaths: ["^/404", "^/admin", "^/api/"],
  ignoreLinkPaths: ["^/cdn-cgi/"], // host-injected URLs that are not pages
  aiBots: ["GPTBot", "ClaudeBot", "anthropic-ai", "PerplexityBot", "Google-Extended", "CCBot", "OAI-SearchBot", "ChatGPT-User", "Applebot-Extended"],
  genericNavLabels: ["services", "about", "contact", "home", "gallery", "reviews", "blog", "more", "menu"],
  severity: {}, // { "P-words": "block" } overrides
  disable: [], // ["S-hub-ratio"]
  maxCrawl: 300,
};

let cfg = { ...DEFAULTS };
if (fs.existsSync(CONFIG_PATH)) {
  cfg = { ...DEFAULTS, ...JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")) };
}
if (SITE_FLAG) cfg.siteUrl = SITE_FLAG;

// ---------------------------------------------------------------- findings

const findings = [];
const BASE_SEV = {
  "P-title": "block", "P-title-len": "warn", "P-title-dupe": "warn",
  "P-desc": "block", "P-desc-len": "warn", "P-desc-dupe": "block",
  "P-canonical": "block", "P-canonical-path": "warn", "P-h1": "block", "P-h1-dupe": "warn", "P-h2": "warn", "P-heading-order": "warn",
  "P-main": "block", "P-schema-valid": "block", "P-schema-identity": "block", "P-schema-faq": "warn",
  "P-img-alt": "block", "P-img-missing": "block", "P-img-dims": "warn", "P-link-name": "block",
  "P-link-broken": "block", "P-prose-links": "warn", "P-ext-link": "warn", "P-words": "warn",
  "P-para-length": "warn", "P-lists": "warn", "P-og": "warn", "P-noindex": "block", "P-lang": "warn", "P-viewport": "warn",
  "S-sitemap": "block", "S-sitemap-coverage": "block", "S-sitemap-lastmod": "warn", "S-sitemap-noindex": "block",
  "S-robots": "block", "S-robots-ai": "warn", "S-llms": "warn", "S-404": "block", "S-soft404": "block",
  "S-orphans": "block", "S-hub-ratio": "warn", "S-dir-service-location": "block", "S-dir-service-post": "block",
  "S-slug-format": "warn", "S-slug-geo": "warn", "S-footer-variance": "warn", "S-nap": "warn",
  "S-cta-contact": "warn", "S-trailing-slash": "warn", "S-generic-nav": "warn", "S-pages-min": "warn",
  "S-csp-inline": "block", "S-csp-host": "block",
};
function add(id, page, msg) {
  if (cfg.disable.includes(id)) return;
  findings.push({ id, severity: cfg.severity[id] || BASE_SEV[id] || "warn", page, msg });
}

// ---------------------------------------------------------------- html helpers

const attrs = (s) => {
  const o = {};
  for (const m of s.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) o[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? "";
  return o;
};
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;|&#160;/g, " ");
const textOf = (h) => decode(h.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const words = (t) => (t ? t.split(/\s+/).filter(Boolean).length : 0);
const meta = (html, key) => {
  for (const m of html.matchAll(/<meta\b([^>]*)>/gi)) {
    const a = attrs(m[1]);
    if ((a.name || a.property || "").toLowerCase() === key) return a.content ?? "";
  }
  return null;
};
const region = (html, tag) => (html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")) || [])[1] ?? null;
const typesIn = (o, out = new Set()) => {
  if (Array.isArray(o)) o.forEach((x) => typesIn(x, out));
  else if (o && typeof o === "object") {
    for (const [k, v] of Object.entries(o)) {
      if (k === "@type") [].concat(v).forEach((t) => out.add(String(t)));
      else typesIn(v, out);
    }
  }
  return out;
};

// ---------------------------------------------------------------- sources

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); }
  }));
  return out;
}
const normPath = (p) => {
  let x = p.split("#")[0].split("?")[0];
  if (!x.startsWith("/")) x = "/" + x;
  return x;
};
const pageKey = (p) => { const x = normPath(p); return /\.[a-z0-9]+$/i.test(x) ? x : x.endsWith("/") ? x : x + "/"; };

function distSource(dir) {
  const files = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      e.isDirectory() ? walk(f) : files.push(f);
    }
  })(dir);
  const rel = (f) => "/" + path.relative(dir, f).split(path.sep).join("/");
  const fileSet = new Set(files.map(rel));
  const pathOf = (r) => (r.endsWith("/index.html") ? r.slice(0, -10) : r.replace(/\.html$/, "/"));
  return {
    kind: "dist",
    async pages() {
      return files.filter((f) => f.endsWith(".html")).map((f) => ({ path: pathOf(rel(f)), html: fs.readFileSync(f, "utf8"), status: 200, file: rel(f), base: rel(f).endsWith("/index.html") ? pathOf(rel(f)) : rel(f).replace(/\.html$/, "") }));
    },
    async get(p) {
      const f = path.join(dir, normPath(p));
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return { status: 404, type: "", body: "" };
      return { status: 200, type: f.endsWith(".xml") ? "application/xml" : f.endsWith(".txt") ? "text/plain" : "", body: fs.readFileSync(f, "utf8") };
    },
    async exists(p) {
      const x = normPath(p);
      return fileSet.has(x) || fileSet.has(x.replace(/\/$/, "") + "/index.html") || fileSet.has(x.replace(/\/$/, "") + ".html");
    },
  };
}

function liveSource(origin) {
  const cache = new Map();
  const get = async (p, method = "GET") => {
    const k = method + p;
    if (cache.has(k)) return cache.get(k);
    let r;
    try {
      const res = await fetch(origin + p, { method, redirect: "follow", headers: { "user-agent": "site-checks/1.0" } });
      const type = res.headers.get("content-type") || "";
      r = { status: res.status, type, body: method === "GET" ? await res.text() : "", finalUrl: res.url };
    } catch (e) { r = { status: 0, type: "", body: "", error: String(e.cause?.code || e.message) }; }
    cache.set(k, r);
    return r;
  };
  return {
    kind: "live",
    get,
    async exists(p) { const r = await get(normPath(p), "HEAD"); return r.status >= 200 && r.status < 400; },
    async pages(seedPaths) {
      const seen = new Set(), queue = [...seedPaths], out = [];
      while (queue.length && out.length < cfg.maxCrawl) {
        const batch = [...new Set(queue.splice(0, 6).map(pageKey))].filter((p) => !seen.has(p));
        batch.forEach((p) => seen.add(p));
        const got = await pool(batch, 6, async (p) => ({ p, r: await get(p) }));
        for (const { p, r } of got) {
          if (r.status !== 200 || !/html/i.test(r.type)) continue;
          out.push({ path: p, html: r.body, status: 200, base: (() => { try { return new URL(r.finalUrl).pathname; } catch { return p; } })() });
          for (const m of r.body.matchAll(/<a\b([^>]*)>/gi)) {
            const h = attrs(m[1]).href;
            if (!h || /^(mailto:|tel:|javascript:|#)/i.test(h)) continue;
            try { const u = new URL(h, origin + p); if (u.host.replace(/^www\./, "") === new URL(origin).host.replace(/^www\./, "") && !/\.[a-z0-9]{2,5}$/i.test(u.pathname.replace(/\/$/, ""))) { const k = pageKey(u.pathname); if (!seen.has(k)) queue.push(k); } } catch { /* ignore */ }
          }
        }
      }
      return out;
    },
  };
}

// ---------------------------------------------------------------- sitemap

async function readSitemaps(src) {
  const rootCandidates = ["/sitemap-index.xml", "/sitemap.xml"];
  let robots = await src.get("/robots.txt");
  const fromRobots = [...(robots.body || "").matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => { try { return new URL(m[1]).pathname; } catch { return null; } }).filter(Boolean);
  const queue = [...new Set([...fromRobots, ...rootCandidates])];
  const urls = [], seen = new Set();
  let found = false;
  while (queue.length) {
    const p = queue.shift();
    if (seen.has(p)) continue;
    seen.add(p);
    const r = await src.get(p);
    if (r.status !== 200 || !/<(urlset|sitemapindex)/i.test(r.body || "")) continue;
    found = true;
    if (/<sitemapindex/i.test(r.body)) {
      for (const m of r.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) { try { queue.push(new URL(m[1]).pathname); } catch { /* ignore */ } }
    } else {
      for (const m of r.body.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
        const loc = (m[1].match(/<loc>\s*([^<\s]+)\s*<\/loc>/) || [])[1];
        if (loc) urls.push({ loc, lastmod: (m[1].match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/) || [])[1] || null });
      }
    }
  }
  return { found, urls, robots, fromRobots };
}

// ---------------------------------------------------------------- main

const src = MODE_LIVE ? liveSource(MODE_LIVE.replace(/\/$/, "")) : distSource(DIST);
if (!MODE_LIVE && !fs.existsSync(DIST)) { console.error(`dist folder not found: ${DIST} (build first, or use --live)`); process.exit(2); }

const origin0 = MODE_LIVE ? MODE_LIVE.replace(/\/$/, "") : null;
const sm = await readSitemaps(src);
let pages;
if (MODE_LIVE) {
  const seeds = ["/", ...sm.urls.map((u) => { try { return new URL(u.loc).pathname; } catch { return null; } }).filter(Boolean)];
  pages = await src.pages(seeds);
} else pages = await src.pages();

const ignoreRx = cfg.ignorePaths.map((r) => new RegExp(r));
const is404File = (p) => /^\/404(\/|\.html)?$/.test(p.path) || p.file === "/404.html";
const has404 = pages.some(is404File);
pages = pages.filter((p) => !ignoreRx.some((rx) => rx.test(p.path)));

const home = pages.find((p) => p.path === "/");
let siteUrl = cfg.siteUrl || origin0 || (home && meta(home.html, "og:url")) || (home && (home.html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i) || [""])[0].match(/href=["']([^"']+)/)?.[1]);
if (siteUrl) { try { siteUrl = new URL(siteUrl).origin; } catch { siteUrl = null; } }
const siteHost = siteUrl ? new URL(siteUrl).host.replace(/^www\./, "") : null;

const typeOf = (p) => { for (const t of cfg.pageTypes) if (new RegExp(t.match).test(p)) return t.type; return "page"; };
const isInternal = (u) => siteHost && u.host.replace(/^www\./, "") === siteHost;

// per-page parse
const model = pages.map((pg) => {
  const html = pg.html;
  const type = typeOf(pg.path);
  const main = region(html, "main");
  const header = region(html, "header") || "";
  const footer = region(html, "footer") || "";
  const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((m) => {
    const a = attrs(m[1]);
    const idx = m.index;
    return { href: a.href, label: (a["aria-label"] || textOf(m[2]) || (m[2].match(/<img[^>]*alt=["']([^"']+)/i) || [])[1] || "").trim(), a, inner: m[2], idx };
  });
  const jsonld = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if ((attrs(m[1]).type || "").toLowerCase() !== "application/ld+json") continue;
    try { jsonld.push(JSON.parse(m[2])); } catch (e) { jsonld.push({ __error: e.message }); }
  }
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ level: +m[1], text: textOf(m[2]) }));
  return { ...pg, type, main, header, footer, anchors, jsonld, headings };
});
const byPath = new Map(model.map((p) => [p.path, p]));

// --- link graph
const inbound = new Map(model.map((p) => [p.path, new Set()]));
const slashStyle = { with: 0, without: 0, ex: new Set() };
const brokenQueue = [];
for (const p of model) {
  p.internal = [];
  for (const a of p.anchors) {
    if (!a.href || /^(mailto:|tel:|javascript:|#)/i.test(a.href)) continue;
    let u; try { u = new URL(a.href, (siteUrl || "https://x.invalid") + (p.base ?? p.path)); } catch { continue; }
    if (!isInternal(u) && siteUrl) { (p.external ??= []).push({ ...a, host: u.host }); continue; }
    const rawPath = u.pathname;
    if ((cfg.ignoreLinkPaths || []).some((r) => new RegExp(r).test(rawPath))) continue;
    if (!/\.[a-z0-9]{2,5}$/i.test(rawPath) && rawPath !== "/") (rawPath.endsWith("/") ? slashStyle.with++ : (slashStyle.without++, slashStyle.ex.add(rawPath)));
    const key = pageKey(rawPath);
    p.internal.push({ ...a, key, rawPath });
    if (key !== p.path && inbound.has(key)) inbound.get(key).add(p.path);
    if (!byPath.has(key) && !/\.[a-z0-9]{2,5}$/i.test(key)) brokenQueue.push({ page: p.path, key, label: a.label });
  }
}

// Rules added with the site-content standard (Oct 2026): hidden headings, paragraph ceiling,
// links to redirects, place-type link spread.
Object.assign(BASE_SEV, { "P-para-max": "warn", "P-hidden-text": "block", "P-link-redirect": "warn", "S-inbound-spread": "warn" });
const proseRule = (map, type, fallback) => (typeof map === "number" ? (type === "service" ? fallback : map) : map?.[type]);

// ---------------------------------------------------------------- page checks

const seenTitle = new Map(), seenDesc = new Map(), seenH1 = new Map();
const note = (map, key, p) => { if (!key) return; (map.get(key) ?? map.set(key, []).get(key)).push(p); };

for (const p of model) {
  const html = p.html, P = p.path;
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  const t = title ? decode(title).trim() : "";
  if (!t) add("P-title", P, "missing <title>");
  else { if (t.length < cfg.titleLen[0] || t.length > cfg.titleLen[1]) add("P-title-len", P, `title is ${t.length} chars (aim ${cfg.titleLen.join("-")})`); note(seenTitle, t, P); }
  const desc = meta(html, "description");
  if (!desc || !desc.trim()) add("P-desc", P, "missing meta description");
  else { const d = decode(desc).trim(); if (d.length < cfg.descLen[0] || d.length > cfg.descLen[1]) add("P-desc-len", P, `description is ${d.length} chars (aim ${cfg.descLen.join("-")})`); note(seenDesc, d, P); }
  const canon = (html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i) || [""])[0].match(/href=["']([^"']+)/i)?.[1];
  if (!canon) add("P-canonical", P, "missing canonical link");
  else { try { const c = new URL(canon); if (siteUrl && c.origin !== siteUrl) add("P-canonical", P, `canonical host ${c.origin} differs from site ${siteUrl}`); else if (pageKey(c.pathname) !== P) { p.canonElsewhere = true; add("P-canonical-path", P, `canonical points to ${c.pathname} (this URL is a duplicate of it; avoid linking to it)`); } } catch { add("P-canonical", P, `canonical not absolute: ${canon}`); } }
  const robotsMeta = (meta(html, "robots") || "").toLowerCase();
  if (robotsMeta.includes("noindex")) p.noindex = true;
  if (!/<html\b[^>]*\blang=/i.test(html)) add("P-lang", P, "<html> has no lang attribute");
  if (meta(html, "viewport") === null) add("P-viewport", P, "missing viewport meta");
  for (const k of ["og:title", "og:description", "og:image"]) if (!meta(html, k)) add("P-og", P, `missing ${k}`);

  // headings
  const h1 = p.headings.filter((h) => h.level === 1);
  if (h1.length !== 1) add("P-h1", P, `${h1.length} H1 elements (need exactly 1)`); else note(seenH1, h1[0].text.toLowerCase(), P);
  if (p.headings.filter((h) => h.level === 2).length < 2 && p.type !== "page") add("P-h2", P, "fewer than 2 H2 headings");
  for (let i = 1; i < p.headings.length; i++) if (p.headings[i].level > p.headings[i - 1].level + 1) { add("P-heading-order", P, `H${p.headings[i - 1].level} followed by H${p.headings[i].level} ("${p.headings[i].text.slice(0, 40)}")`); break; }

  // hidden text: a heading kept in the page but clipped or hidden is spam, not SEO. Delete it instead.
  for (const m of html.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi)) {
    const a = attrs(m[2]);
    if (/\b(sr-only|visually-hidden|screen-reader-text|kwhide)\b/i.test(a.class || "") || /display\s*:\s*none|visibility\s*:\s*hidden/i.test(a.style || ""))
      add("P-hidden-text", P, `hidden H${m[1]}: "${textOf(m[3]).slice(0, 50)}"`);
  }
  // in-page anchors must exist (e.g. a "Get a quote" button to #quote)
  for (const a of p.anchors) {
    const id = /^#([^\s#]+)$/.exec(a.href || "")?.[1];
    if (id && !new RegExp(`\\b(id|name)=["']${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i").test(html)) add("P-link-broken", P, `link to #${id} ("${a.label.slice(0, 30)}") but no element has that id`);
  }

  // landmarks and schema
  const mains = (html.match(/<main\b/gi) || []).length;
  if (mains !== 1) add("P-main", P, `${mains} <main> elements (need exactly 1)`);
  const bad = p.jsonld.filter((j) => j.__error);
  if (bad.length) add("P-schema-valid", P, `JSON-LD does not parse: ${bad[0].__error}`);
  const types = typesIn(p.jsonld.filter((j) => !j.__error));
  if (![...types].some((x) => new RegExp(cfg.identityTypePattern).test(x))) add("P-schema-identity", P, "no LocalBusiness/Organization-family JSON-LD");
  if (cfg.faqTypes.includes(p.type) && !types.has("FAQPage")) add("P-schema-faq", P, "no FAQPage JSON-LD");

  // images
  for (const m of html.matchAll(/<img\b([^>]*)>/gi)) {
    const a = attrs(m[1]);
    if (a.alt === undefined) add("P-img-alt", P, `image without alt: ${(a.src || "").slice(0, 60)}`);
    if (!a.width && !a.height && !/aspect-/.test(a.class || "") && !/aspect-ratio/.test(a.style || "")) add("P-img-dims", P, `image without dimensions (CLS risk): ${(a.src || "").slice(0, 60)}`);
  }

  // links
  for (const a of p.anchors) if (a.href && !a.label) add("P-link-name", P, `link with no accessible name: ${a.href.slice(0, 60)}`);
  const mainHtml = p.main || "";
  const mainText = textOf(mainHtml);
  const nW = words(mainText);
  const prose = [...mainHtml.matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)].flatMap((m) => [...m[2].matchAll(/<a\b([^>]*)>/gi)]).filter((m) => { const h = attrs(m[1]).href; if (!h || /^(mailto|tel|#)/i.test(h)) return false; try { return isInternal(new URL(h, (siteUrl || "https://x.invalid") + (p.base ?? P))); } catch { return !/^https?:/i.test(h); } }).length;
  const minProse = proseRule(cfg.minProseLinks, p.type, 0), maxProse = proseRule(cfg.maxProseLinks, p.type, undefined);
  if (minProse && prose < minProse) add("P-prose-links", P, `${prose} in-prose internal links (aim ${minProse}+)`);
  if (maxProse != null && prose > maxProse) add("P-prose-links", P, `${prose} in-prose internal links on a ${p.type} page (aim 0-${maxProse}: service pages collect links, they do not hand them out)`);
  if (cfg.contentTypes.includes(p.type) && !(p.external || []).some((e) => mainHtml.includes(e.href))) add("P-ext-link", P, "no outbound link to an external source in the main content");

  // copy
  const minW = cfg.minWords[p.type] ?? 0;
  if (minW && nW < minW) add("P-words", P, `${nW} words in <main> (aim ${minW}+)`);
  const paras = [...mainHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => words(textOf(m[1]))).filter((n) => n > 0);
  if (paras.length >= 5) { const avg = paras.reduce((a, b) => a + b, 0) / paras.length; if (avg > cfg.maxAvgParagraphWords) add("P-para-length", P, `average paragraph is ${avg.toFixed(0)} words (aim <= ${cfg.maxAvgParagraphWords})`); }
  const longest = Math.max(0, ...paras);
  if (cfg.maxParagraphWords && longest > cfg.maxParagraphWords) add("P-para-max", P, `a paragraph runs ${longest} words (aim <= ${cfg.maxParagraphWords})`);
  const lists = (mainHtml.match(/<(ul|ol)\b/gi) || []).length;
  if (cfg.contentTypes.includes(p.type) && lists < cfg.minLists) add("P-lists", P, `${lists} lists in <main> (aim ${cfg.minLists}+)`);
}
for (const [k, v] of seenTitle) if (v.length > 1) add("P-title-dupe", v.join(", "), `duplicate title "${k.slice(0, 50)}"`);
for (const [k, v] of seenDesc) if (v.length > 1) add("P-desc-dupe", v.join(", "), `duplicate description "${k.slice(0, 50)}"`);
for (const [k, v] of seenH1) if (v.length > 1) add("P-h1-dupe", v.join(", "), `duplicate H1 "${k.slice(0, 50)}"`);

// broken internal pages and missing images (async)
// Links to a redirect source cost a hop and dilute the link; point them at the final URL.
const redirectSources = new Set();
if (!MODE_LIVE) {
  const rd = await src.get("/_redirects");
  if (rd.status === 200) for (const line of (rd.body || "").split(/\r?\n/)) {
    const from = line.trim().split(/\s+/)[0];
    if (from && from.startsWith("/") && !/[*:]/.test(from)) redirectSources.add(pageKey(from));
  }
}
const seenBroken = new Set();
for (const b of brokenQueue) {
  const id = b.page + b.key; if (seenBroken.has(id)) continue; seenBroken.add(id);
  if (redirectSources.has(b.key)) { add("P-link-redirect", b.page, `link to ${b.key} ("${b.label.slice(0, 30)}") is a redirect; link the final URL`); continue; }
  if (MODE_LIVE) { if (await src.exists(b.key)) continue; } else if (await src.exists(b.key)) continue;
  add("P-link-broken", b.page, `link to ${b.key} ("${b.label.slice(0, 30)}") has no page`);
}
const imgChecked = new Map();
await pool(model, 4, async (p) => {
  for (const m of p.html.matchAll(/<img\b([^>]*)>/gi)) {
    const s = attrs(m[1]).src; if (!s || /^data:/i.test(s)) continue;
    let u; try { u = new URL(s, (siteUrl || "https://x.invalid") + (p.base ?? p.path)); } catch { continue; }
    if (siteUrl && !isInternal(u)) continue;
    if (!imgChecked.has(u.pathname)) {
      let ok;
      if (MODE_LIVE) { const r = await src.get(u.pathname, "HEAD"); ok = r.status === 200 && /^image\//i.test(r.type); } else ok = await src.exists(u.pathname);
      imgChecked.set(u.pathname, ok);
    }
    if (!imgChecked.get(u.pathname)) add("P-img-missing", p.path, `image not found: ${u.pathname}`);
  }
});

// ---------------------------------------------------------------- site checks

const indexable = model.filter((p) => !p.noindex && !p.canonElsewhere && !is404File(p));
const idxPaths = new Set(indexable.map((p) => p.path));
if (indexable.length < 20) add("S-pages-min", "(site)", `${indexable.length} indexable pages; competitive local sites run 20+ (service x location matrix)`);

if (!sm.found) add("S-sitemap", "(site)", "no sitemap found (tried robots.txt Sitemap lines, /sitemap-index.xml, /sitemap.xml)");
else {
  const smPaths = new Map(sm.urls.map((u) => { try { return [pageKey(new URL(u.loc).pathname), u]; } catch { return [u.loc, u]; } }));
  for (const p of idxPaths) if (!smPaths.has(p)) add("S-sitemap-coverage", p, "indexable page missing from sitemap");
  for (const [k] of smPaths) if (!idxPaths.has(k) && !model.some((p) => p.path === k)) add("S-sitemap-coverage", k, "sitemap lists a URL that is not a built page");
  for (const [k] of smPaths) if (byPath.get(k)?.noindex) add("S-sitemap-noindex", k, "noindex page is listed in the sitemap");
  if (sm.urls.length && !sm.urls.every((u) => u.lastmod)) add("S-sitemap-lastmod", "(site)", `${sm.urls.filter((u) => !u.lastmod).length}/${sm.urls.length} sitemap URLs have no <lastmod>`);
  const dates = new Set(sm.urls.filter((u) => u.lastmod).map((u) => u.lastmod.slice(0, 10)));
  if (sm.urls.length >= 5 && sm.urls.every((u) => u.lastmod) && dates.size === 1) add("S-sitemap-lastmod", "(site)", `all ${sm.urls.length} sitemap URLs share one <lastmod> (${[...dates][0]}); use each page's real modified date, not the build date`);
}

const rb = sm.robots;
if (!rb || rb.status !== 200 || /<html/i.test(rb.body || "")) add("S-robots", "(site)", "robots.txt missing or not plain text");
else {
  if (!/^\s*sitemap:/im.test(rb.body)) add("S-robots", "(site)", "robots.txt has no Sitemap: line");
  const groups = []; let cur = null;
  for (const line of rb.body.split(/\r?\n/)) {
    const m = line.match(/^\s*(user-agent|disallow|allow)\s*:\s*(.*)$/i); if (!m) continue;
    if (m[1].toLowerCase() === "user-agent") { if (!cur || cur.rules.length) groups.push((cur = { uas: [], rules: [] })); cur.uas.push(m[2].trim().toLowerCase()); }
    else if (cur) cur.rules.push([m[1].toLowerCase(), m[2].trim()]);
  }
  const blocksAll = (g) => g.rules.some(([k, v]) => k === "disallow" && v === "/");
  if (groups.some((g) => g.uas.includes("*") && blocksAll(g))) add("S-robots", "(site)", "robots.txt disallows everything for all user agents");
  for (const bot of cfg.aiBots) if (groups.some((g) => g.uas.includes(bot.toLowerCase()) && blocksAll(g))) add("S-robots-ai", "(site)", `robots.txt blocks ${bot}`);
}
const llms = await src.get("/llms.txt");
if (llms.status !== 200 || /<html|<!doctype/i.test((llms.body || "").slice(0, 200)) || /html/i.test(llms.type)) add("S-llms", "(site)", "no real /llms.txt (missing, or the URL returns an HTML page)");

if (MODE_LIVE) {
  const probe = await src.get(`/zz-check-${Math.random().toString(36).slice(2, 8)}/`);
  if (probe.status === 200) add("S-soft404", "(site)", "a non-existent URL returns 200 (soft 404); add a 404 page and serve it with status 404");
} else if (!has404) add("S-404", "(site)", "no 404 page (404.html) in the build");

// place pages: inbound spread. A fixed slice of towns linked from every page starves the rest.
for (const t of cfg.placeTypes) {
  const ps = indexable.filter((p) => p.type === t);
  if (ps.length < 10) continue;
  const c = ps.map((p) => [p.path, inbound.get(p.path).size]).sort((a, b) => a[1] - b[1]);
  const med = c[Math.floor(c.length / 2)][1], top = c[c.length - 1];
  if (top[1] > cfg.inboundSpread * Math.max(med, 1)) add("S-inbound-spread", "(site)", `${t} pages: ${top[0]} has ${top[1]} linking pages vs a median of ${med} (lowest ${c[0][0]}: ${c[0][1]}); link nearest or in-hub siblings, never a fixed slice`);
}

// orphans and hub ratio
for (const p of indexable) if (p.path !== "/" && inbound.get(p.path).size === 0) add("S-orphans", p.path, "no internal links point to this page");
if (indexable.length >= 10 && home) {
  const counts = indexable.filter((p) => p.path !== "/").map((p) => inbound.get(p.path).size);
  const avg = counts.reduce((a, b) => a + b, 0) / (counts.length || 1);
  const hi = inbound.get("/").size;
  if (avg > 0 && hi / avg < 3) add("S-hub-ratio", "/", `homepage has ${hi} linking pages vs ${avg.toFixed(1)} average (${(hi / avg).toFixed(1)}x; aim >= 3x)`);
}

// directional linking: service pages must not feed locations or blog
for (const p of model.filter((x) => x.type === "service")) {
  const body = (p.main != null ? p.main : p.html);
  const inMain = (a) => p.main == null || body.includes(a.href);
  const loc = p.internal.filter((a) => cfg.placeTypes.includes(typeOf(a.key)) && inMain(a));
  const post = p.internal.filter((a) => typeOf(a.key) === "post" && inMain(a));
  if (loc.length) add("S-dir-service-location", p.path, `links to ${loc.length} location page(s) in content (e.g. ${loc[0].key}); render place names as plain text`);
  if (post.length) add("S-dir-service-post", p.path, `links to ${post.length} blog post(s) in content (e.g. ${post[0].key}); blog should link in to services, not the reverse`);
}

// slugs
for (const p of indexable) {
  if (p.path === "/") continue;
  if (/[A-Z_]|%20|\s/.test(p.path)) add("S-slug-format", p.path, "URL has uppercase letters, underscores or spaces");
  if (cfg.citySlug && p.type === "service") {
    const last = p.path.replace(/\/$/, "").split("/").pop();
    if (!(last.endsWith(`-in-${cfg.citySlug}`) || last.endsWith(`-${cfg.citySlug}`))) add("S-slug-geo", p.path, `service slug lacks the city (-in-${cfg.citySlug})`);
  }
}
if (slashStyle.with && slashStyle.without) add("S-trailing-slash", "(site)", `internal links mix trailing-slash (${slashStyle.with}) and no-slash (${slashStyle.without}) styles, e.g. ${[...slashStyle.ex].slice(0, 3).join(", ")}`);

// header/footer anchor variance, header CTA to /contact, generic nav labels
const homeM = model.find((x) => x.path === "/");
if (homeM) {
  const hdr = homeM.anchors.filter((a) => homeM.header.includes(a.inner) && a.href), ftr = homeM.anchors.filter((a) => homeM.footer.includes(a.inner) && a.href);
  const same = [];
  for (const h of hdr) { const f = ftr.find((x) => x.href === h.href && x.label.toLowerCase() === h.label.toLowerCase() && h.label && !/^(home|contact|contact us)$/i.test(h.label)); if (f) same.push(h.label); }
  if (same.length >= 3) add("S-footer-variance", "/", `${same.length} footer links repeat the nav label exactly (${[...new Set(same)].slice(0, 3).join(", ")}); vary footer anchors`);
  const generic = hdr.filter((a) => cfg.genericNavLabels.includes(a.label.toLowerCase()) && !/^(home|contact|about)$/i.test(a.label));
  if (generic.length) add("S-generic-nav", "/", `generic nav labels: ${[...new Set(generic.map((a) => a.label))].join(", ")}; use the target query phrase`);
  const cta = hdr.find((a) => /(^|\/)(contact|quote)\/?$/i.test(a.href) && /quote|call|book|get|free/i.test(a.label));
  if (cta) add("S-cta-contact", "/", `header CTA "${cta.label}" links to ${cta.href}; use the on-page form (#quote) or a tel: link`);
}

// Security header vs what the pages actually load. A strict header that blocks the site's
// own scripts fails silently in the browser: tracking stops and buttons do nothing.
async function readCsp() {
  if (MODE_LIVE) {
    try { const r = await fetch(MODE_LIVE.replace(/\/$/, "") + "/", { redirect: "follow" }); return r.headers.get("content-security-policy"); } catch { return null; }
  }
  const h = await src.get("/_headers");
  if (h.status !== 200) return null;
  return (h.body.match(/^\s*Content-Security-Policy:\s*(.+)$/im) || [])[1] || null;
}
const cspRaw = await readCsp();
if (cspRaw) {
  const csp = {};
  for (const part of cspRaw.split(";")) { const [k, ...v] = part.trim().split(/\s+/); if (k) csp[k.toLowerCase()] = v; }
  const list = (d) => csp[d] || csp["default-src"] || null;
  const allows = (sources, url) => {
    if (!sources) return true;
    let u; try { u = new URL(url, siteUrl || "https://x.invalid"); } catch { return true; }
    return sources.some((t) => {
      if (t === "*") return true;
      if (t === "'self'") return !siteHost || u.host.replace(/^www\./, "") === siteHost;
      if (/^[a-z]+:$/.test(t)) return u.protocol === t;
      const m = t.match(/^(?:([a-z]+):\/\/)?(\*\.)?([^/:]+)/i);
      if (!m || t.startsWith("'")) return false;
      if (m[1] && m[1] + ":" !== u.protocol) return false;
      return m[2] ? u.host.endsWith("." + m[3]) : u.host === m[3];
    });
  };
  const scriptSrc = list("script-src"), styleSrc = list("style-src"), connectSrc = list("connect-src"), fontSrc = list("font-src");
  const inlineOk = !scriptSrc || scriptSrc.some((t) => t === "'unsafe-inline'" || /^'(nonce|sha256|sha384|sha512)-/.test(t));
  const seen = new Set();
  const flag = (id, page, msg) => { if (!seen.has(id + msg)) { seen.add(id + msg); add(id, page, msg); } };
  for (const p of model) {
    for (const m of p.html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      const a = attrs(m[1]);
      if (a.src) { if (!allows(scriptSrc, a.src)) flag("S-csp-host", p.path, `script from ${new URL(a.src, siteUrl || "https://x.invalid").host} is not allowed by script-src`); continue; }
      if (/json/i.test(a.type || "") || !m[2].trim()) continue;
      if (!inlineOk) flag("S-csp-inline", p.path, "inline script would be blocked by script-src (move it to a file)");
    }
    if (!inlineOk && /<[a-z][^>]*\son[a-z]+\s*=/i.test(p.html)) flag("S-csp-inline", p.path, "inline event handler (onclick, onerror, ...) would be blocked by script-src");
    for (const m of p.html.matchAll(/<link\b([^>]*)>/gi)) {
      const a = attrs(m[1]);
      if ((a.rel || "").toLowerCase() === "stylesheet" && a.href && !allows(styleSrc, a.href)) flag("S-csp-host", p.path, `stylesheet from ${new URL(a.href, siteUrl || "https://x.invalid").host} is not allowed by style-src`);
      if ((a.rel || "").toLowerCase() === "stylesheet" && /fonts\.googleapis\.com/.test(a.href || "") && !allows(fontSrc, "https://fonts.gstatic.com/x.woff2")) flag("S-csp-host", p.path, "Google Fonts files are not allowed by font-src (fonts.gstatic.com)");
    }
    // Tags injected at run time are invisible in the HTML, so check by what the page asks for.
    if (/GTM-[A-Z0-9]+|googletagmanager\.com/.test(p.html)) {
      if (!allows(scriptSrc, "https://www.googletagmanager.com/gtm.js")) flag("S-csp-host", p.path, "GTM/GA4 is used but www.googletagmanager.com is not allowed by script-src");
      if (!allows(connectSrc, "https://region1.google-analytics.com/g/collect")) flag("S-csp-host", p.path, "GA4 is used but *.google-analytics.com is not allowed by connect-src");
    }
    if (/data-clarity=|clarity\.ms/.test(p.html)) {
      if (!allows(scriptSrc, "https://www.clarity.ms/tag/x")) flag("S-csp-host", p.path, "Clarity is used but www.clarity.ms is not allowed by script-src");
      if (!allows(connectSrc, "https://k.clarity.ms/collect")) flag("S-csp-host", p.path, "Clarity is used but *.clarity.ms is not allowed by connect-src");
    }
  }
}

// NAP consistency
const tels = new Set();
for (const p of model) for (const a of p.anchors) if (/^tel:/i.test(a.href || "")) tels.add(a.href.replace(/[^+\d]/g, ""));
if (tels.size > 1) add("S-nap", "(site)", `${tels.size} different tel: numbers across the site (${[...tels].join(", ")})`);

// ---------------------------------------------------------------- report

const order = { block: 0, warn: 1 };
findings.sort((a, b) => order[a.severity] - order[b.severity] || a.id.localeCompare(b.id));
const blocks = findings.filter((f) => f.severity === "block").length;

if (flag("json")) {
  console.log(JSON.stringify({ mode: MODE_LIVE ? "live" : "dist", siteUrl, pages: indexable.length, blocks, warns: findings.length - blocks, findings }, null, 2));
} else {
  console.log(`\nSite checks: ${MODE_LIVE ? "live " + MODE_LIVE : "dist " + DIST} | ${model.length} pages | ${indexable.length} indexable | site ${siteUrl || "unknown"}\n`);
  const grouped = new Map();
  for (const f of findings) { const k = `${f.severity}|${f.id}`; (grouped.get(k) ?? grouped.set(k, []).get(k)).push(f); }
  for (const [k, list] of grouped) {
    const [sev, id] = k.split("|");
    console.log(`${sev === "block" ? "BLOCK" : "warn "}  ${id}  (${list.length})`);
    for (const f of list.slice(0, 4)) console.log(`        ${f.page}  ${f.msg}`);
    if (list.length > 4) console.log(`        ... ${list.length - 4} more (use --json for all)`);
  }
  console.log(`\n${blocks} block, ${findings.length - blocks} warn${blocks ? "  -> FAIL" : "  -> pass"}\n`);
}
// exitCode, not exit(): exit() can truncate large piped --json output
process.exitCode = blocks ? 1 : 0;
