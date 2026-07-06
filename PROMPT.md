# Prompt para Claude Code (VSCode)

Actúa como Product Manager técnico y desarrollador Full Stack senior.

Necesito construir un MVP de una plataforma web para que un **profesor/entrenador de running** pueda hacer seguimiento de sus alumnos, viendo sus entrenamientos centralizados, y generando un mínimo de motivación entre ellos mediante un ranking simple.

El objetivo del MVP es validar si un entrenador encuentra valor en tener, en un solo lugar, la evolución de entrenamiento de todos sus alumnos, sin depender de que cada uno le mande capturas de pantalla de Strava.

## Roles

- **Coach**: crea un grupo, invita alumnos, ve dashboard individual y agregado del grupo.
- **Alumno**: se registra, conecta su cuenta de Strava, ve su propio dashboard y el ranking del grupo.

No hay rol "admin" ni multi-coach por grupo en el MVP.

## Alcance del MVP

Debe permitir:

- Registro e inicio de sesión (con selección de rol: coach o alumno).
- El coach crea un grupo y genera un código/link de invitación.
- El alumno se une a un grupo con ese código.
- Conexión con Strava mediante OAuth (la hace cada alumno con su propia cuenta).
- Sync on-demand de actividades (botón "sincronizar").
- Almacenamiento normalizado de actividades en base de datos propia.
- Dashboard individual del alumno (igual que un MVP de corredor solo).
- Dashboard del coach: vista agregada del grupo + posibilidad de entrar al detalle de cada alumno.
- Ranking semanal simple del grupo (km totales, cantidad de actividades) — esto es toda la "motivación" del MVP.
- Feed de solo lectura: últimas actividades de todos los alumnos del grupo, sin comentarios ni likes.
- Filtros por fecha, deporte y origen de datos.
- Vista de detalle de cada actividad.
- Diseño responsive.

### Explícitamente FUERA de este MVP (para no perder el foco)

- Comentarios, likes, chat o mensajería entre alumnos.
- Badges, streaks, notificaciones push o gamificación más allá del ranking semanal.
- Multi-coach por grupo, o un alumno perteneciendo a varios grupos.
- Importación manual de archivos (GPX/TCX/FIT/CSV) — se evalúa como fast-follow.
- Roles intermedios (asistente del coach, etc.).

## Datos mínimos a guardar por actividad

fecha, tipo de actividad, origen del dato, distancia, duración, tiempo en movimiento, ritmo promedio, frecuencia cardíaca promedio y máxima, cadencia promedio, desnivel positivo, calorías, splits (si están disponibles), track GPS (si está disponible).

## Dashboard del alumno

Igual que un dashboard individual de corredor: km por semana/mes, cantidad de actividades, evolución de ritmo y FC, volumen semanal, últimas actividades, detalle por actividad con gráfico de distancia/ritmo/FC.

## Dashboard del coach

- Listado de alumnos del grupo con resumen (km esta semana, última actividad, estado de conexión con Strava).
- Ranking semanal del grupo.
- Feed de últimas actividades de todos los alumnos.
- Click en un alumno → su dashboard individual completo.

## Stack sugerido

Next.js + React + TypeScript, Node.js (vía API routes de Next), PostgreSQL + Prisma, Supabase (Auth + DB + Storage), Vercel para hosting. Mismo criterio que el MVP anterior: minimizar piezas de infraestructura hasta tener validación.

## Modelo de datos: puntos que cambian respecto a un MVP de un solo usuario

- `User` necesita un campo `role` (`coach` | `student`).
- Nueva entidad `Group` (coach dueño, nombre, código de invitación).
- Nueva entidad `Membership` (relación alumno-grupo, con fecha de ingreso).
- `Activity` sigue perteneciendo al alumno (`userId`), pero las queries del coach filtran por los alumnos de su grupo vía `Membership`.
- El OAuth de Strava se asocia siempre a un `User` con rol `student` — el coach nunca conecta su propia cuenta de Strava a menos que también entrene.

## Forma de trabajo

No quiero planificación excesiva. Entregar primero, en un solo mensaje:

1. Alcance final del MVP (confirmando o ajustando lo de arriba).
2. Arquitectura simple.
3. Modelo de datos inicial completo (incluyendo `Group` y `Membership`).
4. Pantallas principales (login/registro con selección de rol, alta de grupo, unirse a grupo, dashboard alumno, dashboard coach, detalle de actividad).
5. Plan de desarrollo por etapas, dejando explícito en qué etapa se agregan roles y grupos respecto al flujo de un solo usuario.

Después de esa entrega inicial, avanzamos módulo por módulo.