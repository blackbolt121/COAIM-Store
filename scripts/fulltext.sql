ALTER TABLE producto ADD FULLTEXT INDEX ft_producto_search (sku, name, description, category);
