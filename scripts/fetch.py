import json, urllib.request, datetime
def get(s):
    req=urllib.request.Request(f"https://query1.finance.yahoo.com/v8/finance/chart/{s}?range=2y&interval=1d",headers={"User-Agent":"Mozilla/5.0"})
    r=json.load(urllib.request.urlopen(req,timeout=30))["chart"]["result"][0]
    out={}
    for t,c in zip(r["timestamp"],r["indicators"]["quote"][0]["close"]):
        if c is None: continue
        d=datetime.datetime.fromtimestamp(t+r["meta"].get("gmtoffset",-14400),datetime.timezone.utc).date().isoformat()
        out[d]=round(c,2)
    m=r["meta"]
    return out,m
t,tm=get("TSLA"); s,sm=get("SPCX")
rows=[{"d":d,"t":t[d],"s":s[d],"r":round(t[d]/s[d],4)} for d in sorted(s) if d in t]
json.dump({"updated":datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
 "live":{"t":tm.get("regularMarketPrice"),"s":sm.get("regularMarketPrice"),"time":max(tm.get("regularMarketTime",0),sm.get("regularMarketTime",0))},
 "rows":rows},open("data.json","w"),separators=(",",":"))
print(rows[0],rows[-1],len(rows))
