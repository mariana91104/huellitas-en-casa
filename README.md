# 🐾 Huellitas en Casa

Portal web de adopción responsable de perros. Permite conocer a los perritos disponibles, filtrarlos por tamaño y edad, marcar favoritos y enviar una solicitud de adopción.

Proyecto del **Reto 2. Prepara y lanza tu aplicación web** — Universidad Virtual del Estado de Guanajuato (UVEG).
Autora: Mariana Dávila Méndez.

## Tecnologías

HTML5, CSS3 y JavaScript (sin dependencias). Servidor: **Nginx**.

## Estructura

```
huellitas/
├── index.html
├── css/        styles.css · styles.min.css
├── js/         app.js · app.min.js
├── img/        dog-*.jpg (optimizadas)
├── server/     tuapp.conf (Server Block de Nginx)
└── build.sh    minifica y genera el paquete
```

## Proceso realizado

### 1. Preparación (empaquetado)

1. Archivos organizados en `/css`, `/js` e `/img`.
2. **Imágenes optimizadas:** de PNG 1600×1200 (20 MB en total) a JPG 800×600 con calidad 78 (144 KB en total).
3. **CSS y JS minificados** con `clean-css-cli` y `terser`.
4. **Paquete comprimido** con la estructura final: `tuapp.zip` y `tuapp.tar.gz` (script `build.sh`).

```bash
./build.sh
```

### 2. Versionamiento

```bash
git init -b main
git add .
git commit -m "feat: estructura inicial del portal de adopción"
git remote add origin <URL-del-repositorio>
git push -u origin main
```

Se usaron *commits* descriptivos con prefijos (`feat`, `perf`, `build`, `docs`, `chore`).

### 3. Despliegue con Nginx (Server Block)

```bash
sudo mkdir -p /var/www/tuapp
sudo unzip tuapp.zip -d /var/www/tuapp
sudo cp server/tuapp.conf /etc/nginx/sites-available/tuapp
sudo ln -s /etc/nginx/sites-available/tuapp /etc/nginx/sites-enabled/tuapp
sudo nginx -t
sudo nginx -s reload      # o: sudo systemctl reload nginx
```

- **Puerto:** 80
- **Mapeo de directorio:** `/tuapp/` → `/var/www/tuapp/`
- **URL simulada:** <http://localhost/tuapp/>

## Licencia

Proyecto académico. Ilustraciones creadas para este proyecto.
