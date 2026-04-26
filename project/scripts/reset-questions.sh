#!/usr/bin/env bash
# Reset all AI question statuses back to "open" by wiping the resolutions
# localStorage key. Data lives client-side, so this prints a JS snippet
# (and copies it to clipboard on macOS) for you to paste into the browser
# devtools console while the app is open.

set -euo pipefail

SNIPPET="['qontext.v2.resolutions','qontext.v2.activity','qontext.v2.sessions'].forEach(k=>localStorage.removeItem(k));location.reload();"

if command -v pbcopy >/dev/null 2>&1; then
  printf "%s" "$SNIPPET" | pbcopy
  echo "Copied to clipboard. Paste in browser devtools console:"
else
  echo "Paste this in browser devtools console:"
fi
echo
echo "  $SNIPPET"
echo
echo "Or, narrower (only resolutions, keeps activity/sessions):"
echo
echo "  localStorage.removeItem('qontext.v2.resolutions');location.reload();"
