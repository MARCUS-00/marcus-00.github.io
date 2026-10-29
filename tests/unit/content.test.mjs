import { test } from "node:test";
import assert from "node:assert/strict";
import { content, validate } from "../../src/content/index.js";

const clone = (o) => structuredClone(o);

test("shipped content passes validation", () => {
  assert.deepEqual(validate(content), []);
});

test("validation rejects broken content with a useful message", () => {
  const c = clone(content);
  c.projects[0].stages.pop(); // featured project with four stages
  c.skills[0].items.push({ name: "Rust", usedIn: ["olist"] });
  c.projects[1].id = c.projects[0].id;
  c.experience[0].project = "missing";
  delete c.education[0].institution;
  const errors = validate(c).join("\n");
  assert.match(errors, /exactly 5 stages/);
  assert.match(errors, /skills do not link to projects \("usedIn"\)/);
  assert.match(errors, /education\[0\]: missing "institution"/);
  assert.match(errors, /duplicate id/);
  assert.match(errors, /project "missing" is not a project id/);
});

test("evidence media needs alt text and dimensions; the old 'missing' field is refused", () => {
  const c = clone(content);
  c.projects[1].evidence.media = { src: "/x.png", alt: "" };
  c.projects[2].evidence.missing = { t: "x" };
  const errors = validate(c).join("\n");
  assert.match(errors, /evidence\.media: needs "src" and descriptive "alt"/);
  assert.match(errors, /evidence\.media: needs pixel "width" and "height"/);
  assert.match(errors, /"missing" was renamed "pending"/);
});

test("validation requires the gate in the Validation column for featured projects", () => {
  const c = clone(content);
  c.projects[0].stages[3].gate = false;
  c.projects[0].stages[4].gate = true;
  assert.match(validate(c).join("\n"), /gate as stage 4/);
});

test("skills are plain names: the inventory carries no project links", () => {
  for (const g of content.skills) for (const s of g.items) assert.deepEqual(Object.keys(s), ["name"], `${g.group}: ${s.name}`);
});

/* Facts that were corrected against the résumé and project repositories must not regress. */
test("factual guards", () => {
  const all = JSON.stringify(content);
  assert.doesNotMatch(all, /knee/i, "OsteoScan uses dental radiographs");
  assert.doesNotMatch(all, /single 28-day window/i, "Olist forecast was walk-forward validated");
  assert.doesNotMatch(all, /not linked yet|will appear here once|confirmed for portfolio use/i, "no note that promises links later");
  assert.doesNotMatch(all, /first numbers? (was|were) wrong|correct my own first numbers/i, "Olist's validation changed a recommendation, not a wrong number");
  assert.doesNotMatch(all, /approached 100%|over 40 points/, "no figures beyond what the project records show");
  /* The capstone report lists four team members; the case study must not read as solo work. */
  const osteoContext = content.projects.find((p) => p.id === "osteoscan").overview.find((o) => o.k === "Context").v;
  assert.match(osteoContext, /four-person capstone/, "OsteoScan was a team capstone");
  /* The only email address and phone number anywhere in the content are the current ones. */
  assert.deepEqual([...new Set(all.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g))], [content.profile.email], "one email address");
  assert.deepEqual([...new Set(all.match(/\+?\d[\d ()-]{8,}\d/g) || [])], [content.profile.phone], "one phone number");
  assert.equal(content.profile.email, "mailtomanojkumar07@gmail.com");
  assert.equal(content.profile.linkedin, "https://www.linkedin.com/in/manoj-kumar-analytics", "confirmed LinkedIn URL");
  assert.doesNotMatch(all, /JB Portals|PES C3I|statsmodels/, "unconfirmed organisation and tool claims stay out");
  /* The dashboard capture is the repository's own screenshot; no published report URL exists. */
  const olist = content.projects.find((p) => p.id === "olist");
  assert.equal(olist.evidence.media.src, "/olist-dashboard-overview.jpg");
  assert.deepEqual([olist.evidence.media.width, olist.evidence.media.height], [1600, 1000]);
  assert.ok(!olist.evidence.pending, "no placeholder once the capture is shown");
  assert.ok(!(olist.evidence.links || []).some((l) => /powerbi|app\.powerbi/i.test(l.href)), "no invented report URL");
  assert.doesNotMatch(all, /wide interval as real demand|leaked patients across folds|panoramic/i, "superseded project wording");
  /* 75,075 is the whole augmented patch set; 37,538 (every second patch) is what the model used.
     Wherever the total appears, the subset must be stated with it as the part used. */
  /* Cross-validation split per fold (notebook cells 14 and 16, N_VAL_SOURCES = 2): 1 test patient;
     of the other 12, 10 fit the weights and 2 drive early stopping. The deployed model is different
     (11 fit, 2 early stopping, no test patient) and is not described as a fold. */
  const ov = content.projects.find((p) => p.id === "osteoscan").validation.body;
  assert.match(ov, /Each of the 13 folds holds out one patient for testing\. Of the 12 that remain, 10 are used to fit the weights and 2 are reserved for early stopping/);
  assert.doesNotMatch(ov, /trains on 12/);
  const data = content.projects.find((p) => p.id === "osteoscan").overview.find((o) => o.k === "Data").v;
  assert.match(data, /75,075 augmented 100×100 patches; every second patch, 37,538 in all, was used for training and evaluation/);
  for (const m of all.matchAll(/[^."]*75,075[^."]*/g)) assert.match(m[0], /37,538/, `total stated without the subset: ${m[0]}`);
  assert.doesNotMatch(all, /0\.594/, "macro-F1 is reported as 0.59");
  assert.doesNotMatch(all, /graduating|student at/i, "degree is described as completed");
  assert.equal(content.profile.role, "Data Analyst");
  assert.doesNotMatch(all, /beat my own forecast|beat the (forecast )?model|lost to a plain seasonal|shipped instead|feeding views/, "superseded Olist wording");
  for (const kw of ["Python", "SQL", "Power BI"]) {
    assert.ok(content.skills.some((g) => g.items.some((s) => s.name === kw)), `${kw} is listed`);
  }
});

