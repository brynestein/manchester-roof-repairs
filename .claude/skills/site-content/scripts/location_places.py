"""Draft the places file for location research from official ward data (see references/location-research.md, step 1).

    python3 location_places.py authorities.json places.json

authorities.json: {"country": "United Kingdom", "trade_phrase": "guttering",
                   "authorities": {"Manchester": "E08000003", "Salford": "E08000006", ...}}

UK only (England and Wales), two official-data sources, no keys needed:
- every 2022 ward in each local authority, with its Census 2021 population, from the ONS Nomis API (dataset TS001).
  Ward names are split into the places people type ("Pendlebury & Clifton" becomes Pendlebury and Clifton;
  "Didsbury East" and "East Middleton" become Didsbury and Middleton);
- every settlement Wikidata records inside the authority (matched on its ONS code, property P836). Wards alone miss
  big towns split into wards with other names: Sale, Prestwich, Middleton, Hyde and Ashton-under-Lyne.
The result is a draft for review: check the "review" list, add spellings people type, then run location_keywords.py.
Ireland: build the list by hand from the CSO's settlements and electoral divisions.
"""
import csv, io, json, re, sys, time, urllib.parse, urllib.request

URL = ('https://www.nomisweb.co.uk/api/v01/dataset/NM_2021_1.data.csv?date=latest&geography={code}TYPE153'
       '&c2021_restype_3=0&measures=20100&select=geography_name,obs_value')
DIRECTION = r'\s+(north|south|east|west|central|north east|north west|south east|south west|upper|lower)$'
LEADING = r'^(north|south|east|west|central|upper|lower)\s+'
SPARQL = """SELECT DISTINCT ?placeLabel ?pop WHERE {{
  ?lad wdt:P836 "{code}" .
  ?place wdt:P131 ?lad ; wdt:P31/wdt:P279* wd:Q486972 .
  OPTIONAL {{ ?place wdt:P1082 ?pop }}
  SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
}}"""
NOT_A_PLACE = r'camp|prison|hospital|airport|station|estate|industrial|retail|park$|^Q\d+$'


def settlements(code):
    url = 'https://query.wikidata.org/sparql?' + urllib.parse.urlencode({'query': SPARQL.format(code=code), 'format': 'json'})
    req = urllib.request.Request(url, headers={'User-Agent': 'site-content-location-research/1.0'})
    for i in range(4):
        try:
            rows = json.load(urllib.request.urlopen(req, timeout=90))['results']['bindings']
            out = {}
            for b in rows:
                n = b['placeLabel']['value']
                if not re.search(NOT_A_PLACE, n, re.I):
                    out[n] = max(out.get(n) or 0, int(float(b['pop']['value']))) if 'pop' in b else out.get(n)
            return out
        except Exception:
            time.sleep(2 ** (i + 1))
    print(f'Wikidata did not answer for {code}; wards only')
    return {}


def wards(code):
    for i in range(4):
        try:
            txt = urllib.request.urlopen(URL.format(code=code), timeout=60).read().decode('utf-8-sig')
            return [(r['GEOGRAPHY_NAME'], int(r['OBS_VALUE'])) for r in csv.DictReader(io.StringIO(txt))]
        except Exception:
            time.sleep(2 ** (i + 1))
    raise SystemExit(f'Nomis did not answer for {code}')


def places_from(ward):
    name = re.sub(r'\s*\([^)]*\)', '', ward)            # "Farnworth (Bolton)" -> "Farnworth"
    parts = re.split(r'\s+(?:&|and|with)\s+|,\s*', name)  # "Pendlebury & Clifton" -> both
    out = []
    for p in parts:
        p = re.sub(LEADING, '', re.sub(DIRECTION, '', p, flags=re.I), flags=re.I).strip()
        if p and not re.fullmatch(r'(st\.? \w+\'?s?|village|central|park|priory)', p, re.I):
            out.append(p)
    return out


if __name__ == '__main__':
    cfg = json.load(open(sys.argv[1]))
    hubs, pop, review, source = {}, {}, [], {}
    for hub, code in cfg['authorities'].items():
        towns = []
        for p, n in settlements(code).items():
            if p.lower() != hub.lower() and p not in towns:
                towns.append(p); source[p] = 'Wikidata'
                if n: pop[p] = n
        for ward, n in wards(code):
            ps = places_from(ward)
            if not ps or len(ps) > 1 or ps[0] != ward:
                review.append(f'{hub}: "{ward}" -> {ps or "dropped"}')
            for p in ps:
                share = n // len(ps)
                if p.lower() != hub.lower() and p not in towns: towns.append(p); source[p] = 'ward'
                elif p in source and source[p] == 'Wikidata' and p in pop: continue  # keep Wikidata's own figure
                if source.get(p) == 'ward' or p not in pop:
                    pop[p] = pop.get(p, 0) + share  # a ward split into two places shares its population; directions add up
        hubs[hub] = towns
    out = {'country': cfg.get('country', 'United Kingdom'), 'trade_phrase': cfg.get('trade_phrase', ''),
           'terms': cfg.get('terms', []), 'proxy_terms': cfg.get('proxy_terms', []),
           'sources': {'places': 'ONS Census 2021 wards (Nomis TS001), split into place names, and Wikidata settlements in each authority (P836); add spellings by hand',
                       'population': 'ONS Census 2021 ward totals (shared equally where a ward names two places); Wikidata P1082 where the place is not a ward (dates vary)'},
           'hubs': hubs, 'ambiguous': [], 'population': pop, 'source': source, 'review': review}
    json.dump(out, open(sys.argv[2], 'w'), indent=1)
    print(f'{sum(len(t) for t in hubs.values())} places in {len(hubs)} hubs -> {sys.argv[2]}; {len(review)} ward names changed, listed under "review"')
