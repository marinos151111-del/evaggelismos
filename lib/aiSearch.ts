import Fuse from 'fuse.js';
import type { Product } from '@/types';

/**
 * AI-style natural language catalog search.
 * Understands: instruments & synonyms ("guitars", "quiars", "keys", "mics"),
 * price intent ("under €300", "cheap", "between 100 and 500"),
 * offer intent ("on sale", "deals"), and sorts by relevance.
 */

export interface AiInterpretation {
  chips: string[]; // human-readable interpreted filters
  answer: string; // the assistant's one-line answer
}

export interface AiResult {
  results: Product[];
  interpretation: AiInterpretation;
}

/** Synonym expansion — one entry per concept, lowercase. */
const SYNONYMS: [string[], string[]][] = [
  // guitars family
  [['guitar', 'guitars', 'guitarra', 'guitarra'], ['guitar', 'classical guitar', 'acoustic guitar', 'electric guitar', 'bass guitar', 'ukulele']],
  [['bass', 'basses'], ['bass', 'bass guitar', 'double bass']],
  [['ukulele', 'uke', 'ukuleles'], ['ukulele']],
  [['bouzouki', 'mpouzouki'], ['bouzouki']],
  [['violin', 'violins', 'fiddle'], ['violin']],
  [['cello', 'violoncello'], ['cello']],
  [['viola'], ['viola']],
  [['strings', 'string instruments'], ['violin', 'viola', 'cello', 'string', 'bow', 'rosin']],
  // keys
  [['piano', 'pianos', 'grand piano', 'upright'], ['piano', 'young chang']],
  [['keyboard', 'keyboards', 'keys', 'synth', 'synthesizer'], ['keyboard', 'piano', 'synthesizer', 'stage']],
  // drums
  [['drum', 'drums', 'drumset', 'drum kit', 'drummer'], ['drum', 'snare', 'cymbal', 'tom', 'percussion']],
  [['cymbal', 'cymbals'], ['cymbal', 'crash', 'ride', 'hi-hat', 'splash']],
  [['sticks', 'drumsticks', 'drum sticks', 'beaters'], ['stick', 'beater', 'mallet', 'brush']],
  [['percussion', 'percussions'], ['percussion', 'conga', 'bongo', 'djembe', 'cajon', 'tambourine', 'shaker', 'maraca']],
  // wind
  [['saxophone', 'sax', 'saxophones'], ['saxophone', 'sax']],
  [['flute', 'flutes'], ['flute', 'piccolo']],
  [['trumpet', 'trumpets', 'cornet'], ['trumpet', 'cornet']],
  [['clarinet', 'clarinets'], ['clarinet']],
  [['trombone'], ['trombone']],
  [['harmonica', 'harmonicas', 'harp'], ['harmonica']],
  [['wind instruments', 'brass', 'woodwind'], ['saxophone', 'flute', 'clarinet', 'trumpet', 'trombone', 'tuba', 'euphonium', 'cornet', 'wind']],
  // audio
  [['microphone', 'microphones', 'mic', 'mics'], ['microphone', 'mic']],
  [['headphone', 'headphones', 'earphones', 'earphone', 'earbuds'], ['headphone', 'earphone', 'in-ear']],
  [['speaker', 'speakers', 'monitors', 'monitor'], ['speaker', 'monitor', 'pa system', 'party box']],
  [['amp', 'amps', 'amplifier', 'amplifiers'], ['amplifier', 'amp', 'combo']],
  [['mixer', 'mixers', 'mixing', 'console'], ['mixer', 'mixing', 'console', 'dj']],
  [['dj', 'djing'], ['dj', 'turntable', 'controller']],
  [['cable', 'cables', 'connector', 'connectors', 'wire', 'jack'], ['cable', 'connector', 'jack', 'xlr']],
  [['audio', 'sound', 'sound system', 'pa'], ['speaker', 'mixer', 'microphone', 'amplifier', 'audio', 'cable']],
  // accessories
  [['stand', 'stands'], ['stand']],
  [['tuner', 'tuners', 'metronome'], ['tuner', 'metronome']],
  [['pick', 'picks', 'plectrum'], ['pick', 'plectrum']],
  [['strap', 'straps'], ['strap']],
  [['case', 'cases', 'bag', 'gigbag', 'gig bag'], ['case', 'bag', 'gigbag']],
  [['bow', 'bows'], ['bow']],
  [['rosin'], ['rosin']],
  [['book', 'books', 'sheet music', 'songbook', 'method'], ['book', 'songbook', 'theory', 'method']],
  [['ear plugs', 'earplugs', 'hearing protection', 'ear protection'], ['ear plug', 'hearing protection', 'freqoff']],
  [['singing bowl', 'singing bowls', 'meditation'], ['singing bowl', 'sonic energy', 'tuning fork', 'chime', 'gong']],
  [['guitar strings', 'strings for guitar'], ['guitar string', 'strings']],
];

