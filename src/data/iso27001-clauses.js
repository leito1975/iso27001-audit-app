// ISO 27001:2022 Requirements (Clauses 4-10)
// These are the management system requirements, different from Annex A controls

export const ISO27001_CLAUSES = [
    // Clause 4: Context of the Organization
    {
        id: '4',
        name: 'Contexto de la Organización',
        subclauses: [
            {
                id: '4.1',
                name: 'Comprensión de la organización y su contexto',
                description: 'Determinar las cuestiones externas e internas que son pertinentes para su propósito.',
                requirements: [
                    'Identificar cuestiones externas (legales, tecnológicas, competitivas, de mercado, culturales, sociales, económicas)',
                    'Identificar cuestiones internas (valores, cultura, conocimiento, desempeño)',
                    'Monitorear y revisar la información sobre estas cuestiones'
                ]
            },
            {
                id: '4.2',
                name: 'Comprensión de las necesidades y expectativas de las partes interesadas',
                description: 'Determinar las partes interesadas pertinentes y sus requisitos.',
                requirements: [
                    'Identificar las partes interesadas pertinentes',
                    'Determinar requisitos de las partes interesadas',
                    'Determinar cuáles de estos requisitos se abordarán a través del SGSI'
                ]
            },
            {
                id: '4.3',
                name: 'Determinación del alcance del SGSI',
                description: 'Determinar los límites y aplicabilidad del SGSI.',
                requirements: [
                    'Considerar cuestiones externas e internas (4.1)',
                    'Considerar requisitos de partes interesadas (4.2)',
                    'Considerar interfaces y dependencias',
                    'Documentar el alcance'
                ]
            },
            {
                id: '4.4',
                name: 'Sistema de gestión de seguridad de la información',
                description: 'Establecer, implementar, mantener y mejorar continuamente el SGSI.',
                requirements: [
                    'Establecer el SGSI conforme a los requisitos de la norma',
                    'Implementar el SGSI',
                    'Mantener el SGSI',
                    'Mejorar continuamente el SGSI'
                ]
            }
        ]
    },

    // Clause 5: Leadership
    {
        id: '5',
        name: 'Liderazgo',
        subclauses: [
            {
                id: '5.1',
                name: 'Liderazgo y compromiso',
                description: 'La alta dirección debe demostrar liderazgo y compromiso con el SGSI.',
                requirements: [
                    'Asegurar que se establezcan la política y objetivos de seguridad',
                    'Asegurar la integración de requisitos del SGSI en procesos de negocio',
                    'Asegurar que los recursos necesarios estén disponibles',
                    'Comunicar la importancia de la gestión eficaz',
                    'Asegurar que el SGSI logre los resultados previstos',
                    'Dirigir y apoyar a las personas para contribuir a la eficacia',
                    'Promover la mejora continua',
                    'Apoyar otros roles de gestión pertinentes'
                ]
            },
            {
                id: '5.2',
                name: 'Política',
                description: 'Establecer una política de seguridad de la información.',
                requirements: [
                    'Ser apropiada al propósito de la organización',
                    'Incluir objetivos de seguridad o marco para establecerlos',
                    'Incluir compromiso de cumplir requisitos aplicables',
                    'Incluir compromiso de mejora continua',
                    'Estar disponible como información documentada',
                    'Comunicarse dentro de la organización',
                    'Estar disponible para partes interesadas según corresponda'
                ]
            },
            {
                id: '5.3',
                name: 'Roles, responsabilidades y autoridades',
                description: 'Asignar y comunicar las responsabilidades y autoridades para roles pertinentes.',
                requirements: [
                    'Asegurar que el SGSI sea conforme a requisitos de la norma',
                    'Informar sobre el desempeño del SGSI a la alta dirección'
                ]
            }
        ]
    },

    // Clause 6: Planning
    {
        id: '6',
        name: 'Planificación',
        subclauses: [
            {
                id: '6.1',
                name: 'Acciones para abordar riesgos y oportunidades',
                description: 'Determinar riesgos y oportunidades que es necesario abordar.',
                requirements: [
                    'Considerar cuestiones de contexto (4.1) y requisitos (4.2)',
                    'Asegurar que el SGSI pueda lograr resultados previstos',
                    'Prevenir o reducir efectos no deseados',
                    'Lograr la mejora continua'
                ]
            },
            {
                id: '6.1.2',
                name: 'Apreciación de riesgos de seguridad de la información',
                description: 'Definir y aplicar un proceso de apreciación de riesgos.',
                requirements: [
                    'Establecer criterios de aceptación de riesgos',
                    'Establecer criterios para realizar apreciaciones de riesgos',
                    'Asegurar que las apreciaciones produzcan resultados consistentes',
                    'Identificar los riesgos de seguridad',
                    'Analizar los riesgos',
                    'Evaluar los riesgos',
                    'Conservar información documentada'
                ]
            },
            {
                id: '6.1.3',
                name: 'Tratamiento de riesgos de seguridad de la información',
                description: 'Definir y aplicar un proceso de tratamiento de riesgos.',
                requirements: [
                    'Seleccionar opciones apropiadas de tratamiento de riesgos',
                    'Determinar controles necesarios para implementar las opciones',
                    'Comparar controles con Anexo A',
                    'Producir una Declaración de Aplicabilidad (SoA)',
                    'Formular un plan de tratamiento de riesgos',
                    'Obtener aprobación del propietario del riesgo'
                ]
            },
            {
                id: '6.2',
                name: 'Objetivos de seguridad y planificación para lograrlos',
                description: 'Establecer objetivos de seguridad de la información.',
                requirements: [
                    'Ser coherentes con la política de seguridad',
                    'Ser medibles (si es practicable)',
                    'Tomar en cuenta requisitos aplicables y resultados de apreciación',
                    'Ser comunicados',
                    'Ser actualizados según sea necesario',
                    'Estar documentados',
                    'Determinar qué se va a hacer, recursos, responsables, plazos y evaluación'
                ]
            },
            {
                id: '6.3',
                name: 'Planificación de cambios',
                description: 'Los cambios al SGSI se deben realizar de manera planificada.',
                requirements: [
                    'Considerar el propósito de los cambios y sus consecuencias potenciales',
                    'Integridad del SGSI',
                    'Disponibilidad de recursos',
                    'Asignación o reasignación de responsabilidades'
                ]
            }
        ]
    },

    // Clause 7: Support
    {
        id: '7',
        name: 'Apoyo',
        subclauses: [
            {
                id: '7.1',
                name: 'Recursos',
                description: 'Determinar y proporcionar los recursos necesarios.',
                requirements: [
                    'Establecimiento del SGSI',
                    'Implementación del SGSI',
                    'Mantenimiento del SGSI',
                    'Mejora continua del SGSI'
                ]
            },
            {
                id: '7.2',
                name: 'Competencia',
                description: 'Determinar la competencia necesaria del personal.',
                requirements: [
                    'Determinar competencia necesaria',
                    'Asegurar que las personas sean competentes',
                    'Tomar acciones para adquirir competencia necesaria',
                    'Conservar información documentada de la competencia'
                ]
            },
            {
                id: '7.3',
                name: 'Toma de conciencia',
                description: 'Las personas deben tomar conciencia de la política, su contribución y las implicaciones del incumplimiento.',
                requirements: [
                    'Política de seguridad de la información',
                    'Contribución a la eficacia del SGSI',
                    'Beneficios de la mejora del desempeño',
                    'Implicaciones del incumplimiento de requisitos del SGSI'
                ]
            },
            {
                id: '7.4',
                name: 'Comunicación',
                description: 'Determinar las comunicaciones internas y externas pertinentes.',
                requirements: [
                    'Qué comunicar',
                    'Cuándo comunicar',
                    'A quién comunicar',
                    'Cómo comunicar'
                ]
            },
            {
                id: '7.5',
                name: 'Información documentada',
                description: 'El SGSI debe incluir la información documentada requerida.',
                requirements: [
                    'Información documentada requerida por la norma',
                    'Información documentada que la organización determine necesaria',
                    'Creación y actualización apropiada',
                    'Control de la información documentada'
                ]
            }
        ]
    },

    // Clause 8: Operation
    {
        id: '8',
        name: 'Operación',
        subclauses: [
            {
                id: '8.1',
                name: 'Planificación y control operacional',
                description: 'Planificar, implementar y controlar los procesos necesarios.',
                requirements: [
                    'Establecer criterios para los procesos',
                    'Implementar control de los procesos de acuerdo con los criterios',
                    'Mantener información documentada',
                    'Controlar los cambios planificados',
                    'Revisar consecuencias de cambios no previstos',
                    'Asegurar que procesos externalizados estén controlados'
                ]
            },
            {
                id: '8.2',
                name: 'Apreciación de riesgos de seguridad de la información',
                description: 'Realizar apreciaciones de riesgos a intervalos planificados.',
                requirements: [
                    'Realizar apreciaciones según criterios establecidos en 6.1.2',
                    'Conservar información documentada de los resultados'
                ]
            },
            {
                id: '8.3',
                name: 'Tratamiento de riesgos de seguridad de la información',
                description: 'Implementar el plan de tratamiento de riesgos.',
                requirements: [
                    'Implementar el plan de tratamiento de riesgos',
                    'Conservar información documentada de los resultados'
                ]
            }
        ]
    },

    // Clause 9: Performance Evaluation
    {
        id: '9',
        name: 'Evaluación del Desempeño',
        subclauses: [
            {
                id: '9.1',
                name: 'Seguimiento, medición, análisis y evaluación',
                description: 'Determinar qué necesita seguimiento y medición.',
                requirements: [
                    'Determinar qué necesita seguimiento y medición',
                    'Determinar métodos de seguimiento, medición, análisis y evaluación',
                    'Determinar cuándo se deben realizar',
                    'Determinar quién debe realizar el seguimiento y la medición',
                    'Determinar cuándo se deben analizar y evaluar los resultados',
                    'Determinar quién debe analizar y evaluar los resultados',
                    'Conservar información documentada'
                ]
            },
            {
                id: '9.2',
                name: 'Auditoría interna',
                description: 'Realizar auditorías internas a intervalos planificados.',
                requirements: [
                    'Conformidad con requisitos propios de la organización',
                    'Conformidad con requisitos de la norma',
                    'Que se implemente y mantenga eficazmente',
                    'Planificar programa de auditorías',
                    'Definir criterios y alcance de cada auditoría',
                    'Seleccionar auditores que aseguren objetividad e imparcialidad',
                    'Asegurar que los resultados se informen a la dirección',
                    'Conservar información documentada'
                ]
            },
            {
                id: '9.3',
                name: 'Revisión por la dirección',
                description: 'La alta dirección debe revisar el SGSI a intervalos planificados.',
                requirements: [
                    'Estado de acciones de revisiones anteriores',
                    'Cambios en cuestiones externas e internas',
                    'Cambios en necesidades y expectativas de partes interesadas',
                    'Retroalimentación sobre el desempeño de seguridad',
                    'Retroalimentación de partes interesadas',
                    'Resultados de la apreciación de riesgos',
                    'Estado del plan de tratamiento de riesgos',
                    'Oportunidades de mejora continua'
                ]
            }
        ]
    },

    // Clause 10: Improvement
    {
        id: '10',
        name: 'Mejora',
        subclauses: [
            {
                id: '10.1',
                name: 'Mejora continua',
                description: 'Mejorar continuamente la idoneidad, adecuación y eficacia del SGSI.',
                requirements: [
                    'Mejorar continuamente el SGSI'
                ]
            },
            {
                id: '10.2',
                name: 'No conformidad y acción correctiva',
                description: 'Cuando ocurra una no conformidad, reaccionar ante ella.',
                requirements: [
                    'Tomar acciones para controlarla y corregirla',
                    'Hacer frente a las consecuencias',
                    'Evaluar la necesidad de acciones para eliminar las causas',
                    'Implementar cualquier acción necesaria',
                    'Revisar la eficacia de las acciones correctivas tomadas',
                    'Hacer cambios al SGSI si fuera necesario',
                    'Conservar información documentada'
                ]
            }
        ]
    }
];

// Compliance status options
export const COMPLIANCE_STATUS = [
    { id: 'compliant', label: 'Conforme', color: '#22c55e' },
    { id: 'partial', label: 'Parcialmente Conforme', color: '#eab308' },
    { id: 'non-compliant', label: 'No Conforme', color: '#ef4444' },
    { id: 'not-applicable', label: 'No Aplica', color: '#64748b' },
    { id: 'not-evaluated', label: 'Sin Evaluar', color: '#94a3b8' }
];
