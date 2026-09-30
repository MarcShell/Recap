import './saved.scss';
import { useContext } from 'react';
import { SavedContext } from '../../context/savedContext';
import { VideoTile } from '../videoGrid/VideoGrid';
import SaveButton from '../saveButton/SaveButton';

const Saved = () => {
	const { saved } = useContext(SavedContext); // SavedContext hält die Liste saved im State und synchronisiert mit localStorage

	if (saved.length === 0) return <p>Noch nichts gespeichert.</p>; // Nachricht falls leer

	return (
		// Für jedes Element in saved wird HTML gerendert
		// Überprüfung ob video oder image, sie haben unterschiedliche Eigenschaften
		<div className="savedGrid">
			{saved.map((item) =>
				item.type === 'video' ? (
					<VideoTile key={item.key} item={item} />
				) : (
					<div className="item" key={item.key}>
						<img
							src={item.src}
							alt={item.alt}
							width={item.width}
							height={item.height}
							loading="lazy"
						/>
						<SaveButton item={item} />
					</div>
				),
			)}
		</div>
	);
};

export default Saved;
