import { createContext, useEffect, useState } from 'react';

// Erstellt Context, kann von anderen Dateien aufgerufen werden
export const DarkModeContext = createContext();

// Initialisiert den boolean-State currentUser, wenn Wert vorhanden ist, wird dieser genommen, sonst false -> light-theme
export const DarkModeContextProvider = ({ children }) => {
	const [darkMode, setDarkMode] = useState(
		JSON.parse(localStorage.getItem('darkMode')) || false,
	);

	// boolean umkehren
	const toggle = () => {
		setDarkMode(!darkMode);
	};

	// Bei jeder Änderung von darkMode localStorage aktualisieren
	useEffect(() => {
		localStorage.setItem('darkMode', darkMode);
	}, [darkMode]);

	return (
		<DarkModeContext.Provider value={{ darkMode, toggle }}>
			{children}
		</DarkModeContext.Provider>
	);
};
