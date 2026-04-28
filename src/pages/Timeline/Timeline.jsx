import { useState } from 'react';
import {
    Activity, CheckCircle, AlertTriangle, FileText, Shield,
    Calendar, Filter, ChevronDown
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './Timeline.css';

const ACTIVITY_TYPES = [
    { id: 'all', label: 'Todos', icon: Activity },
    { id: 'control', label: 'Controles', icon: Shield },
    { id: 'finding', label: 'Hallazgos', icon: AlertTriangle },
    { id: 'risk', label: 'Riesgos', icon: AlertTriangle },
    { id: 'action', label: 'Acciones', icon: CheckCircle },
    { id: 'audit', label: 'Auditoría', icon: FileText }
];

const Timeline = () => {
    const { activityLog } = useAudit();
    const [filter, setFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const filteredActivities = filter === 'all'
        ? activityLog
        : activityLog.filter(a => a.type === filter);

    // Group activities by date
    const groupedActivities = filteredActivities.reduce((groups, activity) => {
        const date = format(new Date(activity.timestamp), 'yyyy-MM-dd');
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(activity);
        return groups;
    }, {});

    const getActivityIcon = (type) => {
        switch (type) {
            case 'control': return <Shield size={16} />;
            case 'finding': return <AlertTriangle size={16} />;
            case 'risk': return <AlertTriangle size={16} />;
            case 'action': return <CheckCircle size={16} />;
            case 'audit': return <FileText size={16} />;
            default: return <Activity size={16} />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'control': return '#3b82f6';
            case 'finding': return '#f97316';
            case 'risk': return '#ef4444';
            case 'action': return '#22c55e';
            case 'audit': return '#8b5cf6';
            default: return '#94a3b8';
        }
    };

    return (
        <div className="timeline-page">
            {/* Header */}
            <div className="page-header card">
                <div className="header-left">
                    <Activity size={24} />
                    <div>
                        <h2>Historial de Actividades</h2>
                        <p>{activityLog.length} actividades registradas</p>
                    </div>
                </div>

                <div className="header-right">
                    <div className="filter-dropdown">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={18} />
                            Filtrar
                            <ChevronDown size={16} />
                        </button>

                        {showFilters && (
                            <div className="filter-menu">
                                {ACTIVITY_TYPES.map(type => (
                                    <button
                                        key={type.id}
                                        className={`filter-item ${filter === type.id ? 'active' : ''}`}
                                        onClick={() => {
                                            setFilter(type.id);
                                            setShowFilters(false);
                                        }}
                                    >
                                        <type.icon size={16} />
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="timeline-container card">
                {Object.keys(groupedActivities).length > 0 ? (
                    <div className="timeline">
                        {Object.entries(groupedActivities).map(([date, activities]) => (
                            <div key={date} className="timeline-group">
                                <div className="timeline-date">
                                    <Calendar size={14} />
                                    {format(new Date(date), "EEEE, d 'de' MMMM yyyy", { locale: es })}
                                </div>

                                <div className="timeline-items">
                                    {activities.map(activity => (
                                        <div key={activity.id} className="timeline-item">
                                            <div
                                                className="timeline-icon"
                                                style={{ background: getActivityColor(activity.type) + '20', color: getActivityColor(activity.type) }}
                                            >
                                                {getActivityIcon(activity.type)}
                                            </div>

                                            <div className="timeline-content">
                                                <p className="timeline-description">{activity.description}</p>
                                                <div className="timeline-meta">
                                                    <span className="timeline-time">
                                                        {format(new Date(activity.timestamp), 'HH:mm')}
                                                    </span>
                                                    <span className="timeline-relative">
                                                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: es })}
                                                    </span>
                                                    {activity.relatedId && (
                                                        <span className="timeline-related">{activity.relatedId}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Activity size={48} />
                        <h3>Sin actividades registradas</h3>
                        <p>Las actividades aparecerán aquí a medida que uses la aplicación</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timeline;
