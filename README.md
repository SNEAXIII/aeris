# Aeris

A family of layered VS Code extension packs. Install one, get a working
environment for your stack — no 30-extension dump, no theme you did not ask for.

```
aeris-git      gitlens, github-actions, github-pr
   ^
aeris-dx       errorlens, todo-tree, indent-rainbow, editorconfig, dependi, database-client
   ^ every pack below includes it

aeris-rust     rust-analyzer, CodeLLDB, even-better-toml
aeris-ts       oxlint, prettier, pretty-ts-errors
aeris-python   ms-python, pylance, debugpy, ruff
aeris-css      stylelint, BEM helper
aeris-tailwind aeris-css + tailwindcss, tailwind-fold        (opt-in)
aeris-vue      aeris-ts + aeris-css + volar, goto-alias
aeris-nuxt     aeris-vue + nuxtr
```

## Optional tools

Deliberately not bundled — each one asks something of you:

- [SonarQube for IDE](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)
  — ships a JRE, and its connected mode needs a SonarCloud account.
- [Remote SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)
  — Microsoft-only, absent from forks.
- BEM as a lint rule rather than an editor helper:
  [`stylelint-selector-bem-pattern`](https://www.npmjs.com/package/stylelint-selector-bem-pattern).

## Design

Layering, settings ownership and inclusion rules live in [DESIGN.md](DESIGN.md).

## Development

```sh
pnpm install
pnpm gen:readme    # regenerate pack READMEs from their package.json
pnpm verify:ids    # check every bundled extension still exists and is maintained
```

Changes ship through [changesets](https://github.com/changesets/changesets):
`pnpm changeset`, then CI publishes the packs whose version moved.

## License

[MIT](LICENSE)
