// PE_SYSTEM_CLIENT_ID → param[0]
// PE_INATIVO          → params[1..2] > 2 = ativo, 1 = inativo, NULL = todos
// PE_SEARCH           → params[3..9] (7 ocorrências na cláusula WHERE)
export const PRODUCT_LIST_SQL = `
  SELECT
    tbl_produto.ID_TBL_PRODUTO AS ID_PRODUTO,
    tbl_produto.ID_TBL_PRODUTO AS SKU,

    tbl_produto.PRODUTO,

    tbl_produto_estoque.ESTOQUE_LOJA1 AS ESTOQUE_LOJA,

    CASE 1
      WHEN 1 THEN 'REVENDA'
      WHEN 2 THEN 'CORPORATIVO'
      WHEN 3 THEN 'VAREJO'
      ELSE 'VALOR VAREJO'
    END AS TIPO_VALOR,

    CASE 1
      WHEN 1 THEN tbl_produto_preco.VL_ATACADO1
      WHEN 2 THEN tbl_produto_preco.VL_CORPORATIVO1
      WHEN 3 THEN tbl_produto_preco.VL_VAREJO1
      ELSE tbl_produto_preco.VL_VAREJO1
    END AS VALOR_PRODUTO,

    tbl_produto_preco.VL_ATACADO1     AS VL_ATACADO,
    tbl_produto_preco.VL_CORPORATIVO1 AS VL_CORPORATIVO,
    tbl_produto_preco.VL_VAREJO1      AS VL_VAREJO,

    tbl_produto.DESCRICAO_TAB,
    tbl_produto.ETIQUETA,
    tbl_produto.REF,
    tbl_produto.MODELO,

    tbl_produto.ID_TIPO,
    tbl_produto_tipo.TIPO,
    tbl_produto.ID_MARCA,
    tbl_produto_marca.NOME        AS MARCA,
    tbl_produto_marca.PATH_IMAGEM AS PATH_IMAGEM_MARCA,

    tbl_produto.ID_IMAGEM,
    tbl_produto.PATH_IMAGEM,
    tbl_produto.PATH_PAGE,
    tbl_produto.SLUG,

    tbl_produto_preco.TX_PRODUTO_LOJA1 AS TX_PRODUTO_LOJA,
    tbl_produto_preco.OURO,
    tbl_produto_preco.PRATA,
    tbl_produto_preco.BRONZE,
    tbl_produto_preco.DECONTO1 AS DECONTO,

    tbl_produto.TEMPODEGARANTIA_MES,
    tbl_produto.TEMPODEGARANTIA_DIA,
    tbl_produto.DESCRICAO_VENDA,

    tbl_produto.IMPORTADO,
    tbl_produto.PROMOCAO,
    tbl_produto.LANCAMENTO,
    tbl_produto.DATADOCADASTRO

  FROM tbl_produto
  INNER JOIN tbl_produto_preco   ON tbl_produto_preco.ID_PRODUTO   = tbl_produto.ID_tbl_produto
  INNER JOIN tbl_produto_estoque ON tbl_produto_estoque.ID_PRODUTO = tbl_produto.ID_tbl_produto
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
