# Shrt

Acortador de URLs moderno hecho con Next.js, TypeScript y Prisma.

## Stack

- Next.js (App Router)
- TypeScript
- Prisma + PostgreSQL
- Tailwind CSS

## Funcionalidades

- Acorta URLs largas al instante
- Copia la URL corta al portapapeles
- Descarga codigo QR
- Cuenta los clicks automaticamente
- Historial de los ultimos 5 enlaces

## Como usar

```bash
git clone https://github.com/UnPendejoHola/url-shortener
cd url-shortener
npm install
npm run dev
```

Abre http://localhost:3000.

## Base de datos

Necesitas PostgreSQL. Para desarrollo local:

```bash
# Crea la base de datos y corre las migrations
npx prisma db push
```

En Vercel usa Vercel Postgres (Storage) o Neon. Asigna la variable `DATABASE_URL` en los environment variables.
