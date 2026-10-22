// TSLA/SPCX bytteforhold – Scriptable-widget
const URL_DATA = "https://mikeljungbergtvedt.github.io/tsla-spcx-ratio/data.json?" + Date.now();
const APP = "https://mikeljungbergtvedt.github.io/tsla-spcx-ratio/";
const L = 2.5;
const D = await new Request(URL_DATA).loadJSON();
const R = D.rows, last = R[R.length-1], prev = R[R.length-2];
let t = last.t, s = last.s, pr = prev;
if (D.live && D.live.t && D.live.s) {
  const ld = new Date(D.live.time*1000).toISOString().slice(0,10);
  if (ld > last.d) { t = D.live.t; s = D.live.s; pr = last; }
}
const r = t/s, c = r - pr.r;
const f = (x,n) => x.toFixed(n).replace(".", ",");
const w = new ListWidget();
w.backgroundColor = new Color("#0b0f14");
w.url = APP;
const h = w.addText("TSLA / SPCX"); h.font = Font.mediumSystemFont(12); h.textColor = new Color("#8a96a3");
w.addSpacer(4);
const big = w.addText(f(r,3)); big.font = Font.boldSystemFont(34);
big.textColor = r >= L ? new Color("#ffd24d") : Color.white();
const ch = w.addText((c>=0?"+":"") + f(c,3) + " i dag"); ch.font = Font.systemFont(13);
ch.textColor = c >= 0 ? new Color("#3ddc84") : new Color("#ff5c5c");
w.addSpacer(6);
const px = w.addText(`TSLA ${f(t,2)} · SPCX ${f(s,2)}`); px.font = Font.systemFont(10); px.textColor = new Color("#8a96a3");
const lv = w.addText(r >= L ? "Over 2,5 – byttenivå" : `Bytt ved ${f(L,1)}`); lv.font = Font.systemFont(10); lv.textColor = new Color("#ffd24d");
w.refreshAfterDate = new Date(Date.now() + 15*60*1000);
if (config.runsInWidget) Script.setWidget(w); else w.presentSmall();
Script.complete();
