import { useState, useRef } from 'react';
import {
    Upload, X, File, FileText, Image, FileSpreadsheet,
    FileVideo, FileAudio, Download, Trash2, Eye
} from 'lucide-react';
import './FileUpload.css';

// Supported file types
const FILE_TYPES = {
    // Documents
    'application/pdf': { icon: FileText, label: 'PDF', color: '#ef4444' },
    'application/msword': { icon: FileText, label: 'DOC', color: '#2563eb' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, label: 'DOCX', color: '#2563eb' },
    'text/plain': { icon: FileText, label: 'TXT', color: '#64748b' },
    'application/rtf': { icon: FileText, label: 'RTF', color: '#64748b' },

    // Spreadsheets
    'application/vnd.ms-excel': { icon: FileSpreadsheet, label: 'XLS', color: '#22c55e' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileSpreadsheet, label: 'XLSX', color: '#22c55e' },
    'text/csv': { icon: FileSpreadsheet, label: 'CSV', color: '#22c55e' },

    // Presentations
    'application/vnd.ms-powerpoint': { icon: File, label: 'PPT', color: '#f97316' },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { icon: File, label: 'PPTX', color: '#f97316' },

    // Images
    'image/jpeg': { icon: Image, label: 'JPG', color: '#8b5cf6' },
    'image/png': { icon: Image, label: 'PNG', color: '#8b5cf6' },
    'image/gif': { icon: Image, label: 'GIF', color: '#8b5cf6' },
    'image/webp': { icon: Image, label: 'WEBP', color: '#8b5cf6' },
    'image/svg+xml': { icon: Image, label: 'SVG', color: '#8b5cf6' },

    // Other
    'application/zip': { icon: File, label: 'ZIP', color: '#eab308' },
    'application/x-rar-compressed': { icon: File, label: 'RAR', color: '#eab308' },
    'video/mp4': { icon: FileVideo, label: 'MP4', color: '#ec4899' },
    'audio/mpeg': { icon: FileAudio, label: 'MP3', color: '#14b8a6' }
};

const ACCEPT_TYPES = Object.keys(FILE_TYPES).join(',') + ',.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.rtf';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const FileUpload = ({ files = [], onChange, maxFiles = 10 }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const fileInputRef = useRef(null);

    const getFileInfo = (mimeType) => {
        return FILE_TYPES[mimeType] || { icon: File, label: 'FILE', color: '#64748b' };
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleFiles = (newFiles) => {
        const validFiles = [];

        for (const file of newFiles) {
            if (file.size > MAX_FILE_SIZE) {
                alert(`El archivo "${file.name}" excede el límite de 5MB`);
                continue;
            }

            if (files.length + validFiles.length >= maxFiles) {
                alert(`Máximo ${maxFiles} archivos permitidos`);
                break;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const newFile = {
                    id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: e.target.result,
                    uploadedAt: new Date().toISOString()
                };
                onChange([...files, newFile]);
            };
            reader.readAsDataURL(file);
            validFiles.push(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleDelete = (fileId) => {
        onChange(files.filter(f => f.id !== fileId));
    };

    const handleDownload = (file) => {
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        link.click();
    };

    const handlePreview = (file) => {
        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
            setPreviewFile(file);
        } else {
            handleDownload(file);
        }
    };

    return (
        <div className="file-upload">
            {/* Upload Zone */}
            <div
                className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload size={32} />
                <p className="upload-text">
                    Arrastra archivos aquí o <span>haz clic para seleccionar</span>
                </p>
                <p className="upload-hint">
                    PDF, DOC, XLS, PPT, imágenes, CSV... (máx. 5MB)
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ACCEPT_TYPES}
                    onChange={(e) => handleFiles(e.target.files)}
                    style={{ display: 'none' }}
                />
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="file-list">
                    {files.map(file => {
                        const fileInfo = getFileInfo(file.type);
                        const FileIcon = fileInfo.icon;

                        return (
                            <div key={file.id} className="file-item">
                                <div className="file-icon" style={{ color: fileInfo.color }}>
                                    <FileIcon size={24} />
                                </div>
                                <div className="file-info">
                                    <span className="file-name">{file.name}</span>
                                    <span className="file-meta">
                                        {fileInfo.label} • {formatFileSize(file.size)}
                                    </span>
                                </div>
                                <div className="file-actions">
                                    <button
                                        className="btn btn-ghost btn-icon"
                                        onClick={() => handlePreview(file)}
                                        title="Ver"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-icon"
                                        onClick={() => handleDownload(file)}
                                        title="Descargar"
                                    >
                                        <Download size={16} />
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-icon"
                                        onClick={() => handleDelete(file.id)}
                                        title="Eliminar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Preview Modal */}
            {previewFile && (
                <div className="preview-modal" onClick={() => setPreviewFile(null)}>
                    <div className="preview-content" onClick={e => e.stopPropagation()}>
                        <div className="preview-header">
                            <span>{previewFile.name}</span>
                            <button className="btn btn-ghost btn-icon" onClick={() => setPreviewFile(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="preview-body">
                            {previewFile.type.startsWith('image/') ? (
                                <img src={previewFile.data} alt={previewFile.name} />
                            ) : previewFile.type === 'application/pdf' ? (
                                <iframe src={previewFile.data} title={previewFile.name} />
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
