const DS = await new Request("https://mikeljungbergtvedt.github.io/tsla-spcx-ratio/data.json?" + Date.now()).loadJSON();
const L = DS.live && DS.live.s ? DS.live : DS.rows[DS.rows.length-1];
const r = L.t / L.s;
const f = (x,d) => x.toFixed(d).replace(".", ",");
const w = new ListWidget();
if (config.runsInAccessoryWidget) {
  const a = w.addText(f(r,3)); a.font = Font.boldSystemFont(34);
} else {
  w.backgroundColor = new Color("#0b0f17");
  const h = w.addText("TSLA / SPCX"); h.font = Font.semiboldSystemFont(12); h.textColor = Color.gray();
  w.addSpacer(6);
  const b = w.addText(f(r,3)); b.font = Font.boldSystemFont(40); b.textColor = Color.white();
}
w.refreshAfterDate = new Date(Date.now() + 5*60*1000);
Script.setWidget(w); Script.complete();
