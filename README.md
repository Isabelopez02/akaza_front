# ⛩️ Akaza Restaurant - Experiencia Gastronómica Inteligente & Ecosistema de Gestión

> **Plataforma web de última generación para restaurantes**, impulsada por **Inteligencia Artificial**, reconocimiento por voz, monitoreo de cocina en tiempo real y un panel de administración estilo *Executive*.

---

## 📌 1. ¿Qué es Akaza Restaurant?

**Akaza Restaurant** es una solución integral que transforma por completo la forma en que los comensales interactúan con un restaurante y cómo el equipo interno (cocineros, cajeros y administradores) gestiona la operación diaria.

Combina una **experiencia digital para el comensal** a través de un **Asistente Virtual con IA** (capaz de recomendar platos, filtrar alérgenos y tomar pedidos por voz o texto) con un **Panel Ejecutivo de Gestión (`/admin`)** inspirado en la estética oscura y elegante de *Spotify Web* (paleta de tonos madera, tipografía *Merriweather* y métricas en tiempo real).

---

## ⚠️ 2. La Problemática del Sector Gastronómico Tradicional

Los restaurantes tradicionales enfrentan importantes desafíos operativos y de experiencia al cliente:

1. **Falta de Personalización y Seguridad Alimentaria:** Los menús impresos no informan adecuadamente sobre alérgenos o restricciones dietéticas (alergia a mariscos, picante, celiaquía), exponiendo al cliente a riesgos de salud.
2. **Tiempos de Espera e Ineficiencia en Toma de Pedidos:** Los clientes pierden tiempo esperando que un mesero los atienda para tomar la nota o traer la cuenta.
3. **Desconexión entre Sala y Cocina:** Transcripción manual de comanda a papel, lo que genera errores de comunicación, platos traspuestos y demoras en la preparación.
4. **Falta de Visibilidad Financiera y de Mercado:** Imposibilidad de monitorear en tiempo real la rentabilidad diaria (Ventas netas vs. Gastos de insumos), la variación de costos de ingredientes de mercado o los platillos con menor rotación.

---

## 💡 3. Lo Innovador de Akaza: Nuestra Propuesta de Valor

Akaza resuelve estos problemas mediante tecnologías web modernas e IA:

* 🤖 **Asistente Virtual Gastronómico con IA:** Un chatbot capaz de comprender lenguaje natural en español. Analiza la receta de cada plato en tiempo real y descarta opciones que contengan alérgenos según el perfil del usuario.
* 🎙️ **Interacción por Voz (`Speech-to-Text` & `Text-to-Speech`):** El cliente puede hablar directamente con el sistema para armar su pedido y escuchar la confirmación del asistente en voz alta.
* ⚡ **Sincronización en Tiempo Real (Comensal ↔ Cocina ↔ Caja):** Las órdenes realizadas por el cliente o el asistente virtual viajan inmediatamente al **Tablero de Cocina (`/cocina`)** con notificaciones visuales y estado de producción.
* 📊 **Panel de Control Executive (`/admin`):** Diseño visual compacto y elegante con la tipografía serif **Merriweather**, tarjetas de KPI financiero (Ventas, Gastos del Día, Ganancia Neta), gráfico de ranking de platos y un **Monitor de Mercado** que alerta subidas y bajadas en los precios de compras de insumos.

---

## 📱 4. Módulos y Funcionalidades del Sistema

### 1. 🍽️ Experiencia del Comensal (`/` y `/chat`)
- **Carta Digital Interactiva:** Presentación visual de platillos, combos especiales y categorías gastronómicas.
- **Chatbot Inteligente IA:** Recomendación de platos según estado de ánimo, preferencias y restricciones de salud.
- **Navegación por Mesas mediante Código QR:** Reconocimiento automático del número de mesa al escanear el QR.
- **Historial & Seguimiento de Orden:** Estado transparente del pedido (*En Espera*, *Cocinando*, *Listo*, *Pagado*).

### 2. 👨‍🍳 Tablero de Producción en Cocina (`/cocina`)
- **Visualización de Comandas:** Tarjetas de pedidos organizadas con temporizador, mesa y detalle exacto de raciones.
- **Acción Rápida de Preparación:** Cambio de estado de comanda (*En proceso* → *Listo*) con un solo toque.

### 3. 🛡️ Panel Ejecutivo de Administración (`/admin`)
- **Dashboard Principal (`/admin`):** Tarjetas KPI compactas con comparativa porcentual de ventas vs. día anterior, margen de ganancia neta y pedidos del día.
- **Gestión de Insumos (`/admin/products`):** Registro de inventario, costos unitarios de compra y monitor automático de variaciones de mercado.
- **Gestión de Menú & Combos (`/admin/dishes` & `/admin/combos`):** Administración dinámica de la carta digital, imágenes, precios de venta y agrupaciones promocionales.
- **Punto de Venta & Cobro (`/admin/venta` & `/admin/venta/nuevo`):** Emisión de tickets digitales, selección de mesa, cálculo automático de Subtotal e IGV (18%).
- **Historial de Compras de Insumos (`/admin/compras`):** Historial de abastecimiento de materias primas con precios por proveedor.
- **Reportes Analíticos (`/admin/reporte`):** Ranking dinámico de platos más y menos vendidos y gráfico de preferencia (*Combos vs. Platos*).
- **Gestión de Usuarios (`/admin/user`):** Control de acceso por roles (*Administrador*, *Cocinero*, *Cliente*).

---

## 🛠️ 5. Stack Tecnológico & Herramientas

| Categoría | Tecnología / Librería | Uso en Akaza |
| :--- | :--- | :--- |
| **Framework Frontend** | [Next.js 14+](https://nextjs.org/) (App Router) | Renderizado híbrido rápido, rutas dinámicas y middleware de autenticación. |
| **Biblioteca de UI** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Componentes reutilizables con tipado estricto de datos. |
| **Estilos & UI** | [Tailwind CSS](https://tailwindcss.com/) | Diseño responsivo con sistema de diseño propio (*Akaza Marrón*, *Akaza Amarillo*, *Akaza Crema*). |
| **Tipografía** | [Google Font Merriweather](https://fonts.google.com/specimen/Merriweather) | Elegancia ejecutiva en titulares, precios y cifras financieras. |
| **Iconografía** | [Lucide React](https://lucide.dev/) | Iconos vectoriales ligeros y limpios. |
| **Visualización de Datos** | [Recharts](https://recharts.org/) | Gráficos dinámicos de ventas semanales, ranking de platos y gráfico circular de preferencias. |
| **Procesamiento de Voz** | Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) | Dictado de voz para la toma de pedidos y síntesis de voz hablada para las respuestas de la IA. |

---

## 🚀 6. Guía de Instalación y Ejecución

### Prerrequisitos
- **Node.js** (v18.0.0 o superior)
- **npm** (v9.0.0 o superior)

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/akaza-restaurant-frontend.git
   cd akaza-restaurant-frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (`.env.local`):**
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Ejecutar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

5. **Compilar para producción:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🎨 Paleta de Colores & Identidad Visual

* 🟤 **Marrón Akaza (`#2C1810`):** Representa sobriedad, elegancia y calidez de la madera oscura del restaurante.
* 🟡 **Amarillo Akaza (`#F5C518`):** Resalta llamadas a la acción (CTAs), badges y estados destacados.
* 🍦 **Crema Akaza (`#FBF8F3`):** Proporciona un fondo limpio y acogedor para una lectura descansada.

---

*Desarrollado con pasión y estándares de excelencia para liderar la transformación digital gastronómica.* 🍣🌊
