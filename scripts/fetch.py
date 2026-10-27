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
def ext(sym):
    try:
        req=urllib.request.Request(f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}?range=1d&interval=1m&includePrePost=true",headers={"User-Agent":"Mozilla/5.0"})
        r=json.load(urllib.request.urlopen(req,timeout=30))["chart"]["result"][0]
        pts=[(t,c) for t,c in zip(r.get("timestamp") or [],r["indicators"]["quote"][0]["close"]) if c is not None]
        return pts[-1] if pts else (0,None)
    except Exception: return (0,None)
t,tm=get("TSLA"); s,sm=get("SPCX")
rows=[{"d":d,"t":t[d],"s":s[d],"r":round(t[d]/s[d],4)} for d in sorted(s) if d in t]
lt,ls=tm.get("regularMarketPrice"),sm.get("regularMarketPrice")
ltime=max(tm.get("regularMarketTime",0),sm.get("regularMarketTime",0)); tag=""
et,ep=ext("TSLA"); es,eq=ext("SPCX")
if ep and eq and min(et,es)>ltime+60:
    lt,ls,ltime=round(ep,2),round(eq,2),max(et,es)
    h=datetime.datetime.fromtimestamp(ltime,datetime.timezone.utc).hour
    tag="førbørs" if h<14 else "etterbørs"
LIVE={"t":lt,"s":ls,"time":ltime,"tag":tag}
try:
    _f,_fm=get("NOK=X"); FX=round(_fm["regularMarketPrice"],4)
except Exception: FX=None
SW={"fx":FX}
if FX:
    _as=(5000*(ls-150.4408)+2000*(385.455-lt))*FX; _z=(6500*(ls-148.98)+2500*(389.80-lt))*FX
    SW.update({"as":round(_as),"zero":round(_z),"kr":round(_as+_z)})
json.dump({"updated":datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
 "live":LIVE,"swap":SW,
 "rows":rows},open("data.json","w"),separators=(",",":"))
print(rows[0],rows[-1],len(rows))
