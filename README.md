# cpo-apple
certified refurb

## Idioma (ES/EN)

El sitio incluye un selector de idioma (ES/EN) en la cabecera de cada página. Es 100% JavaScript (sin backend), pensado para hosting estático como GitHub Pages.

**Cómo funciona:**
- Cada texto traducible del HTML está envuelto en `<span data-i18n="clave">Texto</span>`.
- Los textos de atributos (`title`, meta `content`, `alt`, `placeholder`, `aria-label`) usan `data-i18n-attr="atributo:clave"`.
- Todas las traducciones viven en dos ficheros JSON planos:
  - `assets/i18n/es.json`
  - `assets/i18n/en.json`
- `assets/js/i18n.js` lee el idioma guardado (o el del navegador) y aplica las traducciones al cargar la página, sin recargar.
- El idioma elegido se guarda en `localStorage` y se recuerda entre páginas.

**Para editar un texto**, busca su clave (ej. `index.t58`) en `assets/i18n/es.json` y `assets/i18n/en.json` y cambia el valor. No hace falta tocar el HTML. Las claves son las mismas en ambos ficheros, así que siempre debes actualizar los dos idiomas.

**Para añadir un texto nuevo** en una página: envuélvelo en `<span data-i18n="pagina.nueva-clave">Texto</span>` y añade esa clave a `es.json` y `en.json`.

## Por qué no PHP

Este repo se despliega en GitHub Pages (ver `CNAME`), que solo sirve ficheros estáticos y no ejecuta PHP. Por eso el sistema de idiomas y la organización del código se resolvieron con JS + JSON en lugar de includes PHP.

## Deploy

Sube el contenido de esta carpeta tal cual a la rama que sirva GitHub Pages (o a cualquier hosting estático). No requiere build ni dependencias.
