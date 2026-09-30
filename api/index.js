import express from 'express';
import opn from 'better-opn';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import addRelationship from './routes/relationships.js';

const server = express();
const port = 8800;

// Middleware
server.use((req, res, next) => {
	res.header('Access-Control-Allow-Credentials', true); // Damit Browser Cookies bei Cross-Origin-Requests akzeptiert
	next();
});
server.use(express.json()); // Body automatisch als JSON parsen
server.use(
	cors({
		origin: 'http://localhost:5173', // erlaubt nur requests von dem vite-dev-server
		credentials: true, // Cookies/Credentials werden erlaubt
	}),
);
server.use(cookieParser());

// Routen: Alles aus der jeweiligen Router-Datei wird unter diesem Präfix erreichbar
server.use('/api/auth', authRoutes);
server.use('/api/users', userRoutes);
server.use('/api/posts', postRoutes);
server.use('/api/relationships', addRelationship);

// Startet den Server und öffnet danach automatisch einen Browser-Tab
const init = () => {
	server.listen(port, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log(`Server läuft auf Port ${port}`);
			opn(`http://localhost${port !== 8800 ? `:${port}` : ''}`);
		}
	});
};

init();
