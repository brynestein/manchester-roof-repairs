# Build, publishing, tracking and media

Rules learned the hard way on munstergutters.ie and dublingutter.ie (code read 25 October 2026). Each one records a failure that happened.

## Facts live in one place

- One facts file per site (`business.json`, `FACTS`), and every page, template, variant pool, footer, schema block and `llms.txt` reads from it. Templates and wording variants contain **no claim literals**: no years, ratings, review counts, hours, job counts or guarantee lengths. Dublin Gutter fixed "trusted since 1994" on 97 pages in September 2026, and "three decades" survived in a variant pool on 28 pages.
- `llms.txt` and `llms-full.txt` are public. They carry public facts only, never internal notes (Munster's carried average job value and sales strategy).
- Hand corrections to synced data (video locations, titles) survive the next sync.

## Build

- **One build command** writes the pages, the sitemap and llms.txt together, so none can lag the others.
- **Deterministic output**: no data change means no diff. Wording variants are chosen by a seed from the slug, so a page reads the same on every rebuild.
- **Check before commit**: build, run the checker (and the similarity gate on town pages), then commit. Never commit generated content to the main branch before it has built and passed.
- **Sitemap `lastmod`** is ISO-8601 and the page's real modified date. Google rejected every WordPress-format date on Munster; Dublin Gutter stamps the build date on all 102 URLs, which is a false freshness signal.
- **`dateModified`** in schema moves when the page content changes, and only then.

## Publishing articles

- Never publish an article dated in the future (25 Munster articles went live in August dated up to 6 October).
- Record the URL an article was published at; never re-derive it from the title.
- A machine-written article never overwrites a hand-written one with the same slug.
- Generated articles pass the same gates as hand-written ones: word floor, headings, links resolve, facts match the facts file, no placeholders or stray markup (Dublin Gutter's pipeline posts shipped "---" inside FAQ answers and links to five pages that do not exist).
- Topics stay inside the brand's trade and area: no roofing articles on a gutters site that points roofing work to a sister brand.

## Redirects and migration

- Capture every old URL before cutover: the redirect plugin's export plus Search Console's indexed, 404 and "crawled, not indexed" lists. Redirect each to its true successor.
- Keep slugs that are already indexed, even when the new structure would nest them (Dublin Gutter kept 13 flat slugs).
- Merge a duplicate page's unique sections into the survivor before redirecting it.
- Update internal links to the final URL; a link to a redirect is a defect.
- Cloudflare Pages: 2,000 static and 100 dynamic redirect rules (measured August 2026); exact-match rules need both the slash and no-slash form.

## Tracking and Google Business Profile

- **Consent first.** Analytics, pixels and session recording load only after consent (see each repo's consent setup). The site plan names who owns consent. Munster loads GA4 and the Meta pixel for everyone and its cookie policy does not mention Meta.
- **Every third-party origin** (analytics, pixels, review widgets, video, forms) is added to the security header in the same change and checked in a real browser. Munster's reviews widget and YouTube videos were both broken by its header for days without anyone noticing.
- **The Business Profile website link carries no tracking parameters.** A tagged homepage URL was indexed as a separate result (870 impressions in 8 days) and pushed the real page down 3-9 positions. Use a `noindex` bridge page that records the source and redirects to the clean URL; do not block it in robots.txt, or Google cannot see the noindex.
- **Phone numbers follow the page's place** in the header, hero and CTA. Showing the main number on outlying county pages credits their calls to the wrong line.
- **A tap is not a call.** Record `tel:` taps as taps, by page.
- AI referrers (ChatGPT, Perplexity, Claude) are tracked as their own source.

## Images

- Width and height on every image, from the file or an aspect ratio, so nothing shifts on load.
- Alt text describes what the image shows. Never a keyword ("Gutter Repair Limerick" on 160 Munster images); never a place the photo was not taken in. Decorative images beside a text title take empty alt.
- The article and social image is a real job photo, not the logo.
- Town pages do not reuse one fixed pair of photos across every town; a photo named for one town does not appear on another county's pages.

## Video and widgets

- Click-to-play tiles, not embedded players: youtube-nocookie, the sharp still for Shorts, nothing loads until pressed. Munster's mobile score went from 68 to 97 largely from this.
- VideoObject schema on one page only.
- Third-party widgets (reviews, maps) load when scrolled into view, with their height reserved.

## Calculators and estimates

- No invented money: every rate comes from the client's records; a missing rate blocks publication of the calculator.
- Place matching is by exact code (e.g. Eircode routing key), never a prefix.
- The figure shown to the visitor and the figure the business acts on are computed by the same code.
- Show what is included and excluded; the "typical" figure is the midpoint of the published range; VAT treatment is stated and matches every other page.
- Internal notes and source workings are never shipped in the page.
