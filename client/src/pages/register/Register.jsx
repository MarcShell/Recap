import { Link } from 'react-router';
import './register.scss';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Register = () => {
	// Speichert Eingabe des Users
	const [inputs, setInputs] = useState({
		username: '',
		email: '',
		password: '',
	});

	const [err, setErr] = useState(null);

	// Aktualisiert im State genau das Eingabefeld, in dem gerade getippt wurde
	const handleChange = (e) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const navigate = useNavigate();

	const handleClick = async (e) => {
		e.preventDefault(); // Beim Klick nicht Seite neuladen

		try {
			await axios.post('http://localhost:8800/api/auth/register', inputs); // Schickt die Eingabedaten an das Backend, das einen neuen User in der DB anlegt

			// Registrierung erfolgreich → zum Login weiterleiten
			navigate('/login');
		} catch (err) {
			setErr(err.response.data);
		}
	};

	return (
		<div className="register">
			<div className="card">
				<div className="left">
					<div className="logo-spacer" />

					<div className="middle">
						<p>
							Erstelle deinen Account und starte noch heute damit, deine besten
							Momente festzuhalten und zu teilen.
						</p>

						<div className="login-block">
							<span>Du hast schon einen Account?</span>
							<Link to="/login">
								<button>Login</button>
							</Link>
						</div>
					</div>

					<span className="footer-spacer" />
				</div>

				<div className="right">
					<h1 className="logo">Recap</h1>

					<div className="middle">
						<h2>Register</h2>
						<form>
							<input
								type="text"
								placeholder="Username"
								name="username"
								onChange={handleChange}
							/>
							<input
								type="email"
								placeholder="Email"
								name="email"
								onChange={handleChange}
							/>
							<input
								type="password"
								placeholder="Password"
								name="password"
								onChange={handleChange}
							/>
						</form>
						{err && <span className="error">{err}</span>}
						<Link to="/login">
							<button onClick={handleClick}>Register</button>
						</Link>
					</div>

					<span className="footer">© 2026 Recap. All Rights Reserved</span>
				</div>
			</div>
		</div>
	);
};

export default Register;
