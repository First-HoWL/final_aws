import './TagBadge.css';
 
export default function TagBadge({ tag, onClick, active }) {
    if (!tag) return null;

    return (
        <span
            className={`tag-badge ${active ? 'tag-badge--active' : ''} ${onClick ? 'tag-badge--clickable' : ''}`}
            onClick={onClick}
        >
            #{tag}
        </span>
    );
}