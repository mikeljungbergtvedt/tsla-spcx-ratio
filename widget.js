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
// Varsel ved hver ny hundredel (2,40 / 2,41 / 2,42 ...)
try {
  const K = "tsla_spcx_bucket";
  const now = Math.floor(r * 100);
  const prevB = Keychain.contains(K) ? parseInt(Keychain.get(K)) : null;
  if (prevB === null) { Keychain.set(K, String(now)); }
  else if (now !== prevB) {
    const n = new Notification();
    n.title = `Bytteforhold ${f(now/100,2)} ${now > prevB ? "↑" : "↓"}`;
    n.body = `${f(t,2)} / ${f(s,2)}`;
    n.openURL = APP;
    await n.schedule();
    Keychain.set(K, String(now));
  }
} catch (e) {}
if (config.widgetFamily && config.widgetFamily.startsWith("accessory")) {
  const a = new ListWidget(); a.url = APP;
  const p = a.addText(`${f(t,2)} / ${f(s,2)}`); p.font = Font.semiboldSystemFont(16); p.minimumScaleFactor = 0.7;
  const b = a.addText(f(r,3)); b.minimumScaleFactor = 0.6; b.font = Font.boldSystemFont(30);
  a.refreshAfterDate = new Date(Date.now() + 15*60*1000);
  Script.setWidget(a); Script.complete(); return;
}
const w = new ListWidget();
w.backgroundColor = new Color("#0b0f14");
w.url = APP;
const h = w.addText("TSLA / SPCX" + (tag ? " · " + tag : "")); h.font = Font.mediumSystemFont(12); h.textColor = new Color("#8a96a3");
w.addSpacer(4);
const big = w.addText(f(r,3)); big.font = Font.boldSystemFont(34);
big.textColor = Color.white();
const ch = w.addText((c>=0?"+":"") + f(c,3) + " i dag"); ch.font = Font.systemFont(13);
ch.textColor = c >= 0 ? new Color("#3ddc84") : new Color("#ff5c5c");
w.addSpacer(6);
const px = w.addText(`TSLA ${f(t,2)} · SPCX ${f(s,2)}`); px.font = Font.systemFont(10); px.textColor = new Color("#8a96a3");
w.refreshAfterDate = new Date(Date.now() + 15*60*1000);
if (config.runsInWidget) Script.setWidget(w); else w.presentSmall();
Script.complete();
