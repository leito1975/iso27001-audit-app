// ISO 42001:2023 Annex A Controls Database
// Complete list of 38 controls organized by domain

export const ISO42001_CONTROLS = [
    // ===================================
    // A.2: AI POLICIES AND GOVERNANCE (6)
    // ===================================
    {
        id: 'A.2.1',
        category: 'Gobernanza y Políticas',
        categoryId: 2,
        name: 'Políticas para sistemas de IA',
        description: 'Establecer, aprobar, publicar y comunicar políticas para sistemas de IA.',
        objective: 'Proporcionar orientación y apoyo de la dirección para sistemas de IA.'
    },
    {
        id: 'A.2.2',
        category: 'Gobernanza y Políticas',
        categoryId: 2,
        name: 'Roles y responsabilidades para sistemas de IA',
        description: 'Definir y asignar roles y responsabilidades para sistemas de IA.',
        objective: 'Establecer una estructura definida para gestionar sistemas de IA.'
    },
    {
        id: 'A.2.3',
        category: 'Gobernanza y Políticas',
        categoryId: 2,
        name: 'Gobernanza de datos',
        description: 'Establecer procesos de gobernanza para la gestión de datos de IA.',
        objective: 'Asegurar gobierno efectivo de datos utilizados en sistemas de IA.'
    },
    {
        id: 'A.2.4',
        category: 'Gobernanza y Políticas',
        categoryId: 2,
        name: 'Sesgo y discriminación en sistemas de IA',
        description: 'Establecer políticas para prevenir sesgo y discriminación en sistemas de IA.',
        objective: 'Prevenir y mitigar sesgo y discriminación en sistemas de IA.'
    },
    {
        id: 'A.2.5',
        category: 'Gobernanza y Políticas',
        categoryId: 2,
        name: 'Transparencia de sistemas de IA',
        description: 'Establecer políticas para transparencia y comunicación sobre sistemas de IA.',
        objective: 'Asegurar transparencia en el uso y funcionamiento de sistemas de IA.'
    },
    {
        id: 'A.2.6',
        category: 'Gobernanza y Políticas',
        categoryId: 2,
        name: 'Contacto con autoridades y stakeholders sobre IA',
        description: 'Establecer contacto con autoridades y grupos de interés sobre regulación de IA.',
        objective: 'Mantenerse informado sobre regulaciones y expectativas de IA.'
    },

    // ===================================
    // A.3: INTERNAL ORGANIZATION (3)
    // ===================================
    {
        id: 'A.3.1',
        category: 'Organización Interna',
        categoryId: 3,
        name: 'Estructura organizacional para gestión de IA',
        description: 'Establecer estructura organizacional apropiada para gestionar sistemas de IA.',
        objective: 'Asegurar responsabilidad clara y recursos para sistemas de IA.'
    },
    {
        id: 'A.3.2',
        category: 'Organización Interna',
        categoryId: 3,
        name: 'Competencia para sistemas de IA',
        description: 'Asegurar competencia necesaria para desarrollar y gestionar sistemas de IA.',
        objective: 'Asegurar personal competente en desarrollo y gestión de IA.'
    },
    {
        id: 'A.3.3',
        category: 'Organización Interna',
        categoryId: 3,
        name: 'Conciencia sobre sistemas de IA',
        description: 'Asegurar conciencia del personal sobre sistemas de IA y requisitos.',
        objective: 'Proporcionar conciencia apropiada sobre sistemas de IA.'
    },

    // ===================================
    // A.4: RESOURCES FOR AI SYSTEMS (7)
    // ===================================
    {
        id: 'A.4.1',
        category: 'Recursos para Sistemas de IA',
        categoryId: 4,
        name: 'Provisión de recursos',
        description: 'Determinar y proporcionar recursos necesarios para sistemas de IA.',
        objective: 'Asegurar disponibilidad de recursos para sistemas de IA efectivos.'
    },
    {
        id: 'A.4.2',
        category: 'Recursos para Sistemas de IA',
        categoryId: 4,
        name: 'Infraestructura de sistemas de IA',
        description: 'Establecer infraestructura apropiada para sistemas de IA.',
        objective: 'Asegurar disponibilidad y seguridad de infraestructura de IA.'
    },
    {
        id: 'A.4.3',
        category: 'Recursos para Sistemas de IA',
        categoryId: 4,
        name: 'Gestión de información y datos para sistemas de IA',
        description: 'Establecer procesos para gestión de información y datos de IA.',
        objective: 'Asegurar calidad e integridad de datos para sistemas de IA.'
    },
    {
        id: 'A.4.4',
        category: 'Recursos para Sistemas de IA',
        categoryId: 4,
        name: 'Entorno de desarrollo, prueba y producción',
        description: 'Separar y gestionar ambientes de desarrollo, prueba y producción para IA.',
        objective: 'Asegurar control y seguridad del ciclo de vida de sistemas de IA.'
    },
    {
        id: 'A.4.5',
        category: 'Recursos para Sistemas de IA',
        categoryId: 4,
        name: 'Disponibilidad y continuidad de sistemas de IA',
        description: 'Asegurar disponibilidad y continuidad de sistemas de IA críticos.',
        objective: 'Prevenir interrupciones no autorizadas de sistemas de IA.'
    },
    {
        id: 'A.4.6',
        category: 'Recursos para Sistemas de IA',
        categoryId: 4,
        name: 'Criptografía en sistemas de IA',
        description: 'Definir e implementar reglas de uso de criptografía en IA.',
        objective: 'Asegurar confidencialidad e integridad de datos de IA.'
    },
    {
        id: 'A.4.7',
        category: 'Recursos para Sistemas de IA',
        categoryId: 4,
        name: 'Protección de información documentada',
        description: 'Proteger información documentada sobre sistemas de IA.',
        objective: 'Prevenir pérdida, divulgación o modificación de información de IA.'
    },

    // ===================================
    // A.5: ASSESSING IMPACTS OF AI SYSTEMS (2)
    // ===================================
    {
        id: 'A.5.1',
        category: 'Evaluación de Impactos',
        categoryId: 5,
        name: 'Evaluación de impacto de sistemas de IA',
        description: 'Realizar evaluaciones de impacto para sistemas de IA.',
        objective: 'Identificar y evaluar impactos potenciales de sistemas de IA.'
    },
    {
        id: 'A.5.2',
        category: 'Evaluación de Impactos',
        categoryId: 5,
        name: 'Evaluación de riesgos de sistemas de IA',
        description: 'Realizar evaluaciones de riesgos específicos para sistemas de IA.',
        objective: 'Identificar y evaluar riesgos asociados con sistemas de IA.'
    },

    // ===================================
    // A.6: AI SYSTEM LIFE CYCLE (6)
    // ===================================
    {
        id: 'A.6.1',
        category: 'Ciclo de Vida de Sistemas de IA',
        categoryId: 6,
        name: 'Planificación de sistemas de IA',
        description: 'Planificar el desarrollo e implementación de sistemas de IA.',
        objective: 'Asegurar planificación sistemática de sistemas de IA.'
    },
    {
        id: 'A.6.2',
        category: 'Ciclo de Vida de Sistemas de IA',
        categoryId: 6,
        name: 'Requisitos de sistemas de IA',
        description: 'Especificar requisitos de gestión para sistemas de IA.',
        objective: 'Asegurar que requisitos se especifican claramente.'
    },
    {
        id: 'A.6.3',
        category: 'Ciclo de Vida de Sistemas de IA',
        categoryId: 6,
        name: 'Diseño e implementación de sistemas de IA',
        description: 'Diseñar e implementar sistemas de IA siguiendo buenas prácticas.',
        objective: 'Asegurar diseño seguro y confiable de sistemas de IA.'
    },
    {
        id: 'A.6.4',
        category: 'Ciclo de Vida de Sistemas de IA',
        categoryId: 6,
        name: 'Pruebas de sistemas de IA',
        description: 'Realizar pruebas apropiadas de sistemas de IA.',
        objective: 'Validar funcionamiento y seguridad de sistemas de IA.'
    },
    {
        id: 'A.6.5',
        category: 'Ciclo de Vida de Sistemas de IA',
        categoryId: 6,
        name: 'Monitoreo y evaluación de sistemas de IA',
        description: 'Monitorear y evaluar el desempeño de sistemas de IA.',
        objective: 'Detectar y responder a problemas en sistemas de IA.'
    },
    {
        id: 'A.6.6',
        category: 'Ciclo de Vida de Sistemas de IA',
        categoryId: 6,
        name: 'Reentrenamiento de sistemas de IA',
        description: 'Establecer procesos para reentrenamiento de sistemas de IA.',
        objective: 'Mantener calidad y relevancia de modelos de IA.'
    },

    // ===================================
    // A.7: DATA FOR AI SYSTEMS (5)
    // ===================================
    {
        id: 'A.7.1',
        category: 'Datos para Sistemas de IA',
        categoryId: 7,
        name: 'Adquisición de datos para IA',
        description: 'Establecer controles para adquisición de datos para IA.',
        objective: 'Asegurar calidad y legalidad de datos de entrenamiento.'
    },
    {
        id: 'A.7.2',
        category: 'Datos para Sistemas de IA',
        categoryId: 7,
        name: 'Limpieza de datos para IA',
        description: 'Definir procesos para limpieza y preparación de datos.',
        objective: 'Asegurar calidad de datos para entrenamiento de modelos.'
    },
    {
        id: 'A.7.3',
        category: 'Datos para Sistemas de IA',
        categoryId: 7,
        name: 'Etiquetado y anotación de datos',
        description: 'Establecer procedimientos para etiquetado consistente de datos.',
        objective: 'Asegurar precisión en etiquetado de datos de entrenamiento.'
    },
    {
        id: 'A.7.4',
        category: 'Datos para Sistemas de IA',
        categoryId: 7,
        name: 'Almacenamiento y protección de datos',
        description: 'Proteger datos de entrenamiento de acceso no autorizado.',
        objective: 'Asegurar confidencialidad e integridad de datos de IA.'
    },
    {
        id: 'A.7.5',
        category: 'Datos para Sistemas de IA',
        categoryId: 7,
        name: 'Retention y disposición de datos',
        description: 'Establecer políticas para retención y eliminación de datos.',
        objective: 'Cumplir con requisitos legales y de privacidad.'
    },

    // ===================================
    // A.8: INFORMATION FOR INTERESTED PARTIES (4)
    // ===================================
    {
        id: 'A.8.1',
        category: 'Información para Partes Interesadas',
        categoryId: 8,
        name: 'Transparencia sobre sistemas de IA',
        description: 'Proporcionar información transparente sobre sistemas de IA.',
        objective: 'Comunicar capacidades y limitaciones de sistemas de IA.'
    },
    {
        id: 'A.8.2',
        category: 'Información para Partes Interesadas',
        categoryId: 8,
        name: 'Documentación de sistemas de IA',
        description: 'Mantener documentación completa de sistemas de IA.',
        objective: 'Asegurar disponibilidad de información sobre sistemas de IA.'
    },
    {
        id: 'A.8.3',
        category: 'Información para Partes Interesadas',
        categoryId: 8,
        name: 'Comunicación sobre decisiones de IA',
        description: 'Comunicar cómo sistemas de IA toman decisiones.',
        objective: 'Proporcionar explicabilidad de decisiones de IA.'
    },
    {
        id: 'A.8.4',
        category: 'Información para Partes Interesadas',
        categoryId: 8,
        name: 'Gestión de quejas y retroalimentación',
        description: 'Establecer mecanismos para quejas sobre sistemas de IA.',
        objective: 'Permitir retroalimentación y resolución de preocupaciones.'
    },

    // ===================================
    // A.9: USE OF AI SYSTEMS (2)
    // ===================================
    {
        id: 'A.9.1',
        category: 'Uso de Sistemas de IA',
        categoryId: 9,
        name: 'Autorización para uso de sistemas de IA',
        description: 'Autorizar y controlar uso de sistemas de IA.',
        objective: 'Asegurar uso apropiado y autorizado de sistemas de IA.'
    },
    {
        id: 'A.9.2',
        category: 'Uso de Sistemas de IA',
        categoryId: 9,
        name: 'Supervisión humana de sistemas de IA',
        description: 'Mantener supervisión humana de sistemas de IA en decisiones críticas.',
        objective: 'Asegurar intervención humana en decisiones críticas de IA.'
    },

    // ===================================
    // A.10: THIRD-PARTY AND CUSTOMER RELATIONSHIPS (4)
    // ===================================
    {
        id: 'A.10.1',
        category: 'Relaciones con Terceros y Clientes',
        categoryId: 10,
        name: 'Seguridad de sistemas de IA de terceros',
        description: 'Establecer requisitos de seguridad con proveedores de IA.',
        objective: 'Asegurar seguridad de sistemas de IA de terceros.'
    },
    {
        id: 'A.10.2',
        category: 'Relaciones con Terceros y Clientes',
        categoryId: 10,
        name: 'Información de clientes sobre sistemas de IA',
        description: 'Proteger información de clientes usada en sistemas de IA.',
        objective: 'Asegurar privacidad y protección de datos de clientes.'
    },
    {
        id: 'A.10.3',
        category: 'Relaciones con Terceros y Clientes',
        categoryId: 10,
        name: 'Responsabilidad por sistemas de IA',
        description: 'Establecer responsabilidades por sistemas de IA con terceros.',
        objective: 'Clarificar responsabilidades legales y operacionales.'
    },
    {
        id: 'A.10.4',
        category: 'Relaciones con Terceros y Clientes',
        categoryId: 10,
        name: 'Gestión de riesgos con proveedores de IA',
        description: 'Monitorear y gestionar riesgos de proveedores de IA.',
        objective: 'Asegurar cumplimiento continuo de requisitos de IA.'
    }
];

