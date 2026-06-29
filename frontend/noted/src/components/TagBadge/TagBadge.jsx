import './TagBadge.css';
 
export default function TagBadge({ tag, onClick, active }) {
    return (
        <span
            className={`tag-badge ${active ? 'tag-badge--active' : ''} ${onClick ? 'tag-badge--clickable' : ''}`}
            onClick={onClick}
        >
            {tag}
        </span>
    );
}