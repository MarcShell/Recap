import { createContext, useEffect, useState } from 'react';

// Erstellt Context, kann von anderen Dateien aufgerufen werden
export const SavedContext = createContext();

const STORAGE_KEY = 'saved';

// Liest zu Beginn localStorage und parst das JSON, bei fehlerhaftem JSON leere Liste zurückgeben
const loadSaved = () => {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
	} catch {
		return [];
	}
};

export const SavedContextProvider = ({ children }) => {
	const [saved, setSaved] = useState(loadSaved);

	// Bei jeder Änderung in den localStorage schreiben
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
	}, [saved]);

	// Prüfen ob ein Item mit bestimmten key in der Liste ist
	const isSaved = (key) => saved.some((item) => item.key === key);

	// Wenn das item drin ist, wird es rausgefiltert, ist es nicht drrin, wird es angehängt
	// Nutzen: Button zum Speichern und Entfernen des Beitrags
	const toggleSaved = (item) => {
		setSaved((prev) =>
			prev.some((s) => s.key === item.key)
				? prev.filter((s) => s.key !== item.key)
				: [...prev, item],
		);
	};

	return (
		<SavedContext.Provider value={{ saved, isSaved, toggleSaved }}>
			{children}
		</SavedContext.Provider>
	);
};
