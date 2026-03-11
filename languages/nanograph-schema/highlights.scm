(node_decl "node" @keyword)
(edge_decl "edge" @keyword)
(enum_type "enum" @keyword)

(type_name) @type
(base_type) @type.builtin
(vector_type "Vector" @type.builtin)

(property_decl name: (identifier) @property)
(annotation name: (identifier) @attribute)

(string) @string
(integer) @number
(float) @number.float
(boolean) @constant.builtin

(line_comment) @comment
(block_comment) @comment
