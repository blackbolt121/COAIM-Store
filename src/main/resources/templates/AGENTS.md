# AGENTS.md - Legacy Thymeleaf Templates

Use this folder when you need to migrate or inspect old admin screens.

Fast path: read `CHEATSHEET.md` first, then come back here for module context.

## First stop

Read `panel.html` first. It defines the legacy admin shell and sidebar links.

## Module map

### Carousel

- `promotions.html` list page
- `promotion_form.html` create/edit form
- `panel.html` shared shell/navigation

### Cotizaciones

- `cotizador.html` quote builder form
- `cotizaciones.html` quotes list
- `panel.html` shared shell/navigation

### Productos

- `productos.html` product list and filters
- `producto.html` product detail/edit view
- `panel.html` shared shell/navigation

### Usuarios

- `usuarios.html` user list
- `usuario.html` user detail view
- `usuario-editar.html` user edit form
- `panel.html` shared shell/navigation

## Supporting templates

- `login.html` legacy admin login
- `errors/notfound_admin.html` admin 404 page
- `fragments/_pagination.html` reusable pagination

## Reading order

1. `panel.html`
2. Module list template
3. Module form/detail template
4. Supporting fragments
5. Error templates only if the route redirects or handles missing records

## Rule of thumb

If the feature exists in Next.js admin and Thymeleaf, update Next.js first unless the task explicitly targets the legacy template.
