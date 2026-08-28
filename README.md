# 🌊 AKAZA - Restaurante Marino & Asistente IA

🌐 **Demo en Vivo**: [https://akaza-restaurant.netlify.app/](https://akaza-restaurant.netlify.app/)

---

## 🛠️ Tecnologías Utilizadas

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Telegram API](https://img.shields.io/badge/Telegram_API-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)
![IA / LLM](https://img.shields.io/badge/IA_Gemini_LLM-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

---

## ❓ Problemática

En el sector gastronómico de comida marina, los clientes y administradores enfrentan retos comunes:
* **Tiempos de espera elevados**: Cuellos de botella al tomar comandas manualmente en horas pico.
* **Falta de personalización**: Dificultad para sugerir platos basados en alergias, preferencias alimenticias o presupuesto del cliente.
* **Desconexión entre áreas**: Errores en la comunicación entre el salón (mozos), la cocina y el inventario/caja.

---

## 💡 Propuesta de Valor y Solución

**AKAZA** transforma la experiencia gastronómica marina integrando **Inteligencia Artificial (LLM)** y la **API de Telegram**:

1. **Asistente de IA Conversacional**: Utiliza un modelo de lenguaje de última generación (IA) para mantener conversaciones naturales con el cliente, recomendando platillos personalizados según antojos, alergias o presupuesto, y guiándolo en la elección del menú marino.
2. **Integración con Telegram (Telegram API)**: Los clientes y administradores pueden interactuar con el restaurante a través del bot oficial de Telegram (`@akazita_bot`). Los clientes reciben atención e información del menú por chat, mientras que la gerencia consulta métricas y reportes del negocio en tiempo real.
3. **Escaneo QR de Mesas**: Permite a los comensales consultar el menú y ordenar de forma digital directamente desde su mesa.
4. **Gestión Operativa Multirrol**:
   * **Vista Cliente**: Menú interactivo, asistencia por IA y chatbot.
   * **Vista Cocina**: Monitor de comandas en tiempo real con estados (*En espera, Preparando, Listo*).
   * **Vista Administración**: Control de ventas, inventario, usuarios y reportes ejecutivos.

---

## 📸 Capturas de la Plataforma

| Vista Principal (Landing Page) | Categorías & Menú Interactivo |
| :---: | :---: |
| ![Vista Principal](./docs/vista_principal.jpg) | ![Categorías](./docs/Venta.png) |

---

## 🏗️ Arquitectura y Stack Tecnológico

```
[ Cliente / Browser ] ──(Next.js 14 + React 18)
        │
        ├── Peticiones HTTP (Axios + JWT Interceptors)
        ▼
[ Backend API ] ─────────(FastAPI + Python 3.13)
        │
        ├── Autenticación (OAuth2 / JWT)
        ├── ORM / BD (PostgreSQL / SQLite)
        ├── Servicio de IA (LLM / OpenAI Integración)
        └── Notificaciones (Telegram Bot API)
```

### Componentes Principales:
* **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React icons, Recharts.
* **Backend**: FastAPI, SQLAlchemy, Uvicorn.
* **Despliegue**: Frontend alojado en Netlify, Backend contenerizado con Docker.

---

## 📂 Estructura del Proyecto

```text
rest_akaza/
├── app/                        # Rutas de Next.js (App Router)
│   ├── (akaza)/                # Experiencia de Cliente (Landing, Chat, Menú)
│   ├── admin/                  # Panel de Administración y Reportes
│   └── cocina/                 # Pantalla de Control de Cocina
├── components/                 # Componentes de UI reutilizables
│   ├── admin/                  # Tablas, Modales y Cards Administrativas
│   ├── home/                   # HeroSection, Categorías, Asistente IA
│   ├── layout/                 # Navbar, Footer, ChatWidget, QrModal
│   └── modal/                  # Modales de Login, Perfil y Pedidos
├── docs/                       # Capturas y documentación visual
│   ├── vista_principal.jpg
│   └── Venta.png
├── lib/                        # Cliente API centralizado (Axios config)
├── services/                   # Servicios de consulta e integración HTTP
│   ├── admin.service.ts
│   ├── auth.service.ts
│   ├── chatbot.service.ts
│   ├── cocina.service.ts
│   └── pedidos.service.ts
└── types/                      # Interfaces y tipos globales de TypeScript
```

---

## 🎨 Paleta de Colores

La identidad visual de **AKAZA** refleja la elegancia marina y la calidez gastronómica:

| Color | Nombre | Código HEX | RGB | Uso Principal |
| :--- | :--- | :--- | :--- | :--- |
| <img src="https://via.placeholder.com/15/3D1C02/3D1C02.png" width="15" height="15" /> | **Marrón Akaza** | `#3D1C02` | `rgb(61, 28, 2)` | Encabezados, Navbar, botones primarios y texto de marca |
| <img src="https://via.placeholder.com/15/FFCC00/FFCC00.png" width="15" height="15" /> | **Amarillo Akaza** | `#FFCC00` | `rgb(255, 204, 0)` | Destacados, bordes activos y acentos dorados |
| <img src="https://via.placeholder.com/15/FDFAF6/FDFAF6.png" width="15" height="15" /> | **Crema Akaza** | `#FDFAF6` | `rgb(253, 250, 246)` | Fondo general suave de la plataforma |
| <img src="https://via.placeholder.com/15/FFFFFF/FFFFFF.png" width="15" height="15" /> | **Blanco Puro** | `#FFFFFF` | `rgb(255, 255, 255)` | Tarjetas, modales y contenedores |

---

## ⚡ Instalación y Configuración Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/akaza.git
cd akaza/rest_akaza
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz de `rest_akaza`:
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### 4. Ejecutar en entorno de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.
