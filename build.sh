#!/usr/bin/env bash
# ------------------------------------------------------------------
# build.sh — assemble the section partials in sections/ into index.html.
#
# This is a PLAIN concat. No npm, no bundler, no dependencies — just cat.
# GitHub Pages serves the committed index.html as-is with NO build step,
# so the site works even if this script is never run. The script exists
# only so the source stays componentized/maintainable; run it after editing
# any sections/*.html and commit the regenerated index.html.
#
#   Usage:  ./build.sh
# ------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")"

OUT="index.html"
TMP="$(mktemp)"

# Ordered assembly. Filenames are numeric-prefixed so the glob is stable;
# we list them explicitly for clarity and to control ordering.
PARTS=(
  sections/00-head.html
  sections/01-icons.html
  sections/02-nav.html
  sections/03-hero.html
  sections/04-projects-open.html
  sections/10-project-agent.html
  sections/11-project-geofencing.html
  sections/12-projects-mid.html
  sections/13-project-lineage.html
  sections/14-project-infosys.html
  sections/20-skills.html
  sections/21-footer.html
  sections/99-close.html
)

for p in "${PARTS[@]}"; do
  if [[ ! -f "$p" ]]; then
    echo "build.sh: missing partial: $p" >&2
    exit 1
  fi
  cat "$p" >> "$TMP"
  printf '\n' >> "$TMP"
done

# Cache-buster: a short content hash of the assets the HTML links. Stamped into
# every "?v=__CSSVER__" placeholder so the version only changes when an asset
# changes — forcing browsers to re-fetch CSS/JS instead of serving a stale copy.
CSSVER="$(cat assets/styles.css assets/css/diagram.css assets/js/*.js 2>/dev/null | shasum | cut -c1-10)"
# portable in-place edit (BSD/macOS + GNU sed)
if sed --version >/dev/null 2>&1; then
  sed -i "s/__CSSVER__/${CSSVER}/g" "$TMP"
else
  sed -i '' "s/__CSSVER__/${CSSVER}/g" "$TMP"
fi

mv "$TMP" "$OUT"
echo "build.sh: wrote $OUT from ${#PARTS[@]} partials (asset version ${CSSVER})."
