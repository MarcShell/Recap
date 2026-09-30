import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { DarkModeContextProvider } from './context/darkModeContext.jsx';
import { AuthContextProvider } from './context/authContext';
import { SavedContextProvider } from './context/savedContext.jsx';

// Sucht sich <div id="root"> aus index.html und rendert dort alles rein
// Die 3 Context-Provider halten einen State & stellen ihn anderen Dateien bereit
createRoot(document.getElementById('root')).render(
	<StrictMode>
		<DarkModeContextProvider>
			<AuthContextProvider>
				<SavedContextProvider>
					<App />
				</SavedContextProvider>
			</AuthContextProvider>
		</DarkModeContextProvider>
	</StrictMode>,
);
