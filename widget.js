// TSLA/SPCX bytteforhold – Scriptable-widget
const URL_DATA = "https://mikeljungbergtvedt.github.io/tsla-spcx-ratio/data.json?" + Date.now();
const APP = "https://mikeljungbergtvedt.github.io/tsla-spcx-ratio/";
const L = 2.5;
const D = await new Request(URL_DATA).loadJSON();
const R = D.rows, last = R[R.length-1], prev = R[R.length-2];
let t = last.t, s = last.s, pr = prev, tag = "";
if (D.live && D.live.t && D.live.s) {
  const ld = new Date(D.live.time*1000).toISOString().slice(0,10);
  if (ld > last.d) { t = D.live.t; s = D.live.s; pr = last; tag = D.live.tag || ""; }
}
const r = t/s, c = r - pr.r;
const f = (x,n) => x.toFixed(n).replace(".", ",");
// Byttet 22.10 – ren trade i kr: Mike AS 5000 SPCX@150,4408 / -2000 TSLA@385,455; Zero 3000@150,2098 / -1250@385,516
const SWfx = D.swap && D.swap.fx;
const SWkr = SWfx ? ((5000*(s-150.4408)+2000*(385.455-t)) + (3000*(s-150.2098)+1250*(385.516-t)))*SWfx : null;
const SWtxt = SWkr === null ? "" : (SWkr>=0?"+":"−") + Math.round(Math.abs(SWkr)/1000) + "k";
const SWcol = SWkr !== null && SWkr < 0 ? new Color("#ff5c5c") : new Color("#3ddc84");
// Varsel ved hver ny tidel (2,4 / 2,5 / 2,6 ...)
try {
  const K = "tsla_spcx_bucket10";
  const now = Math.floor(r * 10);
  const prevB = Keychain.contains(K) ? parseInt(Keychain.get(K)) : null;
  if (prevB === null) { Keychain.set(K, String(now)); }
  else if (now !== prevB) {
    const n = new Notification();
    n.title = `Bytteforhold ${f(now/10,1)} ${now > prevB ? "↑" : "↓"}`;
    n.body = `${f(t,2)} / ${f(s,2)}`;
    n.openURL = APP;
    await n.schedule();
    Keychain.set(K, String(now));
  }
} catch (e) {}
if (config.widgetFamily && config.widgetFamily.startsWith("accessory")) {
  const a = new ListWidget(); a.url = APP;
  const p = a.addText(`${f(t,2)} / ${f(s,2)}`);
  p.font = Font.boldSystemFont(22);
  p.minimumScaleFactor = 0.55;
  a.addSpacer(2);
  const row = a.addStack(); row.centerAlignContent();
  const b = row.addText(f(r,3));
  b.font = Font.boldSystemFont(28);
  b.minimumScaleFactor = 0.55;
  if (SWtxt) { row.addSpacer(8); const k = row.addText(SWtxt); k.font = Font.boldSystemFont(22); k.textColor = SWcol; k.minimumScaleFactor = 0.55; }
  a.refreshAfterDate = new Date(Date.now() + 15*60*1000);
  Script.setWidget(a); Script.complete(); return;
}
const w = new ListWidget();
w.backgroundColor = new Color("#0b0f14");
w.url = APP;
const h = w.addText("TSLA / SPCX" + (tag ? " · " + tag : ""));
h.font = Font.mediumSystemFont(11);
h.textColor = new Color("#8a96a3");
w.addSpacer(6);
const px = w.addText(`${f(t,2)} / ${f(s,2)}`);
px.font = Font.boldSystemFont(22);
px.textColor = Color.white();
px.minimumScaleFactor = 0.7;
w.addSpacer(4);
const big = w.addText(f(r,3));
big.font = Font.boldSystemFont(36);
big.textColor = Color.white();
const ch = w.addText((c>=0?"+":"") + f(c,3) + " i dag" + (SWtxt ? " · byttet " + SWtxt : ""));
ch.font = Font.systemFont(13);
ch.textColor = c >= 0 ? new Color("#3ddc84") : new Color("#ff5c5c");
w.refreshAfterDate = new Date(Date.now() + 15*60*1000);
if (config.runsInWidget) Script.setWidget(w); else w.presentSmall();
Script.complete();
