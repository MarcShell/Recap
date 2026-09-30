import { useContext } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { SavedContext } from '../../context/savedContext';
import './saveButton.scss';

const SaveButton = ({ item }) => {
	const { isSaved, toggleSaved } = useContext(SavedContext);
	const active = isSaved(item.key);

	return (
		<button
			className={`saveBtn ${active ? 'active' : ''}`}
			onClick={() => toggleSaved(item)}
			aria-label={active ? 'Aus Saved entfernen' : 'Zu Saved hinzufügen'}
		>
			{active ? <FaBookmark /> : <FaRegBookmark />}
		</button>
	);
};

export default SaveButton;
