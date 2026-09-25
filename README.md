# 🌾 AgroGuasca - Del Campo al Comprador

**Plataforma Comunitaria de Comercialización Agropecuaria Directa**  
*Vereda La Trinidad, Sector San Francisco (Guasca, Cundinamarca)*

---

## 🎓 Información Académica
- **Estudiantes Autores:** Dilan Santiago Correa Gelves & Juan David Espitia Gutiérrez
- **Programa:** Ingeniería de Software
- **Asignatura:** Proyecto Integrador I
- **Docente:** Natalia Martínez
- **Institución:** Universidad de La Salle — Facultad de Ingeniería
- **Área de Énfasis:** Ingeniería de Software para el Desarrollo Rural
- **Alineación ODS:** 
  - **ODS 2:** Hambre Cero (reducción de pérdidas de alimentos en poscosecha).
  - **ODS 8:** Trabajo Decente y Crecimiento Económico (pago justo y directo al campesino).
  - **ODS 12:** Producción y Consumo Responsables (circuitos cortos y demanda anticipada).

---

## 📌 Resumen del Reto de Ingeniería (Koen, 2003)

- **Estado Actual (A):** Producción individual aislada, sin consolidación de la oferta, sin información previa de la demanda. Los excedentes de fresa orgánica, papa y derivados se regalan, se desechan o se dan al ganado porque el mercado local no paga el valor diferencial. En Colombia se pierden 9.76 millones de toneladas de alimentos al año; el **40.5% se pierde en la producción agropecuaria** (DNP, 2016).
- **Estado Deseado (B):** Oferta comunitaria consolidada (articulada por la Junta de Acción Comunal y la Cooperativa CooTrinidad), cosecha bajo demanda anticipada y circuitos cortos directos con compradores urbanos en Bogotá y Sabana Centro (ADR, 2024; FAO).

---

## 🚀 Estructura del Proyecto (~90% Finalizado y Funcional)

El aplicativo está compuesto por tres módulos interconectados y listos para usar sin necesidad de dependencias complejas de backend:

1. **`index.html` (Tienda Campesina y Marketplace):**
   - Catálogo interactivo de productos frescos y derivados (fresa orgánica, arándano andino, papa ecológica, zanahoria, yogurt artesanal, arequipe tradicional, canasta comunitaria).
   - Filtros dinámicos por categorías y buscador en tiempo real.
   - Carrito de compras flotante con cálculo automático de flete por zona (Bogotá Norte, Bogotá Centro/Chapinero, Sabana Centro, Guasca punto JAC).
   - **Módulo de Pedido por WhatsApp:** Genera un mensaje automático y estructurado con el desglose de productos, cantidades, dirección y total, abriendo WhatsApp directamente hacia la coordinación comunitaria.
   - Historias y fotos reales de los productores de San Francisco (Don Hernando, Doña Rosalba, Mateo Espitia, Cooperativa).

2. **`productor.html` (Panel del Productor Campesino y JAC):**
   - Interfaz con botones amplios diseñada para teléfonos móviles en zonas rurales.
   - Formulario para registrar y publicar nuevos lotes de cosecha con fecha estimada, cantidad y opción de **"Cosecha Bajo Demanda Anticipada"**.
   - Tabla interactiva para administrar lotes existentes.
   - Bandeja de pedidos de compradores recibidos en tiempo real (con cambio de estado: *Pendiente*, *Confirmado*, *En Ruta*, *Entregado* y botón de contacto al comprador).
   - Métricas en vivo (lotes activos, kilos ofertados, pedidos e ingresos directos).

3. **`proyecto.html` (Ficha Académica y Diagnóstico Interactivo):**
   - Visualizador interactivo del **Árbol de Problemas** (Causas Raíz -> Problema Focal -> Efectos Graves).
   - Visualizador del **Árbol de Objetivos y Transición de Estados (A → B)**.
   - Fundamentación bajo el método de Koen (2003) y metodología Scrum adaptada en 5 fases.
   - Estadísticas del DNP (2016), ADR (2024) y FAO.
   - Opción para imprimir o exportar como reporte PDF académico.

---

## 💻 ¿Cómo abrir y ejecutar el proyecto en VS Code?

### Opción 1: Con la extensión Live Server (Recomendado)
1. Abre la carpeta `Problema Guasca` en Visual Studio Code.
2. Si tienes la extensión **Live Server** (ID: `ritwickdey.liveserver`), haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.
3. Se abrirá automáticamente tu navegador en `http://127.0.0.1:5500/index.html`.

### Opción 2: Con Python (Ya instalado en tu equipo)
Abre la terminal de VS Code (`Ctrl + ñ` o `Terminal > New Terminal`) y ejecuta:
```bash
python -m http.server 8000
```
Luego abre en tu navegador:
```
http://localhost:8000
```

### Opción 3: Directo en el navegador
Solo haz doble clic sobre el archivo `index.html` en el explorador de archivos de Windows.

---

## 🌐 ¿Cómo subir la página para que CUALQUIER PERSONA la pueda visitar? (100% Gratis)

Tienes dos métodos extremadamente sencillos:

### Método A: Netlify Drop (El más rápido: 30 segundos, sin comandos)
1. Abre tu navegador e ingresa a: **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
2. Inicia sesión con tu correo o cuenta de Google/GitHub (gratuito).
3. Arrastra la carpeta **`Problema Guasca`** completa desde tu escritorio y suéltala en el recuadro de la página.
4. ¡Listo! En 5 segundos Netlify te generará un enlace público mundial (ejemplo: `https://agroguasca-sanfrancisco.netlify.app`), con certificado de seguridad SSL y disponible 24/7.

---

### Método B: GitHub Pages (Ideal para entrega universitaria)
Como ya inicializamos el repositorio Git en la carpeta, sigue estos 4 pasos:

1. Crea una cuenta o inicia sesión en **[GitHub](https://github.com)**.
2. Crea un nuevo repositorio público llamado por ejemplo `agroguasca`.
3. En la terminal de VS Code ejecuta:
   ```bash
   git add .
   git commit -m "AgroGuasca: Plataforma comunitaria de comercializacion campesina v1.0"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/agroguasca.git
   git push -u origin main
   ```
4. En tu repositorio en GitHub ve a:
   **Settings** > **Pages** > En **Branch** selecciona `main` y guarda.
5. Tu página quedará publicada en:
   `https://TU_USUARIO.github.io/agroguasca/`

---

## ⚙️ ¿Cómo personalizar el número de WhatsApp de la comunidad?

En el archivo `js/app.js` (alrededor de la línea 320), encontrarás:
```javascript
const coordinatorPhone = "573102345678"; // Reemplaza con el número real con código de país (57 para Colombia)
```
Coloca allí el número de WhatsApp de la Junta de Acción Comunal o del coordinador del acopio.

---

## 📚 Referencias
- **Agencia de Desarrollo Rural.** (2024). *Circuitos cortos de comercialización.* ADR.
- **Departamento Nacional de Planeación.** (2016). *Pérdida y desperdicio de alimentos en Colombia.* DNP.
- **Koen, B. V.** (2003). *Discussion of the method: Conducting the engineer's approach to problem solving.* Oxford University Press.
- **FAO.** (s.f.). *Circuitos cortos de comercialización en la agricultura familiar.*
