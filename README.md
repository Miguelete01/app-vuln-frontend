# App Vulnerability Frontend

Frontend en React + Vite para:
- Login con backend `.NET` (`/api/Auth/login`)
- CRUD de productos (incluye buscador por query params)
- CRUD de usuarios

## 1. Requisitos para servidor

- Node.js 20+ (recomendado LTS)
- npm 10+
- Backend API desplegado y accesible por HTTPS/HTTP
- (Opcional) Nginx o IIS para servir archivos estaticos

Verificar versiones:

```bash
node -v
npm -v
```

## 2. Configuracion importante antes de desplegar

La URL base del backend esta en:

- `src/config/api.js`

Valor actual:

```js
export const API_BASE_URL = 'https://localhost:7168'
```

Para servidor, cambia `localhost` por la URL real del backend, por ejemplo:

```js
export const API_BASE_URL = 'https://api.midominio.com'
```

## 3. Instalacion y build de produccion

Desde la raiz del proyecto:

```bash
npm install
npm run build
```

Esto genera la carpeta `dist/` lista para publicar.

## 4. Probar build localmente (opcional)

```bash
npm run preview
```

## 5. Opciones de despliegue

### Opcion A: Nginx (Linux)

1. Copia `dist/` al servidor, por ejemplo:
   - `/var/www/app-vulnerability-frontend`
2. Crea configuracion Nginx:

```nginx
server {
    listen 80;
    server_name frontend.midominio.com;

    root /var/www/app-vulnerability-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. Reinicia Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Opcion B: IIS (Windows Server)

1. Publica el contenido de `dist/` en un sitio IIS.
2. Configura documento por defecto `index.html`.
3. Habilita regla de reescritura para SPA (todas las rutas a `index.html`).

`web.config` recomendado:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### Opcion C: Servir con Node (rapido)

```bash
npm install -g serve
serve -s dist -l 3000
```

## 6. Requisitos del backend para que funcione el frontend

- Endpoint de login:
  - `POST /api/Auth/login`
  - body:
  ```json
  {
    "userOrEmail": "jfet@test.com",
    "password": "admin123"
  }
  ```
- Debe devolver token JWT (`token`, `accessToken` o `jwt`)
- Endpoints de productos:
  - `GET /api/Product/search?query=...`
  - `POST /api/Product`
  - `PUT /api/Product/{id}`
  - (`DELETE` si aplica en tu API)
- Para create/update de producto, el frontend envia:
  - `name`
  - `desccription`
  - `price`
  - `stock`

## 7. CORS y HTTPS (produccion)

Tu backend debe permitir CORS desde el dominio del frontend.

Ejemplo origen permitido:
- `https://frontend.midominio.com`

Si frontend y backend estan en dominios distintos, habilita:
- `AllowAnyHeader`
- `AllowAnyMethod`
- `WithOrigins(...)`

Y usa HTTPS en ambos.

## 8. Troubleshooting

- Error `Network Error` en login:
  - Revisar `API_BASE_URL`
  - Revisar certificado HTTPS del backend
  - Revisar CORS
- Pantalla en blanco al refrescar una ruta:
  - Falta configuracion SPA (`try_files ... /index.html`)
- `npm` bloqueado en PowerShell:
  - usar `cmd /c npm run build`

## 9. Flujo recomendado de release

1. Actualizar `API_BASE_URL`
2. `npm ci`
3. `npm run build`
4. Subir contenido de `dist/` al servidor
5. Verificar login y CRUD en entorno productivo
