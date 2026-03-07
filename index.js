#!/usr/bin/env node
'use strict';

// ─── ANSI Colors ────────────────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
};

const bold = s => `${c.bold}${s}${c.reset}`;
const dim = s => `${c.dim}${s}${c.reset}`;
const col = (color, s) => `${color}${s}${c.reset}`;

// ─── Database ────────────────────────────────────────────────────────────────
const CLAIMS = [
  {
    id: 'meta-keywords',
    keywords: ['meta keyword', 'keywords tag', 'meta keywords'],
    claim: 'Meta keywords boost rankings',
    verdict: 'PANTS_ON_FIRE',
    explanation:
      'Google stopped using the meta keywords tag in September 2009. Matt Cutts confirmed this publicly. Using it won\'t hurt you, but it won\'t help either.',
    source: 'Google Webmaster Blog, Sept 2009',
  },
  {
    id: 'keyword-density',
    keywords: ['keyword density', 'keyword percentage', 'keyword ratio', 'keyword stuffing'],
    claim: 'Keyword density matters',
    verdict: 'FALSE',
    explanation:
      'Google uses semantic understanding and natural language processing — not keyword counting. Obsessing over a "2-3% density" is cargo-cult SEO from the early 2000s.',
    source: 'Google Search Central — How Search Works',
  },
  {
    id: 'duplicate-content-penalty',
    keywords: ['duplicate content penalty', 'duplicate penalty', 'duplicate content'],
    claim: 'Duplicate content penalty exists',
    verdict: 'MISLEADING',
    explanation:
      'There is no manual "duplicate content penalty." Google picks a canonical version and consolidates signals to it. The other copies just get filtered out of results — you lose ranking equity, not a penalty.',
    source: 'Google Search Central — Duplicate Content',
  },
  {
    id: 'buying-links',
    keywords: ['buy link', 'buying link', 'paid link', 'purchase link', 'link buying'],
    claim: 'Buying links helps SEO',
    verdict: 'PANTS_ON_FIRE',
    explanation:
      'Buying links violates Google\'s Webmaster Guidelines. If caught — via manual review or Penguin — you can be deindexed entirely. Google\'s spam team actively hunts link schemes.',
    source: 'Google Search Central — Link Spam',
  },
  {
    id: 'more-pages',
    keywords: ['more page', 'more content', 'more url', 'quantity of page', 'number of page'],
    claim: 'More pages equals better SEO',
    verdict: 'FALSE',
    explanation:
      'Thin, low-quality pages hurt your site. Google\'s Panda update (2011) specifically targeted sites inflating page counts with useless content. Quality beats quantity every time.',
    source: 'Google Search Central — Helpful Content',
  },
  {
    id: 'exact-match-domain',
    keywords: ['exact match domain', 'emd', 'keyword domain', 'domain name keyword'],
    claim: 'Exact match domains rank better',
    verdict: 'FALSE',
    explanation:
      'The EMD update in September 2012 specifically targeted exact-match domains with low-quality content. Domain name is a very minor signal at best — content and authority matter far more.',
    source: 'Google, September 2012 — EMD Update',
  },
  {
    id: 'social-signals',
    keywords: ['social signal', 'social media ranking', 'facebook ranking', 'twitter ranking', 'social share'],
    claim: 'Social signals affect rankings',
    verdict: 'FALSE',
    explanation:
      'Google has explicitly confirmed multiple times that social signals (likes, shares, followers) are NOT ranking factors. Social media can drive traffic which indirectly correlates with rankings, but the signals themselves don\'t count.',
    source: 'Gary Illyes, Google — Twitter, 2016',
  },
  {
    id: 'xml-sitemap',
    keywords: ['xml sitemap', 'sitemap ranking', 'sitemap boost', 'sitemap seo'],
    claim: 'XML sitemaps boost rankings',
    verdict: 'MISLEADING',
    explanation:
      'Sitemaps help Google discover your URLs faster — they don\'t boost rankings. A page in a sitemap with no links or authority won\'t outrank anything. Discovery ≠ ranking.',
    source: 'Google Search Central — Sitemaps',
  },
  {
    id: 'meta-description',
    keywords: ['meta description ranking', 'description ranking', 'meta description seo'],
    claim: 'Meta descriptions affect rankings',
    verdict: 'FALSE',
    explanation:
      'Meta descriptions are NOT a ranking factor — Google confirmed this definitively. They affect click-through rate (CTR) in search results, which can indirectly influence traffic, but the description itself doesn\'t move rankings.',
    source: 'Google Search Central, 2009',
  },
  {
    id: 'h1-unique',
    keywords: ['h1 unique', 'one h1', 'single h1', 'multiple h1', 'h1 tag rule'],
    claim: 'H1 tags must be unique on a page',
    verdict: 'MISLEADING',
    explanation:
      'Multiple H1 tags are perfectly fine per Google. John Mueller confirmed in 2020 that Google can handle multiple H1s. The "one H1" rule is an outdated convention, not a requirement.',
    source: 'John Mueller, Google — Webmaster Hangout, 2020',
  },
  {
    id: 'page-speed',
    keywords: ['page speed', 'site speed', 'load time', 'core web vital', 'cwv', 'lcp', 'cls', 'fid'],
    claim: 'Page speed affects rankings',
    verdict: 'TRUE',
    explanation:
      'Core Web Vitals became a confirmed ranking signal in June 2021. LCP, FID/INP, and CLS are measured and factored into rankings — particularly for competitive queries where quality is similar.',
    source: 'Google Search Central — Core Web Vitals, 2021',
  },
  {
    id: 'https',
    keywords: ['https ranking', 'ssl ranking', 'https seo', 'ssl certificate', 'secure site'],
    claim: 'HTTPS is a ranking factor',
    verdict: 'TRUE',
    explanation:
      'HTTPS has been a confirmed ranking signal since August 2014. It\'s a lightweight signal used as a tiebreaker, but all else being equal, HTTPS wins over HTTP every time.',
    source: 'Google Webmaster Blog — HTTPS as Ranking Signal, Aug 2014',
  },
  {
    id: 'mobile-friendly',
    keywords: ['mobile friendly', 'mobile first', 'mobile ranking', 'mobile seo', 'responsive'],
    claim: 'Mobile-friendly sites rank better',
    verdict: 'TRUE',
    explanation:
      'Mobile-first indexing has been Google\'s default since July 2019. Google primarily uses the mobile version of content for indexing and ranking. Non-mobile-optimised sites are at a serious disadvantage.',
    source: 'Google Search Central — Mobile-First Indexing, 2019',
  },
  {
    id: 'backlinks',
    keywords: ['backlink', 'link building', 'inbound link', 'external link ranking', 'link authority'],
    claim: 'Backlinks matter for SEO',
    verdict: 'TRUE',
    explanation:
      'Backlinks remain one of Google\'s top 3 ranking factors alongside content and RankBrain/AI systems. High-quality, relevant backlinks from authoritative domains are still the most powerful ranking lever.',
    source: 'Google — How Search Works; multiple confirmations',
  },
  {
    id: 'internal-linking',
    keywords: ['internal link', 'internal linking', 'site link', 'link between page'],
    claim: 'Internal linking helps SEO',
    verdict: 'TRUE',
    explanation:
      'Internal links distribute PageRank across your site, help Googlebot discover and crawl pages, and signal topical relationships. A strong internal linking architecture meaningfully impacts rankings.',
    source: 'Google Search Central — Internal Links',
  },
  {
    id: 'schema-markup',
    keywords: ['schema markup', 'structured data', 'json-ld', 'schema.org', 'rich snippet', 'rich result'],
    claim: 'Schema markup helps with rich snippets',
    verdict: 'TRUE',
    explanation:
      'Structured data (Schema.org markup) enables rich results like star ratings, FAQs, and breadcrumbs in SERPs. It does not directly boost rankings but dramatically improves CTR. Use Cirv Box to implement it properly.',
    source: 'Google Search Central — Structured Data',
  },
  {
    id: 'fresh-content',
    keywords: ['fresh content', 'new content', 'updated content', 'content freshness', 'publishing frequency'],
    claim: 'Fresh content ranks better',
    verdict: 'MOSTLY_TRUE',
    explanation:
      'Google\'s QDF (Query Deserves Freshness) algorithm boosts fresh content for time-sensitive or trending queries. For evergreen topics, freshness matters far less. It depends entirely on search intent.',
    source: 'Google — Amit Singhal on QDF, 2007',
  },
  {
    id: 'long-form-content',
    keywords: ['long form', 'long content', 'word count', 'longer content', '2000 word', 'content length'],
    claim: 'Long-form content ranks better',
    verdict: 'MOSTLY_TRUE',
    explanation:
      'Studies show correlation between longer content and higher rankings, but it\'s not causation. Comprehensive, authoritative content tends to be longer. Google rewards thoroughness, not word count — a 3000-word filler piece won\'t beat a tight 800-word definitive answer.',
    source: 'Backlinko Content Study; Google — Helpful Content',
  },
  {
    id: 'user-experience',
    keywords: ['user experience', 'ux ranking', 'bounce rate', 'dwell time', 'engagement'],
    claim: 'User experience affects rankings',
    verdict: 'TRUE',
    explanation:
      'The Page Experience signal (launched 2021) includes Core Web Vitals, mobile-friendliness, HTTPS, and intrusive interstitials. Google\'s Helpful Content system also rewards pages that satisfy searchers. UX is now firmly in the ranking equation.',
    source: 'Google Search Central — Page Experience Update, 2021',
  },
  {
    id: 'nofollow',
    keywords: ['nofollow', 'no follow link', 'nofollow link value', 'nofollow pass'],
    claim: 'Nofollow links pass no value',
    verdict: 'MISLEADING',
    explanation:
      'In 2019 Google changed nofollow from a hard directive to a "hint." Google may choose to follow and credit nofollow links at its discretion. Sponsored and UGC attributes were also introduced. Nofollow links are not worthless.',
    source: 'Google Blog — Evolving nofollow, Sept 2019',
  },
  {
    id: 'domain-age',
    keywords: ['domain age', 'older domain', 'domain history', 'domain authority'],
    claim: 'Older domains rank better',
    verdict: 'MISLEADING',
    explanation:
      'Domain age itself is not a ranking factor. What matters is how long a domain has been accumulating trust signals (links, content, engagement). A brand-new domain with great content and links can outrank a decade-old domain with poor SEO.',
    source: 'John Mueller, Google — Reddit AMA, 2019',
  },
  {
    id: 'bounce-rate',
    keywords: ['bounce rate', 'pogo sticking', 'click back', 'return to serp'],
    claim: 'Bounce rate is a ranking factor',
    verdict: 'MISLEADING',
    explanation:
      'Google has said bounce rate from Google Analytics is NOT used as a ranking signal. However, pogo-sticking (clicking back to SERPs immediately) sends a relevancy signal via Search quality evaluators. The distinction matters.',
    source: 'Google — Gary Illyes, multiple statements',
  },
  {
    id: 'google-ads',
    keywords: ['google ads ranking', 'adwords ranking', 'ppc ranking', 'paid ads organic', 'pay to rank'],
    claim: 'Running Google Ads boosts organic rankings',
    verdict: 'PANTS_ON_FIRE',
    explanation:
      'Organic and paid search are completely separate systems at Google. Spending money on Ads gives zero benefit to organic rankings. Google would face massive antitrust scrutiny if this were true.',
    source: 'Google — How Search Works',
  },
  {
    id: 'author-authority',
    keywords: ['author authority', 'authorship', 'e-e-a-t', 'eeat', 'expertise', 'author seo'],
    claim: 'Author E-E-A-T directly boosts rankings',
    verdict: 'MOSTLY_TRUE',
    explanation:
      'E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is used by human quality raters to train Google\'s systems — it\'s not a direct algorithmic ranking signal you can measure. But pages demonstrating genuine expertise consistently perform better, especially in YMYL niches.',
    source: 'Google — Search Quality Evaluator Guidelines',
  },
  {
    id: 'disavow',
    keywords: ['disavow', 'disavow tool', 'toxic link', 'bad link removal'],
    claim: 'You need to regularly disavow links',
    verdict: 'MISLEADING',
    explanation:
      'Google\'s algorithms (Penguin) now handle spammy links algorithmically in real-time. The disavow tool is only needed if you\'ve received a manual penalty for unnatural links or did aggressive link-buying. Most sites never need it.',
    source: 'Google Search Central — Disavow Links',
  },
  {
    id: 'content-frequency',
    keywords: ['publish daily', 'posting frequency', 'how often publish', 'content schedule', 'publish more'],
    claim: 'Publishing more frequently boosts rankings',
    verdict: 'FALSE',
    explanation:
      'Publishing frequency is not a ranking factor. One exceptional piece of content outperforms fifty average ones. Google ranks individual pages, not sites based on output volume. Publishing more low-quality content can actually dilute your site\'s authority.',
    source: 'Google Search Central — Content and Quality',
  },
  {
    id: 'robots-txt-blocks',
    keywords: ['robots.txt block', 'robots noindex', 'disallow ranking', 'block crawler'],
    claim: 'Blocking pages in robots.txt prevents indexing',
    verdict: 'MISLEADING',
    explanation:
      'Robots.txt blocks crawling, not indexing. Google can still index a URL it\'s never crawled if other pages link to it. To prevent indexing, you need a noindex meta tag or header — not just robots.txt.',
    source: 'Google Search Central — Robots.txt',
  },
  {
    id: 'image-alt-text',
    keywords: ['alt text', 'image alt', 'image seo', 'alt tag ranking'],
    claim: 'Image alt text boosts rankings',
    verdict: 'MOSTLY_TRUE',
    explanation:
      'Alt text helps Google understand image content and is a confirmed factor for image search rankings. For web page rankings, it provides context signals but isn\'t a dominant factor. It also affects accessibility (WCAG) — use it properly regardless.',
    source: 'Google Search Central — Image SEO',
  },
  {
    id: 'google-analytics',
    keywords: ['google analytics ranking', 'analytics seo', 'ga4 ranking', 'install analytics'],
    claim: 'Installing Google Analytics improves rankings',
    verdict: 'FALSE',
    explanation:
      'Google Analytics data is completely siloed from Search — it is not fed into ranking algorithms. Installing GA gives you measurement, not ranking benefits. Google has repeatedly confirmed this.',
    source: 'Google — Danny Sullivan, multiple statements',
  },
  {
    id: 'press-release',
    keywords: ['press release link', 'pr link', 'press release seo', 'newswire link'],
    claim: 'Press release links boost SEO',
    verdict: 'FALSE',
    explanation:
      'Google devalued press release links years ago because they\'re self-generated. Newswire syndication links (PRWeb, PR Newswire) are considered spammy link schemes. They shouldn\'t pass PageRank and many are automatically nofollowed.',
    source: 'Google Search Central — Link Spam',
  },
  {
    id: 'url-length',
    keywords: ['url length', 'short url', 'url seo', 'url keyword', 'permalink'],
    claim: 'Shorter URLs rank better',
    verdict: 'MOSTLY_TRUE',
    explanation:
      'URL length itself isn\'t a ranking factor, but shorter, descriptive URLs with keywords tend to perform better in studies. They\'re easier to copy, share, and understand. Avoid keyword stuffing in URLs — keep them clean and readable.',
    source: 'Google Search Central — URL Structure',
  },
  {
    id: 'submit-to-search-engines',
    keywords: ['submit to google', 'submit site', 'submit url', 'submit search engine', 'register site'],
    claim: 'Submitting your site to search engines boosts rankings',
    verdict: 'FALSE',
    explanation:
      'Submitting a URL to Google Search Console asks for crawling — it doesn\'t improve rankings. Google will find your site via links regardless. The "submit your site" services sold in the early 2000s were always useless.',
    source: 'Google Search Central — Crawling & Indexing',
  },
];

