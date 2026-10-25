import facts from '../data/facts.json';
import staticFaqs from '../data/faqs.json';

// Claims render only from confirmed facts (site-content skill, rule 8: no record, no claim).

export { facts };

export const yearsTrading = facts.yearFounded
  ? new Date().getFullYear() - facts.yearFounded
  : null;

export const guaranteeLabel = facts.guarantee.years
  ? `${facts.guarantee.years}-year written guarantee`
  : null;

export interface Stat { value: string; label: string }

export const stats: Stat[] = [
  yearsTrading ? { value: `${yearsTrading}`, label: 'Years Trading' } : null,
  facts.jobsCompleted ? { value: facts.jobsCompleted.toLocaleString('en-GB'), label: 'Jobs Completed' } : null,
  facts.google.rating ? { value: `${facts.google.rating}`, label: 'Google Rating' } : null,
].filter((s): s is Stat => s !== null);

export interface TrustItem { title: string; detail: string }

export const trustItems: TrustItem[] = [
  facts.insurance.publicLiability ? { title: 'Fully Insured', detail: `${facts.insurance.publicLiability} Public Liability` } : null,
  ...facts.accreditations.map((a: { name: string; detail?: string }) => ({ title: a.name, detail: a.detail ?? 'Member' })),
  guaranteeLabel ? { title: `${facts.guarantee.years}-Year Guarantee`, detail: 'Written Guarantee' } : null,
].filter((t): t is TrustItem => t !== null);

export const aggregateRating = facts.google.rating && facts.google.reviewCount
  ? { '@type': 'AggregateRating', ratingValue: String(facts.google.rating), reviewCount: String(facts.google.reviewCount), bestRating: '5' }
  : undefined;

// Fact-backed answers join the static FAQ only once the fact exists.
export const faqs = [
  ...staticFaqs,
  facts.insurance.publicLiability ? {
    question: 'Are you insured?',
    answer: `Yes. Manchester Gutters carries ${facts.insurance.publicLiability} public liability insurance.`,
  } : null,
  guaranteeLabel ? {
    question: 'What guarantee do you provide?',
    answer: `Manchester Gutters gives a ${guaranteeLabel}${facts.guarantee.covers ? ` covering ${facts.guarantee.covers}` : ''}.`,
  } : null,
  facts.emergency.available ? {
    question: 'Do you offer emergency call-outs?',
    answer: `Yes. Manchester Gutters takes emergency call-outs ${facts.emergency.available}${facts.emergency.response ? ` and aims to reach you ${facts.emergency.response}` : ''}.`,
  } : null,
].filter((f): f is { question: string; answer: string } => f !== null);
