// PE_SYSTEM_CLIENT_ID → param[0]
// PE_INATIVO          → params[1..2] > 2 = ativo, 1 = inativo, NULL = todos
// PE_SEARCH           → params[3..9] (7 ocorrências na cláusula WHERE)
export const PRODUCT_LIST_DESCRIPTION_SQL = `
  SELECT
    tbl_produto.ID_TBL_PRODUTO AS ID_PRODUTO,
    tbl_produto.ID_TBL_PRODUTO AS SKU,
    tbl_produto.PRODUTO,
    tbl_produto.REF,
    tbl_produto.MODELO,
    tbl_produto.PATH_PAGE,
    tbl_produto.DESCRICAO_VENDA,
    (SELECT CONCAT('[', 
            GROUP_CONCAT(                   
                  JSON_OBJECT(
                  'ID_TAXONOMY', rel.ID_TAXONOMY,
                  'TAXONOMIA', tax.TAXONOMIA
                    )
                    ORDER BY rel.ID_TAXONOMY ASC
                  SEPARATOR ','
                  ), 
          ']')
      FROM tbl_taxonomy_rel rel
      INNER JOIN tbl_taxonomy tax ON tax.ID_TAXONOMY = rel.ID_TAXONOMY
      AND rel.ID_SYSTEM_CLIENTE = tbl_produto.ID_SYSTEM_CLIENTE
        WHERE rel.ID_RECORD = tbl_produto.ID_TBL_PRODUTO
  ) AS CATEGORIAS ,   
    tbl_produto.ANOTACOES,
    tbl_produto.DATADOCADASTRO
  FROM tbl_produto
  INNER JOIN tbl_produto_marca   ON tbl_produto_marca.ID_MARCA     = tbl_produto.ID_MARCA
  INNER JOIN tbl_produto_tipo    ON tbl_produto_tipo.ID_TIPO       = tbl_produto.ID_TIPO
  WHERE tbl_produto.ID_SYSTEM_CLIENTE = ?
    AND tbl_produto.FLAG_LOOP = 0
    AND (? IS NULL OR tbl_produto.INATIVO = ?)

    AND (
      (? IS NULL OR TRIM(?) = '')
      OR
      (? REGEXP '^[0-9]+$' AND (
        tbl_produto.ID_TBL_PRODUTO = CAST(? AS UNSIGNED)
        OR tbl_produto.PRODUTO LIKE CONCAT('%', ?, '%')
      ))
      OR
      (? NOT REGEXP '^[0-9]+$' AND tbl_produto.PRODUTO LIKE CONCAT('%', ?, '%'))
    )

  ORDER BY tbl_produto.PRODUTO ASC
  LIMIT 100
`;
