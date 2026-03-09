/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}

module.exports = grammar({
  name: "nanograph_query",

  extras: ($) => [/\s/, $.line_comment, $.block_comment],

  rules: {
    source_file: ($) => repeat($.query_decl),

    query_decl: ($) =>
      seq(
        "query",
        field("name", $.identifier),
        "(",
        optional($.parameter_list),
        ")",
        repeat(field("annotation", $.annotation)),
        "{",
        field("body", $.query_body),
        "}",
      ),

    annotation: ($) =>
      seq("@", field("name", choice("description", "instruction")), "(", field("value", $.string), ")"),

    query_body: ($) => choice($.read_query_body, $.mutation_statement),

    read_query_body: ($) =>
      seq($.match_clause, $.return_clause, optional($.order_clause), optional($.limit_clause)),

    mutation_statement: ($) => choice($.insert_stmt, $.update_stmt, $.delete_stmt),

    insert_stmt: ($) => seq("insert", field("type", $.type_name), "{", repeat1($.mutation_assignment), "}"),

    update_stmt: ($) =>
      seq(
        "update",
        field("type", $.type_name),
        "set",
        "{",
        repeat1($.mutation_assignment),
        "}",
        "where",
        $.mutation_predicate,
      ),

    delete_stmt: ($) => seq("delete", field("type", $.type_name), "where", $.mutation_predicate),

    mutation_assignment: ($) => seq(field("name", $.identifier), ":", field("value", $.match_value), optional(",")),

    mutation_predicate: ($) => seq(field("name", $.identifier), $.comparison_operator, $.match_value),

    parameter_list: ($) => commaSep1($.parameter),
    parameter: ($) => seq(field("name", $.variable), ":", field("type", $.type_ref)),

    type_ref: ($) => seq(choice($.base_type, $.vector_type), optional("?")),
    vector_type: ($) => seq("Vector", "(", $.integer, ")"),
    base_type: ($) =>
      choice("String", "Bool", "I32", "I64", "U32", "U64", "F32", "F64", "DateTime", "Date"),

    match_clause: ($) => seq("match", "{", repeat1($.clause), "}"),
    clause: ($) => choice($.negation, $.binding, $.filter, $.traversal, $.text_search_clause),
    text_search_clause: ($) => choice($.search_call, $.fuzzy_call, $.match_text_call),

    binding: ($) =>
      seq(
        field("variable", $.variable),
        ":",
        field("type", $.type_name),
        optional(seq("{", $.property_match_list, "}")),
      ),

    property_match_list: ($) => seq($.property_match, repeat(seq(",", $.property_match)), optional(",")),
    property_match: ($) => seq(field("name", $.identifier), ":", field("value", $.match_value)),
    match_value: ($) => choice($.literal, $.variable),

    traversal: ($) =>
      seq(
        field("source", $.variable),
        field("edge", $.edge_identifier),
        optional($.traversal_bounds),
        field("target", $.variable),
      ),

    traversal_bounds: ($) => seq("{", $.integer, ",", optional($.integer), "}"),

    filter: ($) => seq(field("left", $.expression), $.comparison_operator, field("right", $.expression)),
    negation: ($) => seq("not", "{", repeat1($.clause), "}"),

    return_clause: ($) => seq("return", "{", repeat1($.projection), "}"),
    projection: ($) => seq($.expression, optional(seq("as", $.identifier)), optional(",")),

    order_clause: ($) => seq("order", "{", commaSep1($.ordering), "}"),
    ordering: ($) => seq($.expression, optional($.order_direction)),
    nearest_ordering: ($) => seq("nearest", "(", $.property_access, ",", $.expression, ")"),
    order_direction: (_$) => choice("asc", "desc"),

    limit_clause: ($) => seq("limit", $.integer),

    expression: ($) =>
      choice(
        $.nearest_ordering,
        $.search_call,
        $.fuzzy_call,
        $.match_text_call,
        $.bm25_call,
        $.rrf_call,
        $.aggregate_call,
        $.property_access,
        $.variable,
        $.literal,
        $.identifier,
      ),

    search_call: ($) => seq("search", "(", $.expression, ",", $.expression, ")"),
    fuzzy_call: ($) => seq("fuzzy", "(", $.expression, ",", $.expression, optional(seq(",", $.expression)), ")"),
    match_text_call: ($) => seq("match_text", "(", $.expression, ",", $.expression, ")"),
    bm25_call: ($) => seq("bm25", "(", $.expression, ",", $.expression, ")"),
    rrf_call: ($) => seq("rrf", "(", $.rank_expression, ",", $.rank_expression, optional(seq(",", $.expression)), ")"),

    rank_expression: ($) => choice($.nearest_ordering, $.bm25_call),

    property_access: ($) => seq(field("target", $.variable), ".", field("property", $.identifier)),

    aggregate_call: ($) => seq($.aggregate_function, "(", $.expression, ")"),
    aggregate_function: (_$) => choice("count", "sum", "avg", "min", "max"),

    comparison_operator: (_$) => choice(">=", "<=", "!=", ">", "<", "="),

    variable: (_$) => /\$[a-z_][A-Za-z0-9_]*/,
    edge_identifier: (_$) => /[a-z_][A-Za-z0-9_]*/,
    type_name: (_$) => /[A-Z][A-Za-z0-9_]*/,
    identifier: (_$) => /[a-z_][A-Za-z0-9_]*/,

    literal: ($) => choice($.list, $.datetime_call, $.date_call, $.string, $.float, $.integer, $.boolean),
    date_call: ($) => seq("date", "(", $.string, ")"),
    datetime_call: ($) => seq("datetime", "(", $.string, ")"),
    list: ($) => seq("[", commaSep($.literal), "]"),
    string: (_$) => token(seq('"', repeat(choice(/[^"\\]+/, /\\./)), '"')),
    float: (_$) => /\d+\.\d+/,
    integer: (_$) => /\d+/,
    boolean: (_$) => choice("true", "false"),
    line_comment: (_$) => token(seq("//", /.*/)),
    block_comment: (_$) => token(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//),
  },
});
