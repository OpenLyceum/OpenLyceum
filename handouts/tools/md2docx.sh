#!/usr/bin/env bash
# Convert a handout Markdown file to Word (.docx) with pandoc.
#
#   handouts/tools/md2docx.sh StellarWobble/handout.md            -> StellarWobble/handout.docx
#   handouts/tools/md2docx.sh StellarWobble/answers.md out.docx
#   handouts/tools/md2docx.sh --all                                 every handout.md and answers.md
#
# SVG diagrams are first rendered to 192-dpi PNGs with Inkscape (or rsvg-convert), so they appear
# in every version of Word and LibreOffice. Tables get borders from tools/reference.docx, which is
# built from pandoc's default reference document the first time the script runs.
set -euo pipefail

TOOLS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$TOOLS")"
REF="$TOOLS/reference.docx"

command -v pandoc >/dev/null || { echo "pandoc is required (https://pandoc.org/installing.html)" >&2; exit 1; }

make_reference() {
  pandoc -o "$REF" --print-default-data-file reference.docx
  python3 - "$REF" <<'PY'
import sys, zipfile, shutil, re
path = sys.argv[1]
tmp = path + ".tmp"
with zipfile.ZipFile(path) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == "word/styles.xml":
            xml = data.decode("utf8")
            borders = ('<w:tblBorders>' + ''.join(
                f'<w:{side} w:val="single" w:sz="4" w:space="0" w:color="808080"/>'
                for side in ("top", "left", "bottom", "right", "insideH", "insideV")) + '</w:tblBorders>')
            # Give pandoc's "Table" style borders (schema order: after tblInd, before tblCellMar)
            # and rows at least 0.28 in tall, so empty cells leave room to write.
            m = re.search(r'<w:style [^>]*w:styleId="Table"[^>]*>.*?</w:style>', xml, flags=re.S)
            style = m.group(0)
            style = style.replace("<w:tblCellMar>", borders + "<w:tblCellMar>", 1)
            style = style.replace("</w:tblPr>", '</w:tblPr><w:trPr><w:trHeight w:val="400" w:hRule="atLeast"/></w:trPr>', 1)
            xml = xml[:m.start()] + style + xml[m.end():]
            data = xml.encode("utf8")
        zout.writestr(item, data)
shutil.move(tmp, path)
PY
}

svg_to_png() { # $1 svg, $2 png
  if command -v inkscape >/dev/null; then
    inkscape "$1" --export-type=png --export-dpi=192 --export-filename="$2" >/dev/null 2>&1
  elif command -v rsvg-convert >/dev/null; then
    rsvg-convert -d 192 -p 192 -z 2 -o "$2" "$1"
  else
    echo "Need inkscape or rsvg-convert to convert $1" >&2; exit 1
  fi
}

convert_one() { # $1 markdown, $2 output (optional)
  local md dir base out tmp
  md="$(realpath "$1")"; dir="$(dirname "$md")"; base="$(basename "$md" .md)"
  out="${2:-$dir/$base.docx}"
  tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' RETURN
  mkdir -p "$tmp/svg"
  if compgen -G "$dir/svg/*.svg" >/dev/null; then
    for svg in "$dir"/svg/*.svg; do svg_to_png "$svg" "$tmp/svg/$(basename "$svg" .svg).png"; done
  fi
  sed -E 's#\(svg/([^)]+)\.svg\)#(svg/\1.png)#g' "$md" >"$tmp/$base.md"
  pandoc "$tmp/$base.md" --from markdown --to docx \
    --resource-path="$tmp:$dir" --reference-doc="$REF" --lua-filter="$TOOLS/md2docx.lua" \
    -o "$out"
  echo "wrote $out"
}

[[ -f "$REF" ]] || make_reference

if [[ "${1:-}" == "--all" ]]; then
  for md in "$ROOT"/*/handout.md "$ROOT"/*/answers.md; do [[ -f "$md" ]] && convert_one "$md"; done
elif [[ $# -ge 1 ]]; then
  convert_one "$1" "${2:-}"
else
  sed -n '2,8p' "$0"; exit 1
fi
