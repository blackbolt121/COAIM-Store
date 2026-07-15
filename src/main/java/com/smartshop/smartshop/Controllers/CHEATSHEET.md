# Controllers Cheat Sheet

Start with `AdminController.java` unless the module has its own controller.

## AdminController

- `/admin/dashboard` -> `panel.html`
- `/admin/login` -> `login.html`
- `/admin/users` -> `usuarios.html`
- `/admin/orders` -> `pedidos.html`
- `/admin/order/{id}` -> `pedido_edit.html`
- `/admin/quotes` -> `cotizador.html`
- `/admin/quotes/all` -> `cotizaciones.html`
- `/admin/products` -> `productos.html`
- `/admin/product/{id}` -> `producto.html`
- `/admin/usuario/{id}` -> `usuario.html`
- `/admin/usuario/edit/{id}` -> `usuario-editar.html`

## Carousel

- `PromotionAdminController.java` for legacy UI
- `PromotionController.java` for REST
- `PromotionAdminApiController.java` for admin REST

Key routes:

- `/admin/promotions`
- `/admin/promotions/create`
- `/admin/promotions/edit/{id}`
- `/rest/api/1/promotions`
- `/rest/api/1/admin/promotions`

## Cotizaciones

- `QuotesController.java` -> `/rest/api/1/quotes`
- `AdminController.java` -> legacy pages

## Productos

- `ProductController.java` -> `/rest/api/1/producto/*`
- `AdminController.java` -> legacy pages

## Usuarios

- `AdminApiController.java` -> `/rest/api/1/admin/users`
- `AdminController.java` -> legacy pages

## Lookup order

1. Route in controller
2. Template in `src/main/resources/templates/`
3. Next route in `admin/app/`
4. API helper in `admin/lib/api.ts`
