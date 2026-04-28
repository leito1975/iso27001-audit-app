// ISO 27001:2022 Annex A Controls Database
// Complete list of 93 controls organized by category

export const ISO27001_CONTROLS = [
    // ===================================
    // 5. ORGANIZATIONAL CONTROLS (37)
    // ===================================
    {
        id: 'A.5.1',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Políticas de seguridad de la información',
        description: 'Definir, aprobar, publicar y comunicar políticas de seguridad de la información.',
        objective: 'Proporcionar orientación y apoyo de la dirección para la seguridad de la información.'
    },
    {
        id: 'A.5.2',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Roles y responsabilidades de seguridad de la información',
        description: 'Definir y asignar roles y responsabilidades de seguridad de la información.',
        objective: 'Establecer una estructura definida para gestionar la seguridad de la información.'
    },
    {
        id: 'A.5.3',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Segregación de funciones',
        description: 'Segregar funciones y áreas de responsabilidad conflictivas.',
        objective: 'Reducir oportunidades de modificación no autorizada o uso indebido de activos.'
    },
    {
        id: 'A.5.4',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Responsabilidades de la dirección',
        description: 'La dirección debe requerir que todo el personal aplique la seguridad de la información.',
        objective: 'Asegurar que la dirección apoye activamente la seguridad dentro de la organización.'
    },
    {
        id: 'A.5.5',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Contacto con autoridades',
        description: 'Establecer y mantener contacto con autoridades relevantes.',
        objective: 'Asegurar el flujo apropiado de información con autoridades.'
    },
    {
        id: 'A.5.6',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Contacto con grupos de interés especial',
        description: 'Establecer contacto con grupos de interés especial y foros de seguridad.',
        objective: 'Mantener conocimiento actualizado sobre seguridad de la información.'
    },
    {
        id: 'A.5.7',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Inteligencia de amenazas',
        description: 'Recopilar y analizar información sobre amenazas de seguridad.',
        objective: 'Proporcionar conciencia del entorno de amenazas de la organización.'
    },
    {
        id: 'A.5.8',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Seguridad de la información en gestión de proyectos',
        description: 'Integrar la seguridad de la información en la gestión de proyectos.',
        objective: 'Asegurar que los riesgos de seguridad se aborden en los proyectos.'
    },
    {
        id: 'A.5.9',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Inventario de información y otros activos asociados',
        description: 'Desarrollar y mantener un inventario de activos de información.',
        objective: 'Identificar activos para protección apropiada.'
    },
    {
        id: 'A.5.10',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Uso aceptable de información y otros activos',
        description: 'Identificar y documentar reglas para el uso aceptable de activos.',
        objective: 'Asegurar que la información y activos se manejen apropiadamente.'
    },
    {
        id: 'A.5.11',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Devolución de activos',
        description: 'El personal debe devolver activos al terminar su empleo o contrato.',
        objective: 'Proteger los activos de la organización durante cambios de personal.'
    },
    {
        id: 'A.5.12',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Clasificación de la información',
        description: 'Clasificar información según necesidades de protección.',
        objective: 'Asegurar que la información reciba el nivel apropiado de protección.'
    },
    {
        id: 'A.5.13',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Etiquetado de la información',
        description: 'Desarrollar e implementar procedimientos de etiquetado.',
        objective: 'Facilitar la comunicación de la clasificación de la información.'
    },
    {
        id: 'A.5.14',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Transferencia de información',
        description: 'Establecer reglas y procedimientos para transferencia de información.',
        objective: 'Mantener la seguridad de la información transferida.'
    },
    {
        id: 'A.5.15',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Control de acceso',
        description: 'Establecer e implementar reglas de control de acceso.',
        objective: 'Asegurar acceso autorizado y prevenir acceso no autorizado.'
    },
    {
        id: 'A.5.16',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Gestión de identidades',
        description: 'Gestionar el ciclo de vida completo de las identidades.',
        objective: 'Permitir la identificación única de individuos y sistemas.'
    },
    {
        id: 'A.5.17',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Información de autenticación',
        description: 'Controlar la asignación y gestión de información de autenticación.',
        objective: 'Asegurar la autenticación apropiada de entidades.'
    },
    {
        id: 'A.5.18',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Derechos de acceso',
        description: 'Provisionar, revisar y remover derechos de acceso.',
        objective: 'Asegurar que el acceso a sistemas esté autorizado y actualizado.'
    },
    {
        id: 'A.5.19',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Seguridad de la información en relaciones con proveedores',
        description: 'Establecer requisitos de seguridad con proveedores.',
        objective: 'Mantener el nivel acordado de seguridad en relaciones con proveedores.'
    },
    {
        id: 'A.5.20',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Tratamiento de seguridad en acuerdos con proveedores',
        description: 'Establecer requisitos de seguridad relevantes con cada proveedor.',
        objective: 'Mantener el nivel acordado de seguridad de la información.'
    },
    {
        id: 'A.5.21',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Gestión de seguridad en la cadena de suministro TIC',
        description: 'Definir e implementar procesos para gestionar riesgos de la cadena de suministro.',
        objective: 'Mantener nivel acordado de seguridad en cadena de suministro TIC.'
    },
    {
        id: 'A.5.22',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Seguimiento, revisión y gestión de cambios de proveedores',
        description: 'Monitorear y revisar regularmente las prácticas de seguridad de proveedores.',
        objective: 'Mantener nivel acordado de seguridad y entrega de servicios.'
    },
    {
        id: 'A.5.23',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Seguridad de la información para uso de servicios en la nube',
        description: 'Establecer procesos para adquisición y gestión de servicios en la nube.',
        objective: 'Especificar y gestionar seguridad para uso de servicios en la nube.'
    },
    {
        id: 'A.5.24',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Planificación y preparación de gestión de incidentes',
        description: 'Planificar y preparar gestión de incidentes de seguridad.',
        objective: 'Asegurar respuesta rápida y efectiva a incidentes.'
    },
    {
        id: 'A.5.25',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Evaluación y decisión sobre eventos de seguridad',
        description: 'Evaluar eventos de seguridad y decidir si son incidentes.',
        objective: 'Asegurar categorización y priorización efectiva de incidentes.'
    },
    {
        id: 'A.5.26',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Respuesta a incidentes de seguridad de la información',
        description: 'Responder a incidentes según procedimientos documentados.',
        objective: 'Asegurar respuesta efectiva a incidentes de seguridad.'
    },
    {
        id: 'A.5.27',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Aprendizaje de incidentes de seguridad',
        description: 'Usar conocimiento de incidentes para fortalecer controles.',
        objective: 'Reducir la probabilidad o impacto de incidentes futuros.'
    },
    {
        id: 'A.5.28',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Recopilación de evidencias',
        description: 'Establecer procedimientos para recopilación de evidencias.',
        objective: 'Asegurar gestión consistente de evidencias para acciones legales.'
    },
    {
        id: 'A.5.29',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Seguridad de la información durante la interrupción',
        description: 'Planificar cómo mantener seguridad durante interrupciones.',
        objective: 'Proteger información durante situaciones adversas.'
    },
    {
        id: 'A.5.30',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Preparación TIC para continuidad del negocio',
        description: 'Planificar, implementar y probar preparación TIC.',
        objective: 'Asegurar disponibilidad de TIC durante interrupciones.'
    },
    {
        id: 'A.5.31',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Requisitos legales, estatutarios, regulatorios y contractuales',
        description: 'Identificar y documentar requisitos legales y regulatorios.',
        objective: 'Asegurar cumplimiento de requisitos legales.'
    },
    {
        id: 'A.5.32',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Derechos de propiedad intelectual',
        description: 'Implementar procedimientos para proteger propiedad intelectual.',
        objective: 'Asegurar cumplimiento de requisitos de propiedad intelectual.'
    },
    {
        id: 'A.5.33',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Protección de registros',
        description: 'Proteger registros de pérdida, destrucción y falsificación.',
        objective: 'Asegurar cumplimiento de requisitos de retención de registros.'
    },
    {
        id: 'A.5.34',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Privacidad y protección de datos personales',
        description: 'Identificar y cumplir requisitos de privacidad y protección de datos.',
        objective: 'Asegurar cumplimiento de requisitos de privacidad.'
    },
    {
        id: 'A.5.35',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Revisión independiente de seguridad de la información',
        description: 'Revisar independientemente el enfoque de seguridad.',
        objective: 'Asegurar idoneidad y efectividad del enfoque de seguridad.'
    },
    {
        id: 'A.5.36',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Cumplimiento de políticas, reglas y estándares',
        description: 'Revisar regularmente el cumplimiento de políticas de seguridad.',
        objective: 'Asegurar que la seguridad se implementa según políticas.'
    },
    {
        id: 'A.5.37',
        category: 'Organizacionales',
        categoryId: 5,
        name: 'Procedimientos operacionales documentados',
        description: 'Documentar y mantener disponibles procedimientos operacionales.',
        objective: 'Asegurar operación correcta de instalaciones de procesamiento.'
    },

    // ===================================
    // 6. PEOPLE CONTROLS (8)
    // ===================================
    {
        id: 'A.6.1',
        category: 'Personas',
        categoryId: 6,
        name: 'Verificación de antecedentes',
        description: 'Verificar antecedentes de candidatos antes de contratación.',
        objective: 'Asegurar que el personal es adecuado y digno de confianza.'
    },
    {
        id: 'A.6.2',
        category: 'Personas',
        categoryId: 6,
        name: 'Términos y condiciones de empleo',
        description: 'Incluir responsabilidades de seguridad en acuerdos contractuales.',
        objective: 'Asegurar que el personal entiende sus responsabilidades de seguridad.'
    },
    {
        id: 'A.6.3',
        category: 'Personas',
        categoryId: 6,
        name: 'Concientización, educación y formación',
        description: 'Proporcionar concientización y formación apropiada en seguridad.',
        objective: 'Asegurar que el personal es consciente de sus obligaciones.'
    },
    {
        id: 'A.6.4',
        category: 'Personas',
        categoryId: 6,
        name: 'Proceso disciplinario',
        description: 'Formalizar y comunicar proceso disciplinario para violaciones.',
        objective: 'Asegurar que el personal sabe las consecuencias de violaciones.'
    },
    {
        id: 'A.6.5',
        category: 'Personas',
        categoryId: 6,
        name: 'Responsabilidades al terminar o cambiar empleo',
        description: 'Definir responsabilidades de seguridad que permanecen después del empleo.',
        objective: 'Proteger intereses de la organización durante cambios de personal.'
    },
    {
        id: 'A.6.6',
        category: 'Personas',
        categoryId: 6,
        name: 'Acuerdos de confidencialidad o no divulgación',
        description: 'Identificar y documentar requisitos de confidencialidad.',
        objective: 'Mantener confidencialidad de información accedida por personal.'
    },
    {
        id: 'A.6.7',
        category: 'Personas',
        categoryId: 6,
        name: 'Trabajo remoto',
        description: 'Implementar medidas de seguridad para trabajo remoto.',
        objective: 'Proteger información cuando el personal trabaja remotamente.'
    },
    {
        id: 'A.6.8',
        category: 'Personas',
        categoryId: 6,
        name: 'Reporte de eventos de seguridad de la información',
        description: 'Proporcionar mecanismo para reportar eventos de seguridad.',
        objective: 'Apoyar reporte oportuno de eventos de seguridad.'
    },

    // ===================================
    // 7. PHYSICAL CONTROLS (14)
    // ===================================
    {
        id: 'A.7.1',
        category: 'Físicos',
        categoryId: 7,
        name: 'Perímetros de seguridad física',
        description: 'Definir y usar perímetros de seguridad para proteger áreas.',
        objective: 'Prevenir acceso físico no autorizado.'
    },
    {
        id: 'A.7.2',
        category: 'Físicos',
        categoryId: 7,
        name: 'Controles de entrada física',
        description: 'Proteger áreas seguras con controles de entrada apropiados.',
        objective: 'Asegurar que solo personal autorizado tenga acceso físico.'
    },
    {
        id: 'A.7.3',
        category: 'Físicos',
        categoryId: 7,
        name: 'Seguridad de oficinas, salas e instalaciones',
        description: 'Diseñar e implementar seguridad física para oficinas.',
        objective: 'Prevenir acceso no autorizado a oficinas y salas.'
    },
    {
        id: 'A.7.4',
        category: 'Físicos',
        categoryId: 7,
        name: 'Monitoreo de seguridad física',
        description: 'Monitorear continuamente las instalaciones para acceso no autorizado.',
        objective: 'Detectar y disuadir acceso físico no autorizado.'
    },
    {
        id: 'A.7.5',
        category: 'Físicos',
        categoryId: 7,
        name: 'Protección contra amenazas físicas y ambientales',
        description: 'Diseñar e implementar protección contra amenazas físicas.',
        objective: 'Prevenir o reducir impacto de desastres físicos.'
    },
    {
        id: 'A.7.6',
        category: 'Físicos',
        categoryId: 7,
        name: 'Trabajo en áreas seguras',
        description: 'Diseñar e implementar procedimientos para trabajo en áreas seguras.',
        objective: 'Proteger información en áreas seguras.'
    },
    {
        id: 'A.7.7',
        category: 'Físicos',
        categoryId: 7,
        name: 'Escritorio y pantalla limpios',
        description: 'Definir y aplicar reglas de escritorio y pantalla limpios.',
        objective: 'Reducir riesgos de acceso no autorizado a información.'
    },
    {
        id: 'A.7.8',
        category: 'Físicos',
        categoryId: 7,
        name: 'Ubicación y protección de equipos',
        description: 'Ubicar y proteger equipos de forma segura.',
        objective: 'Reducir riesgos de amenazas físicas y ambientales.'
    },
    {
        id: 'A.7.9',
        category: 'Físicos',
        categoryId: 7,
        name: 'Seguridad de activos fuera de las instalaciones',
        description: 'Proteger activos fuera de las instalaciones.',
        objective: 'Prevenir pérdida o daño de activos fuera de la organización.'
    },
    {
        id: 'A.7.10',
        category: 'Físicos',
        categoryId: 7,
        name: 'Medios de almacenamiento',
        description: 'Gestionar medios de almacenamiento durante su ciclo de vida.',
        objective: 'Asegurar divulgación, modificación o destrucción no autorizada.'
    },
    {
        id: 'A.7.11',
        category: 'Físicos',
        categoryId: 7,
        name: 'Servicios de soporte',
        description: 'Proteger instalaciones de fallas de servicios de soporte.',
        objective: 'Prevenir pérdida o daño de información por fallas de servicios.'
    },
    {
        id: 'A.7.12',
        category: 'Físicos',
        categoryId: 7,
        name: 'Seguridad del cableado',
        description: 'Proteger cables de energía y telecomunicaciones.',
        objective: 'Prevenir interceptación o daño de información transmitida.'
    },
    {
        id: 'A.7.13',
        category: 'Físicos',
        categoryId: 7,
        name: 'Mantenimiento de equipos',
        description: 'Mantener equipos correctamente para disponibilidad e integridad.',
        objective: 'Prevenir pérdida o daño de información por fallas de equipos.'
    },
    {
        id: 'A.7.14',
        category: 'Físicos',
        categoryId: 7,
        name: 'Eliminación o reutilización segura de equipos',
        description: 'Verificar que equipos con datos se eliminen o reutilicen seguramente.',
        objective: 'Prevenir fuga de información de equipos retirados.'
    },

    // ===================================
    // 8. TECHNOLOGICAL CONTROLS (34)
    // ===================================
    {
        id: 'A.8.1',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Dispositivos de punto final de usuario',
        description: 'Proteger información en dispositivos de punto final.',
        objective: 'Proteger información accedida, procesada o almacenada en endpoints.'
    },
    {
        id: 'A.8.2',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Derechos de acceso privilegiado',
        description: 'Restringir y gestionar asignación de derechos privilegiados.',
        objective: 'Asegurar acceso autorizado a sistemas y recursos críticos.'
    },
    {
        id: 'A.8.3',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Restricción de acceso a información',
        description: 'Restringir acceso a información y funciones de sistemas.',
        objective: 'Asegurar acceso autorizado y prevenir acceso no autorizado.'
    },
    {
        id: 'A.8.4',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Acceso a código fuente',
        description: 'Gestionar apropiadamente acceso a código fuente.',
        objective: 'Prevenir introducción de funcionalidad no autorizada.'
    },
    {
        id: 'A.8.5',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Autenticación segura',
        description: 'Implementar tecnologías y procedimientos de autenticación segura.',
        objective: 'Asegurar que usuarios y sistemas están correctamente autenticados.'
    },
    {
        id: 'A.8.6',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Gestión de capacidad',
        description: 'Monitorear y ajustar uso de recursos según requisitos.',
        objective: 'Asegurar capacidad de procesamiento requerida.'
    },
    {
        id: 'A.8.7',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Protección contra malware',
        description: 'Implementar protección contra malware.',
        objective: 'Asegurar que información y sistemas están protegidos contra malware.'
    },
    {
        id: 'A.8.8',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Gestión de vulnerabilidades técnicas',
        description: 'Obtener información sobre vulnerabilidades y tomar medidas.',
        objective: 'Prevenir explotación de vulnerabilidades técnicas.'
    },
    {
        id: 'A.8.9',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Gestión de configuración',
        description: 'Establecer y gestionar configuraciones de seguridad.',
        objective: 'Asegurar que hardware, software y servicios funcionan correctamente.'
    },
    {
        id: 'A.8.10',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Eliminación de información',
        description: 'Eliminar información cuando ya no se requiere.',
        objective: 'Prevenir exposición innecesaria de información sensible.'
    },
    {
        id: 'A.8.11',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Enmascaramiento de datos',
        description: 'Usar enmascaramiento de datos según políticas.',
        objective: 'Limitar exposición de datos sensibles.'
    },
    {
        id: 'A.8.12',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Prevención de fuga de datos',
        description: 'Aplicar medidas de prevención de fuga de datos.',
        objective: 'Detectar y prevenir divulgación no autorizada.'
    },
    {
        id: 'A.8.13',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Respaldo de la información',
        description: 'Mantener y probar regularmente copias de respaldo.',
        objective: 'Permitir recuperación de pérdida de datos o sistemas.'
    },
    {
        id: 'A.8.14',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Redundancia de instalaciones de procesamiento',
        description: 'Implementar redundancia suficiente para disponibilidad.',
        objective: 'Asegurar disponibilidad de instalaciones de procesamiento.'
    },
    {
        id: 'A.8.15',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Registro de eventos',
        description: 'Producir, almacenar, proteger y analizar registros.',
        objective: 'Registrar eventos para investigaciones y monitoreo.'
    },
    {
        id: 'A.8.16',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Actividades de monitoreo',
        description: 'Monitorear redes, sistemas y aplicaciones.',
        objective: 'Detectar comportamiento anómalo y evaluar incidentes.'
    },
    {
        id: 'A.8.17',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Sincronización de relojes',
        description: 'Sincronizar relojes de sistemas a fuentes aprobadas.',
        objective: 'Permitir correlación de eventos de seguridad.'
    },
    {
        id: 'A.8.18',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Uso de programas utilitarios privilegiados',
        description: 'Restringir y controlar uso de programas utilitarios.',
        objective: 'Prevenir uso no autorizado de programas privilegiados.'
    },
    {
        id: 'A.8.19',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Instalación de software en sistemas operacionales',
        description: 'Implementar procedimientos para gestionar instalación de software.',
        objective: 'Asegurar integridad de sistemas operacionales.'
    },
    {
        id: 'A.8.20',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Seguridad de redes',
        description: 'Proteger información en redes y sistemas de red.',
        objective: 'Proteger información en redes de amenazas.'
    },
    {
        id: 'A.8.21',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Seguridad de servicios de red',
        description: 'Identificar e implementar mecanismos y niveles de servicio.',
        objective: 'Asegurar seguridad en uso de servicios de red.'
    },
    {
        id: 'A.8.22',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Segregación de redes',
        description: 'Segregar grupos de servicios, usuarios y sistemas.',
        objective: 'Gestionar seguridad de grandes redes.'
    },
    {
        id: 'A.8.23',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Filtrado web',
        description: 'Gestionar acceso a sitios web externos.',
        objective: 'Proteger sistemas de malware y prevenir acceso a contenido no autorizado.'
    },
    {
        id: 'A.8.24',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Uso de criptografía',
        description: 'Definir e implementar reglas de uso de criptografía.',
        objective: 'Asegurar uso efectivo de criptografía.'
    },
    {
        id: 'A.8.25',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Ciclo de vida de desarrollo seguro',
        description: 'Establecer y aplicar reglas de desarrollo seguro.',
        objective: 'Asegurar seguridad en el ciclo de desarrollo de software.'
    },
    {
        id: 'A.8.26',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Requisitos de seguridad de aplicaciones',
        description: 'Identificar y especificar requisitos de seguridad.',
        objective: 'Asegurar que la seguridad está diseñada en aplicaciones.'
    },
    {
        id: 'A.8.27',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Arquitectura de sistemas seguros y principios de ingeniería',
        description: 'Establecer y aplicar principios de ingeniería segura.',
        objective: 'Asegurar que sistemas se diseñan, implementan y operan seguramente.'
    },
    {
        id: 'A.8.28',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Codificación segura',
        description: 'Aplicar principios de codificación segura.',
        objective: 'Asegurar que software se escribe de forma segura.'
    },
    {
        id: 'A.8.29',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Pruebas de seguridad en desarrollo y aceptación',
        description: 'Definir y aplicar pruebas de seguridad.',
        objective: 'Validar que los requisitos de seguridad se cumplen.'
    },
    {
        id: 'A.8.30',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Desarrollo externalizado',
        description: 'Dirigir, monitorear y revisar desarrollo externalizado.',
        objective: 'Asegurar que desarrollo externalizado cumple requisitos.'
    },
    {
        id: 'A.8.31',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Separación de ambientes de desarrollo, prueba y producción',
        description: 'Separar y proteger ambientes de desarrollo y prueba.',
        objective: 'Reducir riesgos de acceso o cambios no autorizados.'
    },
    {
        id: 'A.8.32',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Gestión de cambios',
        description: 'Someter cambios a procedimientos de gestión de cambios.',
        objective: 'Preservar seguridad al ejecutar cambios.'
    },
    {
        id: 'A.8.33',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Información de prueba',
        description: 'Seleccionar y proteger información de prueba.',
        objective: 'Asegurar relevancia y protección de información de prueba.'
    },
    {
        id: 'A.8.34',
        category: 'Tecnológicos',
        categoryId: 8,
        name: 'Protección de sistemas durante pruebas de auditoría',
        description: 'Planificar pruebas de auditoría minimizando impacto.',
        objective: 'Minimizar impacto de actividades de auditoría en operaciones.'
    }
];

