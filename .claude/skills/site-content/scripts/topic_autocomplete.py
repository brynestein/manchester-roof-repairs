"""Collect Google autocomplete suggestions for article topic research (see references/topic-research.md).

    python3 topic_autocomplete.py config.json suggestions.json

Uses the config's "autocomplete" block:
  "nouns":    the trade's things and problems ("gutter", "guttering", "fascia", "blocked downpipe", "rogue roofer")
  "prefixes": question openings typed before a noun ("how much", "how to", "why is my", "how far apart")
  "suffixes": words typed after a noun ("cost", "leaking", "regulations")
  "hl", "gl": language and country, e.g. "en-GB" and "uk"

Autocomplete only suggests what people search, so every suggestion is a real search; it carries no volume, so the
suggestions go through topic_candidates.py (--suggest) and one Keyword Planner volume run like any other source.
It finds the question wordings ("how much are new gutters", "how far apart should gutter brackets be") that a
Discover export rarely returns, which is what a sister site's Search Console supplied before.
The endpoint is unofficial and unauthenticated: keep the request rate low and the results cached.
"""
import json, os, sys, time, urllib.parse, urllib.request


def suggest(text, hl, gl, cache):
    if text in cache:
        return cache[text]
    url = 'https://suggestqueries.google.com/complete/search?' + urllib.parse.urlencode({'client': 'firefox', 'hl': hl, 'gl': gl, 'q': text})
    out = []
    for i in range(3):
        try:
            out = json.loads(urllib.request.urlopen(url, timeout=20).read().decode('utf-8', 'replace'))[1]
            break
        except Exception:
            time.sleep(2 ** i)
    cache[text] = out
    time.sleep(0.25)
    return out


if __name__ == '__main__':
    cfg = json.load(open(sys.argv[1]))['autocomplete']
    out = sys.argv[2]
    cache_path = out + '.cache.json'
    cache = json.load(open(cache_path)) if os.path.exists(cache_path) else {}
    hl, gl = cfg.get('hl', 'en-GB'), cfg.get('gl', 'uk')
    queries = [f'{p} {n}' for p in cfg['prefixes'] for n in cfg['nouns']] + [f'{n} {s}' for n in cfg['nouns'] for s in cfg.get('suffixes', [])] + list(cfg['nouns'])
    got = set()
    for i, q in enumerate(queries):
        got |= {s.lower() for s in suggest(q, hl, gl, cache)}
        if i % 50 == 49: json.dump(cache, open(cache_path, 'w'))
    json.dump(cache, open(cache_path, 'w'))
    json.dump(sorted(got), open(out, 'w'), indent=0)
    print(f'{len(queries)} queries -> {len(got)} suggestions -> {out}')
