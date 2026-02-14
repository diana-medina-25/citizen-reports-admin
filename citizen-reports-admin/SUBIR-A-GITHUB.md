# Cómo subir citizen-reports-admin a GitHub (paso a paso)

## Paso 1 — Crear el repositorio en GitHub

1. Abre el navegador y entra a: **https://github.com/new**
2. Inicia sesión con la cuenta **diana-medina-25** si no lo has hecho.
3. En **Repository name** escribe: `citizen-reports-admin`
4. Deja **Public**.
5. **No marques** "Add a README file", ni ".gitignore", ni "Choose a license". Tiene que estar vacío.
6. Pulsa **Create repository**.

---

## Paso 2 — Conectar tu carpeta con GitHub

Abre la **terminal** (PowerShell o CMD) y ejecuta **estos dos comandos**, uno detrás del otro:

```bash
cd C:\Users\PC\Documents\repositorios\dd\citizen-reports-admin
```

```bash
git remote add origin https://github.com/diana-medina-25/citizen-reports-admin.git
```

Si te dice que `origin` ya existe, usa en su lugar:

```bash
git remote set-url origin https://github.com/diana-medina-25/citizen-reports-admin.git
```

---

## Paso 3 — Subir el código

En la misma terminal:

```bash
git push -u origin main
```

- Si pide **Username**: escribe `diana-medina-25`
- Si pide **Password**: **no** pongas la contraseña de la cuenta. Pega aquí tu **Personal Access Token** (el que creaste en GitHub → Settings → Developer settings → Personal access tokens, con permiso `repo`). Si no tienes uno, créalo ahí y úsalo como “contraseña”.

Cuando termine sin errores, el proyecto ya estará en:

**https://github.com/diana-medina-25/citizen-reports-admin**

---

## Resumen rápido (si ya creaste el repo vacío)

```bash
cd C:\Users\PC\Documents\repositorios\dd\citizen-reports-admin
git remote add origin https://github.com/diana-medina-25/citizen-reports-admin.git
git push -u origin main
```

Cuando pida contraseña → pega el **token** de Diana, no la contraseña de la cuenta.