// CMMI Maturity Levels
export const CMMI_LEVELS = [
    {
        level: 0,
        name: 'Inexistente',
        description: 'El control no existe o no se ha implementado.',
        color: 'var(--cmmi-0)'
    },
    {
        level: 1,
        name: 'Inicial',
        description: 'Proceso ad-hoc. El éxito depende de esfuerzos individuales.',
        color: 'var(--cmmi-1)'
    },
    {
        level: 2,
        name: 'Repetible',
        description: 'Proceso básico establecido pero no estandarizado.',
        color: 'var(--cmmi-2)'
    },
    {
        level: 3,
        name: 'Definido',
        description: 'Proceso documentado, estandarizado e integrado.',
        color: 'var(--cmmi-3)'
    },
    {
        level: 4,
        name: 'Gestionado',
        description: 'Proceso medido y controlado con métricas.',
        color: 'var(--cmmi-4)'
    },
    {
        level: 5,
        name: 'Optimizado',
        description: 'Mejora continua basada en retroalimentación cuantitativa.',
        color: 'var(--cmmi-5)'
    }
];

// Categories summary
export const CONTROL_CATEGORIES = [
    { id: 5, name: 'Organizacionales', icon: 'Building2', count: 37, color: '#3b82f6' },
    { id: 6, name: 'Personas', icon: 'Users', count: 8, color: '#8b5cf6' },
    { id: 7, name: 'Físicos', icon: 'Shield', count: 14, color: '#f59e0b' },
    { id: 8, name: 'Tecnológicos', icon: 'Cpu', count: 34, color: '#10b981' }
];

