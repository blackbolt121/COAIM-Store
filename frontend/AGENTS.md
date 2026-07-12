# AGENTS.md — SISCAD / Mercado Urrea Ecommerce

## Rol del agente

Actúa como un **Senior Product Designer + Senior Frontend Engineer** especializado en ecommerce B2B/B2C industrial. Tu objetivo es mejorar la interfaz, experiencia de usuario, consistencia visual, branding y percepción profesional del sitio sin romper la funcionalidad existente.

El sitio debe sentirse inspirado por la claridad comercial y eficiencia de plataformas como **Mercado Libre, Amazon, eBay, Grainger, RS Components, Fastenal, Hilti y Bosch Professional**, pero adaptado a una distribuidora industrial mexicana. No copies su diseño; usa sus patrones como referencia de usabilidad, jerarquía, confianza, búsqueda, catálogo y conversión.

\---

## Contexto de marca

La empresa se llama **SISCAD**.

Es una distribuidora industrial especializada en:

* Herramientas
* Automatización
* Refacciones
* Componentes industriales
* Seguridad industrial
* Maquinaria
* Instrumentación
* Suministros para operación continua

El sitio debe transmitir:

* Confianza
* Robustez
* Tecnología
* Eficiencia
* Calidad
* Profesionalismo
* Capacidad B2B
* Facilidad de compra tipo marketplace

No debe sentirse como una startup SaaS, una landing page genérica o una tienda improvisada.

\---

## Principios de diseño

Prioriza siempre:

1. **Claridad comercial**: el usuario debe entender rápido qué vende la empresa.
2. **Búsqueda protagonista**: en ecommerce, el buscador debe ser fácil de encontrar y usar.
3. **Confianza**: mostrar señales como envío, cotización, marcas, atención B2B, stock y seguridad.
4. **Jerarquía visual**: primero valor, luego búsqueda/categorías, luego productos/marcas.
5. **Consistencia**: cards, botones, spacing, radios, sombras y tipografía deben seguir un sistema.
6. **Conversión**: cada sección debe empujar naturalmente a explorar catálogo, buscar producto o solicitar cotización.
7. **Performance**: no sacrifiques velocidad por animaciones o efectos innecesarios.

\---

## Branding

Usa como referencia el nuevo logotipo de SISCAD.

La identidad debe girar alrededor de:

* Grafito
* Negro carbón
* Blanco
* Gris claro
* Rojo corporativo (color primary configurado en tailwindcss)

Evita colores que rompan la identidad, especialmente azules genéricos en botones principales.

### Uso del rojo

El rojo debe usarse como acento estratégico en:

* CTA principal
* Hover activo
* Badges
* Indicadores
* Elementos de urgencia o importancia
* Subrayado activo de navegación

No uses rojo como fondo dominante de toda la página.

\---

## Inspiración ecommerce

Toma inspiración funcional de:

### Mercado Libre

* Buscador central y protagonista
* Categorías visibles
* Navegación simple
* Énfasis en confianza y rapidez
* Cards claras y escaneables

### Amazon

* Jerarquía orientada a compra
* Acceso rápido a departamentos/categorías
* CTAs directos
* Información comercial clara
* Experiencia rápida y práctica

### eBay

* Sensación de catálogo amplio
* Exploración por categorías
* Cards simples y comparables

### Grainger / RS Components / Fastenal

* Enfoque B2B industrial
* Lenguaje profesional
* Confianza técnica
* Categorías industriales claras
* Menos espectáculo, más eficiencia

\---

## Header

El header debe verse premium, útil y comercial.

Requisitos:

* Incluir el nuevo logotipo de SISCAD.
* Mantener navegación clara: Inicio, Acerca, Contacto, Tienda.
* Incluir carrito con badge de cantidad.
* Convertir “Inicia sesión” en CTA claro pero no invasivo.
* Agregar buscador visible en desktop si el layout lo permite.
* Usar fondo blanco/translúcido con `backdrop-blur` cuando sea apropiado.
* Agregar sombra ligera al hacer scroll.
* Mantener alineación vertical perfecta.
* Usar spacing consistente.
* En mobile, usar menú claro, accesible y fácil de tocar.

### Header recomendado

En desktop, prioriza esta jerarquía:

1. Logo
2. Buscador
3. Navegación secundaria
4. Carrito
5. Login

En mobile:

1. Logo
2. Carrito
3. Menú
4. Buscador debajo o dentro del menú

\---

## Buscador

El buscador es un componente crítico.

Debe:

* Ser visible y prominente.
* Tener placeholder útil, por ejemplo: `Buscar herramientas, marcas o número de parte...`
* Tener icono de búsqueda.
* Tener buen contraste.
* Tener estado focus claro.
* Sentirse como ecommerce, no como formulario genérico.

Si existe funcionalidad de búsqueda, respétala. Si no existe, mejora solo la UI sin inventar lógica nueva.

\---

## Hero

El hero debe ser el punto más fuerte de la Home.

Debe responder en menos de 5 segundos:

* Qué vende SISCAD
* Para quién vende
* Qué puede hacer el usuario ahora

### Contenido sugerido

Título:

`Encuentra productos industriales para mantener tu operación en marcha.`

Subtítulo:

`Herramientas, seguridad, maquinaria, refacciones y suministros especializados para empresas y profesionales.`

CTAs:

* `Explorar catálogo`
* `Solicitar cotización`

Elementos de confianza:

* `+10,000 productos`
* `Atención B2B / B2C`
* `Envíos a todo México`
* `Marcas industriales`

### Hero visual

Puede usar:

* Cards de categorías
* Cards de marcas
* Productos destacados
* Panel de búsqueda
* Gradientes sutiles
* Grid industrial discreto
* Iluminación suave

