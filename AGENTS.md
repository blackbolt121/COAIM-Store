# AGENTS.md — Migration Map

Use this file to find the right place fast when migrating legacy Thymeleaf screens to Next.js.

## First question

Before editing anything, identify which layer owns the feature:

1. Thymeleaf legacy UI
2. Next.js admin UI
3. Spring REST/API
4. Shared backend model or service

## Where to look

If you need the shortest possible path, start with these cheat sheets:

- `src/main/resources/templates/CHEATSHEET.md`
- `src/main/java/com/smartshop/smartshop/Controllers/CHEATSHEET.md`

### Legacy Thymeleaf admin

Path: `src/main/resources/templates/`

For a fast scan, read `src/main/resources/templates/CHEATSHEET.md` first.

Good starting points:

- `panel.html` for the old admin shell
- `promotions.html` for the carousel list
- `promotion_form.html` for create/edit forms
- other module pages like `productos.html`, `pedidos.html`, `usuarios.html`

If you are migrating a module, search these files first to understand old routes, labels, and fields.

### Next.js admin

Path: `admin/`

Important folders:

- `admin/app/` for pages and routes
- `admin/components/` for reusable UI
- `admin/lib/api.ts` for backend calls
- `admin/proxy.ts` for route protection
- `admin/AGENTS.md` for Next-specific warnings

If the feature already exists in Next, prefer extending it here instead of recreating it in Thymeleaf.

### Spring backend

Path: `src/main/java/com/smartshop/smartshop/`

For a fast scan, read `src/main/java/com/smartshop/smartshop/Controllers/CHEATSHEET.md` first when the issue is route- or controller-related.

Search in this order:

1. `Controllers/` for endpoints and route names
2. `Services/` for business logic
3. `Repositories/` for persistence queries
4. `Models/` for entity fields
5. `Config/` for security, CORS, and filters

For carousel migrations, check:

- `Controllers/PromotionController.java` for public REST
- `Controllers/PromotionAdminApiController.java` for admin REST
- `Controllers/PromotionAdminController.java` for legacy Thymeleaf admin
- `Models/Promotion.java` for the data contract
- `Services/PromotionService.java` for CRUD behavior

### Legacy admin controller map

If the screen belongs to the old admin shell, start with `Controllers/AdminController.java`.

It usually owns the navigation entry points and the shared admin layout flow:

- `/admin` redirects to the main admin landing
- `/admin/login` renders `login.html`
- `/admin/dashboard` renders `panel.html`
- `/admin/users` renders `usuarios.html`
- `/admin/orders` renders `pedidos.html`
- `/admin/order/{id}` renders `pedido_edit.html`
- `/admin/error` resolves admin error pages

Use this controller first when you need to understand which template is responsible for the legacy admin shell or where a route is coming from.

### Legacy carousel controller map

For the carousel module specifically, start with `Controllers/PromotionAdminController.java`.

It owns the Thymeleaf CRUD routes:

- `/admin/promotions` -> `promotions.html`
- `/admin/promotions/create` -> `promotion_form.html`
- `/admin/promotions/edit/{id}` -> `promotion_form.html`
- `/admin/promotions/delete/{id}` -> form post delete

When migrating the carousel, check these templates first:

- `src/main/resources/templates/promotions.html` for the list layout and actions
- `src/main/resources/templates/promotion_form.html` for create/edit fields and upload behavior
- `src/main/resources/templates/panel.html` for the shared admin shell and navigation links
- `src/main/resources/templates/login.html` if the route depends on the legacy auth flow
- `src/main/resources/templates/errors/notfound_admin.html` for admin-specific fallbacks

### Legacy cotizaciones controller map

For cotizaciones in the old admin shell, start with `Controllers/AdminController.java`.

Relevant routes:

- `/admin/quotes` -> `cotizador.html`
- `/admin/quotes` POST -> sends the quote and re-renders `cotizador.html`
- `/admin/quotes/all` -> `cotizaciones.html`