// Finding Types
export const FINDING_TYPES = [
    { id: 'nc-major', name: 'No Conformidad Mayor', severity: 'critical', color: 'var(--color-danger)' },
    { id: 'nc-minor', name: 'No Conformidad Menor', severity: 'high', color: 'var(--color-warning)' },
    { id: 'observation', name: 'Observación', severity: 'medium', color: 'var(--color-info)' },
    { id: 'ofi', name: 'Oportunidad de Mejora', severity: 'low', color: 'var(--color-success)' },
    { id: 'strength', name: 'Fortaleza', severity: 'info', color: '#7c3aed' }
];

// Risk Levels
export const RISK_LEVELS = {
    probability: [
        { value: 1, label: 'Muy Baja', description: 'Excepcional, casi imposible' },
        { value: 2, label: 'Baja', description: 'Poco probable' },
        { value: 3, label: 'Media', description: 'Posible' },
        { value: 4, label: 'Alta', description: 'Probable' },
        { value: 5, label: 'Muy Alta', description: 'Casi seguro' }
    ],
    impact: [
        { value: 1, label: 'Insignificante', description: 'Impacto mínimo' },
        { value: 2, label: 'Menor', description: 'Impacto bajo' },
        { value: 3, label: 'Moderado', description: 'Impacto significativo' },
        { value: 4, label: 'Mayor', description: 'Impacto severo' },
        { value: 5, label: 'Catastrófico', description: 'Impacto crítico' }
    ]
};

export const getRiskLevel = (probability, impact) => {
    const score = probability * impact;
    if (score >= 15) return { level: 'Crítico', color: 'var(--risk-critical)', class: 'danger' };
    if (score >= 9) return { level: 'Alto', color: 'var(--risk-high)', class: 'warning' };
    if (score >= 4) return { level: 'Medio', color: 'var(--risk-medium)', class: 'warning' };
    return { level: 'Bajo', color: 'var(--risk-low)', class: 'success' };
};
