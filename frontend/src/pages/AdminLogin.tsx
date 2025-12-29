import '../css/style.css';
import '../css/pages/adminLogin.css';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoEye, IoEyeOff } from 'react-icons/io5';

function AdminLogin() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8082/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('adminToken', data.token);
            navigate('/admin');
        } catch (err) {
            setError('Invalid username or password');
        }
    }

    return(
        <div id="loginPage">
            <Navbar />
            <div id='loginBlock'>
                <form onSubmit={handleLogin}>
                    <h1 id='loginTitle'>Admin Login</h1>
                    {error && <p className='error'>{error}</p>}
                    <div className="input-group">
                        <label htmlFor="username" className='label'>Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className='input'
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password" className='label'>Password</label>
                        <div className="password-field">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className='input'
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <IoEyeOff aria-hidden="true" /> : <IoEye aria-hidden="true" />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" id='loginButton'>Login</button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin;
