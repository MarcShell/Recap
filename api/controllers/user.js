import { db } from '../db-connect.js';
import jwt from 'jsonwebtoken';

export const getUser = (req, res) => {};

export const getUsers = (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json('Not logged in!');

	jwt.verify(token, 'secretkey', (err, userInfo) => {
		if (err) return res.status(403).json('Token is not valid!');

		// Wählt alle User aus, außer den eingeloggten User
		const query = `SELECT id, username FROM users
                       WHERE id != ?
                       AND id NOT IN (
                           SELECT followedUserId FROM relationships WHERE followerUserId = ?
                       )`;

		db.query(query, [userInfo.id, userInfo.id], (err, data) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json(data);
		});
	});
};
