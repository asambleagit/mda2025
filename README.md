# mda2025
Sitio  Web del Departamento de Información y Servicio Voluntario


### 4.2. Plano Interactivo (`plano.js` + `plano.svg` + `plano-config.json`)

Esta es la funcionalidad más compleja del sitio. Es un módulo autónomo que se ejecuta en un modal a pantalla completa.

- **Cómo funciona**:
    1.  **`plano.js`** utiliza **Leaflet.js** para crear un lienzo de mapa desplazable y ampliable.
    2.  Obtiene y superpone el archivo **`plano.svg`** en el mapa de Leaflet.
    3.  Obtiene **`plano-config.json`** para cargar todas las configuraciones, definiciones de capas, detalles de las plantas y el contenido de texto/HTML para cada punto interactivo.
    4.  El archivo SVG (`plano.svg`) tiene sus elementos organizados en grupos (`<g>`) con IDs específicos que corresponden a las capas y plantas definidas en el archivo de configuración.
- **Controlando el Mapa**:
    - La función global `plano(floor, layer, elementId)` es la forma principal de interactuar con el mapa desde `index.html`.
    - **`floor`**: `0` para Planta Baja, `1` para Planta Alta.
    - **`layer`**: Una clave de texto del objeto `layers` en `plano-config.json` (p. ej., 'departamentos', 'evacuacion').
    - **`elementId`**: El ID base de un elemento a resaltar (p. ej., 'AuditorioPrincipal'). El script encontrará los elementos correspondientes de icono (`icoAuditorioPrincipalPA`) y de resaltado (`hlAuditorioPrincipalPA`) en el SVG.
- **Modificando el Mapa**:
    - **Para añadir un nuevo punto interactivo**:
        1.  Añade un nuevo elemento de icono (p. ej., `<g id="icoNuevoPuntoPB">...`) al grupo de capa correcto en **`plano.svg`**.
        2.  Opcionalmente, añade una forma de resaltado (p. ej., `<g id="hlNuevoPuntoPB">...`).
        3.  Añade una nueva entrada en el objeto `informacion` en **`plano-config.json`** con la clave "NuevoPunto" (el ID base). Esta entrada debe contener el `title` y el `content` para el pop-up.
    - **Para cambiar el contenido de un pop-up**: Edita la entrada correspondiente en el objeto `informacion` en `plano-config.json`.