// CMMI Maturity Levels (same as ISO 27001)
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
export const ISO42001_CONTROL_CATEGORIES = [
    { id: 2, name: 'Gobernanza y Políticas', icon: 'Building2', count: 6, color: '#7c3aed' },
    { id: 3, name: 'Organización Interna', icon: 'Users', count: 3, color: '#8b5cf6' },
    { id: 4, name: 'Recursos para Sistemas de IA', icon: 'Cpu', count: 7, color: '#10b981' },
    { id: 5, name: 'Evaluación de Impactos', icon: 'AlertTriangle', count: 2, color: '#f59e0b' },
    { id: 6, name: 'Ciclo de Vida de Sistemas de IA', icon: 'GitBranch', count: 6, color: '#3b82f6' },
    { id: 7, name: 'Datos para Sistemas de IA', icon: 'Database', count: 5, color: '#ec4899' },
    { id: 8, name: 'Información para Partes Interesadas', icon: 'FileText', count: 4, color: '#14b8a6' },
    { id: 9, name: 'Uso de Sistemas de IA', icon: 'Play', count: 2, color: '#f97316' },
    { id: 10, name: 'Relaciones con Terceros y Clientes', icon: 'Link', count: 4, color: '#6366f1' }
];

// Finding Types (same as ISO 27001)
export const ISO42001_FINDING_TYPES = [
    { id: 'nc-major', name: 'No Conformidad Mayor', severity: 'critical', color: 'var(--color-danger)' },
    { id: 'nc-minor', name: 'No Conformidad Menor', severity: 'high', color: 'var(--color-warning)' },
    { id: 'observation', name: 'Observación', severity: 'medium', color: 'var(--color-info)' },
    { id: 'ofi', name: 'Oportunidad de Mejora', severity: 'low', color: 'var(--color-success)' },
    { id: 'strength', name: 'Fortaleza', severity: 'info', color: '#7c3aed' }
];
