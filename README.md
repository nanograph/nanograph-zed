# nanograph for Zed

Local Zed extension for nanograph source files.

Supported files:

- `*.pg` — nanograph schema
- `*.gq` — nanograph query

The extension uses tree-sitter grammars stored in this repository under:

- `grammars/tree-sitter-nanograph-schema`
- `grammars/tree-sitter-nanograph-query`

For local development in Zed, install the Rust WebAssembly target first:

```sh
rustup target add wasm32-wasip2
```
