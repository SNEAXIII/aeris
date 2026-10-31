---
"aeris-rust": minor
---

Clippy lints show as warnings in the editor, so a lint in the library no longer hides the compile errors of the binaries built on it. `cargo clippy` on the command line still applies the crate's own levels.
