import { useState } from 'react';
import { Tag, X, Plus, Check } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import './TagSelector.css';

const TagSelector = ({ selectedTags = [], onChange, showCreate = true }) => {
    const { tags, addTag } = useAudit();
    const [isOpen, setIsOpen] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#3b82f6');

    const PRESET_COLORS = [
        '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'
    ];

    const handleToggleTag = (tagId) => {
        const newSelection = selectedTags.includes(tagId)
            ? selectedTags.filter(t => t !== tagId)
            : [...selectedTags, tagId];
        onChange(newSelection);
    };

    const handleCreateTag = async () => {
        if (newTagName.trim()) {
            try {
                const newTagId = await addTag({ name: newTagName.trim(), color: newTagColor });
                setNewTagName('');
                handleToggleTag(newTagId);
            } catch (err) {
                console.error('Error creando etiqueta:', err);
            }
        }
    };

    const selectedTagObjects = tags.filter(t => selectedTags.includes(t.id));

    return (
        <div className="tag-selector">
            <div className="selected-tags">
                {selectedTagObjects.map(tag => (
                    <span
                        key={tag.id}
                        className="tag-chip"
                        style={{ backgroundColor: tag.color + '20', color: tag.color }}
                    >
                        <Tag size={12} />
                        {tag.name}
                        <button
                            className="tag-remove"
                            onClick={() => handleToggleTag(tag.id)}
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <button
                    className="add-tag-btn"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Plus size={14} />
                    Etiqueta
                </button>
            </div>

            {isOpen && (
                <>
                    <div className="tag-backdrop" onClick={() => setIsOpen(false)} />
                    <div className="tag-dropdown">
                        <div className="tag-list">
                            {tags.map(tag => (
                                <button
                                    key={tag.id}
                                    className={`tag-option ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                                    onClick={() => handleToggleTag(tag.id)}
                                >
                                    <span
                                        className="tag-color-dot"
                                        style={{ backgroundColor: tag.color }}
                                    />
                                    <span className="tag-name">{tag.name}</span>
                                    {selectedTags.includes(tag.id) && <Check size={14} />}
                                </button>
                            ))}
                        </div>

                        {showCreate && (
                            <div className="create-tag">
                                <div className="create-tag-header">Nueva etiqueta</div>
                                <div className="create-tag-form">
                                    <input
                                        type="text"
                                        placeholder="Nombre..."
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        className="form-input"
                                    />
                                    <div className="color-picker">
                                        {PRESET_COLORS.map(color => (
                                            <button
                                                key={color}
                                                className={`color-option ${newTagColor === color ? 'active' : ''}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setNewTagColor(color)}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={handleCreateTag}
                                        disabled={!newTagName.trim()}
                                    >
                                        Crear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default TagSelector;
