# Aeris — design decisions

Family of VS Code extension packs, layered and composable. One install gives a
complete environment for a stack; each layer stays installable on its own.

Brand: **Aeris**. Publisher: `SneaxIII`. Extension IDs: `SneaxIII.aeris-*`.

## Composition

```
aeris-git      gitlens, github-actions, github-pr
   ^ nested in
aeris-dx       errorlens, todo-tree, indent-rainbow, editorconfig, dependi, database-client2
   ^ nested in EVERY pack below, no exception

aeris-rust     -> aeris-dx + rust-analyzer, CodeLLDB, even-better-toml
aeris-ts       -> aeris-dx + oxlint, prettier, pretty-ts-errors
aeris-python   -> aeris-dx + ms-python, pylance, debugpy, ruff
aeris-css      -> aeris-dx + stylelint, BEM helper
aeris-tailwind -> aeris-css + tailwindcss, tailwind-fold          (opt-in)
aeris-vue      -> aeris-ts + aeris-css + volar, goto-alias
aeris-nuxt     -> aeris-vue + nuxtr
```

Nine packs. VS Code resolves `extensionPack` recursively, so nesting is real
composition, not duplication.

### What is deliberately absent

- **No `aeris-next`, no `aeris-fastapi`.** Neither has 2+ exclusive extensions:
  Next is TypeScript + Tailwind, FastAPI is Python + an HTTP client. A pack that
  only re-exports two other packs earns a README line, not a marketplace entry.
- **No `aeris-misc`.** SonarQube for IDE and Remote SSH go in an "Optional
  tools" README section. Sonar ships a JRE, overlaps oxlint/ruff/clippy, and its
  connected mode needs an account — never nest a tool that asks the user a
  question. Two extensions do not justify a pack to maintain.

## Rules

### Settings

Packs contribute `configurationDefaults`, and the README documents what gets
applied. Every key MUST be **language-scoped**:

```json
{ "[rust]": { "editor.formatOnSave": true, "editor.defaultFormatter": "rust-lang.rust-analyzer" } }
```

No global key, ever. A pack setting `editor.formatOnSave` at top level would
reformat the user's Markdown and YAML without warning.

**One key, one layer** — owned by the lowest layer that needs it. VS Code does
not define a winner when two extensions default the same key, so the ownership
table is what keeps the family predictable. Language scoping makes that table
trivial: a pack only touches keys inside its own scope.

### Inclusion criteria

An extension enters a pack only if it is:

1. released within the last 12 months, **or** has no maintained equivalent — see
   the grandfather list below,
2. not duplicating a built-in VS Code feature,
3. free of visual opinion (no theme, icon set, or font),
4. free, with no account or paid licence required.

No cap on pack size — the earlier cap of 6 was dropped, having already done its
job by revealing that "DX" was two concerns (editor ergonomics vs Git/GitHub).

#### Grandfathered extensions

Rule 1 applied literally would have removed five extensions the packs need, and
the marketplace offers no replacement for most of them. For a single-purpose
utility, "abandoned" usually means "finished" — the risk is breakage, not age.
Each exception carries its reason, in `scripts/verify-ids.mjs` and here:

| Extension | Age | Why it stays |
| --- | --- | --- |
| `tamasfe.even-better-toml` | 20.6mo | de facto TOML standard, no alternative |
| `gruntfuggly.todo-tree` | 40.9mo | millions of installs; `better-todo-tree` sits at 30k |
| `oderwat.indent-rainbow` | 53.0mo | finished; competitors under 1k installs |
| `stivo.tailwind-fold` | 26.7mo | no credible maintained alternative |
| `nuxtr.nuxtr-vscode` | 29.7mo | the only Nuxt tooling extension |
| `Box-Of-Hats.bemhelper` | 15.5mo | the only BEM extension with adoption (191k) |

### Distribution

VS Marketplace only. No OpenVSX: forks simply miss what they miss.

Publisher stays `SneaxIII` rather than a dedicated `aeris` publisher — the
visibility is worth more than short IDs, and it avoids a second account.

### Marketplace listing

| Field | Pattern |
| --- | --- |
| `name` | `aeris-rust` |
| `displayName` | `Rust Essentials — Aeris` |
| `description` | one sentence: what you get, not the brand |
| `keywords` | language/framework first (`rust`, `cargo`, `rust-analyzer`), `aeris` last |
| README | generated table + Included packs + Settings applied + Optional tools |
| Language | English only |

"Essentials" is a word people search for; "Aeris" is not.

## Repository

- Delete `SNEAXIII/rustkins` (1 commit, 9 files) and `vsce unpublish
  SneaxIII.rustkins`. This frees the name for the Rustkins CI project.
- New repo `SNEAXIII/aeris`, local `X:\Dev\Perso\aeris`. The pack leaves
  `mawster-rs`, whose CI publishes a Docker image and has no business tagging
  extension releases.
- pnpm workspace, `packages/<pack>/`, **changesets**, independent versions — a
  `aeris-nuxt` fix must not republish `aeris-python`.
- All packs start at **1.0.0**. An extension pack has no code: it is complete or
  it is not, and `0.x` reads as abandoned. Adding an extension is a `minor`,
  removing one a `major`.
- GitHub Actions publishes changed packs with `vsce publish`, `VSCE_PAT` in
  secrets.
- `pnpm gen:readme` generates the extension table and the applied-settings
  section from `package.json`, between `<!-- gen:start -->` markers. The list
  lives in exactly one place.
- One logo, nine hue variants.

## Maintenance

The real risk: we own none of the ~25 extensions we distribute. A rename,
unpublish or abandonment breaks an install silently.

Weekly cron + a pre-publish gate query the marketplace gallery API for every ID
in every `extensionPack` (`scripts/verify-ids.mjs`).

Two thresholds, because they answer different questions:

- **AGEING** — last release over **6 months** old. The weekly cron opens an
  issue (one at a time, it does not stack); the release is not blocked.
- **STALE / MISSING** — over **12 months**, or gone from the marketplace. The
  pre-publish gate fails and nothing ships.

Grandfathered entries are exempt from both.

## Verification

All 26 third-party IDs were checked against the gallery API: none missing.
The uncertain ones resolved to `oxc.oxc-vscode`, `stivo.tailwind-fold` and
`Box-Of-Hats.bemhelper`.

`aeris-nuxt` ships with one exclusive extension, where the rule asks for two. It
is kept deliberately: unlike the deleted `aeris-next`, which had none, Nuxtr is
real Nuxt tooling with no substitute.
