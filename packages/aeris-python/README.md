# aeris-python

<!-- gen:start -->

## Included packs

- [SneaxIII.aeris-dx](https://marketplace.visualstudio.com/items?itemName=SneaxIII.aeris-dx)

## Extensions

| Extension | Purpose |
| --- | --- |
| [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) | Python language support with extension access points for IntelliSense (Pylance), Debugging (Python Debugger), linting, formatting, refactoring, unit tests, and more. |
| [Pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance) | A performant, feature-rich language server for Python in VS Code |
| [Python Debugger](https://marketplace.visualstudio.com/items?itemName=ms-python.debugpy) | Python Debugger extension using debugpy. |
| [Ruff](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff) | A Visual Studio Code extension with support for the Ruff linter and formatter for Python. |

## Settings applied

This pack sets the following defaults. Anything you set yourself wins.

```json
{
  "[python]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.codeActionsOnSave": {
      "source.fixAll": "explicit",
      "source.organizeImports": "explicit"
    }
  }
}
```

<!-- gen:end -->
