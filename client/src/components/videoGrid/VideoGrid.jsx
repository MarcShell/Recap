import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import './videogrid.scss';
import SaveButton from '../saveButton/SaveButton';

// API-KEY aus .env ladden
const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const PER_PAGE = 80; // Pexels erlaubt max. 80 pro Anfrage

// Nimmt eine SD-mp4 (leichter zu laden), sonst die erste verfügbare Datei
const pickVideoFile = (video) =>
	video.video_files.find(
		(file) => file.quality === 'sd' && file.file_type === 'video/mp4',
	) || video.video_files[0];

// Rendert Video mit Play/Pause-Button
export const VideoTile = ({ item }) => {
	const videoRef = useRef(null); // Zeigt auf das Video DOM-Element um play() und pause() nutzen zu können
	const [playing, setPlaying] = useState(false); // Status ob Video gerade abgespielt wird

	// Prüft den nativen paused-Zustand des Videos und spielt ab oder pausiert
	const toggle = () => {
		const el = videoRef.current;
		if (el.paused) {
			el.play().catch(() => {});
		} else {
			el.pause();
		}
	};

	return (
		<div className="item">
			<video
				ref={videoRef}
				src={item.src}
				poster={item.poster}
				style={
					item.width
						? { aspectRatio: `${item.width} / ${item.height}` }
						: undefined
				}
				loop
				playsInline
				preload="none"
				onClick={toggle}
				onPlay={() => setPlaying(true)}
				onPause={() => setPlaying(false)}
			/>
			<button
				className={`playBtn ${playing ? 'playing' : ''}`}
				onClick={toggle}
				aria-label={playing ? 'Pause' : 'Play'}
			>
				{playing ? <FaPause /> : <FaPlay />}
			</button>
			<SaveButton item={item} />
		</div>
	);
};

// Lädt eine Seite mit 80 VIdeos von Pexels
const VideoGrid = () => {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const controller = new AbortController(); // Bricht fetch-Requests ab wenn Seite verlassen wird

		async function loadVideos() {
			try {
				if (!API_KEY)
					throw new Error('VITE_PEXELS_API_KEY fehlt in der .env-Datei');

				const res = await fetch(
					`https://api.pexels.com/videos/popular?per_page=${PER_PAGE}&page=1`,
					{
						headers: { Authorization: API_KEY },
						signal: controller.signal,
					},
				);
				if (!res.ok) throw new Error(`Pexels-Fehler: ${res.status}`);

				const data = await res.json();
				setVideos(data.videos);
			} catch (err) {
				if (err.name !== 'AbortError') setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		loadVideos();
		return () => controller.abort();
	}, []);

	if (loading) return <p>Videos werden geladen …</p>;
	if (error) return <p>Fehler beim Laden: {error}</p>;

	return (
		// Für jedes Video wird eine VideoTile mit den richtigen Werten (Quelle, Maße...) gerendert
		<div className="videoGrid">
			{videos.map((video) => (
				<VideoTile
					key={video.id}
					item={{
						key: `video-${video.id}`,
						type: 'video',
						src: pickVideoFile(video).link,
						poster: video.image,
						width: video.width,
						height: video.height,
					}}
				/>
			))}
		</div>
	);
};

export default VideoGrid;
