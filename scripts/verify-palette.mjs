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
  action:"#c2188c", actionDeep:"#a5127a", accentInk:"#b81486",
  coral:"#e36b53", green:"#50a96c", yellow:"#f4bb40", blue:"#559be8", stone:"#c6c0b6",
  greenInk:"#2f7a4d", coralInk:"#c0442a", blueInk:"#2b6cb8",
};
const dark = {
  ground:"#100d09", panel:"#211c17", panelRaised:"#2a241d", panelStrong:"#0f0c09",
  ink:"#ffffff", inkSoft:"#c8c2b8", inkMuted:"#8d867c",
  inkInverse:"#ffffff", inkMutedInverse:"#9a9289", input:"#453c31",
  action:"#d6219c", actionDeep:"#c2188c", accentInk:"#f27cc7",
  coral:"#e36b53", green:"#50a96c", yellow:"#f4bb40", blue:"#559be8", stone:"#c6c0b6",
  greenInk:"#8fd3a8", coralInk:"#f0937c", blueInk:"#85bdf5",
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

console.log("### LIGHT — accents (pills carry on-accent; action carries white) ###");
say("on-accent on coral pill", ON_ACCENT, light.coral, 4.5);
say("on-accent on green pill", ON_ACCENT, light.green, 4.5);
say("on-accent on yellow pill", ON_ACCENT, light.yellow, 4.5);
say("on-accent on blue pill", ON_ACCENT, light.blue, 4.5);
say("on-accent on stone pill", ON_ACCENT, light.stone, 4.5);
say("white on action (primary fill)", light.inkInverse, light.action, 4.5);
say("white on action-deep (pressed)", light.inkInverse, light.actionDeep, 4.5);
say("accent-ink as link on panel", light.accentInk, light.panel, 4.5);
say("accent-ink as link on panel-raised", light.accentInk, light.panelRaised, 4.5);
say("green-ink as type on panel", light.greenInk, light.panel, 4.5);
say("coral-ink as type on panel", light.coralInk, light.panel, 4.5);
say("blue-ink as type on panel", light.blueInk, light.panel, 4.5);
say("action fill vs panel (component edge)", light.action, light.panel, 3);
say("coral pill vs panel", light.coral, light.panel, 3);
say("blue pill vs panel", light.blue, light.panel, 2.8);
say("green pill vs panel", light.green, light.panel, 2.8);

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
say("on-accent on coral pill", ON_ACCENT, dark.coral, 4.5);
say("on-accent on green pill", ON_ACCENT, dark.green, 4.5);
say("on-accent on yellow pill", ON_ACCENT, dark.yellow, 4.5);
say("on-accent on blue pill", ON_ACCENT, dark.blue, 4.5);
say("on-accent on stone pill", ON_ACCENT, dark.stone, 4.5);
say("white on action (primary fill)", dark.inkInverse, dark.action, 4.5);
say("accent-ink as link on panel", dark.accentInk, dark.panel, 4.5);
say("accent-ink as link on panel-raised", dark.accentInk, dark.panelRaised, 4.5);
say("green-ink as type on panel", dark.greenInk, dark.panel, 4.5);
say("coral-ink as type on panel", dark.coralInk, dark.panel, 4.5);
say("blue-ink as type on panel", dark.blueInk, dark.panel, 4.5);
say("action fill vs panel (component edge)", dark.action, dark.panel, 3);

console.log(process.exitCode ? "\n*** SOME CHECKS FAILED ***" : "\nALL CHECKS PASS");
