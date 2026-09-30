import { db } from '../db-connect.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';

export const getPosts = (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json('Not logged in!');

	// Token entschlüsseln und prüfen, ob es gültig/nicht manipuliert ist
	jwt.verify(token, 'secretkey', (err, userInfo) => {
		if (err) return res.status(403).json('Token is not valid!');

		// Holt alle Posts vom eingeloggten User selbst + seinen Freunden sortiert nach neueste zuerst
		const query = `SELECT p.*, u.id AS userId, u.username, u.profile
                            FROM posts AS p
                            JOIN users AS u ON (u.id = p.userid)
                            LEFT JOIN relationships AS r ON (p.userid = r.followedUserId)
                            WHERE r.followerUserId = ? OR p.userid = ?
                            ORDER BY p.createdAt DESC`;

		// userInfo.id wird gesetzt für "wem folge ich" und für "meine eigenen Posts"
		db.query(query, [userInfo.id, userInfo.id], (err, data) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json(data);
		});
	});
};

export const addPost = (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json('Not logged in!');

	// Token entschlüsseln und prüfen, ob es gültig/nicht manipuliert ist
	jwt.verify(token, 'secretkey', (err, userInfo) => {
		if (err) return res.status(403).json('Token is not valid!');

		const query =
			'INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)';

		// Werte aus dem Post im Array vorbereiten
		const values = [
			req.body.desc,
			req.body.img,
			moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
			userInfo.id,
		];

		db.query(query, [values], (err, data) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json('Post was created');
		});
	});
};
