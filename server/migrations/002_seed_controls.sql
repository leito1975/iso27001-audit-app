-- ISO 27001:2022 Annex A Controls
-- Initial data for controls table

INSERT INTO controls (id, name, category, description, objective) VALUES
-- Organizational Controls (5.x)
('A.5.1', 'Políticas de seguridad de la información', 'Organizacionales', 'Políticas de seguridad de la información y políticas específicas del tema deben definirse, aprobarse por la dirección, publicarse, comunicarse y reconocerse por el personal relevante.', 'Asegurar dirección y apoyo de la gestión para la seguridad de la información.'),
('A.5.2', 'Roles y responsabilidades de seguridad', 'Organizacionales', 'Los roles y responsabilidades de seguridad de la información deben definirse y asignarse de acuerdo con las necesidades de la organización.', 'Establecer una estructura definida para la gestión de seguridad.'),
('A.5.3', 'Segregación de funciones', 'Organizacionales', 'Las funciones conflictivas y las áreas de responsabilidad deben segregarse.', 'Reducir el riesgo de fraude y errores.'),
('A.5.4', 'Responsabilidades de la dirección', 'Organizacionales', 'La dirección debe requerir que todo el personal aplique la seguridad de la información de acuerdo con las políticas establecidas.', 'Asegurar compromiso de la dirección.'),
('A.5.5', 'Contacto con autoridades', 'Organizacionales', 'Se deben establecer y mantener contactos con las autoridades relevantes.', 'Facilitar comunicación con autoridades.'),
('A.5.6', 'Contacto con grupos de interés especial', 'Organizacionales', 'Se deben establecer y mantener contactos con grupos de interés especial u otros foros especializados.', 'Mantenerse actualizado en seguridad.'),
('A.5.7', 'Inteligencia de amenazas', 'Organizacionales', 'Se debe recopilar y analizar información relacionada con amenazas a la seguridad de la información.', 'Identificar y responder a amenazas.'),
('A.5.8', 'Seguridad en gestión de proyectos', 'Organizacionales', 'La seguridad de la información debe integrarse en la gestión de proyectos.', 'Asegurar seguridad desde el diseño.'),
('A.5.9', 'Inventario de información', 'Organizacionales', 'Se debe desarrollar y mantener un inventario de información y otros activos asociados.', 'Conocer los activos de información.'),
('A.5.10', 'Uso aceptable de información', 'Organizacionales', 'Se deben identificar, documentar e implementar reglas para el uso aceptable de la información.', 'Definir uso apropiado de información.'),
('A.5.11', 'Devolución de activos', 'Organizacionales', 'El personal y otras partes interesadas deben devolver todos los activos de la organización en su posesión al terminar su empleo.', 'Proteger activos al finalizar relación laboral.'),
('A.5.12', 'Clasificación de la información', 'Organizacionales', 'La información debe clasificarse de acuerdo con las necesidades de seguridad de la organización.', 'Proteger información según su criticidad.'),
('A.5.13', 'Etiquetado de la información', 'Organizacionales', 'Se debe desarrollar e implementar un conjunto apropiado de procedimientos para el etiquetado de información.', 'Facilitar manejo seguro de información.'),
('A.5.14', 'Transferencia de información', 'Organizacionales', 'Deben existir reglas, procedimientos o acuerdos de transferencia de información para todos los tipos de instalaciones de transferencia.', 'Proteger información en tránsito.'),
('A.5.15', 'Control de acceso', 'Organizacionales', 'Se deben establecer e implementar reglas para controlar el acceso físico y lógico a la información.', 'Restringir acceso no autorizado.'),
('A.5.16', 'Gestión de identidades', 'Organizacionales', 'Se debe gestionar el ciclo de vida completo de las identidades.', 'Administrar identidades de usuarios.'),
('A.5.17', 'Información de autenticación', 'Organizacionales', 'La asignación y gestión de información de autenticación debe controlarse mediante un proceso de gestión.', 'Proteger credenciales de acceso.'),
('A.5.18', 'Derechos de acceso', 'Organizacionales', 'Los derechos de acceso a la información y otros activos asociados deben aprovisionarse, revisarse, modificarse y eliminarse.', 'Gestionar permisos de acceso.'),

