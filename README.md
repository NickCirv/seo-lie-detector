# SEO Lie Detector 🔥

```
  SEO LIE DETECTOR
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Claim: "meta keywords boost rankings"

  🔥 PANTS ON FIRE — Egregiously wrong. Run.

  Google stopped using the meta keywords tag in September
  2009. Matt Cutts confirmed this publicly. Using it won't
  hurt you, but it won't help either.

  Source: Google Webmaster Blog, Sept 2009

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Fact-checks SEO claims against Google's documented positions. Zero dependencies. Works instantly with `npx`.

---

## Usage

```bash
# Fact-check any claim
npx seo-lie-detector "meta keywords boost rankings"
npx seo-lie-detector "backlinks don't matter anymore"
npx seo-lie-detector "social signals affect rankings"

# Interactive myth quiz (5 questions, scored)
npx seo-lie-detector --quiz

# See all 31 claims in the database
npx seo-lie-detector --all
```

---

## Verdict Scale

| Verdict | Meaning |
|---|---|
| ✅ TRUE | Confirmed by Google |
| 🟡 MOSTLY TRUE | Largely accurate with caveats |
| ⚠️ MISLEADING | Partially true, often misunderstood |
| ❌ FALSE | Debunked by Google |
| 🔥 PANTS ON FIRE | Egregiously wrong. Run. |

---

## Example Verdicts

```bash
npx seo-lie-detector "page speed affects rankings"
# ✅ TRUE — Core Web Vitals are a confirmed ranking factor since 2021.

npx seo-lie-detector "keyword density matters"
# ❌ FALSE — Google uses semantic understanding, not keyword counting.

npx seo-lie-detector "buying links helps seo"
# 🔥 PANTS ON FIRE — Violates Google guidelines. Can get you deindexed.

npx seo-lie-detector "duplicate content penalty"
# ⚠️ MISLEADING — No penalty, but Google picks a canonical and drops the rest.

npx seo-lie-detector "fresh content ranks better"
# 🟡 MOSTLY TRUE — Only for time-sensitive queries via QDF algorithm.
```

---

## Claims Database (31 entries)

Covers: meta keywords, keyword density, duplicate content, link buying, EMD, social signals, sitemaps, meta descriptions, H1 tags, page speed, HTTPS, mobile-first, backlinks, internal linking, schema markup, content freshness, long-form content, UX signals, nofollow, domain age, bounce rate, Google Ads, E-E-A-T, disavow, publishing frequency, robots.txt, image alt text, Google Analytics, press releases, URL length, search engine submission.

---

## You Might Also Like

Need help implementing **Schema.org structured data** correctly?

- **[Cirv Box](https://wordpress.org/plugins/cirv-box/)** — Free WordPress plugin for Schema markup. Implements JSON-LD automatically with zero coding.
- More tools at **[github.com/NickCirv](https://github.com/NickCirv)**

---

## Install Locally

```bash
npm install -g seo-lie-detector
seo-lie-detector "social signals affect rankings"
```

---

## Why This Exists

SEO is full of myths recycled by agencies charging £5k/month. This tool gives developers, founders, and marketers a quick reality check — sourced from Google's own documentation and confirmed statements from Google engineers.

---

## License

MIT — use it, fork it, build on it.