Also check `Controllers/QuotesController.java` for the REST endpoints used by the modern frontend:

- `/rest/api/1/quotes`
- `/rest/api/1/quotes/{id}`

Templates to inspect first:

- `src/main/resources/templates/cotizador.html` for the quote builder form
- `src/main/resources/templates/cotizaciones.html` for the quotes listing

### Legacy products controller map

For productos, start with `Controllers/AdminController.java` and `Controllers/ProductController.java`.

Relevant routes:

- `/admin/products` -> `productos.html`
- `/admin/product/{id}` -> `producto.html`

REST endpoints to inspect when migrating to Next:

- `/rest/api/1/producto/all`
- `/rest/api/1/producto/search`
- `/rest/api/1/producto?id=...`
- `/rest/api/1/producto` for create and update
- `/rest/api/1/producto/categorias`
- `/rest/api/1/producto/top`

Templates to inspect first:

- `src/main/resources/templates/productos.html` for the paginated list and filters
- `src/main/resources/templates/producto.html` for the detail/edit view

### Legacy users controller map

For usuarios, start with `Controllers/AdminController.java`.

Relevant routes:

- `/admin/users` -> `usuarios.html`
- `/admin/usuario/{id}` -> `usuario.html`
- `/admin/usuario/edit/{id}` -> `usuario-editar.html`

REST endpoints used by the Next admin already live in `Controllers/AdminApiController.java`:

- `/rest/api/1/admin/users`
- `/rest/api/1/admin/users/{id}`

Templates to inspect first:

- `src/main/resources/templates/usuarios.html` for the list
- `src/main/resources/templates/usuario.html` for the read view
- `src/main/resources/templates/usuario-editar.html` for the edit form

## Fast search order

When you need to migrate a screen, search in this order:

1. Route name in Thymeleaf templates
2. Matching route in `admin/app/`
3. API call in `admin/lib/api.ts`
4. Spring controller with the same path
5. Service/repository/model behind it

## Common migration patterns

### List page

- Find the Thymeleaf list template
- Find the Next page with the same module name
- Match the API used to fetch items
- Keep loading, empty, and error states

### Create/edit form

- Find the legacy form template and its field names
- Check whether the backend expects JSON or `multipart/form-data`
- Reuse a shared Next form component when possible
- Keep route separation if the module already uses separate create/edit pages

### Delete action

- Verify whether the old UI uses a form post or a REST delete
- Prefer the backend REST endpoint if it exists
- Add confirmation in the Next UI

## Node and build commands

Use `pnpm` for Node tasks inside `admin/` and `frontend/`.

Recommended checks:

- `pnpm lint`
- `pnpm build`

For Spring, use Gradle from the repo root.

Recommended checks:

- `gradle compileJava`
- `gradle test` when relevant

## Current migration hints

- The admin panel is already moving to Next.js under `admin/`.
- The legacy Thymeleaf screens still live under `src/main/resources/templates/`.
- The carousel module has both legacy and Next implementations, so verify which route is authoritative before editing.
- Public storefront UI rules live in `frontend/AGENTS.md`.
- Next admin-specific rules live in `admin/AGENTS.md`.

## Template reading order

When a legacy admin screen needs migration, read templates in this order:

1. `panel.html` to understand the shell and navigation
2. The module list template, for example `promotions.html`
3. The module form template, for example `promotion_form.html`
4. Supporting fragments such as `fragments/_pagination.html` if the page paginates
5. Error templates only if the route handles redirects or missing entities

For the modules covered in this repo, the practical order is:

1. `panel.html`
2. `cotizador.html` or `cotizaciones.html` for quotes
3. `productos.html` and `producto.html` for products
4. `usuarios.html`, `usuario.html`, and `usuario-editar.html` for users
5. `promotions.html` and `promotion_form.html` for carousel

## Rule of thumb

If a feature exists in both Thymeleaf and Next.js, update Next.js first unless the user explicitly asks to fix the legacy template.
