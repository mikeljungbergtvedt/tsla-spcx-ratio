// TSLA/SPCX – henter alltid nyeste widget-kode automatisk. Lim inn én gang.
const code = await new Request("https://mikeljungbergtvedt.github.io/tsla-spcx-ratio/widget.js?" + Date.now()).loadString();
await eval("(async () => {" + code + "})()");
