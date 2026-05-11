// PE_SYSTEM_CLIENT_ID → param[0]

// PE_SEARCH           → params[3..9] (7 ocorrências na cláusula WHERE)
export const CATEGORY_LIST_SQL = `
SELECT
	tbl_taxonomy.ID_TAXONOMY,
	tbl_taxonomy.TAXONOMIA,  
	tbl_taxonomy.PARENT_ID,
	tbl_taxonomy_father.TAXONOMIA as TAXONOMIA_FATHER,       
	tbl_taxonomy_grandfather.ID_TAXONOMY AS ID_TAXONOMY_GRANDFATHER,
	tbl_taxonomy_grandfather.TAXONOMIA as TAXONOMIA_GRANDFATHER,    
	tbl_taxonomy.PATH_IMAGEM,    
	tbl_taxonomy.SLUG,
	tbl_taxonomy.LEVEL,
	tbl_taxonomy.ORDEM,
	tbl_taxonomy.QT_RECORDS,
	tbl_taxonomy.ANOTACOES,
	tbl_taxonomy.META_TITLE,
	tbl_taxonomy.META_DESCRIPTION
FROM
tbl_taxonomy
LEFT JOIN tbl_taxonomy AS tbl_taxonomy_father on tbl_taxonomy_father.ID_TAXONOMY = tbl_taxonomy.PARENT_ID
LEFT JOIN tbl_taxonomy AS tbl_taxonomy_grandfather on tbl_taxonomy_grandfather.ID_TAXONOMY = tbl_taxonomy_father.PARENT_ID
WHERE tbl_taxonomy.ID_SYSTEM_CLIENTE  = ?
    AND (
      (? IS NULL OR TRIM(?) = '')
      OR
      (? REGEXP '^[0-9]+$' AND (
        tbl_taxonomy.ID_TAXONOMY = CAST(? AS UNSIGNED)
        OR tbl_taxonomy.TAXONOMIA LIKE CONCAT('%', ?, '%')
      ))
      OR
      (? NOT REGEXP '^[0-9]+$' AND tbl_taxonomy.TAXONOMIA LIKE CONCAT('%', ?, '%'))
    )
ORDER BY TAXONOMIA  DESC  LIMIT 500;
`;
