
export interface ColumnMetadata {
    name:         string;
    type:         string;
    nullable:     string;
    table:        string;
    pk:           boolean;
    unique:       boolean;
    length:       number;
    enum_values:  string;
}