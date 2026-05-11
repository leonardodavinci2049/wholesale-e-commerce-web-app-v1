export const PRODUCT_FIND_ID_SQL = `
  SELECT  
		tbl_produto.ID_TBL_PRODUTO AS ID_PRODUTO, 
		tbl_produto.ID_TBL_PRODUTO AS SKU, 	        
		
		tbl_produto.PRODUTO,
		tbl_produto.DESCRICAO_TAB,
		tbl_produto.ETIQUETA,                         
		tbl_produto.REF,                              
		tbl_produto.MODELO, 
		
		tbl_produto.PATH_IMAGEM, 
 		tbl_produto.PATH_PAGE, 		
		tbl_produto.SLUG,   
		
		tbl_produto.ID_TIPO,  
		tbl_produto_tipo.TIPO,         
		tbl_produto_marca.ID_MARCA,  
		tbl_produto_marca.NOME AS MARCA,
 		tbl_produto_marca.PATH_IMAGEM as PATH_IMAGEM_MARCA,       
		
		tbl_produto_preco.VL_ATACADO1 AS VL_ATACADO, 
		tbl_produto_preco.VL_CORPORATIVO1 AS VL_CORPORATIVO,
		tbl_produto_preco.VL_VAREJO1 AS VL_VAREJO, 
		tbl_produto_preco.OURO,                       
		tbl_produto_preco.PRATA,                      
		tbl_produto_preco.BRONZE,       
		
		tbl_produto_estoque.ESTOQUE_LOJA1 AS ESTOQUE_LOJA,          
		
		tbl_produto.TEMPODEGARANTIA_DIA,
		tbl_produto.PESO_GR,
		tbl_produto.COMPRIMENTO_MM,
		tbl_produto.LARGURA_MM ,
		tbl_produto.ALTURA_MM,
		tbl_produto.DIAMETRO_MM,  
 		
		tbl_produto.CFOP,                                   
		tbl_produto.CST,           
		tbl_produto.EAN,                                    
		tbl_produto.NCM,                                    
		tbl_produto.NBM,                                    
		tbl_produto.PPB,                                    
		tbl_produto.TEMP,          
        
		
		tbl_produto.DESTAQUE,
		tbl_produto.PROMOCAO,
		tbl_produto.FLAG_SERVICO,
		tbl_produto.IMPORTADO,
        
		tbl_produto.META_TITLE,     
		tbl_produto.META_DESCRIPTION, 
		tbl_produto.DT_UPDATE,         
		
		tbl_produto.DESCRICAO_VENDA, 
		tbl_produto.ANOTACOES,
        tbl_produto.DATADOCADASTRO     
	  FROM                                          
		 tbl_produto   
	  INNER JOIN tbl_produto_preco ON  tbl_produto_preco.ID_PRODUTO = tbl_produto.ID_tbl_produto  
	  INNER JOIN tbl_produto_estoque ON  tbl_produto_estoque.ID_PRODUTO = tbl_produto.ID_tbl_produto  
	  LEFT JOIN tbl_produto_marca ON  tbl_produto_marca.ID_MARCA = tbl_produto.ID_MARCA        
	  LEFT JOIN tbl_produto_tipo ON tbl_produto_tipo.ID_TIPO = tbl_produto.ID_TIPO 
      WHERE tbl_produto.ID_SYSTEM_CLIENTE = ?                          
      AND tbl_produto.ID_TBL_PRODUTO = ?         
      LIMIT 1;
` as const;
