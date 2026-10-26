"""Build the article topic candidates from real searches (see references/topic-research.md, step 1).

    python3 topic_candidates.py config.json candidates.xlsx [--gsc Queries.csv ...] [--planner export.csv ...]
        [--suggest suggestions.json] [--seeds seeds.csv] [--volumes export.csv ...]

--gsc      Search Console query exports (Performance > Queries, any date range or comparison), own or sister sites
--planner  Keyword Planner exports: "Discover new keywords" or "Get search volume and forecasts"; their searches are candidates
--suggest  Google autocomplete suggestions from topic_autocomplete.py
--seeds    a trade-knowledge list (one search per line, or a topics file with "groups"): candidates only once measured
--volumes  Keyword Planner exports used only to look up volumes, not as a source of candidates

config.json:
  "trade": regex a topic must match (e.g. "gutter|guttering|fascia|soffit|downpipe|barge ?board|roofline")
  "exclude": regex for searches that are not article topics (low-priority services, shops, "near me", jobs)
  "strip_places": place words to remove from sister-site searches before matching (another country's towns)
  "money_heads": the money pages' bare searches; a cluster that is only one of these is the money page's, not an article's

Writes the clusters (Planner's close variants share one volume and one monthly pattern, so they collapse to one
row), a group per cluster, and a CSV of searches with no volume yet, for one more Planner upload.
"""
import csv, io, json, re, sys
from collections import defaultdict
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

INFO = re.compile(r"\b(how|what|why|when|who|which|can|do|does|is|are|should|cost|costs|price|prices|pricing|much|vs|versus|step|guide|diy|"
                  r"types?|scams?|rogue|cowboy|average|lifespan|last|regulations?|responsib\w*|difference|problem|signs?|fix|fixing|leak|leaks|"
                  r"leaking|overflow\w*|blocked|sagging|rotten|rot|per metre|per meter|calculator|size|sizes|fall|gradient|best|worth|"
                  r"join\w*|seal\w*|paint\w*|insurance|grant|planning|neighbour|landlord)\b")
# "gutter repair", "fitting guttering" and the like are the money pages' searches; only a question, cost, problem or
# comparison word makes a search an article topic
# typed AI prompts and chat questions that reach Search Console look like this, not like searches
PROMPT = re.compile(r"^(can you|could you|i need|i want|i'm looking|im looking|please|help me|who can help|are you able)\b")
GROUPS = [('Trust and hiring', r'scam|rogue|cowboy|trust|complain|choose|hire|hiring|questions to ask|cancel'),
          ('Rules, responsibility, lifespan', r'responsib|neighbour|landlord|insurance|regulation|planning|grant|how long|lifespan|last\b|when to'),
          ('Comparison', r'\bvs\b|versus|\bor\b|difference|best|worth|which'),
          ('Cost', r'cost|price|prices|pricing|how much|average|calculator|quote|per metre|per meter'),
          ('How-to', r'^how to|how do|diy|step|fit\b|fitting|install|join|seal|cut|paint|fall|gradient|bracket'),
          ('Problem and signs', r'leak|overflow|blocked|sagging|rot|damp|drip|stain|coming away|signs|problem|why')]

NUM = lambda x: float((x or '0').replace(',', '').replace('%', '') or 0)


def read_planner(path):
    raw = open(path, 'rb').read()
    txt = raw.decode('utf-16') if raw[:2] in (b'\xff\xfe', b'\xfe\xff') else raw.decode('utf-8-sig')
    lines = txt.splitlines()
    head = next(i for i, l in enumerate(lines) if l.startswith('Keyword\t'))
    out = {}
    for r in csv.DictReader(io.StringIO('\n'.join(lines[head:])), delimiter='\t'):
        k = (r.get('Keyword') or '').strip().lower()
        if k:
            out[k] = (int(NUM(r.get('Avg. monthly searches'))), tuple(r[c] for c in r if c and c.startswith('Searches: ')))
    return out


def read_gsc(path):
    rows = list(csv.reader(open(path, encoding='utf-8-sig')))
    h = rows[0]
    ci = [i for i, x in enumerate(h) if 'Clicks' in x]
    ii = [i for i, x in enumerate(h) if 'Impressions' in x]
    return {r[0].strip().lower(): (sum(NUM(r[i]) for i in ci), sum(NUM(r[i]) for i in ii)) for r in rows[1:] if r and r[0]}


