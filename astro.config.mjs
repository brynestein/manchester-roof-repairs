// @ts-check
import { execFileSync } from 'node:child_process';
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
  ],
});