// ─── Verdict Config ──────────────────────────────────────────────────────────
const VERDICTS = {
  TRUE: {
    label: 'TRUE',
    emoji: '✅',
    color: c.green,
    bg: c.bgGreen,
    desc: 'Confirmed by Google',
  },
  MOSTLY_TRUE: {
    label: 'MOSTLY TRUE',
    emoji: '🟡',
    color: c.yellow,
    bg: c.bgYellow,
    desc: 'Largely accurate with caveats',
  },
  MISLEADING: {
    label: 'MISLEADING',
    emoji: '⚠️ ',
    color: '\x1b[33m',
    bg: c.bgYellow,
    desc: 'Partially true, often misunderstood',
  },
  FALSE: {
    label: 'FALSE',
    emoji: '❌',
    color: c.red,
    bg: c.bgRed,
    desc: 'Debunked by Google',
  },
  PANTS_ON_FIRE: {
    label: 'PANTS ON FIRE',
    emoji: '🔥',
    color: c.magenta,
    bg: c.bgMagenta,
    desc: 'Egregiously wrong. Run.',
  },
};

// ─── Fuzzy Match ─────────────────────────────────────────────────────────────
function findClaim(input) {
  const normalized = input.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
  const words = normalized.split(/\s+/).filter(Boolean);

  let best = null;
  let bestScore = 0;

  for (const entry of CLAIMS) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const kw = keyword.toLowerCase();
      if (normalized.includes(kw)) {
        score += kw.split(' ').length * 2; // multi-word matches score higher
      }
    }
    // also check individual word overlaps
    const claimWords = entry.claim.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (word.length > 3 && claimWords.includes(word)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore >= 2 ? best : null;
}