/** Expand a token into its concept terms (if known). */
function expand(token: string): string[] | null {
  const t = token.toLowerCase();
  for (const [keys, expansion] of SYNONYMS) {
    if (keys.includes(t)) return expansion;
  }
  return null;
}

/** Fuzzy concept lookup — typo-tolerant ("quiars" -> "guitars"). */
const CONCEPT_FUSE = new Fuse(
  SYNONYMS.flatMap(([keys, expansion]) => keys.map((k) => ({ key: k, expansion }))),
  { keys: ['key'], threshold: 0.45, ignoreLocation: true, includeScore: true }
);

function expandFuzzy(token: string): string[] {
  const exact = expand(token);
  if (exact) return exact;
  const hit = CONCEPT_FUSE.search(token, { limit: 1 })[0];
  if (hit && (hit.score ?? 1) <= 0.45) {
    // keep the raw token too — the concept expansion adds recall, the raw
    // token keeps direct/brand matches ("shure") unhijacked
    return [...new Set([token, ...hit.item.expansion])];
  }
  return [token];
}

const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Word-boundary-ish match of a term against a text (substring ok for len>=4). */
function textMatches(text: string, term: string): boolean {
  const t = text.toLowerCase();
  if (term.length >= 4) return t.includes(term);
  return new RegExp(`(^|[\\s/\\-("'])${escRe(term)}`, 'i').test(text);
}

interface PriceIntent {
  min?: number;
  max?: number;
  label?: string;
}

function parsePriceIntent(q: string): PriceIntent {
  const s = q.toLowerCase();
  let m = s.match(/between\s*(?:€|eur)?\s*(\d+(?:[.,]\d+)?)\s*(?:and|-|to)\s*(?:€|eur)?\s*(\d+(?:[.,]\d+)?)/);
  if (m) return { min: parseFloat(m[1].replace(',', '')), max: parseFloat(m[2].replace(',', '')), label: `€${m[1]} – €${m[2]}` };
  m = s.match(/(?:under|below|less than|max|up to|cheaper than)\s*(?:€|eur)?\s*(\d+(?:[.,]\d+)?)/);
  if (m) return { max: parseFloat(m[1].replace(',', '')), label: `under €${m[1]}` };
  m = s.match(/(?:over|above|more than|at least|min)\s*(?:€|eur)?\s*(\d+(?:[.,]\d+)?)/);
  if (m) return { min: parseFloat(m[1].replace(',', '')), label: `over €${m[1]}` };
  if (/\bcheap|cheapest|budget|affordable\b/.test(s)) return { max: 100, label: 'budget-friendly' };
  if (/\bexpensive|premium|flagship|high.?end|professional grade\b/.test(s)) return { min: 500, label: 'premium' };
  return {};
}

