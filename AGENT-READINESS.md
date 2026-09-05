# Agent readiness · preparación local

Propietario: Arturo Villagomez. Rama: feat/agent-readiness.
Base pública inspeccionada: 819a4439829e02fc105207d0c503e018101daa20 (B10 v2.8).
Estado: preparado para revisión; sin commit, publicación, cambio de DNS o alojamiento.
Mandato: auditoría Is Agentic / Ora compartida por Arturo (73/100, puntuación declarada, no recalculada aquí).

## Implementación y límites

1. Negociación: adaptador Node de referencia para HTML y Markdown en /, /about/, /contact/ y /privacy/. Usa negotiator, Vary: Accept, Accept-Encoding, ETags por variante, HEAD y 406. No usa detección de bots. La caché se desactiva deliberadamente; antes de activarla en un CDN se requiere clave separada por representación, prueba de orden HTML→MD/MD→HTML y validación de 304. GitHub Pages no ejecutará este adaptador.
2. Instrucciones: llms.txt sigue el formato de listas de archivos de la propuesta v2. El enlace When to use conduce a agent-instructions.md, con trabajos concretos, límites y contacto sujeto a autorización. No hay API ni contratación automática.
3. Descubrimiento: título y dominio canónico conservados, Person enlazada a WebSite, referencias de identidad y enlaces de navegación a las páginas de confianza; sitemap ampliado. Esto no garantiza clasificación de marca ni citas. Search Console y Bing requieren acceso y evaluación posterior a publicación.
4. 404: página HTML con recuperación y un cuerpo Markdown visible, más 404.md. Rutas desconocidas reciben 404 real en el adaptador, con respuesta Markdown negociada. Pages conservará su mecanismo nativo de 404 HTML hasta cambiar la infraestructura.
5. Sin JavaScript: el contenido de lectura y Markdown se generan directamente de data()/renderVals() del componente existente de B10, sin copiar a mano los expedientes. El fallback sólo se oculta cuando componentDidMount confirma el montaje. El stylesheet original se extrajo sin modificar reglas. No se cambiaron fotografías, galerías, lenguaje ni mecanismos interactivos.
6. Identidad: Person es el propietario, editor y titular del sitio; AMEZ CFO sólo aparece en worksFor. ContactPoint usa el email público. PostalAddress sólo declara la localidad previamente publicada, sin calle, domicilio personal ni teléfono inventados. No se crea una Organization ficticia para satisfacer la auditoría.
7. Páginas de confianza: /about/, /contact/ y /privacy/ contienen HTML estático y versiones Markdown. Privacidad describe el código y proveedores observados, no promete ausencia de logs ni plazos desconocidos. Requiere revisión del propietario antes de publicarse; no es una certificación de cumplimiento jurídico.

## Fuente y mantenimiento

- index.html: componente interactivo propietario del contenido de la landing.
- content/site-information.mjs: propiedad, contacto, orientación para agentes y texto de privacidad.
- scripts/build-agent-content.mjs: genera artefactos; no editar las copias HTML/Markdown generadas.
- agent-readiness-manifest.json: integridad de esta preparación; el manifiesto de B10 v2.8 queda como registro histórico de su release, no como hash de los archivos actuales.
- El estado anterior de Pafi y las imágenes de los portafolios se preservan en esta ronda. Su actualización editorial es otro incremento aprobado del plan general.

## Comandos

Con Node 22+ y pnpm:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm build
pnpm check
pnpm test
pnpm preview
node scripts/audit-endpoints.mjs http://127.0.0.1:8798 --out=tmp/local-audit.json
node scripts/audit-endpoints.mjs https://arturovillagomez.com --out=tmp/public-audit.json
```

El servidor de referencia escucha únicamente en localhost. No es un proceso desplegado ni una configuración de producción. Para publicación estática, se necesitan los HTML, Markdown, CSS, sitemap y activos existentes; package.json y el servidor no hacen funcionar negociación en Pages.

## Gate de publicación posterior

- Revisión humana de las páginas nuevas, especialmente privacidad y localidad profesional (el sitio actual dice Ciudad de México; un resultado público de LinkedIn muestra Mérida).
- Confirmar condiciones de tratamiento/conservación del correo sin inventarlas.
- Publicar el paquete estático mediante el flujo autorizado de PR y release.
- Repetir el audit HTTP sobre el dominio: contenido, enlaces, MIME, sitemap, robots y 404.
- Cuando se apruebe otra infraestructura, adaptar la negociación al proveedor y probar caché, TLS, redirects, dominio canónico y no regresión. No hay cambio de hosting autorizado en esta ronda.
- Verificar indexación y búsqueda de marca con Search Console/Bing; las menciones de terceros requieren gestiones reales, no contenido ficticio.
- Repetir Ora si se desea una puntuación actualizada. Los tests locales no equivalen a un score Is Agentic.

## Protocolos consultados

- https://acceptmarkdown.com/start
- https://acceptmarkdown.com/guides/accept-parsing
- https://acceptmarkdown.com/guides/caching-cdn
- https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.1
- https://llmstxt.org/
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement
