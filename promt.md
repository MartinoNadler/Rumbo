# Running Platform MVP

## Visión

Quiero construir una plataforma web para corredores que conecte alumnos y profesores dentro de un mismo ecosistema.

El objetivo es crear una plataforma moderna que combine:

- planificación de entrenamientos;
- seguimiento del progreso;
- estadísticas deportivas;
- comunidad;
- motivación mediante logros;
- gestión de alumnos por parte de profesores.

No quiero reemplazar Garmin, COROS o Strava.

Quiero construir una capa superior donde el usuario pueda organizar toda su información deportiva.

---

# Objetivos del MVP

El MVP debe validar el producto lo más rápido posible.

No quiero sobreingeniería.

Quiero una aplicación moderna, rápida y con excelente experiencia de usuario.

El frontend es una prioridad.

Debe verse como un producto listo para salir al mercado.

---

# Tipos de usuario

## Alumno

Puede:

- ver el entrenamiento del día
- registrar actividades
- importar actividades
- conectar Strava
- consultar estadísticas
- visualizar progreso
- publicar en el feed
- obtener logros
- administrar su perfil

---

## Profesor

Puede:

- administrar alumnos
- crear grupos
- asignar entrenamientos
- revisar actividades
- consultar estadísticas
- hacer seguimiento del progreso
- detectar alumnos inactivos

---

# Integraciones

El MVP debe funcionar sin depender de APIs privadas.

Prioridad:

1. Carga manual.
2. Importación FIT.
3. Importación TCX.
4. Importación GPX.
5. Importación CSV.
6. Integración con Strava.

En el futuro deberán poder agregarse:

- Garmin
- COROS
- Apple Health
- Health Connect
- Polar
- Suunto

La arquitectura debe quedar preparada para ello.

---

# Navegación

## /hoy

Pantalla principal.

Debe mostrar:

- entrenamiento del día
- objetivo
- descripción
- intensidad
- distancia o duración
- observaciones
- estado
- acceso rápido para cargar actividad
- resumen del entrenamiento anterior

---

## /feed

Red social del grupo.

Los alumnos podrán compartir:

- imágenes
- comentarios
- sensaciones
- logros
- actividades

Debe permitir:

- comentar
- reaccionar
- visualizar publicaciones del grupo

---

## /stats

Dashboard de estadísticas.

Debe permitir filtrar por:

- período
- tipo de actividad
- origen
- alumno (profesor)

Métricas:

- kilómetros
- tiempo
- ritmo
- frecuencia cardíaca
- desnivel
- calorías
- cadencia

---

## /progreso

Debe mostrar:

- calendario anual
- evolución semanal
- evolución mensual
- ritmo
- frecuencia cardíaca
- distancia
- rachas
- estadísticas generales

---

## /logros

Sistema de insignias.

Ejemplos:

- primera actividad
- 10 km
- 50 km
- 100 km
- rachas
- mejores marcas

---

## /config

Configuración.

Debe permitir:

- perfil
- cuenta
- hábitos
- objetivos
- privacidad
- conexión con Strava

---

# Datos mínimos de una actividad

Cada actividad debe almacenar al menos:

- usuario
- fecha
- deporte
- origen
- distancia
- duración
- tiempo en movimiento
- ritmo promedio
- frecuencia cardíaca promedio
- frecuencia cardíaca máxima
- cadencia
- desnivel positivo
- calorías
- track GPS (si existe)
- splits
- comentarios
- sensación del entrenamiento

La arquitectura debe permitir agregar nuevos datos fácilmente.

---

# Diseño

Quiero un frontend moderno.

Inspiraciones:

- Strava
- Garmin Connect
- Apple Fitness
- TrainingPeaks
- Linear
- Notion

Debe ser:

- responsive
- mobile first
- rápido
- minimalista
- intuitivo
- profesional

El frontend debe ser uno de los puntos fuertes del proyecto.

---

# Forma de trabajo

No desarrolles toda la aplicación de una vez.

Construyamos el proyecto módulo por módulo.

Cada módulo debe quedar completamente funcional antes de avanzar al siguiente.

Si detectás una mejor solución que la que planteo, proponela y justificá el porqué.