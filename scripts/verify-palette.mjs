// Maison Tanneurs × BLOC — palette verification.
// Bar = reown's own measured behaviour (DESIGN.md records it); we must not regress.
const hx = (h) => { h = h.replace("#",""); return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255); };
const lin = (c) => (c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4));
const L = (h) => { const [r,g,b] = hx(h).map(lin); return 0.2126*r+0.7152*g+0.0722*b; };
const R = (a,b) => { const [x,y] = [L(a),L(b)].sort((m,n)=>n-m); return (x+0.05)/(y+0.05); };
const say = (n,a,b,min) => {
  const r = R(a,b); const ok = r >= min;
  console.log(`  ${ok?"PASS":"FAIL"}  ${n.padEnd(36)} ${r.toFixed(2)}:1  (min ${min})`);
  if (!ok) process.exitCode = 1;
};

const light = {
  ground:"#a3998c", panel:"#ebe9e4", panelRaised:"#f6f4f1", panelStrong:"#211c17",
  ink:"#1c1a17", inkSoft:"#57534c", inkMuted:"#8d867c", inkInverse:"#f7f6f2",
  tobacco:"#8b5a2b", tobaccoDeep:"#74491f", accentInk:"#8b5a2b",
  rust:"#db6b42", sage:"#7f9d63", brass:"#cc9e3d",
};
const dark = {
  ground:"#100d0a", panel:"#211c17", panelRaised:"#2a241d", panelStrong:"#0f0d0b",
  ink:"#ede9e2", inkSoft:"#c0b9ae", inkMuted:"#8d867c", inkInverse:"#f7f6f2",
  tobacco:"#916030", tobaccoDeep:"#7a4f26", accentInk:"#c9914f",
  rust:"#db6b42", sage:"#7f9d63", brass:"#cc9e3d",
};

console.log("### LIGHT — material ###");
say("ink on panel", light.ink, light.panel, 13.42);            // reown 13.42
say("ink on panel-raised", light.ink, light.panelRaised, 4.5);
say("ink on ground (on-ground furniture)", light.ink, light.ground, 5.79); // reown 5.79
say("ink-soft on panel", light.inkSoft, light.panel, 4.5);
say("ink-muted on panel", light.inkMuted, light.panel, 2.9);
say("ink-inverse on panel-strong", light.inkInverse, light.panelStrong, 4.5);
say("panel vs ground (reown 2.32, known <3)", light.panel, light.ground, 2.25);
console.log("### LIGHT — accents (pills carry ink; primary carries ivory) ###");
say("ink on rust pill", light.ink, light.rust, 4.5);
say("ink on sage pill", light.ink, light.sage, 4.5);
say("ink on brass pill", light.ink, light.brass, 4.5);
say("ivory on tobacco (primary fill)", light.inkInverse, light.tobacco, 4.5);
say("ivory on tobacco-deep (pressed)", light.inkInverse, light.tobaccoDeep, 4.5);
say("accent-ink as link on panel", light.accentInk, light.panel, 4.5);
say("accent-ink as link on panel-raised", light.accentInk, light.panelRaised, 4.5);
say("tobacco fill vs panel (component edge)", light.tobacco, light.panel, 3);

console.log("\n### DARK — material ###");
say("ink on panel", dark.ink, dark.panel, 4.5);
say("ink on panel-raised", dark.ink, dark.panelRaised, 4.5);
say("ink on ground", dark.ink, dark.ground, 4.5);
say("ink-soft on panel", dark.inkSoft, dark.panel, 4.5);
say("ink-muted on panel", dark.inkMuted, dark.panel, 2.9);
say("ink-inverse on panel-strong", dark.inkInverse, dark.panelStrong, 4.5);
say("panel vs ground (reown dark 1.13)", dark.panel, dark.ground, 1.13);
console.log("### DARK — accents ###");
say("ink on rust pill", light.ink, dark.rust, 4.5);
say("ink on sage pill", light.ink, dark.sage, 4.5);
say("ink on brass pill", light.ink, dark.brass, 4.5);
say("ivory on tobacco (primary fill)", dark.inkInverse, dark.tobacco, 4.5);
say("accent-ink as link on panel", dark.accentInk, dark.panel, 4.5);
say("accent-ink as link on panel-raised", dark.accentInk, dark.panelRaised, 4.5);
say("tobacco fill vs panel (component edge)", dark.tobacco, dark.panel, 3);

console.log(process.exitCode ? "\n*** SOME CHECKS FAILED ***" : "\nALL CHECKS PASS");
