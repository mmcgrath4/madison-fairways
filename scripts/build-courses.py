#!/usr/bin/env python3
"""Rebuild data/courses.json from the OpenGolfAPI US CSV (ODbL)."""

from __future__ import annotations

import csv
import gzip
import json
import os
import re
import urllib.request
from datetime import datetime, timezone
from io import TextIOWrapper

CSV_URL = "https://github.com/opengolfapi/data/raw/main/opengolfapi-us.csv.gz"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PATH = os.path.join(ROOT, "data", "courses.json")
CACHE_PATH = os.path.join("/tmp", "opengolfapi-us.csv.gz")


def parse_int(value: str | None) -> int | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    try:
        return int(float(text))
    except ValueError:
        return None


def clean_name(name: str) -> str:
    cleaned = name.replace("™", "").replace("®", "").replace("©", "")
    cleaned = re.sub(r"tm$", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bTpc\b", "TPC", cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def derive_holes(row: dict[str, str], par: int | None) -> int | None:
    # Upstream `holes` is often "scorecard rows filled", not 9/18. Infer from par.
    filled = sum(1 for i in range(1, 19) if (row.get(f"hole_{i}_par") or "").strip())
    if par is not None:
        if 27 <= par <= 40:
            return 9
        if 50 <= par <= 80:
            return 18
        if 100 <= par <= 120:
            return 27
        if 135 <= par <= 160:
            return 36
    if filled in {9, 18, 27, 36}:
        return filled
    if filled >= 15:
        return 18
    if filled >= 7:
        return 9
    return None


def access_and_kind(raw_type: str | None) -> tuple[str, str | None]:
    raw = (raw_type or "").strip()
    text = raw.lower().replace("_", " ").replace("-", " ")
    if not text or text in {"n/a", "na"} or text.isdigit():
        return "unknown", None

    is_private = False
    is_public = False
    if "semi" in text:
        is_public = True
    elif "private" in text or "military" in text or "member" in text:
        is_private = True
    if any(
        hint in text
        for hint in (
            "public",
            "municipal",
            "resort",
            "executive",
            "university",
            "daily",
            "par 3",
            "par3",
        )
    ):
        is_public = True

    if is_private and not is_public:
        access = "private"
    elif is_public and not is_private:
        access = "public"
    elif is_private and is_public:
        first = text.split("/")[0].strip()
        access = "private" if first.startswith(("private", "military")) else "public"
    else:
        access = "unknown"

    if "semi" in text:
        kind = "Semi-private"
    elif "municipal" in text:
        kind = "Municipal"
    elif "resort" in text:
        kind = "Resort"
    elif "military" in text:
        kind = "Military"
    elif "executive" in text:
        kind = "Executive"
    elif "private" in text:
        kind = "Private"
    elif "public" in text:
        kind = "Public"
    else:
        kind = raw.title() if raw else None
    return access, kind


def completeness(course: dict) -> int:
    return sum(
        1
        for key in ("holes", "par", "kind", "website", "yearBuilt", "city")
        if course.get(key)
    )


def load_csv_rows() -> list[dict[str, str]]:
    if not os.path.exists(CACHE_PATH):
        print(f"Downloading {CSV_URL}")
        urllib.request.urlretrieve(CSV_URL, CACHE_PATH)
    with gzip.open(CACHE_PATH, "rb") as raw:
        reader = csv.DictReader(TextIOWrapper(raw, encoding="utf-8", newline=""))
        return list(reader)


def main() -> None:
    rows = load_csv_rows()
    best: dict[tuple[str, str, str], dict] = {}

    for row in rows:
        name = clean_name((row.get("name") or "").strip())
        course_id = (row.get("id") or "").strip()
        if not name or not course_id:
            continue
        par = parse_int(row.get("par"))
        access, kind = access_and_kind(row.get("type"))
        course = {
            "id": course_id,
            "name": name,
            "city": (row.get("city") or "").strip() or None,
            "state": (row.get("state") or "").strip() or None,
            "holes": derive_holes(row, par),
            "par": par,
            "access": access,
            "kind": kind,
            "website": (row.get("website") or "").strip() or None,
            "yearBuilt": parse_int(row.get("year_built")),
        }
        course = {key: value for key, value in course.items() if value is not None}
        key = (
            name.lower(),
            (course.get("city") or "").lower(),
            (course.get("state") or "").upper(),
        )
        current = best.get(key)
        if current is None or completeness(course) > completeness(current):
            best[key] = course

    courses = sorted(
        best.values(),
        key=lambda c: (
            c.get("state") or "ZZ",
            (c.get("city") or "").lower(),
            c["name"].lower(),
        ),
    )
    payload = {
        "source": "OpenGolfAPI",
        "attribution": "Contains data from OpenGolfAPI (opengolfapi.org)",
        "license": "ODbL-1.0",
        "sourceUrl": "https://github.com/opengolfapi/data",
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "courses": courses,
    }
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, separators=(",", ":"), ensure_ascii=False)
    print(f"Wrote {len(courses)} courses to {OUT_PATH}")


if __name__ == "__main__":
    main()
