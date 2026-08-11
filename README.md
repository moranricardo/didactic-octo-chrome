# Didactic-Octo-Chrome: El Toroide Adiamantado

## Protocol 818 Principles
El proposito de este proyecto es implementar y demostrar los principios del Protocolo 818, sirviendo como nucleo de automatizacion, orquestacion y cerebro digital autonomo.

## Arquitectura Evolucionada (Evolucion P.A.R.A. & Cloud-Native)
El motor opera mediante un sistema hibrido resiliente: ejecucion local/agentica (Termux) y orquestacion Cloud-Native a traves de **GitHub Actions**.

### Componentes Clave
- **Motor Principal:** Ubicado en `index.cjs`, ejecuta la logica agentica y el analisis del bot.
- **Estructura de Datos (P.A.R.A.):**
  - `1_Projects/` & `2_Areas/`: Gestion de tareas dinamicas y areas operativas.
  - `3_Resources/` & `4_Archives/`: Repositorio de conocimiento e historial.
  - `bin/`: Scripts ejecutables y utilidades CLI (`run-bot.sh`, etc.).
  - `data/`: Perfil contextual (`profile.json`) y registros de estado.
- **Orquestacion CI/CD:** `.github/workflows/main.yml` gestiona las ejecuciones en la nube (Node.js 20).

---

## Setup & Ejecucion

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/moranricardo/didactic-octo-chrome.git](https://github.com/moranricardo/didactic-octo-chrome.git)
   cd didactic-octo-chrome
   ```

2. **Ejecucion Local (Termux / Node.js):**
   ```bash
   node index.cjs
   ```

3. **Ejecucion via Bash Helper:**
   ```bash
   ./bin/run-bot.sh
   ```
