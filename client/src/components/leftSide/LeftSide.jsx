import './leftSide.scss';
import { FaVideo, FaImages, FaBookmark, FaHome } from 'react-icons/fa';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { NavLink } from 'react-router';

const LeftSide = () => {
	const { currentUser } = useContext(AuthContext);

	return (
		<div className="leftSide">
			<div className="container">
				<div className="menu">
					<NavLink to="/" className="item">
						<FaHome />
						<span>Home</span>
					</NavLink>
					<NavLink to="/videos" className="item">
						<FaVideo />
						<span>Videos</span>
					</NavLink>
					<NavLink to="/images" className="item">
						<FaImages />
						<span>Images</span>
					</NavLink>
					<NavLink to="/saved" className="item">
						<FaBookmark />
						<span>Saved</span>
					</NavLink>
				</div>
			</div>
		</div>
	);
};

export default LeftSide;