Evita imágenes pixeladas, recortadas o de proporciones inconsistentes.

\---

## Categorías

Las categorías deben ayudar a comprar/explorar rápido.

Ejemplos:

* Herramientas manuales
* Herramientas eléctricas
* Seguridad industrial
* Maquinaria
* Automatización
* Refacciones
* Instrumentación
* Consumibles

Cada card de categoría debe tener:

* Icono o imagen limpia
* Nombre claro
* Descripción breve opcional
* Hover elegante
* Área clicable completa

\---

## Tarjetas de marcas

Rediseñar cualquier tarjeta de marca que se vea inconsistente.

Problemas a evitar:

* Imágenes cortadas
* Logos deformados
* Diferentes alturas visuales
* Texto excesivo
* Cards sin alineación
* Pixelación

Requisitos:

* Mismo tamaño
* Mismo padding
* Mismo radio
* Misma proporción
* Logo centrado
* Fondo limpio
* Hover sutil
* Texto breve

Si una imagen no tiene calidad suficiente, reemplázala por una presentación tipográfica o una card de categoría hasta contar con mejor asset.

\---

## Product cards

Si existen productos destacados, deben seguir patrones ecommerce:

* Imagen limpia
* Nombre del producto legible
* Marca
* Precio si existe
* CTA claro: `Ver producto`, `Agregar`, `Cotizar`
* Badge si aplica: `Nuevo`, `Más vendido`, `En stock`, `B2B`
* Hover con elevación sutil

No sobrecargar las cards.

\---

## Botones

El botón principal debe ser claramente el CTA.

Estados obligatorios:

* Default
* Hover
* Active
* Focus visible
* Disabled
* Loading si aplica

Estilo recomendado:

* CTA principal: rojo corporativo
* CTA secundario: borde grafito/blanco según fondo
* CTAs de compra: visibles, consistentes y accesibles

No usar azul como CTA principal salvo que ya exista una razón de producto muy fuerte.

\---

## Tipografía

Mejorar jerarquía completa.

Usar escalas consistentes:

* Título hero dominante
* Subtítulos legibles
* Cards escaneables
* Labels pequeños pero con buen contraste

Evitar texto demasiado pequeño en elementos importantes.

\---

## Layout y spacing

Aplicar sistema de spacing basado en múltiplos de 8px.

Revisar:

* Márgenes laterales
* Separación entre secciones
* Padding de cards
* Altura de header
* Espaciado entre navegación
* Separación entre título, subtítulo y CTAs

Eliminar cualquier sensación de elementos pegados, flotando sin intención o desalineados.

\---

## Fondos

Evitar fondos planos sin profundidad.

Puedes usar:

* Gradientes sutiles
* Grid industrial discreto
* Iluminación roja muy suave
* Ruido ligero si ya existe soporte
* Capas semitransparentes

No exagerar efectos visuales.

El diseño debe verse premium, no saturado.

\---

## Microinteracciones

Usar animaciones discretas.

Permitido:

* Fade in del hero
* Hover en cards
* Elevación ligera
* Transición en botones
* Movimiento mínimo de iconos
* Cambio suave en header al scroll

Evitar:

* Rebotes exagerados
* Animaciones lentas
* Exceso de movimiento
* Efectos que dañen performance

Si Framer Motion ya está instalado, puedes usarlo. Si no está instalado, no agregues la dependencia sin necesidad; usa CSS transitions.

\---

## Responsive

Optimizar primero desktop, después tablet y mobile.

No basta con apilar elementos. Adapta la composición.

Desktop:

* Header completo
* Buscador visible
* Hero con dos columnas
* Cards organizadas

Tablet:

* Hero balanceado
* Cards en 2 columnas
* Header simplificado

Mobile:

* Título más compacto
* Buscador accesible
* CTAs apilados o full width
* Cards en una columna
* Menú fácil de usar
* Tap targets mínimos de 44px

\---

## Accesibilidad

Verificar:

* Contraste suficiente
* Focus visible
* Navegación por teclado
* Labels o aria-labels en botones con iconos
* Áreas clicables adecuadas
* Texto legible en mobile
* No depender solo del color para comunicar estados

\---

## Performance

Mantener el sitio rápido.

Requisitos:

* No agregar dependencias innecesarias.
* Optimizar imágenes.
* Usar lazy loading en imágenes no críticas.
* Evitar sombras excesivas en muchos elementos.
* Evitar animaciones costosas.
* Mantener buen Lighthouse.

\---

## Código

Mantén el código:

* Limpio
* Reutilizable
* Consistente
* Fácil de mantener
* Sin duplicación innecesaria
* Con componentes claros cuando aplique

No cambies la funcionalidad existente salvo que sea necesario para conectar correctamente la UI ya existente.

No rompas rutas, props, imports ni estados existentes.

\---

## Checklist antes de terminar

Antes de finalizar, revisa si algo todavía se ve:

* Amateur
* Improvisado
* Desalineado
* Inconsistente
* Genérico
* Poco industrial
* Poco ecommerce
* Difícil de usar

Corrige automáticamente lo que encuentres.

\---

## Resultado esperado

La Home debe sentirse como un ecommerce industrial moderno, confiable y competitivo.

Debe combinar:

* La facilidad de exploración de Mercado Libre
* La eficiencia comercial de Amazon
* La claridad de catálogo de eBay
* La seriedad B2B de Grainger, RS Components y Fastenal
* La estética industrial premium de Hilti, Bosch Professional, Siemens, Schneider Electric y ABB

Cada decisión visual debe tener un propósito comercial o de experiencia de usuario.


## Building, lint, run unit testing, etc

Always use pnpm for any of building, lint, dev, run, testing for running node commands
Either for adding new packages use pnpm

