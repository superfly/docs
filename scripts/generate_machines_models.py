#!/usr/bin/env python3
"""Regenerate api/machines/models.mdx from api/machines/openapi.json.

Run from the repo root after the Machines API spec changes:

    python3 scripts/generate_machines_models.py

The page keeps its frontmatter and intro. Everything from the first
schema heading on is rebuilt from components.schemas.
"""
import json
import sys
from pathlib import Path

SPEC = Path("api/machines/openapi.json")
PAGE = Path("api/machines/models.mdx")


SCHEMAS = {}


def ref_name(ref):
    return ref.rsplit("/", 1)[-1]


def named_match(s):
    """Name of a schema whose properties match an inline object exactly."""
    props = s.get("properties")
    if not props:
        return None
    for name, schema in SCHEMAS.items():
        if schema.get("properties") == props:
            return name
    return None


def type_of(s):
    if "$ref" in s:
        return ref_name(s["$ref"])
    for key in ("allOf", "oneOf", "anyOf"):
        if key in s and len(s[key]) == 1:
            return type_of(s[key][0])
    t = s.get("type")
    if isinstance(t, list):
        t = next((x for x in t if x != "null"), t[0])
    if t == "array":
        return type_of(s.get("items", {})) + "[]"
    if t == "object" and named_match(s):
        return named_match(s)
    if t == "object" or (t is None and "additionalProperties" in s):
        ap = s.get("additionalProperties")
        if isinstance(ap, dict) and ap:
            return f"map<string, {type_of(ap)}>"
        return "object"
    return t or "object"


def clean(text):
    return " ".join((text or "").split()).replace("|", "\\|")


def describe(s):
    desc = clean(s.get("description"))
    enum = s.get("enum")
    if enum is None and "items" in s:
        enum = s["items"].get("enum")
    if enum:
        values = "Enum: " + ", ".join(str(v) for v in enum)
        desc = f"{desc} {values}" if desc else values
    return desc


def section(name, s):
    out = [f"## {name}", ""]
    if s.get("description"):
        out += [clean(s["description"]), ""]
    props = s.get("properties")
    if props:
        required = set(s.get("required", []))
        out += [
            "| Property | Type | Required | Description |",
            "| --- | --- | --- | --- |",
        ]
        for prop in sorted(props):
            p = props[prop]
            req = "Yes" if prop in required else "No"
            out.append(f"| `{prop}` | `{type_of(p)}` | {req} | {describe(p)} |")
    else:
        out.append(f"Type: `{type_of(s)}`")
        if s.get("enum"):
            out += ["", describe({"enum": s["enum"]})]
    return out


def main():
    spec_path = Path(sys.argv[1]) if len(sys.argv) > 1 else SPEC
    schemas = json.loads(spec_path.read_text())["components"]["schemas"]
    SCHEMAS.update(schemas)
    page = PAGE.read_text()
    head = page[: page.index("\n## ") + 1]
    body = []
    for name in sorted(schemas, key=str.lower):
        body += section(name, schemas[name]) + [""]
    PAGE.write_text(head + "\n".join(body).rstrip("\n") + "\n")


if __name__ == "__main__":
    main()
