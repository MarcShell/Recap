import Login from './pages/login/Login';
import Register from './pages/register/Register';
import {
	createBrowserRouter,
	RouterProvider,
	Outlet,
	Navigate,
} from 'react-router';
import Navbar from './components/navbar/Navbar';
import LeftSide from './components/leftSide/LeftSide';
import RightSide from './components/rightSide/RightSide';
import Content from './pages/content/Content';
import './style.scss';
import { useContext } from 'react';
import { DarkModeContext } from './context/darkModeContext';
import { AuthContext } from './context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VideoGrid from './components/videoGrid/VideoGrid';
import ImageGrid from './components/imageGrid/ImageGrid';
import Saved from './components/saved/Saved';

function App() {
	const { currentUser } = useContext(AuthContext);
	const { darkMode } = useContext(DarkModeContext);
	const queryClient = new QueryClient();

	const Layout = () => {
		return (
			// Zentrale Datei für Struktur und Navigation, Navbar, LeftSide und RightSide sind immer da
			<QueryClientProvider client={queryClient}>
				<div className={`${darkMode ? 'dark' : 'light'}-theme`}>
					<Navbar />
					<div style={{ display: 'flex' }}>
						<LeftSide />

						{/* Was in Outlet steht, wechselt je nachdem zu Content/ImageGrid/VideoGrid */}
						<div style={{ flex: 6 }} className="home">
							<Outlet />
						</div>

						<RightSide />
					</div>
				</div>
			</QueryClientProvider>
		);
	};

	// ProtectedRoute prüft ob man eingeloggt ist, leitet sonst zu /login weiter
	const ProtectedRoute = ({ children }) => {
		if (!currentUser) {
			return <Navigate to="/login" />;
		}

		return children;
	};

	// Router ordnet die URLs den Komponenten zu, alles bei children landet im Outlet
	// login und register sind immer erreichbar
	const router = createBrowserRouter([
		{
			path: '/',
			element: (
				<ProtectedRoute>
					<Layout />
				</ProtectedRoute>
			),
			children: [
				{
					path: '/',
					element: <Content />,
				},
				{
					path: '/images',
					element: <ImageGrid />,
				},
				{
					path: '/videos',
					element: <VideoGrid />,
				},
				{
					path: '/saved',
					element: <Saved />,
				},
			],
		},
		{
			path: '/login',
			element: <Login />,
		},
		{
			path: '/register',
			element: <Register />,
		},
	]);

	return (
		<div>
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
