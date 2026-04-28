import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const controls = [
    // ===== Organizational Controls (5.x) =====
    { id: 'A.5.1', name: 'Políticas de seguridad de la información', category: 'Organizacionales', description: 'Políticas de seguridad de la información y políticas específicas del tema deben definirse, aprobarse por la dirección, publicarse, comunicarse y reconocerse por el personal relevante.', objective: 'Asegurar dirección y apoyo de la gestión para la seguridad de la información.' },
    { id: 'A.5.2', name: 'Roles y responsabilidades de seguridad', category: 'Organizacionales', description: 'Los roles y responsabilidades de seguridad de la información deben definirse y asignarse.', objective: 'Establecer una estructura definida para la gestión de seguridad.' },
    { id: 'A.5.3', name: 'Segregación de funciones', category: 'Organizacionales', description: 'Las funciones conflictivas y las áreas de responsabilidad deben segregarse.', objective: 'Reducir el riesgo de fraude y errores.' },
    { id: 'A.5.4', name: 'Responsabilidades de la dirección', category: 'Organizacionales', description: 'La dirección debe requerir que todo el personal aplique la seguridad de la información.', objective: 'Asegurar compromiso de la dirección.' },
    { id: 'A.5.5', name: 'Contacto con autoridades', category: 'Organizacionales', description: 'Se deben establecer y mantener contactos con las autoridades relevantes.', objective: 'Facilitar comunicación con autoridades.' },
    { id: 'A.5.6', name: 'Contacto con grupos de interés especial', category: 'Organizacionales', description: 'Se deben establecer y mantener contactos con grupos de interés especial.', objective: 'Mantenerse actualizado en seguridad.' },
    { id: 'A.5.7', name: 'Inteligencia de amenazas', category: 'Organizacionales', description: 'Se debe recopilar y analizar información relacionada con amenazas.', objective: 'Identificar y responder a amenazas.' },
    { id: 'A.5.8', name: 'Seguridad en gestión de proyectos', category: 'Organizacionales', description: 'La seguridad de la información debe integrarse en la gestión de proyectos.', objective: 'Asegurar seguridad desde el diseño.' },
    { id: 'A.5.9', name: 'Inventario de información', category: 'Organizacionales', description: 'Se debe desarrollar y mantener un inventario de información y otros activos asociados.', objective: 'Conocer los activos de información.' },
    { id: 'A.5.10', name: 'Uso aceptable de información', category: 'Organizacionales', description: 'Se deben identificar, documentar e implementar reglas para el uso aceptable.', objective: 'Definir uso apropiado de información.' },
    { id: 'A.5.11', name: 'Devolución de activos', category: 'Organizacionales', description: 'El personal debe devolver todos los activos al terminar su empleo.', objective: 'Proteger activos al finalizar relación laboral.' },
    { id: 'A.5.12', name: 'Clasificación de la información', category: 'Organizacionales', description: 'La información debe clasificarse según las necesidades de seguridad.', objective: 'Proteger información según su criticidad.' },
    { id: 'A.5.13', name: 'Etiquetado de la información', category: 'Organizacionales', description: 'Se debe implementar un conjunto apropiado de procedimientos para el etiquetado.', objective: 'Facilitar manejo seguro de información.' },
    { id: 'A.5.14', name: 'Transferencia de información', category: 'Organizacionales', description: 'Deben existir reglas, procedimientos o acuerdos de transferencia de información.', objective: 'Proteger información en tránsito.' },
    { id: 'A.5.15', name: 'Control de acceso', category: 'Organizacionales', description: 'Se deben establecer e implementar reglas para controlar el acceso.', objective: 'Restringir acceso no autorizado.' },
    { id: 'A.5.16', name: 'Gestión de identidades', category: 'Organizacionales', description: 'Se debe gestionar el ciclo de vida completo de las identidades.', objective: 'Administrar identidades de usuarios.' },
    { id: 'A.5.17', name: 'Información de autenticación', category: 'Organizacionales', description: 'La asignación y gestión de información de autenticación debe controlarse.', objective: 'Proteger credenciales de acceso.' },
    { id: 'A.5.18', name: 'Derechos de acceso', category: 'Organizacionales', description: 'Los derechos de acceso deben aprovisionarse, revisarse, modificarse y eliminarse.', objective: 'Gestionar permisos de acceso.' },
    { id: 'A.5.19', name: 'Seguridad de la información en relaciones con proveedores', category: 'Organizacionales', description: 'Establecer requisitos de seguridad con proveedores.', objective: 'Mantener seguridad en relaciones con proveedores.' },
    { id: 'A.5.20', name: 'Tratamiento de seguridad en acuerdos con proveedores', category: 'Organizacionales', description: 'Establecer requisitos de seguridad relevantes con cada proveedor.', objective: 'Asegurar acuerdos de seguridad con proveedores.' },
    { id: 'A.5.21', name: 'Gestión de seguridad en la cadena de suministro TIC', category: 'Organizacionales', description: 'Gestionar riesgos de seguridad en la cadena de suministro.', objective: 'Proteger la cadena de suministro.' },
    { id: 'A.5.22', name: 'Monitoreo, revisión y gestión de cambios de proveedores', category: 'Organizacionales', description: 'Monitorear y revisar prácticas de seguridad de proveedores.', objective: 'Mantener nivel de seguridad con proveedores.' },
    { id: 'A.5.23', name: 'Seguridad de la información para uso de servicios en la nube', category: 'Organizacionales', description: 'Establecer procesos para adquisición y gestión de servicios en la nube.', objective: 'Gestionar seguridad para servicios en la nube.' },
    { id: 'A.5.24', name: 'Planificación y preparación de gestión de incidentes', category: 'Organizacionales', description: 'Planificar y preparar gestión de incidentes de seguridad.', objective: 'Estar preparado para incidentes.' },
    { id: 'A.5.25', name: 'Evaluación y decisión sobre eventos de seguridad', category: 'Organizacionales', description: 'Evaluar eventos de seguridad y decidir si son incidentes.', objective: 'Clasificar eventos de seguridad correctamente.' },
    { id: 'A.5.26', name: 'Respuesta a incidentes de seguridad', category: 'Organizacionales', description: 'Responder a incidentes de seguridad de acuerdo con procedimientos documentados.', objective: 'Gestionar incidentes efectivamente.' },
    { id: 'A.5.27', name: 'Aprendizaje de incidentes de seguridad', category: 'Organizacionales', description: 'Usar conocimiento de incidentes para fortalecer controles.', objective: 'Reducir probabilidad de incidentes futuros.' },
    { id: 'A.5.28', name: 'Recopilación de evidencias', category: 'Organizacionales', description: 'Establecer procedimientos para recopilación de evidencias.', objective: 'Apoyar acciones legales cuando sea necesario.' },
    { id: 'A.5.29', name: 'Seguridad de la información durante interrupciones', category: 'Organizacionales', description: 'Planificar cómo mantener seguridad durante interrupciones.', objective: 'Proteger información durante crisis.' },
    { id: 'A.5.30', name: 'Preparación de TIC para continuidad del negocio', category: 'Organizacionales', description: 'Planificar y probar preparación de TIC para continuidad.', objective: 'Asegurar disponibilidad de TIC.' },
    { id: 'A.5.31', name: 'Requisitos legales, estatutarios, regulatorios y contractuales', category: 'Organizacionales', description: 'Identificar y documentar requisitos legales y regulatorios.', objective: 'Asegurar cumplimiento de requisitos legales.' },
    { id: 'A.5.32', name: 'Derechos de propiedad intelectual', category: 'Organizacionales', description: 'Implementar procedimientos para proteger propiedad intelectual.', objective: 'Proteger derechos de propiedad intelectual.' },
    { id: 'A.5.33', name: 'Protección de registros', category: 'Organizacionales', description: 'Proteger registros contra pérdida, destrucción y falsificación.', objective: 'Mantener integridad de registros.' },
    { id: 'A.5.34', name: 'Privacidad y protección de datos personales', category: 'Organizacionales', description: 'Cumplir requisitos de privacidad y protección de datos.', objective: 'Proteger datos personales.' },
    { id: 'A.5.35', name: 'Revisión independiente de seguridad de la información', category: 'Organizacionales', description: 'Revisar independientemente el enfoque de seguridad.', objective: 'Asegurar idoneidad del enfoque de seguridad.' },
    { id: 'A.5.36', name: 'Cumplimiento de políticas, reglas y estándares', category: 'Organizacionales', description: 'Revisar regularmente el cumplimiento de políticas de seguridad.', objective: 'Verificar cumplimiento continuo.' },
    { id: 'A.5.37', name: 'Procedimientos operativos documentados', category: 'Organizacionales', description: 'Documentar y poner a disposición procedimientos operativos.', objective: 'Asegurar operaciones consistentes y seguras.' },

    // ===== People Controls (6.x) =====
    { id: 'A.6.1', name: 'Selección', category: 'Personas', description: 'Las verificaciones de antecedentes deben llevarse a cabo antes de unirse a la organización.', objective: 'Verificar idoneidad del personal.' },
    { id: 'A.6.2', name: 'Términos y condiciones de empleo', category: 'Personas', description: 'Los acuerdos contractuales deben establecer las responsabilidades de seguridad.', objective: 'Definir obligaciones de seguridad.' },
    { id: 'A.6.3', name: 'Concientización, educación y formación', category: 'Personas', description: 'El personal debe recibir concientización y formación apropiadas en seguridad.', objective: 'Desarrollar cultura de seguridad.' },
    { id: 'A.6.4', name: 'Proceso disciplinario', category: 'Personas', description: 'Se debe formalizar y comunicar un proceso disciplinario.', objective: 'Aplicar consecuencias por incumplimiento.' },
    { id: 'A.6.5', name: 'Responsabilidades después del empleo', category: 'Personas', description: 'Las responsabilidades post-empleo deben definirse y comunicarse.', objective: 'Mantener confidencialidad post-empleo.' },
    { id: 'A.6.6', name: 'Acuerdos de confidencialidad', category: 'Personas', description: 'Los acuerdos de confidencialidad deben identificarse y documentarse.', objective: 'Proteger información confidencial.' },
    { id: 'A.6.7', name: 'Trabajo remoto', category: 'Personas', description: 'Se deben implementar medidas de seguridad para trabajo remoto.', objective: 'Asegurar trabajo fuera de oficina.' },
    { id: 'A.6.8', name: 'Reporte de eventos de seguridad', category: 'Personas', description: 'La organización debe proporcionar un mecanismo para reportar eventos de seguridad.', objective: 'Facilitar reporte de incidentes.' },

    // ===== Physical Controls (7.x) =====
    { id: 'A.7.1', name: 'Perímetros de seguridad física', category: 'Físicos', description: 'Se deben definir y usar perímetros de seguridad para proteger áreas.', objective: 'Proteger instalaciones físicamente.' },
    { id: 'A.7.2', name: 'Controles de entrada física', category: 'Físicos', description: 'Las áreas seguras deben protegerse mediante controles de entrada.', objective: 'Controlar acceso a instalaciones.' },
    { id: 'A.7.3', name: 'Seguridad de oficinas, salas e instalaciones', category: 'Físicos', description: 'Se debe diseñar y aplicar seguridad física para oficinas y salas.', objective: 'Proteger espacios de trabajo.' },
    { id: 'A.7.4', name: 'Monitoreo de seguridad física', category: 'Físicos', description: 'Las instalaciones deben monitorearse para detectar acceso no autorizado.', objective: 'Detectar intrusiones físicas.' },
    { id: 'A.7.5', name: 'Protección contra amenazas físicas y ambientales', category: 'Físicos', description: 'Se debe aplicar protección contra amenazas físicas y ambientales.', objective: 'Mitigar riesgos físicos y ambientales.' },
    { id: 'A.7.6', name: 'Trabajo en áreas seguras', category: 'Físicos', description: 'Se deben aplicar medidas de seguridad para trabajar en áreas seguras.', objective: 'Controlar actividades en áreas sensibles.' },
    { id: 'A.7.7', name: 'Escritorio limpio y pantalla limpia', category: 'Físicos', description: 'Se deben definir y aplicar reglas de escritorio y pantalla limpia.', objective: 'Proteger información visible.' },
    { id: 'A.7.8', name: 'Ubicación y protección de equipos', category: 'Físicos', description: 'Los equipos deben ubicarse de forma segura y protegerse.', objective: 'Proteger hardware.' },
    { id: 'A.7.9', name: 'Seguridad de activos fuera de las instalaciones', category: 'Físicos', description: 'Se deben proteger los activos fuera de las instalaciones.', objective: 'Proteger equipos móviles.' },
    { id: 'A.7.10', name: 'Medios de almacenamiento', category: 'Físicos', description: 'Los medios de almacenamiento deben gestionarse durante su ciclo de vida.', objective: 'Controlar medios de almacenamiento.' },
    { id: 'A.7.11', name: 'Servicios de soporte', category: 'Físicos', description: 'Las instalaciones deben protegerse contra fallas de energía.', objective: 'Asegurar disponibilidad de servicios.' },
    { id: 'A.7.12', name: 'Seguridad del cableado', category: 'Físicos', description: 'Los cables de energía y datos deben protegerse.', objective: 'Proteger infraestructura de cableado.' },
    { id: 'A.7.13', name: 'Mantenimiento de equipos', category: 'Físicos', description: 'Los equipos deben mantenerse correctamente.', objective: 'Mantener equipos operativos.' },
    { id: 'A.7.14', name: 'Eliminación segura o reutilización de equipos', category: 'Físicos', description: 'Los equipos con datos deben verificarse antes de eliminarlos o reutilizarlos.', objective: 'Prevenir fuga de datos en equipos descartados.' },

    // ===== Technological Controls (8.x) =====
    { id: 'A.8.1', name: 'Dispositivos de punto final de usuario', category: 'Tecnológicos', description: 'La información en dispositivos de usuario debe protegerse.', objective: 'Proteger endpoints.' },
    { id: 'A.8.2', name: 'Derechos de acceso privilegiado', category: 'Tecnológicos', description: 'La asignación de derechos de acceso privilegiado debe restringirse.', objective: 'Controlar accesos privilegiados.' },
    { id: 'A.8.3', name: 'Restricción de acceso a la información', category: 'Tecnológicos', description: 'El acceso debe restringirse de acuerdo con la política.', objective: 'Aplicar principio de mínimo privilegio.' },
    { id: 'A.8.4', name: 'Acceso al código fuente', category: 'Tecnológicos', description: 'El acceso al código fuente debe gestionarse apropiadamente.', objective: 'Proteger código fuente.' },
    { id: 'A.8.5', name: 'Autenticación segura', category: 'Tecnológicos', description: 'Se deben implementar tecnologías de autenticación segura.', objective: 'Fortalecer autenticación.' },
    { id: 'A.8.6', name: 'Gestión de capacidad', category: 'Tecnológicos', description: 'El uso de recursos debe monitorearse y ajustarse.', objective: 'Asegurar capacidad adecuada.' },
    { id: 'A.8.7', name: 'Protección contra malware', category: 'Tecnológicos', description: 'Se debe implementar protección contra malware.', objective: 'Prevenir infecciones de malware.' },
    { id: 'A.8.8', name: 'Gestión de vulnerabilidades técnicas', category: 'Tecnológicos', description: 'Se debe evaluar la exposición a vulnerabilidades técnicas.', objective: 'Remediar vulnerabilidades.' },
    { id: 'A.8.9', name: 'Gestión de configuración', category: 'Tecnológicos', description: 'Las configuraciones de seguridad deben establecerse y gestionarse.', objective: 'Mantener configuraciones seguras.' },
    { id: 'A.8.10', name: 'Eliminación de información', category: 'Tecnológicos', description: 'La información debe eliminarse cuando ya no sea necesaria.', objective: 'Eliminar datos de forma segura.' },
    { id: 'A.8.11', name: 'Enmascaramiento de datos', category: 'Tecnológicos', description: 'El enmascaramiento de datos debe usarse según la política.', objective: 'Proteger datos sensibles.' },
    { id: 'A.8.12', name: 'Prevención de fuga de datos', category: 'Tecnológicos', description: 'Se deben aplicar medidas de prevención de fuga de datos.', objective: 'Prevenir exfiltración de datos.' },
    { id: 'A.8.13', name: 'Respaldo de la información', category: 'Tecnológicos', description: 'Se deben mantener y probar copias de respaldo.', objective: 'Asegurar recuperación de datos.' },
    { id: 'A.8.14', name: 'Redundancia de instalaciones de procesamiento', category: 'Tecnológicos', description: 'Las instalaciones deben implementarse con redundancia suficiente.', objective: 'Asegurar alta disponibilidad.' },
    { id: 'A.8.15', name: 'Registro', category: 'Tecnológicos', description: 'Se deben producir, almacenar y analizar registros de actividades.', objective: 'Mantener trazabilidad de eventos.' },
    { id: 'A.8.16', name: 'Actividades de monitoreo', category: 'Tecnológicos', description: 'Se deben monitorear redes, sistemas y aplicaciones.', objective: 'Detectar actividades sospechosas.' },
    { id: 'A.8.17', name: 'Sincronización de relojes', category: 'Tecnológicos', description: 'Los relojes de los sistemas deben sincronizarse.', objective: 'Asegurar consistencia de timestamps.' },
    { id: 'A.8.18', name: 'Uso de programas utilitarios privilegiados', category: 'Tecnológicos', description: 'El uso de programas utilitarios privilegiados debe restringirse.', objective: 'Controlar herramientas de administración.' },
    { id: 'A.8.19', name: 'Instalación de software en sistemas operativos', category: 'Tecnológicos', description: 'Se deben implementar procedimientos para gestionar instalación de software.', objective: 'Controlar instalación de software.' },
    { id: 'A.8.20', name: 'Seguridad de redes', category: 'Tecnológicos', description: 'Las redes y dispositivos de red deben protegerse.', objective: 'Proteger infraestructura de red.' },
    { id: 'A.8.21', name: 'Seguridad de servicios de red', category: 'Tecnológicos', description: 'Se deben implementar mecanismos de seguridad para servicios de red.', objective: 'Asegurar servicios de red.' },
    { id: 'A.8.22', name: 'Segregación de redes', category: 'Tecnológicos', description: 'Los grupos de servicios deben segregarse en redes.', objective: 'Separar redes por función.' },
    { id: 'A.8.23', name: 'Filtrado web', category: 'Tecnológicos', description: 'El acceso a sitios web externos debe gestionarse.', objective: 'Controlar navegación web.' },
    { id: 'A.8.24', name: 'Uso de criptografía', category: 'Tecnológicos', description: 'Se deben definir e implementar reglas para el uso de criptografía.', objective: 'Aplicar cifrado apropiado.' },
    { id: 'A.8.25', name: 'Ciclo de vida de desarrollo seguro', category: 'Tecnológicos', description: 'Se deben establecer reglas para el desarrollo seguro.', objective: 'Desarrollar software seguro.' },
    { id: 'A.8.26', name: 'Requisitos de seguridad de aplicaciones', category: 'Tecnológicos', description: 'Los requisitos de seguridad deben identificarse y aprobarse.', objective: 'Definir requisitos de seguridad.' },
    { id: 'A.8.27', name: 'Arquitectura de sistemas seguros', category: 'Tecnológicos', description: 'Se deben establecer principios para diseñar sistemas seguros.', objective: 'Diseñar arquitecturas seguras.' },
    { id: 'A.8.28', name: 'Codificación segura', category: 'Tecnológicos', description: 'Se deben aplicar principios de codificación segura.', objective: 'Escribir código seguro.' },
    { id: 'A.8.29', name: 'Pruebas de seguridad en desarrollo y aceptación', category: 'Tecnológicos', description: 'Los procesos de pruebas de seguridad deben definirse e implementarse.', objective: 'Validar seguridad antes de producción.' },
    { id: 'A.8.30', name: 'Desarrollo externalizado', category: 'Tecnológicos', description: 'La organización debe revisar las actividades de desarrollo externalizado.', objective: 'Controlar desarrollo tercerizado.' },
    { id: 'A.8.31', name: 'Separación de entornos de desarrollo, prueba y producción', category: 'Tecnológicos', description: 'Los entornos deben separarse y protegerse.', objective: 'Aislar entornos.' },
    { id: 'A.8.32', name: 'Gestión de cambios', category: 'Tecnológicos', description: 'Los cambios deben estar sujetos a procedimientos de gestión de cambios.', objective: 'Controlar cambios de forma ordenada.' },
    { id: 'A.8.33', name: 'Información de pruebas', category: 'Tecnológicos', description: 'La información de pruebas debe seleccionarse y protegerse.', objective: 'Proteger datos de prueba.' },
    { id: 'A.8.34', name: 'Protección de sistemas de información durante pruebas de auditoría', category: 'Tecnológicos', description: 'Las pruebas de auditoría deben planificarse para minimizar impacto.', objective: 'Minimizar impacto de auditorías.' },
];

