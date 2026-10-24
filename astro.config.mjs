// @ts-check
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// lastmod = date of the last commit touching the page's source file. In a shallow clone
// every file would report the newest commit's date, so lastmod is omitted rather than
// published inaccurately (search engines ignore lastmod once it proves unreliable).
const sourceFor = (pathname) =>
  pathname === '/' ? 'src/pages/index.astro' : `src/pages${pathname.replace(/\/$/, '')}.astro`;

const lastCommitDate = (file) => {
  try {
    const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], { encoding: 'utf8' }).trim();
    if (shallow !== 'false') return undefined;
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], { encoding: 'utf8' }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
};

// @astrojs/sitemap always writes sitemap-index.xml + sitemap-0.xml. For a single-file
// sitemap the index adds nothing, so publish it at the conventional /sitemap.xml instead.
// Skipped if the sitemap was split (50k+ URLs), where the index is required.
const flatSitemap = {
  name: 'flat-sitemap',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const out = fileURLToPath(dir);
      const single = path.join(out, 'sitemap-0.xml');
      if (!fs.existsSync(single) || fs.existsSync(path.join(out, 'sitemap-1.xml'))) return;
      fs.renameSync(single, path.join(out, 'sitemap.xml'));
      fs.rmSync(path.join(out, 'sitemap-index.xml'), { force: true });
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://manchestergutters.co.uk',
  integrations: [
    sitemap({
      serialize(item) {
        const lastmod = lastCommitDate(sourceFor(new URL(item.url).pathname));
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
    flatSitemap, // must come after sitemap(): it rewrites that integration's output
  ],
});
