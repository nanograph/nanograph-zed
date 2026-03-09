/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}

module.exports = grammar({
  name: "nanograph_schema",

  extras: ($) => [/\s/, $.line_comment, $.block_comment],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat(choice($.node_decl, $.edge_decl)),

    node_decl: ($) =>
      seq(
        "node",
        field("name", $.type_name),
        repeat(field("annotation", $.annotation)),
        optional(seq(":", field("parent", $.type_name))),
        "{",
        repeat($.property_decl),
        "}",
      ),

    edge_decl: ($) =>
      seq(
        "edge",
        field("name", $.type_name),
        ":",
        field("source", $.type_name),
        "->",
        field("target", $.type_name),
        repeat(field("annotation", $.annotation)),
        optional(seq("{", repeat($.property_decl), "}")),
      ),

    property_decl: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        field("type", $.type_ref),
        repeat(field("annotation", $.annotation)),
      ),

    type_ref: ($) => seq(choice($.list_type, $.enum_type, $.vector_type, $.base_type), optional("?")),

    list_type: ($) => seq("[", $.base_type, "]"),

    enum_type: ($) => seq("enum", "(", commaSep1($.enum_value), ")"),

    vector_type: ($) => seq("Vector", "(", $.integer, ")"),

    base_type: ($) =>
      choice("String", "Bool", "I32", "I64", "U32", "U64", "F32", "F64", "DateTime", "Date"),

    annotation: ($) =>
      seq("@", field("name", $.identifier), optional(seq("(", field("argument", $.annotation_argument), ")"))),

    annotation_argument: ($) => choice($.literal, $.identifier),

    literal: ($) => choice($.string, $.float, $.integer, $.boolean),

    type_name: (_$) => /[A-Z][A-Za-z0-9_]*/,
    identifier: (_$) => /[a-z_][A-Za-z0-9_]*/,
    enum_value: (_$) => /[A-Za-z0-9_-]+/,
    string: (_$) => token(seq('"', repeat(choice(/[^"\\]+/, /\\./)), '"')),
    float: (_$) => /\d+\.\d+/,
    integer: (_$) => /\d+/,
    boolean: (_$) => choice("true", "false"),
    line_comment: (_$) => token(seq("//", /.*/)),
    block_comment: (_$) => token(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//),
  },
});
