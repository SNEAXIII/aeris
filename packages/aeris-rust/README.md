# Rust Essentials — Aeris

rust-analyzer with Clippy on save, a native debugger and Cargo.toml tooling.

<!-- gen:start -->

## Included packs

- [SneaxIII.aeris-dx](https://marketplace.visualstudio.com/items?itemName=SneaxIII.aeris-dx)

## Extensions

| Extension | Purpose |
| --- | --- |
| [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) | Rust language support for Visual Studio Code |
| [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb) | Debugger for native code, powered by LLDB. Debug C++, Rust, and other compiled languages. |
| [Even Better TOML](https://marketplace.visualstudio.com/items?itemName=tamasfe.even-better-toml) | Fully-featured TOML support |

## Settings applied

This pack sets the following defaults. Anything you set yourself wins.

```json
{
  "rust-analyzer.check.command": "clippy",
  "rust-analyzer.check.extraArgs": [
    "--",
    "--cap-lints",
    "warn"
  ],
  "[rust]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "rust-lang.rust-analyzer"
  },
  "errorLens.transmute": {
    "clippy": {
      "target": {
        "source": "clippy"
      },
      "decoration": {
        "dark": {
          "backgroundColor": "#c586c015",
          "after": {
            "color": "#c586c0"
          }
        },
        "light": {
          "backgroundColor": "#8f3f8f15",
          "after": {
            "color": "#8f3f8f"
          }
        }
      }
    }
  }
}
```

<!-- gen:end -->
