# Entities: what to name, how often, where, and how to phrase it

An entity is a specific, nameable thing a search engine or AI system can recognise: the business, a place, a service, a component, a material, a defect, a standard, a trade body, a regulation, a landmark. Pages that name the right entities precisely read as written by someone who knows the trade; pages that use vague words ("roofing solutions", "the area", "quality materials") read as thin.

The list for a page comes from the trade ontology and the ranking set (see ontology); this file says how to use it.

## The eight entity categories (trade ontology)

| Category | Examples | Where it matters most |
|---|---|---|
| Services | roof repair, roof replacement, gutter cleaning, fascia and soffit replacement | Every page (the CSI anchor) |
| Components | ridge tiles, valleys, flashing, fascia, soffit, downpipes, underlay, battens | Service pages: name what the job acts on |
| Materials | natural slate, concrete tile, EPDM, GRP, felt, uPVC, cast iron, aluminium | Material-choice and replacement pages |
| Roof types | pitched, flat, hipped, mansard | Pages where the method differs by type |
| Defects and symptoms | leaks, slipped slates, sagging gutters, damp patches, moss | Repair and emergency pages; hub "problems we fix" H3s |
| Standards and regulations | BS 5534, BS 6229, Approved Documents (UK) or Technical Guidance Documents (IE), Work at Height Regulations | Replacement, compliance and cost pages |
| Trust and accreditations | NFRC, TrustMark, CompetentRoofer (UK); CIRI, Guaranteed Irish (IE); public liability insurance | Every commercial page, in an H2 or first paragraph |
| Adjacent concepts | insurance claims, planning in conservation areas, SEAI grants (IE), scaffolding | Information-gain sections |

Eight intents cross these: repair, emergency, replacement/installation, survey/inspection, maintenance/cleaning, material, roofline, specialist. Use the market's own bodies and standards; only name an accreditation the client holds.

## Cover what a complete page covers [house]

Plan sections against these axes so nothing obvious is missing: diagnostic (how the problem is found), material, cost, timing and urgency, regulatory, insurance and warranty, choosing a contractor, maintenance, risk and safety, decision (repair vs replace). A service page does not need all ten; missing cost, decision or provider selection on a commercial page is a gap. `intent-cluster-coverage`: for each intent the CSI spans, the body names at least one entity mapped to that intent.

## How many: density

- **Target entities** are the ones in the page brief. They should appear about **4-12 times per 200 words** across the body (`entity-density-per-200w`); national guides run 4-18. Below 4 reads as off-topic; above 12 as stuffing. This counts the brief's entities, not every proper noun; it is a ceiling to work within, not a target to hit. Gap entities (information-gain) replace the weakest parity entities inside the band.
- Vary the surface form (slate, natural slate, Welsh slate) rather than repeating one phrase.
- **Competitive parity:** name at least 60% of the entities the top-10 results for the CSI collectively cover (`competitive-entity-parity`), and at least 60% of their recurring co-occurring terms (`lsi-coverage-min`). The set comes from the content teardown or the ontology comparison. [house]
- Knowledge Graph recognition: at least 30% of the entities named should resolve to a Knowledge Graph or Wikidata entry (audit tool). Prefer names that have one.

## Where: salience

- Important entities go in an **H2 or the first paragraph**, not only in body text or a bullet list (`no-buried-ontology-entities`). A trust body that appears only in a "Why choose us" list counts as buried. [measured: 4 of 5 pilot pages buried NFRC, TrustMark and CompetentRoofer this way]
- An entity in a heading counts about twice a body mention. Give trust entities a real section ("Why our NFRC membership matters for your roof").
- The central entity (the service, or the place on a town page) is in the title, H1, slug, first paragraph and at least one H2.

## How: phrase claims as subject-verb-object sentences

Search engines and AI answers extract claims as subject-predicate-object facts. A bullet fragment does not parse as a claim.

| Do | Do not |
|---|---|
| Our roofers hold NFRC membership. | NFRC members |
| Our slate work complies with BS 5534. | BS 5534 compliant |
| Munster Gutters replaces cast iron gutters with aluminium or uPVC. | Cast iron / aluminium / uPVC |
| Emergency repairs in Salford are usually made safe within 4 hours. | Fast response |

The examples are illustrative; use only the client's real facts.

- Every accreditation, membership and standard cited appears **at least once as a plain declarative sentence**, present tense, with a named subject (`extractable-spo-accreditations`). [measured: 4 of 5 pilot pages failed this]
- The ontology's expected relationships (service → addresses → defect; material → suits → roof type; roofer → holds → accreditation) are each stated once as a sentence (`missingTriples` in the brief).
- One claim per sentence. Bullets are fine for scanning as long as the claim is also a sentence somewhere.

## Information gain

See information-gain. The short form: the brief lists what the page will say that no top-10 result says, from the ontology gap, our records and the place brief; 3 items on commercial pages, 5 on articles; all true, all sourced.

## Local entities and town pages [D-H]

- Name the town, its neighbouring areas and districts precisely and consistently.
- Local housing stock, materials, exposure, drainage, access and conservation areas make the page different. They come from the place brief, never from a model's idea of a town.
- Name real local places (estates, streets, landmarks, conservation areas) where they help a reader, not as a quota. The audit warns below 3 named places; it does not block.
- **Evidence of work in that town:** a real job, photo, video or review from the records. If none exists, say so rather than imply it.
- Never promise service, a visit time or a phone number for an area the client does not cover.

## The business as an entity

The business is the most important entity on every page. Make it unambiguous:

- One canonical name, address and phone (NAP) from `business.json`, identical everywhere: header, footer, JSON-LD, Google Business Profile and every citation. Never hard-code NAP in a template.
- Render NAP in the header and footer of every page (audit `local-nap-density` ≥2). [house: the ranking effect is not proven by us]
- Name the business in the body as the expert solving the reader's problem, at least once per section, with evidence: real jobs, reviews, years trading, accreditations, guarantees. [house, Patric]
- A named person: the owner as article author, the manager named on commercial pages, title only, never invented credentials.
- Accreditation badges link to the issuer's listing for the client, not the issuer's homepage; a badge that links to a front page proves nothing.
- The aim is a Knowledge Graph panel for the brand query: consistent naming, schema, Google Business Profile and citations all point at one entity.

## Entity pages and guides

- **Entity pages** (`/entity/<slug>/`) pass four gates: a Wikidata entry; mentioned on 3+ site pages; an authoritative external source; real search demand. 9-16 per site (materials 4-6, bodies 2-4, regulations 2-3, councils 1-3), built commercial-first from what the service pages reference. 300-600 words, 3+ related entities each twice (`entity-page-related-mentions-min`), 3-8 in-prose links to services and towns (`entity-page-outbound-prose-min`), external links ≤3 including `sameAs` to Wikidata plus the official source (`entity-page-sameas-required`, block).
- **Guides** are national, location-neutral pillars for topics with real national demand, at `/blog/<topic>/`. They link down to their place spokes and to the service pages.

## Language to avoid

- No clichés: world-class, cutting-edge, best in the business, second to none, industry-leading, state-of-the-art, one-stop shop, cheap (`no-cliches`).
- No stock AI phrasing: "in today's fast-paced", "look no further", "let's dive in", "in conclusion", "navigate the complexities", "unleash the power" and the rest of `AI_STEREOTYPE_PHRASES` (`content-not-ai-stereotype`, block).
- Keep sentiment factual and calm (audit band 0.45-0.6). No exclamation marks, no fake scarcity.
