// TSLA/ZAP trade-resultat i kr – Scriptable-widget
const URL_DATA = "https://mikeljungbergtvedt.github.io/tsla-spcx-ratio/zap-tsla.json?" + Date.now();
const APP = "https://mikeljungbergtvedt.github.io/tsla-spcx-ratio/zap-tsla.html";
const D = await new Request(URL_DATA).loadJSON();
const t = D.t, z = D.z, P = D.pnl.total;
const f = (x,n) => x.toFixed(n).replace(".", ",");
const k = x => (x>=0?"+":"−") + f(Math.abs(x)/1000,0) + "k";
const col = P >= 0 ? new Color("#3ddc84") : new Color("#ff5c5c");
// Varsel ved hver ny hele 100k kr-terskel
try {
  const K = "zap_tsla_pnl100k";
  const now = Math.floor(P / 100000);
  const prevB = Keychain.contains(K) ? parseInt(Keychain.get(K)) : null;
  if (prevB === null) { Keychain.set(K, String(now)); }
  else if (now !== prevB) {
    const n = new Notification();
    n.title = `ZAP/TSLA ${k(now*100000)} ${now > prevB ? "↑" : "↓"}`;
    n.body = `${f(t,2)} / ${f(z,2)} · ${k(P)} kr`;
    n.openURL = APP;
    await n.schedule();
    Keychain.set(K, String(now));
  }
} catch (e) {}
if (config.widgetFamily && config.widgetFamily.startsWith("accessory")) {
  const a = new ListWidget(); a.url = APP;
  const p = a.addText(`${f(t,2)} / ${f(z,2)}`);
  p.font = Font.boldSystemFont(22);
  p.minimumScaleFactor = 0.55;
  a.addSpacer(2);
  const b = a.addText(k(P));
  b.font = Font.boldSystemFont(28);
  b.minimumScaleFactor = 0.55;
  a.refreshAfterDate = new Date(Date.now() + 15*60*1000);
  Script.setWidget(a); Script.complete(); return;
}
const w = new ListWidget();
w.backgroundColor = new Color("#0b0f14");
w.url = APP;
const h = w.addText("TSLA / ZAP");
h.font = Font.mediumSystemFont(11);
h.textColor = new Color("#8a96a3");
w.addSpacer(6);
const px = w.addText(`${f(t,2)} / ${f(z,2)}`);
px.font = Font.boldSystemFont(22);
px.textColor = Color.white();
px.minimumScaleFactor = 0.7;
w.addSpacer(4);
const big = w.addText(k(P));
big.font = Font.boldSystemFont(36);
big.textColor = col;
const ch = w.addText(`ZAP ${k(D.pnl.zap)} · TSLA ${k(D.pnl.tsla)}`);
ch.font = Font.systemFont(13);
ch.textColor = new Color("#8a96a3");
w.refreshAfterDate = new Date(Date.now() + 15*60*1000);
if (config.runsInWidget) Script.setWidget(w); else w.presentSmall();
Script.complete();
