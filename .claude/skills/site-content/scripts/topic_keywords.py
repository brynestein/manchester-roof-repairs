"""Write the Keyword Planner upload for article topic research (see references/topic-research.md).

    python3 topic_keywords.py topics.json keywords.csv
"""
import json, sys

if __name__ == '__main__':
    cfg = json.load(open(sys.argv[1]))
    kws = list(dict.fromkeys(k.lower() for g in cfg['groups'].values() for k in g))
    long = [k for k in kws if len(k.split()) > 10 or len(k) > 80]  # Keyword Planner rejects these
    if long: print('left out (over 10 words or 80 characters):', long)
    kws = [k for k in kws if k not in long]
    open(sys.argv[2], 'w').write('Keyword\n' + '\n'.join(kws) + '\n')
    print(f'{len(kws)} keywords in {len(cfg["groups"])} groups -> {sys.argv[2]}')
