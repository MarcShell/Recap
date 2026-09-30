import { useEffect, useState } from 'react';
import axios from 'axios';
import './rightSide.scss';
import { FaCheck, FaTimes } from 'react-icons/fa';

const RightSide = () => {
	const [suggestions, setSuggestions] = useState([]);
	const [friends, setFriends] = useState([]);

	useEffect(() => {
		const controller = new AbortController();
		const opts = { withCredentials: true, signal: controller.signal };

		const loadData = async () => {
			try {
				const [usersRes, friendsRes] = await Promise.all([
					axios.get('http://localhost:8800/api/users', opts),
					axios.get('http://localhost:8800/api/relationships/friends', opts),
				]);
				setSuggestions(usersRes.data);
				setFriends(friendsRes.data);
			} catch (err) {
				if (err.name !== 'CanceledError') console.error(err);
			}
		};

		loadData();
		return () => controller.abort();
	}, []);

	const acceptSuggestion = async (user) => {
		try {
			await axios.post(
				'http://localhost:8800/api/relationships',
				{ followedUserId: user.id },
				{ withCredentials: true },
			);
			// Aus Suggestions entfernen, zu Friends hinzufügen
			setSuggestions((prev) => prev.filter((s) => s.id !== user.id));
			setFriends((prev) => [...prev, user]);
		} catch (err) {
			console.error(err);
		}
	};

	const declineSuggestion = (user) => {
		// Kein DB-Eintrag nötig, nur aus der UI-Liste entfernen
		setSuggestions((prev) => prev.filter((s) => s.id !== user.id));
	};

	const removeFriend = async (user) => {
		try {
			await axios.delete(`http://localhost:8800/api/relationships/${user.id}`, {
				withCredentials: true,
			});
			setFriends((prev) => prev.filter((f) => f.id !== user.id));
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="rightSide">
			<div className="container">
				<div className="item">
					<span>Suggestions for you</span>
					{suggestions.map((user) => (
						<div className="user" key={user.id}>
							<div className="userInfo">
								<img src="/profile-icon.png" alt="" />
								<span>{user.username}</span>
							</div>
							<div className="buttons">
								<button
									className="accept"
									onClick={() => acceptSuggestion(user)}
								>
									<FaCheck />
								</button>
								<button
									className="decline"
									onClick={() => declineSuggestion(user)}
								>
									<FaTimes />
								</button>
							</div>
						</div>
					))}
					<hr />
					<span>Friends</span>
					{friends.map((user) => (
						<div className="user" key={user.id}>
							<div className="userInfo">
								<img src="/profile-icon.png" alt="" />
								<div className="online" />
								<span>{user.username}</span>
							</div>
							<div className="buttons">
								<button className="decline" onClick={() => removeFriend(user)}>
									<FaTimes />
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default RightSide;
