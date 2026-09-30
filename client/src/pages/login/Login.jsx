import { Link, useNavigate } from 'react-router';
import './login.scss';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useState } from 'react';

const Login = () => {
	// Speichert die Eingabe
	const [inputs, setInputs] = useState({
		username: '',
		password: '',
	});
	const [err, setErr] = useState(null);

	const navigate = useNavigate();

	// Bei jedem Tastendruck wird die Eingabe aktualisiert
	const handleChange = (e) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};
	const { login } = useContext(AuthContext);

	const handleLogin = async (e) => {
		// Seite nicht neuladen
		e.preventDefault();

		try {
			await login(inputs);
			navigate('/');
		} catch (err) {
			setErr(err.response.data);
		}
	};

	return (
		<div className="login">
			<div className="card">
				<div className="left">
					<h1 className="logo">Recap</h1>

					<div className="middle">
						<h2>Login</h2>
						<form>
							<input
								type="text"
								placeholder="Username"
								name="username"
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
						<button onClick={handleLogin}>Login</button>
					</div>

					<span className="footer">© 2026 Recap. All Rights Reserved</span>
				</div>

				<div className="right">
					<div className="logo-spacer" />

					<div className="middle">
						<p>
							Halte deine schönsten Momente fest und teile sie ganz einfach mit
							den Menschen, die dir wichtig sind.
						</p>

						<div className="register-block">
							<span>Du hast noch keinen Account?</span>
							<Link to="/register">
								<button>Register</button>
							</Link>
						</div>
					</div>

					<span className="footer-spacer" />
				</div>
			</div>
		</div>
	);
};

export default Login;
