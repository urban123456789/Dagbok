#!/usr/bin/env bash
# Scaffold a local-only Obsidian vault inside a project folder.
#
# Usage: scripts/init-obsidian-vault.sh [project-dir]
#   project-dir defaults to the current directory.
#
# The vault lives in <project-dir>/vault/ and is for docs, brainstorming
# and ideas. It is private by design: this script also makes sure the
# project's .gitignore excludes it, so it is never pushed to GitHub.
# Safe to re-run — existing notes are never overwritten.

set -euo pipefail

TARGET="$(cd "${1:-.}" && pwd)"
VAULT="$TARGET/vault"

mkdir -p "$VAULT/.obsidian" \
         "$VAULT/Docs" \
         "$VAULT/Brainstorming" \
         "$VAULT/Idéer"

# Minimal Obsidian config so the folder is recognized as a vault.
if [ ! -f "$VAULT/.obsidian/app.json" ]; then
  printf '{}\n' > "$VAULT/.obsidian/app.json"
fi

if [ ! -f "$VAULT/Start.md" ]; then
  cat > "$VAULT/Start.md" <<'EOF'
# Projektvalv

Detta är projektets privata Obsidian-valv för dokumentation,
brainstorming och idéer.

- **Docs/** – dokumentation och beslut
- **Brainstorming/** – lösa tankar och utkast
- **Idéer/** – funktionsidéer och framtida planer

> ⚠️ Valvet är exkluderat via `.gitignore` och får **aldrig** pushas
> till publika GitHub-repon. Ta egen backup vid behov (t.ex. Obsidian
> Sync eller en privat lagringsplats).
EOF
fi

# Ensure the vault is git-ignored in this project.
GITIGNORE="$TARGET/.gitignore"
ensure_ignored() {
  local pattern="$1"
  if [ ! -f "$GITIGNORE" ] || ! grep -qxF "$pattern" "$GITIGNORE"; then
    printf '%s\n' "$pattern" >> "$GITIGNORE"
  fi
}
ensure_ignored '# Privat Obsidian-valv – synkas aldrig till GitHub'
ensure_ignored '/vault/'
ensure_ignored '.obsidian/'

echo "Obsidian-valv klart: $VAULT (git-ignorerat via $GITIGNORE)"
