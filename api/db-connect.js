import mysql from 'mysql';

export const db = mysql.createConnection({
	host: 'host',
	user: 'user',
	password: 'password',
	database: 'database',
});
