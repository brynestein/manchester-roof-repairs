"""Write the Keyword Planner upload for hub and town research (see references/location-research.md).

    python3 location_keywords.py places.json keywords.csv

places.json: {"country": ..., "terms": [...], "proxy_terms": [...], "hubs": {"<Hub>": ["<Town>", ...]}, ...}
Every hub and town gets every term and every proxy term. The hub name itself is searched as a place.
"""
import json, sys


def keywords(cfg):
    places = [p for hub, towns in cfg['hubs'].items() for p in [hub] + towns]
    terms = cfg['terms'] + cfg.get('proxy_terms', [])
    return list(dict.fromkeys(f'{t} {p}'.lower().replace('-', ' ') for p in places for t in terms))


if __name__ == '__main__':
    cfg = json.load(open(sys.argv[1]))
    kws = keywords(cfg)
    long = [k for k in kws if len(k.split()) > 10 or len(k) > 80]  # Keyword Planner rejects these
    if long: print('left out (over 10 words or 80 characters):', long)
    kws = [k for k in kws if k not in long]
    if len(kws) > 10000:
        sys.exit(f'{len(kws)} keywords: Keyword Planner takes 10,000 per upload; split the places file')
    open(sys.argv[2], 'w').write('Keyword\n' + '\n'.join(kws) + '\n')
    print(f'{len(kws)} keywords for {sum(1 + len(t) for t in cfg["hubs"].values())} places -> {sys.argv[2]}')