def main(cfg, out, gsc_paths, planner_paths, suggest_paths=(), seed_paths=(), volume_paths=()):
    trade, excl = re.compile(cfg['trade']), re.compile(cfg['exclude'])
    strip = re.compile(r'\b(' + '|'.join(map(re.escape, cfg.get('strip_places', []))) + r')\b') if cfg.get('strip_places') else None
    money = {m.lower() for m in cfg.get('money_heads', [])}
    vol, planner_kw = {}, set()
    for p in volume_paths: vol.update(read_planner(p))
    for p in planner_paths:
        v = read_planner(p); vol.update(v); planner_kw |= set(v)
    suggest = set()
    for p in suggest_paths: suggest |= {re.sub(r'\s+', ' ', re.sub(r'[?!.,;:"]', ' ', k.lower())).strip() for k in json.load(open(p))}
    seeds = set()
    for p in seed_paths:
        if p.endswith('.json'): seeds |= {k.lower() for g in json.load(open(p))['groups'].values() for k in g}
        else: seeds |= {l.strip().lower() for l in open(p) if l.strip() and l.strip().lower() != 'keyword'}
    gsc = defaultdict(lambda: [0, 0, set()])
    dropped_prompts = 0
    for p in gsc_paths:
        for q, (c, i) in read_gsc(p).items():
            if PROMPT.search(q) or (q.endswith('?') and len(q.split()) >= 8):
                dropped_prompts += 1
                continue
            k = re.sub(r'[?!.,;:"]', ' ', strip.sub(' ', q) if strip else q)
            k = re.sub(r'\s+', ' ', k).strip()
            k = re.sub(r'\s+(in|near|for|at)$', '', k)  # left behind when a place is stripped
            if k: g = gsc[k]; g[0] += c; g[1] += i; g[2].add(q)
    keep = lambda k: trade.search(k) and not excl.search(k) and INFO.search(k)
    cand = {k for k in planner_kw | set(gsc) | suggest if keep(k)} | {k for k in seeds if trade.search(k) and not excl.search(k)}
    # Planner gives every close variant the same volume and monthly pattern: those collapse into one cluster
    clusters, by_sig = [], {}
    words = lambda k: set(re.findall(r'[a-z]+', k)) - {'a', 'the', 'to', 'of', 'for', 'and', 'my', 'how', 'much', 'is', 'do', 'does', 'in', 'on'}
    for k in sorted(cand, key=lambda k: -vol.get(k, (0,))[0]):
        v, months = vol.get(k, (0, ()))
        sig = (v, months) if v >= 10 and months else None
        home = next((c for c in by_sig.get(sig, []) if words(k) & words(c['head'])), None) if sig else None
        if home: home['variants'].append(k); continue
        c = dict(head=k, vol=v, measured=k in vol, variants=[])
        clusters.append(c)
        if sig: by_sig.setdefault(sig, []).append(c)
    for c in clusters:
        ks = [c['head']] + c['variants']
        c['gsc_clicks'] = sum(gsc[k][0] for k in ks if k in gsc)
        c['gsc_impr'] = sum(gsc[k][1] for k in ks if k in gsc)
        c['group'] = next((g for g, rx in GROUPS if any(re.search(rx, k) for k in ks)), 'Other')
        c['money_page_search'] = c['head'] in money
        c['sources'] = [s for s, pool in (('Planner', planner_kw), ('Search Console', gsc), ('Autocomplete', suggest), ('Seed list', seeds)) if any(k in pool for k in ks)]
    wb = Workbook(); ws = wb.active; ws.title = 'Candidates'
    ws.append(['Group', 'Search (cluster head)', 'Searches / month', 'Close variants (same volume and pattern)', 'Sister-site clicks', 'Sister-site impressions', 'Source', 'Note'])
    for c in sorted(clusters, key=lambda c: (c['group'], -c['vol'], -c['gsc_impr'])):
        src = ' + '.join(c['sources'])
        note = "The money page's own search: not an article" if c['money_page_search'] else ('' if c['measured'] else 'No volume yet: in the upload file')
        ws.append([c['group'], c['head'], c['vol'] if c['measured'] else '', '; '.join(c['variants'][:12]), c['gsc_clicks'] or '', c['gsc_impr'] or '', src, note])
    for i, w in enumerate([24, 42, 12, 70, 10, 12, 22, 40], 1): ws.column_dimensions[get_column_letter(i)].width = w
    for x in ws[1]: x.font = Font(bold=True, color='FFFFFF'); x.fill = PatternFill('solid', fgColor='1A1A1A'); x.alignment = Alignment(wrap_text=True, vertical='top')
    ws.freeze_panes = 'C2'; ws.auto_filter.ref = ws.dimensions
    wb.save(out)
    # Keyword Planner rejects a search over 10 words or 80 characters
    unmeasured = sorted(c['head'] for c in clusters if not c['measured'] and len(c['head'].split()) <= 10 and len(c['head']) <= 80)
    open(out.rsplit('.', 1)[0] + '-needs-volume.csv', 'w').write('Keyword\n' + '\n'.join(unmeasured) + '\n')
    print(f'{len(cand)} candidate searches -> {len(clusters)} clusters; {len(unmeasured)} need a volume; {dropped_prompts} prompt-like Search Console queries dropped')
    return clusters


if __name__ == '__main__':
    args = sys.argv[1:]
    cfg, out = json.load(open(args[0])), args[1]
    lists = {'--gsc': [], '--planner': [], '--suggest': [], '--seeds': [], '--volumes': []}
    cur = None
    for a in args[2:]:
        if a in lists: cur = lists[a]
        else: cur.append(a)
    main(cfg, out, lists['--gsc'], lists['--planner'], lists['--suggest'], lists['--seeds'], lists['--volumes'])
