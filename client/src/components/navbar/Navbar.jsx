import './navbar.scss';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Link } from 'react-router';
import { DarkModeContext } from '../../context/darkModeContext';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { getProfileImage } from '../../getProfileImage';

const Navbar = () => {
	const { toggle, darkMode } = useContext(DarkModeContext);
	const { currentUser } = useContext(AuthContext);

	return (
		<div className="navbar">
			<div className="left">
				<Link to="/" className="logo-link">
					<img src="/logo.png" alt="" className="logo-img" />
					<span>Recap</span>
				</Link>
			</div>

			<div className="right">
				{darkMode ? <FaMoon onClick={toggle} /> : <FaSun onClick={toggle} />}
				<div className="user">
					<img src={getProfileImage(currentUser.profile)} alt="" />
					<span>{currentUser.username}</span>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
