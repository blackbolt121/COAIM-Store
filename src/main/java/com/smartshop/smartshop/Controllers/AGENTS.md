# AGENTS.md - Spring Controllers Map

Use this folder to find the controller that owns a route before editing templates or APIs.

Fast path: read `CHEATSHEET.md` first, then come back here for module details.

## Admin shell

Start with `AdminController.java` for legacy admin pages.

It owns:

- `/admin` redirect to dashboard
- `/admin/login` login page
- `/admin/dashboard` dashboard shell
- `/admin/users` users page
- `/admin/orders` orders page
- `/admin/order/{id}` order edit page
- `/admin/quotes` quote builder page
- `/admin/quotes/all` quotes list page
- `/admin/products` products page
- `/admin/product/{id}` product page
- `/admin/usuario/{id}` user detail page
- `/admin/usuario/edit/{id}` user edit page
- `/admin/rest/logout` legacy logout API

## Carousel

### Legacy Thymeleaf controller

- `PromotionAdminController.java`

Routes:

- `/admin/promotions`
- `/admin/promotions/create`
- `/admin/promotions/edit/{id}`
- `/admin/promotions/delete/{id}`

### REST API controller

- `PromotionController.java`

Routes:

- `GET /rest/api/1/promotions`
- `GET /rest/api/1/promotions/{id}`
- `GET /rest/api/1/promotions/{id}/image`
- `POST /rest/api/1/promotions`
- `PUT /rest/api/1/promotions/{id}`
- `PUT /rest/api/1/promotions/{id}/image`
- `DELETE /rest/api/1/promotions/{id}`

### Admin REST controller

- `PromotionAdminApiController.java`

Routes mirror the CRUD flow under `/rest/api/1/admin/promotions`.

## Cotizaciones

- `QuotesController.java` for public/user REST
- `AdminController.java` for legacy admin UI pages

Key routes:

- `GET /rest/api/1/quotes`
- `GET /rest/api/1/quotes/{id}`

## Productos

- `ProductController.java` for product REST
- `AdminController.java` for legacy admin UI pages

Key routes:

- `GET /rest/api/1/producto/all`
- `GET /rest/api/1/producto/search`
- `GET /rest/api/1/producto?id=...`
- `POST /rest/api/1/producto`
- `PUT /rest/api/1/producto?id=...`
- `GET /rest/api/1/producto/categorias`
- `GET /rest/api/1/producto/top`

## Usuarios

- `AdminApiController.java` for the Next.js admin REST
- `AdminController.java` for legacy Thymeleaf pages

Key routes:

- `GET /rest/api/1/admin/users`
- `GET /rest/api/1/admin/users/{id}`
- `PUT /rest/api/1/admin/users/{id}`

## Lookup order

1. Find the route in `AdminController.java` or the module controller
2. Find the template in `src/main/resources/templates/`
3. Check whether Next already has a route under `admin/app/`
4. Inspect `admin/lib/api.ts` for the client call
5. Follow the service/repository/model if the bug is data-related
