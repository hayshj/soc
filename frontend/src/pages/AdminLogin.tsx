import '../css/style.css';
import '../css/pages/adminLogin.css';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {

    //const [email, setEmail] = useState('');
    //const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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
                //body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('adminToken', data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid email or password');
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
                        <input type="text" id="username" name="username" className='input' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password" className='label'>Password</label>
                        <input type="password" id="password" name="password" className='input' required />
                    </div>
                    <button type="submit" id='loginButton'>Login</button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin;