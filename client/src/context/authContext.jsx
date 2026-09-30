import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

// Erstellt Context, kann von anderen Dateien aufgerufen werden
export const AuthContext = createContext();

// Initialisiert den State currentUser, schaut beim ersten Laden ob User gespeichert ist
export const AuthContextProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(
		JSON.parse(localStorage.getItem('user')) || null,
	);

	// Schickt Login-Daten per POST ans Backend
	const login = async (inputs) => {
		const res = await axios.post(
			'http://localhost:8800/api/auth/login',
			inputs,
			{
				withCredentials: true,
			},
		);

		// Speichert die User-Daten aus der Server-Antwort
		setCurrentUser(res.data);
	};

	// Bei jeder Änderung von currentUser wird localStorage aktualisiert
	useEffect(() => {
		localStorage.setItem('user', JSON.stringify(currentUser));
	}, [currentUser]);

	return (
		<AuthContext.Provider value={{ currentUser, login }}>
			{children}
		</AuthContext.Provider>
	);
};
