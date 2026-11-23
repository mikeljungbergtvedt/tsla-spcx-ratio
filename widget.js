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
// Kjøpt 09.11: ratio 359/136. Kr = urealisert på dagens kjøp: Mike AS 2005 TSLA@358,97 + 5000 SPCX@135,63; Zero 1325 TSLA@359,00 + 3500 SPCX@135,93
const BR = 359/136;
const SWfx = D.swap && D.swap.fx;
const SWkr = SWfx ? ((2005*(t-358.97)+5000*(s-135.63)) + (1325*(t-359.00)+3500*(s-135.93)))*SWfx : null;
const SWtxt = "";
const SWcol = SWkr !== null && SWkr < 0 ? new Color("#ff5c5c") : new Color("#3ddc84");
// Varsler slått av 27.10.2026
if (config.widgetFamily && config.widgetFamily.startsWith("accessory")) {
  const a = new ListWidget(); a.url = APP;
  const p = a.addText(`${f(t,2)} / ${f(s,2)}`);
  p.font = Font.boldSystemFont(28);
  p.minimumScaleFactor = 0.5;
  a.refreshAfterDate = new Date(Date.now() + 5*60*1000);
  Script.setWidget(a); Script.complete(); return;
}
const w = new ListWidget();
w.backgroundColor = new Color("#0b0f14");
w.url = APP;
const h = w.addText("Tesla / SpaceX" + (tag ? " · " + tag : ""));
h.font = Font.mediumSystemFont(11);
h.textColor = new Color("#8a96a3");
w.addSpacer(6);
const px = w.addText(`${f(t,2)} / ${f(s,2)}`);
px.font = Font.boldSystemFont(30);
px.textColor = Color.white();
px.minimumScaleFactor = 0.7;
w.refreshAfterDate = new Date(Date.now() + 5*60*1000);
if (config.runsInWidget) Script.setWidget(w); else w.presentSmall();
Script.complete();
