import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, X, FileText, AlertTriangle, Shield, CheckSquare,
    ClipboardList, Layers, ArrowRight
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { ISO27001_CONTROLS } from '../../data/iso27001-controls';
import { ISO27001_CLAUSES } from '../../data/iso27001-clauses';
import './GlobalSearch.css';

const SEARCH_CATEGORIES = {
    controls: { label: 'Controles', icon: Shield, color: '#3b82f6', path: '/controls' },
    findings: { label: 'Hallazgos', icon: AlertTriangle, color: '#f97316', path: '/findings' },
    risks: { label: 'Riesgos', icon: Shield, color: '#ef4444', path: '/risks' },
    actionPlans: { label: 'Planes de Acción', icon: CheckSquare, color: '#22c55e', path: '/action-plans' },
    requirements: { label: 'Requisitos', icon: ClipboardList, color: '#8b5cf6', path: '/requirements' }
};

const GlobalSearch = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({});
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { findings, risks, actionPlans } = useAudit();

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setQuery('');
            setResults({});
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (!isOpen) {
                    // Parent will handle opening
                }
            }
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Search function
    useEffect(() => {
        if (!query.trim()) {
            setResults({});
            return;
        }

        const searchTerm = query.toLowerCase();
        const newResults = {};

        // Search in Controls
        const controlResults = ISO27001_CONTROLS
            .filter(ctrl =>
                ctrl.id.toLowerCase().includes(searchTerm) ||
                ctrl.title.toLowerCase().includes(searchTerm) ||
                ctrl.description.toLowerCase().includes(searchTerm)
            )
            .slice(0, 5)
            .map(ctrl => ({
                id: ctrl.id,
                title: ctrl.title,
                subtitle: ctrl.description.substring(0, 80) + '...',
                type: 'controls'
            }));
        if (controlResults.length) newResults.controls = controlResults;

        // Search in Findings
        const findingResults = findings
            .filter(f =>
                f.title.toLowerCase().includes(searchTerm) ||
                f.description.toLowerCase().includes(searchTerm) ||
                f.controlId?.toLowerCase().includes(searchTerm)
            )
            .slice(0, 5)
            .map(f => ({
                id: f.id,
                title: f.title,
                subtitle: `Control: ${f.controlId} • ${f.status}`,
                type: 'findings'
            }));
        if (findingResults.length) newResults.findings = findingResults;

        // Search in Risks
        const riskResults = risks
            .filter(r =>
                r.title.toLowerCase().includes(searchTerm) ||
                r.description.toLowerCase().includes(searchTerm)
            )
            .slice(0, 5)
            .map(r => ({
                id: r.id,
                title: r.title,
                subtitle: `Nivel: ${r.level} • ${r.status}`,
                type: 'risks'
            }));
        if (riskResults.length) newResults.risks = riskResults;

        // Search in Action Plans
        const actionResults = actionPlans
            .filter(a =>
                a.title.toLowerCase().includes(searchTerm) ||
                a.description.toLowerCase().includes(searchTerm) ||
                a.responsible?.toLowerCase().includes(searchTerm)
            )
            .slice(0, 5)
            .map(a => ({
                id: a.id,
                title: a.title,
                subtitle: `Responsable: ${a.responsible} • ${a.status}`,
                type: 'actionPlans'
            }));
        if (actionResults.length) newResults.actionPlans = actionResults;

        // Search in Requirements (Clauses)
        const reqResults = [];
        ISO27001_CLAUSES.forEach(clause => {
            if (clause.title.toLowerCase().includes(searchTerm)) {
                reqResults.push({
                    id: clause.id,
                    title: `${clause.id} - ${clause.title}`,
                    subtitle: 'Cláusula principal',
                    type: 'requirements'
                });
            }
            clause.subclauses?.forEach(sub => {
                if (sub.title.toLowerCase().includes(searchTerm) ||
                    sub.id.toLowerCase().includes(searchTerm)) {
                    reqResults.push({
                        id: sub.id,
                        title: `${sub.id} - ${sub.title}`,
                        subtitle: `Parte de ${clause.title}`,
                        type: 'requirements'
                    });
                }
            });
        });
        if (reqResults.slice(0, 5).length) newResults.requirements = reqResults.slice(0, 5);

        setResults(newResults);
        setSelectedIndex(0);
    }, [query, findings, risks, actionPlans]);

    // Get flattened results for keyboard navigation
    const flatResults = Object.entries(results).flatMap(([type, items]) =>
        items.map(item => ({ ...item, type }))
    );

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, flatResults.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
            handleSelect(flatResults[selectedIndex]);
        }
    };

    const handleSelect = (item) => {
        const category = SEARCH_CATEGORIES[item.type];
        if (category) {
            navigate(category.path);
            onClose();
        }
    };

    if (!isOpen) return null;

    const totalResults = Object.values(results).reduce((acc, arr) => acc + arr.length, 0);

    return (
        <div className="global-search-overlay" onClick={onClose}>
            <div className="global-search-modal" onClick={e => e.stopPropagation()}>
                <div className="search-header">
                    <Search size={20} className="search-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar controles, hallazgos, riesgos..."
                        className="search-input"
                    />
                    <div className="search-shortcut">
                        <kbd>ESC</kbd>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                {query && (
                    <div className="search-results">
                        {totalResults === 0 ? (
                            <div className="no-results">
                                <Layers size={48} />
                                <p>No se encontraron resultados para "{query}"</p>
                            </div>
                        ) : (
                            Object.entries(results).map(([type, items]) => {
                                const category = SEARCH_CATEGORIES[type];
                                const CategoryIcon = category.icon;

                                return (
                                    <div key={type} className="result-group">
                                        <div className="result-group-header">
                                            <CategoryIcon size={16} style={{ color: category.color }} />
                                            <span>{category.label}</span>
                                            <span className="result-count">{items.length}</span>
                                        </div>
                                        <div className="result-items">
                                            {items.map((item, idx) => {
                                                const globalIdx = flatResults.findIndex(
                                                    r => r.id === item.id && r.type === type
                                                );
                                                const isSelected = globalIdx === selectedIndex;

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`result-item ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => handleSelect(item)}
                                                    >
                                                        <div className="result-content">
                                                            <span className="result-title">{item.title}</span>
                                                            <span className="result-subtitle">{item.subtitle}</span>
                                                        </div>
                                                        <ArrowRight size={16} className="result-arrow" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {!query && (
                    <div className="search-hints">
                        <p className="hints-title">Búsqueda rápida</p>
                        <div className="hints-grid">
                            {Object.entries(SEARCH_CATEGORIES).map(([key, cat]) => {
                                const Icon = cat.icon;
                                return (
                                    <div
                                        key={key}
                                        className="hint-item"
                                        onClick={() => navigate(cat.path)}
                                    >
                                        <Icon size={18} style={{ color: cat.color }} />
                                        <span>{cat.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="search-footer">
                    <span><kbd>↑</kbd> <kbd>↓</kbd> navegar</span>
                    <span><kbd>↵</kbd> seleccionar</span>
                    <span><kbd>ESC</kbd> cerrar</span>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
