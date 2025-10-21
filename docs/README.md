# 🏗️ Diagramas de Arquitectura - Sistema Latacunga Clean

Este directorio contiene los diagramas PlantUML que documentan la arquitectura completa del sistema de geolocalización de residuos sólidos para Latacunga, Ecuador.

## 📋 Diagramas Disponibles

### 1. **arquitectura-general.puml**
**Diagrama de Arquitectura General del Sistema**
- Vista de alto nivel de todos los componentes
- Relaciones entre frontend, backend y bases de datos
- Servicios externos y herramientas de administración
- Flujo de datos principal

### 2. **arquitectura-docker.puml**
**Infraestructura Docker y Contenedores**
- Configuración de docker-compose
- Red interna y volúmenes persistentes
- Health checks y políticas de reinicio
- Puertos y configuraciones de acceso

### 3. **arquitectura-backend.puml**
**API Backend - Rutas y Controladores**
- Estructura de rutas Express.js
- Middleware stack y seguridad
- Controladores y servicios
- Configuraciones de base de datos

### 4. **arquitectura-frontend.puml**
**Frontend React Native**
- Navegación y pantallas
- Estado global con Redux Toolkit
- Componentes reutilizables
- Servicios y hooks personalizados

### 5. **modelo-datos.puml**
**Esquema de Base de Datos**
- Modelos PostgreSQL + PostGIS
- Colecciones MongoDB
- Estructuras Redis
- Relaciones y índices

### 6. **flujo-datos.puml**
**Diagramas de Secuencia - Casos de Uso**
- Flujo de autenticación JWT
- Búsqueda de puntos cercanos con PostGIS
- Creación de reportes georeferenciados
- Administración y estadísticas

### 7. **diagrama-despliegue.puml**
**Diagrama de Despliegue**
- Infraestructura de desarrollo
- Contenedores y servicios
- Herramientas de desarrollo
- Dispositivos cliente

## 🛠️ Cómo Visualizar los Diagramas

### Opción 1: VS Code (Recomendado)
1. Instalar extensión **PlantUML** 
2. Abrir cualquier archivo `.puml`
3. Presionar `Alt + D` para preview
4. Presionar `Ctrl + Shift + P` > "PlantUML: Export Current Diagram"

### Opción 2: Online
1. Copiar contenido del archivo `.puml`
2. Ir a [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
3. Pegar código y generar diagrama

### Opción 3: Local con Java
```bash
# Instalar PlantUML
npm install -g @plantuml/cli

# Generar PNG
plantuml arquitectura-general.puml

# Generar SVG
plantuml -tsvg arquitectura-general.puml
```

## 📁 Estructura de Archivos
```
docs/
├── arquitectura-general.puml     # Vista general del sistema
├── arquitectura-docker.puml      # Infraestructura Docker
├── arquitectura-backend.puml     # API y servicios backend
├── arquitectura-frontend.puml    # App React Native
├── modelo-datos.puml             # Esquemas de BD
├── flujo-datos.puml              # Casos de uso y secuencias
├── diagrama-despliegue.puml      # Infraestructura y despliegue
└── README.md                     # Este archivo
```

## 🎯 Uso en la Tesis

Estos diagramas están diseñados para ser incluidos en la documentación académica:

### **Capítulo 3: Diseño e Implementación**
- `arquitectura-general.puml` → Arquitectura del sistema
- `modelo-datos.puml` → Diseño de base de datos
- `flujo-datos.puml` → Casos de uso principales

### **Capítulo 4: Implementación Técnica**
- `arquitectura-backend.puml` → Implementación del servidor
- `arquitectura-frontend.puml` → Implementación móvil
- `arquitectura-docker.puml` → Infraestructura y despliegue

### **Anexos**
- `diagrama-despliegue.puml` → Guía de instalación visual

## ⚙️ Tecnologías Documentadas

### **Frontend**
- React Native 0.74 + Expo 54
- Redux Toolkit (Estado)
- React Navigation 6
- React Native Maps
- Expo Location

### **Backend**
- Node.js + Express.js
- JWT Authentication
- Multer (File Upload)
- CORS & Security Middleware

### **Bases de Datos**
- **PostgreSQL 14 + PostGIS 3.3** → Datos geoespaciales
- **MongoDB 7.0** → Usuarios y reportes
- **Redis 7** → Caché y sesiones

### **Infraestructura**
- **Docker + Docker Compose** → Contenedores
- **Adminer** → Admin PostgreSQL
- **Mongo Express** → Admin MongoDB

## 🔄 Actualización de Diagramas

Cuando se modifique la arquitectura del sistema:

1. **Identificar** qué diagrama se ve afectado
2. **Editar** el archivo `.puml` correspondiente
3. **Regenerar** la imagen del diagrama
4. **Actualizar** la documentación si es necesario
5. **Commit** los cambios al repositorio

## 📚 Referencias

- [PlantUML Official Documentation](https://plantuml.com/)
- [C4 Model for Software Architecture](https://c4model.com/)
- [React Native Architecture Patterns](https://reactnative.dev/docs/architecture-overview)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Desarrollado para la tesis:** *"Sistema de Geolocalización de Puntos de Recolección de Residuos Sólidos en el Cantón Latacunga"*

**Universidad:** Universidad Técnica de Cotopaxi  
**Facultad:** Ciencias de la Ingeniería y Aplicadas  
**Carrera:** Ingeniería en Informática y Sistemas Computacionales