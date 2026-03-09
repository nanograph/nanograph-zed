(query_decl "query" @keyword)
(match_clause "match" @keyword)
(return_clause "return" @keyword)
(order_clause "order" @keyword)
(limit_clause "limit" @keyword)
(insert_stmt "insert" @keyword)
(update_stmt "update" @keyword)
(update_stmt "set" @keyword)
(delete_stmt "delete" @keyword)
(update_stmt "where" @keyword)
(delete_stmt "where" @keyword)
(projection "as" @keyword)
(negation "not" @keyword)
(order_direction) @keyword

(annotation name: ["description" "instruction"] @attribute)

(query_decl name: (identifier) @function)
(variable) @variable
(parameter name: (variable) @variable.parameter)

(type_name) @type
(base_type) @type.builtin
(vector_type "Vector" @type.builtin)

(binding type: (type_name) @type)
(property_access property: (identifier) @property)
(property_match name: (identifier) @property)
(mutation_assignment name: (identifier) @property)
(mutation_predicate name: (identifier) @property)

(search_call "search" @function.builtin)
(fuzzy_call "fuzzy" @function.builtin)
(match_text_call "match_text" @function.builtin)
(bm25_call "bm25" @function.builtin)
(rrf_call "rrf" @function.builtin)
(nearest_ordering "nearest" @function.builtin)
(aggregate_function) @function.builtin
(date_call "date" @function.builtin)
(datetime_call "datetime" @function.builtin)

(comparison_operator) @operator

(string) @string
(integer) @number
(float) @number.float
(boolean) @constant.builtin

(line_comment) @comment
(block_comment) @comment
