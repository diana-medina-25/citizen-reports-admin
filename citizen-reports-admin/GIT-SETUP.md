# Subir el proyecto a Git (GitHub, GitLab, etc.)

## Usuario de este repo: Diana Medina

- **Email:** dianamedinap25@gmail.com  
- **GitHub:** [diana-medina-25](https://github.com/diana-medina-25)

Los commits de este proyecto se guardan con este usuario.

---

# Subir a la nube

## 1. Crear el repositorio en la web

Entra a GitHub con **diana-medina-25** y crea un repo vacío:
- **GitHub:** https://github.com/new  
- Nombre sugerido: `citizen-reports-admin`  
- Sin README, sin .gitignore.

## 2. En la carpeta del proyecto (citizen-reports-admin)

Abre terminal en esta carpeta y ejecuta:

```bash
# Añadir el remoto (cuenta de Diana)
git remote add origin https://github.com/diana-medina-25/citizen-reports-admin.git

# Subir la rama main
git push -u origin main
```

## 3. Si pide usuario y contraseña (HTTPS)

- GitHub ya **no** acepta contraseña de la cuenta. Usa un **Personal Access Token**:
  1. GitHub → Settings → Developer settings → Personal access tokens
  2. Crear token con permiso `repo`
  3. Cuando Git pida "Password", pega el token

O usa **SSH** en lugar de HTTPS (usa la URL que termina en `.git` con `git@github.com:...`).

## 4. Si el remoto ya existe pero da error

```bash
# Ver remotos
git remote -v

# Si "origin" apunta a otra URL, cámbiala:
git remote set-url origin https://github.com/TU_USUARIO/citizen-reports-admin.git

# Volver a intentar
git push -u origin main
```
