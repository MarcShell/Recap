import { useEffect, useState } from 'react';
import './imageGrid.scss';
import SaveButton from '../saveButton/SaveButton';

// API-Key aus .env holen
const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

const TOTAL_IMAGES = 500;
const PER_PAGE = 80; // Pexels erlaubt max. 80 pro Anfrage
const PAGES = Math.ceil(TOTAL_IMAGES / PER_PAGE); // 7 Seiten

const ImageGrid = () => {
	const [photos, setPhotos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Bricht laufende fetch-Requests ab, wenn Seite verlassen wird
		const controller = new AbortController();

		// Baut ein Array aus 7 fetch-Aurfrufen
		async function loadPhotos() {
			try {
				if (!API_KEY)
					throw new Error('VITE_PEXELS_API_KEY fehlt in der .env-Datei');

				// 7 Seiten je 80 Bilder parallel laden
				const requests = Array.from({ length: PAGES }, (_, i) =>
					fetch(
						`https://api.pexels.com/v1/curated?per_page=${PER_PAGE}&page=${i + 1}`,
						{
							headers: { Authorization: API_KEY },
							signal: controller.signal,
						},
					).then((res) => {
						if (!res.ok) throw new Error(`Pexels-Fehler: ${res.status}`);
						return res.json();
					}),
				);

				// Parallel mit Promise.all abschicken statt nacheinander
				const pages = await Promise.all(requests);
				// 7 x 80 = 560 -> auf genau 500 reduzieren
				setPhotos(pages.flatMap((page) => page.photos).slice(0, TOTAL_IMAGES));
			} catch (err) {
				if (err.name !== 'AbortError') setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		loadPhotos();
		return () => controller.abort();
	}, []);

	if (loading) return <p>Bilder werden geladen …</p>;
	if (error) return <p>Fehler beim Laden: {error}</p>;

	return (
		<div className="imageGrid">
			{photos.map((photo) => (
				<div className="item" key={photo.id}>
					<a href={photo.url} target="_blank" rel="noreferrer">
						<img
							src={photo.src.large}
							alt={photo.alt || `Foto von ${photo.photographer}`}
							title={`Foto von ${photo.photographer}`}
							width={photo.width}
							height={photo.height}
							loading="lazy"
						/>
					</a>
					<SaveButton
						item={{
							key: `image-${photo.id}`,
							type: 'image',
							src: photo.src.large,
							alt: photo.alt || `Foto von ${photo.photographer}`,
							width: photo.width,
							height: photo.height,
						}}
					/>
				</div>
			))}
		</div>
	);
};

export default ImageGrid;