-- People Controls (6.x)
('A.6.1', 'Selección', 'Personas', 'Las verificaciones de antecedentes de todos los candidatos deben llevarse a cabo antes de unirse a la organización.', 'Verificar idoneidad del personal.'),
('A.6.2', 'Términos y condiciones de empleo', 'Personas', 'Los acuerdos contractuales deben establecer las responsabilidades del personal y de la organización para la seguridad de la información.', 'Definir obligaciones de seguridad.'),
('A.6.3', 'Concientización, educación y formación', 'Personas', 'El personal y las partes interesadas relevantes deben recibir concientización, educación y formación apropiadas.', 'Desarrollar cultura de seguridad.'),
('A.6.4', 'Proceso disciplinario', 'Personas', 'Se debe formalizar y comunicar un proceso disciplinario para tomar medidas contra el personal que haya cometido una violación.', 'Aplicar consecuencias por incumplimiento.'),
('A.6.5', 'Responsabilidades después del empleo', 'Personas', 'Las responsabilidades y deberes de seguridad de la información que permanecen válidos después del empleo deben definirse, aplicarse y comunicarse.', 'Mantener confidencialidad post-empleo.'),
('A.6.6', 'Acuerdos de confidencialidad', 'Personas', 'Los acuerdos de confidencialidad o no divulgación que reflejan las necesidades de la organización deben identificarse, documentarse y revisarse.', 'Proteger información confidencial.'),
('A.6.7', 'Trabajo remoto', 'Personas', 'Se deben implementar medidas de seguridad cuando el personal trabaja de forma remota.', 'Asegurar trabajo fuera de oficina.'),
('A.6.8', 'Reporte de eventos de seguridad', 'Personas', 'La organización debe proporcionar un mecanismo para que el personal reporte eventos de seguridad observados o sospechados.', 'Facilitar reporte de incidentes.'),

-- Physical Controls (7.x)
('A.7.1', 'Perímetros de seguridad física', 'Físicos', 'Se deben definir y usar perímetros de seguridad para proteger áreas que contienen información.', 'Proteger instalaciones físicamente.'),
('A.7.2', 'Controles de entrada física', 'Físicos', 'Las áreas seguras deben protegerse mediante controles de entrada apropiados.', 'Controlar acceso a instalaciones.'),
('A.7.3', 'Seguridad de oficinas, salas e instalaciones', 'Físicos', 'Se debe diseñar y aplicar seguridad física para oficinas, salas e instalaciones.', 'Proteger espacios de trabajo.'),
('A.7.4', 'Monitoreo de seguridad física', 'Físicos', 'Las instalaciones deben monitorearse continuamente para detectar acceso físico no autorizado.', 'Detectar intrusiones físicas.'),
('A.7.5', 'Protección contra amenazas físicas y ambientales', 'Físicos', 'Se debe diseñar y aplicar protección contra amenazas físicas y ambientales.', 'Mitigar riesgos físicos y ambientales.'),
('A.7.6', 'Trabajo en áreas seguras', 'Físicos', 'Se deben diseñar y aplicar medidas de seguridad para trabajar en áreas seguras.', 'Controlar actividades en áreas sensibles.'),
('A.7.7', 'Escritorio limpio y pantalla limpia', 'Físicos', 'Se deben definir y aplicar reglas de escritorio limpio y pantalla limpia.', 'Proteger información visible.'),
('A.7.8', 'Ubicación y protección de equipos', 'Físicos', 'Los equipos deben ubicarse de forma segura y protegerse.', 'Proteger hardware.'),
('A.7.9', 'Seguridad de activos fuera de las instalaciones', 'Físicos', 'Se deben proteger los activos fuera de las instalaciones.', 'Proteger equipos móviles.'),
('A.7.10', 'Medios de almacenamiento', 'Físicos', 'Los medios de almacenamiento deben gestionarse a lo largo de su ciclo de vida.', 'Controlar medios de almacenamiento.'),
('A.7.11', 'Servicios de soporte', 'Físicos', 'Las instalaciones de procesamiento de información deben protegerse contra fallas de energía.', 'Asegurar disponibilidad de servicios.'),
('A.7.12', 'Seguridad del cableado', 'Físicos', 'Los cables que transportan energía, datos o servicios de soporte deben protegerse.', 'Proteger infraestructura de cableado.'),
('A.7.13', 'Mantenimiento de equipos', 'Físicos', 'Los equipos deben mantenerse correctamente para asegurar disponibilidad, integridad y seguridad.', 'Mantener equipos operativos.'),
('A.7.14', 'Eliminación segura o reutilización de equipos', 'Físicos', 'Los elementos de equipo que contienen medios de almacenamiento deben verificarse antes de su eliminación o reutilización.', 'Prevenir fuga de datos en equipos descartados.'),

