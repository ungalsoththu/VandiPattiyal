#!/usr/bin/env python3
"""
Refresh public/FleetList.csv from the operations platform (fleet register + duty registers).

Usage:
  export FLEET_USERNAME=<duty-register portal username>
  export FLEET_PASSWORD=<duty-register portal password>
  python3 scripts/refresh.py

What it does:
  1. Logs into the operations platform and fetches the current fleet register
     (vehicle master) and the duty registers (logsheets) for the last 60 days.
  2. Derives, per bus: Last Operated Date and KM Operated for the last full month.
  3. Writes public/FleetList.csv (same column order as the deployed site expects,
     plus the two derived columns at the end).

Read-only: the script only performs login and report queries — it never mutates
anything on the platform.

Environment variables:
  FLEET_USERNAME / FLEET_PASSWORD  credentials for the operations portal
  FLEET_BASE_URL                   optional override (default: https://mtcbusits.in)
"""
import csv, json, os, sys, time, urllib.request, urllib.parse
from collections import defaultdict
from datetime import date, timedelta

BASE = os.environ.get("FLEET_BASE_URL", "https://mtcbusits.in").rstrip("/")
API = BASE.replace("://", "://api.")  # fleet register + duty register APIs live on the api. host
USER = os.environ.get("FLEET_USERNAME")
PASSWORD = os.environ.get("FLEET_PASSWORD")
CLIENT_ID = 12

def http(url, data=None, headers=None, timeout=180):
    req = urllib.request.Request(url, data=json.dumps(data).encode() if data is not None else None,
                                 headers={"Content-Type": "application/json", **(headers or {})})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, json.loads(r.read().decode())

def login():
    """Portal login (captcha must be solved by a human in the browser; this helper
    expects the post-login authToken/refreshToken via FLEET_AUTH_TOKEN /
    FLEET_AUTH_REFRESH env vars instead, if direct password login is unavailable)."""
    tok, ref = os.environ.get("FLEET_AUTH_TOKEN"), os.environ.get("FLEET_AUTH_REFRESH")
    if tok and ref:
        return {"authToken": tok, "refreshToken": ref}
    if USER and PASSWORD:
        # password login requires the portal captcha flow; consult README
        raise SystemExit("Password login needs the portal captcha — set FLEET_AUTH_TOKEN / "
                         "FLEET_AUTH_REFRESH from a logged-in browser session instead.")
    raise SystemExit("Set FLEET_AUTH_TOKEN and FLEET_AUTH_REFRESH (logged-in session headers).")

def get(url, auth):
    status, body = http(url, None, auth, timeout=300)
    if status != 200:
        raise RuntimeError(f"{status} on {url}")
    d = body.get("Data")
    return json.loads(d) if isinstance(d, str) and d not in ("null", "") else (d or [])

def post(url, payload, auth, timeout=300):
    status, body = http(url, payload, auth, timeout=timeout)
    if status != 200:
        raise RuntimeError(f"{status} on {url}")
    d = body.get("Data")
    return json.loads(d) if isinstance(d, str) and d not in ("null", "") else (d or [])

def to_dmy(v):
    if not v: return ""
    try:
        y, mo, d = str(v)[:10].split("-"); return f"{d}-{mo}-{y}"
    except ValueError:
        return str(v)

def main():
    auth = login()
    today = date.today()
    window_start = today - timedelta(days=60)

    print("fetching fleet register …", flush=True)
    fleet = post(f"{API}/master/Vehicle/GetVehicleData",
                 {"lan": "en", "datetimeformat": "dd/mm/yyyy", "clientId": CLIENT_ID}, auth)

    print(f"fetching duty registers {window_start} → {today - timedelta(days=1)} …", flush=True)
    last_op, month_km = {}, defaultdict(float)
    month_prefix = f"{today.year}-{today.month - 1:02d}" if today.month > 1 else f"{today.year - 1}-12"
    d = window_start
    ev_like = set()
    while d < today:
        iso = d.isoformat()
        rows = post(f"{API}/avls/LogsheetCapturing/GetLogsheetCapturingData",
                    {"clientId": CLIENT_ID, "logsheetStartDate": iso, "logsheetEndDate": iso,
                     "schduleType": "", "parameter": "", "value": ""}, auth, timeout=240)
        for r in rows or []:
            fn = r.get("vehicleno")
            if not fn: continue
            if iso > (last_op.get(fn) or ""): last_op[fn] = iso
            if iso.startswith(month_prefix):
                try: month_km[fn] += float(r.get("schedulekm"))
                except (TypeError, ValueError): pass
        d += timedelta(days=1)

    out = os.path.join(os.path.dirname(__file__), "..", "public", "FleetList.csv")
    with open(out, "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["Depot","Fleet Number","Vehicle Registration Number","Vehicle Make","Vehicle Model",
                    "Vehicle Operator","is AC?","Service Type","Registration Date","Status",
                    "Last Operated Date",f"KM Operated ({month_prefix})"])
        for v in fleet:
            fn = v.get("fleetnumber") or ""
            w.writerow([
                v.get("depot") or "", fn, v.get("vehicleregno") or "",
                v.get("makename") or "", v.get("modelname") or "",
                v.get("vehicleoperatorname") or "",
                "Yes" if v.get("is_ac") in (True, "True", "true", "ON") else "No",
                v.get("servicetype") or "", to_dmy(v.get("registrationdate")),
                "Active" if v.get("isactive") in (True, "True", "true") else "Inactive",
                last_op.get(fn, ""), round(month_km[fn]) if fn in month_km else "",
            ])
    print(f"written {out} — {len(fleet)} buses; last-operated known for {len(last_op)}")

if __name__ == "__main__":
    main()
