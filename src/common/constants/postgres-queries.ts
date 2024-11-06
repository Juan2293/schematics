export const QUERY_METADA_FROM_TABLE = `
SELECT
    col.column_name as name ,
    col.data_type as type ,
    col.is_nullable as nullable ,
    col.table_name as table,
    CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END  pk
FROM
    information_schema.columns AS col
LEFT JOIN (
    SELECT
        a.attname AS column_name,
        t.relname AS table_name
    FROM
        pg_index i
    JOIN
        pg_attribute a ON a.attnum = ANY(i.indkey) AND a.attrelid = i.indrelid
    JOIN
        pg_class t ON t.oid = i.indrelid
    JOIN
        pg_constraint c ON c.conindid = i.indexrelid
    WHERE
        c.contype = 'p' -- primary key constraint
) AS pk ON col.column_name = pk.column_name AND col.table_name = pk.table_name
WHERE
    col.table_name = $1;
  `;