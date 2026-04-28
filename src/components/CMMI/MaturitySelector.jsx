import { CMMI_LEVELS } from '../../data/iso27001-controls';
import './MaturitySelector.css';

const MaturitySelector = ({ value, onChange }) => {
    return (
        <div className="maturity-selector">
            {CMMI_LEVELS.map(level => (
                <button
                    key={level.level}
                    className={`maturity-btn ${value === level.level ? 'active' : ''}`}
                    onClick={() => onChange(level.level)}
                    title={level.description}
                    style={{
                        '--level-color': level.color
                    }}
                >
                    <span className="maturity-level">{level.level}</span>
                    <span className="maturity-name">{level.name}</span>
                </button>
            ))}
        </div>
    );
};

export default MaturitySelector;
