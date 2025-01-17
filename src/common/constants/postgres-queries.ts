export const QUERY_METADA_FROM_TABLE = `
 
    
   SELECT
    col.column_name AS name,
    col.data_type AS type,
    col.is_nullable AS nullable,
    col.table_name AS table,
    CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END AS pk,
    CASE WHEN uq.column_name IS NOT NULL THEN true ELSE false END AS unique,
    col.character_maximum_length AS length, -- Longitud de la columna
    -- Para obtener los valores del enum, si la columna es de tipo ENUM
    CASE
        WHEN col.data_type = 'USER-DEFINED' AND enum_info.enum_type IS NOT NULL THEN
            enum_info.enum_values
        ELSE NULL
    END AS enum_values
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
LEFT JOIN (
    SELECT
        cc.column_name,
        tc.table_name
    FROM
        information_schema.table_constraints AS tc
    JOIN
        information_schema.constraint_column_usage AS cc ON tc.constraint_name = cc.constraint_name
    WHERE
        tc.constraint_type = 'UNIQUE'
) AS uq ON col.column_name = uq.column_name AND col.table_name = uq.table_name
LEFT JOIN (
    SELECT
        e.enumtypid,
        t.typname AS enum_type,
        string_agg(e.enumlabel, ', ') AS enum_values
    FROM
        pg_enum e
    JOIN
        pg_type t ON t.oid = e.enumtypid
    GROUP BY
        e.enumtypid, t.typname
) AS enum_info ON enum_info.enum_type = col.udt_name
WHERE
    col.table_name = $1
    order by 5 desc, 2 asc;
  `;