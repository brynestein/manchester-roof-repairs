"""Rank hubs and towns from Keyword Planner exports (see references/location-research.md).

    python3 location_rank.py places.json ranking.xlsx export1.csv [export2.csv ...]

Exports: Keyword Planner > Get search volume and forecasts > Download (CSV). Several runs are merged; a later
run wins for a keyword it covers. The script stops if an export was run for the wrong country.
"""
import csv, io, json, re, sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

# Thresholds, monthly searches. Trade = the client's priority searches; proxy = a cross-trade check used only
# when no town reaches the trade bar (searches below hub level are often all under Planner's floor).
HUB_MIN = 50
TRADE = {'launch': 20, 'wave': 10}
PROXY = {'launch': 50, 'wave': 20}


def read_export(path, country):
    raw = open(path, 'rb').read()
    txt = raw.decode('utf-16') if raw[:2] in (b'\xff\xfe', b'\xfe\xff') else raw.decode('utf-8-sig')
    lines = txt.splitlines()
    head = next(i for i, l in enumerate(lines) if l.startswith('Keyword\t'))
    segs = [l.split('\t')[2] for l in lines[head + 1:head + 4] if l.startswith('\t\t')]
    if segs and country not in segs:
        sys.exit(f'{path}: run for {segs[-1]}, not {country}. Re-run it with the location set to {country} only.')
    vol = {}
    for r in csv.DictReader(io.StringIO('\n'.join(lines[head:])), delimiter='\t'):
        k = (r.get('Keyword') or '').strip()
        if k:
            a = r.get('Avg. monthly searches') or ''
            vol[k] = int(float(a)) if a else 0  # blank = under Planner's floor or merged with a close variant
    return vol


def rank(cfg, vol):
    excl = cfg.get('exclude_keywords', {})
    amb = set(cfg.get('ambiguous', []))
    pop = cfg.get('population', {})
    v = lambda t, p: 0 if f'{t} {p}'.lower() in excl else vol.get(f'{t} {p}'.lower().replace('-', ' '), 0)
    rows = []
    for hub, towns in cfg['hubs'].items():
        for p in [hub] + towns:
            r = dict(hub=hub, place=p, is_hub=p == hub, terms={t: v(t, p) for t in cfg['terms']},
                     proxy={t: v(t, p) for t in cfg.get('proxy_terms', [])}, pop=pop.get(p), ambiguous=p in amb)
            r['trade'], r['proxy_total'] = sum(r['terms'].values()), sum(r['proxy'].values())
            rows.append(r)
    towns = [r for r in rows if not r['is_hub']]
    basis = 'trade' if any(r['trade'] >= TRADE['launch'] for r in towns) else 'proxy'
    bar, key = (TRADE, 'trade') if basis == 'trade' else (PROXY, 'proxy_total')
    for r in towns:
        r['stage'] = 'Launch' if r[key] >= bar['launch'] else 'Wave 2' if r[key] >= bar['wave'] else 'Hold'
    for r in rows:
        if r['is_hub']:
            kids = [t for t in towns if t['hub'] == r['hub'] and t['stage'] != 'Hold']
            r['stage'] = 'Launch' if r['trade'] >= HUB_MIN else 'Launch (parent of its towns)' if kids else 'Hold'
    order = sorted({r['hub'] for r in rows}, key=lambda h: next((-r['trade'], -r['proxy_total']) for r in rows if r['is_hub'] and r['hub'] == h))
    out = []
    for h in order:
        hub = next(r for r in rows if r['is_hub'] and r['hub'] == h)
        kids = sorted([r for r in towns if r['hub'] == h], key=lambda r: (-r['trade'], -r['proxy_total'], -(r['pop'] or 0)))
        out += [hub] + kids
    return out, basis


def write(cfg, rows, basis, path):
    slug = lambda s: re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
    tp = cfg.get('trade_phrase', 'guttering')
    wb = Workbook(); ws = wb.active; ws.title = 'Ranking'
    ws.append(['Hub', 'Rank in hub', 'Place', 'Type', 'Proposed URL', 'Stage', 'Trade searches / month', 'Proxy searches / month']
              + [f'"{t}"' for t in cfg['terms']] + [f'"{t}"' for t in cfg.get('proxy_terms', [])] + ['Population', 'Name used elsewhere'])
    fill = {'Launch': 'E2F5E6', 'Wave 2': 'FFF4D6'}
    rank_in = {}
    for r in rows:
        n = '' if r['is_hub'] else rank_in.setdefault(r['hub'], [0])
        if n != '': n[0] += 1
        url = f'/{tp}-{slug(r["hub"])}/' + ('' if r['is_hub'] else f'{slug(r["place"])}/')
        ws.append([r['hub'], '' if r['is_hub'] else n[0], r['place'], 'Area hub' if r['is_hub'] else 'Town', url, r['stage'], r['trade'], r['proxy_total']]
                  + list(r['terms'].values()) + list(r['proxy'].values()) + [r['pop'], 'Yes' if r['ambiguous'] else ''])
        c = fill.get(r['stage'].split(' (')[0])
        if c:
            for x in ws[ws.max_row][:8]: x.fill = PatternFill('solid', fgColor=c)
        if r['is_hub']:
            for x in ws[ws.max_row]: x.font = Font(bold=True)
    for i in range(1, ws.max_column + 1): ws.column_dimensions[get_column_letter(i)].width = 12
    for col, w in zip('ACEF', (14, 22, 44, 26)): ws.column_dimensions[col].width = w
    for c in ws[1]: c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor='1A1A1A'); c.alignment = Alignment(wrap_text=True, vertical='top')
    ws.freeze_panes = 'D2'; ws.auto_filter.ref = ws.dimensions
    m = wb.create_sheet('Method')
    lines = [f'Keyword Planner, {cfg["country"]}, average monthly searches. Trade searches: {", ".join(cfg["terms"])}. Proxy: {", ".join(cfg.get("proxy_terms", [])) or "none"}.',
             f'Towns staged on {"trade" if basis == "trade" else "proxy"} searches: Launch {(TRADE if basis == "trade" else PROXY)["launch"]}+, Wave 2 {(TRADE if basis == "trade" else PROXY)["wave"]}+, otherwise Hold.',
             f'Hubs: Launch at {HUB_MIN}+ trade searches; a hub below that launches only as the parent of towns that launch or wait in Wave 2.',
             'Blank in Planner counts as 0. Planner rounds small figures (10 is roughly 5-15). Names used elsewhere in the country are flagged; their figures may not be local.',
             'Hold towns are built when the client has jobs there or Search Console shows impressions for them. Every town page still needs a place brief.']
    if basis == 'proxy':
        lines.insert(1, 'No town reached the trade bar, so towns are ranked on the proxy searches: the best available sign that people search a trade by that town\'s name.')
    for k, why in cfg.get('exclude_keywords', {}).items(): lines.append(f'Excluded: "{k}" ({why}).')
    for l in lines: m.append([l])
    m.column_dimensions['A'].width = 150
    wb.save(path)


if __name__ == '__main__':
    cfg = json.load(open(sys.argv[1]))
    vol = {}
    for p in sys.argv[3:]: vol.update(read_export(p, cfg['country']))
    rows, basis = rank(cfg, vol)
    write(cfg, rows, basis, sys.argv[2])
    from collections import Counter
    print('basis:', basis, dict(Counter((('hub' if r['is_hub'] else 'town'), r['stage']) for r in rows)))
