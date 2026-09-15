#!/bin/sh
set -eu
cd "$(dirname "$0")"
if [ -n "$(git status --porcelain)" ]; then
  echo 'Commit all intended changes before publishing.' >&2
  exit 1
fi
if [ "$(git branch --show-current)" != main ]; then
  echo 'Publish from main only.' >&2
  exit 1
fi
git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push origin main
publish_commit=$(git subtree split --prefix dist main)
git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push origin "$publish_commit:refs/heads/gh-pages"
echo 'Published branch updated. Check GitHub Pages build and live URL.'