/* Exact percentile bootstrap for a k-of-n per-patient accuracy. A resample's number correct is
   Binomial(n, k/n), so its CDF is a ratio of integers: F(j) = sum_{i<=j} C(n,i) k^i (n-k)^(n-i) / n^n.
   The q-quantile is the generalised inverse, Q(q) = min{ j : F(j) >= q }, evaluated without rounding. */
function exactBootstrapInterval(k, n, level = [1n, 40n]) {
  const [a, b] = level; // lower tail a/b; upper point is 1 - a/b
  const choose = (m, r) => { let c = 1n; for (let i = 1n; i <= r; i++) c = (c * (m - r + i)) / i; return c; };
  const N = BigInt(n), K = BigInt(k), den = N ** N;
  const cdf = []; let num = 0n;
  for (let i = 0n; i <= N; i++) { num += choose(N, i) * K ** i * (N - K) ** (N - i); cdf.push(num); }
  const quantile = (qa, qb) => cdf.findIndex((f) => f * qb >= qa * den); // F(j) >= qa/qb
  return { lo: quantile(a, b), hi: quantile(b - a, b), cdf, den };
}

test("the OsteoScan 95% interval is the exact percentile bootstrap of the stated per-patient result", () => {
  const o = content.projects.find((p) => p.id === "osteoscan");
  /* The evaluated result, read from the content itself: 8 of 13 patients, 61.5%. */
  const [, k, n] = JSON.stringify(o.findings).match(/(\d+) of (\d+) patients/).map(Number);
  assert.deepEqual([k, n], [8, 13], "the verified result is 8 of 13");
  assert.ok(o.facts.some((f) => f.k === "Accuracy" && f.v === "61.5%"));

  const { lo, hi, cdf, den } = exactBootstrapInterval(k, n);
  /* Documented values: F(4/13) is just under 2.5%, so the lower point is 5/13, not 4/13. */
  assert.equal(cdf[4], 7420361328125n);
  assert.equal(den, 302875106592253n);
  assert.ok(cdf[4] * 40n < den && cdf[5] * 40n >= den, "F(4/13) < 0.025 <= F(5/13)");
  assert.ok(!cdf.some((f) => f * 40n === den || f * 40n === 39n * den), "no CDF value equals 0.025 or 0.975, so tie conventions agree");
  assert.deepEqual([lo, hi], [5, 11]);

  const pct = (j) => Math.round((1000 * j) / n) / 10; // one decimal place, as published
  const [L, H] = [pct(lo), pct(hi)];
  assert.deepEqual([L, H], [38.5, 84.6]);
  /* Every published statement of the interval is this result. */
  assert.deepEqual(o.validation.band, [L, H]);
  assert.equal(o.facts.find((f) => f.k === "95% interval").v, `${L} – ${H}%`);
  assert.ok(o.findings.some((f) => f.t.includes(`95% bootstrap interval (${L}% to ${H}%)`)), "finding states the interval");
  assert.ok(o.validation.note.startsWith(`The interval runs from ${L}% to ${H}%.`));
  assert.match(o.validation.body, /percentile bootstrap of the 13 per-patient results, computed exactly/);
  /* The superseded single-run Monte Carlo figure is gone, and the low end is described as above chance. */
  assert.doesNotMatch(JSON.stringify(content), /30\.8/);
  assert.ok(L > 33.3 && /barely above chance/.test(o.validation.note));
});
