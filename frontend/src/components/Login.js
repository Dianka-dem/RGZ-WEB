import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem('user', email);
    navigate('/videos');
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ width: '100%', padding: 8, marginBottom: 15 }}
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ width: '100%', padding: 8, marginBottom: 15 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10, backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          Войти
        </button>
      </form>
      <p style={{ marginTop: 15 }}><a href="/register">Регистрация</a></p>
    </div>
  );
}

export default Login;
