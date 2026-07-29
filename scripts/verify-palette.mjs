// Maison Tanneurs × BLOC — palette verification.
// Bar = reown's own measured behaviour (DESIGN.md records it); we must not regress.
// Run after ANY token change in src/index.css. Exits non-zero on a regression.
const hx = (h) => { h = h.replace("#",""); return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255); };
const lin = (c) => (c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4));
const L = (h) => { const [r,g,b] = hx(h).map(lin); return 0.2126*r+0.7152*g+0.0722*b; };
const R = (a,b) => { const [x,y] = [L(a),L(b)].sort((m,n)=>n-m); return (x+0.05)/(y+0.05); };
const say = (n,a,b,min) => {
  const r = R(a,b); const ok = r >= min;
  console.log(`  ${ok?"PASS":"FAIL"}  ${n.padEnd(38)} ${r.toFixed(2)}:1  (min ${min})`);
  if (!ok) process.exitCode = 1;
};

const light = {
  ground:"#979490", panel:"#ffffff", panelRaised:"#f6f4f1", panelStrong:"#211c17",
  ink:"#1c1a17", inkSoft:"#57534c", inkMuted:"#8d867c",
  inkInverse:"#ffffff", inkMutedInverse:"#9a9289", input:"#e9e9e7",
  tobacco:"#8b5a2b", tobaccoDeep:"#74491f", accentInk:"#8b5a2b",
  rust:"#db6b42", sage:"#7f9d63", brass:"#cc9e3d", clay:"#b89073", stone:"#c6c0b6",
  sageInk:"#4a5c37", rustInk:"#a4441f",
};
const dark = {
  ground:"#100d09", panel:"#211c17", panelRaised:"#2a241d", panelStrong:"#0f0c09",
  ink:"#ffffff", inkSoft:"#c8c2b8", inkMuted:"#8d867c",
  inkInverse:"#ffffff", inkMutedInverse:"#9a9289", input:"#453c31",
  tobacco:"#916030", tobaccoDeep:"#7a4f26", accentInk:"#c9914f",
  rust:"#db6b42", sage:"#7f9d63", brass:"#cc9e3d", clay:"#b89073", stone:"#c6c0b6",
  sageInk:"#a8c48a", rustInk:"#e89372",
};
const ON_ACCENT = "#1c1a17"; // fixed in both modes — pills keep a light fill after dark

console.log("### LIGHT — material ###");
say("ink on panel", light.ink, light.panel, 13.42);              // reown 13.42
say("ink on panel-raised", light.ink, light.panelRaised, 4.5);
say("ink on ground (on-ground furniture)", light.ink, light.ground, 4.5);
say("ink-soft on panel", light.inkSoft, light.panel, 4.5);
say("ink-muted on panel", light.inkMuted, light.panel, 2.9);
say("ink-inverse on panel-strong", light.inkInverse, light.panelStrong, 4.5);
say("ink-muted-inverse on panel-strong", light.inkMutedInverse, light.panelStrong, 4.5);
// White panels clear the 3:1 WCAG 1.4.11 asks of component boundaries — the
// earlier cream-panel build could not, and reown.com itself does not.
say("panel vs ground (WCAG 1.4.11)", light.panel, light.ground, 3);
say("panel-raised vs ground", light.panelRaised, light.ground, 2.5);
say("input vs panel", light.input, light.panel, 1.15);
say("ink on input", light.ink, light.input, 4.5);

console.log("### LIGHT — accents (pills carry on-accent; primary carries ivory) ###");
say("on-accent on rust pill", ON_ACCENT, light.rust, 4.5);
say("on-accent on sage pill", ON_ACCENT, light.sage, 4.5);
say("on-accent on brass pill", ON_ACCENT, light.brass, 4.5);
say("on-accent on clay pill", ON_ACCENT, light.clay, 4.5);
say("on-accent on stone pill", ON_ACCENT, light.stone, 4.5);
say("ivory on tobacco (primary fill)", light.inkInverse, light.tobacco, 4.5);
say("ivory on tobacco-deep (pressed)", light.inkInverse, light.tobaccoDeep, 4.5);
say("accent-ink as link on panel", light.accentInk, light.panel, 4.5);
say("accent-ink as link on panel-raised", light.accentInk, light.panelRaised, 4.5);
say("sage-ink as type on panel", light.sageInk, light.panel, 4.5);
say("rust-ink as type on panel", light.rustInk, light.panel, 4.5);
say("tobacco fill vs panel (component edge)", light.tobacco, light.panel, 3);
say("rust pill vs panel", light.rust, light.panel, 3);
say("sage pill vs panel", light.sage, light.panel, 3);

console.log("\n### DARK — material ###");
say("ink on panel", dark.ink, dark.panel, 4.5);
say("ink on panel-raised", dark.ink, dark.panelRaised, 4.5);
say("ink on ground", dark.ink, dark.ground, 4.5);
say("ink-soft on panel", dark.inkSoft, dark.panel, 4.5);
say("ink-muted on panel", dark.inkMuted, dark.panel, 2.9);
say("ink-inverse on panel-strong", dark.inkInverse, dark.panelStrong, 4.5);
say("panel vs ground (reown dark 1.13)", dark.panel, dark.ground, 1.13);
say("input vs panel", dark.input, dark.panel, 1.15);
say("ink on input", dark.ink, dark.input, 4.5);

console.log("### DARK — accents ###");
say("on-accent on rust pill", ON_ACCENT, dark.rust, 4.5);
say("on-accent on sage pill", ON_ACCENT, dark.sage, 4.5);
say("on-accent on brass pill", ON_ACCENT, dark.brass, 4.5);
say("on-accent on clay pill", ON_ACCENT, dark.clay, 4.5);
say("on-accent on stone pill", ON_ACCENT, dark.stone, 4.5);
say("ivory on tobacco (primary fill)", dark.inkInverse, dark.tobacco, 4.5);
say("accent-ink as link on panel", dark.accentInk, dark.panel, 4.5);
say("accent-ink as link on panel-raised", dark.accentInk, dark.panelRaised, 4.5);
say("sage-ink as type on panel", dark.sageInk, dark.panel, 4.5);
say("rust-ink as type on panel", dark.rustInk, dark.panel, 4.5);
say("tobacco fill vs panel (component edge)", dark.tobacco, dark.panel, 3);

console.log(process.exitCode ? "\n*** SOME CHECKS FAILED ***" : "\nALL CHECKS PASS");
