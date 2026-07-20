# Project conventions

## Obsidian vault per project (private, never pushed)

Every project gets a local Obsidian vault in `vault/` inside the
project's own folder, used for docs, brainstorming and ideas.

- When starting a **new project**, scaffold the vault by running
  `scripts/init-obsidian-vault.sh <project-dir>` (copy the script into
  the new project if needed). It creates `vault/` with `Docs/`,
  `Brainstorming/` and `Idéer/` plus a `Start.md` note.
- The vault is **private**: `/vault/` and `.obsidian/` are excluded in
  `.gitignore` and must **never** be committed or pushed — this
  repository (and others like it) is public on GitHub.
- Never remove the vault entries from `.gitignore`, and never use
  `git add -f` on anything under `vault/`.
- Vault notes live only on the user's own machine. If a session needs
  the vault, recreate it with the script rather than fetching it from
  anywhere.