-- Technological Controls (8.x)
('A.8.1', 'Dispositivos de punto final de usuario', 'Tecnológicos', 'La información almacenada, procesada o accesible a través de dispositivos de punto final de usuario debe protegerse.', 'Proteger endpoints.'),
('A.8.2', 'Derechos de acceso privilegiado', 'Tecnológicos', 'La asignación y uso de derechos de acceso privilegiado debe restringirse y gestionarse.', 'Controlar accesos privilegiados.'),
('A.8.3', 'Restricción de acceso a la información', 'Tecnológicos', 'El acceso a la información y otros activos asociados debe restringirse de acuerdo con la política.', 'Aplicar principio de mínimo privilegio.'),
('A.8.4', 'Acceso al código fuente', 'Tecnológicos', 'El acceso de lectura y escritura al código fuente, herramientas de desarrollo y bibliotecas debe gestionarse apropiadamente.', 'Proteger código fuente.'),
('A.8.5', 'Autenticación segura', 'Tecnológicos', 'Se deben implementar tecnologías y procedimientos de autenticación segura.', 'Fortalecer autenticación.'),
('A.8.6', 'Gestión de capacidad', 'Tecnológicos', 'El uso de recursos debe monitorearse y ajustarse de acuerdo con los requisitos de capacidad.', 'Asegurar capacidad adecuada.'),
('A.8.7', 'Protección contra malware', 'Tecnológicos', 'Se debe implementar protección contra malware, apoyada por concientización del usuario.', 'Prevenir infecciones de malware.'),
('A.8.8', 'Gestión de vulnerabilidades técnicas', 'Tecnológicos', 'Se debe obtener información sobre vulnerabilidades técnicas, evaluar la exposición y tomar medidas apropiadas.', 'Remediar vulnerabilidades.'),
('A.8.9', 'Gestión de configuración', 'Tecnológicos', 'Las configuraciones, incluyendo las de seguridad, de hardware, software, servicios y redes deben establecerse, documentarse y gestionarse.', 'Mantener configuraciones seguras.'),
('A.8.10', 'Eliminación de información', 'Tecnológicos', 'La información almacenada en sistemas de información, dispositivos o en cualquier otro medio de almacenamiento debe eliminarse cuando ya no sea necesaria.', 'Eliminar datos de forma segura.'),
('A.8.11', 'Enmascaramiento de datos', 'Tecnológicos', 'El enmascaramiento de datos debe usarse de acuerdo con la política específica del tema de la organización.', 'Proteger datos sensibles.'),
('A.8.12', 'Prevención de fuga de datos', 'Tecnológicos', 'Se deben aplicar medidas de prevención de fuga de datos a sistemas, redes y otros dispositivos.', 'Prevenir exfiltración de datos.'),
('A.8.13', 'Respaldo de la información', 'Tecnológicos', 'Se deben mantener y probar regularmente copias de respaldo de información, software y sistemas.', 'Asegurar recuperación de datos.'),
('A.8.14', 'Redundancia de instalaciones de procesamiento', 'Tecnológicos', 'Las instalaciones de procesamiento de información deben implementarse con redundancia suficiente.', 'Asegurar alta disponibilidad.'),
('A.8.15', 'Registro', 'Tecnológicos', 'Se deben producir, almacenar, proteger y analizar registros que registren actividades, excepciones, fallas y otros eventos.', 'Mantener trazabilidad de eventos.'),
('A.8.16', 'Actividades de monitoreo', 'Tecnológicos', 'Las redes, sistemas y aplicaciones deben monitorearse para detectar comportamiento anómalo.', 'Detectar actividades sospechosas.'),
('A.8.17', 'Sincronización de relojes', 'Tecnológicos', 'Los relojes de los sistemas de procesamiento de información deben sincronizarse con fuentes de tiempo aprobadas.', 'Asegurar consistencia de timestamps.'),
('A.8.18', 'Uso de programas utilitarios privilegiados', 'Tecnológicos', 'El uso de programas utilitarios que puedan ser capaces de anular controles de sistema y aplicación debe restringirse.', 'Controlar herramientas de administración.'),
('A.8.19', 'Instalación de software en sistemas operativos', 'Tecnológicos', 'Se deben implementar procedimientos y medidas para gestionar de forma segura la instalación de software.', 'Controlar instalación de software.'),
('A.8.20', 'Seguridad de redes', 'Tecnológicos', 'Las redes y los dispositivos de red deben protegerse, gestionarse y controlarse.', 'Proteger infraestructura de red.'),
('A.8.21', 'Seguridad de servicios de red', 'Tecnológicos', 'Se deben identificar, implementar y monitorear mecanismos de seguridad, niveles de servicio y requisitos de servicios de red.', 'Asegurar servicios de red.'),
('A.8.22', 'Segregación de redes', 'Tecnológicos', 'Los grupos de servicios de información, usuarios y sistemas de información deben segregarse en redes.', 'Separar redes por función.'),
('A.8.23', 'Filtrado web', 'Tecnológicos', 'El acceso a sitios web externos debe gestionarse para reducir la exposición a contenido malicioso.', 'Controlar navegación web.'),
('A.8.24', 'Uso de criptografía', 'Tecnológicos', 'Se deben definir e implementar reglas para el uso efectivo de criptografía.', 'Aplicar cifrado apropiado.'),
('A.8.25', 'Ciclo de vida de desarrollo seguro', 'Tecnológicos', 'Se deben establecer y aplicar reglas para el desarrollo seguro de software y sistemas.', 'Desarrollar software seguro.'),
('A.8.26', 'Requisitos de seguridad de aplicaciones', 'Tecnológicos', 'Los requisitos de seguridad de la información deben identificarse, especificarse y aprobarse al desarrollar o adquirir aplicaciones.', 'Definir requisitos de seguridad.'),
('A.8.27', 'Arquitectura de sistemas seguros', 'Tecnológicos', 'Se deben establecer, documentar, mantener y aplicar principios para diseñar sistemas seguros.', 'Diseñar arquitecturas seguras.'),
('A.8.28', 'Codificación segura', 'Tecnológicos', 'Se deben aplicar principios de codificación segura al desarrollo de software.', 'Escribir código seguro.'),
('A.8.29', 'Pruebas de seguridad en desarrollo y aceptación', 'Tecnológicos', 'Los procesos de pruebas de seguridad deben definirse e implementarse en el ciclo de vida de desarrollo.', 'Validar seguridad antes de producción.'),
('A.8.30', 'Desarrollo externalizado', 'Tecnológicos', 'La organización debe dirigir, monitorear y revisar las actividades relacionadas con el desarrollo de sistemas externalizado.', 'Controlar desarrollo tercerizado.'),
('A.8.31', 'Separación de entornos de desarrollo, prueba y producción', 'Tecnológicos', 'Los entornos de desarrollo, prueba y producción deben separarse y protegerse.', 'Aislar entornos.'),
('A.8.32', 'Gestión de cambios', 'Tecnológicos', 'Los cambios en las instalaciones de procesamiento de información y sistemas de información deben estar sujetos a procedimientos de gestión de cambios.', 'Controlar cambios de forma ordenada.'),
('A.8.33', 'Información de pruebas', 'Tecnológicos', 'La información de pruebas debe seleccionarse, protegerse y gestionarse apropiadamente.', 'Proteger datos de prueba.'),
('A.8.34', 'Protección de sistemas de información durante pruebas de auditoría', 'Tecnológicos', 'Las pruebas de auditoría y otras actividades de aseguramiento que involucren la evaluación de sistemas operativos deben planificarse y acordarse.', 'Minimizar impacto de auditorías.')

ON CONFLICT (id) DO NOTHING;

-- Create default admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role) 
VALUES ('admin@example.com', '$2a$10$rQZ1gK.Tp4l8xOQQf8PKKeqjdw8mCnGV9LxhYrxpx5mBJRqVoqC8S', 'Administrador', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Create initial assessments for all controls
INSERT INTO control_assessments (control_id, applicable, target_level)
SELECT id, true, 3 FROM controls
ON CONFLICT (control_id) DO NOTHING;
