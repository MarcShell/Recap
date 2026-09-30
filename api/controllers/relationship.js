import { db } from '../db-connect.js';
import jwt from 'jsonwebtoken';

// Helper-Funktion: prüft das Cookie/JWT und ruft dann callback(userInfo) auf
const withAuth = (req, res, callback) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json('Not logged in!');

	jwt.verify(token, 'secretkey', (err, userInfo) => {
		if (err) return res.status(403).json('Token is not valid!');
		callback(userInfo);
	});
};

// Liefert alle Freunde des eingeloggten Users
export const getFriends = (req, res) => {
	withAuth(req, res, (userInfo) => {
		const query = `SELECT u.id, u.username
                       FROM relationships AS r
                       JOIN users AS u ON u.id = r.followedUserId
                       WHERE r.followerUserId = ?`;

		db.query(query, [userInfo.id], (err, data) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json(data);
		});
	});
};

// Freund hinzufügen in relationships Tabelle
export const addRelationship = (req, res) => {
	withAuth(req, res, (userInfo) => {
		const query =
			'INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)';
		const values = [userInfo.id, req.body.followedUserId];

		db.query(query, [values], (err, data) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json('Relationship created');
		});
	});
};

// Freunde entfernen
export const removeRelationship = (req, res) => {
	withAuth(req, res, (userInfo) => {
		const query =
			'DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?';

		db.query(query, [userInfo.id, req.params.userId], (err, data) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json('Relationship deleted');
		});
	});
};
