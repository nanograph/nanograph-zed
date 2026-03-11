# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zed editor extension providing tree-sitter-based syntax highlighting for nanograph schema (`.pg`) and query (`.gq`) files. Built with `zed_extension_api` v0.7.0.

## Build Commands

```bash
# Build the extension WASM (requires wasm32-wasip2 target)
rustup target add wasm32-wasip2
cargo build --release --target wasm32-wasip2

# Regenerate tree-sitter parsers after editing grammar.js files
cd grammars/tree-sitter-nanograph-schema && npx tree-sitter generate
cd grammars/tree-sitter-nanograph-query && npx tree-sitter generate
```

## Architecture

The extension has three layers:

1. **Extension entry point** (`src/lib.rs`) — Minimal Rust cdylib that registers with Zed's extension API. No LSP or custom logic.

2. **Tree-sitter grammars** (`grammars/tree-sitter-nanograph-{schema,query}/grammar.js`) — Define the parsing rules for each language. Running `tree-sitter generate` produces `src/parser.c` and related files. These get compiled to WASM for Zed.

3. **Language configs** (`languages/nanograph-{schema,query}/`) — Each contains:
   - `config.toml` — File associations, comment styles, bracket pairs, tab size
   - `highlights.scm` — Tree-sitter highlight queries mapping AST nodes to syntax categories

The `extension.toml` manifest ties everything together: declares the two grammars, two languages, and the Rust extension library.

## Key Relationships

- `grammar.js` defines node names → `highlights.scm` references those node names for highlighting
- Schema language: `node` and `edge` declarations with typed properties and annotations
- Query language: `query`/`insert`/`update`/`delete` statements with match clauses, traversals, search functions, and aggregations
- Both languages share comment syntax (`//`, `/* */`) and bracket conventions
