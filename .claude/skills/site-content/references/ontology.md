# The trade ontology and how the page brief is built from it

An ontology is the list of things a complete page in this trade is expected to name, organised by category and search intent, with each entity tied to Wikidata or Google's Knowledge Graph where a match exists. It is the prescriptive half of the brief: what the page **should** cover, as opposed to what competitors happen to cover.

Where it lives: `audit-content/packages/topic-ontology-schema/src/data/roofing.json` (bundled, readable from any session) and the builders in `apps/site-manager/src/lib/ontology/` (Knowledge Graph expansion, Wikidata resolution, expectation fusion). Design: `audit-content/docs/design/expectation-model-and-topic-ontology.md` and `topical-authority-matrix-and-graph.md`.

## The roofing ontology v0.1 (8 July 2026)

- Regions: UK and IE (standards and bodies differ by region).
- **8 intents:** repair, emergency, replacement/installation, survey/inspection, maintenance/cleaning, material, roofline, specialist. Each carries the customer query form and an urgency.
- **8 categories, 76 nodes:** services, components, materials, roof types, defects and symptoms, standards and regulations, trust and accreditations, adjacent concepts.
- Vocabulary flips from the CSI pilot are recorded (roof window, lead flashing, EPDM, GRP, velux).
- **Known gaps (from the file's own notes):** no Knowledge Graph ids yet for most standards, trust bodies and defects; roof geometry, ventilation and named waterproofing systems missing; no roofer has reviewed it; gutter coverage exists (repair, installation, cleaning, sagging, "guttering" bundle) but gutter cleaning is a different competitive market from roofing and needs its own check before it drives a gutters-first site.
- Status rule: an ontology is **draft until an operator approves it**, and only an approved ontology drives client content. Version-bump after any change.

## Building the brief from it (the expectation model)

For a page with CSI `c`, trade ontology `O`, the entities covered by the top-10 results `S`, and our current page `P`:

| Set | Meaning | What the writer does with it |
|---|---|---|
| `required = O.expected ∪ best-of(S)` | everything a strong page covers | the entity list for the brief |
| `infoGain = O.expected − (S ∪ P)` | expected by the trade, absent from every competitor and from us | own these first (see information-gain); they replace the weakest parity entities inside the density band |
| `serpParity = best-of(S) − P` | table stakes we are missing | cover them |
| `buried = (O.expected ∩ P)` not in a heading | we have it but hidden | move to an H2 or first paragraph |
| `coverage = |O.expected ∩ P| / |O.expected|` | completeness 0-1 | target ≥ 0.8 on service and hub pages |
| `missingTriples = O.triples − P.relations` | relationships the trade expects stated as claims (service → addresses → defect; material → suits → roof type; roofer → holds → accreditation) | write each as a plain sentence |
| `missingIntents` | intents in the CSI cluster with no entity on the page | add a section |

Salience counts: an entity in an H2 scores about twice a mention in body text (Patric's hub pages name defect H3s with the exact ontology label for this reason).

## Where it runs today, and what a session can do

- Site Manager computes the fusion inside the Site Builder flow (frozen) behind the login. The fusion code itself is pure (no network), so a `page-brief` script in `audit-content` can run it from the bundled ontology plus a competitor entity list from the content teardown or DataForSEO. That script is a follow-on, not built yet.
- Until then, a session reads `roofing.json` directly, lists the intent's expected entities by category, and marks which the top-10 pages cover (from a teardown or by reading them). The brief records the result in the same vocabulary (required / infoGain / parity / buried).

## Site-level use (the topical map)

The same ontology at site zoom answers "is every expected sub-topic covered by some page?" Gaps are pages to commission, demand-gated. Its relationships also type the internal links: a service page *addresses* a defect; a defect page *is fixed by* a service; which is where predicate-style anchors come from. This belongs in Site Manager's per-site page (Phase 3 of the portal plan).

## Before the ontology drives a client site

1. Resolve the missing Knowledge Graph ids (about half a day).
2. One hour with a working roofer to catch structural gaps (safety, insurance, HSE, ventilation).
3. Check the gutter side against a gutter-specialist SERP for a gutters-first site.
4. Approve it as v0.2 and record who approved it.
