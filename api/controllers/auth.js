import { db } from '../db-connect.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {
	const query = 'SELECT * FROM users WHERE username = ?'; // Prüfen, ob der Username schon vergeben ist

	db.query(query, [req.body.username], (err, data) => {
		if (err) return res.status(500).json(err);
		if (data.length) return res.status(409).json('User already exists');

		// Password verschlüsseln
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(req.body.password, salt);

		// Neuen User mit gehashtem Passwort in die DB einfügen
		const query =
			'INSERT INTO users (`username`, `email`, `password`) VALUES (?)';
		const values = [req.body.username, req.body.email, hashedPassword];

		db.query(query, [values], (err, data) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json('User successfully created');
		});
	});
};

export const login = (req, res) => {
	const query = 'SELECT * FROM users WHERE username = ?'; // User durch seinen Username in der DB suchen

	db.query(query, [req.body.username], (err, data) => {
		if (err) return res.status(500).json(err);
		if (data.length === 0) return res.status(404).json('User not found');

		// Eingegebenes Passwort mit dem Hash aus der DB vergleichen
		const checkPassword = bcrypt.compareSync(
			req.body.password,
			data[0].password,
		);

		if (!checkPassword) return res.status(400).json('Wrong login data');

		const token = jwt.sign({ id: data[0].id }, 'secretkey'); // Login erfolgreich -> JSON Web Token erstellen

		const { password, ...others } = data[0]; // Passwort-Hash aus dem Antwort-Objekt entfernen

		res
			.cookie('accessToken', token, {
				httpOnly: true,
			})
			.status(200)
			.json(others);
	});
};

export const logout = (req, res) => {
	res
		.clearCookie('accessToken', {
			// JWT-Cookie wird gelöscht, logout vom User
			secure: true,
			sameSite: 'none',
		})
		.status(200)
		.json('User logged out');
};