const OFFER_RE = /\b(on sale|sale|offer|offers|deal|deals|discount|discounted|clearance|special)\b/i;
const STRIP_RE = /\b(i am looking for|i'm looking for|im looking for|i want|i need|looking for|show me|find me|give me|search for|do you have|have you got|any|please|can you|could you|all|the|a|an|some|to buy|buy|me|cheap|cheapest|budget|affordable|expensive|premium|flagship|high-end|high end)\b/gi;

export function aiSearch(products: Product[], rawQuery: string): AiResult {
  const price = parsePriceIntent(rawQuery);
  const wantsOffers = OFFER_RE.test(rawQuery);

  // clean the query: drop price phrases, filler words, offer words
  let cleaned = rawQuery.toLowerCase()
    .replace(/between\s*(?:€|eur)?\s*\d+(?:[.,]\d+)?\s*(?:and|-|to)\s*(?:€|eur)?\s*\d+(?:[.,]\d+)?/g, ' ')
    .replace(/(?:under|below|less than|max|up to|cheaper than|over|above|more than|at least|min)\s*(?:€|eur)?\s*\d+(?:[.,]\d+)?/g, ' ')
    .replace(OFFER_RE, ' ')
    .replace(STRIP_RE, ' ')
    .replace(/[€$,.?!!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = cleaned.split(' ').filter((t) => t.length >= 2);
  // expand each query word into its concept terms — typo-tolerant ("quiars" -> "guitars")
  const rootTerms = tokens.map((t) => [...new Set(expandFuzzy(t))]);
  const allTerms = [...new Set(rootTerms.flat())];

  // Fuzzy search over name + category + subcategory
  const fuse = new Fuse(products, {
    keys: [
      { name: 'name', weight: 0.65 },
      { name: 'cat', weight: 0.2 },
      { name: 'sub', weight: 0.15 },
    ],
    threshold: 0.3,
    ignoreLocation: true,
    includeScore: true,
  });

  interface Scored { p: Product; score: number; roots: number }
  let scored: Scored[];
  if (allTerms.length === 0) {
    scored = products.map((p) => ({ p, score: 0.5, roots: 0 }));
  } else {
    const byId = new Map<number, Scored>();
    const consider = (id: number, p: Product, s: number, rootBit: number) => {
      const prev = byId.get(id);
      if (!prev) byId.set(id, { p, score: s, roots: rootBit });
      else {
        if (s < prev.score) prev.score = s;
        prev.roots |= rootBit;
      }
    };
    rootTerms.forEach((terms, rootIdx) => {
      const rootBit = 1 << Math.min(rootIdx, 30);
      for (const term of terms) {
        if (term.length <= 3) {
          // short terms: strict word-start match (avoids "dj" -> "Djembe")
          for (const p of products) {
            const hay = `${p.name} ${p.cat} ${p.sub}`;
            if (textMatches(hay, term)) consider(p.id, p, term.length <= 2 ? 0.08 : 0.12, rootBit);
          }
        } else {
          for (const hit of fuse.search(term, { limit: 150 })) {
            consider(hit.item.id, hit.item, hit.score ?? 0.5, rootBit);
          }
        }
      }
    });
    scored = [...byId.values()];
  }

  // apply price + offer intents
  const rootCount = tokens.length;
  let list = scored.filter(({ p }) => {
    if (p.price == null) return false;
    if (price.min != null && p.price < price.min) return false;
    if (price.max != null && p.price > price.max) return false;
    if (wantsOffers && !p.offer) return false;
    return true;
  });

  // relevance: products matching MORE distinct query words rank first,
  // then fuse score; word-start matches in the product name get a boost
  const popcount = (v: number) => { let c = 0; while (v) { c += v & 1; v >>= 1; } return c; };
  const rank = (x: Scored) => {
    const nameBoost = allTerms.some((t) => textMatches(x.p.name, t)) ? -0.1 : 0;
    return -popcount(x.roots) * 10 + x.score + nameBoost;
  };
  if (rootCount > 0) list.sort((a, b) => rank(a) - rank(b));

  // interpretation
  const chips: string[] = [];
  if (tokens.length) chips.push(`“${tokens.join(' ')}”`);
  if (price.label) chips.push(price.label);
  if (wantsOffers) chips.push('special offers');

  const n = list.length;
  let answer: string;
  if (n === 0) {
    answer = `I couldn't find anything matching “${rawQuery}” — try rephrasing, or browse the full catalog.`;
  } else {
    const topCat = topCategories(list.map((x) => x.p));
    answer = `I found ${n.toLocaleString('en-US')} match${n === 1 ? '' : 'es'}${topCat ? ` — mostly in ${topCat}` : ''}${price.label ? ` (${price.label})` : ''}${wantsOffers ? ' on special offer' : ''}. Here are the best matches:`;
  }

  return {
    results: list.map((x) => x.p),
    interpretation: { chips, answer },
  };
}

function topCategories(list: Product[]): string {
  const counts = new Map<string, number>();
  for (const p of list.slice(0, 200)) counts.set(p.cat, (counts.get(p.cat) ?? 0) + 1);
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2);
  return top.map(([name]) => name.replace(/ & Accesories| & Accessories/, '')).join(' & ');
}
