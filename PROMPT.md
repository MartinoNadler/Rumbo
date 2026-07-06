Quiero que actúes como un Product Manager técnico y desarrollador Full Stack senior.

Necesito construir un MVP de una plataforma web para que un profesor de running pueda acompañar a sus alumnos, reemplazando el grupo de WhatsApp que usa hoy para ese fin. La plataforma centraliza los entrenamientos de cada alumno (sincronizados desde Strava, o cargados manualmente), permite que el profesor asigne el entrenamiento del día, y da a todo el grupo un feed compartido para generar comunidad.

El objetivo del MVP es validar si un profesor y su grupo de alumnos encuentran valor en reemplazar el chat de WhatsApp por esta plataforma.

Roles


Profesor: crea un grupo, invita alumnos, asigna el entrenamiento de cada día, ve el dashboard de cada alumno, participa en el feed.
Alumno: pertenece a un único grupo (un alumno no puede estar en más de un grupo a la vez), conecta su propia cuenta de Strava, ve su entrenamiento asignado, su propio dashboard, y participa en el feed del grupo.


El feed es compartido entre profesor y alumnos del mismo grupo — no hay un feed separado por rol.

Alcance del MVP


Registro e inicio de sesión, con selección de rol (profesor o alumno).
El profesor crea un grupo y genera un código/link de invitación.
El alumno se une a un grupo con ese código (queda asociado a un único grupo).
Conexión con Strava por OAuth (cada alumno conecta su propia cuenta).
Sync on-demand de actividades.
Asignación de entrenamiento diario por parte del profesor (texto simple: qué corresponde hacer ese día — separado del registro de lo efectivamente realizado).
Dashboard individual del alumno.
Vista del profesor sobre cada alumno de su grupo.
Feed compartido del grupo: posteos de texto + imagen, reacciones simples. Sin comentarios anidados ni mensajería privada en el MVP.
Filtros por fecha, deporte y origen de datos.
Métricas configurables: el usuario elige qué indicador ver (km, ritmo, FC, cantidad de actividades) filtrando por rango de fecha y tipo de actividad.
Sección de progreso: el alumno (o el profesor por alumno) puede definir un objetivo simple (ej. km semanales, o una carrera objetivo con fecha) y ver el avance.
Configuración de cuenta: nombre, apodo, datos básicos de perfil.
Diseño responsive.


Fuera de alcance en este MVP


Comentarios anidados, mensajería privada, notificaciones push.
Badges, streaks o gamificación más allá del progreso hacia el objetivo definido.
Multi-grupo por alumno o multi-profesor por grupo.
Importación de archivos (GPX/TCX/FIT/CSV) — se evalúa como fast-follow después de validar Strava + feed + asignación de entrenamiento.


Datos mínimos por actividad (sincronizada de Strava)

fecha, tipo de actividad, origen, distancia, duración, tiempo en movimiento, ritmo promedio, FC promedio y máxima, cadencia promedio, desnivel positivo, calorías, splits si están disponibles, track GPS si está disponible.

Modelo de datos: entidades nuevas respecto a un dashboard de un solo usuario


User: agrega role (profesor | alumno), nickname.
Group: profesor dueño, nombre, código de invitación.
Membership: relación 1:1 entre alumno y grupo (un alumno, un solo grupo — FK directa en User, no tabla many-to-many).
PlannedWorkout: entrenamiento asignado por el profesor a un alumno para una fecha determinada (separado de Activity, que es lo que el alumno efectivamente hizo).
Post: feed del grupo — autor (profesor o alumno), texto, imagen opcional, fecha.
Reaction: reacción simple a un Post (usuario + tipo de reacción).
Goal: objetivo del alumno (tipo, valor objetivo, fecha límite opcional).


Pantallas / secciones de navegación


Login / registro (con selección de rol).
Hoy: entrenamiento asignado por el profesor para el día, con acceso rápido a registrar/ver la actividad correspondiente.
Actividades: listado de actividades sincronizadas + entrenamientos asignados por el profesor por día, con filtros de fecha/deporte/origen. El profesor ve esto por alumno; el alumno ve lo propio.
Métricas: panel configurable — el usuario elige qué métrica ver, con filtros de fecha y tipo de actividad.
Progreso: objetivos definidos y avance hacia ellos.
Feed: posteos del grupo (profesor + alumnos), con reacciones.
Configuración: datos de perfil (nombre, apodo, cuenta), gestión de la conexión con Strava.


Para el profesor, además: vista de roster del grupo con resumen por alumno, y gestión de invitaciones.

Stack sugerido

Next.js + React + TypeScript, PostgreSQL + Prisma, Supabase (Auth + DB + Storage, este último para las imágenes del feed), Vercel para hosting. Justificá brevemente las decisiones principales, en particular por qué Supabase Storage alcanza para las imágenes del feed sin necesitar un servicio aparte en el MVP.

Forma de trabajo

No quiero planificación excesiva. Entregar primero, en un solo mensaje:


Alcance final del MVP (confirmando o ajustando lo de arriba).
Arquitectura simple.
Modelo de datos inicial completo.
Las 7 pantallas/secciones descritas, con qué ve el profesor vs. el alumno en cada una.
Plan de desarrollo por etapas, dejando explícito en qué etapa se agrega cada sección (Hoy, Actividades, Métricas, Progreso, Feed, Configuración) y por qué en ese orden.


Después de esa entrega inicial, avanzamos módulo por módulo.