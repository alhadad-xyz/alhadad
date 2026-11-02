#!/bin/sh
# Build from a clean tree, smoke test, show what the sync would delete, and only push after a yes.
# The live tree is copied aside first, so a bad deploy rolls back with:
#   ssh alhadad-vps 'rsync -a --delete /srv/alhadad-site.prev/ /srv/alhadad-site/'
# Both folders are owned by khalid inside root-owned /srv, so they are synced in place, never created or moved.
# Run from site/ via `npm run deploy`.
set -eu
host=alhadad-vps
dir=/srv/alhadad-site
dest=$host:$dir/

# Only committed work ships, so the live site always matches a commit.
if [ -n "$(git status --porcelain -- .)" ]; then
	echo "site/ has uncommitted changes; commit or stash them first."
	exit 1
fi
rev=$(git rev-parse --short HEAD)

npm ci
npm run build
echo "$rev" > out/version.txt
npm run smoke

echo "Files the deploy would delete on the server (expect only old build hashes):"
rsync -an --delete --itemize-changes out/ "$dest" | grep deleting || echo "  (none)"
printf "Deploy %s to %s? [y/N] " "$rev" "$dest"
read -r answer
[ "$answer" = y ] || { echo "Cancelled."; exit 1; }

ssh "$host" "rsync -a --delete $dir/ $dir.prev/"
rsync -a --delete out/ "$dest"

# Post-deploy checks: the page, a real 404, the build that's live, and the security headers.
fail=0
check() { if eval "$2"; then echo "  ok    $1"; else echo "  FAIL  $1"; fail=1; fi; }
check "/ returns 200" '[ "$(curl -so /dev/null -w "%{http_code}" https://alhadad.dev/)" = 200 ]'
check "/nope returns 404" '[ "$(curl -so /dev/null -w "%{http_code}" https://alhadad.dev/nope)" = 404 ]'
check "version.txt is $rev" '[ "$(curl -s https://alhadad.dev/version.txt)" = "$rev" ]'
check "security headers" 'curl -sI https://alhadad.dev/ | grep -qi "^content-security-policy:"'
[ "$fail" = 0 ] || echo "Post-deploy checks failed. Roll back with the command at the top of deploy/deploy.sh."
exit "$fail"
