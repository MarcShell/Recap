import './content.scss';
import Posts from '../../components/posts/Posts';
import Share from '../../components/share/Share';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { DarkModeContext } from '../../context/darkModeContext';

const Home = () => {
	const { currentUser } = useContext(AuthContext);
	const { darkMode } = useContext(DarkModeContext);
	return (
		<>
			<div className="graphicBanner">
				<img
					src={darkMode ? '/illustration-dark.png' : '/illustration.png'}
					alt="Welcome"
				/>
				<h2>
					Willkommen zurück, <span>{currentUser.username}!</span>
				</h2>
				<p>Schau, was deine Freunde gerade teilen.</p>
			</div>
			<Share />
			<Posts />
		</>
	);
};

export default Home;
