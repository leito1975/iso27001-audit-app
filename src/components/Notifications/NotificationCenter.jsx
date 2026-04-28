import { useState } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Trash2 } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './NotificationCenter.css';

const NotificationCenter = () => {
    const { notifications, markNotificationRead, clearNotifications } = useAudit();
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={16} />;
            case 'warning': return <AlertTriangle size={16} />;
            case 'error': return <AlertTriangle size={16} />;
            default: return <Info size={16} />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'success': return '#22c55e';
            case 'warning': return '#f97316';
            case 'error': return '#ef4444';
            default: return '#3b82f6';
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markNotificationRead(notification.id);
        }
    };

    return (
        <div className="notification-center">
            <button
                className={`notification-bell ${unreadCount > 0 ? 'has-unread' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="notification-backdrop" onClick={() => setIsOpen(false)} />
                    <div className="notification-dropdown">
                        <div className="notification-header">
                            <h3>Notificaciones</h3>
                            {notifications.length > 0 && (
                                <button className="btn btn-ghost btn-sm" onClick={clearNotifications}>
                                    <Trash2 size={14} />
                                    Limpiar
                                </button>
                            )}
                        </div>

                        <div className="notification-list">
                            {notifications.length > 0 ? (
                                notifications.slice(0, 10).map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`notification-item ${notification.read ? 'read' : ''}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div
                                            className="notification-icon"
                                            style={{
                                                background: getNotificationColor(notification.type) + '20',
                                                color: getNotificationColor(notification.type)
                                            }}
                                        >
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="notification-content">
                                            <p className="notification-message">{notification.message}</p>
                                            <span className="notification-time">
                                                {formatDistanceToNow(new Date(notification.createdAt), {
                                                    addSuffix: true,
                                                    locale: es
                                                })}
                                            </span>
                                        </div>
                                        {!notification.read && <div className="unread-dot" />}
                                    </div>
                                ))
                            ) : (
                                <div className="notification-empty">
                                    <Bell size={32} />
                                    <p>Sin notificaciones</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationCenter;
