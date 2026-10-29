#!/bin/sh
# Build, show what the sync would delete, and only push after a yes. Run from site/ via `npm run deploy`.
set -eu
dest=alhadad-vps:/srv/alhadad-site/

npm run build
echo "Files the deploy would delete on the server (expect only old build hashes):"
rsync -an --delete --itemize-changes out/ "$dest" | grep deleting || echo "  (none)"
printf "Deploy to %s? [y/N] " "$dest"
read -r answer
[ "$answer" = y ] || { echo "Cancelled."; exit 1; }
rsync -a --delete out/ "$dest"
curl -sI https://alhadad.dev/ | grep -i last-modified
