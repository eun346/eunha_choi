from __future__ import annotations

import json
import math
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ARCHIVE_DIR = ROOT / "archive"
PROJECTS_DIR = ROOT / "projects"
OUTPUT = ROOT / "content-index.js"


def parse_value(raw: str):
    value = raw.strip()
    if value.startswith("[") and value.endswith("]"):
        return [item.strip() for item in value[1:-1].split(",") if item.strip()]
    if value.lower() == "true":
        return True
    if value.lower() == "false":
        return False
    if value.isdigit():
        return int(value)
    return value.strip("\"'")


def read_markdown(path: Path):
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}, text

    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text

    frontmatter = parts[1].strip().splitlines()
    meta = {}
    for line in frontmatter:
        match = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if match:
            meta[match.group(1)] = parse_value(match.group(2))

    return meta, parts[2].lstrip()


def reading_time(markdown: str) -> str:
    cleaned = re.sub(r"```.*?```", "", markdown, flags=re.S)
    cleaned = re.sub(r"<[^>]+>", " ", cleaned)
    cleaned = re.sub(r"!\[[^\]]*\]\([^)]+\)", " ", cleaned)
    cleaned = re.sub(r"\[[^\]]+\]\([^)]+\)", " ", cleaned)
    words = re.findall(r"[\w#.+-]+", cleaned)
    minutes = max(1, math.ceil(len(words) / 200))
    unit = "minute" if minutes == 1 else "minutes"
    return f"{minutes} {unit}"


def archive_posts():
    posts = []
    for path in ARCHIVE_DIR.glob("*/index.md"):
        meta, markdown = read_markdown(path)
        if meta.get("draft") is True:
            continue
        slug = path.parent.name
        posts.append(
            {
                "slug": slug,
                "title": meta.get("title", slug),
                "date": meta.get("published") or meta.get("date", ""),
                "category": meta.get("category", "Archive"),
                "tags": meta.get("tags", []),
                "excerpt": meta.get("description", ""),
                "readingTime": meta.get("readingTime") or reading_time(markdown),
            }
        )
    return sorted(posts, key=lambda item: item.get("date", ""), reverse=True)


def projects():
    items = []
    for path in PROJECTS_DIR.glob("*/index.md"):
        meta, _ = read_markdown(path)
        if meta.get("draft") is True:
            continue
        slug = path.parent.name
        items.append(
            {
                "slug": slug,
                "title": meta.get("title", slug),
                "category": meta.get("category", "Project"),
                "description": meta.get("description", ""),
                "outcome": meta.get("outcome", ""),
                "tags": meta.get("tags", []),
                "accent": meta.get("accent", "cyan"),
                "image": meta.get("image", ""),
                "order": meta.get("order", 999),
                "github": meta.get("github", ""),
                "demo": meta.get("demo", ""),
            }
        )
    return sorted(items, key=lambda item: (item.get("order", 999), item.get("title", "")))


def js_export(name: str, value) -> str:
    return f"export const {name} = {json.dumps(value, indent=2, ensure_ascii=False)};\n"


def main() -> None:
    project_items = projects()
    post_items = archive_posts()
    content = [
        "// Generated from archive/*/index.md and projects/*/index.md.\n",
        "// Run `python tools/update-content-index.py` after adding or editing content.\n\n",
        js_export("projects", project_items),
        "\n",
        js_export("archivePosts", post_items),
        "\n",
        "export const archiveCategories = [...new Set(archivePosts.map((post) => post.category))].sort();\n",
        "export const archiveTags = [...new Set(archivePosts.flatMap((post) => post.tags))].sort();\n",
    ]
    OUTPUT.write_text("".join(content), encoding="utf-8")
    print(f"Updated {OUTPUT.relative_to(ROOT)} with {len(project_items)} projects and {len(post_items)} archive posts.")


if __name__ == "__main__":
    main()
