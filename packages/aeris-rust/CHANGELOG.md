# Changelog

## 1.2.0

### Minor Changes

- af860b5: Clippy lints show as warnings in the editor, so a lint in the library no longer hides the compile errors of the binaries built on it. `cargo clippy` on the command line still applies the crate's own levels.

## 1.1.0

### Minor Changes

- 39d215d: Clippy diagnostics get their own Error Lens colour (violet) so they stand apart from rustc errors.
