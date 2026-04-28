// ISO 42001:2023 Requirements (Clauses 4-10)
// Management system requirements for AI Management Systems

export const ISO42001_CLAUSES = [
    // Clause 4: Context of the Organization
    {
        id: '4',
        name: 'Contexto de la Organización',
        subclauses: [
            {
                id: '4.1',
                name: 'Comprensión de la organización y su contexto',
                description: 'Determinar las cuestiones externas e internas pertinentes para sistemas de IA.',
                requirements: [
                    'Identificar cuestiones externas (regulatorias de IA, tecnológicas, de mercado)',
                    'Identificar cuestiones internas (valores, capacidades, conocimiento de IA)',
                    'Monitorear y revisar información sobre contexto de IA'
                ]
            },
            {
                id: '4.2',
                name: 'Comprensión de las necesidades y expectativas de las partes interesadas',
                description: 'Determinar las partes interesadas pertinentes y sus requisitos de IA.',
                requirements: [
                    'Identificar partes interesadas (usuarios, reguladores, datos)',
                    'Determinar requisitos de partes interesadas para IA',
                    'Determinar qué requisitos se abordarán a través del SGAI'
                ]
            },
            {
                id: '4.3',
                name: 'Determinación del alcance del SGAI',
                description: 'Determinar los límites y aplicabilidad del Sistema de Gestión de IA.',
                requirements: [
                    'Considerar cuestiones de contexto externo e interno',
                    'Considerar requisitos de partes interesadas',
                    'Considerar sistemas de IA a ser gobernados',
                    'Documentar el alcance'
                ]
            },
            {
                id: '4.4',
                name: 'Sistema de gestión de IA',
                description: 'Establecer, implementar, mantener y mejorar continuamente el SGAI.',
                requirements: [
                    'Establecer el SGAI conforme a requisitos de la norma',
                    'Implementar procesos de gestión de IA',
                    'Mantener el SGAI',
                    'Mejorar continuamente el SGAI'
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
                description: 'La alta dirección debe demostrar liderazgo y compromiso con el SGAI.',
                requirements: [
                    'Asegurar que se establezcan la política y objetivos de IA',
                    'Asegurar la integración de requisitos del SGAI en procesos de negocio',
                    'Asegurar que los recursos necesarios estén disponibles',
                    'Comunicar la importancia de la gestión responsable de IA',
                    'Asegurar que el SGAI logre resultados previstos',
                    'Dirigir y apoyar a las personas en gestión de IA',
                    'Promover la mejora continua en sistemas de IA',
                    'Apoyar roles de gestión pertinentes'
                ]
            },
            {
                id: '5.2',
                name: 'Política',
                description: 'Establecer una política de sistemas de IA de la organización.',
                requirements: [
                    'Ser apropiada al propósito y contexto de IA de la organización',
                    'Incluir objetivos de IA o marco para establecerlos',
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
                description: 'Asignar y comunicar responsabilidades para gestión de IA.',
                requirements: [
                    'Asegurar que el SGAI sea conforme a requisitos de la norma',
                    'Informar sobre el desempeño del SGAI a la alta dirección',
                    'Establecer responsabilidad clara para IA'
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
                description: 'Determinar riesgos y oportunidades para sistemas de IA.',
                requirements: [
                    'Considerar cuestiones de contexto y requisitos de partes interesadas',
                    'Asegurar que el SGAI pueda lograr resultados previstos',
                    'Prevenir o reducir efectos no deseados de sistemas de IA',
                    'Lograr la mejora continua'
                ]
            },
            {
                id: '6.1.2',
                name: 'Evaluación de riesgos de sistemas de IA',
                description: 'Definir y aplicar un proceso de evaluación de riesgos de IA.',
                requirements: [
                    'Establecer criterios de aceptación de riesgos de IA',
                    'Establecer criterios para evaluaciones de riesgos',
                    'Asegurar que evaluaciones produzcan resultados consistentes',
                    'Identificar riesgos de sistemas de IA',
                    'Analizar y evaluar riesgos',
                    'Conservar información documentada'
                ]
            },
            {
                id: '6.1.3',
                name: 'Tratamiento de riesgos de sistemas de IA',
                description: 'Definir y aplicar un proceso de tratamiento de riesgos de IA.',
                requirements: [
                    'Seleccionar opciones apropiadas de tratamiento',
                    'Determinar controles necesarios para implementar opciones',
                    'Comparar controles con Anexo A de la norma',
                    'Producir una Declaración de Aplicabilidad',
                    'Formular un plan de tratamiento de riesgos',
                    'Obtener aprobación del propietario del riesgo'
                ]
            },
            {
                id: '6.2',
                name: 'Objetivos de sistemas de IA y planificación',
                description: 'Establecer objetivos para sistemas de IA.',
                requirements: [
                    'Ser coherentes con la política de IA',
                    'Ser medibles (si es practicable)',
                    'Tomar en cuenta requisitos aplicables y evaluación de riesgos',
                    'Ser comunicados',
                    'Ser actualizados según sea necesario',
                    'Estar documentados',
                    'Determinar qué se va a hacer, recursos, responsables, plazos'
                ]
            },
            {
                id: '6.3',
                name: 'Planificación de cambios',
                description: 'Los cambios al SGAI se deben realizar de manera planificada.',
                requirements: [
                    'Considerar el propósito de los cambios y consecuencias',
                    'Integridad del SGAI',
                    'Disponibilidad de recursos',
                    'Asignación de responsabilidades'
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
                description: 'Determinar y proporcionar recursos necesarios para SGAI.',
                requirements: [
                    'Recursos para establecimiento del SGAI',
                    'Recursos para implementación del SGAI',
                    'Recursos para mantenimiento del SGAI',
                    'Recursos para mejora continua'
                ]
            },
            {
                id: '7.2',
                name: 'Competencia',
                description: 'Determinar la competencia necesaria del personal para IA.',
                requirements: [
                    'Determinar competencia necesaria en IA',
                    'Asegurar que las personas sean competentes en sistemas de IA',
                    'Tomar acciones para adquirir competencia en IA',
                    'Conservar información documentada de la competencia'
                ]
            },
            {
                id: '7.3',
                name: 'Toma de conciencia',
                description: 'Las personas deben ser conscientes de sistemas de IA y requisitos.',
                requirements: [
                    'Política de sistemas de IA',
                    'Contribución a efectividad del SGAI',
                    'Beneficios de gestión responsable de IA',
                    'Implicaciones del incumplimiento de requisitos'
                ]
            },
            {
                id: '7.4',
                name: 'Comunicación',
                description: 'Determinar comunicaciones internas y externas sobre IA.',
                requirements: [
                    'Qué comunicar sobre sistemas de IA',
                    'Cuándo comunicar',
                    'A quién comunicar',
                    'Cómo comunicar'
                ]
            },
            {
                id: '7.5',
                name: 'Información documentada',
                description: 'El SGAI debe incluir información documentada requerida.',
                requirements: [
                    'Información documentada requerida por la norma',
                    'Información documentada que determine la organización',
                    'Creación y actualización apropiada',
                    'Control de la información documentada'
                ]
            },
            {
                id: '7.6',
                name: 'Gestión del cambio',
                description: 'Gestionar cambios en sistemas de IA de manera controlada.',
                requirements: [
                    'Establecer proceso para gestión de cambios',
                    'Evaluar impactos de cambios',
                    'Asegurar que cambios no introducen riesgos no controlados',
                    'Documentar cambios en sistemas de IA'
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
                description: 'Planificar, implementar y controlar procesos de SGAI.',
                requirements: [
                    'Establecer criterios para procesos de IA',
                    'Implementar control de procesos de acuerdo con criterios',
                    'Mantener información documentada',
                    'Controlar los cambios planificados',
                    'Revisar consecuencias de cambios no previstos',
                    'Asegurar que procesos externalizados estén controlados'
                ]
            },
            {
                id: '8.2',
                name: 'Evaluación de riesgos de sistemas de IA',
                description: 'Realizar evaluaciones de riesgos a intervalos planificados.',
                requirements: [
                    'Realizar evaluaciones según criterios establecidos',
                    'Documentar resultados de evaluaciones',
                    'Realizar seguimiento de cambios en sistemas de IA'
                ]
            },
            {
                id: '8.3',
                name: 'Tratamiento de riesgos',
                description: 'Implementar el plan de tratamiento de riesgos.',
                requirements: [
                    'Implementar plan de tratamiento de riesgos',
                    'Monitorear eficacia de controles',
                    'Documentar resultados del tratamiento'
                ]
            },
            {
                id: '8.4',
                name: 'Monitoreo y evaluación de sistemas de IA',
                description: 'Monitorear el desempeño de sistemas de IA.',
                requirements: [
                    'Establecer métodos de monitoreo',
                    'Evaluar desempeño de sistemas de IA',
                    'Documentar resultados de monitoreo'
                ]
            },
            {
                id: '8.5',
                name: 'Cumplimiento normativo',
                description: 'Cumplir con requisitos legales y regulatorios de IA.',
                requirements: [
                    'Identificar requisitos legales y regulatorios',
                    'Asegurar cumplimiento de requisitos',
                    'Mantener información sobre cumplimiento'
                ]
            },
            {
                id: '8.6',
                name: 'Gestión de incidents de IA',
                description: 'Identificar y responder a incidentes de sistemas de IA.',
                requirements: [
                    'Establecer proceso de gestión de incidentes',
                    'Investigar incidentes de IA',
                    'Tomar acciones correctivas',
                    'Documentar incidentes'
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
                description: 'Determinar qué necesita seguimiento en sistemas de IA.',
                requirements: [
                    'Determinar qué necesita seguimiento y medición',
                    'Determinar métodos de seguimiento',
                    'Determinar cuándo se deben realizar',
                    'Determinar quién debe realizar el seguimiento',
                    'Analizar y evaluar resultados',
                    'Conservar información documentada'
                ]
            },
            {
                id: '9.2',
                name: 'Auditoría interna',
                description: 'Realizar auditorías internas del SGAI.',
                requirements: [
                    'Conformidad con requisitos propios de la organización',
                    'Conformidad con requisitos de la norma',
                    'Que se implemente y mantenga eficazmente',
                    'Planificar programa de auditorías',
                    'Definir criterios y alcance',
                    'Seleccionar auditores imparciales',
                    'Informar resultados a la dirección',
                    'Conservar información documentada'
                ]
            },
            {
                id: '9.3',
                name: 'Revisión por la dirección',
                description: 'La alta dirección debe revisar el SGAI periódicamente.',
                requirements: [
                    'Estado de acciones de revisiones anteriores',
                    'Cambios en contexto externo e interno',
                    'Cambios en necesidades de partes interesadas',
                    'Retroalimentación sobre desempeño de IA',
                    'Resultados de evaluación de riesgos',
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
                description: 'Mejorar continuamente la idoneidad del SGAI.',
                requirements: [
                    'Mejorar continuamente el SGAI',
                    'Evaluar eficacia de controles',
                    'Implementar mejoras identificadas'
                ]
            },
            {
                id: '10.2',
                name: 'No conformidad y acción correctiva',
                description: 'Cuando ocurra una no conformidad, reaccionar ante ella.',
                requirements: [
                    'Tomar acciones para controlar y corregir',
                    'Hacer frente a las consecuencias',
                    'Evaluar necesidad de acciones correctivas',
                    'Implementar acciones necesarias',
                    'Revisar eficacia de acciones correctivas',
                    'Hacer cambios al SGAI si fuera necesario',
                    'Conservar información documentada'
                ]
            }
        ]
    }
];

// Compliance status options (same as ISO 27001)
export const COMPLIANCE_STATUS = [
    { id: 'compliant', label: 'Conforme', color: '#22c55e' },
    { id: 'partial', label: 'Parcialmente Conforme', color: '#eab308' },
    { id: 'non-compliant', label: 'No Conforme', color: '#ef4444' },
    { id: 'not-applicable', label: 'No Aplica', color: '#64748b' },
    { id: 'not-evaluated', label: 'Sin Evaluar', color: '#94a3b8' }
];