async function seed() {
    console.log('🌱 Seeding database...');

    // Create admin user (password: admin123)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            passwordHash,
            name: 'Administrador',
            role: 'admin'
        }
    });
    console.log('✅ Admin user created (admin@example.com / admin123)');

    // Create controls
    for (const control of controls) {
        await prisma.control.upsert({
            where: { id: control.id },
            update: {},
            create: control
        });
    }
    console.log(`✅ ${controls.length} controls created`);

    // Create default assessments for all controls
    for (const control of controls) {
        const existing = await prisma.controlAssessment.findUnique({
            where: { controlId: control.id }
        });
        if (!existing) {
            await prisma.controlAssessment.create({
                data: {
                    controlId: control.id,
                    applicable: true,
                    targetLevel: 3
                }
            });
        }
    }
    console.log('✅ Default assessments created');

    // Create default tags
    const defaultTags = [
        { name: 'Crítico', color: '#ef4444' },
        { name: 'Urgente', color: '#f97316' },
        { name: 'En Revisión', color: '#eab308' },
        { name: 'Aprobado', color: '#22c55e' },
    ];

    for (const tag of defaultTags) {
        const existing = await prisma.tag.findFirst({ where: { name: tag.name } });
        if (!existing) {
            await prisma.tag.create({ data: tag });
        }
    }
    console.log('✅ Default tags created');

    console.log('🎉 Seed complete!');
}

seed()
    .catch(e => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