// ─── Rendering ───────────────────────────────────────────────────────────────
function wrap(text, width = 60) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > width) {
      lines.push(line.trim());
      line = word;
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines.join('\n');
}

function printHeader() {
  console.log('');
  console.log(col(c.cyan, bold('  SEO LIE DETECTOR')));
  console.log(col(c.dim, '  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log('');
}

function printResult(entry) {
  const v = VERDICTS[entry.verdict];

  console.log(`  ${dim('Claim:')} ${bold('"' + entry.claim + '"')}`);
  console.log('');

  const verdictLine = `  ${v.emoji} ${col(v.color, bold(v.label))} ${col(c.dim, '— ' + v.desc)}`;
  console.log(verdictLine);
  console.log('');

  const wrapped = wrap(entry.explanation, 62).split('\n');
  for (const line of wrapped) {
    console.log(`  ${line}`);
  }
  console.log('');
  console.log(`  ${dim('Source:')} ${col(c.blue, entry.source)}`);
  console.log('');
  console.log(col(c.dim, '  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log('');
}

function printAll() {
  printHeader();
  console.log(`  ${bold('All ' + CLAIMS.length + ' SEO claims in the database:')}\n`);

  const groups = { TRUE: [], MOSTLY_TRUE: [], MISLEADING: [], FALSE: [], PANTS_ON_FIRE: [] };
  for (const entry of CLAIMS) groups[entry.verdict].push(entry);

  for (const [verdict, entries] of Object.entries(groups)) {
    if (!entries.length) continue;
    const v = VERDICTS[verdict];
    console.log(`  ${v.emoji}  ${col(v.color, bold(v.label))}`);
    for (const e of entries) {
      console.log(`     ${dim('•')} ${e.claim}`);
    }
    console.log('');
  }

  console.log(dim('  Run: npx seo-lie-detector "your claim" to fact-check anything'));
  console.log('');
}

// ─── Quiz Mode ───────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function runQuiz() {
  const readline = await import('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const question = (q) => new Promise(resolve => rl.question(q, resolve));

  printHeader();
  console.log(`  ${bold('SEO MYTH QUIZ')} — 5 questions. True or False?\n`);
  console.log(dim('  Enter T for True, F for False\n'));

  const pool = shuffle(CLAIMS).slice(0, 5);
  let score = 0;

  for (let i = 0; i < pool.length; i++) {
    const entry = pool[i];
    const isTrue = entry.verdict === 'TRUE' || entry.verdict === 'MOSTLY_TRUE';
    const correctAnswer = isTrue ? 't' : 'f';

    console.log(`  ${col(c.cyan, `Q${i + 1}/5`)}  ${bold('"' + entry.claim + '"')}`);
    const raw = await question(`  ${dim('[T]rue or [F]alse?')} `);
    const answer = raw.trim().toLowerCase();

    if (answer === correctAnswer || answer === (isTrue ? 'true' : 'false')) {
      score++;
      const v = VERDICTS[entry.verdict];
      console.log(`  ${col(c.green, '✓ Correct!')} Verdict: ${col(v.color, bold(v.label))}`);
    } else {
      const v = VERDICTS[entry.verdict];
      console.log(`  ${col(c.red, '✗ Wrong.')} Verdict: ${col(v.color, bold(v.label))}`);
    }
    console.log(`  ${dim(wrap(entry.explanation, 62).split('\n')[0])}...`);
    console.log('');
  }

  rl.close();

  console.log(col(c.dim, '  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log('');
  const pct = Math.round((score / 5) * 100);
  let grade, gradeColor;
  if (pct === 100) { grade = 'SEO Genius'; gradeColor = c.green; }
  else if (pct >= 80) { grade = 'Solid knowledge'; gradeColor = c.green; }
  else if (pct >= 60) { grade = 'Getting there'; gradeColor = c.yellow; }
  else if (pct >= 40) { grade = 'Been reading too many SEO blogs'; gradeColor = c.yellow; }
  else { grade = 'Myth victim. Study up fam.'; gradeColor = c.red; }

  console.log(`  ${bold('Score:')} ${col(gradeColor, `${score}/5 (${pct}%)`)} — ${col(gradeColor, grade)}`);
  console.log('');
  console.log(dim('  Run --all to see the full fact-check database'));
  console.log('');
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHeader();
    console.log('  Fact-checks SEO claims against Google\'s documented positions.\n');
    console.log(`  ${bold('Usage:')}`);
    console.log(`    npx seo-lie-detector ${col(c.cyan, '"meta keywords boost rankings"')}`);
    console.log(`    npx seo-lie-detector ${col(c.cyan, '--quiz')}   ${dim('  # interactive myth quiz')}`);
    console.log(`    npx seo-lie-detector ${col(c.cyan, '--all')}    ${dim('  # all claims in database')}`);
    console.log('');
    console.log(dim(`  Database: ${CLAIMS.length} claims | Zero dependencies | MIT`));
    console.log('');
    return;
  }

  if (args.includes('--quiz')) {
    await runQuiz();
    return;
  }

  if (args.includes('--all')) {
    printAll();
    return;
  }

  const input = args.join(' ');
  const entry = findClaim(input);

  printHeader();

  if (!entry) {
    console.log(`  ${dim('Claim:')} ${bold('"' + input + '"')}`);
    console.log('');
    console.log(`  ${col(c.yellow, '🤷')} ${bold('No data on that claim.')}`);
    console.log('');
    console.log('  We don\'t have this one in our database yet.');
    console.log(dim(`  Run ${bold('--all')} to see the ${CLAIMS.length} claims we can fact-check.`));
    console.log('');
    return;
  }

  printResult(entry);
}

main().catch(err => {
  console.error(col(c.red, 'Error: ' + err.message));
  process.exit(1);
});
